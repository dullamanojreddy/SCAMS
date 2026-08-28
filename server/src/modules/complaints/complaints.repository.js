import { dataStore } from '../../database/inMemoryStore.js';
import { persistComplaint } from '../../database/persistence.js';
import { getPostgresPool } from '../../database/postgresClient.js';

export class ComplaintRepository {
  async findAll(filter = {}) {
    try {
      const values = [];
      const conditions = [];
      if (filter.userId) {
        values.push(filter.userId);
        conditions.push(`student_id = $${values.length}::uuid`);
      }
      if (filter.status) {
        values.push(filter.status);
        conditions.push(`LOWER(status::text) = LOWER($${values.length})`);
      }
      if (filter.buildingId) {
        values.push(filter.buildingId);
        conditions.push(`LOWER(location) LIKE '%' || LOWER($${values.length}) || '%'`);
      }
      const result = await getPostgresPool().query(
        `SELECT id, ticket_id AS "ticketNumber", student_id AS "userId", title, description, category, location,
                priority::text AS priority, status::text AS status, assigned_technician AS "assignedTo",
                created_at AS "createdAt"
         FROM complaints
         ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
         ORDER BY created_at DESC`,
        values
      );
      if (result.rows.length) {
        return result.rows.map((row) => ({
          ...row,
          userName: 'Campus Resident',
          timeline: [
            {
              status: 'Submitted',
              timestamp: new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Ticket ${row.ticketNumber} logged`,
            },
          ],
        }));
      }
    } catch (error) {
      // use seeded fallback
    }

    let list = dataStore.complaints;
    if (filter.userId) {
      list = list.filter((c) => c.userId === filter.userId);
    }
    if (filter.status) {
      list = list.filter((c) => c.status === filter.status);
    }
    if (filter.buildingId) {
      list = list.filter((c) => c.buildingId === filter.buildingId);
    }
    return list;
  }

  async findById(id) {
    try {
      const result = await getPostgresPool().query(
        `SELECT id, ticket_id AS "ticketNumber", student_id AS "userId", title, description, category, location,
                priority::text AS priority, status::text AS status, assigned_technician AS "assignedTo",
                created_at AS "createdAt"
         FROM complaints
         WHERE id = $1::uuid OR ticket_id = $1
         LIMIT 1`,
        [id]
      );
      if (result.rows[0]) {
        const row = result.rows[0];
        return {
          ...row,
          userName: 'Campus Resident',
          timeline: [
            {
              status: 'Submitted',
              timestamp: new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Ticket ${row.ticketNumber} logged`,
            },
          ],
        };
      }
    } catch (error) {
      // use seeded fallback
    }
    return dataStore.complaints.find((c) => c.id === id || c.ticketNumber === id) || null;
  }

  create(complaintData) {
    const newComplaint = {
      id: `c_${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'OPEN',
      assignedTo: 'Maintenance Dispatch Desk',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Submitted',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Issue reported by ${complaintData.userName || 'Student'}`,
        },
      ],
      ...complaintData,
    };
    dataStore.complaints.unshift(newComplaint);
    persistComplaint(newComplaint);
    return newComplaint;
  }

  update(id, updates) {
    const complaint = this.findById(id);
    if (complaint) {
      Object.assign(complaint, updates);
      persistComplaint(complaint);
      return complaint;
    }
    return null;
  }
}

export const complaintRepository = new ComplaintRepository();
