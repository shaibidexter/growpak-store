import { Router } from 'express';
import { rbacController } from './rbac.controller';
import { authenticate } from '../../common/middleware/auth';
import { authorize } from '../../common/middleware/rbac';
import { PERMISSIONS } from '@growpak/shared';
import { asyncHandler } from '../../common/utils/async-handler';

const router = Router();

router.use(authenticate);

router.get('/roles', asyncHandler(rbacController.getRoles));
router.get('/permissions', asyncHandler(rbacController.getPermissions));
router.put('/roles/:id/permissions', authorize(PERMISSIONS.ROLES_PERMISSIONS_MANAGE), asyncHandler(rbacController.updateRolePermissions));
router.post('/users/:userId/convert-role', authorize(PERMISSIONS.STAFF_ASSIGN_MANAGER), asyncHandler(rbacController.convertUserRole));

export default router;
