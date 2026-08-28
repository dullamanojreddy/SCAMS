import { foodRepository } from './food.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export class FoodService {
  async getAllVendors() {
    return foodRepository.findAllVendors();
  }

  async getVendorById(vendorId) {
    const vendor = await foodRepository.findVendorById(vendorId);
    if (!vendor) {
      throw new NotFoundError('Food Vendor');
    }
    const items = await foodRepository.findAllItems({ vendorId });
    return {
      ...vendor,
      menu: items,
    };
  }

  async getAllItems(filter) {
    return foodRepository.findAllItems(filter);
  }

  async getItemById(itemId) {
    const item = await foodRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundError('Food Item');
    }
    return item;
  }

  async searchFood(query) {
    return foodRepository.search(query);
  }
}

export const foodService = new FoodService();
