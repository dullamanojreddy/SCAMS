import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { rateLimit } from '../../middleware/rate-limit.middleware.js';

const router = Router();

router.post('/login', rateLimit(10, 60000), (req, res, next) => authController.login(req, res, next));
router.post('/register', rateLimit(5, 60000), (req, res, next) => authController.register(req, res, next));
router.get('/me', authMiddleware, (req, res, next) => authController.getMe(req, res, next));
router.post('/logout', authMiddleware, (req, res, next) => authController.logout(req, res, next));

export default router;
