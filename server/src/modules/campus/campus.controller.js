import { campusService } from './campus.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class CampusController {
  async getBuildings(req, res, next) {
    try {
      const buildings = await campusService.getAllBuildings();
      return ApiResponse.success(res, buildings, 'Campus buildings retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getBuildingById(req, res, next) {
    try {
      const building = await campusService.getBuildingById(req.params.id);
      return ApiResponse.success(res, building, 'Building details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getRooms(req, res, next) {
    try {
      const rooms = await campusService.getAllRooms(req.query);
      return ApiResponse.success(res, rooms, 'Campus rooms retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getRoomById(req, res, next) {
    try {
      const room = await campusService.getRoomById(req.params.id);
      return ApiResponse.success(res, room, 'Room details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { q } = req.query;
      const results = await campusService.searchCampus(q || '');
      return ApiResponse.success(res, results, 'Campus search results retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const campusController = new CampusController();
