import { ringToWorld } from "./geo.js";

export function worldRoads(osmRoads) {
  return osmRoads
    .filter((r) => r.tags.name)
    .map((r) => ({
      name: r.tags.name,
      pts: ringToWorld(r.coords),
    }));
}

export function nearestStreet(x, z, roads) {
  let best = { name: "", d: 45 };
  for (const road of roads) {
    const { pts, name } = road;
    for (let i = 0; i < pts.length - 1; i += 1) {
      const d = distToSegment(x, z, pts[i], pts[i + 1]);
      if (d < best.d) best = { name, d };
    }
  }
  return best.d < 40 ? best.name : "";
}

function distToSegment(px, pz, a, b) {
  const abx = b.x - a.x;
  const abz = b.z - a.z;
  const len = abx * abx + abz * abz || 1;
  let t = ((px - a.x) * abx + (pz - a.z) * abz) / len;
  t = Math.min(1, Math.max(0, t));
  return Math.hypot(px - (a.x + abx * t), pz - (a.z + abz * t));
}
