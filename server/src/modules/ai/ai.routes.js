import { Router } from 'express';
import { aiController } from './ai.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { rateLimit } from '../../middleware/rate-limit.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/chat', rateLimit(30, 60000), (req, res, next) => aiController.chat(req, res, next));
router.post('/actions/:actionId/confirm', (req, res, next) => aiController.confirmAction(req, res, next));
router.post('/actions/:actionId/cancel', (req, res, next) => aiController.cancelAction(req, res, next));

export default router;
