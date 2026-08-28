import { dataStore } from '../../database/inMemoryStore.js';
import { getPostgresPool } from '../../database/postgresClient.js';

export class CampusRepository {
  async findAllBuildings() {
    try {
      const result = await getPostgresPool().query(`SELECT block_name AS name, MIN(block_name) AS code, COUNT(*)::int AS "roomCount", MAX(floor_number)::int AS "floorCount" FROM campus_locations GROUP BY block_name ORDER BY block_name`);
      if (result.rows.length) return result.rows.map((row) => ({ ...row, id: row.name.toLowerCase().replace(/\s+/g, '-'), category: 'ACADEMIC', facilities: [] }));
    } catch (error) { /* use the seeded fallback */ }
    return dataStore.buildings;
  }

  async findBuildingById(buildingId) {
    const buildings = await this.findAllBuildings();
    return buildings.find((b) => b.id === buildingId || b.code.toLowerCase() === buildingId.toLowerCase() || b.name.toLowerCase() === buildingId.toLowerCase()) || null;
  }

  async findAllRooms(filter = {}) {
    try {
      const values = [];
      const conditions = [];
      if (filter.buildingId) { values.push(filter.buildingId); conditions.push(`LOWER(block_name) = LOWER($${values.length})`); }
      if (filter.floorNumber !== undefined) { values.push(Number(filter.floorNumber)); conditions.push(`floor_number = $${values.length}`); }
      if (filter.type) { values.push(filter.type); conditions.push(`LOWER(category) = LOWER($${values.length})`); }
      const result = await getPostgresPool().query(`SELECT id, code, name, block_name AS "buildingId", floor_number AS "floorNumber", room_number AS "roomNumber", category AS type, facility_type AS "facilityType", status, description FROM campus_locations ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''} ORDER BY block_name, floor_number, room_number`, values);
      if (result.rows.length) return result.rows;
    } catch (error) { /* use the seeded fallback */ }
    let rooms = dataStore.rooms;
    if (filter.buildingId) {
      rooms = rooms.filter((r) => r.buildingId === filter.buildingId);
    }
    if (filter.floorNumber !== undefined) {
      rooms = rooms.filter((r) => r.floorNumber === Number(filter.floorNumber));
    }
    if (filter.type) {
      rooms = rooms.filter((r) => r.type === filter.type);
    }
    return rooms;
  }

  async findRoomById(roomId) {
    const rooms = await this.findAllRooms();
    return rooms.find((r) => r.id === roomId || r.roomNumber === roomId || r.code === roomId) || null;
  }

  search(query) {
    const q = String(query || '').toLowerCase();
    const buildings = dataStore.buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.facilities.some((f) => f.toLowerCase().includes(q))
    );

    const rooms = dataStore.rooms.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.roomNumber.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
    );

    const vendors = dataStore.vendors.filter(
      (v) => v.name.toLowerCase().includes(q) || v.location.toLowerCase().includes(q)
    );

    const events = dataStore.events.filter(
      (e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
    );

    return {
      locations: buildings,
      rooms,
      facilities: vendors,
      events,
    };
  }
}

export const campusRepository = new CampusRepository();
