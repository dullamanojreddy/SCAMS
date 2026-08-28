import { Router } from 'express';
import { mapController } from './map.controller.js';

const router = Router();

router.get('/', (req, res, next) => mapController.getOverview(req, res, next));
router.get('/route', (req, res, next) => mapController.getRoute(req, res, next));

export default router;
