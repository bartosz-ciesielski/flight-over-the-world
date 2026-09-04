import {
  WGS84_ELLIPSOID,
  CAMERA_FRAME,
  TilesRenderer,
} from "3d-tiles-renderer";
import {
  TilesFadePlugin,
  UpdateOnChangePlugin,
  TileCompressionPlugin,
  UnloadTilesPlugin,
  GLTFExtensionsPlugin,
  GoogleCloudAuthPlugin,
  CesiumIonAuthPlugin,
} from "3d-tiles-renderer/plugins";
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  HemisphereLight,
  DirectionalLight,
  Raycaster,
  Vector3,
  Matrix4,
  Color,
  Clock,
  FogExp2,
  Quaternion,
  TextureLoader,
  EquirectangularReflectionMapping,
  SRGBColorSpace,
  Box3,
  Group,
} from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { setLoader, hideLoader } from "./game/hud.js";
import { createPlaneMesh, PlaneController } from "./game/plane.js";
import { createCarousel } from "./game/menuPreview.js";
import { createSky, SUN_DIR } from "./game/sky.js";
import { drawAirspeed, drawAltimeter, drawCompass } from "./game/instruments.js";
import { asset } from "./game/asset.js";
import {
  createExplosion,
  playExplosionSound,
  primeAudio,
} from "./game/explosion.js";
import { updateEngineSound, engineDebug } from "./game/engineSound.js";
import { updateMusic, primeMusic, musicDebug } from "./game/music.js";

// rakieta stoi pionowo (+Y) — połóż ją nosem do przodu (-Z, konwencja lotu)
function prepareRocket(model) {
  model.rotation.x = -Math.PI / 2;
  return model;
}

// myśliwiec w GLB ma nos w +Z, a lot idzie w -Z
function prepareJet(model) {
  model.rotation.y = Math.PI;
  return model;
}
import {
  distanceM,
  offsetPoint,
  createBeacon,
  loadPolandGeo,
  randomPointInPoland,
  drawPolandMap,
  unprojectPL,
  loadEuropeGeo,
  randomPointInEurope,
  drawEuropeMap,
  unprojectEU,
  loadWorldGeo,
  randomPointInWorld,
  drawWorldMap,
  unprojectWorld,
} from "./game/modes.js";

// zakresy trybu "Zgadnij region"
const GUESS_SCOPES = {
  pl: {
    load: loadPolandGeo,
    random: randomPointInPoland,
    draw: drawPolandMap,
    unproject: unprojectPL,
    sub: "Kliknij punkt na mapie Polski",
    status: "Losuję punkt w Polsce…",
  },
  eu: {
    load: loadEuropeGeo,
    random: randomPointInEurope,
    draw: drawEuropeMap,
    unproject: unprojectEU,
    sub: "Kliknij punkt na mapie Europy",
    status: "Losuję punkt w Europie…",
  },
  world: {
    load: loadWorldGeo,
    random: randomPointInWorld,
    draw: drawWorldMap,
    unproject: unprojectWorld,
    sub: "Kliknij punkt na mapie świata",
    status: "Losuję punkt na świecie…",
  },
};

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const ION_KEY = import.meta.env.VITE_CESIUM_ION_KEY;
const TERRAIN_ALT = 120; // przybliżona wysokość elipsoidalna nizin

// Google wyłączyło Photorealistic 3D Tiles dla kont billingowych z EEA (403).
// Obejście: darmowe konto Cesium ion — serwuje te same kafelki Google
// (asset 2275207), plugin sam pobiera brokerowany token i odnawia go co 3 h.
const ION_GOOGLE_TILES_ASSET = "2275207";

const PLANES = {
  pa28: {
    file: asset("models/pa28.glb"),
    wingspan: 11,
    cruise: 48, boost: 85, brake: 30,
    cam: [0, 5.5, 15],
    name: "Piper PA-28",
    desc: "Lekki śmigłowiec – 170 km/h",
    sound: "plane",
  },
  q400: {
    file: asset("models/q400.glb"),
    wingspan: 28,
    cruise: 75, boost: 115, brake: 45,
    cam: [0, 9, 32],
    name: "Dash 8 Q400",
    desc: "Turbośmigłowy pasażerski – 270 km/h",
    sound: "plane",
  },
  citation: {
    file: asset("models/citation.glb"),
    wingspan: 16,
    cruise: 92, boost: 150, brake: 55,
    cam: [0, 7, 24],
    name: "Cessna Citation",
    desc: "Odrzutowiec biznesowy – 330 km/h",
    sound: "jet",
  },
  jet: {
    file: asset("models/jet.glb"),
    wingspan: 10,
    cruise: 150, boost: 260, brake: 80,
    cam: [0, 6, 19],
    name: "Myśliwiec",
    desc: "Odrzutowiec bojowy – 540 km/h",
    sound: "jet",
    prepare: prepareJet,
  },
  rocket: {
    file: asset("models/rocket.glb"),
    wingspan: 12,
    cruise: 220, boost: 380, brake: 120,
    cam: [0, 6, 20],
    name: "Rakieta",
    desc: "Rakieta kosmiczna – 790 km/h",
    sound: "rocket",
    prepare: prepareRocket,
  },
};
const PLANE_ORDER = ["pa28", "q400", "citation", "jet", "rocket"];

const HOME_TIME = 600; // 10 min na dolot do domu
const GUESS_TIME = 60; // 1 min na rozpoznanie terenu
const HOME_CAPTURE_M = 600;

let camera, scene, renderer, tiles, sun, sky;
let planeMesh, plane, beacon;
let groundAlt = TERRAIN_ALT;
let crashed = false;
let finished = false;
let loaderDismissed = false;
let loadError = null;
let frameCount = 0;
let selectedPlane = "pa28";
let menuOpen = true;
let paused = false;
let pendingSnap = false; // po teleporcie: jednorazowe dosadzenie na właściwą wysokość
let startLat = 52.38871, startLon = 16.60069; // Niepruszewo
let camOffset = PLANES.pa28.cam;

// tryby gry
let mode = "free"; // free | home | guess
let homeTarget = null;
let timeLeft = 0;
let timerActive = false;
let guessOpen = false;
let guessAnswered = false;
let guessScope = "pl"; // pl | world
let awaitingSnap = false; // guess: menu/overlay czeka na pomiar terenu, start od razu na ~350 m
let awaitingSnapSince = 0;
let snapLastGh = null; // dosadzenie dopiero gdy pomiar terenu się ustabilizuje (kafelki się doprecyzują)
let snapStableCount = 0;
let geoCache = null;
let beaconGrounded = false;
const explosions = [];
let shake = 0;

const ctrl = { roll: 0, pitch: 0, throttle: 0 };
const keys = new Set();
const raycaster = new Raycaster();
raycaster.firstHitOnly = true;
const clock = new Clock();

const el = {
  gSpeed: document.getElementById("g-speed"),
  gAlt: document.getElementById("g-alt"),
  gHdg: document.getElementById("g-hdg"),
  banner: document.getElementById("f-banner"),
  bannerRetry: document.getElementById("banner-retry"),
  bannerMenu: document.getElementById("banner-menu"),
  menu: document.getElementById("menu"),
  city: document.getElementById("city-input"),
  start: document.getElementById("start-btn"),
  menuError: document.getElementById("menu-error"),
  modeDesc: document.getElementById("mode-desc"),
  pause: document.getElementById("pause"),
  resume: document.getElementById("btn-resume"),
  restart: document.getElementById("btn-restart"),
  carCanvas: document.getElementById("carousel-canvas"),
  carPrev: document.getElementById("car-prev"),
  carNext: document.getElementById("car-next"),
  carName: document.getElementById("car-name"),
  carDesc: document.getElementById("car-desc"),
  timerBox: document.getElementById("f-timer-box"),
  timer: document.getElementById("f-timer"),
  distBox: document.getElementById("f-dist-box"),
  dist: document.getElementById("f-dist"),
  guessmap: document.getElementById("guessmap"),
  gmCanvas: document.getElementById("gm-canvas"),
  gmResult: document.getElementById("gm-result"),
  gmClose: document.getElementById("gm-close"),
  gmRetry: document.getElementById("gm-retry"),
  gmSub: document.getElementById("gm-sub"),
  guessScope: document.getElementById("guess-scope"),
};

// karuzela pojazdów — jeden duży podgląd, strzałki w bok
const carousel = createCarousel(
  el.carCanvas,
  PLANE_ORDER.map((k) => ({
    key: k,
    file: PLANES[k].file,
    wingspan: PLANES[k].wingspan,
    prepare: PLANES[k].prepare,
  }))
);
let planeIdx = 0;
function selectPlane(i, dir) {
  planeIdx = (i + PLANE_ORDER.length) % PLANE_ORDER.length;
  selectedPlane = PLANE_ORDER[planeIdx];
  carousel.show(selectedPlane, dir);
  el.carName.textContent = PLANES[selectedPlane].name;
  el.carDesc.textContent = PLANES[selectedPlane].desc;
}
el.carPrev.addEventListener("click", () => selectPlane(planeIdx - 1, -1));
el.carNext.addEventListener("click", () => selectPlane(planeIdx + 1, 1));
selectPlane(0);

// wybór trybu — same przyciski, instrukcja pokazuje się dopiero pod spodem
const MODE_PLACEHOLDERS = {
  free: "Miasto startowe… np. Niepruszewo",
  home: "Twój adres… np. Jarzębinowa 5, Niepruszewo",
  guess: "",
};
const MODE_DESCS = {
  free: "Wpisz miasto startowe i zacznij latać bez limitu czasu.",
  home: "Wyrzucimy Cię ~30 km od domu i masz 10 minut, żeby odszukać drogę i dolecieć z powrotem.",
  guess: "Masz minutę lotu, aby rozeznać się w terenie i zaznaczyć na mapie, gdzie jesteś.",
};
function selectMode(m) {
  mode = m;
  document.querySelectorAll(".mode-card").forEach((b) =>
    b.classList.toggle("selected", b.dataset.mode === m)
  );
  el.modeDesc.textContent = MODE_DESCS[m];
  el.city.placeholder = MODE_PLACEHOLDERS[m];
  el.city.style.display = m === "guess" ? "none" : "";
  el.guessScope.style.display = m === "guess" ? "" : "none";
  el.menuError.textContent = "";
}
document.querySelectorAll(".mode-card").forEach((btn) => {
  btn.addEventListener("click", () => selectMode(btn.dataset.mode));
});
document.querySelectorAll(".scope-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    guessScope = btn.dataset.scope;
    document.querySelectorAll(".scope-btn").forEach((b) =>
      b.classList.toggle("selected", b === btn)
    );
  });
});
selectMode("guess");

function init() {
  if (!ION_KEY && !API_KEY) {
    setLoader("Brak klucza mapy — dodaj VITE_CESIUM_ION_KEY do .env", 0);
    return;
  }
  setLoader("Ładuję fotorealistyczną Polskę…", 0.15);

  scene = new Scene();
  scene.background = new Color(0x8ec8e8);
  scene.fog = new FogExp2(0x9dd0ea, 0.00007);

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x8ec8e8);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = 4;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = 2; // PCFSoft
  renderer.domElement.id = "game-canvas";
  document.body.appendChild(renderer.domElement);

  scene.add(new HemisphereLight(0xbfd8ee, 0x5a7048, 1.15));
  sun = new DirectionalLight(0xfff2dd, 2.0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 2500;
  sun.shadow.camera.left = -450;
  sun.shadow.camera.right = 450;
  sun.shadow.camera.top = 450;
  sun.shadow.camera.bottom = -450;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 2.0;
  scene.add(sun);
  scene.add(sun.target);

  camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.5, 1e8);

  tiles = new TilesRenderer();
  if (ION_KEY) {
    tiles.registerPlugin(
      new CesiumIonAuthPlugin({
        apiToken: ION_KEY,
        assetId: ION_GOOGLE_TILES_ASSET,
        autoRefreshToken: true,
      })
    );
  } else {
    tiles.registerPlugin(new GoogleCloudAuthPlugin({ apiToken: API_KEY }));
  }
  tiles.registerPlugin(new TileCompressionPlugin());
  tiles.registerPlugin(new UpdateOnChangePlugin());
  tiles.registerPlugin(new UnloadTilesPlugin());
  tiles.registerPlugin(new TilesFadePlugin());
  tiles.registerPlugin(
    new GLTFExtensionsPlugin({ dracoLoader: new DRACOLoader() })
  );
  tiles.group.rotation.x = -Math.PI / 2;
  scene.add(tiles.group);
  tiles.setResolutionFromRenderer(camera, renderer);
  tiles.setCamera(camera);
  tiles.errorTarget = 10; // niżej = więcej zapytań niż Google nadąża strumieniować
  tiles.lruCache.maxSize = 3000;
  tiles.lruCache.maxBytesSize = 1.5e9;

  // czytelny komunikat zamiast wiecznego ładowania
  tiles.addEventListener("load-error", () => {
    if (!loaderDismissed) {
      loadError = ION_KEY
        ? "Cesium ion nie odpowiada — sprawdź token VITE_CESIUM_ION_KEY"
        : "Google zablokowało kafelki 3D dla kont z EEA — dodaj VITE_CESIUM_ION_KEY do .env";
    }
  });
  setTimeout(() => {
    if (!loaderDismissed && tiles.group.children.length === 0) {
      loadError = ION_KEY
        ? "Mapa nie dochodzi… sprawdź token VITE_CESIUM_ION_KEY"
        : "Google wyłączyło kafelki 3D dla kont z EEA — potrzebny darmowy token Cesium ion (VITE_CESIUM_ION_KEY w .env)";
    }
  }, 20000);

  // niebo — proceduralna kopuła (gradient + słońce + chmury FBM),
  // horyzont = dokładnie kolor mgły, więc nie ma przerwy ani poświaty
  sky = createSky(0x9dd0ea);
  scene.add(sky.mesh);

  // panorama HDRI tylko jako źródło światła otoczenia (IBL), nie jako tło
  new TextureLoader().load(asset("textures/sky_day.jpg"), (tex) => {
    tex.mapping = EquirectangularReflectionMapping;
    tex.colorSpace = SRGBColorSpace;
    scene.environment = tex;
  });

  beacon = createBeacon();
  beacon.visible = false;
  scene.add(beacon);

  loadPlane(selectedPlane);
  resetFlight(startLat, startLon);

  window.addEventListener("resize", onResize);
  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    window.__ctxLost = true;
  });
  window.__game = { get planeMesh() { return planeMesh; }, get plane() { return plane; }, get camera() { return camera; } };
  window.__scene = scene;
}

function loadPlane(key) {
  const spec = PLANES[key];
  camOffset = spec.cam;
  if (planeMesh) scene.remove(planeMesh);
  planeMesh = createPlaneMesh(); // fallback na czas ładowania
  planeMesh.userData.key = key;
  scene.add(planeMesh);

  new GLTFLoader().load(spec.file, (gltf) => {
    const model = gltf.scene;
    if (spec.prepare) spec.prepare(model); // np. poza czarownicy + miotła
    const box = new Box3().setFromObject(model);
    const size = box.getSize(new Vector3());
    model.scale.setScalar(spec.wingspan / Math.max(size.x, size.y, size.z));
    box.setFromObject(model);
    model.position.sub(box.getCenter(new Vector3()));
    model.traverse((o) => {
      if (o.isMesh && o.material) {
        o.material.metalness = 0.15;
        o.material.roughness = 0.65;
        o.castShadow = true;
      }
    });
    const wrapper = new Group();
    wrapper.add(model);
    wrapper.userData.prop = null;
    wrapper.userData.key = key;
    scene.remove(planeMesh);
    planeMesh = wrapper;
    scene.add(planeMesh);
  });
}

function resetFlight(latDeg, lonDeg) {
  const spec = PLANES[selectedPlane];
  startLat = latDeg;
  startLon = lonDeg;
  // wysoki spawn poza nizinną Polską, żeby nie trafić w góry zanim teren się zmierzy
  // (menu i tak zostaje do czasu dosadzenia — spawn jest niewidoczny)
  const spawnAlt = mode === "guess" ? (guessScope === "pl" ? 3000 : 9500) : 6000;
  plane = new PlaneController(latDeg, lonDeg, spawnAlt, 0, spec);
  groundAlt = TERRAIN_ALT;
  pendingSnap = true; // udany, ustabilizowany pomiar terenu dosadzi samolot na właściwą wysokość
  snapLastGh = null;
  snapStableCount = 0;
  crashed = false;
  finished = false;
  shake = 0;
  ctrl.roll = 0;
  ctrl.pitch = 0;
  camInit = false;
  if (planeMesh) planeMesh.visible = true;
  hideBanner();
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
}

function frameAt(lat, lon, height, az, elv, roll) {
  const m = new Matrix4();
  WGS84_ELLIPSOID.getObjectFrame(lat, lon, height, az, elv, roll, m, CAMERA_FRAME);
  m.premultiply(tiles.group.matrixWorld);
  return m;
}

function probeGround(lat, lon, refHeight) {
  const origin = new Vector3();
  WGS84_ELLIPSOID.getCartographicToPosition(lat, lon, refHeight + 100, origin);
  origin.applyMatrix4(tiles.group.matrixWorld);
  const dir = origin.clone().normalize().negate();
  raycaster.set(origin, dir);
  raycaster.far = refHeight + 1200; // musi sięgnąć poziomu morza nawet z wysokiego spawnu
  const hits = raycaster.intersectObject(tiles.group, true);
  if (hits.length > 0) {
    const lla = {};
    const p = hits[0].point.clone();
    p.applyMatrix4(tiles.group.matrixWorld.clone().invert());
    WGS84_ELLIPSOID.getPositionToCartographic(p, lla);
    return lla.height;
  }
  return null;
}

// czy punkt w świecie (np. końcówka skrzydła) jest w/bardzo blisko terenu
const _rayOrigin = new Vector3();
const _rayDown = new Vector3();
function hitTerrainAt(worldPos, margin) {
  _rayDown.copy(worldPos).normalize().negate(); // radialnie w dół
  _rayOrigin.copy(worldPos).addScaledVector(_rayDown, -600);
  raycaster.set(_rayOrigin, _rayDown);
  raycaster.far = 1200;
  const hits = raycaster.intersectObject(tiles.group, true);
  if (!hits.length) return false;
  // AGL punktu = dystans promienia - 600; kraksa gdy punkt jest <= margin nad terenem
  return hits[0].distance - 600 < margin;
}

const _rightWing = new Vector3();
const _wingTip = new Vector3();
function wingHit() {
  const half = PLANES[selectedPlane].wingspan * 0.45;
  _rightWing.set(1, 0, 0).applyQuaternion(planeQuat);
  for (const s of [-1, 1]) {
    _wingTip.copy(planePos).addScaledVector(_rightWing, s * half);
    if (hitTerrainAt(_wingTip, 1.5)) return true;
  }
  return false;
}

function crash() {
  crashed = true;
  timerActive = false;
  explosions.push(createExplosion(scene, planePos.clone()));
  playExplosionSound();
  shake = 1;
  planeMesh.visible = false;
  setTimeout(() => showBanner("ROZBIŁEŚ SIĘ"), 900);
}

async function geocodeCity(name) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(name);
  const res = await fetch(url, { headers: { "Accept-Language": "pl" } });
  if (!res.ok) throw new Error("http " + res.status);
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

function placeBeaconAt(latDeg, lonDeg) {
  const gh = probeGround(latDeg * (Math.PI / 180), lonDeg * (Math.PI / 180), TERRAIN_ALT + 200);
  const base = gh !== null ? gh : TERRAIN_ALT;
  beaconGrounded = gh !== null;
  const m = frameAt(latDeg * (Math.PI / 180), lonDeg * (Math.PI / 180), base, 0, 0, 0);
  m.decompose(beacon.position, beacon.quaternion, beacon.scale);
  beacon.visible = true;
}

// --- start gry ---
async function startGame() {
  el.start.disabled = true;
  el.menuError.textContent = "";
  try {
    if (mode === "free") {
      const city = el.city.value.trim() || "Niepruszewo";
      el.menuError.textContent = `Szukam: ${city}…`;
      const loc = await geocodeCity(city);
      if (!loc) return menuFail(`Nie znaleziono miejscowości „${city}"`);
      beginFlight(loc.lat, loc.lon);
    } else if (mode === "home") {
      const addr = el.city.value.trim();
      if (!addr) return menuFail("Wpisz swój adres");
      el.menuError.textContent = "Szukam adresu…";
      const loc = await geocodeCity(addr);
      if (!loc) return menuFail("Nie znaleziono takiego adresu");
      homeTarget = loc;
      const start = offsetPoint(loc.lat, loc.lon, 20 + Math.random() * 10);
      timeLeft = HOME_TIME;
      timerActive = false; // włączy się po dosadzeniu (finishSnapStart)
      beginFlight(start.lat, start.lon);
      placeBeaconAt(loc.lat, loc.lon);
    } else {
      const scope = GUESS_SCOPES[guessScope];
      el.menuError.textContent = scope.status;
      geoCache = await scope.load();
      const p = scope.random(geoCache);
      timeLeft = GUESS_TIME;
      timerActive = false; // włączy się po dosadzeniu (finishSnapStart)
      beginFlight(p.lat, p.lon);
    }
  } catch {
    menuFail("Błąd — sprawdź sieć i spróbuj ponownie");
  }
}

function menuFail(msg) {
  el.menuError.textContent = msg;
  el.start.disabled = false;
}

function beginFlight(lat, lon) {
  el.menuError.textContent = "";
  if (selectedPlane !== planeMesh?.userData?.key) loadPlane(selectedPlane);
  resetFlight(lat, lon);
  el.timerBox.classList.toggle("show", mode !== "free");
  el.distBox.classList.remove("show");
  // menu zostaje we wszystkich trybach — gracz nie widzi wysokiego spawnu,
  // a samolot nie jest szarpany dosadzeniem w trakcie sterowania
  awaitingSnap = true;
  awaitingSnapSince = performance.now();
  el.menuError.textContent = "Ładowanie terenu…";
}

// wywoływane gdy teren zmierzony — właściwy start gry
function finishSnapStart() {
  menuOpen = false;
  guessOpen = false;
  guessAnswered = false;
  el.menu.classList.add("hidden");
  el.guessmap.classList.remove("show");
  el.menuError.textContent = "";
  carousel.setActive(false);
  timerActive = mode !== "free";
}

function unlockAudio() {
  primeAudio();
  primeMusic();
}
window.addEventListener("pointerdown", unlockAudio);
window.addEventListener("keydown", unlockAudio);

el.start.addEventListener("click", () => {
  unlockAudio();
  startGame();
});
el.city.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startGame();
});

// --- pauza (ESC) ---
function setPaused(v) {
  paused = v;
  keys.clear();
  el.pause.classList.toggle("show", v);
}

el.resume.addEventListener("click", () => setPaused(false));
el.restart.addEventListener("click", () => {
  setPaused(false);
  backToMenu();
});

function backToMenu() {
  hideBanner();
  menuOpen = true;
  timerActive = false;
  guessOpen = false;
  awaitingSnap = false;
  beacon.visible = false;
  el.guessmap.classList.remove("show");
  el.start.disabled = false;
  el.menuError.textContent = "";
  el.menu.classList.remove("hidden");
  carousel.setActive(true);
}

// --- mapa zgadywania ---
function drawGuessMap(marks = []) {
  GUESS_SCOPES[guessScope].draw(el.gmCanvas, geoCache, marks);
}

function openGuessMap() {
  guessOpen = true;
  guessAnswered = false;
  keys.clear();
  el.gmResult.textContent = "";
  el.gmClose.style.display = "none";
  el.gmRetry.style.display = "none";
  el.gmSub.textContent = GUESS_SCOPES[guessScope].sub;
  el.guessmap.classList.add("show");
  // canvas musi mieć wymiary zanim narysujemy
  requestAnimationFrame(() => drawGuessMap());
}

el.gmCanvas.addEventListener("click", (e) => {
  if (guessAnswered) return;
  const rect = el.gmCanvas.getBoundingClientRect();
  const { lon, lat } = GUESS_SCOPES[guessScope].unproject(
    e.clientX - rect.left,
    e.clientY - rect.top,
    rect.width,
    rect.height
  );
  const errKm = distanceM(lat, lon, plane.latDeg, plane.lonDeg) / 1000;
  guessAnswered = true;
  drawGuessMap([
    { lat: plane.latDeg, lon: plane.lonDeg, color: "#d8a24a", label: "Tu byłeś" },
    { lat, lon, color: "#f3ead6", label: "Twój strzał" },
  ]);
  el.gmResult.textContent = `Różnica: ${Math.round(errKm)} km`;
  el.gmClose.style.display = "";
  el.gmRetry.style.display = "";
});

el.gmClose.addEventListener("click", () => {
  el.guessmap.classList.remove("show");
  backToMenu();
});

el.bannerRetry.addEventListener("click", () => restartMode());
el.bannerMenu.addEventListener("click", () => {
  hideBanner();
  backToMenu();
});

el.gmRetry.addEventListener("click", () => {
  // overlay zostaje — nowy punkt ładuje się pod spodem, start po dosadzeniu na ~500 m
  el.gmResult.textContent = "Losuję nowy punkt…";
  el.gmRetry.style.display = "none";
  el.gmClose.style.display = "none";
  restartMode(); // ustawia awaitingSnap — overlay zamknie finishSnapStart
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!menuOpen && !guessOpen) setPaused(!paused);
    return;
  }
  if (e.target && e.target.tagName === "INPUT") return;
  if (menuOpen || paused || guessOpen) return;
  const k = e.key.toLowerCase();
  keys.add(k);
  if (k === "r" && (crashed || finished)) restartMode();
});
window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

function restartMode() {
  if (mode === "home" && homeTarget) {
    timeLeft = HOME_TIME;
    timerActive = false; // włączy się po dosadzeniu (finishSnapStart)
    awaitingSnap = true;
    awaitingSnapSince = performance.now();
    resetFlight(startLat, startLon);
    placeBeaconAt(homeTarget.lat, homeTarget.lon);
  } else if (mode === "guess" && geoCache) {
    const p = GUESS_SCOPES[guessScope].random(geoCache);
    timeLeft = GUESS_TIME;
    timerActive = false; // włączy się po dosadzeniu (finishSnapStart)
    awaitingSnap = true;
    awaitingSnapSince = performance.now();
    resetFlight(p.lat, p.lon);
  } else {
    awaitingSnap = true;
    awaitingSnapSince = performance.now();
    resetFlight(startLat, startLon);
  }
}

const camPos = new Vector3();
const camTarget = new Vector3();
const planePos = new Vector3();
const planeQuat = new Quaternion();
const offset = new Vector3();
const camFramePos = new Vector3();
const camFrameQuat = new Quaternion();
const camFrameScale = new Vector3();
const skyQuat = new Quaternion(); // lokalna ramka N/S (bez kursu) — dla kopuły nieba i słońca
const skyFramePos = new Vector3();
const skyFrameScale = new Vector3();
let camInit = false;

init();
animate();

function animate() {
  requestAnimationFrame(animate);
  if (!tiles || !plane) return;

  const dt = Math.min(clock.getDelta(), 0.05);
  frameCount += 1;
  scene.updateMatrixWorld();

  const flying = !menuOpen && !paused && !guessOpen && !crashed && !finished;

  // sterowanie WASD (jak w GTA) — bez myszy
  const rollIn =
    (keys.has("d") || keys.has("arrowright") ? 1 : 0) -
    (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
  const pitchIn =
    (keys.has("w") || keys.has("arrowup") ? 1 : 0) -
    (keys.has("s") || keys.has("arrowdown") ? 1 : 0);
  ctrl.roll += (rollIn - ctrl.roll) * Math.min(1, 6 * dt);
  ctrl.pitch += (pitchIn - ctrl.pitch) * Math.min(1, 6 * dt);
  ctrl.throttle = keys.has("shift") ? 1 : keys.has("control") ? -1 : 0;

  if (flying) plane.update(dt, ctrl);

  // dźwięk silnika — obroty z przepustnicy i prędkości, opływ z prędkości
  const speed01 = plane.speed / plane.boost;
  const rpm01 = Math.min(
    1,
    Math.max(
      0.15,
      0.3 + speed01 * 0.5 + (ctrl.throttle > 0 ? 0.3 : ctrl.throttle < 0 ? -0.18 : 0)
    )
  );
  updateEngineSound(flying, rpm01, speed01, PLANES[selectedPlane].sound);
  updateMusic();

  // pozycja i orientacja samolotu
  const m = frameAt(plane.lat, plane.lon, plane.height, plane.heading, plane.pitch, -plane.roll);
  m.decompose(planePos, planeQuat, planeMesh.scale);
  planeMesh.position.copy(planePos);
  planeMesh.quaternion.copy(planeQuat);
  if (planeMesh.userData.prop) {
    planeMesh.userData.prop.rotation.z += plane.speed * dt * 1.6;
  }

  // sztywna kamera za samolotem — tylko kurs, bez przechyłu/pochylenia
  const camFrame = frameAt(plane.lat, plane.lon, plane.height, plane.heading, 0, 0);
  camFrame.decompose(camFramePos, camFrameQuat, camFrameScale);
  offset.set(camOffset[0], camOffset[1], camOffset[2]).applyQuaternion(camFrameQuat).add(planePos);
  if (!camInit) {
    camPos.copy(offset);
    camInit = true;
  } else {
    camPos.lerp(offset, 1 - Math.exp(-14 * dt));
  }
  camera.position.copy(camPos);
  // trzęsienie kamery po wybuchu
  if (shake > 0) {
    shake = Math.max(0, shake - dt * 1.3);
    const s = shake * shake * 7;
    camera.position.x += (Math.random() - 0.5) * s;
    camera.position.y += (Math.random() - 0.5) * s;
    camera.position.z += (Math.random() - 0.5) * s;
  }
  camTarget.set(0, 0.5, -camOffset[2] * 1.6).applyQuaternion(camFrameQuat).add(planePos);
  camera.up.set(0, 1, 0).applyQuaternion(camFrameQuat); // lokalny pion, nie globalny Y
  camera.lookAt(camTarget);

  // kopuła nieba i słońce w LOKALNEJ ramce północnej (bez kursu) —
  // globalna oś Y jest przechylona ~38° względem horyzontu na szer. 52°N,
  // co dawało ukośną granicę nieba i błękitną poświatę
  frameAt(plane.lat, plane.lon, plane.height, 0, 0, 0).decompose(skyFramePos, skyQuat, skyFrameScale);
  sky.mesh.position.copy(camPos);
  sky.mesh.quaternion.copy(skyQuat);
  sky.uniforms.uTime.value = clock.elapsedTime;

  offset.copy(SUN_DIR).applyQuaternion(skyQuat);
  sun.position.copy(offset).multiplyScalar(700).add(planePos);
  sun.target.position.copy(planePos);
  sun.target.updateMatrixWorld();

  // nowe kafelki muszą rzucać i odbierać cienie
  if (frameCount % 15 === 0) {
    tiles.group.traverse((o) => {
      if (o.isMesh && !o.castShadow) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  // poszerzenie FOV przy nitrie — efekt prędkości
  const targetFov = plane.speed > plane.cruise * 1.2 ? 78 : 70;
  if (Math.abs(camera.fov - targetFov) > 0.05) {
    camera.fov += (targetFov - camera.fov) * Math.min(1, 3 * dt);
    camera.updateProjectionMatrix();
  }

  // wysokość nad terenem + dosadzenie po teleporcie + kolizja
  if (frameCount % 8 === 0) {
    const gh = probeGround(plane.lat, plane.lon, plane.height);
    if (gh !== null) {
      groundAlt = gh;
      if (pendingSnap) {
        // podążaj za doprecyzowującym się terenem; dosadź gdy pomiar się ustabilizuje
        // i nic się już nie doczytuje — inaczej zgrubny kafelek daje kraksę albo 1300 m
        plane.height = gh + (mode === "guess" ? 350 : 320);
        if (snapLastGh !== null && Math.abs(gh - snapLastGh) < 25 && !tiles.isLoading) {
          snapStableCount += 1;
        } else {
          snapStableCount = 0;
        }
        snapLastGh = gh;
        if (snapStableCount >= 2) {
          pendingSnap = false;
          if (awaitingSnap) {
            awaitingSnap = false;
            finishSnapStart();
          }
        }
      }
    }
  }
  // teren się nie zmierzył (sieć/błąd kafelków) — startuj mimo to
  if (awaitingSnap && performance.now() - awaitingSnapSince > 15000) {
    awaitingSnap = false;
    pendingSnap = false;
    finishSnapStart();
  }
  const agl = plane.height - groundAlt;
  // bez kolizji podczas dosadzania — pomiar gruntu jeszcze się doprecyzowuje
  if (flying && !pendingSnap && (agl < 4 || (frameCount % 4 === 0 && wingHit()))) {
    crash();
  }

  // aktywne wybuchy
  for (let i = explosions.length - 1; i >= 0; i--) {
    if (!explosions[i].update(dt)) explosions.splice(i, 1);
  }

  // latarnia celu — dogruntuj gdy kafelki się dociążą
  if (beacon.visible) {
    beacon.userData.ring.rotation.z += dt * 0.8;
    if (!beaconGrounded && frameCount % 60 === 0 && homeTarget) {
      placeBeaconAt(homeTarget.lat, homeTarget.lon);
    }
  }

  // tryby: timer + warunki wygranej
  if (timerActive && !menuOpen && !paused && !guessOpen && !crashed && !finished) {
    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      timerActive = false;
      if (mode === "home") {
        finished = true;
        showBanner("CZAS MINĄŁ");
      } else if (mode === "guess") {
        openGuessMap();
      }
    }
  }
  if (mode === "home" && homeTarget && flying) {
    const dist = distanceM(plane.latDeg, plane.lonDeg, homeTarget.lat, homeTarget.lon);
    if (dist < HOME_CAPTURE_M) {
      finished = true;
      timerActive = false;
      beacon.visible = false;
      showBanner("DOTARŁEŚ DO DOMU!");
    }
  }

  // HUD
  if (frameCount % 2 === 0) updateHud(agl);

  // kafelki
  tiles.setResolutionFromRenderer(camera, renderer);
  tiles.setCamera(camera);
  camera.updateMatrixWorld();
  tiles.update();

  if (!loaderDismissed && tiles.group.children.length > 0) {
    loaderDismissed = true;
    hideLoader();
  }
  if (!loaderDismissed) {
    setLoader(
      loadError ?? "Ładuję fotorealistyczną Polskę…",
      loadError ? 0.05 : Math.min(0.9, 0.15 + tiles.group.children.length * 0.02)
    );
  }

  renderer.render(scene, camera);

  window.__dbg = {
    frame: frameCount,
    children: tiles.group.children.length,
    speed: plane.speed,
    height: plane.height,
    groundAlt,
    lat: plane.latDeg,
    lon: plane.lonDeg,
    mode,
    timeLeft,
    ctxLost: !!window.__ctxLost,
    loading: tiles.isLoading,
    visibleTiles: tiles.visibleTiles?.size ?? -1,
    explosions: explosions.length,
    crashed,
    audio: engineDebug(),
    music: musicDebug(),
    camDist: camera.position.distanceTo(planePos),
    camOffset,
  };
  window.__cam = camera;
  window.__planeMesh = planeMesh;
}

function updateHud(agl) {
  // skala prędkościomierza pod najszybszy pojazd (nitro), zaokrąglona w górę
  const maxKmh = Math.ceil((PLANES[selectedPlane].boost * 3.6) / 200) * 200;
  if (el.gSpeed) drawAirspeed(el.gSpeed, plane.kmh, maxKmh);
  if (el.gAlt) drawAltimeter(el.gAlt, Math.max(0, agl));
  if (el.gHdg) drawCompass(el.gHdg, plane.headingDeg);

  if (timerActive || mode !== "free") {
    const tsec = Math.max(0, Math.ceil(timeLeft));
    const mm = Math.floor(tsec / 60);
    const ss = String(tsec % 60).padStart(2, "0");
    el.timer.textContent = `${mm}:${ss}`;
    el.timer.classList.toggle("low", tsec <= 30 && timerActive);
  }
  if (mode === "home" && homeTarget) {
    const dist = distanceM(plane.latDeg, plane.lonDeg, homeTarget.lat, homeTarget.lon);
    el.dist.textContent = `${(dist / 1000).toFixed(1)} km`;
  }
}

function showBanner(title, sub = "") {
  if (!el.banner) return;
  el.banner.querySelector(".b-title").textContent = title;
  const subEl = el.banner.querySelector(".b-sub");
  subEl.textContent = sub;
  subEl.style.display = sub ? "" : "none";
  el.banner.classList.add("show");
}

function hideBanner() {
  if (el.banner) el.banner.classList.remove("show");
}
