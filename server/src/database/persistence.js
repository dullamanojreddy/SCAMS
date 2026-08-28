import crypto from 'node:crypto';
import { getPostgresPool } from './postgresClient.js';

let initialized = false;

export async function initializePersistence() {
  if (initialized) return;

  const pool = getPostgresPool();
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
  const passwordHash = crypto.scryptSync(password, 'campus-os-local-salt', 64).toString('hex');
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
