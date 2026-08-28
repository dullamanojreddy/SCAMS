import { dataStore } from '../../database/inMemoryStore.js';

export class FoodRepository {
  findAllVendors() {
    return dataStore.vendors;
  }

  findVendorById(id) {
    return dataStore.vendors.find((v) => v.id === id) || null;
  }

  findAllItems(filter = {}) {
    let items = dataStore.foodItems;
    if (filter.vendorId) {
      items = items.filter((i) => i.vendorId === filter.vendorId);
    }
    if (filter.category) {
      items = items.filter((i) => i.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.dietary) {
      items = items.filter((i) => i.dietary === filter.dietary);
    }
    return items;
  }

  findItemById(id) {
    return dataStore.foodItems.find((i) => i.id === id) || null;
  }

  search(query) {
    const q = String(query || '').toLowerCase();
    return dataStore.foodItems.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.dietary.toLowerCase().includes(q)
    );
  }
}

export const foodRepository = new FoodRepository();
