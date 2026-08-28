import { Router } from 'express';
import { orderController } from './orders.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { rateLimit } from '../../middleware/rate-limit.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/me', (req, res, next) => orderController.getMyOrders(req, res, next));
router.get('/:id', (req, res, next) => orderController.getOrderById(req, res, next));
router.post('/', rateLimit(30, 60000), (req, res, next) => orderController.createOrder(req, res, next));
router.post('/:id/cancel', (req, res, next) => orderController.cancelOrder(req, res, next));

// Vendor actions
router.post('/:id/accept', requireRole('VENDOR', 'ADMIN'), (req, res, next) => orderController.acceptOrder(req, res, next));
router.post('/:id/prepare', requireRole('VENDOR', 'ADMIN'), (req, res, next) => orderController.prepareOrder(req, res, next));
router.post('/:id/ready', requireRole('VENDOR', 'ADMIN'), (req, res, next) => orderController.readyOrder(req, res, next));
router.post('/:id/pickup', (req, res, next) => orderController.pickupOrder(req, res, next));
router.post('/:id/complete', requireRole('VENDOR', 'ADMIN'), (req, res, next) => orderController.completeOrder(req, res, next));

export default router;
