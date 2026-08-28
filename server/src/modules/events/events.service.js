import { eventRepository } from './events.repository.js';
import { notificationService } from '../notifications/notifications.service.js';
import { NotFoundError, ConflictError, ValidationError } from '../../shared/errors/AppError.js';

export class EventService {
  async getAllEvents(userId) {
    const list = eventRepository.findAll();
    return list.map((e) => ({
      ...e,
      isUserRegistered: userId ? e.registeredUserIds.includes(userId) : false,
    }));
  }

  async getEventById(id, userId) {
    const event = eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError('Event');
    }
    return {
      ...event,
      isUserRegistered: userId ? event.registeredUserIds.includes(userId) : false,
    };
  }

  async registerUserForEvent(eventId, userId) {
    const event = eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event');
    }

    if (event.registeredUserIds.includes(userId)) {
      throw new ConflictError('You are already registered for this event');
    }

    if (event.registeredCount >= event.capacity) {
      throw new ValidationError('Event has reached maximum registration capacity');
    }

    const updated = eventRepository.register(eventId, userId);

    await notificationService.notifyUser(userId, {
      title: 'Event RSVP Confirmed',
      message: `You are confirmed for "${event.title}" on ${event.month} ${event.day} at ${event.time}.`,
      type: 'EVENT_REMINDER',
    });

    return updated;
  }

  async cancelRegistration(eventId, userId) {
    const event = eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event');
    }

    return eventRepository.cancelRegistration(eventId, userId);
  }
}

export const eventService = new EventService();
