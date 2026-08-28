import { noticeService } from './notices.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class NoticeController {
  async getNotices(req, res, next) {
    try {
      const notices = await noticeService.getAllNotices(req.query);
      return ApiResponse.success(res, notices, 'Campus circulars and notices retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getNoticeById(req, res, next) {
    try {
      const notice = await noticeService.getNoticeById(req.params.id);
      return ApiResponse.success(res, notice, 'Notice details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createNotice(req, res, next) {
    try {
      const notice = await noticeService.createNotice({
        ...req.body,
        author: req.user?.name,
      });
      return ApiResponse.success(res, notice, 'Notice published successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const noticeController = new NoticeController();
