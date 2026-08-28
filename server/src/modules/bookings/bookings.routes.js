import { Router } from 'express';
import { bookingController } from './bookings.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { rateLimit } from '../../middleware/rate-limit.middleware.js';

const router = Router();

router.get('/resources', (req, res, next) => bookingController.getResources(req, res, next));
router.get('/resources/:id/availability', (req, res, next) => bookingController.getAvailability(req, res, next));

router.use(authMiddleware);

router.get('/me', (req, res, next) => bookingController.getMyBookings(req, res, next));
router.post('/', rateLimit(20, 60000), (req, res, next) => bookingController.createBooking(req, res, next));
router.post('/:id/cancel', (req, res, next) => bookingController.cancelBooking(req, res, next));

export default router;
