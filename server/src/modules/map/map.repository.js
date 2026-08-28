import { dataStore } from '../../database/inMemoryStore.js';
import { getPostgresPool } from '../../database/postgresClient.js';

export class MapRepository {
  async getNodes() {
    try {
      const result = await getPostgresPool().query('SELECT id, name, x, y FROM map_nodes ORDER BY name');
      if (result.rows.length) return result.rows;
    } catch (error) { /* use the seeded fallback */ }
    return dataStore.mapNodes;
  }

  async getEdges() {
    try {
      const result = await getPostgresPool().query('SELECT from_node_id AS "from", to_node_id AS "to", distance AS weight, accessible FROM map_edges');
      if (result.rows.length) return result.rows;
    } catch (error) { /* use the seeded fallback */ }
    return dataStore.mapEdges;
  }

  async findNodeById(id) {
    const nodes = await this.getNodes();
    return nodes.find((n) => n.id === id) || null;
  }
}

export const mapRepository = new MapRepository();
