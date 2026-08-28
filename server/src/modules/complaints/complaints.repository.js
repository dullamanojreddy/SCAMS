import { dataStore } from '../../database/inMemoryStore.js';

export class ComplaintRepository {
  findAll(filter = {}) {
    let list = dataStore.complaints;
    if (filter.userId) {
      list = list.filter((c) => c.userId === filter.userId);
    }
    if (filter.status) {
      list = list.filter((c) => c.status === filter.status);
    }
    if (filter.buildingId) {
      list = list.filter((c) => c.buildingId === filter.buildingId);
    }
    return list;
  }

  findById(id) {
    return dataStore.complaints.find((c) => c.id === id || c.ticketNumber === id) || null;
  }

  create(complaintData) {
    const newComplaint = {
      id: `c_${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'OPEN',
      assignedTo: 'Maintenance Dispatch Desk',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Submitted',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Issue reported by ${complaintData.userName || 'Student'}`,
        },
      ],
      ...complaintData,
    };
    dataStore.complaints.unshift(newComplaint);
    return newComplaint;
  }

  update(id, updates) {
    const complaint = this.findById(id);
    if (complaint) {
      Object.assign(complaint, updates);
      return complaint;
    }
    return null;
  }
}

export const complaintRepository = new ComplaintRepository();
