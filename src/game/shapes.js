import * as THREE from "three";

export function shapeFromRing(ring) {
  if (ring.length < 3) return null;
  const shape = new THREE.Shape();
  shape.moveTo(ring[0].x, -ring[0].z);
  for (let i = 1; i < ring.length; i += 1) {
    shape.lineTo(ring[i].x, -ring[i].z);
  }
  shape.closePath();
  return shape;
}

export function flatMesh(ring, color, y, opacity = 1) {
  const shape = shapeFromRing(ring);
  if (!shape) return null;
  const geo = new THREE.ShapeGeometry(shape);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity === 1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  mesh.receiveShadow = true;
  return mesh;
}

export function extrudeBuilding(ring, height, material) {
  const shape = shapeFromRing(ring);
  if (!shape) return null;
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function roadRibbon(points, width, color) {
  if (points.length < 2) return null;
  const half = width / 2;
  const left = [];
  const right = [];

  for (let i = 0; i < points.length; i += 1) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    let dx = next.x - prev.x;
    let dz = next.z - prev.z;
    const len = Math.hypot(dx, dz) || 1;
    dx /= len;
    dz /= len;
    const nx = -dz;
    const nz = dx;
    left.push(new THREE.Vector3(points[i].x + nx * half, 0.03, points[i].z + nz * half));
    right.push(new THREE.Vector3(points[i].x - nx * half, 0.03, points[i].z + nz * half));
  }

  const verts = [];
  const idx = [];
  for (let i = 0; i < points.length; i += 1) {
    verts.push(left[i].x, left[i].y, left[i].z, right[i].x, right[i].y, right[i].z);
    if (i < points.length - 1) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.88,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  return mesh;
}

export function pointInPoly(x, z, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i].x;
    const zi = ring[i].z;
    const xj = ring[j].x;
    const zj = ring[j].z;
    const hit =
      zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi + 1e-12) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

export function resolveCirclePoly(px, pz, radius, ring) {
  if (!pointInPoly(px, pz, ring)) return null;
  let best = { x: px, z: pz, d: Infinity };
  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const t = closestOnSegment(px, pz, a, b);
    const d = Math.hypot(px - t.x, pz - t.z);
    if (d < best.d) best = { ...t, d };
  }
  if (!Number.isFinite(best.d) || best.d === Infinity) return null;
  const nx = px - best.x;
  const nz = pz - best.z;
  const len = Math.hypot(nx, nz) || 1;
  return {
    x: best.x + (nx / len) * (radius + 0.08),
    z: best.z + (nz / len) * (radius + 0.08),
  };
}

function closestOnSegment(px, pz, a, b) {
  const abx = b.x - a.x;
  const abz = b.z - a.z;
  const denom = abx * abx + abz * abz || 1;
  let t = ((px - a.x) * abx + (pz - a.z) * abz) / denom;
  t = Math.min(1, Math.max(0, t));
  return { x: a.x + abx * t, z: a.z + abz * t };
}
