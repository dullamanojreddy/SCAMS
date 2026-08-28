import { Router } from 'express';
import { foodController } from './food.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { getPostgresPool } from '../../database/postgresClient.js';
import { ApiResponse } from '../../shared/utils/response.js';

const router = Router();

router.get('/vendors', (req, res, next) => foodController.getVendors(req, res, next));
router.get('/vendors/:id', (req, res, next) => foodController.getVendorById(req, res, next));
router.get('/items', (req, res, next) => foodController.getItems(req, res, next));
router.get('/items/:id', (req, res, next) => foodController.getItemById(req, res, next));
router.get('/search', (req, res, next) => foodController.search(req, res, next));
router.patch('/items/:id', authMiddleware, requireRole('ADMIN', 'VENDOR'), async (req, res, next) => {
  try {
    const fields = [];
    const values = [];
    const map = {
      name: 'name',
      price: 'price',
      category: 'category',
      isAvailable: 'is_available',
      preparationTimeMinutes: 'prep_time_mins',
      dietary: 'dietary_type',
      image: 'image_url',
      vendorId: 'vendor_id',
    };
    for (const [key, column] of Object.entries(map)) {
      if (req.body[key] !== undefined) {
        values.push(req.body[key]);
        fields.push(`${column} = $${values.length}`);
      }
    }
    if (!fields.length) return ApiResponse.success(res, null, 'No changes supplied');
    values.push(req.params.id);
    const result = await getPostgresPool().query(
      `UPDATE canteen_menu_items SET ${fields.join(', ')} WHERE id = $${values.length}::uuid RETURNING *`,
      values
    );
    return ApiResponse.success(res, result.rows[0], 'Menu item updated');
  } catch (error) {
    next(error);
  }
});

export default router;
