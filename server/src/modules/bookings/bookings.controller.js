import { bookingService } from './bookings.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class BookingController {
  async getResources(req, res, next) {
    try {
      const resources = await bookingService.getAllResources();
      return ApiResponse.success(res, resources, 'Campus bookable resources retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAvailability(req, res, next) {
    try {
      const data = await bookingService.getResourceAvailability(req.params.id, req.query.date);
      return ApiResponse.success(res, data, 'Resource availability slots retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req, res, next) {
    try {
      const bookings = await bookingService.getMyBookings(req.user.id);
      return ApiResponse.success(res, bookings, 'User booking reservations retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createBooking(req, res, next) {
    try {
      const booking = await bookingService.createBooking({
        userId: req.user.id,
        ...req.body,
      });
      return ApiResponse.success(res, booking, 'Booking reservation confirmed', 201);
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
      return ApiResponse.success(res, booking, 'Booking reservation cancelled');
    } catch (error) {
      next(error);
    }
  }
}

export const bookingController = new BookingController();
