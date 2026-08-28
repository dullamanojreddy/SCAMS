import { Router } from 'express';
import { timetableController } from './timetable.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', (req, res, next) => timetableController.getTimetable(req, res, next));
router.get('/me', authMiddleware, (req, res, next) => timetableController.getTimetable(req, res, next));
router.get('/me/today', authMiddleware, (req, res, next) => timetableController.getToday(req, res, next));
router.get('/me/next', authMiddleware, (req, res, next) => timetableController.getNext(req, res, next));

export default router;
