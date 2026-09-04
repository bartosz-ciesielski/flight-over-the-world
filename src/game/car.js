import * as THREE from "three";
import { resolveCirclePoly } from "./shapes.js";

export function createCar() {
  const group = new THREE.Group();

  const paint = new THREE.MeshStandardMaterial({
    color: 0xb02020,
    roughness: 0.35,
    metalness: 0.4,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x1a2830,
    roughness: 0.1,
    metalness: 0.6,
  });
  const trim = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 4.3), paint);
  body.position.y = 0.62;
  body.castShadow = true;
  group.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.52, 2.1), glass);
  cabin.position.set(0, 1.12, -0.25);
  cabin.castShadow = true;
  group.add(cabin);

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 1.1), paint);
  hood.position.set(0, 0.95, 1.35);
  group.add(hood);

  const bumperF = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.22, 0.25), trim);
  bumperF.position.set(0, 0.42, 2.15);
  group.add(bumperF);
  const bumperR = bumperF.clone();
  bumperR.position.z = -2.15;
  group.add(bumperR);

  const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.26, 14);
  wheelGeo.rotateZ(Math.PI / 2);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.95 });
  const wheels = [];
  for (const [x, z] of [
    [-0.85, 1.35],
    [0.85, 1.35],
    [-0.85, -1.35],
    [0.85, -1.35],
  ]) {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.position.set(x, 0.34, z);
    w.castShadow = true;
    group.add(w);
    wheels.push(w);
  }

  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xfff2c0,
    emissive: 0x554a20,
    roughness: 0.3,
  });
  for (const x of [-0.6, 0.6]) {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.06), lightMat);
    light.position.set(x, 0.72, 2.16);
    group.add(light);
  }
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0x881111,
    emissive: 0x330000,
    roughness: 0.3,
  });
  for (const x of [-0.6, 0.6]) {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.06), tailMat);
    tail.position.set(x, 0.72, -2.16);
    group.add(tail);
  }

  const state = {
    group,
    wheels,
    x: 0,
    z: 0,
    heading: 0,
    speed: 0,
    steer: 0,
  };
  group.userData.state = state;
  return state;
}

const VMAX = 17.5;
const VREV = -5.5;
const WHEEL_BASE = 2.7;

export function updateCar(car, input, dt, colliders) {
  const { fwd, back, left, right } = input;

  if (fwd) car.speed += 9.5 * dt;
  else if (back) car.speed -= (car.speed > 0.3 ? 16 : 5.5) * dt;
  else car.speed -= car.speed * 0.7 * dt;

  car.speed -= car.speed * Math.abs(car.speed) * 0.012 * dt;
  car.speed = Math.max(VREV, Math.min(VMAX, car.speed));
  if (Math.abs(car.speed) < 0.05 && !fwd && !back) car.speed = 0;

  const steerTarget = (left ? 1 : 0) - (right ? 1 : 0);
  const steerMax = 0.62 / (1 + Math.abs(car.speed) * 0.09);
  car.steer += (steerTarget * steerMax - car.steer) * Math.min(1, 7 * dt);

  if (Math.abs(car.speed) > 0.05) {
    car.heading +=
      (car.speed / WHEEL_BASE) * Math.tan(car.steer) * dt;
  }

  const fx = Math.sin(car.heading);
  const fz = Math.cos(car.heading);
  car.x += fx * car.speed * dt;
  car.z += fz * car.speed * dt;

  for (const ring of colliders) {
    const res = resolveCirclePoly(car.x, car.z, 1.25, ring);
    if (res) {
      car.x = res.x;
      car.z = res.z;
      car.speed *= 0.42;
    }
  }

  car.group.position.set(car.x, 0, car.z);
  car.group.rotation.y = car.heading;
  car.group.rotation.z = -car.steer * Math.min(1, Math.abs(car.speed) / 8) * 0.35;

  const spin = (car.speed * dt) / 0.34;
  for (const w of car.wheels) w.rotation.x += spin;
}

const _camTarget = new THREE.Vector3();
const _camPos = new THREE.Vector3();
let _camInit = false;

export function carChaseCamera(camera, car, dt) {
  const fx = Math.sin(car.heading);
  const fz = Math.cos(car.heading);

  _camTarget.set(
    car.x - fx * 8.6,
    3.6 + Math.abs(car.speed) * 0.04,
    car.z - fz * 8.6
  );

  if (!_camInit) {
    _camPos.copy(_camTarget);
    _camInit = true;
  } else {
    const k = 1 - Math.exp(-4.5 * dt);
    _camPos.lerp(_camTarget, k);
  }

  camera.position.copy(_camPos);
  camera.lookAt(car.x + fx * 5, 1.4, car.z + fz * 5);
}

export function resetCarCam() {
  _camInit = false;
}
