import { noticeRepository } from './notices.repository.js';
import { NotFoundError, ValidationError } from '../../shared/errors/AppError.js';

export class NoticeService {
  async getAllNotices(filter = {}) {
    return noticeRepository.findAll(filter);
  }

  async getNoticeById(id) {
    const notice = noticeRepository.findById(id);
    if (!notice) {
      throw new NotFoundError('Notice');
    }
    return notice;
  }

  async createNotice({ title, subtitle, category = 'ACADEMIC', priority = 'NORMAL', author }) {
    if (!title || !subtitle) {
      throw new ValidationError('Notice title and subtitle/body are required');
    }

    return noticeRepository.create({
      title,
      subtitle,
      category: category.toUpperCase(),
      priority: priority.toUpperCase(),
      author: author || 'Academic Dean',
    });
  }
}

export const noticeService = new NoticeService();
