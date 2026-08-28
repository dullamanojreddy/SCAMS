import { campusRepository } from './campus.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export class CampusService {
  async getAllBuildings() {
    return campusRepository.findAllBuildings();
  }

  async getBuildingById(buildingId) {
    const building = campusRepository.findBuildingById(buildingId);
    if (!building) {
      throw new NotFoundError('Building');
    }
    const rooms = campusRepository.findAllRooms({ buildingId: building.id });
    return {
      ...building,
      rooms,
    };
  }

  async getAllRooms(filter) {
    return campusRepository.findAllRooms(filter);
  }

  async getRoomById(roomId) {
    const room = campusRepository.findRoomById(roomId);
    if (!room) {
      throw new NotFoundError('Room');
    }
    const building = campusRepository.findBuildingById(room.buildingId);
    return {
      ...room,
      building,
    };
  }

  async searchCampus(query) {
    return campusRepository.search(query);
  }
}

export const campusService = new CampusService();
