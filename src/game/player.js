import * as THREE from "three";
import { EYE_HEIGHT, PLAYER_RADIUS, RUN_SPEED, WALK_SPEED } from "./config.js";
import { pointInPoly, resolveCirclePoly } from "./shapes.js";

export function createPlayer() {
  const root = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb4232a, roughness: 0.7 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe0b090, roughness: 0.65 });
  const pantMat = new THREE.MeshStandardMaterial({ color: 0x2c3340, roughness: 0.8 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.55, 4, 8), bodyMat);
  torso.position.y = 1.15;
  torso.castShadow = true;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), skinMat);
  head.position.y = 1.68;
  head.castShadow = true;

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.225, 10, 8, 0, Math.PI * 2, 0, 1.05),
    new THREE.MeshStandardMaterial({ color: 0x3a2418, roughness: 0.9 })
  );
  hair.position.y = 1.78;

  const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.42, 3, 6), bodyMat);
  leftArm.position.set(-0.38, 1.18, 0);
  const rightArm = leftArm.clone();
  rightArm.position.x = 0.38;

  const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.52, 3, 6), pantMat);
  leftLeg.position.set(-0.14, 0.45, 0);
  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.14;

  leftArm.castShadow = rightArm.castShadow = true;
  leftLeg.castShadow = rightLeg.castShadow = true;

  root.add(torso, head, hair, leftArm, rightArm, leftLeg, rightLeg);
  root.userData = { leftArm, rightArm, leftLeg, rightLeg };

  return root;
}

export function createControls(camera, canvas) {
  const state = {
    keys: new Set(),
    yaw: 0,
    pitch: -0.18,
    dist: 5.6,
    locked: false,
    firstPerson: false,
  };

  const onKey = (down) => (e) => {
    const k = e.key.toLowerCase();
    if (down) {
      state.keys.add(k);
      if (k === "c") {
        state.firstPerson = !state.firstPerson;
        state.pitch = state.firstPerson ? 0 : -0.22;
        state.dist = state.firstPerson ? 4.8 : 6.2;
      }
    } else state.keys.delete(k);
  };

  window.addEventListener("keydown", onKey(true));
  window.addEventListener("keyup", onKey(false));

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });
  document.addEventListener("pointerlockchange", () => {
    state.locked = document.pointerLockElement === canvas;
  });
  document.addEventListener("mousemove", (e) => {
    if (!state.locked) return;
    state.yaw -= e.movementX * 0.0024;
    state.pitch = THREE.MathUtils.clamp(
      state.pitch - e.movementY * 0.002,
      state.firstPerson ? -1.2 : -1.1,
      state.firstPerson ? 0.55 : 0.2
    );
  });
  canvas.addEventListener(
    "wheel",
    (e) => {
      state.dist = THREE.MathUtils.clamp(state.dist + Math.sign(e.deltaY) * 0.6, 3.5, 16);
    },
    { passive: true }
  );

  return state;
}

export function updatePlayer(player, controls, colliders, dt) {
  const running = controls.keys.has("shift");
  const speed = running ? RUN_SPEED : WALK_SPEED;
  let mx = 0;
  let mz = 0;
  if (controls.keys.has("w") || controls.keys.has("arrowup")) mz -= 1;
  if (controls.keys.has("s") || controls.keys.has("arrowdown")) mz += 1;
  if (controls.keys.has("a") || controls.keys.has("arrowleft")) mx -= 1;
  if (controls.keys.has("d") || controls.keys.has("arrowright")) mx += 1;

  const moving = mx !== 0 || mz !== 0;
  if (moving) {
    const len = Math.hypot(mx, mz);
    mx /= len;
    mz /= len;
    const sin = Math.sin(controls.yaw);
    const cos = Math.cos(controls.yaw);
    const dx = mx * cos + mz * sin;
    const dz = -mx * sin + mz * cos;
    player.position.x += dx * speed * dt;
    player.position.z += dz * speed * dt;
    player.rotation.y = Math.atan2(dx, dz);
  }

  for (const ring of colliders) {
    const pushed = resolveCirclePoly(player.position.x, player.position.z, PLAYER_RADIUS, ring);
    if (pushed) {
      player.position.x = pushed.x;
      player.position.z = pushed.z;
    }
  }

  const t = performance.now() * 0.012 * (running ? 1.35 : 1);
  const swing = moving ? Math.sin(t) * 0.7 : 0;
  const { leftArm, rightArm, leftLeg, rightLeg } = player.userData;
  leftArm.rotation.x = swing;
  rightArm.rotation.x = -swing;
  leftLeg.rotation.x = -swing * 0.9;
  rightLeg.rotation.x = swing * 0.9;

  return moving;
}

export function updateCamera(camera, player, controls, colliders = []) {
  const { yaw, pitch } = controls;
  player.visible = !controls.firstPerson;

  if (controls.firstPerson) {
    camera.position.set(player.position.x, player.position.y + EYE_HEIGHT, player.position.z);
    camera.lookAt(
      player.position.x - Math.sin(yaw) * Math.cos(pitch) * 8,
      player.position.y + EYE_HEIGHT + Math.sin(pitch) * 8,
      player.position.z - Math.cos(yaw) * Math.cos(pitch) * 8
    );
    return;
  }

  let dist = controls.dist;
  for (let step = 0; step < 12; step += 1) {
    const ox = Math.sin(yaw) * Math.cos(pitch) * dist;
    const oz = Math.cos(yaw) * Math.cos(pitch) * dist;
    const cx = player.position.x + ox;
    const cz = player.position.z + oz;
    const inside = colliders.some((ring) => pointInPoly(cx, cz, ring));
    if (!inside || dist < 2.2) break;
    dist *= 0.82;
  }
  const ox = Math.sin(yaw) * Math.cos(pitch) * dist;
  const oy = Math.sin(-pitch) * dist + 1.4;
  const oz = Math.cos(yaw) * Math.cos(pitch) * dist;
  camera.position.set(
    player.position.x + ox,
    player.position.y + oy,
    player.position.z + oz
  );
  camera.lookAt(player.position.x, player.position.y + EYE_HEIGHT * 0.72, player.position.z);
}
