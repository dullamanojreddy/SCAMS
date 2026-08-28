import { dataStore } from '../../database/inMemoryStore.js';
import { persistNotice } from '../../database/persistence.js';
import { getPostgresPool } from '../../database/postgresClient.js';

export class NoticeRepository {
  async findAll(filter = {}) {
    try {
      const values = [];
      const conditions = [];
      if (filter.category) {
        values.push(filter.category);
        conditions.push(`LOWER(category) = LOWER($${values.length})`);
      }
      const result = await getPostgresPool().query(
        `SELECT id, title, content, category, is_emergency AS "isEmergency", is_retracted AS "isRetracted",
                target_branch AS "targetBranch", target_year AS "targetYear", target_section AS "targetSection",
                target_role AS "targetRole", published_at AS "publishedAt", attachment_url AS "attachmentUrl"
         FROM notices
         ${conditions.length ? `WHERE ${conditions.join(' AND ')} AND COALESCE(is_retracted, FALSE) = FALSE` : 'WHERE COALESCE(is_retracted, FALSE) = FALSE'}
         ORDER BY published_at DESC`,
        values
      );
      if (result.rows.length) {
        return result.rows.map((row) => ({
          ...row,
          subtitle: row.content,
          body: row.content,
          author: 'Campus Administration',
          badge: { text: row.isEmergency ? 'EMERGENCY' : row.category, type: row.category?.toLowerCase() || 'general' },
          badgeText: row.isEmergency ? 'EMERGENCY' : row.category,
          badgeType: row.isEmergency ? 'emergency' : row.category?.toLowerCase(),
          isPublished: true,
          isRead: false,
          timeAgo: 'Recently',
        }));
      }
    } catch (error) {
      // use seeded fallback
    }

    let list = dataStore.notices;
    if (filter.category) {
      list = list.filter((n) => n.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.priority) {
      list = list.filter((n) => n.priority.toLowerCase() === filter.priority.toLowerCase());
    }
    return list;
  }

  async findById(id) {
    try {
      const result = await getPostgresPool().query(
        `SELECT id, title, content, category, is_emergency AS "isEmergency", is_retracted AS "isRetracted",
                target_branch AS "targetBranch", target_year AS "targetYear", target_section AS "targetSection",
                target_role AS "targetRole", published_at AS "publishedAt", attachment_url AS "attachmentUrl"
         FROM notices WHERE id = $1::uuid LIMIT 1`,
        [id]
      );
      if (result.rows[0]) {
        const row = result.rows[0];
        return {
          ...row,
          subtitle: row.content,
          body: row.content,
          author: 'Campus Administration',
          badge: { text: row.isEmergency ? 'EMERGENCY' : row.category, type: row.category?.toLowerCase() || 'general' },
          badgeText: row.isEmergency ? 'EMERGENCY' : row.category,
          badgeType: row.isEmergency ? 'emergency' : row.category?.toLowerCase(),
          isPublished: true,
          isRead: false,
          timeAgo: 'Recently',
        };
      }
    } catch (error) {
      // use seeded fallback
    }
    return dataStore.notices.find((n) => n.id === id) || null;
  }

  create(notice) {
    const newNotice = {
      id: `not-${Date.now()}`,
      timeAgo: 'Just now',
      publishedAt: new Date().toISOString(),
      isPublished: true,
      badgeType: 'new',
      badgeText: 'NEW',
      icon: 'megaphone',
      ...notice,
    };
    dataStore.notices.unshift(newNotice);
    persistNotice(newNotice);
    return newNotice;
  }
}

export const noticeRepository = new NoticeRepository();
