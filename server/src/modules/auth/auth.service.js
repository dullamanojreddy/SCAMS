import { authRepository } from './auth.repository.js';
import { UnauthorizedError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { config } from '../../config/env.js';
import { createPersistentUser, verifyPersistentUser } from '../../database/persistence.js';

export class AuthService {
  async getCurrentUser(userId) {
    const user = authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async login(emailOrStudentId, password) {
    const persistentUser = await verifyPersistentUser(emailOrStudentId, password);
    if (persistentUser) {
      const token = `cos_jwt_${persistentUser.id}_${Date.now()}`;
      return {
        user: persistentUser,
        tokens: { accessToken: token, refreshToken: token, expiresIn: config.jwt.accessExpiresIn },
      };
    }

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

  async register({ campusId, name, email, password, role, department, branch, academicYear, section }) {
    if (!campusId || !name || !email || !password || !role || !department) {
      throw new ValidationError('Campus ID, name, email, password, role, and department are required');
    }

    if (!['STUDENT', 'FACULTY', 'ADMIN'].includes(role)) {
      throw new ValidationError('Role must be STUDENT, FACULTY, or ADMIN');
    }

    try {
      return await createPersistentUser({
        campusId,
        name,
        email: email.toLowerCase(),
        password,
        role,
        department,
        branch,
        academicYear,
        section,
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ValidationError('Campus ID or email is already registered');
      }
      throw error;
    }
  }
}

export const authService = new AuthService();
