export const USER_ROLES = {
  STUDENT: 'STUDENT',
  FACULTY: 'FACULTY',
  VENDOR: 'VENDOR',
  MAINTENANCE: 'MAINTENANCE',
  ADMIN: 'ADMIN',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  PICKED_UP: 'PICKED_UP',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
};

export const ALLOWED_ORDER_TRANSITIONS = {
  PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY'],
  READY: ['PICKED_UP'],
  PICKED_UP: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
};

export const COMPLAINT_STATUS = {
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

export const ROLE_PERMISSIONS = {
  STUDENT: [
    'campus:view',
    'timetable:view',
    'food:view',
    'orders:create',
    'orders:view_own',
    'complaints:create',
    'complaints:view_own',
    'events:view',
    'events:register',
    'notices:view',
    'bookings:view',
    'bookings:create',
    'feedback:create',
    'ai:chat',
  ],
  FACULTY: [
    'campus:view',
    'timetable:view',
    'food:view',
    'orders:create',
    'orders:view_own',
    'complaints:create',
    'complaints:view_own',
    'events:view',
    'events:register',
    'events:create',
    'notices:view',
    'notices:create',
    'bookings:view',
    'bookings:create',
    'feedback:create',
    'ai:chat',
  ],
  VENDOR: [
    'campus:view',
    'food:manage_own',
    'orders:manage_vendor',
    'complaints:create',
    'complaints:view_own',
    'notices:view',
    'events:view',
    'ai:chat',
  ],
  MAINTENANCE: [
    'campus:view',
    'complaints:view_all',
    'complaints:resolve',
    'notices:view',
    'events:view',
    'ai:chat',
  ],
  ADMIN: [
    '*', // Full system access
  ],
};
