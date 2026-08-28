import { campusRepository } from './campus.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export class CampusService {
  async getAllBuildings() {
    return campusRepository.findAllBuildings();
  }

  async getBuildingById(buildingId) {
    const building = await campusRepository.findBuildingById(buildingId);
    if (!building) {
      throw new NotFoundError('Building');
    }
    const rooms = await campusRepository.findAllRooms({ buildingId: building.name });
    return {
      ...building,
      rooms,
    };
  }

  async getAllRooms(filter) {
    return campusRepository.findAllRooms(filter);
  }

  async getRoomById(roomId) {
    const room = await campusRepository.findRoomById(roomId);
    if (!room) {
      throw new NotFoundError('Room');
    }
    const building = await campusRepository.findBuildingById(room.buildingId);
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
