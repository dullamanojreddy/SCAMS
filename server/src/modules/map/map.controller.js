import { mapService } from './map.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class MapController {
  async getOverview(req, res, next) {
    try {
      const data = await mapService.getMapOverview();
      return ApiResponse.success(res, data, 'Campus map spatial nodes retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getRoute(req, res, next) {
    try {
      const { fromNodeId, toNodeId, accessibleOnly } = req.query;
      const route = await mapService.findRoute(
        fromNodeId || 'node_main_gate',
        toNodeId || 'node_cse_r304',
        { accessibleOnly: accessibleOnly === 'true' }
      );
      return ApiResponse.success(res, route, 'Optimal campus route calculated');
    } catch (error) {
      next(error);
    }
  }
}

export const mapController = new MapController();
