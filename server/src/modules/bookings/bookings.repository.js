import { dataStore } from '../../database/inMemoryStore.js';
import { persistBooking } from '../../database/persistence.js';
import { getPostgresPool } from '../../database/postgresClient.js';

const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));

export class BookingRepository {
  async findAllResources() {
    try {
      const result = await getPostgresPool().query('SELECT id, name, type, capacity, location, is_available AS "isAvailable" FROM booking_resources WHERE is_available = TRUE ORDER BY name');
      return result.rows;
    } catch (error) {
      return dataStore.bookings;
    }
  }

  async findResourceById(id) {
    if (isUuid(id)) {
      try {
        const result = await getPostgresPool().query('SELECT id, name, type, capacity, location, is_available AS "isAvailable" FROM booking_resources WHERE id = $1::uuid', [id]);
        if (result.rows[0]) return result.rows[0];
      } catch (error) { /* use the seeded fallback */ }
    }
    return dataStore.bookings.find((b) => b.id === id) || null;
  }

  async findReservations(filter = {}) {
    if (filter.resourceId && isUuid(filter.resourceId)) {
      try {
        const values = [filter.resourceId];
        let where = 'resource_id = $1::uuid';
        if (filter.userId && isUuid(filter.userId)) { values.push(filter.userId); where += ` AND user_id = $${values.length}::uuid`; }
        if (filter.date) { values.push(filter.date); where += ` AND booking_date = $${values.length}`; }
        const result = await getPostgresPool().query(`SELECT id, resource_id AS "resourceId", user_id AS "userId", booking_date AS date, start_time AS "startTime", end_time AS "endTime", status, created_at AS "createdAt" FROM bookings WHERE ${where} ORDER BY booking_date, start_time`, values);
        return result.rows;
      } catch (error) { /* use the seeded fallback */ }
    }
    let list = dataStore.bookingReservations;
    if (filter.resourceId) {
      list = list.filter((r) => r.resourceId === filter.resourceId);
    }
    if (filter.userId) {
      list = list.filter((r) => r.userId === filter.userId);
    }
    if (filter.date) {
      list = list.filter((r) => r.date === filter.date);
    }
    return list;
  }

  async createReservation(reservation) {
    const newRes = {
      id: `res_${Date.now()}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      ...reservation,
    };
    dataStore.bookingReservations.push(newRes);
    await persistBooking(newRes);
    return newRes;
  }

  async cancelReservation(id, userId) {
    if (isUuid(id) && isUuid(userId)) {
      try {
        const result = await getPostgresPool().query('UPDATE bookings SET status = \'CANCELLED\' WHERE id = $1::uuid AND user_id = $2::uuid RETURNING id, resource_id AS "resourceId", user_id AS "userId", booking_date AS date, start_time AS "startTime", end_time AS "endTime", status, created_at AS "createdAt"', [id, userId]);
        if (result.rows[0]) return result.rows[0];
      } catch (error) { /* use the seeded fallback */ }
    }
    const res = dataStore.bookingReservations.find((r) => r.id === id);
    if (res) {
      res.status = 'CANCELLED';
      persistBooking(res);
      return res;
    }
    return null;
  }
}

export const bookingRepository = new BookingRepository();
