import { complaintService } from './complaints.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class ComplaintController {
  async getComplaints(req, res, next) {
    try {
      const list = await complaintService.getAllComplaints(req.query, req.user);
      return ApiResponse.success(res, list, 'Complaints retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getComplaintById(req, res, next) {
    try {
      const complaint = await complaintService.getComplaintById(req.params.id, req.user);
      return ApiResponse.success(res, complaint, 'Complaint details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createComplaint(req, res, next) {
    try {
      const complaint = await complaintService.createComplaint({
        userId: req.user.id,
        userName: req.user.name,
        ...req.body,
      });
      return ApiResponse.success(res, complaint, 'Complaint logged successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async resolveComplaint(req, res, next) {
    try {
      const complaint = await complaintService.resolveComplaint(req.params.id, req.body.note, req.user);
      return ApiResponse.success(res, complaint, 'Complaint marked as resolved');
    } catch (error) {
      next(error);
    }
  }
}

export const complaintController = new ComplaintController();
