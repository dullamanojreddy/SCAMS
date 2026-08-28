import { authService } from './auth.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class AuthController {
  async getMe(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return ApiResponse.success(res, user, 'Authenticated profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, studentId, password } = req.body;
      const identifier = email || studentId || 'usr_manoj_1';
      const result = await authService.login(identifier, password);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const result = await authService.logout(req.user?.id);
      return ApiResponse.success(res, result, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
