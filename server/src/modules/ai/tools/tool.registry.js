import { campusService } from '../../campus/campus.service.js';
import { timetableService } from '../../timetable/timetable.service.js';
import { foodService } from '../../food/food.service.js';
import { orderService } from '../../orders/orders.service.js';
import { bookingService } from '../../bookings/bookings.service.js';
import { complaintService } from '../../complaints/complaints.service.js';
import { noticeService } from '../../notices/notices.service.js';
import { eventService } from '../../events/events.service.js';
import { mapService } from '../../map/map.service.js';
import { dataStore } from '../../../database/inMemoryStore.js';
import { ForbiddenError } from '../../../shared/errors/AppError.js';

export const toolRegistry = {
  // 1. Campus search & directory
  searchCampus: {
    description: 'Search for buildings, classrooms, labs, facilities, or venues across the campus',
    parameters: { query: { type: 'string', description: 'Keyword to search for' } },
    requiresConfirmation: false,
    async execute({ query }) {
      return campusService.searchCampus(query);
    },
  },

  getRoomDetails: {
    description: 'Get detailed location, capacity, building, and facilities of a specific campus room',
    parameters: { roomId: { type: 'string', description: 'Room ID or number (e.g. 304, 302, AI Lab - 1)' } },
    requiresConfirmation: false,
    async execute({ roomId }) {
      return campusService.getRoomById(roomId);
    },
  },

  // 2. Timetable & classes
  getNextClass: {
    description: "Get the user's immediate upcoming lecture or lab, including room location and ETA",
    parameters: {},
    requiresConfirmation: false,
    async execute({}, context) {
      return timetableService.getNextClass(context.user.id);
    },
  },

  getTimetable: {
    description: "Get the complete today or weekly timetable for the student",
    parameters: {},
    requiresConfirmation: false,
    async execute({}, context) {
      return timetableService.getTodaySchedule(context.user.id);
    },
  },

  // 3. Food ordering & search
  searchFood: {
    description: 'Search available campus canteen food items, prices, dietaries, and prep times',
    parameters: { query: { type: 'string', description: 'Food item or cuisine (e.g. Biryani, Dosa, Roll, Coffee)' } },
    requiresConfirmation: false,
    async execute({ query }) {
      return foodService.searchFood(query);
    },
  },

  getFoodOrder: {
    description: 'Get current active food order details and live preparation status',
    parameters: {},
    requiresConfirmation: false,
    async execute({}, context) {
      const orders = await orderService.getStudentOrders(context.user.id);
      return orders[0] || null;
    },
  },

  prepareFoodOrderAction: {
    description: 'Propose placing a food order at a campus canteen with item details (requires user confirmation)',
    parameters: {
      foodItemId: { type: 'string' },
      vendorId: { type: 'string' },
      quantity: { type: 'number' },
    },
    requiresConfirmation: true,
    async execute({ foodItemId, vendorId, quantity = 1 }, context) {
      const item = await foodService.getItemById(foodItemId);
      const actionId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const payload = {
        userId: context.user.id,
        vendorId: vendorId || item.vendorId,
        items: [{ foodItemId: item.id, quantity }],
        paymentMethod: 'CAMPUS_POINTS',
      };

      dataStore.pendingAIActions.set(actionId, {
        actionId,
        type: 'CREATE_ORDER',
        userId: context.user.id,
        payload,
        item,
        expiresAt: new Date(Date.now() + 10 * 60000),
      });

      return {
        actionId,
        requiresConfirmation: true,
        summary: `Place order for ${quantity}x "${item.name}" at ₹${item.price * quantity}?`,
        item,
        total: item.price * quantity,
      };
    },
  },

  // 4. Campus Notices & Events
  getNotices: {
    description: 'Get latest published campus notices, placement drives, and circulars',
    parameters: {},
    requiresConfirmation: false,
    async execute() {
      return noticeService.getAllNotices();
    },
  },

  searchEvents: {
    description: 'Get upcoming campus events, workshops, hackathons, and club sessions',
    parameters: {},
    requiresConfirmation: false,
    async execute({}, context) {
      return eventService.getAllEvents(context.user?.id);
    },
  },

  registerForEventAction: {
    description: 'Register the student for an upcoming campus event (requires confirmation)',
    parameters: { eventId: { type: 'string' } },
    requiresConfirmation: true,
    async execute({ eventId }, context) {
      const event = await eventService.getEventById(eventId, context.user.id);
      const actionId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      dataStore.pendingAIActions.set(actionId, {
        actionId,
        type: 'REGISTER_EVENT',
        userId: context.user.id,
        payload: { eventId },
        event,
        expiresAt: new Date(Date.now() + 10 * 60000),
      });

      return {
        actionId,
        requiresConfirmation: true,
        summary: `Confirm registration for "${event.title}" on ${event.month} ${event.day}?`,
        event,
      };
    },
  },

  // 5. Helpdesk & Complaints
  createComplaintAction: {
    description: 'Draft a maintenance or classroom complaint ticket (requires confirmation)',
    parameters: {
      category: { type: 'string' },
      description: { type: 'string' },
      location: { type: 'string' },
      roomId: { type: 'string' },
    },
    requiresConfirmation: true,
    async execute({ category, description, location, roomId }, context) {
      const actionId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const payload = {
        userId: context.user.id,
        userName: context.user.name,
        category: category || 'Classroom Equipment',
        description: description || 'Issue reported via AI Assistant',
        location: location || 'Room 304',
        roomId: roomId || 'r-304',
        priority: 'MEDIUM',
      };

      dataStore.pendingAIActions.set(actionId, {
        actionId,
        type: 'CREATE_COMPLAINT',
        userId: context.user.id,
        payload,
        expiresAt: new Date(Date.now() + 10 * 60000),
      });

      return {
        actionId,
        requiresConfirmation: true,
        summary: `Submit ticket for "${category || 'Issue'}" at ${location || 'Room 304'}?`,
        payload,
      };
    },
  },

  getComplaintStatus: {
    description: "Get status of the user's active maintenance tickets",
    parameters: {},
    requiresConfirmation: false,
    async execute({}, context) {
      const complaints = await complaintService.getAllComplaints({ userId: context.user.id }, context.user);
      return complaints;
    },
  },

  // 6. Navigation
  navigateCampus: {
    description: 'Get route navigation path and walking time to any room or building',
    parameters: {
      fromNodeId: { type: 'string' },
      toNodeId: { type: 'string' },
    },
    requiresConfirmation: false,
    async execute({ fromNodeId, toNodeId }) {
      return mapService.findRoute(fromNodeId || 'node_main_gate', toNodeId || 'node_cse_r304');
    },
  },
};
