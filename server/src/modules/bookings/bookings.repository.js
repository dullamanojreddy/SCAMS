import { dataStore } from '../../database/inMemoryStore.js';

export class BookingRepository {
  findAllResources() {
    return dataStore.bookings;
  }

  findResourceById(id) {
    return dataStore.bookings.find((b) => b.id === id) || null;
  }

  findReservations(filter = {}) {
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

  createReservation(reservation) {
    const newRes = {
      id: `res_${Date.now()}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      ...reservation,
    };
    dataStore.bookingReservations.push(newRes);
    return newRes;
  }

  cancelReservation(id) {
    const res = dataStore.bookingReservations.find((r) => r.id === id);
    if (res) {
      res.status = 'CANCELLED';
      return res;
    }
    return null;
  }
}

export const bookingRepository = new BookingRepository();
