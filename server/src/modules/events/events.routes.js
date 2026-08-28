import { Router } from 'express';
import { eventController } from './events.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { rateLimit } from '../../middleware/rate-limit.middleware.js';

const router = Router();

router.get('/', (req, res, next) => eventController.getEvents(req, res, next));
router.get('/:id', (req, res, next) => eventController.getEventById(req, res, next));

router.use(authMiddleware);
router.post('/:id/register', rateLimit(30, 60000), (req, res, next) => eventController.register(req, res, next));
router.post('/:id/cancel-registration', (req, res, next) => eventController.cancelRegistration(req, res, next));

export default router;
