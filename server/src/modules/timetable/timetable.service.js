import { timetableRepository } from './timetable.repository.js';
import { campusRepository } from '../campus/campus.repository.js';

export class TimetableService {
  async getStudentTimetable(userId) {
    const classes = timetableRepository.findAll();
    return classes.map((c) => {
      const roomObj = campusRepository.findRoomById(c.roomNumber);
      return {
        ...c,
        roomDetails: roomObj || null,
      };
    });
  }

  async getTodaySchedule(userId) {
    const classes = timetableRepository.findAll();
    const overview = timetableRepository.findCurrentAndUpcoming();

    return {
      classes,
      currentClass: overview.current,
      nextClass: overview.nextClass,
      totalClassesToday: classes.length,
    };
  }

  async getNextClass(userId) {
    const { nextClass, current } = timetableRepository.findCurrentAndUpcoming();
    const target = nextClass || current;
    const room = target ? campusRepository.findRoomById(target.roomNumber) : null;
    const building = room ? campusRepository.findBuildingById(room.buildingId) : null;

    return {
      class: target,
      location: {
        room: target.room,
        roomNumber: target.roomNumber,
        buildingName: building?.name || 'CSE Block',
        floor: room?.floorNumber || 3,
        coordinates: building?.coordinates || { x: 35, y: 40 },
      },
      walkingEtaMinutes: 3,
    };
  }
}

export const timetableService = new TimetableService();
