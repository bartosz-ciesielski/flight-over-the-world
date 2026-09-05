import {
  Box3,
  CanvasTexture,
  CircleGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from "three";

const _box = new Box3();
const _size = new Vector3();
const _center = new Vector3();
const _spin = new Vector3();
const _parentQ = new Quaternion();
const _z = new Vector3(0, 0, 1);

let discTex = null;
function discTexture() {
  if (discTex) return discTex;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 126);
  g.addColorStop(0, "rgba(28, 30, 34, 0.42)");
  g.addColorStop(0.55, "rgba(58, 62, 70, 0.34)");
  g.addColorStop(0.92, "rgba(72, 78, 86, 0.28)");
  g.addColorStop(1, "rgba(72, 78, 86, 0.06)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(128, 128, 126, 0, Math.PI * 2);
  ctx.fill();
  discTex = new CanvasTexture(c);
  discTex.colorSpace = SRGBColorSpace;
  return discTex;
}

function nameOf(o) {
  return (o.name || "").toLowerCase();
}

function isStaticBlade(o) {
  const n = nameOf(o);
  if (!n) return false;
  if (n.includes("propblur") || n.includes("propdisc") || n.includes("fanfast") || n.includes("fanmedium")) {
    return false;
  }
  return (
    n === "helice" ||
    n === "propl" ||
    n === "propr" ||
    n.includes("propeller") ||
    n.includes("fanslow") ||
    /(^|_)rotor($|_)/.test(n) ||
    n.includes("blade")
  );
}

function isStockBlur(o) {
  const n = nameOf(o);
  return n.includes("propblur") || n.includes("propdisc") || n.includes("fanfast") || n.includes("fanmedium");
}

function clusterBlades(blades) {
  const clusters = [];
  for (const b of blades) {
    _box.setFromObject(b);
    const c = _box.getCenter(new Vector3());
    const size = _box.getSize(new Vector3());
    const reach = Math.max(size.x, size.y, size.z) * 0.55;
    const found = clusters.find((cl) => cl.center.distanceTo(c) < Math.max(1.2, cl.reach * 0.75));
    if (found) {
      found.objects.push(b);
      found.box.union(_box);
      found.box.getCenter(found.center);
      found.box.getSize(_size);
      found.reach = Math.max(_size.x, _size.y, _size.z) * 0.55;
    } else {
      clusters.push({
        objects: [b],
        box: _box.clone(),
        center: c,
        reach,
      });
    }
  }
  return clusters;
}

function ensureDiscForCluster(cluster) {
  const anchor = cluster.objects[0];
  if (anchor.userData.spinHolder) return anchor.userData.spinHolder;
  const parent = anchor.parent;
  if (!parent) return null;

  cluster.box.getSize(_size);
  cluster.box.getCenter(_center);
  const dims = [
    { s: _size.x, v: new Vector3(1, 0, 0) },
    { s: _size.y, v: new Vector3(0, 1, 0) },
    { s: _size.z, v: new Vector3(0, 0, 1) },
  ].sort((a, b) => a.s - b.s);
  const radius = Math.max(dims[1].s, dims[2].s) * 0.52;
  if (!(radius > 0.05)) return null;

  parent.worldToLocal(_center);
  parent.getWorldQuaternion(_parentQ);
  _spin.copy(dims[0].v).applyQuaternion(_parentQ.clone().invert()).normalize();
  if (_spin.lengthSq() < 0.01) _spin.set(0, 0, 1);

  const holder = new Group();
  holder.name = "rotor-disc";
  holder.userData.generatedRotor = true;
  holder.position.copy(_center);
  holder.quaternion.setFromUnitVectors(_z, _spin);

  const disc = new Mesh(
    new CircleGeometry(radius, 64),
    new MeshBasicMaterial({
      map: discTexture(),
      transparent: true,
      opacity: 1,
      side: DoubleSide,
      depthWrite: false,
    })
  );
  disc.renderOrder = 2;
  holder.add(disc);
  parent.add(holder);
  for (const o of cluster.objects) o.userData.spinHolder = holder;
  return holder;
}

/** parked = statyczne łopaty (menu); flying = pełne przezroczyste koło. */
export function applyRotorState(root, flying) {
  if (!root) return;
  const blades = [];
  root.traverse((o) => {
    if (isStockBlur(o)) o.visible = false;
    else if (isStaticBlade(o)) {
      o.visible = !flying;
      blades.push(o);
    }
  });
  const holders = [];
  if (flying) {
    for (const cluster of clusterBlades(blades)) {
      const holder = ensureDiscForCluster(cluster);
      if (holder) {
        holder.visible = true;
        holders.push(holder);
      }
    }
  } else {
    for (const blade of blades) {
      if (blade.userData.spinHolder) blade.userData.spinHolder.visible = false;
    }
  }
  root.userData.spinRotors = holders;
}

export function spinRotors(root, dt, speed) {
  const list = root?.userData?.spinRotors;
  if (!list?.length) return;
  const w = Math.max(6, speed * 0.35) * dt;
  for (const holder of list) holder.rotation.z += w;
}
