import { dataStore } from '../../database/inMemoryStore.js';

export class NoticeRepository {
  findAll(filter = {}) {
    let list = dataStore.notices;
    if (filter.category) {
      list = list.filter((n) => n.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.priority) {
      list = list.filter((n) => n.priority.toLowerCase() === filter.priority.toLowerCase());
    }
    return list;
  }

  findById(id) {
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
    return newNotice;
  }
}

export const noticeRepository = new NoticeRepository();
