import express from 'express';
import { requestIdMiddleware } from './middleware/request-id.middleware.js';
import { corsMiddleware } from './config/cors.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js';
import { ApiResponse } from './shared/utils/response.js';

// Route modules
import authRoutes from './modules/auth/auth.routes.js';
import campusRoutes from './modules/campus/campus.routes.js';
import mapRoutes from './modules/map/map.routes.js';
import timetableRoutes from './modules/timetable/timetable.routes.js';
import foodRoutes from './modules/food/food.routes.js';
import orderRoutes from './modules/orders/orders.routes.js';
import bookingRoutes from './modules/bookings/bookings.routes.js';
import complaintRoutes from './modules/complaints/complaints.routes.js';
import noticeRoutes from './modules/notices/notices.routes.js';
import eventRoutes from './modules/events/events.routes.js';
import notificationRoutes from './modules/notifications/notifications.routes.js';
import feedbackRoutes from './modules/feedback/feedback.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import { checkPostgresConnection } from './database/postgresClient.js';

const app = express();

app.use(requestIdMiddleware);
app.use(express.json());
app.use(corsMiddleware);

// Health & Database Diagnostics Endpoints
app.get('/health', (req, res) => {
  return ApiResponse.success(res, { status: 'ok', service: 'campus-os-api', time: new Date().toISOString() });
});

app.get('/api/v1/db/status', async (req, res) => {
  const status = await checkPostgresConnection();
  return ApiResponse.success(res, status);
});

// Mount modular API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/campus', campusRoutes);
app.use('/api/v1/map', mapRoutes);
app.use('/api/v1/timetable', timetableRoutes);
app.use('/api/v1/food', foodRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/ai', aiRoutes);

export default app;
