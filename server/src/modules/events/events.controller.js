import { eventService } from './events.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class EventController {
  async getEvents(req, res, next) {
    try {
      const events = await eventService.getAllEvents(req.user?.id);
      return ApiResponse.success(res, events, 'Campus events retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req, res, next) {
    try {
      const event = await eventService.getEventById(req.params.id, req.user?.id);
      return ApiResponse.success(res, event, 'Event details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const event = await eventService.registerUserForEvent(req.params.id, req.user.id);
      return ApiResponse.success(res, event, 'Successfully registered for event');
    } catch (error) {
      next(error);
    }
  }

  async cancelRegistration(req, res, next) {
    try {
      const event = await eventService.cancelRegistration(req.params.id, req.user.id);
      return ApiResponse.success(res, event, 'Event registration cancelled');
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();
