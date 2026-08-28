import { Router } from 'express';
import { notificationService } from './notifications.service.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { ApiResponse } from '../../shared/utils/response.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const list = await notificationService.getUserNotifications(req.user.id);
    return ApiResponse.success(res, list, 'User notifications retrieved');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/read', async (req, res, next) => {
  try {
    const updated = await notificationService.markAsRead(req.params.id, req.user.id);
    return ApiResponse.success(res, updated, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
});

router.post('/read-all', async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    return ApiResponse.success(res, result, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
});

export default router;
