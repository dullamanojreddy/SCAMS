import { Router } from 'express';
import { dataStore } from '../../database/inMemoryStore.js';
import { persistFeedback } from '../../database/persistence.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { ApiResponse } from '../../shared/utils/response.js';

const router = Router();

router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const fb = {
      id: `fb-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      rating: Number(rating) || 5,
      comment: String(comment || ''),
      createdAt: new Date().toISOString(),
    };
    dataStore.feedbacks.unshift(fb);
    persistFeedback(fb);
    return ApiResponse.success(res, fb, 'Thank you for your campus feedback!', 201);
  } catch (error) {
    next(error);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const list = dataStore.feedbacks.filter((f) => f.userId === req.user.id);
    return ApiResponse.success(res, list, 'User feedback history');
  } catch (error) {
    next(error);
  }
});

router.get('/admin', requireRole('ADMIN'), async (req, res, next) => {
  try {
    return ApiResponse.success(res, dataStore.feedbacks, 'All campus feedbacks');
  } catch (error) {
    next(error);
  }
});

export default router;
