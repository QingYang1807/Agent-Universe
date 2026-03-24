/**
 * Simple road-graph waypoint pathfinding.
 *
 * The town has two horizontal roads (z ≈ -6 and z ≈ 6) and two vertical
 * roads (x ≈ -6 and x ≈ 6) forming a cross-grid.  Four intersection nodes
 * sit at the road crossings.  Every location connects to the nearest road
 * entry point, so agents travel along roads before cutting to their target.
 */

export interface WaypointNode {
  id: string;
  x: number;
  z: number;
}

export const ROAD_NODES: WaypointNode[] = [
  // Horizontal road top (z = -6)
  { id: 'RN_TL', x: -6,  z: -6 },   // top-left intersection
  { id: 'RN_TR', x:  6,  z: -6 },   // top-right intersection

  // Horizontal road bottom (z = 6)
  { id: 'RN_BL', x: -6,  z:  6 },   // bottom-left intersection
  { id: 'RN_BR', x:  6,  z:  6 },   // bottom-right intersection

  // Extra mid-points to give agents a nicer path
  { id: 'RN_ML', x: -6,  z:  0 },   // mid-left (vertical road)
  { id: 'RN_MR', x:  6,  z:  0 },   // mid-right (vertical road)
  { id: 'RN_MT', x:  0,  z: -6 },   // mid-top (horizontal road)
  { id: 'RN_MB', x:  0,  z:  6 },   // mid-bottom (horizontal road)
  { id: 'RN_C',  x:  0,  z:  0 },   // center plaza
];

// Road edges (bidirectional connections)
const RAW_EDGES: [string, string][] = [
  ['RN_TL', 'RN_MT'],
  ['RN_MT', 'RN_TR'],
  ['RN_BL', 'RN_MB'],
  ['RN_MB', 'RN_BR'],
  ['RN_TL', 'RN_ML'],
  ['RN_ML', 'RN_BL'],
  ['RN_TR', 'RN_MR'],
  ['RN_MR', 'RN_BR'],
  ['RN_MT', 'RN_C'],
  ['RN_MB', 'RN_C'],
  ['RN_ML', 'RN_C'],
  ['RN_MR', 'RN_C'],
];

const nodeMap = new Map<string, WaypointNode>(ROAD_NODES.map((n) => [n.id, n]));

const adjacency = new Map<string, string[]>();
for (const [a, b] of RAW_EDGES) {
  if (!adjacency.has(a)) adjacency.set(a, []);
  if (!adjacency.has(b)) adjacency.set(b, []);
  adjacency.get(a)!.push(b);
  adjacency.get(b)!.push(a);
}

function dist(a: WaypointNode, b: WaypointNode) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

function nearestNode(x: number, z: number): WaypointNode {
  let best = ROAD_NODES[0];
  let bestD = Infinity;
  for (const n of ROAD_NODES) {
    const d = Math.abs(n.x - x) + Math.abs(n.z - z);
    if (d < bestD) { bestD = d; best = n; }
  }
  return best;
}

/** A* on the road graph */
function astar(startId: string, goalId: string): string[] {
  const open = new Set<string>([startId]);
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  for (const n of ROAD_NODES) {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  }
  gScore.set(startId, 0);
  const goal = nodeMap.get(goalId)!;
  fScore.set(startId, dist(nodeMap.get(startId)!, goal));

  while (open.size > 0) {
    let current = '';
    let lowestF = Infinity;
    for (const id of open) {
      const f = fScore.get(id) ?? Infinity;
      if (f < lowestF) { lowestF = f; current = id; }
    }
    if (current === goalId) {
      const path: string[] = [];
      let cur: string | undefined = goalId;
      while (cur) { path.unshift(cur); cur = cameFrom.get(cur); }
      return path;
    }
    open.delete(current);
    for (const neighbor of (adjacency.get(current) ?? [])) {
      const tentG = (gScore.get(current) ?? Infinity) + dist(nodeMap.get(current)!, nodeMap.get(neighbor)!);
      if (tentG < (gScore.get(neighbor) ?? Infinity)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentG);
        fScore.set(neighbor, tentG + dist(nodeMap.get(neighbor)!, goal));
        open.add(neighbor);
      }
    }
  }
  return [startId, goalId];
}

/**
 * Build a list of (x, z) waypoints from agent's current position to target.
 * The path goes: current → nearest road node → ... → nearest road node to target → target.
 */
export function buildPath(
  fromX: number, fromZ: number,
  toX: number,   toZ: number,
): Array<[number, number]> {
  const fromNode = nearestNode(fromX, fromZ);
  const toNode   = nearestNode(toX,   toZ);

  let roadPath: Array<[number, number]> = [];

  if (fromNode.id !== toNode.id) {
    const nodeIds = astar(fromNode.id, toNode.id);
    roadPath = nodeIds.map((id) => {
      const n = nodeMap.get(id)!;
      return [n.x, n.z] as [number, number];
    });
  }

  return [
    ...roadPath,
    [toX, toZ],
  ];
}
