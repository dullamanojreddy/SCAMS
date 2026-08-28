import { mapRepository } from './map.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export class MapService {
  async getMapOverview() {
    return {
      nodes: await mapRepository.getNodes(),
      edges: await mapRepository.getEdges(),
    };
  }

  async findRoute(fromNodeId, toNodeId, options = {}) {
    const nodes = await mapRepository.getNodes();
    const edges = await mapRepository.getEdges();

    const startNode = await mapRepository.findNodeById(fromNodeId);
    const targetNode = await mapRepository.findNodeById(toNodeId);

    if (!startNode) throw new NotFoundError(`Start node (${fromNodeId})`);
    if (!targetNode) throw new NotFoundError(`Target node (${toNodeId})`);

    // Build adjacency list for Dijkstra pathfinding
    const adj = new Map();
    for (const node of nodes) {
      adj.set(node.id, []);
    }

    for (const edge of edges) {
      adj.get(edge.from)?.push({ node: edge.to, weight: edge.weight });
      adj.get(edge.to)?.push({ node: edge.from, weight: edge.weight }); // undirected campus pathways
    }

    // Dijkstra algorithm
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    for (const node of nodes) {
      distances.set(node.id, Infinity);
      unvisited.add(node.id);
    }
    distances.set(fromNodeId, 0);

    while (unvisited.size > 0) {
      // Find lowest distance node
      let closestNode = null;
      let minDistance = Infinity;
      for (const node of unvisited) {
        const d = distances.get(node);
        if (d < minDistance) {
          minDistance = d;
          closestNode = node;
        }
      }

      if (!closestNode || minDistance === Infinity || closestNode === toNodeId) {
        break;
      }

      unvisited.delete(closestNode);

      const neighbors = adj.get(closestNode) || [];
      for (const neighbor of neighbors) {
        if (!unvisited.has(neighbor.node)) continue;

        const alt = distances.get(closestNode) + neighbor.weight;
        if (alt < distances.get(neighbor.node)) {
          distances.set(neighbor.node, alt);
          previous.set(neighbor.node, closestNode);
        }
      }
    }

    // Reconstruct path
    const path = [];
    let curr = toNodeId;
    while (curr) {
      const nodeObj = nodes.find((node) => node.id === curr);
      if (nodeObj) path.unshift(nodeObj);
      curr = previous.get(curr);
    }

    const totalDistanceMeters = distances.get(toNodeId) === Infinity ? 0 : distances.get(toNodeId);
    const estimatedWalkingTimeSeconds = Math.round(totalDistanceMeters / 1.3); // standard 1.3 m/s walking speed

    return {
      from: startNode,
      to: targetNode,
      distanceMeters: totalDistanceMeters,
      estimatedWalkingTimeSeconds,
      path: path.length > 1 ? path : [startNode, targetNode],
      accessibleOnly: options.accessibleOnly || false,
    };
  }
}

export const mapService = new MapService();
