import { dataStore } from '../../database/inMemoryStore.js';
import { persistOrder } from '../../database/persistence.js';

export class OrderRepository {
  findAll(filter = {}) {
    let orders = dataStore.orders;
    if (filter.userId) {
      orders = orders.filter((o) => o.userId === filter.userId);
    }
    if (filter.vendorId) {
      orders = orders.filter((o) => o.vendorId === filter.vendorId);
    }
    if (filter.status) {
      orders = orders.filter((o) => o.status === filter.status);
    }
    return orders;
  }

  findById(id) {
    return dataStore.orders.find((o) => o.id === id || o.orderNumber === id) || null;
  }

  create(orderData) {
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber: String(Math.floor(1000 + Math.random() * 9000)),
      status: 'PENDING',
      qrToken: `QR-ORD-${Math.floor(1000 + Math.random() * 9000)}-VALID`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData,
    };
    dataStore.orders.unshift(newOrder);
    persistOrder(newOrder);
    return newOrder;
  }

  updateStatus(orderId, newStatus) {
    const order = this.findById(orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();
      persistOrder(order);
      return order;
    }
    return null;
  }
}

export const orderRepository = new OrderRepository();
