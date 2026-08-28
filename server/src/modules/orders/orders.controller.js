import { orderService } from './orders.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class OrderController {
  async getMyOrders(req, res, next) {
    try {
      const orders = await orderService.getStudentOrders(req.user.id);
      return ApiResponse.success(res, orders, 'Student order history retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user.id);
      return ApiResponse.success(res, order, 'Order details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req, res, next) {
    try {
      const order = await orderService.createOrder({
        userId: req.user.id,
        vendorId: req.body.vendorId,
        items: req.body.items,
        paymentMethod: req.body.paymentMethod || 'CAMPUS_POINTS',
      });
      return ApiResponse.success(res, order, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const order = await orderService.transitionStatus(req.params.id, 'CANCELLED', req.user);
      return ApiResponse.success(res, order, 'Order cancelled');
    } catch (error) {
      next(error);
    }
  }

  async acceptOrder(req, res, next) {
    try {
      const order = await orderService.transitionStatus(req.params.id, 'ACCEPTED', req.user);
      return ApiResponse.success(res, order, 'Order accepted by vendor');
    } catch (error) {
      next(error);
    }
  }

  async prepareOrder(req, res, next) {
    try {
      const order = await orderService.transitionStatus(req.params.id, 'PREPARING', req.user);
      return ApiResponse.success(res, order, 'Order in preparation');
    } catch (error) {
      next(error);
    }
  }

  async readyOrder(req, res, next) {
    try {
      const order = await orderService.transitionStatus(req.params.id, 'READY', req.user);
      return ApiResponse.success(res, order, 'Order ready for pickup');
    } catch (error) {
      next(error);
    }
  }

  async pickupOrder(req, res, next) {
    try {
      const order = await orderService.transitionStatus(req.params.id, 'PICKED_UP', req.user);
      return ApiResponse.success(res, order, 'Order marked as picked up');
    } catch (error) {
      next(error);
    }
  }

  async completeOrder(req, res, next) {
    try {
      const order = await orderService.transitionStatus(req.params.id, 'COMPLETED', req.user);
      return ApiResponse.success(res, order, 'Order completed');
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
