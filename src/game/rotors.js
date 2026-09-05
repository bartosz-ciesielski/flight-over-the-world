import {
  Box3,
  CircleGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from "three";

const _box = new Box3();
const _size = new Vector3();
const _center = new Vector3();
const _spin = new Vector3();
const _parentQ = new Quaternion();
const _z = new Vector3(0, 0, 1);

function nameOf(o) {
  return (o.name || "").toLowerCase();
}

function isStaticBlade(o) {
  const n = nameOf(o);
  if (!n) return false;
  if (n.includes("propblur") || n.includes("propdisc") || n.includes("fan")) return false;
  return (
    n === "helice" ||
    n === "propl" ||
    n === "propr" ||
    n.includes("propeller") ||
    /(^|_)rotor($|_)/.test(n) ||
    n.includes("blade")
  );
}

function isFlightDisc(o) {
  const n = nameOf(o);
  return n.includes("propblur") || n.includes("propdisc") || n.includes("fanfast");
}

function isParkedFan(o) {
  const n = nameOf(o);
  return n.includes("fanslow");
}

function isMidFan(o) {
  return nameOf(o).includes("fanmedium");
}

function ensureDiscFor(prop) {
  if (prop.userData.spinHolder) return prop.userData.spinHolder;
  const parent = prop.parent;
  if (!parent) return null;

  _box.setFromObject(prop);
  _box.getSize(_size);
  _box.getCenter(_center);
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

  const mat = new MeshBasicMaterial({
    color: 0x4a4e54,
    transparent: true,
    opacity: 0.34,
    side: DoubleSide,
    depthWrite: false,
  });
  const disc = new Mesh(new CircleGeometry(radius, 48), mat);
  disc.renderOrder = 2;
  const hub = new Mesh(
    new CircleGeometry(radius * 0.14, 20),
    new MeshBasicMaterial({
      color: 0x1c1e22,
      transparent: true,
      opacity: 0.55,
      side: DoubleSide,
      depthWrite: false,
    })
  );
  hub.position.z = 0.01;
  holder.add(disc, hub);
  parent.add(holder);
  prop.userData.spinHolder = holder;
  return holder;
}

/** parked = statyczne łopaty (menu); flying = półprzezroczyste talerze. */
export function applyRotorState(root, flying) {
  if (!root) return;
  let hasBuiltInDisc = false;
  const blades = [];
  root.traverse((o) => {
    if (isFlightDisc(o)) {
      o.visible = !!flying;
      hasBuiltInDisc = true;
    } else if (isParkedFan(o)) o.visible = !flying;
    else if (isMidFan(o)) o.visible = false;
    else if (isStaticBlade(o)) {
      o.visible = !flying;
      blades.push(o);
    }
  });
  const holders = [];
  if (flying && !hasBuiltInDisc) {
    for (const blade of blades) {
      const holder = ensureDiscFor(blade);
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
  const w = Math.max(8, speed * 1.8) * dt;
  for (const holder of list) holder.rotation.z += w;
}
