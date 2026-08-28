import { dataStore } from '../../database/inMemoryStore.js';
import { getPostgresPool } from '../../database/postgresClient.js';

export class FoodRepository {
  async findAllVendors() {
    try {
      const result = await getPostgresPool().query(
        `SELECT id, name, location, opening_hours AS "openingHours", status
         FROM canteen_vendors ORDER BY name`
      );
      if (result.rows.length) {
        return result.rows.map((row) => ({
          ...row,
          crowdLevel: row.status === 'OPEN' ? 'Moderate' : 'Low',
          averageWaitMinutes: row.status === 'OPEN' ? 10 : 0,
          rating: 4.5,
        }));
      }
    } catch (error) {
      // use seeded fallback
    }
    return dataStore.vendors;
  }

  async findVendorById(id) {
    try {
      const result = await getPostgresPool().query(
        `SELECT id, name, location, opening_hours AS "openingHours", status
         FROM canteen_vendors WHERE id = $1::uuid LIMIT 1`,
        [id]
      );
      if (result.rows[0]) {
        return {
          ...result.rows[0],
          crowdLevel: result.rows[0].status === 'OPEN' ? 'Moderate' : 'Low',
          averageWaitMinutes: result.rows[0].status === 'OPEN' ? 10 : 0,
          rating: 4.5,
        };
      }
    } catch (error) {
      // use seeded fallback
    }
    return dataStore.vendors.find((v) => v.id === id) || null;
  }

  async findAllItems(filter = {}) {
    try {
      const values = [];
      const conditions = [];
      if (filter.vendorId) {
        values.push(filter.vendorId);
        conditions.push(`vendor_id = $${values.length}::uuid`);
      }
      if (filter.category) {
        values.push(filter.category);
        conditions.push(`LOWER(category) = LOWER($${values.length})`);
      }
      if (filter.dietary) {
        values.push(filter.dietary);
        conditions.push(`LOWER(dietary_type) = LOWER($${values.length})`);
      }
      const result = await getPostgresPool().query(
        `SELECT id, vendor_id AS "vendorId", name, price, category, image_url AS image,
                is_available AS "isAvailable", prep_time_mins AS "preparationTimeMinutes",
                dietary_type AS dietary
         FROM canteen_menu_items
         ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
         ORDER BY name`,
        values
      );
      if (result.rows.length) {
        return result.rows.map((row) => ({
          ...row,
          image: row.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&auto=format&fit=crop&q=80',
          isAvailable: Boolean(row.isAvailable),
        }));
      }
    } catch (error) {
      // use seeded fallback
    }

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

  async findItemById(id) {
    try {
      const result = await getPostgresPool().query(
        `SELECT id, vendor_id AS "vendorId", name, price, category, image_url AS image,
                is_available AS "isAvailable", prep_time_mins AS "preparationTimeMinutes",
                dietary_type AS dietary
         FROM canteen_menu_items WHERE id = $1::uuid LIMIT 1`,
        [id]
      );
      if (result.rows[0]) {
        return {
          ...result.rows[0],
          image: result.rows[0].image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&auto=format&fit=crop&q=80',
          isAvailable: Boolean(result.rows[0].isAvailable),
        };
      }
    } catch (error) {
      // use seeded fallback
    }
    return dataStore.foodItems.find((i) => i.id === id) || null;
  }

  async search(query) {
    try {
      const result = await getPostgresPool().query(
        `SELECT id, vendor_id AS "vendorId", name, price, category, image_url AS image,
                is_available AS "isAvailable", prep_time_mins AS "preparationTimeMinutes",
                dietary_type AS dietary
         FROM canteen_menu_items
         WHERE LOWER(name) LIKE '%' || LOWER($1) || '%'
            OR LOWER(category) LIKE '%' || LOWER($1) || '%'
            OR LOWER(dietary_type) LIKE '%' || LOWER($1) || '%'
         ORDER BY name`,
        [String(query || '')]
      );
      if (result.rows.length) {
        return result.rows.map((row) => ({
          ...row,
          image: row.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&auto=format&fit=crop&q=80',
          isAvailable: Boolean(row.isAvailable),
        }));
      }
    } catch (error) {
      // use seeded fallback
    }

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
