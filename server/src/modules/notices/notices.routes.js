import { Router } from 'express';
import { noticeController } from './notices.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

router.get('/', (req, res, next) => noticeController.getNotices(req, res, next));
router.get('/:id', (req, res, next) => noticeController.getNoticeById(req, res, next));

router.post('/', authMiddleware, requireRole('FACULTY', 'ADMIN'), (req, res, next) =>
  noticeController.createNotice(req, res, next)
);

export default router;
