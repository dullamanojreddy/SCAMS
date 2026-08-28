import { ForbiddenError, UnauthorizedError } from '../shared/errors/AppError.js';
import { ROLE_PERMISSIONS } from '../shared/constants/roles.js';

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (allowedRoles.includes('*') || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return next(
      new ForbiddenError(
        `Role '${req.user.role}' is not authorized to access this resource. Required: [${allowedRoles.join(', ')}]`
      )
    );
  };
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      return next();
    }

    return next(
      new ForbiddenError(`Missing required permission '${permission}' for role '${req.user.role}'`)
    );
  };
}
