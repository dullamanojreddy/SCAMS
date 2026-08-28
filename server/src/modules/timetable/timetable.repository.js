import { dataStore } from '../../database/inMemoryStore.js';

export class TimetableRepository {
  findAll() {
    return dataStore.schedule;
  }

  findByStudent(studentId) {
    return dataStore.schedule;
  }

  findCurrentAndUpcoming() {
    const ongoing = dataStore.schedule.find((s) => s.status === 'ongoing') || dataStore.schedule[1];
    const upcoming = dataStore.schedule.filter((s) => s.status === 'upcoming');
    return {
      current: ongoing,
      upcoming,
      nextClass: upcoming[0] || null,
    };
  }
}

export const timetableRepository = new TimetableRepository();
