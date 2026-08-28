import { dataStore } from '../../database/inMemoryStore.js';

export class NotificationService {
  async notifyUser(userId, { title, message, type = 'GENERAL' }) {
    const notification = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    dataStore.notifications.unshift(notification);
    return notification;
  }

  async getUserNotifications(userId) {
    return dataStore.notifications.filter((n) => n.userId === userId);
  }

  async markAsRead(notificationId, userId) {
    const notif = dataStore.notifications.find((n) => n.id === notificationId && n.userId === userId);
    if (notif) {
      notif.read = true;
    }
    return notif;
  }

  async markAllAsRead(userId) {
    dataStore.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    return { success: true };
  }
}

export const notificationService = new NotificationService();
