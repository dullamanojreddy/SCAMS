import { dataStore } from '../../database/inMemoryStore.js';

export class AuthRepository {
  findById(userId) {
    return dataStore.users.find((u) => u.id === userId) || null;
  }

  findByEmail(email) {
    return dataStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findByStudentId(studentId) {
    return dataStore.users.find((u) => u.studentId === studentId) || null;
  }

  updatePoints(userId, delta) {
    const user = this.findById(userId);
    if (user) {
      user.campusPoints = Math.max(0, (user.campusPoints || 0) + delta);
      return user;
    }
    return null;
  }
}

export const authRepository = new AuthRepository();
