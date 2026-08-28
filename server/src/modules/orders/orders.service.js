import { orderRepository } from './orders.repository.js';
import { foodRepository } from '../food/food.repository.js';
import { authRepository } from '../auth/auth.repository.js';
import { notificationService } from '../notifications/notifications.service.js';
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
  InvalidStateTransitionError,
} from '../../shared/errors/AppError.js';
import { ALLOWED_ORDER_TRANSITIONS } from '../../shared/constants/roles.js';

export class OrderService {
  async getStudentOrders(userId) {
    return orderRepository.findAll({ userId });
  }

  async getOrderById(orderId, userId = null) {
    const order = orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order');
    }
    if (userId && order.userId !== userId) {
      throw new ForbiddenError('You can only view your own orders');
    }
    return order;
  }

  async createOrder({ userId, vendorId, items, paymentMethod = 'CAMPUS_POINTS' }) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }

    const vendor = foodRepository.findVendorById(vendorId);
    if (!vendor) {
      throw new NotFoundError('Food Vendor');
    }

    // Secure Price & Availability calculation on server
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const foodItem = foodRepository.findItemById(item.foodItemId || item.id);
      if (!foodItem) {
        throw new NotFoundError(`Food item ${item.foodItemId || item.id}`);
      }
      if (!foodItem.isAvailable) {
        throw new ValidationError(`Item "${foodItem.name}" is currently sold out`);
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const itemSubtotal = foodItem.price * qty;
      subtotal += itemSubtotal;

      validatedItems.push({
        foodItemId: foodItem.id,
        name: foodItem.name,
        price: foodItem.price,
        quantity: qty,
      });
    }

    const total = subtotal;

    // Check Campus points if applicable
    if (paymentMethod === 'CAMPUS_POINTS') {
      const user = authRepository.findById(userId);
      if (user && user.campusPoints < total) {
        throw new ValidationError(
          `Insufficient Campus Points balance (${user.campusPoints} available, ${total} required)`
        );
      }
      authRepository.updatePoints(userId, -total);
    }

    const order = orderRepository.create({
      userId,
      vendorId: vendor.id,
      vendorName: vendor.name,
      items: validatedItems,
      subtotal,
      tax: 0,
      total,
      paymentMethod,
      pickupTime: 'In ~15 mins',
      pickupCounter: 'Express Counter 1',
    });

    // Notify user
    await notificationService.notifyUser(userId, {
      title: 'Order Placed Successfully',
      message: `Your order #${order.orderNumber} for ${vendor.name} has been placed.`,
      type: 'ORDER_STATUS_CHANGED',
    });

    return order;
  }

  async transitionStatus(orderId, nextStatus, actingUser) {
    const order = orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order');
    }

    const allowed = ALLOWED_ORDER_TRANSITIONS[order.status] || [];
    if (!allowed.includes(nextStatus)) {
      throw new InvalidStateTransitionError(order.status, nextStatus);
    }

    // Role checks
    if (nextStatus === 'CANCELLED' && actingUser.role === 'STUDENT' && order.userId !== actingUser.id) {
      throw new ForbiddenError('You can only cancel your own pending orders');
    }

    const updated = orderRepository.updateStatus(orderId, nextStatus);

    await notificationService.notifyUser(order.userId, {
      title: `Order Status: ${nextStatus}`,
      message: `Your order #${order.orderNumber} is now ${nextStatus.toLowerCase()}.`,
      type: 'ORDER_STATUS_CHANGED',
    });

    return updated;
  }
}

export const orderService = new OrderService();
