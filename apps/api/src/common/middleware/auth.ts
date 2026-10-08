import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedError } from '../errors/app-error';
import { prisma } from '../../config/db';

export interface AuthUser {
  id: bigint;
  email: string | null;
  phone: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  vendorId?: bigint;
  storeManagerId?: bigint;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('No authentication token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string };
    const userId = BigInt(payload.sub);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        vendor: { select: { id: true } },
        staffProfiles: {
          where: { isActive: true },
          select: { vendorId: true, roleType: true, managerId: true },
        },
      },
    });

    if (!user || !user.isActive) {
      return next(new UnauthorizedError('Account is inactive or no longer exists'));
    }

    const roles: string[] = [];
    const permissionsSet = new Set<string>();

    for (const ur of user.userRoles) {
      roles.push(ur.role.slug);
      for (const rp of ur.role.permissions) {
        permissionsSet.add(rp.permission.key);
      }
    }

    // Determine vendor association
    let vendorId: bigint | undefined = user.vendor?.id;
    let storeManagerId: bigint | undefined;

    if (!vendorId && user.staffProfiles.length > 0) {
      const activeStaff = user.staffProfiles[0];
      vendorId = activeStaff.vendorId;
      if (activeStaff.managerId) {
        storeManagerId = activeStaff.managerId;
      }
    }

    req.user = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      permissions: Array.from(permissionsSet),
      vendorId,
      storeManagerId,
    };

    next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired authentication token'));
  }
};
