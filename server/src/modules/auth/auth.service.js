import { authRepository } from './auth.repository.js';
import { UnauthorizedError, NotFoundError } from '../../shared/errors/AppError.js';
import { config } from '../../config/env.js';

export class AuthService {
  async getCurrentUser(userId) {
    const user = authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async login(emailOrStudentId, password) {
    // In Campus OS prototype, authenticate against registered campus directory
    const user =
      authRepository.findByEmail(emailOrStudentId) ||
      authRepository.findByStudentId(emailOrStudentId);

    if (!user) {
      throw new UnauthorizedError('Invalid campus credentials');
    }

    const token = `cos_jwt_${user.id}_${Date.now()}`;
    const refreshToken = `cos_refresh_${user.id}_${Date.now()}`;

    return {
      user,
      tokens: {
        accessToken: token,
        refreshToken,
        expiresIn: config.jwt.accessExpiresIn,
      },
    };
  }

  async logout(userId) {
    return { loggedOut: true };
  }
}

export const authService = new AuthService();
