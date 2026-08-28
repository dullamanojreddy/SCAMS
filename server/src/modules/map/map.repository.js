import { dataStore } from '../../database/inMemoryStore.js';

export class MapRepository {
  getNodes() {
    return dataStore.mapNodes;
  }

  getEdges() {
    return dataStore.mapEdges;
  }

  findNodeById(id) {
    return dataStore.mapNodes.find((n) => n.id === id) || null;
  }
}

export const mapRepository = new MapRepository();
