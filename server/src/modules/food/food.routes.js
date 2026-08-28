import { Router } from 'express';
import { foodController } from './food.controller.js';

const router = Router();

router.get('/vendors', (req, res, next) => foodController.getVendors(req, res, next));
router.get('/vendors/:id', (req, res, next) => foodController.getVendorById(req, res, next));
router.get('/items', (req, res, next) => foodController.getItems(req, res, next));
router.get('/items/:id', (req, res, next) => foodController.getItemById(req, res, next));
router.get('/search', (req, res, next) => foodController.search(req, res, next));

export default router;
