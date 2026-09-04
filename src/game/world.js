import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { ringToWorld, latLonToWorld } from "./geo.js";
import { shapeFromRing } from "./shapes.js";
import { facadeMaterial, gableMaterial, roofMaterial } from "./facade.js";

function makeTree() {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.18, 1.6, 6),
    new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.9 })
  );
  trunk.position.y = 0.8;
  trunk.castShadow = true;
  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0x3d6a32, roughness: 0.85 })
  );
  crown.position.y = 2.15;
  crown.castShadow = true;
  group.add(trunk, crown);
  return group;
}

function sampleMap(map, x, z) {
  if (!map?.canvas) return { r: 180, g: 160, b: 130 };
  const { bounds, canvas } = map;
  const u = (x - bounds.minX) / bounds.width;
  const v = (z - bounds.minZ) / bounds.depth;
  const px = Math.min(canvas.width - 1, Math.max(0, Math.floor(u * canvas.width)));
  const py = Math.min(canvas.height - 1, Math.max(0, Math.floor(v * canvas.height)));
  if (!map._pixels) {
    map._pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
  }
  const i = (py * canvas.width + px) * 4;
  return { r: map._pixels[i], g: map._pixels[i + 1], b: map._pixels[i + 2] };
}

function plasterColor(sample) {
  return {
    r: Math.min(255, Math.round(sample.r * 0.55 + 105)),
    g: Math.min(255, Math.round(sample.g * 0.52 + 95)),
    b: Math.min(255, Math.round(sample.b * 0.5 + 82)),
  };
}

function roofColor(sample) {
  return {
    r: Math.min(255, Math.round(sample.r * 0.9 + 25)),
    g: Math.min(255, Math.round(sample.g * 0.85 + 18)),
    b: Math.min(255, Math.round(sample.b * 0.85 + 15)),
  };
}

function centroid(ring) {
  let x = 0;
  let z = 0;
  for (const p of ring) {
    x += p.x;
    z += p.z;
  }
  return { x: x / ring.length, z: z / ring.length };
}

function ringBBox(ring) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const p of ring) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.z < minZ) minZ = p.z;
    if (p.z > maxZ) maxZ = p.z;
  }
  return { minX, maxX, minZ, maxZ, lenX: maxX - minX, lenZ: maxZ - minZ };
}

function hashRing(ring) {
  const c = centroid(ring);
  return Math.abs(Math.floor(c.x * 7 + c.z * 13));
}

// Wall quads for each polygon edge, grouped by facade texture
function buildWalls(ring, height, sample, wallBuckets) {
  const c = centroid(ring);
  const plaster = plasterColor(sample);
  const floors = Math.max(1, Math.round(height / 3.1));
  const doorEdge = hashRing(ring) % ring.length;

  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const L = Math.hypot(dx, dz);
    if (L < 0.5) continue;

    const midX = (a.x + b.x) / 2;
    const midZ = (a.z + b.z) / 2;

    // outward normal: perpendicular pointing away from centroid
    let nx = dz / L;
    let nz = -dx / L;
    if (nx * (midX - c.x) + nz * (midZ - c.z) < 0) {
      nx = -nx;
      nz = -nz;
    }

    const bays = Math.max(1, Math.min(9, Math.round(L / 3.4)));
    const doorBay = i === doorEdge ? Math.floor(bays / 2) : -1;

    const geo = new THREE.PlaneGeometry(L, height);
    geo.translate(0, height / 2, 0);
    geo.rotateY(Math.atan2(nx, nz));
    geo.translate(midX, 0, midZ);

    const mat = facadeMaterial(plaster, bays, floors, doorBay);
    if (!wallBuckets.has(mat)) wallBuckets.set(mat, []);
    wallBuckets.get(mat).push(geo);
  }
}

// Gable roof along the longer bbox axis; flat roof for complex shapes
function buildRoof(ring, height, sample, roofBuckets, gableBuckets) {
  const bb = ringBBox(ring);
  const area = Math.abs(signedArea(ring));
  const fillRatio = area / (bb.lenX * bb.lenZ + 1e-6);
  const roofCol = roofColor(sample);

  if (fillRatio > 0.68 && Math.min(bb.lenX, bb.lenZ) > 3) {
    const alongX = bb.lenX >= bb.lenZ;
    const half = (alongX ? bb.lenZ : bb.lenX) / 2;
    const roofH = Math.min(3.4, Math.max(1.2, half * 0.42));
    const over = 0.45;
    const ridgeY = height + roofH;
    const eaveY = height - 0.05;

    const positions = [];
    const uvs = [];

    const quad = (p1, p2, p3, p4) => {
      positions.push(...p1, ...p2, ...p3, ...p1, ...p3, ...p4);
      for (const p of [p1, p2, p3, p1, p3, p4]) {
        uvs.push(p[0] / 3.4, (p[1] + p[2]) / 3.4);
      }
    };
    const tri = (p1, p2, p3, bucket) => {
      bucket.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
    };

    const gablePos = [];

    if (alongX) {
      const cz = (bb.minZ + bb.maxZ) / 2;
      const x0 = bb.minX - over;
      const x1 = bb.maxX + over;
      const z0 = bb.minZ - over;
      const z1 = bb.maxZ + over;
      quad([x0, eaveY, z0], [x1, eaveY, z0], [x1, ridgeY, cz], [x0, ridgeY, cz]);
      quad([x1, eaveY, z1], [x0, eaveY, z1], [x0, ridgeY, cz], [x1, ridgeY, cz]);
      tri([bb.minX, eaveY, bb.minZ], [bb.minX, eaveY, bb.maxZ], [bb.minX, ridgeY, cz], gablePos);
      tri([bb.maxX, eaveY, bb.maxZ], [bb.maxX, eaveY, bb.minZ], [bb.maxX, ridgeY, cz], gablePos);

      // chimney
      const chimX = bb.minX + bb.lenX * 0.28;
      const chim = new THREE.BoxGeometry(0.55, 1.3, 0.55);
      chim.translate(chimX, ridgeY + 0.35, cz);
      if (!roofBuckets.has("__chimney")) roofBuckets.set("__chimney", []);
      roofBuckets.get("__chimney").push(chim);
    } else {
      const cx = (bb.minX + bb.maxX) / 2;
      const z0 = bb.minZ - over;
      const z1 = bb.maxZ + over;
      const x0 = bb.minX - over;
      const x1 = bb.maxX + over;
      quad([x0, eaveY, z1], [x0, eaveY, z0], [cx, ridgeY, z0], [cx, ridgeY, z1]);
      quad([x1, eaveY, z0], [x1, eaveY, z1], [cx, ridgeY, z1], [cx, ridgeY, z0]);
      tri([bb.minX, eaveY, bb.minZ], [bb.maxX, eaveY, bb.minZ], [cx, ridgeY, bb.minZ], gablePos);
      tri([bb.maxX, eaveY, bb.maxZ], [bb.minX, eaveY, bb.maxZ], [cx, ridgeY, bb.maxZ], gablePos);

      const chimZ = bb.minZ + bb.lenZ * 0.28;
      const chim = new THREE.BoxGeometry(0.55, 1.3, 0.55);
      chim.translate(cx, ridgeY + 0.35, chimZ);
      if (!roofBuckets.has("__chimney")) roofBuckets.set("__chimney", []);
      roofBuckets.get("__chimney").push(chim);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.computeVertexNormals();

    const mat = roofMaterial(roofCol);
    if (!roofBuckets.has(mat)) roofBuckets.set(mat, []);
    roofBuckets.get(mat).push(geo);

    if (gablePos.length) {
      const ggeo = new THREE.BufferGeometry();
      ggeo.setAttribute("position", new THREE.Float32BufferAttribute(gablePos, 3));
      ggeo.computeVertexNormals();
      const gmat = gableMaterial(plasterColor(sample));
      if (!gableBuckets.has(gmat)) gableBuckets.set(gmat, []);
      gableBuckets.get(gmat).push(ggeo);
    }
  } else {
    // flat roof
    const shape = shapeFromRing(ring);
    if (!shape) return;
    const geo = new THREE.ShapeGeometry(shape);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, height + 0.12, 0);
    const mat = roofMaterial(roofCol);
    if (!roofBuckets.has(mat)) roofBuckets.set(mat, []);
    roofBuckets.get(mat).push(geo);
  }
}

function signedArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const p = ring[i];
    const q = ring[(i + 1) % ring.length];
    a += p.x * q.z - q.x * p.z;
  }
  return a / 2;
}

export function buildWorld(osm, map) {
  const root = new THREE.Group();
  const colliders = [];
  const labels = [];

  const wallBuckets = new Map();
  const roofBuckets = new Map();
  const gableBuckets = new Map();

  for (const b of osm.buildings) {
    const ring = ringToWorld(b.coords);
    if (ring.length < 3) continue;
    const c = centroid(ring);
    const sample = sampleMap(map, c.x, c.z);
    const church =
      b.tags.building === "church" || b.tags.amenity === "place_of_worship";

    buildWalls(ring, b.height, sample, wallBuckets);
    buildRoof(ring, b.height, sample, roofBuckets, gableBuckets);

    if (church) {
      const plaster = plasterColor(sample);
      const towerMat = gableMaterial(plaster);
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 9, 3.4),
        towerMat
      );
      tower.position.set(c.x, b.height + 4.5, c.z);
      tower.castShadow = true;
      root.add(tower);

      const spire = new THREE.Mesh(
        new THREE.ConeGeometry(2.3, 6.5, 4),
        roofMaterial({ r: 90, g: 80, b: 70 })
      );
      spire.position.set(c.x, b.height + 12.2, c.z);
      spire.castShadow = true;
      root.add(spire);
    }

    colliders.push(ring);

    if (b.tags.name) {
      labels.push({ x: c.x, z: c.z, y: b.height + 2.4, text: b.tags.name });
    }
  }

  // merge buckets into single meshes
  const chimneyMat = new THREE.MeshStandardMaterial({
    color: 0x8a4a38,
    roughness: 0.9,
  });

  for (const [mat, geos] of wallBuckets) {
    const merged = mergeGeometries(geos, false);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    for (const g of geos) g.dispose();
  }
  for (const [mat, geos] of roofBuckets) {
    const merged = mergeGeometries(geos, false);
    if (!merged) continue;
    const mesh = new THREE.Mesh(
      merged,
      mat === "__chimney" ? chimneyMat : mat
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    for (const g of geos) g.dispose();
  }
  for (const [mat, geos] of gableBuckets) {
    const merged = mergeGeometries(geos, false);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    for (const g of geos) g.dispose();
  }

  // trees
  for (const t of osm.trees) {
    const p = latLonToWorld(t.lat, t.lon);
    const tree = makeTree();
    tree.position.set(p.x, 0, p.z);
    tree.scale.setScalar(0.75 + ((Math.abs(p.x * 13 + p.z * 7) % 10) / 10) * 0.6);
    root.add(tree);
  }
  for (const patch of osm.land) {
    if (patch.tags.landuse !== "forest" && patch.tags.natural !== "wood") continue;
    scatterTrees(root, ringToWorld(patch.coords), 18);
  }

  for (const poi of osm.pois) {
    const p = latLonToWorld(poi.lat, poi.lon);
    labels.push({ x: p.x, z: p.z, y: 4.5, text: poi.tags.name });
  }

  return { root, colliders, labels };
}

function scatterTrees(root, ring, count) {
  if (ring.length < 3) return;
  const bb = ringBBox(ring);
  let placed = 0;
  let tries = 0;
  while (placed < count && tries < count * 12) {
    tries += 1;
    const x = bb.minX + Math.random() * bb.lenX;
    const z = bb.minZ + Math.random() * bb.lenZ;
    if (!inside(x, z, ring)) continue;
    const tree = makeTree();
    tree.position.set(x, 0, z);
    tree.scale.setScalar(0.85 + Math.random() * 0.5);
    root.add(tree);
    placed += 1;
  }
}

function inside(x, z, ring) {
  let ok = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i].x;
    const zi = ring[i].z;
    const xj = ring[j].x;
    const zj = ring[j].z;
    const hit = zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi + 1e-12) + xi;
    if (hit) ok = !ok;
  }
  return ok;
}
