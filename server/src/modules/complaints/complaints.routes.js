import { Router } from 'express';
import { complaintController } from './complaints.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { rateLimit } from '../../middleware/rate-limit.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => complaintController.getComplaints(req, res, next));
router.get('/:id', (req, res, next) => complaintController.getComplaintById(req, res, next));
router.post('/', rateLimit(20, 60000), (req, res, next) => complaintController.createComplaint(req, res, next));
router.post('/:id/resolve', requireRole('MAINTENANCE', 'ADMIN'), (req, res, next) => complaintController.resolveComplaint(req, res, next));

export default router;
