import { dataStore } from '../database/inMemoryStore.js';
import { UnauthorizedError } from '../shared/errors/AppError.js';

export function authMiddleware(req, res, next) {
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

    if (!user) {
      throw new UnauthorizedError('User session could not be authenticated');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
