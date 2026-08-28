import { timetableService } from './timetable.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class TimetableController {
  async getTimetable(req, res, next) {
    try {
      const timetable = await timetableService.getStudentTimetable(req.user?.id);
      return ApiResponse.success(res, timetable, 'Student timetable retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getToday(req, res, next) {
    try {
      const today = await timetableService.getTodaySchedule(req.user?.id);
      return ApiResponse.success(res, today, "Today's class schedule retrieved");
    } catch (error) {
      next(error);
    }
  }

  async getNext(req, res, next) {
    try {
      const nextClass = await timetableService.getNextClass(req.user?.id);
      return ApiResponse.success(res, nextClass, 'Upcoming class & room ETA retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const timetableController = new TimetableController();
