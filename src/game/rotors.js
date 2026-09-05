import {
  CanvasTexture,
  CircleGeometry,
  DoubleSide,
  Euler,
  Group,
  Mesh,
  MeshBasicMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";

const _size = new Vector3();
const _center = new Vector3();

let discTex = null;
function discTexture() {
  if (discTex) return discTex;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 4, 128, 128, 126);
  g.addColorStop(0, "rgba(24, 26, 30, 0.50)");
  g.addColorStop(0.2, "rgba(48, 52, 58, 0.38)");
  g.addColorStop(0.75, "rgba(70, 76, 84, 0.30)");
  g.addColorStop(1, "rgba(70, 76, 84, 0.05)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(128, 128, 126, 0, Math.PI * 2);
  ctx.fill();
  discTex = new CanvasTexture(c);
  discTex.colorSpace = SRGBColorSpace;
  return discTex;
}

function discMaterial() {
  return new MeshBasicMaterial({
    map: discTexture(),
    transparent: true,
    opacity: 1,
    side: DoubleSide,
    depthWrite: false,
  });
}

function nameOf(o) {
  return (o.name || "").toLowerCase();
}

function isBlade(o) {
  if (!o.isMesh) return false;
  const n = nameOf(o);
  return (
    n === "helice" ||
    n === "propl" ||
    n === "propr" ||
    n.includes("propeller") ||
    n.includes("fanslow") ||
    /(^|_)rotor($|_)/.test(n)
  );
}

function isStockPropVisual(o) {
  if (!o.isMesh) return false;
  const n = nameOf(o);
  return (
    n.includes("propblur") ||
    n.includes("propdisc") ||
    n.includes("fanfast") ||
    n.includes("fanmedium") ||
    n === "helice" ||
    n === "propl" ||
    n === "propr" ||
    n.includes("propeller") ||
    n.includes("fanslow")
  );
}

/** Jedna tarcza na zespół śmigła — ten sam parent + ta sama nazwa (np. dwa helice). */
function propUnits(blades) {
  const map = new Map();
  for (const b of blades) {
    const key = `${b.parent?.uuid || "x"}:${nameOf(b)}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(b);
  }
  return [...map.values()];
}

function attachDisc(blades) {
  const src = blades[0];
  if (src.userData.spinHolder) return src.userData.spinHolder;
  const parent = src.parent;
  if (!parent || !src.geometry) return null;

  const geo = src.geometry;
  if (!geo.boundingBox) geo.computeBoundingBox();
  geo.boundingBox.getSize(_size);
  geo.boundingBox.getCenter(_center);
  const axes = [
    { s: _size.x, e: new Euler(0, Math.PI / 2, 0) },
    { s: _size.y, e: new Euler(Math.PI / 2, 0, 0) },
    { s: _size.z, e: new Euler(0, 0, 0) },
  ].sort((a, b) => a.s - b.s);
  const radius = Math.max(axes[1].s, axes[2].s) * 0.51;
  if (!(radius > 0.02)) return null;

  const holder = new Group();
  holder.name = "rotor-disc";
  holder.position.copy(src.position);
  holder.quaternion.copy(src.quaternion);
  holder.scale.copy(src.scale);

  const disc = new Mesh(new CircleGeometry(radius, 64), discMaterial());
  disc.position.copy(_center);
  disc.rotation.copy(axes[0].e);
  disc.renderOrder = 2;
  holder.add(disc);
  parent.add(holder);

  holder.userData.spinMesh = disc;
  for (const b of blades) b.userData.spinHolder = holder;
  return holder;
}

/** Menu: statyczne łopaty. Lot: koło w miejscu piasty, w płaszczyźnie śmigła. */
export function applyRotorState(root, flying) {
  if (!root) return;
  const blades = [];
  root.traverse((o) => {
    if (isStockPropVisual(o)) o.visible = !flying && isBlade(o);
    if (isBlade(o)) blades.push(o);
  });

  const holders = [];
  if (flying) {
    root.updateMatrixWorld(true);
    for (const unit of propUnits(blades)) {
      const holder = attachDisc(unit);
      if (holder) {
        holder.visible = true;
        holders.push(holder);
      }
    }
  } else {
    for (const b of blades) {
      if (b.userData.spinHolder) b.userData.spinHolder.visible = false;
    }
  }
  root.userData.spinRotors = holders;
}

export function spinRotors(root, dt, speed) {
  const list = root?.userData?.spinRotors;
  if (!list?.length) return;
  const w = Math.max(4, speed * 0.25) * dt;
  for (const holder of list) {
    const disc = holder.userData.spinMesh;
    if (disc) disc.rotation.z += w;
  }
}
