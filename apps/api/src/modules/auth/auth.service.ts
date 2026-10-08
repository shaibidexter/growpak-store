import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { BadRequestError, ConflictError, UnauthorizedError } from '../../common/errors/app-error';
import { AuthTokens, AuthUserResponse, LoginResult, TokenPayload } from './auth.types';
import { UserRoleType } from '@growpak/shared';
import { AuditService } from '../audit/audit.service';

export class AuthService {
  public async register(dto: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    password: string;
    isVendorApplication?: boolean;
    storeName?: string;
    ipAddress?: string;
  }): Promise<LoginResult> {
    // Check if phone or email already taken
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: dto.phone },
          ...(dto.email ? [{ email: dto.email }] : []),
        ],
      },
    });

    if (existing) {
      throw new ConflictError('A user with this phone or email already exists');
    }

    const passwordHash = await argon2.hash(dto.password);

    // Resolve Customer role ID
    const customerRole = await prisma.role.findUnique({
      where: { slug: UserRoleType.CUSTOMER },
    });
    if (!customerRole) {
      throw new BadRequestError('Customer role is not configured in database');
    }

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          email: dto.email,
          passwordHash,
          isActive: true,
        },
      });

      // Assign Customer role by default
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: customerRole.id,
        },
      });

      // If applying as vendor, register vendor store record in PENDING status
      if (dto.isVendorApplication && dto.storeName) {
        const vendorRole = await tx.role.findUnique({ where: { slug: UserRoleType.VENDOR } });
        if (vendorRole) {
          await tx.userRole.create({
            data: {
              userId: user.id,
              roleId: vendorRole.id,
            },
          });
        }

        const slug = dto.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await tx.vendor.create({
          data: {
            userId: user.id,
            storeName: dto.storeName,
            slug: `${slug}-${Date.now()}`,
            phone: dto.phone,
            email: dto.email || `${slug}@growpak.store`,
            status: 'PENDING',
          },
        });
      }

      return user;
    });

    await AuditService.log({
      userId: newUser.id,
      action: 'USER_REGISTERED',
      entityType: 'USER',
      entityId: newUser.id.toString(),
      ipAddress: dto.ipAddress,
    });

    return this.generateAuthResult(newUser.id);
  }

  public async login(loginIdentifier: string, password: string, ipAddress?: string): Promise<LoginResult> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: loginIdentifier },
          { email: loginIdentifier },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account has been deactivated');
    }

    const isValid = await argon2.verify(user.passwordHash, password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    await AuditService.log({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id.toString(),
      ipAddress,
    });

    return this.generateAuthResult(user.id);
  }

  public async refreshToken(token: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
      const userId = BigInt(payload.sub);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { userRoles: { include: { role: true } } },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User session expired or user deactivated');
      }

      const roles = user.userRoles.map((ur) => ur.role.slug);
      return this.generateTokens(user.id, roles);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  public async getProfile(userId: bigint): Promise<AuthUserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: { include: { permission: true } },
              },
            },
          },
        },
        vendor: { select: { id: true } },
        staffProfiles: {
          where: { isActive: true },
          select: { vendorId: true, managerId: true },
        },
      },
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const roles: string[] = [];
    const permissionsSet = new Set<string>();

    for (const ur of user.userRoles) {
      roles.push(ur.role.slug);
      for (const rp of ur.role.permissions) {
        permissionsSet.add(rp.permission.key);
      }
    }

    let vendorId = user.vendor?.id?.toString();
    let storeManagerId: string | undefined;

    if (!vendorId && user.staffProfiles.length > 0) {
      vendorId = user.staffProfiles[0].vendorId.toString();
      if (user.staffProfiles[0].managerId) {
        storeManagerId = user.staffProfiles[0].managerId.toString();
      }
    }

    return {
      id: user.id.toString(),
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      permissions: Array.from(permissionsSet),
      vendorId,
      storeManagerId,
    };
  }

  private async generateAuthResult(userId: bigint): Promise<LoginResult> {
    const profile = await this.getProfile(userId);
    const tokens = this.generateTokens(userId, profile.roles);
    return { user: profile, tokens };
  }

  private generateTokens(userId: bigint, roles: string[]): AuthTokens {
    const payload: TokenPayload = {
      sub: userId.toString(),
      roles,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRATION as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRATION as any,
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: env.JWT_ACCESS_EXPIRATION,
    };
  }
}

export const authService = new AuthService();
