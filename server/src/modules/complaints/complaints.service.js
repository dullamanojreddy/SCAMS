import { complaintRepository } from './complaints.repository.js';
import { campusRepository } from '../campus/campus.repository.js';
import { notificationService } from '../notifications/notifications.service.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors/AppError.js';

export class ComplaintService {
  async getAllComplaints(filter = {}, actingUser) {
    if (actingUser.role === 'STUDENT') {
      return complaintRepository.findAll({ ...filter, userId: actingUser.id });
    }
    return complaintRepository.findAll(filter);
  }

  async getComplaintById(id, actingUser) {
    const complaint = complaintRepository.findById(id);
    if (!complaint) {
      throw new NotFoundError('Complaint Ticket');
    }
    if (actingUser.role === 'STUDENT' && complaint.userId !== actingUser.id) {
      throw new ForbiddenError('You do not have access to view this ticket');
    }
    return complaint;
  }

  async createComplaint({ userId, userName, category, description, location, roomId, priority = 'MEDIUM' }) {
    if (!category || !description) {
      throw new ValidationError('Category and description are required');
    }

    let resolvedLocation = location || 'Campus Premises';
    let resolvedBuildingId = 'cse';

    // Context resolution: Room -> Floor -> Building
    if (roomId) {
      const room = campusRepository.findRoomById(roomId);
      if (room) {
        const building = campusRepository.findBuildingById(room.buildingId);
        resolvedLocation = `${building?.name || 'Academic Block'} - Room ${room.roomNumber} (Floor ${room.floorNumber})`;
        resolvedBuildingId = room.buildingId;
      }
    }

    const complaint = complaintRepository.create({
      userId,
      userName: userName || 'Campus Resident',
      category,
      description,
      location: resolvedLocation,
      roomId: roomId || null,
      buildingId: resolvedBuildingId,
      priority,
    });

    await notificationService.notifyUser(userId, {
      title: 'Helpdesk Ticket Created',
      message: `Your complaint #${complaint.ticketNumber} regarding "${category}" has been logged.`,
      type: 'COMPLAINT_STATUS_CHANGED',
    });

    return complaint;
  }

  async resolveComplaint(id, resolutionNote, actingUser) {
    const complaint = complaintRepository.findById(id);
    if (!complaint) {
      throw new NotFoundError('Complaint');
    }

    complaint.status = 'RESOLVED';
    complaint.timeline.push({
      status: 'Resolved',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: resolutionNote || `Issue resolved by ${actingUser.name}`,
    });

    await notificationService.notifyUser(complaint.userId, {
      title: 'Complaint Resolved',
      message: `Your ticket #${complaint.ticketNumber} has been resolved: ${resolutionNote || 'Fixed by technician'}`,
      type: 'COMPLAINT_STATUS_CHANGED',
    });

    return complaint;
  }
}

export const complaintService = new ComplaintService();
