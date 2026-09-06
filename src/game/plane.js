import {
  Group,
  Mesh,
  MeshStandardMaterial,
  BoxGeometry,
  CylinderGeometry,
  ConeGeometry,
  SphereGeometry,
  CircleGeometry,
  LatheGeometry,
  Vector2,
  DoubleSide,
  MathUtils,
} from "three";

const R_EARTH = 6378137;

// Cessna 172 — stylizowany low-poly: górnopłat, stelarze, podwozie, śmigło
export function createPlaneMesh() {
  const plane = new Group();

  const white = new MeshStandardMaterial({
    color: 0xf0ede6,
    roughness: 0.45,
    metalness: 0.2,
    flatShading: true,
  });
  const red = new MeshStandardMaterial({
    color: 0xc23a2e,
    roughness: 0.45,
    metalness: 0.2,
    flatShading: true,
  });
  const dark = new MeshStandardMaterial({
    color: 0x22262b,
    roughness: 0.7,
    flatShading: true,
  });
  const glass = new MeshStandardMaterial({
    color: 0x16222e,
    roughness: 0.08,
    metalness: 0.85,
  });

  // --- kadłub (profil obrotowy: dziób → ogon) ---
  const profile = [
    new Vector2(0.02, 0.0),
    new Vector2(0.3, 0.15),
    new Vector2(0.44, 0.55),
    new Vector2(0.5, 1.2),
    new Vector2(0.48, 2.1),
    new Vector2(0.36, 3.2),
    new Vector2(0.2, 4.3),
    new Vector2(0.12, 5.2),
    new Vector2(0.03, 5.9),
  ];
  const fuselage = new Mesh(new LatheGeometry(profile, 12), white);
  fuselage.rotation.x = Math.PI / 2; // nos (y=0) na -Z, ogon (y=5.9) na +Z
  fuselage.position.z = -3.3;
  plane.add(fuselage);

  // --- kabina (szyby) ---
  const canopy = new Mesh(new BoxGeometry(0.72, 0.36, 1.5), glass);
  canopy.position.set(0, 0.38, -1.15);
  plane.add(canopy);

  // --- górnopłat z diedrem ---
  const wingGeo = new BoxGeometry(4.7, 0.09, 1.45);
  const tipGeo = new BoxGeometry(0.5, 0.1, 1.4);
  for (const side of [-1, 1]) {
    const half = new Group();
    const wing = new Mesh(wingGeo, white);
    wing.position.x = side * 2.35;
    const tip = new Mesh(tipGeo, red);
    tip.position.x = side * 4.8;
    half.add(wing, tip);
    half.position.set(0, 0.52, -0.85);
    half.rotation.z = side * -0.06; // dieder
    plane.add(half);

    // stelarz skrzydła
    const strut = new Mesh(new CylinderGeometry(0.03, 0.03, 1.6, 6), white);
    strut.position.set(side * 1.15, 0.05, -0.75);
    strut.rotation.z = side * 1.1;
    plane.add(strut);
  }

  // --- stateczniki ---
  const tailH = new Mesh(new BoxGeometry(2.4, 0.07, 0.85), white);
  tailH.position.set(0, 0.12, 2.55);
  const fin = new Mesh(new BoxGeometry(0.08, 1.05, 0.95), red);
  fin.position.set(0, 0.6, 2.6);
  fin.rotation.x = -0.15;
  plane.add(tailH, fin);

  // --- silnik + smigło ---
  const cowling = new Mesh(new CylinderGeometry(0.4, 0.34, 0.5, 12), red);
  cowling.rotation.x = Math.PI / 2;
  cowling.position.z = -3.15;
  plane.add(cowling);

  const propGroup = new Group();
  const spinner = new Mesh(new ConeGeometry(0.13, 0.4, 10), dark);
  spinner.rotation.x = -Math.PI / 2;
  spinner.position.z = -0.2;
  const bladeGeo = new BoxGeometry(0.16, 1.15, 0.04);
  const blade1 = new Mesh(bladeGeo, dark);
  blade1.name = "helice";
  const blade2 = new Mesh(bladeGeo, dark);
  blade2.name = "helice";
  blade2.rotation.z = Math.PI / 2;
  const disc = new Mesh(
    new CircleGeometry(1.15, 24),
    new MeshStandardMaterial({
      color: 0x333840,
      transparent: true,
      opacity: 0.14,
      side: DoubleSide,
      depthWrite: false,
    })
  );
  disc.name = "propdisc";
  propGroup.add(spinner, blade1, blade2, disc);
  propGroup.position.z = -3.55;
  plane.add(propGroup);
  plane.userData.prop = propGroup;
  plane.userData.blades = [blade1, blade2];

  // --- podwozie z owiewkami ---
  const gearGeo = new SphereGeometry(0.17, 8, 6);
  const pantGeo = new BoxGeometry(0.2, 0.28, 0.62);
  for (const side of [-1, 1]) {
    const leg = new Mesh(new CylinderGeometry(0.035, 0.035, 0.55, 6), dark);
    leg.position.set(side * 0.55, -0.55, -1.0);
    const pant = new Mesh(pantGeo, red);
    pant.position.set(side * 0.55, -0.85, -1.0);
    const wheel = new Mesh(gearGeo, dark);
    wheel.position.set(side * 0.55, -0.85, -1.28);
    plane.add(leg, pant, wheel);
  }
  const noseLeg = new Mesh(new CylinderGeometry(0.03, 0.03, 0.45, 6), dark);
  noseLeg.position.set(0, -0.5, -2.6);
  const nosePant = new Mesh(pantGeo, red);
  nosePant.position.set(0, -0.75, -2.6);
  plane.add(noseLeg, nosePant);

  return plane;
}

export class PlaneController {
  constructor(latDeg, lonDeg, height, headingDeg, spec = {}) {
    this.lat = latDeg * MathUtils.DEG2RAD;
    this.lon = lonDeg * MathUtils.DEG2RAD;
    this.height = height;
    this.heading = headingDeg * MathUtils.DEG2RAD; // 0 = północ, 90 = wschód
    this.pitch = 0;
    this.roll = 0;
    this.cruise = spec.cruise ?? 48;
    this.boost = spec.boost ?? 85;
    this.brake = spec.brake ?? 30;
    this.speed = this.cruise; // m/s
    const span = Math.max(1, this.boost - this.brake);
    this.cruiseT = Math.max(0, Math.min(1, (this.cruise - this.brake) / span));
    this.throttle = this.cruiseT;
    this.crashed = false;
  }

  update(dt, ctrl) {
    const targetRoll = -ctrl.roll * 0.9;
    const targetPitch = ctrl.pitch * 0.4;
    this.roll += (targetRoll - this.roll) * Math.min(1, 6 * dt);
    this.pitch += (targetPitch - this.pitch) * Math.min(1, 4 * dt);

    const lever = Number.isFinite(ctrl.throttle) ? MathUtils.clamp(ctrl.throttle, 0, 1) : this.cruiseT;
    this.throttle += (lever - this.throttle) * Math.min(1, 3.4 * dt);
    const span = this.boost - this.brake;
    const throttleSpeed = this.brake + this.throttle * span;
    // nos w dół = ujemny pitch: więcej i szybciej prędkości niż przy wznoszeniu
    const incline = Math.sin(this.pitch);
    const slopeTarget = throttleSpeed - incline * span * 0.55;
    const settle = incline < 0 ? 3.1 : 1.45;
    this.speed += (slopeTarget - this.speed) * Math.min(1, settle * dt);
    this.speed = Math.max(this.brake * 0.55, Math.min(this.boost * 1.18, this.speed));

    this.heading += -Math.sin(this.roll) * (this.speed / 55) * dt * 0.85;

    // przeciągnięcie przy małej prędkości
    const stallSpeed = this.brake + 4;
    const stallSink = this.speed < stallSpeed ? (stallSpeed - this.speed) * 1.1 : 0;
    const climb = Math.sin(this.pitch) * this.speed - stallSink;
    const vH = Math.cos(this.pitch) * this.speed;

    const vN = Math.cos(this.heading) * vH;
    const vE = Math.sin(this.heading) * vH;

    this.lat += (vN * dt) / R_EARTH;
    this.lon += (vE * dt) / (R_EARTH * Math.cos(this.lat));
    this.height += climb * dt;
  }

  get latDeg() {
    return this.lat * MathUtils.RAD2DEG;
  }
  get lonDeg() {
    return this.lon * MathUtils.RAD2DEG;
  }
  get headingDeg() {
    return ((this.heading * MathUtils.RAD2DEG) % 360 + 360) % 360;
  }
  get kmh() {
    return this.speed * 3.6;
  }
}
