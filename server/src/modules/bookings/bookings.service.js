import { bookingRepository } from './bookings.repository.js';
import { NotFoundError, ConflictError, ValidationError } from '../../shared/errors/AppError.js';

export class BookingService {
  async getAllResources() {
    return bookingRepository.findAllResources();
  }

  async getResourceAvailability(resourceId, date = new Date().toISOString().split('T')[0]) {
    const resource = bookingRepository.findResourceById(resourceId);
    if (!resource) {
      throw new NotFoundError('Booking Resource');
    }

    const existingReservations = bookingRepository.findReservations({
      resourceId,
      date,
    }).filter((r) => r.status === 'CONFIRMED');

    // Standard hourly operational slots (08:00 to 18:00)
    const timeSlots = [
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '12:00', end: '14:00' },
      { start: '14:00', end: '16:00' },
      { start: '16:00', end: '18:00' },
    ];

    const slotsWithAvailability = timeSlots.map((slot) => {
      const isTaken = existingReservations.some(
        (res) => res.startTime === slot.start && res.endTime === slot.end
      );
      return {
        ...slot,
        available: !isTaken,
      };
    });

    return {
      resource,
      date,
      slots: slotsWithAvailability,
    };
  }

  async createBooking({ userId, resourceId, date, startTime, endTime, purpose }) {
    if (!resourceId || !date || !startTime || !endTime) {
      throw new ValidationError('Resource ID, date, startTime, and endTime are required');
    }

    const resource = bookingRepository.findResourceById(resourceId);
    if (!resource) {
      throw new NotFoundError('Booking Resource');
    }

    // Ensure no conflict
    const conflicts = bookingRepository.findReservations({
      resourceId,
      date,
    }).filter((r) => r.status === 'CONFIRMED' && r.startTime === startTime);

    if (conflicts.length > 0) {
      throw new ConflictError(`Resource ${resource.name} is already booked for ${date} at ${startTime}`);
    }

    const reservation = bookingRepository.createReservation({
      userId,
      resourceId,
      resourceName: resource.name,
      date,
      startTime,
      endTime,
      purpose: purpose || 'General Academic/Club Reservation',
    });

    return reservation;
  }

  async getMyBookings(userId) {
    return bookingRepository.findReservations({ userId });
  }

  async cancelBooking(bookingId, userId) {
    const booking = bookingRepository.cancelReservation(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking');
    }
    return booking;
  }
}

export const bookingService = new BookingService();
