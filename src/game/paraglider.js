import {
  Group,
  Mesh,
  MeshStandardMaterial,
  CylinderGeometry,
  SphereGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  CatmullRomCurve3,
  TubeGeometry,
  Vector3,
} from "three";

export function createGliderModel() {
  const group = new Group();

  // Canopy — arched ellipsoid shape
  const canopyPts = [];
  const span = 10;
  const chord = 3.2;
  const arch = 2.8;
  const segsX = 20;
  const segsZ = 8;

  for (let iz = 0; iz <= segsZ; iz++) {
    const tz = iz / segsZ;
    const z = (tz - 0.5) * chord;
    for (let ix = 0; ix <= segsX; ix++) {
      const tx = ix / segsX;
      const x = (tx - 0.5) * span;
      const archY = arch * (1 - (2 * tx - 1) ** 2);
      const profileY = -0.15 * Math.sin(tz * Math.PI);
      canopyPts.push(x, archY + profileY, z);
    }
  }

  const canopyIdx = [];
  for (let iz = 0; iz < segsZ; iz++) {
    for (let ix = 0; ix < segsX; ix++) {
      const a = iz * (segsX + 1) + ix;
      const b = a + 1;
      const c = a + segsX + 1;
      const d = c + 1;
      canopyIdx.push(a, c, b, b, c, d);
    }
  }

  const canopyGeo = new BufferGeometry();
  canopyGeo.setAttribute("position", new Float32BufferAttribute(canopyPts, 3));
  canopyGeo.setIndex(canopyIdx);
  canopyGeo.computeVertexNormals();

  const canopyMat = new MeshStandardMaterial({
    color: 0xe84420,
    roughness: 0.6,
    metalness: 0.0,
    side: 2,
  });
  const canopy = new Mesh(canopyGeo, canopyMat);
  canopy.position.y = 7;
  group.add(canopy);

  // Lines from canopy edges to pilot
  const lineVerts = [];
  const pilotY = 0;
  const lineCount = 10;
  for (let i = 0; i <= lineCount; i++) {
    const tx = i / lineCount;
    const x = (tx - 0.5) * span;
    const archY = arch * (1 - (2 * tx - 1) ** 2) + 7;
    // Front lines
    lineVerts.push(x, archY, -chord * 0.4);
    lineVerts.push(x * 0.15, pilotY, -0.2);
    // Back lines
    lineVerts.push(x, archY, chord * 0.4);
    lineVerts.push(x * 0.15, pilotY, 0.2);
  }

  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute("position", new Float32BufferAttribute(lineVerts, 3));
  const lineMat = new LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.6 });
  group.add(new LineSegments(lineGeo, lineMat));

  // Pilot body — simple capsule
  const bodyMat = new MeshStandardMaterial({ color: 0x2244aa, roughness: 0.8 });
  const body = new Mesh(new CylinderGeometry(0.25, 0.2, 1.2, 8), bodyMat);
  body.position.y = -0.3;
  group.add(body);

  // Head
  const headMat = new MeshStandardMaterial({ color: 0xffd5b4, roughness: 0.7 });
  const head = new Mesh(new SphereGeometry(0.22, 8, 6), headMat);
  head.position.y = 0.5;
  group.add(head);

  // Helmet
  const helmetMat = new MeshStandardMaterial({ color: 0xcc2200, roughness: 0.4 });
  const helmet = new Mesh(new SphereGeometry(0.25, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), helmetMat);
  helmet.position.y = 0.5;
  group.add(helmet);

  // Legs
  const legMat = new MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
  const legL = new Mesh(new CylinderGeometry(0.1, 0.1, 0.9, 6), legMat);
  legL.position.set(-0.15, -1.2, 0);
  legL.rotation.x = 0.3;
  group.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.15;
  group.add(legR);

  group.scale.setScalar(1);
  return group;
}
