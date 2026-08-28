import { Router } from 'express';
import { campusController } from './campus.controller.js';

const router = Router();

router.get('/buildings', (req, res, next) => campusController.getBuildings(req, res, next));
router.get('/buildings/:id', (req, res, next) => campusController.getBuildingById(req, res, next));
router.get('/rooms', (req, res, next) => campusController.getRooms(req, res, next));
router.get('/rooms/:id', (req, res, next) => campusController.getRoomById(req, res, next));
router.get('/search', (req, res, next) => campusController.search(req, res, next));

export default router;
