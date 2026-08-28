import { foodService } from './food.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class FoodController {
  async getVendors(req, res, next) {
    try {
      const vendors = await foodService.getAllVendors();
      return ApiResponse.success(res, vendors, 'Food vendors retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getVendorById(req, res, next) {
    try {
      const vendor = await foodService.getVendorById(req.params.id);
      return ApiResponse.success(res, vendor, 'Vendor menu retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getItems(req, res, next) {
    try {
      const items = await foodService.getAllItems(req.query);
      return ApiResponse.success(res, items, 'Menu items retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getItemById(req, res, next) {
    try {
      const item = await foodService.getItemById(req.params.id);
      return ApiResponse.success(res, item, 'Item details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { q } = req.query;
      const results = await foodService.searchFood(q || '');
      return ApiResponse.success(res, results, 'Food search results');
    } catch (error) {
      next(error);
    }
  }
}

export const foodController = new FoodController();
