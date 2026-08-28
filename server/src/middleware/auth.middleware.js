import { dataStore } from '../database/inMemoryStore.js';
import { UnauthorizedError } from '../shared/errors/AppError.js';
import { findPersistentUser } from '../database/persistence.js';

export async function authMiddleware(req, res, next) {
  try {
    // In our single-tenant campus environment, resolve current authenticated user or header override
    const authHeader = req.headers.authorization;
    const userIdHeader = req.headers['x-user-id'];

    let user = dataStore.currentUser;

    if (userIdHeader) {
      const found = dataStore.users.find((u) => u.id === userIdHeader);
      if (found) user = found;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // If token matches user ID directly or mock token
      const found = dataStore.users.find((u) => token.includes(u.id));
      if (found) user = found;
    }

    if (userIdHeader || authHeader?.startsWith('Bearer ')) {
      const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      const persistentUser = await findPersistentUser({
        userId: userIdHeader || (token && token.length === 36 ? token : null),
        email: token?.includes('@') ? token : null,
        campusId: userIdHeader,
      });
      if (persistentUser) {
        user = {
          id: persistentUser.id,
          name: persistentUser.full_name,
          email: persistentUser.email,
          role: persistentUser.role,
          studentId: persistentUser.roll_or_emp_id,
          department: persistentUser.department,
          branch: persistentUser.branch,
          campusPoints: persistentUser.campus_points,
          isVerifiedSenior: persistentUser.is_verified_senior,
        };
      }
    }

    if (!user) {
      throw new UnauthorizedError('User session could not be authenticated');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
