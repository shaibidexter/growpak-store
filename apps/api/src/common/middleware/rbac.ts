import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/app-error';
import { UserRoleType } from '@growpak/shared';

export const authorize = (permissionKey: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    // Super Admin has full bypass
    if (req.user.roles.includes(UserRoleType.SUPER_ADMIN)) {
      return next();
    }

    if (!req.user.permissions.includes(permissionKey)) {
      return next(new ForbiddenError(`Permission denied: Missing '${permissionKey}'`));
    }

    next();
  };
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (req.user.roles.includes(UserRoleType.SUPER_ADMIN)) {
      return next();
    }

    const hasRole = req.user.roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return next(new ForbiddenError('Access restricted to specified roles'));
    }

    next();
  };
};
