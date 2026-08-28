import crypto from 'node:crypto';
import { getPostgresPool } from '../../database/postgresClient.js';

const uuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));

export const dynamicRepository = {
  async library(query = '') {
    const result = await getPostgresPool().query(
      `SELECT id, isbn, title, author, department, shelf_location, total_copies,
              available_copies, course_tags
       FROM library_books
       WHERE $1 = '' OR title ILIKE '%' || $1 || '%' OR author ILIKE '%' || $1 || '%'
          OR isbn ILIKE '%' || $1 || '%' OR department ILIKE '%' || $1 || '%'
       ORDER BY title`, [query]
    );
    return result.rows.map((row) => ({ ...row, subject: row.department, shelf: row.shelf_location, available: row.available_copies > 0 }));
  },

  async community() {
    const result = await getPostgresPool().query(
      `SELECT t.*, u.full_name AS author_name, u.role AS author_role
       FROM community_threads t JOIN users u ON u.id = t.author_id
       WHERE t.is_removed = FALSE ORDER BY t.created_at DESC`
    );
    return result.rows.map((row) => ({
      id: row.id, title: row.title, content: row.body, category: row.tags?.[0] || 'College Life',
      upvotes: row.upvotes, hasUpvoted: false, isFollowed: false, answers: [],
      author: { name: row.author_name, role: row.author_role, avatar: null }, timeAgo: row.created_at,
    }));
  },

  async createThread({ userId, title, body, category }) {
    const result = await getPostgresPool().query(
      `INSERT INTO community_threads (author_id, title, body, tags)
       VALUES ($1::uuid, $2, $3, $4) RETURNING *`, [userId, title, body, [category || 'College Life']]
    );
    return result.rows[0];
  },

  async placements() {
    const [companies, questions] = await Promise.all([
      getPostgresPool().query('SELECT * FROM placement_companies ORDER BY company_name'),
      getPostgresPool().query('SELECT q.*, c.company_name FROM interview_questions q LEFT JOIN placement_companies c ON c.id = q.company_id ORDER BY q.topic, q.question'),
    ]);
    return { companies: companies.rows, questions: questions.rows };
  },

  async facultyQueries(user, role) {
    const condition = role === 'FACULTY' || role === 'ADMIN' ? 'faculty_id = $1::uuid OR faculty_id IS NULL' : 'student_id = $1::uuid';
    const result = await getPostgresPool().query(
      `SELECT q.*, s.full_name AS student_name, s.roll_or_emp_id AS roll_no
       FROM faculty_queries q JOIN users s ON s.id = q.student_id
       WHERE ${condition} ORDER BY q.created_at DESC`, [user]
    );
    return result.rows.map((row) => ({ id: row.id, subject: row.subject, course: row.course_name, query: row.query_text,
      response: row.response_text, status: row.response_text ? 'Answered' : 'Pending', studentName: row.student_name,
      rollNo: row.roll_no, submittedAt: row.created_at, respondedAt: row.responded_at }));
  },

  async answerFacultyQuery(id, facultyId, response) {
    const result = await getPostgresPool().query(
      `UPDATE faculty_queries SET faculty_id = $2::uuid, response_text = $3, responded_at = CURRENT_TIMESTAMP
       WHERE id = $1::uuid RETURNING *`, [id, facultyId, response]
    );
    return result.rows[0] || null;
  },

  async faqs() {
    const result = await getPostgresPool().query('SELECT * FROM faq_entries ORDER BY category, question');
    return result.rows;
  },

  async campusLocations() {
    const result = await getPostgresPool().query('SELECT * FROM campus_locations ORDER BY block_name, floor_number, room_number NULLS FIRST, name');
    return result.rows;
  },

  async map() {
    const [nodes, edges] = await Promise.all([
      getPostgresPool().query('SELECT id, name, x, y FROM map_nodes ORDER BY name'),
      getPostgresPool().query('SELECT from_node_id AS "from", to_node_id AS "to", distance, accessible FROM map_edges'),
    ]);
    return { nodes: nodes.rows, edges: edges.rows };
  },

  async notifyAll({ title, message, type = 'GENERAL' }) {
    const result = await getPostgresPool().query(
      `INSERT INTO notifications (user_id, title, message, type)
       SELECT id, $1, $2, $3 FROM users RETURNING id, user_id, title, message, type, is_read, created_at`, [title, message, type]
    );
    return result.rows;
  },

  isUuid: uuid,
  newId: () => crypto.randomUUID(),
};