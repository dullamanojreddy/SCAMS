import { dataStore } from '../../database/inMemoryStore.js';

export class CampusRepository {
  findAllBuildings() {
    return dataStore.buildings;
  }

  findBuildingById(buildingId) {
    return dataStore.buildings.find((b) => b.id === buildingId || b.code.toLowerCase() === buildingId.toLowerCase()) || null;
  }

  findAllRooms(filter = {}) {
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

  findRoomById(roomId) {
    return dataStore.rooms.find((r) => r.id === roomId || r.roomNumber === roomId) || null;
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
