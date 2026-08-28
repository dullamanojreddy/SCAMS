import { dataStore } from '../../database/inMemoryStore.js';
import { persistNotification } from '../../database/persistence.js';
import { getPostgresPool } from '../../database/postgresClient.js';

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
    persistNotification(notification);
    return notification;
  }

  async getUserNotifications(userId) {
    try {
      const result = await getPostgresPool().query(
        `SELECT id, user_id AS "userId", title, message, type, is_read AS "read", created_at AS "createdAt"
         FROM notifications WHERE user_id = $1::uuid ORDER BY created_at DESC`, [userId]
      );
      return result.rows;
    } catch (error) {
      return dataStore.notifications.filter((n) => n.userId === userId);
    }
  }

  async markAsRead(notificationId, userId) {
    let notif = null;
    try {
      const result = await getPostgresPool().query(
        `UPDATE notifications SET is_read = TRUE WHERE id = $1::uuid AND user_id = $2::uuid
         RETURNING id, user_id AS "userId", title, message, type, is_read AS "read", created_at AS "createdAt"`,
        [notificationId, userId]
      );
      notif = result.rows[0] || null;
    } catch (error) {
      notif = dataStore.notifications.find((n) => n.id === notificationId && n.userId === userId);
    }
    if (notif) {
      notif.read = true;
      persistNotification(notif);
    }
    return notif;
  }

  async markAllAsRead(userId) {
    try {
      await getPostgresPool().query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1::uuid', [userId]);
    } catch (error) {
      // Keep the local fallback in sync when PostgreSQL is unavailable.
    }
    dataStore.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    return { success: true };
  }
}

export const notificationService = new NotificationService();
