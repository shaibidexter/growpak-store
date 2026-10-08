import { prisma } from '../../config/db';
import { BadRequestError, NotFoundError } from '../../common/errors/app-error';
import { UserRoleType } from '@growpak/shared';
import { AuditService } from '../audit/audit.service';

export class RbacService {
  public async getRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  public async getPermissions() {
    return prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { key: 'asc' }],
    });
  }

  public async updateRolePermissions(roleId: number, permissionIds: number[], operatorId?: bigint) {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundError('Role not found');

    if (role.slug === UserRoleType.SUPER_ADMIN) {
      throw new BadRequestError('Super Admin role permissions are immutable');
    }

    const previousPermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });

    await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });

      const records = permissionIds.map((pId) => ({
        roleId,
        permissionId: pId,
      }));

      if (records.length > 0) {
        await tx.rolePermission.createMany({ data: records });
      }
    });

    await AuditService.log({
      userId: operatorId,
      action: 'UPDATE_ROLE_PERMISSIONS',
      entityType: 'ROLE',
      entityId: roleId.toString(),
      oldValues: previousPermissions.map((p) => p.permissionId),
      newValues: permissionIds,
    });

    return this.getRoles();
  }

  public async convertUserRole(params: {
    userId: bigint;
    targetRoleType: UserRoleType;
    vendorId?: bigint;
    managerId?: bigint;
    operatorId?: bigint;
  }) {
    const user = await prisma.user.findUnique({ where: { id: params.userId } });
    if (!user) throw new NotFoundError('User not found');

    const role = await prisma.role.findUnique({ where: { slug: params.targetRoleType } });
    if (!role) throw new NotFoundError(`Target role '${params.targetRoleType}' does not exist`);

    await prisma.$transaction(async (tx) => {
      // Upsert UserRole mapping
      await tx.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });

      // Handle Store Manager or Field Agent assignment to vendor shop
      if (params.targetRoleType === UserRoleType.STORE_MANAGER || params.targetRoleType === UserRoleType.FIELD_AGENT) {
        if (!params.vendorId) {
          throw new BadRequestError(`${params.targetRoleType} must be assigned to a vendor shop (vendorId is required)`);
        }

        const vendor = await tx.vendor.findUnique({ where: { id: params.vendorId } });
        if (!vendor) throw new NotFoundError('Target vendor shop not found');

        if (params.targetRoleType === UserRoleType.FIELD_AGENT && params.managerId) {
          const manager = await tx.user.findUnique({ where: { id: params.managerId } });
          if (!manager) throw new NotFoundError('Assigned Store Manager user not found');
        }

        await tx.vendorStaff.upsert({
          where: {
            vendorId_userId_roleType: {
              vendorId: params.vendorId,
              userId: user.id,
              roleType: params.targetRoleType,
            },
          },
          update: {
            managerId: params.managerId ?? null,
            isActive: true,
          },
          create: {
            vendorId: params.vendorId,
            userId: user.id,
            roleType: params.targetRoleType,
            managerId: params.managerId ?? null,
            isActive: true,
          },
        });
      }
    });

    await AuditService.log({
      userId: params.operatorId,
      action: 'CONVERT_USER_ROLE',
      entityType: 'USER',
      entityId: params.userId.toString(),
      newValues: {
        role: params.targetRoleType,
        vendorId: params.vendorId?.toString(),
        managerId: params.managerId?.toString(),
      },
    });

    return {
      userId: user.id.toString(),
      assignedRole: params.targetRoleType,
      vendorId: params.vendorId?.toString(),
      managerId: params.managerId?.toString(),
    };
  }
}

export const rbacService = new RbacService();
