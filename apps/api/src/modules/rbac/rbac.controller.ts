import { Request, Response } from 'express';
import { rbacService } from './rbac.service';
import { sendSuccess } from '../../common/utils/response';

export class RbacController {
  public async getRoles(_req: Request, res: Response) {
    const roles = await rbacService.getRoles();
    return sendSuccess(res, roles, 'Roles retrieved');
  }

  public async getPermissions(_req: Request, res: Response) {
    const permissions = await rbacService.getPermissions();
    return sendSuccess(res, permissions, 'Permissions retrieved');
  }

  public async updateRolePermissions(req: Request, res: Response) {
    const roleId = parseInt(String(req.params.id), 10);
    const { permissionIds } = req.body;
    const result = await rbacService.updateRolePermissions(roleId, permissionIds, req.user?.id);
    return sendSuccess(res, result, 'Role permissions updated');
  }

  public async convertUserRole(req: Request, res: Response) {
    const userId = BigInt(String(req.params.userId));
    const { targetRoleType, vendorId, managerId } = req.body;
    const result = await rbacService.convertUserRole({
      userId,
      targetRoleType,
      vendorId: vendorId ? BigInt(vendorId) : undefined,
      managerId: managerId ? BigInt(managerId) : undefined,
      operatorId: req.user?.id,
    });
    return sendSuccess(res, result, 'User role successfully converted');
  }
}

export const rbacController = new RbacController();
