import { dataStore } from '../../database/inMemoryStore.js';
import { persistEventRegistration } from '../../database/persistence.js';

export class EventRepository {
  findAll() {
    return dataStore.events;
  }

  findById(id) {
    return dataStore.events.find((e) => e.id === id) || null;
  }

  create(eventData) {
    const newEvent = {
      id: `evt-${Date.now()}`,
      registeredCount: 0,
      registeredUserIds: [],
      isPublished: true,
      ...eventData,
    };
    dataStore.events.push(newEvent);
    return newEvent;
  }

  register(eventId, userId) {
    const event = this.findById(eventId);
    if (event && !event.registeredUserIds.includes(userId)) {
      event.registeredUserIds.push(userId);
      event.registeredCount += 1;
      persistEventRegistration(eventId, userId);
      return event;
    }
    return null;
  }

  cancelRegistration(eventId, userId) {
    const event = this.findById(eventId);
    if (event && event.registeredUserIds.includes(userId)) {
      event.registeredUserIds = event.registeredUserIds.filter((id) => id !== userId);
      event.registeredCount = Math.max(0, event.registeredCount - 1);
      return event;
    }
    return null;
  }
}

export const eventRepository = new EventRepository();
