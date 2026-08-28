import { Router } from 'express';
import { noticeController } from './notices.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { getPostgresPool } from '../../database/postgresClient.js';
import { ApiResponse } from '../../shared/utils/response.js';

const router = Router();

router.get('/', (req, res, next) => noticeController.getNotices(req, res, next));
router.get('/:id', (req, res, next) => noticeController.getNoticeById(req, res, next));

router.post('/', authMiddleware, requireRole('FACULTY', 'ADMIN'), (req, res, next) =>
  noticeController.createNotice(req, res, next)
);
router.delete('/:id', authMiddleware, requireRole('FACULTY', 'ADMIN'), async (req, res, next) => {
  try {
    await getPostgresPool().query('UPDATE notices SET is_retracted = TRUE WHERE id = $1::uuid', [req.params.id]);
    return ApiResponse.success(res, { id: req.params.id }, 'Notice retracted');
  } catch (error) {
    next(error);
  }
});

export default router;
