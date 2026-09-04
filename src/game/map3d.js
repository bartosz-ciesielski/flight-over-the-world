import * as THREE from "three";
import { ORIGIN, PLAYER_RADIUS, SPAWN } from "./config.js";
import { latLonToWorld, worldToLatLon } from "./geo.js";
import { worldRoads, nearestStreet } from "./streets.js";
import { loadOsm, parseOsm } from "./overpass.js";
import { loadMapImagery, createGround } from "./tiles.js";
import { buildWorld } from "./world.js";
import { resolveCirclePoly } from "./shapes.js";
import { createPlayer, createControls, updatePlayer, updateCamera } from "./player.js";
import { setLoader, hideLoader, updateCoords, drawMinimap, createLabels, projectLabels } from "./hud.js";
import { showStreetPeek, hideStreetPeek } from "./streetview.js";

export async function startMap3d() {
  setLoader("Pobieram budynki z OpenStreetMap…", 0.15);
  const raw = await loadOsm();
  setLoader("Składam wieś…", 0.45);
  const osm = parseOsm(raw);

  setLoader("Nakładam satelitę…", 0.55);
  let map = null;
  try {
    map = await loadMapImagery((pct) => setLoader("Nakładam satelitę…", 0.55 + pct * 0.35));
  } catch (err) {
    console.warn(err);
  }
  const ground = map ? createGround(map) : fallbackGround();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87a0b0);
  scene.fog = new THREE.Fog(0x8aa6b4, 140, 520);

  const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.08, 900);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xfff1d6, 0x3d4a32, 0.85));
  const sun = new THREE.DirectionalLight(0xffe2b0, 1.35);
  sun.position.set(-60, 90, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -120;
  sun.shadow.camera.right = 120;
  sun.shadow.camera.top = 120;
  sun.shadow.camera.bottom = -120;
  scene.add(sun);

  scene.add(ground);
  const { root, colliders, labels } = buildWorld(osm, map);
  const roads = worldRoads(osm.roads);
  scene.add(root);

  const player = createPlayer();
  const streetSpawn = roads.find((r) => r.name === "Jarzębinowa")?.pts;
  const spawn = streetSpawn?.length
    ? streetSpawn[Math.floor(streetSpawn.length / 2)]
    : latLonToWorld(SPAWN.lat, SPAWN.lon);
  player.position.set(spawn.x, 0, spawn.z);
  for (const ring of colliders) {
    const pushed = resolveCirclePoly(player.position.x, player.position.z, PLAYER_RADIUS, ring);
    if (pushed) {
      player.position.x = pushed.x;
      player.position.z = pushed.z;
    }
  }
  scene.add(player);

  const controls = createControls(camera, renderer.domElement);
  controls.yaw = -0.7;
  const labelNodes = createLabels(labels.slice(0, 80));
  const minimap = document.getElementById("minimap");
  const peek = document.getElementById("streetview");
  let peekOpen = false;

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  window.addEventListener("keydown", async (e) => {
    if (e.key === "Escape" && peekOpen) {
      hideStreetPeek(peek);
      peekOpen = false;
      return;
    }
    if (e.key.toLowerCase() !== "v" || peekOpen) return;
    const { lat, lon } = worldToLatLon(player.position.x, player.position.z);
    const heading = ((-controls.yaw * 180) / Math.PI + 360) % 360;
    const ok = await showStreetPeek(peek, lat, lon, heading);
    peekOpen = ok;
  });

  hideLoader();
  console.info(`Niepruszewo 3D: ${osm.buildings.length} budynków, start ${ORIGIN.lat}`);

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!peekOpen) {
      updatePlayer(player, controls, colliders, dt);
      updateCamera(camera, player, controls, colliders);
    }
    updateCoords(
      player.position.x,
      player.position.z,
      nearestStreet(player.position.x, player.position.z, roads)
    );
    if (minimap) drawMinimap(minimap, player, colliders, controls.yaw);
    projectLabels(labelNodes, camera, innerWidth, innerHeight);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function fallbackGround() {
  const geo = new THREE.PlaneGeometry(2200, 2200);
  const mat = new THREE.MeshStandardMaterial({ color: 0x5a7340, roughness: 1 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
}
