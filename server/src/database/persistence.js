import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getPostgresPool } from './postgresClient.js';

let initialized = false;

const isUuid = (value) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const hashPassword = (password) => crypto.scryptSync(password, 'campus-os-local-salt', 64).toString('hex');

function writeThrough(operation, label) {
  return operation().catch((error) => {
    console.warn(`[PostgreSQL Persistence] ${label} was not saved:`, error.message);
    return null;
  });
}

export async function initializePersistence() {
  if (initialized) return;

  const pool = getPostgresPool();
  const schemaPath = path.join(process.cwd(), 'src', 'db', 'postgres_schema.sql');
  const schema = await fs.readFile(schemaPath, 'utf8');
  await pool.query(schema);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS activity_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      event_type VARCHAR(80) NOT NULL,
      entity_type VARCHAR(80),
      entity_id VARCHAR(120),
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_chat_messages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      conversation_id VARCHAR(120) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_activity_events_user_created
      ON activity_events (user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_conversation
      ON ai_chat_messages (conversation_id, created_at ASC);
  `);
  initialized = true;
}

export async function createPersistentUser({
  campusId,
  name,
  email,
  password,
  role,
  department,
  branch,
  academicYear,
  section,
}) {
  const pool = getPostgresPool();
  const passwordHash = hashPassword(password);
  const result = await pool.query(
    `INSERT INTO users (
      roll_or_emp_id, full_name, email, password_hash, role, department,
      branch, academic_year, section
    ) VALUES ($1, $2, $3, $4, $5::user_role_enum, $6, $7, $8, $9)
    RETURNING id, roll_or_emp_id, full_name, email, role, department, branch, academic_year, section,
      is_verified_senior, campus_points, created_at`,
    [campusId, name, email, passwordHash, role, department, branch || null, academicYear || null, section || null]
  );

  const user = result.rows[0];
  await recordActivity({
    userId: user.id,
    eventType: 'ACCOUNT_CREATED',
    entityType: 'user',
    entityId: user.id,
    payload: { role: user.role, campusId: user.roll_or_emp_id },
  });
  return user;
}

export async function findPersistentUser({ userId, email, campusId }) {
  const conditions = [];
  const values = [];

  if (userId) {
    values.push(userId);
    conditions.push(`id = $${values.length}::uuid`);
  }
  if (email) {
    values.push(email.toLowerCase());
    conditions.push(`LOWER(email) = $${values.length}`);
  }
  if (campusId) {
    values.push(campusId);
    conditions.push(`roll_or_emp_id = $${values.length}`);
  }
  if (conditions.length === 0) return null;

  const result = await getPostgresPool().query(
    `SELECT id, roll_or_emp_id, full_name, email, role, department, branch,
      academic_year, section, is_verified_senior, campus_points, created_at
     FROM users WHERE ${conditions.join(' OR ')} LIMIT 1`,
    values
  );
  return result.rows[0] || null;
}

export async function verifyPersistentUser(identifier, password) {
  const result = await getPostgresPool().query(
    `SELECT id, roll_or_emp_id, full_name, email, password_hash, role, department, branch,
      academic_year, section, is_verified_senior, campus_points, created_at
     FROM users WHERE LOWER(email) = LOWER($1) OR roll_or_emp_id = $1 LIMIT 1`,
    [identifier]
  );
  const user = result.rows[0];
  if (!user || !password || hashPassword(password) !== user.password_hash) return null;
  delete user.password_hash;
  return user;
}

export async function recordActivity({ userId = null, eventType, entityType = null, entityId = null, payload = {} }) {
  await getPostgresPool().query(
    `INSERT INTO activity_events (user_id, event_type, entity_type, entity_id, payload)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [userId, eventType, entityType, entityId, JSON.stringify(payload)]
  );
}

export async function recordChatMessage({ userId = null, conversationId, role, content }) {
  await getPostgresPool().query(
    `INSERT INTO ai_chat_messages (user_id, conversation_id, role, content)
     VALUES ($1, $2, $3, $4)`,
    [userId, conversationId, role, content]
  );
}

export function persistNotice(notice) {
  return writeThrough(() => getPostgresPool().query(
    `INSERT INTO notices (id, title, content, category, is_emergency, target_branch, target_year,
      target_section, published_by_id, published_at, attachment_url)
     VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9::uuid, $10, $11)
     ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content`,
    [isUuid(notice.id) ? notice.id : crypto.randomUUID(), notice.title, notice.content || '', notice.category || 'GENERAL',
      Boolean(notice.isEmergency), notice.targetBranch || null, notice.targetYear || null, notice.targetSection || null,
      isUuid(notice.publishedById) ? notice.publishedById : null, notice.publishedAt || new Date(), notice.attachmentUrl || null]
  ), 'notice');
}

export function persistNotification(notification) {
  return writeThrough(() => getPostgresPool().query(
    `INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
     VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7) ON CONFLICT (id) DO UPDATE SET is_read = EXCLUDED.is_read`,
    [isUuid(notification.id) ? notification.id : crypto.randomUUID(), notification.userId, notification.title,
      notification.message, notification.type || 'GENERAL', Boolean(notification.read), notification.createdAt || new Date()]
  ), 'notification');
}

export function persistComplaint(complaint) {
  if (!isUuid(complaint.userId)) return Promise.resolve(null);
  return writeThrough(() => getPostgresPool().query(
    `INSERT INTO complaints (id, ticket_id, student_id, title, description, category, location, priority, status, created_at)
     VALUES ($1::uuid, $2, $3::uuid, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, resolution_notes = EXCLUDED.resolution_notes`,
    [isUuid(complaint.id) ? complaint.id : crypto.randomUUID(), complaint.ticketNumber || `TKT-${Date.now()}`,
      complaint.userId, complaint.title || 'Campus issue', complaint.description || '', complaint.category || 'GENERAL',
      complaint.location || 'Campus', complaint.priority || 'MEDIUM', complaint.status === 'OPEN' ? 'SUBMITTED' : complaint.status,
      complaint.createdAt || new Date()]
  ), 'complaint');
}

export function persistFeedback(feedback) {
  return writeThrough(() => getPostgresPool().query(
    `INSERT INTO campus_feedback (id, user_id, rating, comment, created_at)
     VALUES ($1::uuid, $2::uuid, $3, $4, $5)`,
    [crypto.randomUUID(), isUuid(feedback.userId) ? feedback.userId : null, feedback.rating, feedback.comment || '', feedback.createdAt || new Date()]
  ), 'feedback');
}

export function persistBooking(booking) {
  if (!isUuid(booking.userId) || !isUuid(booking.resourceId)) return Promise.resolve(null);
  return writeThrough(() => getPostgresPool().query(
    `INSERT INTO bookings (id, resource_id, user_id, booking_date, start_time, end_time, status, created_at)
     VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, $6, $7, $8) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
    [isUuid(booking.id) ? booking.id : crypto.randomUUID(), booking.resourceId, booking.userId, booking.date,
      booking.startTime, booking.endTime, booking.status || 'CONFIRMED', booking.createdAt || new Date()]
  ), 'booking');
}

export function persistOrder(order) {
  if (!isUuid(order.userId)) return Promise.resolve(null);
  return writeThrough(() => getPostgresPool().query(
    `INSERT INTO canteen_orders (id, order_token, student_id, total_amount, pickup_slot, status, payment_method, items, created_at)
     VALUES ($1::uuid, $2, $3::uuid, $4, $5, $6, $7, $8::jsonb, $9)
     ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
    [isUuid(order.id) ? order.id : crypto.randomUUID(), order.orderNumber || `ORD-${Date.now()}`, order.userId,
      order.total || 0, order.pickupSlot || order.pickupTime || 'ASAP', order.status === 'PENDING' ? 'RECEIVED' : order.status,
      order.paymentMethod || 'CAMPUS_POINTS', JSON.stringify(order.items || []), order.createdAt || new Date()]
  ), 'food order');
}

export function persistEventRegistration(eventId, userId) {
  if (!isUuid(eventId) || !isUuid(userId)) return Promise.resolve(null);
  return writeThrough(() => getPostgresPool().query(
    `INSERT INTO event_registrations (event_id, user_id) VALUES ($1::uuid, $2::uuid) ON CONFLICT DO NOTHING`,
    [eventId, userId]
  ), 'event registration');
}

export function persistAIAction(action) {
  return writeThrough(() => getPostgresPool().query(
    `INSERT INTO ai_actions (action_id, user_id, action_type, payload, status, expires_at)
     VALUES ($1, $2::uuid, $3, $4::jsonb, $5, $6) ON CONFLICT (action_id) DO UPDATE SET status = EXCLUDED.status`,
    [action.actionId, isUuid(action.userId) ? action.userId : null, action.type, JSON.stringify(action.payload || {}),
      action.status || 'PENDING', action.expiresAt || null]
  ), 'AI action');
}
