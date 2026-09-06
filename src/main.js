import {
  WGS84_ELLIPSOID,
  CAMERA_FRAME,
  TilesRenderer,
} from "3d-tiles-renderer";
import {
  TilesFadePlugin,
  UpdateOnChangePlugin,
  UnloadTilesPlugin,
  TileCompressionPlugin,
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
  LinearFilter,
  LinearMipmapLinearFilter,
  Box3,
  Group,
  Mesh,
  MeshBasicMaterial,
  ConeGeometry,
  CylinderGeometry,
} from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { setLoader, hideLoader } from "./game/hud.js";
import { createPlaneMesh, PlaneController } from "./game/plane.js";
import { applyRotorState, spinRotors } from "./game/rotors.js";
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
import { updateMusic, primeMusic, musicDebug, musicEnabled, setMusicEnabled } from "./game/music.js";
import {
  TileKeyPool,
  loadTileSlots,
  syncTileAuth,
  applyTileQuality,
  flushTilesForWarp,
} from "./game/tileAuth.js";
import { createFreeMap, createMiniMap, paintTrailMap } from "./game/freeMap.js";

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
  pickGuessStart,
  drawPolandMap,
  loadCountryGeo,
  loadContinentGeo,
  unprojectCountry,
  unprojectContinent,
  drawEuropeMap,
  loadWorldGeo,
  drawWorldMap,
  unprojectWorld,
  loadEuropeGeo,
} from "./game/modes.js";
import {
  detectLocale,
  getRegionPack,
  setRegionPack,
  regionPayload,
  guessHoldAlt,
} from "./game/regions.js";
import {
  parseRoomFromUrl,
  roomLink,
  setRoomUrl,
  hostRoom,
  joinRoom,
  wasHosting,
  rememberHost,
} from "./game/net.js";
import {
  bindVoice,
  ensureMic,
  setTalking,
  isTalking,
  voiceDenied,
  answerCall,
  syncVoiceCalls,
  dropVoicePeer,
  destroyVoice,
} from "./game/voice.js";

// zakresy trybu "Zgadnij region"
const GUESS_SCOPES = {
  pl: {
    load: loadCountryGeo,
    draw: drawPolandMap,
    unproject: unprojectCountry,
    sub: "Click a point on the map of Poland",
    status: "Picking a point in Poland…",
  },
  eu: {
    load: loadContinentGeo,
    draw: drawEuropeMap,
    unproject: unprojectContinent,
    sub: "Click a point on the map of Europe",
    status: "Picking a point in Europe…",
  },
  world: {
    load: loadWorldGeo,
    draw: drawWorldMap,
    unproject: unprojectWorld,
    sub: "Click a point on the world map",
    status: "Picking a point somewhere on Earth…",
  },
};

const tilePool = new TileKeyPool(loadTileSlots());
const TERRAIN_ALT = 120; // przybliżona wysokość elipsoidalna nizin

// Google wyłączyło Photorealistic 3D Tiles dla kont billingowych z EEA (403).
// Obejście: darmowe konto Cesium ion — serwuje te same kafelki Google
// (asset 2275207), plugin sam pobiera brokerowany token i odnawia go co 3 h.
const ION_GOOGLE_TILES_ASSET = "2275207";

const PLANES = {
  pa28: {
    file: asset("models/pa28.glb"),
    wingspan: 11,
    cruise: 48, boost: 130, brake: 30,
    cam: [0, 5.5, 15],
    name: "Piper PA-28",
    desc: "Light propeller – cruise 170, max 470 km/h",
    sound: "plane",
  },
  q400: {
    file: asset("models/q400.glb"),
    wingspan: 28,
    cruise: 75, boost: 185, brake: 45,
    cam: [0, 9, 32],
    name: "Dash 8 Q400",
    desc: "Regional turboprop – cruise 270, max 670 km/h",
    sound: "plane",
  },
  citation: {
    file: asset("models/citation.glb"),
    wingspan: 16,
    cruise: 92, boost: 250, brake: 55,
    cam: [0, 7, 24],
    name: "Cessna Citation",
    desc: "Business jet – cruise 330, max 900 km/h",
    sound: "jet",
  },
  jet: {
    file: asset("models/jet.glb"),
    wingspan: 10,
    cruise: 150, boost: 420, brake: 80,
    cam: [0, 6, 19],
    name: "Fighter",
    desc: "Combat jet – cruise 540, max 1510 km/h",
    sound: "jet",
    prepare: prepareJet,
  },
  rocket: {
    file: asset("models/rocket.glb"),
    wingspan: 12,
    cruise: 220, boost: 600, brake: 120,
    cam: [0, 6, 20],
    name: "Rocket",
    desc: "Space rocket – cruise 790, max 2160 km/h",
    sound: "rocket",
    prepare: prepareRocket,
  },
};
const PLANE_ORDER = ["pa28", "q400", "citation", "jet", "rocket"];

const HOME_TIME = 600; // 10 min na dolot do domu
const GUESS_TIME = 60; // 1 min na rozpoznanie terenu
const MARK_TIME = 10;
const RESULTS_TIME = 10;
const HOME_CAPTURE_M = 600;
const HOME_BEACON_M = 1000;

let camera, scene, renderer, tiles, sun, sky;
let tile429Count = 0;
let lastFailedRetryAt = 0;
let lastTileErr = "";
let pendingFailedRetry = false;

function onTileThrottle(status = 429) {
  tile429Count += 1;
  lastTileErr = String(status);
  pendingFailedRetry = true;
}

function retryFailedTiles(force = false) {
  if (!tiles) return;
  const failed = tiles.stats?.failed || 0;
  if (!failed || (!force && !pendingFailedRetry)) return;
  const now = performance.now();
  if (!force && now - lastFailedRetryAt < 1500) return;
  lastFailedRetryAt = now;
  pendingFailedRetry = false;
  resetFailedTilesSafe();
}

function resetFailedTilesSafe() {
  if (!tiles) return;
  try {
    if (tiles.rootLoadingState === -1) tiles.rootLoadingState = 0;
    if (!(tiles.stats?.failed)) return;
    tiles.traverse?.((tile) => {
      if (tile?.internal?.loadingState === -1) tile.internal.loadingState = 0;
    }, null, false);
    tiles.stats.failed = 0;
  } catch (err) {
    lastTileErr = String(err?.message || err).slice(0, 220);
  }
}

function updateTilesSafe() {
  if (!tiles) return;
  try {
    tiles.update();
  } catch (err) {
    lastTileErr = String(err?.message || err).slice(0, 220);
    pendingFailedRetry = true;
  }
}
let planeMesh, plane, beacon;
let groundAlt = TERRAIN_ALT;
let lastSafeAgl = 200;
let crashed = false;
let finished = false;
let loaderDismissed = false;
let gameReady = false;
const isMobile =
  typeof navigator !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && matchMedia("(pointer: coarse)").matches));
const START_FLAG = "fotw_starting";
const LAST_ERR = "fotw_lasterr";
function markStarting() {
  try { sessionStorage.setItem(START_FLAG, String(Date.now())); } catch { /* ignore */ }
}
function clearStarting() {
  try { sessionStorage.removeItem(START_FLAG); } catch { /* ignore */ }
}
function crashedLastStart() {
  try {
    const t = Number(sessionStorage.getItem(START_FLAG) || 0);
    return t > 0 && Date.now() - t < 60000;
  } catch {
    return false;
  }
}
function rememberError(msg) {
  try { sessionStorage.setItem(LAST_ERR, String(msg || "").slice(0, 280)); } catch { /* ignore */ }
}
function lastError() {
  try { return sessionStorage.getItem(LAST_ERR) || ""; } catch { return ""; }
}
function clearError() {
  try { sessionStorage.removeItem(LAST_ERR); } catch { /* ignore */ }
}
const liteMode = isMobile;
if (liteMode) document.body.classList.add("lite");
let loadError = null;
let frameCount = 0;
let selectedPlane = "pa28";
let menuOpen = true;
let paused = false;
let leaveOpen = false;
let pendingSnap = false; // po teleporcie: jednorazowe dosadzenie na właściwą wysokość
let crashGraceUntil = 0;
let crashStreak = 0;
const groundSamples = [];
let startLat = 52.38871, startLon = 16.60069; // Niepruszewo
let camOffset = PLANES.pa28.cam;

// tryby gry
let mode = "free"; // free | home | guess
let homeTarget = null;
const homePath = [];
let timeLeft = 0;
let timerActive = false;
let guessOpen = false;
let guessAnswered = false;
let guessScope = "pl"; // pl | world
let awaitingSnap = false; // guess: menu/overlay czeka na pomiar terenu, start od razu na ~350 m
let awaitingSnapSince = 0;
let snapLastGh = null; // dosadzenie dopiero gdy pomiar terenu się ustabilizuje (kafelki się doprecyzują)
let snapStableCount = 0;
let snapFirstAt = 0;
let geoCache = null;
let geoCacheScope = null;
let geoLoadId = 0;
let beaconGrounded = false;
const explosions = [];
let shake = 0;
const matePos = new Vector3();
const mateQuat = new Quaternion();
const mateScale = new Vector3();
const mateUp = new Vector3();
const MATE_MARKER_MS = 10000;
const MATE_INTERP_MS = 130;
const MATE_SEND_MS = 40;
const PLAYER_COLORS = ["#7ec8e3", "#e37e7e", "#9dce6a", "#d4a5f5", "#f0c36e", "#6ec8c1"];
const NAME_ADJ = ["Swift", "Silent", "Red", "Night", "Wild", "White", "Golden", "Sky", "Sharp", "Storm", "Keen", "Bold"];
const NAME_NOUN = ["Eagle", "Falcon", "Wolf", "Fox", "Hawk", "Lynx", "Raven", "Badger", "Gnat", "Stag", "Puma", "Shark"];

function randomUsername() {
  const a = NAME_ADJ[Math.floor(Math.random() * NAME_ADJ.length)];
  const n = NAME_NOUN[Math.floor(Math.random() * NAME_NOUN.length)];
  return `${a} ${n}`;
}

const NICK_KEY = "foe-nick";
const JOIN_KEY = "foe-join";
const GUESS_STATS_KEY = "foe-guess-stats";
let pendingJoinId = "";
let helloTimer = 0;
let welcomed = false;

function loadGuessStats() {
  try {
    const raw = JSON.parse(localStorage.getItem(GUESS_STATS_KEY) || "");
    const n = Number(raw?.n) || 0;
    const sum = Number(raw?.sum) || 0;
    const min = Number(raw?.min);
    const max = Number(raw?.max);
    if (n > 0 && Number.isFinite(sum)) {
      return {
        n,
        sum,
        min: Number.isFinite(min) ? min : Infinity,
        max: Number.isFinite(max) ? max : 0,
      };
    }
  } catch {
    /* ignore */
  }
  return { n: 0, sum: 0, min: Infinity, max: 0 };
}

let guessStats = loadGuessStats();

function storeGuessStats() {
  try {
    localStorage.setItem(
      GUESS_STATS_KEY,
      JSON.stringify({
        n: guessStats.n,
        sum: guessStats.sum,
        min: Number.isFinite(guessStats.min) ? guessStats.min : 0,
        max: guessStats.max,
      })
    );
  } catch {
    /* ignore */
  }
}

function fmtGuessKm(km) {
  if (!Number.isFinite(km)) return "–";
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

function recordSoloGuess(errKm) {
  if (!Number.isFinite(errKm) || errKm < 0) return;
  guessStats.n += 1;
  guessStats.sum += errKm;
  guessStats.min = Math.min(guessStats.min, errKm);
  guessStats.max = Math.max(guessStats.max, errKm);
  storeGuessStats();
  renderGuessStats();
}

function renderGuessStats() {
  if (!guessStats.n) {
    if (el.gmAvg) el.gmAvg.textContent = "–";
    if (el.gmMin) el.gmMin.textContent = "–";
    if (el.gmMax) el.gmMax.textContent = "–";
    if (el.gmStatsN) el.gmStatsN.textContent = "No guesses yet";
    return;
  }
  if (el.gmAvg) el.gmAvg.textContent = fmtGuessKm(guessStats.sum / guessStats.n);
  if (el.gmMin) el.gmMin.textContent = fmtGuessKm(guessStats.min);
  if (el.gmMax) el.gmMax.textContent = fmtGuessKm(guessStats.max);
  if (el.gmStatsN) el.gmStatsN.textContent = guessStats.n === 1 ? "1 guess" : `${guessStats.n} guesses`;
}

function syncGuessHud() {
  const show =
    mode === "guess" &&
    !mp.active &&
    !menuOpen &&
    !paused &&
    !leaveOpen &&
    !guessOpen &&
    guessStats.n > 0;
  if (el.guessHud) el.guessHud.hidden = !show;
  if (show) renderGuessStats();
}

function savedNick() {
  try {
    return String(localStorage.getItem(NICK_KEY) || "").trim();
  } catch {
    return "";
  }
}

function storeNick(name) {
  try {
    localStorage.setItem(NICK_KEY, name);
  } catch {
    /* ignore */
  }
}

function rememberJoin(id) {
  pendingJoinId = id || "";
  try {
    if (id) sessionStorage.setItem(JOIN_KEY, id);
    else sessionStorage.removeItem(JOIN_KEY);
  } catch {
    /* ignore */
  }
}

function savedJoin() {
  try {
    return String(sessionStorage.getItem(JOIN_KEY) || "").trim();
  } catch {
    return "";
  }
}

function stopHelloRetry() {
  clearInterval(helloTimer);
  helloTimer = 0;
}

function sendHello() {
  if (!mp.active || mp.host || welcomed) return;
  mp.net?.send({ t: "hello", name: mp.myName, plane: selectedPlane });
}

function startHelloRetry() {
  stopHelloRetry();
  welcomed = false;
  sendHello();
  let n = 0;
  helloTimer = setInterval(() => {
    if (welcomed || mp.host || !mp.active) {
      stopHelloRetry();
      return;
    }
    sendHello();
    if (++n >= 15) {
      stopHelloRetry();
      setLobbyStatus("Host not found – they should stay in the room, then open the link again", true);
    }
  }, 800);
}

function normalizeNick(raw) {
  return String(raw || "").replace(/\s+/g, " ").trim().slice(0, 20);
}

function uniquePlayerName(base) {
  const taken = new Set([mp.myName, ...[...mp.players.values()].map((p) => p.name)].filter(Boolean));
  if (base && !taken.has(base)) return base;
  for (let i = 0; i < 40; i++) {
    const next = randomUsername();
    if (!taken.has(next)) return next;
  }
  return base || randomUsername();
}

const mp = {
  active: false,
  host: false,
  hostId: "",
  roomId: "",
  myId: "",
  net: null,
  myName: "Host",
  myReady: false,
  myScore: 0,
  wantPlay: false,
  waiting: false,
  inRound: false,
  roundActive: false,
  players: new Map(),
  guesses: new Map(),
  poses: new Map(),
  mates: new Map(),
  seats: {},
  snapped: new Set(),
  goSent: false,
  waitingGo: false,
  truth: null,
  lastPoseAt: 0,
  poseSeq: 0,
  snapInfo: new Map(),
  rematch: new Set(),
  launching: false,
  goAt: 0,
  lastGo: null,
  talkers: new Set(),
  visibility: "private",
  joining: false,
  roomTitle: "",
  phase: "lobby",
  markLeft: 0,
  resultsLeft: 0,
  phaseLeft: 0,
};
if (import.meta.env.DEV) window.__foeMp = mp;

const ctrl = { roll: 0, pitch: 0, throttle: 0.4 };
let throttleLever = 0.4;
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
  homeTrail: document.getElementById("home-trail"),
  menu: document.getElementById("menu"),
  city: document.getElementById("city-input"),
  start: document.getElementById("start-btn"),
  menuError: document.getElementById("menu-error"),
  modeDesc: document.getElementById("mode-desc"),
  pause: document.getElementById("pause"),
  pauseTitle: document.getElementById("pause-title"),
  pauseSub: document.getElementById("pause-sub"),
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
  gmScoreLeft: document.getElementById("gm-score-left"),
  gmScoreRight: document.getElementById("gm-score-right"),
  guessHud: document.getElementById("f-guess-stats"),
  gmAvg: document.getElementById("gm-avg"),
  gmMin: document.getElementById("gm-min"),
  gmMax: document.getElementById("gm-max"),
  gmStatsN: document.getElementById("gm-stats-n"),
  placeBox: document.getElementById("f-place-box"),
  place: document.getElementById("f-place"),
  mpWait: document.getElementById("mp-wait"),
  mpWaitText: document.getElementById("mp-wait-text"),
  guessScope: document.getElementById("guess-scope"),
  landing: document.getElementById("landing"),
  nick: document.getElementById("nick"),
  nickInput: document.getElementById("nick-input"),
  nickError: document.getElementById("nick-error"),
  nickSub: document.getElementById("nick-sub"),
  nickBack: document.getElementById("nick-back"),
  nickGo: document.getElementById("nick-go"),
  lobby: document.getElementById("lobby"),
  lobbyTitle: document.getElementById("lobby-title"),
  lobbyVis: document.getElementById("lobby-vis"),
  lobbyPhase: document.getElementById("lobby-phase"),
  gmTitle: document.getElementById("gm-title"),
  gmTimer: document.getElementById("gm-timer"),
  btnSolo: document.getElementById("btn-solo"),
  btnMulti: document.getElementById("btn-multi"),
  menuBack: document.getElementById("menu-back"),
  lobbyBack: document.getElementById("lobby-back"),
  lobbyPlayers: document.getElementById("lobby-players"),
  lobbyLink: document.getElementById("lobby-link"),
  lobbyCopy: document.getElementById("lobby-copy"),
  lobbyStart: document.getElementById("lobby-start"),
  lobbyStatus: document.getElementById("lobby-status"),
  lobbyScopes: document.getElementById("lobby-scopes"),
  lobbyModeDesc: document.getElementById("lobby-mode-desc"),
  lobbyCity: document.getElementById("lobby-city"),
  voiceInd: document.getElementById("voice-ind"),
  mpOnline: document.getElementById("mp-online"),
  mpOnlineCount: document.getElementById("mp-online-count"),
  mpTab: document.getElementById("mp-tab"),
  mpTabList: document.getElementById("mp-tab-list"),
  touch: document.getElementById("touch"),
  touchPause: document.getElementById("touch-pause"),
  stick: document.getElementById("stick"),
  stickKnob: document.getElementById("stick-knob"),
  touchBoost: document.getElementById("touch-boost"),
  touchBrake: document.getElementById("touch-brake"),
  throttle: document.getElementById("throttle"),
  throttleRail: document.getElementById("throttle-rail"),
  throttleKnob: document.getElementById("throttle-knob"),
  touchTalk: document.getElementById("touch-talk"),
  touchMap: document.getElementById("touch-map"),
  freemap: document.getElementById("freemap"),
  fmCanvas: document.getElementById("fm-canvas"),
  fmPlace: document.getElementById("fm-place"),
  fmClose: document.getElementById("fm-close"),
  minimap: document.getElementById("minimap"),
  mmCanvas: document.getElementById("mm-canvas"),
  mapNote: document.getElementById("map-note"),
  lobbyCarCanvas: document.getElementById("lobby-carousel-canvas"),
  lobbyCarPrev: document.getElementById("lobby-car-prev"),
  lobbyCarNext: document.getElementById("lobby-car-next"),
  lobbyCarName: document.getElementById("lobby-car-name"),
  lobbyCarDesc: document.getElementById("lobby-car-desc"),
  fatal: document.getElementById("fatal"),
  fatalText: document.getElementById("fatal-text"),
  fatalOk: document.getElementById("fatal-ok"),
  crashNote: document.getElementById("crash-note"),
};

const freeMap = createFreeMap({
  root: el.freemap,
  canvas: el.fmCanvas,
  place: el.fmPlace,
  close: el.fmClose,
  onChange: () => updateLocationMaps(),
});

const miniMap = createMiniMap({
  root: el.minimap,
  canvas: el.mmCanvas,
  onOpen: () => {
    if (!freeMap.open) toggleFreeMap();
  },
});

function canOpenFreeMap() {
  return mode === "free" && !menuOpen && !paused && !guessOpen && !crashed && !finished;
}

function poseForMaps() {
  if (!plane) return null;
  return {
    lat: plane.latDeg,
    lon: plane.lonDeg,
    heading: plane.headingDeg,
    name: el.place?.textContent || "",
  };
}

function updateLocationMaps() {
  const pose = poseForMaps();
  const showMini = canOpenFreeMap() && !freeMap.open;
  if (showMini && pose) {
    miniMap.update(pose.lat, pose.lon, pose.heading);
    miniMap.show();
  } else {
    miniMap.hide();
  }
  if (freeMap.open && pose) {
    freeMap.update(pose.lat, pose.lon, pose.heading, pose.name);
  }
}

let mapNoteTimer = 0;

function hideMapNote() {
  if (mapNoteTimer) {
    clearTimeout(mapNoteTimer);
    mapNoteTimer = 0;
  }
  if (!el.mapNote) return;
  el.mapNote.classList.remove("show");
  el.mapNote.hidden = true;
}

function showMapUnavailable() {
  if (!el.mapNote || menuOpen || paused || guessOpen) return;
  el.mapNote.hidden = false;
  el.mapNote.classList.add("show");
  if (mapNoteTimer) clearTimeout(mapNoteTimer);
  mapNoteTimer = setTimeout(hideMapNote, 2200);
}

function toggleFreeMap() {
  if (!canOpenFreeMap() && !freeMap.open) return;
  if (freeMap.open) {
    freeMap.hide();
    updateLocationMaps();
    return;
  }
  const pose = poseForMaps();
  if (!pose || !canOpenFreeMap()) return;
  freeMap.update(pose.lat, pose.lon, pose.heading, pose.name);
  freeMap.show();
  miniMap.hide();
}

// karuzela pojazdów — jeden duży podgląd, strzałki w bok
const planePreviewItems = PLANE_ORDER.map((k) => ({
  key: k,
  file: PLANES[k].file,
  wingspan: PLANES[k].wingspan,
  prepare: PLANES[k].prepare,
}));
const carousel = createCarousel(el.carCanvas, planePreviewItems, { mobile: isMobile });
let lobbyCarousel = createCarousel(el.lobbyCarCanvas, planePreviewItems, {
  lite: isMobile,
  mobile: isMobile,
});
let lobbyCarouselLive = !isMobile;

function ensureLobbyCarousel() {
  if (lobbyCarouselLive) return;
  lobbyCarousel.dispose();
  lobbyCarousel = createCarousel(el.lobbyCarCanvas, planePreviewItems, { mobile: true });
  lobbyCarouselLive = true;
  lobbyCarousel.show(selectedPlane, 0);
}
let planeIdx = 0;
function selectPlane(i, dir, silent = false) {
  planeIdx = (i + PLANE_ORDER.length) % PLANE_ORDER.length;
  selectedPlane = PLANE_ORDER[planeIdx];
  carousel.show(selectedPlane, dir);
  lobbyCarousel.show(selectedPlane, dir);
  const spec = PLANES[selectedPlane];
  el.carName.textContent = spec.name;
  el.carDesc.textContent = spec.desc;
  el.lobbyCarName.textContent = spec.name;
  el.lobbyCarDesc.textContent = spec.desc;
  if (!silent && mp.active && mp.net) {
    mp.net.send({ t: "plane", plane: selectedPlane, from: mp.myId });
    renderLobby();
  }
}
el.carPrev.addEventListener("click", () => selectPlane(planeIdx - 1, -1));
el.carNext.addEventListener("click", () => selectPlane(planeIdx + 1, 1));
el.lobbyCarPrev.addEventListener("click", () => selectPlane(planeIdx - 1, -1));
el.lobbyCarNext.addEventListener("click", () => selectPlane(planeIdx + 1, 1));
selectPlane(0, 0, true);
carousel.setActive(false);
lobbyCarousel.setActive(false);

// wybór trybu — same przyciski, instrukcja pokazuje się dopiero pod spodem
const MODE_PLACEHOLDERS = {
  free: "Starting city… e.g. Paris",
  home: "Your address… e.g. 5th Avenue, New York",
  guess: "",
};
const MODE_DESCS = {
  free: "Pick a starting city and fly with no time limit.",
  home: "We drop you ~30 km from home. You have 10 minutes to find your way back.",
  guess: "You have one minute in the air to get your bearings, then mark on the map where you are.",
};
function selectMode(m) {
  mode = m;
  document.querySelectorAll("#menu .mode-card").forEach((b) =>
    b.classList.toggle("selected", b.dataset.mode === m)
  );
  el.modeDesc.textContent = MODE_DESCS[m];
  el.city.placeholder = MODE_PLACEHOLDERS[m];
  el.city.style.display = m === "guess" ? "none" : "";
  el.guessScope.style.display = m === "guess" ? "" : "none";
  el.menuError.textContent = "";
  if (m === "guess") GUESS_SCOPES[guessScope]?.load().catch(() => {});
}
document.querySelectorAll("#menu .mode-card").forEach((btn) => {
  btn.addEventListener("click", () => selectMode(btn.dataset.mode));
});
document.querySelectorAll("#menu .scope-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    guessScope = btn.dataset.scope;
    geoCache = null;
    geoCacheScope = null;
    GUESS_SCOPES[guessScope]?.load().catch(() => {});
    document.querySelectorAll("#menu .scope-btn").forEach((b) =>
      b.classList.toggle("selected", b === btn)
    );
  });
});
selectMode("guess");
detectLocale();
applyRegionLabels();

function applyRegionLabels() {
  const { country, continent } = getRegionPack();
  document.querySelectorAll('[data-scope="pl"]').forEach((b) => {
    b.textContent = `${country.flag} ${country.name}`;
  });
  document.querySelectorAll('[data-scope="eu"]').forEach((b) => {
    b.textContent = `${continent.flag} ${continent.name}`;
  });
  GUESS_SCOPES.pl.sub = `Click a point on the map of ${country.name}`;
  GUESS_SCOPES.pl.status = `Picking a point in ${country.name}…`;
  GUESS_SCOPES.eu.sub = `Click a point on the map of ${continent.name}`;
  GUESS_SCOPES.eu.status = `Picking a point in ${continent.name}…`;
}

function applyRemoteRegion(data) {
  if (!data || (!data.country && !data.continent)) return;
  setRegionPack(data.country, data.continent);
  geoCache = null;
  geoCacheScope = null;
  applyRegionLabels();
}

function showFatal(msg) {
  const text = msg || "Could not start on this phone.";
  rememberError(text);
  if (el.fatalText) el.fatalText.textContent = text;
  if (el.fatal) el.fatal.classList.remove("hidden");
  if (el.crashNote) {
    el.crashNote.hidden = false;
    el.crashNote.textContent = text;
  }
  if (el.menuError) el.menuError.textContent = text;
}

function hideFatal() {
  if (el.fatal) el.fatal.classList.add("hidden");
}

function showCrashHints() {
  const died = crashedLastStart();
  const prev = lastError();
  if (!died && !prev) return;
  const text = died
    ? (prev || "Last start crashed this phone (usually out of memory). Using the lightest graphics — tap Start again.")
    : prev;
  if (el.crashNote) {
    el.crashNote.hidden = false;
    el.crashNote.textContent = text;
  }
  if (el.menuError) el.menuError.textContent = text;
  if (died) showFatal(text);
}

el.fatalOk?.addEventListener("click", () => hideFatal());
showCrashHints();

function scopeLabel(scope = guessScope) {
  const pack = getRegionPack();
  if (scope === "pl") return pack.country.name;
  if (scope === "eu") return pack.continent.name;
  return "World";
}

function roomTitleFromParams(scope = guessScope) {
  return `Guess the region: ${scopeLabel(scope)}`;
}

function playerCountLabel(n = 1 + mp.players.size) {
  return `${n} player${n === 1 ? "" : "s"}`;
}

function syncRoomTitle() {
  mp.roomTitle = roomTitleFromParams();
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showNick(opts = {}) {
  rememberJoin(opts.roomId || parseRoomFromUrl() || pendingJoinId || savedJoin() || "");
  menuOpen = true;
  el.landing.classList.add("hidden");
  el.menu.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.nick.classList.remove("hidden");
  if (el.nickSub) {
    el.nickSub.textContent = pendingJoinId ? "Choose a nickname to join" : "Choose a nickname";
  }
  if (el.nickInput) {
    el.nickInput.value = normalizeNick(el.nickInput.value) || savedNick();
    queueMicrotask(() => {
      el.nickInput.focus();
      el.nickInput.select();
    });
  }
  if (el.nickError) el.nickError.textContent = "";
}

function submitNick() {
  const name = normalizeNick(el.nickInput?.value);
  if (name.length < 2) {
    if (el.nickError) el.nickError.textContent = "Enter at least 2 characters";
    el.nickInput?.focus();
    return;
  }
  mp.myName = name;
  storeNick(name);
  const joinId = pendingJoinId || parseRoomFromUrl() || savedJoin();
  if (joinId) {
    if (wasHosting(joinId)) openHostLobby(joinId);
    else openGuestLobby(joinId);
    return;
  }
  rememberJoin("");
  openHostLobby();
}

function showLanding() {
  hostGen += 1;
  closeRoom();
  mp.active = false;
  menuOpen = true;
  el.landing.classList.remove("hidden");
  el.menu.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.nick?.classList.add("hidden");
  rememberJoin("");
  carousel.setActive(false);
  lobbyCarousel.setActive(false);
  rememberHost("");
  setRoomUrl("");
}

function showSoloMenu() {
  mp.active = false;
  menuOpen = true;
  el.landing.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.nick?.classList.add("hidden");
  el.menu.classList.remove("hidden");
  carousel.setActive(true);
  lobbyCarousel.setActive(false);
}

function showLobby() {
  menuOpen = true;
  el.landing.classList.add("hidden");
  el.menu.classList.add("hidden");
  el.nick?.classList.add("hidden");
  el.lobby.classList.remove("hidden");
  carousel.setActive(false);
  ensureLobbyCarousel();
  lobbyCarousel.setActive(true);
  applyLobbySetup();
  renderLobby();
  updateVoiceUi();
  updateMpPresence();
}

function setLobbyStatus(msg, isErr = false) {
  el.lobbyStatus.textContent = msg;
  el.lobbyStatus.classList.toggle("err", isErr);
}

function otherPlayers() {
  return [...mp.players.values()];
}

function playablePlayers() {
  const list = [];
  if (!mp.waiting) list.push({ id: mp.myId });
  for (const p of mp.players.values()) if (!p.waiting) list.push(p);
  return list;
}

function inRoundPlayers() {
  const list = [];
  if (mp.inRound) list.push({ id: mp.myId, name: mp.myName });
  for (const p of mp.players.values()) if (p.inRound) list.push(p);
  return list;
}

function playerColor(id) {
  const ids = [mp.myId, ...mp.players.keys()];
  const i = Math.max(0, ids.indexOf(id));
  return PLAYER_COLORS[i % PLAYER_COLORS.length];
}

function playerName(id) {
  if (id === mp.myId) return "You";
  return mp.players.get(id)?.name || "Player";
}

function rosterPayload() {
  return [
    {
      id: mp.myId,
      name: mp.myName,
      plane: selectedPlane,
      ready: mp.myReady,
      score: mp.myScore,
      waiting: mp.wantPlay && mp.roundActive && !mp.inRound,
      inRound: mp.inRound,
      joined: mp.wantPlay,
    },
    ...otherPlayers().map((p) => ({
      id: p.id,
      name: p.name,
      plane: p.plane,
      ready: p.ready,
      score: p.score,
      waiting: !!p.waiting,
      inRound: !!p.inRound,
      joined: !!p.joined,
    })),
  ];
}

function phasePayload() {
  let left = 0;
  if (mp.phase === "fly") left = timeLeft;
  else if (mp.phase === "mark") left = mp.markLeft;
  else if (mp.phase === "results") left = mp.resultsLeft;
  const phase = mp.roundActive ? mp.phase : "lobby";
  mp.phaseLeft = left;
  return { phase, left };
}

function applyPhaseInfo(data) {
  if (!data) return;
  if (data.phase) mp.phase = data.phase;
  if (Number.isFinite(data.left)) mp.phaseLeft = data.left;
}

function humansWantPlay() {
  if (mp.wantPlay) return true;
  return otherPlayers().some((p) => p.joined);
}

function isLocallyFlying() {
  return !!(mp.inRound && mp.roundActive && (!menuOpen || awaitingSnap));
}

function humansInRound() {
  if (mp.inRound) return true;
  return otherPlayers().some((p) => p.inRound);
}

function isRoundLive() {
  if (!mp.roundActive || mp.launching || !mp.truth) return false;
  if (mp.phase === "mark" || mp.phase === "results") return humansInRound() || mp.goSent;
  if (mp.phase === "fly") return humansInRound();
  return false;
}

function lobbyPhaseText() {
  const phase = mp.roundActive ? mp.phase : "lobby";
  const left = Math.max(0, Math.ceil(
    Number.isFinite(mp.phaseLeft) ? mp.phaseLeft
      : phase === "fly" ? timeLeft
        : phase === "mark" ? mp.markLeft
          : mp.resultsLeft
  ));
  if (phase === "fly" && mp.roundActive) return `In flight — ${left}s left`;
  if (phase === "mark") return `Marking the map — ${left}s left`;
  if (phase === "results") return `Results — next round in ${left}s`;
  return "Pick a plane, copy the link, then start";
}

let tabListOpen = false;

function setTabList(open) {
  tabListOpen = !!(open && mp.active && !menuOpen);
  if (tabListOpen) renderTabList();
  else el.mpTab?.classList.add("hidden");
}

function renderTabList() {
  if (!el.mpTabList) return;
  const people = [
    {
      name: mp.myName || "You",
      score: mp.myScore || 0,
      you: true,
    },
    ...otherPlayers().map((p) => ({
      name: p.name || "Player",
      score: p.score || 0,
      you: false,
    })),
  ].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  el.mpTabList.innerHTML = people.map((p) => {
    const pts = `${p.score} pt${p.score === 1 ? "" : "s"}`;
    const you = p.you ? " (You)" : "";
    return `<div class="mp-tab-row"><span class="p-name${p.you ? " p-you" : ""}"><i class="online-dot" aria-hidden="true"></i>${escapeHtml(p.name)}${you}</span><span class="p-score">${pts}</span></div>`;
  }).join("");
  el.mpTab.classList.remove("hidden");
}

function updateMpPresence() {
  const show = mp.active && !menuOpen;
  el.mpOnline?.classList.toggle("hidden", !show);
  if (!show) {
    setTabList(false);
    return;
  }
  if (el.mpOnlineCount) el.mpOnlineCount.textContent = `${1 + mp.players.size} online`;
  if (tabListOpen) renderTabList();
}

function applyRoster(list = []) {
  const keep = new Set();
  for (const p of list) {
    if (p.id === mp.myId) {
      mp.myScore = p.score ?? mp.myScore;
      if (!mp.wantPlay) {
        mp.waiting = false;
        mp.inRound = false;
      }
      continue;
    }
    keep.add(p.id);
    const prev = mp.players.get(p.id) || {};
    mp.players.set(p.id, { ...prev, ...p, joined: !!p.joined });
  }
  for (const id of [...mp.players.keys()]) {
    if (!keep.has(id)) {
      mp.players.delete(id);
      disposeMate(id);
    }
  }
  updateMpPresence();
}

function remainingPeerIds() {
  return [...new Set([mp.myId, ...mp.players.keys()].filter(Boolean))].sort();
}

function applyHost(id) {
  if (!id) return;
  mp.hostId = id;
  mp.host = id === mp.myId;
  if (mp.host) {
    mp.joining = false;
    welcomed = true;
    stopHelloRetry();
    rememberHost(mp.roomId);
  }
}

function considerHost(id) {
  if (!id) return;
  if (mp.host && id !== mp.myId && id > mp.myId) return;
  applyHost(id);
}

function claimHost() {
  applyHost(mp.myId);
  mp.net?.send({ t: "host", id: mp.myId });
  broadcastRoster();
  resumeHostDuties();
}

function electHostIfNeeded(leftId) {
  if (!mp.active) return;
  if (mp.joining && !welcomed && leftId !== mp.hostId) return;
  const alive = remainingPeerIds();
  if (mp.hostId && alive.includes(mp.hostId)) return;
  const winner = alive[0];
  if (!winner) return;
  if (winner === mp.myId) {
    if (!mp.host) setLobbyStatus("You are the host now — the room stays open");
    claimHost();
    return;
  }
  applyHost(winner);
}

function resumeHostDuties() {
  if (!mp.host) return;
  if (!isRoundLive()) {
    if (mp.roundActive) finishRoomRound();
    mp.phase = "lobby";
    if (humansWantPlay() && !mp.launching) launchMpRound();
    else broadcastRoster();
    renderLobby();
    updateMpPresence();
    return;
  }
  if (mp.phase === "results") {
    if (mp.resultsLeft <= 0 && !mp.launching && humansWantPlay()) launchMpRound();
    else tryLaunchRematch();
  } else {
    if (mp.roundActive && !mp.goSent) tryReleaseGo();
    checkRoundClear();
    tryLaunchRematch();
  }
  renderLobby();
  updateMpPresence();
}

function dropPeer(peerId) {
  if (!peerId) return null;
  dropVoicePeer(peerId);
  mp.talkers.delete(peerId);
  const gone = mp.players.get(peerId) || null;
  mp.players.delete(peerId);
  mp.poses.delete(peerId);
  mp.guesses.delete(peerId);
  mp.snapped.delete(peerId);
  mp.snapInfo.delete(peerId);
  mp.rematch.delete(peerId);
  disposeMate(peerId);
  updateVoiceUi();
  return gone;
}

function broadcastRoster() {
  if (!mp.host || !mp.net) return;
  mp.net.send({
    t: "roster",
    hostId: mp.myId,
    players: rosterPayload(),
    roundActive: mp.roundActive,
    mode: "guess",
    scope: guessScope,
    visibility: mp.visibility,
    title: mp.roomTitle,
    city: el.lobbyCity.value,
    ...phasePayload(),
    ...regionPayload(),
  });
}

function renderLobby() {
  const rows = [
    playerRow({
      name: mp.myName,
      plane: selectedPlane,
      ready: mp.myReady,
      score: mp.myScore,
      waiting: mp.waiting,
      inRound: mp.inRound && mp.roundActive,
    }, true),
  ];
  for (const p of otherPlayers()) rows.push(playerRow(p, false));
  if (mp.players.size === 0) {
    rows.push(`<div class="player-row empty">${
      mp.joining ? "Connecting…" : "Share the link to invite friends"
    }</div>`);
  }
  el.lobbyPlayers.innerHTML = rows.join("");
  el.lobbyScopes.classList.toggle("locked", !mp.host);
  if (el.lobbyCity) {
    el.lobbyCity.style.display = "none";
    el.lobbyCity.classList.add("locked");
    el.lobbyCity.readOnly = true;
  }
  if (mp.roomId) el.lobbyLink.value = roomLink(mp.roomId);
  document.querySelector(".lobby-link-row")?.classList.remove("hidden");
  if (el.lobbyTitle) el.lobbyTitle.textContent = roomTitleFromParams();
  if (el.lobbyVis) el.lobbyVis.textContent = playerCountLabel();
  if (el.lobbyPhase) el.lobbyPhase.textContent = lobbyPhaseText();

  const flyingHere = isLocallyFlying();
  const queued = mp.wantPlay && mp.roundActive && !mp.inRound && isRoundLive();
  el.lobbyStart.disabled = flyingHere || queued || mp.launching || mp.joining;
  el.lobbyStart.textContent = mp.joining
    ? "Joining room…"
    : flyingHere
      ? "In match"
      : queued
        ? "Queued — next round"
        : mp.launching
          ? "Starting…"
          : !mp.host || mp.roundActive
            ? "Join"
            : "Start match";

  if (mp.joining) setLobbyStatus("Joining room…");
  else if (queued) setLobbyStatus("Next round.");
  else setLobbyStatus("");
}

function playerRow(p, isSelf) {
  const plane = PLANES[p.plane]?.name || "";
  const pts = ` · ${p.score || 0} pts`;
  let badge = "IN LOBBY";
  let cls = "";
  if (p.inRound && (isSelf ? isLocallyFlying() : mp.roundActive)) {
    badge = "IN FLIGHT";
    cls = " ingame";
  } else if (p.waiting || (p.joined && isRoundLive() && !p.inRound)) {
    badge = "QUEUED";
    cls = " waiting";
  } else if (p.ready || p.joined) {
    badge = "READY";
    cls = " ready";
  }
  return `<div class="player-row${cls}"><div class="p-meta"><span class="p-name"><i class="online-dot" aria-hidden="true"></i>${escapeHtml(p.name)}${isSelf ? " (You)" : ""}</span><span class="p-plane">${plane}${pts}</span></div><span class="p-ready">${badge}</span></div>`;
}

function applyLobbySetup() {
  mode = "guess";
  if (el.lobbyModeDesc) {
    el.lobbyModeDesc.textContent = "One minute in the air, 10 seconds to mark the map, then scores and the next round.";
  }
  el.lobbyScopes.style.display = "flex";
  if (el.lobbyCity) el.lobbyCity.style.display = "none";
}

function selectLobbyMode(m, broadcast = false) {
  mode = m;
  applyLobbySetup();
  if (broadcast && mp.host && mp.net) {
    mp.myReady = false;
    for (const p of mp.players.values()) p.ready = false;
    mp.net.send({ t: "mode", mode: m, city: el.lobbyCity.value, scope: guessScope, ...regionPayload() });
    broadcastRoster();
  }
  renderLobby();
}

function attachNet(api) {
  mp.net = api;
  bindVoice(api);
}

function voiceTargets() {
  return [...mp.players.keys()];
}

function voiceEnabled() {
  return mp.active && !!mp.net;
}

function refreshVoice() {
  if (!voiceEnabled()) return;
  syncVoiceCalls(voiceTargets());
}

let wantTalk = false;

async function startTalk() {
  if (!voiceEnabled()) return;
  wantTalk = true;
  if (isTalking()) return;
  unlockAudio();
  const mic = await ensureMic();
  if (!mic) {
    wantTalk = false;
    updateVoiceUi();
    return;
  }
  if (!wantTalk) return;
  refreshVoice();
  setTalking(true);
  mp.net?.send({ t: "talk", on: true, from: mp.myId });
  updateVoiceUi();
}

function stopTalk() {
  wantTalk = false;
  if (!isTalking()) return;
  setTalking(false);
  if (mp.active) mp.net?.send({ t: "talk", on: false, from: mp.myId });
  updateVoiceUi();
}

function updateVoiceUi() {
  const box = el.voiceInd;
  if (!box) return;
  if (!voiceEnabled()) {
    box.classList.add("hidden");
    return;
  }
  box.classList.remove("hidden");
  box.classList.toggle("live", isTalking());
  if (voiceDenied()) {
    box.textContent = "Microphone blocked – allow access in the browser";
    return;
  }
  if (isTalking()) {
    box.textContent = "Talking…";
    return;
  }
  const who = [...mp.talkers].map((id) => playerName(id)).filter(Boolean);
  box.textContent = who.length
    ? `${who.join(", ")} talking…`
    : "Hold T to talk";
}

async function handleVoiceCall(call) {
  if (!call || !voiceEnabled()) return;
  await ensureMic();
  answerCall(call);
  refreshVoice();
}

function handleNetData(data, fromId) {
  if (!data || !data.t) return;
  if (fromId) data = { ...data, from: fromId };

  if (data.t === "hello") {
    if (!mp.host || !fromId) return;
    const name = uniquePlayerName(data.name);
    mp.players.set(fromId, {
      id: fromId,
      name,
      plane: data.plane || "pa28",
      ready: false,
      score: 0,
      waiting: false,
      inRound: false,
      joined: false,
    });
    mp.net.sendTo(fromId, {
      t: "welcome",
      id: fromId,
      name,
      hostId: mp.myId,
      roster: rosterPayload(),
      roundActive: mp.roundActive,
      ...phasePayload(),
      mode: "guess",
      scope: guessScope,
      visibility: mp.visibility,
      title: mp.roomTitle,
      city: el.lobbyCity.value,
      ...regionPayload(),
    });
    broadcastRoster();
    renderLobby();
    updateMpPresence();
    refreshVoice();
  } else if (data.t === "who") {
    sendHello();
  } else if (data.t === "host") {
    const id = data.id || data.from;
    if (!id) return;
    if (id !== mp.myId && remainingPeerIds()[0] === mp.myId && id > mp.myId) {
      if (!mp.host) claimHost();
      return;
    }
    applyHost(id);
    if (mp.joining && !welcomed) sendHello();
    renderLobby();
  } else if (data.t === "welcome") {
    welcomed = true;
    mp.joining = false;
    stopHelloRetry();
    rememberJoin("");
    if (data.id) mp.myId = data.id;
    if (data.name) mp.myName = data.name;
    applyHost(data.hostId || fromId);
    mp.roundActive = !!data.roundActive;
    if (!mp.wantPlay) {
      mp.waiting = false;
      mp.inRound = false;
    }
    applyPhaseInfo(data);
    applyRemoteRegion(data);
    if (data.visibility) mp.visibility = data.visibility;
    if (data.title) mp.roomTitle = data.title;
    if (data.scope) setLobbyScope(data.scope);
    selectLobbyMode("guess");
    if (data.city != null) el.lobbyCity.value = data.city;
    applyRoster(data.roster);
    applyLobbySetup();
    renderLobby();
    refreshVoice();
  } else if (data.t === "roster") {
    if (!mp.host) {
      welcomed = true;
      mp.joining = false;
      stopHelloRetry();
      rememberJoin("");
    }
    mp.roundActive = !!data.roundActive;
    applyRemoteRegion(data);
    if (data.visibility) mp.visibility = data.visibility;
    if (data.title) mp.roomTitle = data.title;
    if (data.scope) setLobbyScope(data.scope);
    selectLobbyMode("guess");
    if (data.city != null) el.lobbyCity.value = data.city;
    considerHost(data.hostId || fromId);
    applyPhaseInfo(data);
    applyRoster(data.players);
    applyLobbySetup();
    renderLobby();
    refreshVoice();
  } else if (data.t === "scope") {
    applyRemoteRegion(data);
    setLobbyScope(data.scope);
  } else if (data.t === "mode") {
    applyRemoteRegion(data);
    if (data.scope) setLobbyScope(data.scope);
    if (data.city != null) el.lobbyCity.value = data.city;
    mp.myReady = false;
    for (const p of mp.players.values()) p.ready = false;
    selectLobbyMode("guess");
  } else if (data.t === "city") {
    el.lobbyCity.value = data.city || "";
  } else if (data.t === "plane") {
    const id = data.from;
    if (id && mp.players.has(id)) mp.players.get(id).plane = data.plane || "pa28";
    renderLobby();
  } else if (data.t === "ready") {
    const id = data.from;
    if (id && mp.players.has(id)) mp.players.get(id).ready = !!data.ready;
    renderLobby();
    tryStartMp();
  } else if (data.t === "talk") {
    if (data.from && data.from !== mp.myId) {
      if (data.on) mp.talkers.add(data.from);
      else mp.talkers.delete(data.from);
      updateVoiceUi();
    }
  } else if (data.t === "snapped") {
    if (data.from) {
      mp.snapInfo.set(data.from, {
        h: data.h,
        gh: data.gh,
        heading: data.heading ?? 0,
        probed: data.probed !== false,
      });
      mp.snapped.add(data.from);
    }
    if (mp.host) tryReleaseGo();
  } else if (data.t === "go") {
    applyGo(data);
  } else if (data.t === "rematch") {
    if (data.from) mp.rematch.add(data.from);
    updateRematchWait();
    if (mp.host) tryLaunchRematch();
  } else if (data.t === "join") {
    const id = data.from;
    if (id && mp.players.has(id)) {
      const p = mp.players.get(id);
      p.joined = true;
      p.plane = data.plane || p.plane;
    }
    if (mp.host) admitPlayer(id);
    renderLobby();
  } else if (data.t === "phase") {
    applyPhaseInfo(data);
    if (data.roundActive != null) mp.roundActive = !!data.roundActive;
    if (menuOpen) renderLobby();
  } else if (data.t === "start") {
    applyRemoteRegion(data);
    considerHost(data.hostId || fromId);
    applyPhaseInfo(data);
    const seated = !data.seats || !mp.myId || data.seats[mp.myId] != null;
    if (!mp.wantPlay || !seated) {
      mp.roundActive = true;
      mp.waiting = mp.wantPlay;
      mp.inRound = false;
      mp.phase = data.phase || "fly";
      renderLobby();
      return;
    }
    startMpFlight(data);
  } else if (data.t === "pose") {
    const id = data.from;
    if (!id || id === mp.myId) return;
    pushMatePose(id, data);
    loadMate(id, data.plane || "pa28");
  } else if (data.t === "guess") {
    const id = data.from;
    if (!id || id === mp.myId) return;
    mp.guesses.set(id, { lat: data.lat, lon: data.lon });
    if (guessOpen) maybeRevealGuesses();
  } else if (data.t === "done") {
    const id = data.from;
    if (id && mp.players.has(id)) mp.players.get(id).inRound = false;
    if (mp.host) {
      if (mp.rematch.size) abortRematchToLobby();
      else checkRoundClear();
    }
    renderLobby();
  } else if (data.t === "roundEnd") {
    const waitingRematch = mp.rematch.has(mp.myId) || !el.mpWait.classList.contains("hidden");
    finishRoomRound();
    hideMpWait();
    if (waitingRematch || guessOpen) {
      el.guessmap.classList.remove("show");
      guessOpen = false;
      showLobby();
    }
    renderLobby();
  }
}

function handlePeerJoined(peerId) {
  if (mp.host) {
    if (peerId) mp.net?.sendTo(peerId, { t: "who" });
    return;
  }
  sendHello();
}

function handlePeerLeft(peerId) {
  if (!peerId) {
    const live = [...(mp.net?.getPeers?.() || [])];
    if (mp.joining && !welcomed) return;
    if (live.length) {
      for (const id of [...mp.players.keys()]) {
        if (!live.includes(id)) dropPeer(id);
      }
    } else if (mp.hostId && mp.hostId !== mp.myId) {
      dropPeer(mp.hostId);
    }
    electHostIfNeeded(mp.hostId);
    if (guessOpen) maybeRevealGuesses();
    renderLobby();
    updateMpPresence();
    return;
  }
  const wasHost = peerId === mp.hostId;
  const gone = dropPeer(peerId);
  electHostIfNeeded(peerId);
  if (mp.host) {
    if (mp.phase !== "results") checkRoundClear();
    broadcastRoster();
  }
  if (guessOpen) maybeRevealGuesses();
  renderLobby();
  updateMpPresence();
  if (wasHost && mp.host) setLobbyStatus("You are the host now — the room stays open");
  else if (gone) setLobbyStatus(`${gone.name} left the room`);
}

function handleNetError(err) {
  if (mp.host && err?.type === "peer-unavailable") return;
  if (err?.type === "unavailable-id" && mp.host && mp.roomId) {
    openGuestLobby(mp.roomId);
    return;
  }
  const msg = err?.type === "timeout"
    ? "Could not open the room – try again in a moment"
    : err?.type === "peer-unavailable"
    ? "Host not found – they should open Multiplayer and not refresh, then open the link again"
    : err?.type === "unavailable-id"
      ? "This room is taken – joining as a guest…"
      : "Connection error – check your network and open the link again";
  setLobbyStatus(msg, true);
}

function closeRoom() {
  stopHelloRetry();
  welcomed = false;
  mp.joining = false;
  mp.net?.destroy();
  mp.net = null;
  mp.roomId = "";
  mp.myId = "";
  mp.host = false;
  mp.hostId = "";
  mp.myReady = false;
  mp.myScore = 0;
  mp.wantPlay = false;
  mp.waiting = false;
  mp.inRound = false;
  mp.roundActive = false;
  mp.phase = "lobby";
  mp.goSent = false;
  mp.waitingGo = false;
  mp.lastGo = null;
  mp.truth = null;
  mp.snapped = new Set();
  mp.players.clear();
  mp.guesses.clear();
  mp.poses.clear();
  mp.seats = {};
  mp.snapInfo.clear();
  mp.rematch.clear();
  mp.launching = false;
  hideMpWait();
  mp.talkers.clear();
  destroyVoice();
  updateVoiceUi();
  setTabList(false);
  el.mpOnline?.classList.add("hidden");
  disposeAllMates();
}

let hostGen = 0;

function openHostLobby(existingId) {
  const gen = ++hostGen;
  closeRoom();
  mp.active = true;
  mp.host = true;
  mp.visibility = "private";
  mp.myName = normalizeNick(mp.myName) || savedNick() || "Host";
  syncRoomTitle();
  if (existingId) mp.roomId = existingId;
  selectLobbyMode("guess");
  showLobby();
  setLobbyStatus("Creating room…");
  const api = hostRoom({
    onOpen(id, myId) {
      if (gen !== hostGen) return;
      mp.roomId = id;
      mp.myId = myId || api.myPeerId || id;
      mp.hostId = mp.myId;
      rememberHost(id);
      setRoomUrl(id);
      el.lobbyLink.value = roomLink(id);
      renderLobby();
      setLobbyStatus("Share the link — friends join this room");
    },
    onPeer: handlePeerJoined,
    onData: handleNetData,
    onCall: handleVoiceCall,
    onLeft: handlePeerLeft,
    onError: handleNetError,
  }, existingId);
  attachNet(api);
}

function openGuestLobby(id) {
  hostGen += 1;
  closeRoom();
  mp.active = true;
  mp.host = false;
  mp.joining = true;
  mp.visibility = "private";
  mp.myName = normalizeNick(mp.myName) || savedNick() || randomUsername();
  mp.roomId = id;
  rememberJoin(id);
  showLobby();
  el.lobbyLink.value = roomLink(id);
  setLobbyStatus("Joining room…");
  setRoomUrl(id);
  const api = joinRoom(id, {
    onStatus(msg) {
      setLobbyStatus(msg);
    },
    onOpen(_hostId, myId) {
      if (myId) mp.myId = myId;
      startHelloRetry();
      renderLobby();
    },
    onPeer: handlePeerJoined,
    onData: handleNetData,
    onCall: handleVoiceCall,
    onLeft: handlePeerLeft,
    onError: handleNetError,
  });
  attachNet(api);
  startHelloRetry();
}

function tryStartMp() {}

async function launchMpRound() {
  if (!mp.host || mp.launching) return;
  if (!humansWantPlay()) return;
  mp.launching = true;
  mode = "guess";
  if (mp.wantPlay) mp.waiting = false;
  for (const p of mp.players.values()) {
    if (p.joined) p.waiting = false;
    p.ready = false;
  }
  el.lobbyStart.disabled = true;
  if (mp.wantPlay) showMpWait("Picking a new point…");
  try {
    const scopeInfo = GUESS_SCOPES[guessScope];
    setLobbyStatus(scopeInfo.status);
    const p = await pickGuessStart(guessScope);
    const nextScope = guessScope;
    const seats = buildSeats();
    mp.phase = "fly";
    timeLeft = GUESS_TIME;
    const msg = {
      t: "start",
      mode: "guess",
      lat: p.lat,
      lon: p.lon,
      scope: nextScope,
      seats,
      hostId: mp.myId,
      ...phasePayload(),
      ...regionPayload(),
    };
    mp.net?.send(msg);
    if (seats[mp.myId] != null) startMpFlight(msg);
    else {
      armRoundState(msg);
      mp.launching = false;
      hideMpWait();
      renderLobby();
    }
  } catch {
    mp.launching = false;
    hideMpWait();
    setLobbyStatus("Error – check your network and try again", true);
    el.lobbyStart.disabled = false;
  }
}

function buildSeats() {
  const seats = {};
  let i = 0;
  if (mp.wantPlay) seats[mp.myId] = i++;
  for (const p of otherPlayers()) {
    if (p.joined) seats[p.id] = i++;
  }
  return seats;
}

function lerpAngle(a, b, t) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function pushMatePose(id, data) {
  const seq = data.seq ?? 0;
  let track = mp.poses.get(id);
  if (!track) {
    track = { seq: -1, samples: [], clockOff: null, plane: data.plane };
    mp.poses.set(id, track);
  }
  if (seq && seq <= track.seq) return;
  if (seq) track.seq = seq;
  if (data.plane) track.plane = data.plane;
  const localNow = performance.now();
  const senderAt = typeof data.at === "number" ? data.at : localNow;
  if (track.clockOff == null) track.clockOff = localNow - senderAt;
  else track.clockOff += (localNow - senderAt - track.clockOff) * 0.04;
  const last = track.samples[track.samples.length - 1];
  const at = Math.max(senderAt + track.clockOff, last ? last.at + 1 : 0);
  track.samples.push({
    at,
    lat: data.lat,
    lon: data.lon,
    h: data.h,
    heading: data.heading,
    pitch: data.pitch,
    roll: data.roll,
  });
  if (track.samples.length > 24) track.samples.splice(0, track.samples.length - 24);
}

function seedMatePose(id, lat, lon, h, planeKey) {
  if (!id || id === mp.myId) return;
  loadMate(id, planeKey || "pa28");
  mp.poses.set(id, {
    seq: -1,
    samples: [{ at: performance.now(), lat, lon, h, heading: 0, pitch: 0, roll: 0 }],
    clockOff: null,
    plane: planeKey,
  });
}

function seedAllMates(h) {
  const lat0 = mp.truth?.lat;
  const lon0 = mp.truth?.lon;
  if (lat0 == null || lon0 == null) return;
  const total = Object.keys(mp.seats).length || 1;
  for (const [id, seat] of Object.entries(mp.seats)) {
    if (id === mp.myId) continue;
    const spawn = offsetByIndex(lat0, lon0, Number(seat), total);
    seedMatePose(id, spawn.lat, spawn.lon, h, mp.players.get(id)?.plane || "pa28");
  }
}

function offsetByIndex(lat, lon, index, total) {
  if (total <= 1) return { lat, lon };
  const spacingM = 12;
  const dE = (index - (total - 1) / 2) * spacingM;
  const R = 6378137;
  return {
    lat,
    lon: lon + (dE / (R * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI),
  };
}

function markRoundStarted(seats) {
  mp.roundActive = true;
  mp.inRound = !!(seats && seats[mp.myId] != null);
  mp.waiting = mp.wantPlay && !mp.inRound;
  mp.myReady = false;
  for (const p of mp.players.values()) {
    p.ready = false;
    p.inRound = !!(seats && seats[p.id] != null);
    if (!p.joined) p.inRound = false;
  }
}

function armRoundState(msg) {
  mode = msg.mode || "guess";
  const nextScope = msg.scope || guessScope;
  if (nextScope !== guessScope) {
    geoCache = null;
    geoCacheScope = null;
  }
  guessScope = nextScope;
  mp.active = true;
  mp.guesses.clear();
  mp.poses.clear();
  mp.poseSeq = 0;
  mp.truth = { lat: msg.lat, lon: msg.lon };
  mp.seats = msg.seats || {};
  mp.snapped = new Set();
  mp.snapInfo.clear();
  mp.rematch.clear();
  mp.goSent = false;
  mp.waitingGo = false;
  mp.lastGo = null;
  mp.launching = false;
  mp.goAt = 0;
  guessAnswered = false;
  markRoundStarted(mp.seats);
  mp.phase = "fly";
  mp.markLeft = 0;
  mp.resultsLeft = 0;
  timeLeft = GUESS_TIME;
  if (mp.host) {
    broadcastRoster();
    const releaseIfSnapped = () => {
      if (!mp.host || !mp.roundActive || mp.goSent) return;
      if ([...mp.snapInfo.values()].some(isTerrainSnap)) applyGo();
    };
    setTimeout(releaseIfSnapped, 12000);
    setTimeout(releaseIfSnapped, 22000);
    if (mp.seats[mp.myId] == null) {
      setTimeout(() => {
        if (!mp.host || mp.goSent || !mp.roundActive) return;
        if ([...mp.snapInfo.values()].some(isTerrainSnap)) applyGo();
      }, 2500);
    }
  }
}

async function startMpFlight(msg) {
  armRoundState(msg);
  homeTarget = msg.homeLat != null ? { lat: msg.homeLat, lon: msg.homeLon } : null;
  timerActive = false;
  menuOpen = true;
  guessOpen = false;
  crashed = false;
  finished = false;
  el.guessmap.classList.remove("show");
  el.lobby.classList.add("hidden");
  hideBanner();
  el.lobbyStart.disabled = false;
  setLobbyStatus("Loading terrain… waiting for everyone");
  showMpWait("Loading terrain… waiting for everyone");
  const seat = mp.seats[mp.myId] ?? 0;
  const total = Object.keys(mp.seats).length || 1;
  const spawn = offsetByIndex(msg.lat, msg.lon, seat, total);
  if (selectedPlane !== planeMesh?.userData?.key) loadPlane(selectedPlane);
  beginFlight(spawn.lat, spawn.lon);
  seedAllMates(plane.height);
  if (mode === "home" && homeTarget) placeBeaconAt(homeTarget.lat, homeTarget.lon);
}

function reportSnapped() {
  if (!mp.active || !mp.inRound) return;
  if (mp.goSent && mp.lastGo) {
    applyGo({ ...mp.lastGo });
    return;
  }
  if (mp.goSent || mp.waitingGo) return;
  mp.waitingGo = true;
  setLobbyStatus("Waiting until everyone is ready…");
  showMpWait("Waiting until everyone is ready…");
  const info = {
    h: plane.height,
    gh: groundAlt,
    heading: 0,
    probed: snapLastGh !== null,
  };
  mp.snapInfo.set(mp.myId, info);
  mp.net?.send({ t: "snapped", from: mp.myId, ...info });
  if (mp.host) {
    mp.snapped.add(mp.myId);
    tryReleaseGo();
  }
}

function tryReleaseGo() {
  if (!mp.host || mp.goSent) return;
  const need = Object.keys(mp.seats || {});
  if (!need.length || !need.every((id) => mp.snapped.has(id))) return;
  if (![...mp.snapInfo.values()].some(isTerrainSnap)) return;
  applyGo();
}

function snapAgl() {
  return mode === "guess" ? 350 : 320;
}

function spawnHoldAlt() {
  if (mode === "guess") return guessHoldAlt(guessScope);
  return 6000;
}

function isTerrainSnap(s) {
  if (!s || !Number.isFinite(s.h) || !Number.isFinite(s.gh)) return false;
  if (s.probed === false) return false;
  if (Math.abs(s.h - s.gh - snapAgl()) > 100) return false;
  if (Math.abs(s.h - spawnHoldAlt()) < 300) return false;
  return true;
}

function buildGoPayload() {
  const snaps = [...mp.snapInfo.values()].filter(isTerrainSnap);
  if (!snaps.length) return null;
  const ghs = snaps.map((s) => s.gh).sort((a, b) => a - b);
  const gh = ghs[Math.floor(ghs.length / 2)];
  return { h: gh + snapAgl(), gh, heading: 0 };
}

function applyGo(msg) {
  const incoming = msg && Number.isFinite(Number(msg.h))
    ? {
      h: Number(msg.h),
      gh: Number.isFinite(Number(msg.gh)) ? Number(msg.gh) : Number(msg.h) - snapAgl(),
      heading: msg.heading ?? 0,
    }
    : null;
  if (mp.goSent && !(mp.inRound && (menuOpen || awaitingSnap))) return;
  const payload = incoming || mp.lastGo || buildGoPayload() || { h: 850, gh: 500, heading: 0 };
  const alreadySent = mp.goSent;
  mp.goSent = true;
  mp.waitingGo = false;
  mp.lastGo = payload;
  if (mp.host && !alreadySent) mp.net?.send({ t: "go", ...payload });
  pendingSnap = false;
  awaitingSnap = false;
  armCrashGrace();
  if (plane && payload.h != null) {
    plane.height = payload.h;
    plane.heading = payload.heading ?? 0;
    plane.pitch = 0;
    plane.roll = 0;
    ctrl.roll = 0;
    ctrl.pitch = 0;
    groundAlt = payload.gh ?? payload.h - snapAgl();
  }
  camInit = false;
  mp.goAt = performance.now();
  mp.lastPoseAt = 0;
  seedAllMates(payload.h ?? plane.height);
  hideMpWait();
  if (mp.inRound) finishSnapStart();
}

function tickHostRound(dt) {
  if (!mp.host || !mp.roundActive || mp.launching) return;
  const selfClock = mp.inRound && (timerActive || guessOpen);
  if (!selfClock) {
    if (mp.phase === "fly") {
      timeLeft -= dt;
      if (timeLeft <= 0) {
        timeLeft = 0;
        mp.phase = "mark";
        mp.markLeft = MARK_TIME;
        mp.net?.send({ t: "phase", roundActive: true, ...phasePayload() });
      }
    } else if (mp.phase === "mark") {
      mp.markLeft -= dt;
      if (mp.markLeft <= 0) revealMpGuesses(true);
    } else if (mp.phase === "results") {
      mp.resultsLeft -= dt;
      if (mp.resultsLeft <= 0) {
        if (humansWantPlay()) launchMpRound();
        else {
          finishRoomRound();
          mp.phase = "lobby";
          broadcastRoster();
        }
      }
    }
  }
  if (mp.phase === "fly") mp.phaseLeft = timeLeft;
  else if (mp.phase === "mark") mp.phaseLeft = mp.markLeft;
  else if (mp.phase === "results") mp.phaseLeft = mp.resultsLeft;
  if (frameCount % 45 === 0) {
    mp.net?.send({ t: "phase", roundActive: true, ...phasePayload() });
    if (menuOpen) renderLobby();
  }
}

function leaveRound() {
  const wasIn = mp.inRound;
  mp.inRound = false;
  mp.wantPlay = false;
  mp.myReady = false;
  if (wasIn) mp.net?.send({ t: "done", from: mp.myId });
  if (mp.host) {
    if (mp.rematch.size) abortRematchToLobby();
    else checkRoundClear();
  }
}

function checkRoundClear() {
  if (!mp.host) return;
  if (humansInRound()) return;
  finishRoomRound();
  mp.phase = "lobby";
  mp.net?.send({ t: "roundEnd" });
  broadcastRoster();
}

function finishRoomRound() {
  mp.roundActive = false;
  mp.inRound = false;
  mp.waiting = false;
  mp.myReady = false;
  mp.goSent = false;
  mp.waitingGo = false;
  mp.lastGo = null;
  mp.truth = null;
  mp.seats = {};
  mp.snapped = new Set();
  for (const p of mp.players.values()) {
    p.waiting = false;
    p.inRound = false;
    p.ready = false;
  }
  mp.guesses.clear();
  mp.poses.clear();
  mp.snapInfo.clear();
  mp.rematch.clear();
  mp.launching = false;
  hideAllMates();
}

function showMpWait(text) {
  if (text) el.mpWaitText.textContent = text;
  el.mpWait.classList.remove("hidden");
}

function hideMpWait() {
  el.mpWait.classList.add("hidden");
}

function rematchNeeded() {
  return inRoundPlayers().map((p) => p.id);
}

function updateRematchWait() {
  if (!mp.rematch.has(mp.myId)) return;
  const need = rematchNeeded();
  const n = need.filter((id) => mp.rematch.has(id)).length;
  showMpWait(`Waiting for everyone to click… ${n}/${need.length || 1}`);
}

function requestRematch() {
  if (!mp.active || mp.rematch.has(mp.myId) || mp.launching) return;
  mp.rematch.add(mp.myId);
  mp.net?.send({ t: "rematch", from: mp.myId });
  hideBanner();
  el.gmRetry.style.display = "none";
  el.gmClose.style.display = "none";
  updateRematchWait();
  if (mp.host) tryLaunchRematch();
}

function tryLaunchRematch() {
  if (!mp.host || mp.launching) return;
  const need = rematchNeeded();
  if (!need.length || need.some((id) => !mp.rematch.has(id))) return;
  launchMpRound();
}

function abortRematchToLobby() {
  if (!mp.host) return;
  finishRoomRound();
  mp.net?.send({ t: "roundEnd" });
  broadcastRoster();
}

function backToLobby() {
  setLeaveOpen(false);
  hideBanner();
  menuOpen = true;
  timerActive = false;
  guessOpen = false;
  awaitingSnap = false;
  crashed = false;
  finished = false;
  beacon.visible = false;
  el.guessmap.classList.remove("show");
  leaveRound();
  if (planeMesh) planeMesh.visible = true;
  showLobby();
}

function setLobbyScope(scope, broadcast = false) {
  if (guessScope !== scope) {
    geoCache = null;
    geoCacheScope = null;
  }
  guessScope = scope;
  GUESS_SCOPES[guessScope]?.load().catch(() => {});
  document.querySelectorAll("#lobby-scopes .scope-btn").forEach((b) => {
    b.classList.toggle("selected", b.dataset.scope === scope);
  });
  syncRoomTitle();
  if (el.lobbyTitle) el.lobbyTitle.textContent = roomTitleFromParams();
  if (broadcast && mp.host && mp.net) {
    mp.net.send({ t: "scope", scope, title: mp.roomTitle, ...regionPayload() });
    renderLobby();
  }
}
document.querySelectorAll("#lobby-scopes .scope-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!mp.host) return;
    setLobbyScope(btn.dataset.scope, true);
  });
});
document.querySelectorAll("#lobby .mode-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!mp.host) return;
    selectLobbyMode(btn.dataset.mode, true);
  });
});
el.lobbyCity.addEventListener("input", () => {
  if (mp.host && mp.net) mp.net.send({ t: "city", city: el.lobbyCity.value });
});

async function init() {
  if (!tilePool.slots.length) {
    setLoader("Missing map keys – add VITE_CESIUM_ION_KEYS to .env", 0);
    return;
  }
  setLoader("Connecting to map…", 0.4);
  const ready = await tilePool.warmup();
  if (!ready) {
    loadError = "Cesium ion rejected the map tokens. On each account add Google Photorealistic 3D Tiles (asset 2275207) and create a new token.";
    setLoader(loadError, 0);
    return;
  }
  setLoader("Start…", 0.4);

  try {
  scene = new Scene();
  scene.background = new Color(0x8ec8e8);
  scene.fog = new FogExp2(0x9dd0ea, 0.00007);

  renderer = new WebGLRenderer({
    antialias: !isMobile,
    powerPreference: isMobile ? "default" : "high-performance",
    alpha: false,
  });
  renderer.setClearColor(0x8ec8e8);
  applyPixelRatio();
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = 4;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = 2; // PCFSoft
  renderer.domElement.id = "game-canvas";
  document.body.appendChild(renderer.domElement);

  scene.add(new HemisphereLight(0xbfd8ee, 0x5a7048, 1.15));
  sun = new DirectionalLight(0xfff2dd, 2.0);
  sun.castShadow = !isMobile;
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
  tiles.registerPlugin({
    name: "TILE_KEY_POOL_PLUGIN",
    priority: -100,
    tiles: null,
    init(t) {
      this.tiles = t;
    },
    fetchData(url, options) {
      const g = this.tiles.getPluginByName("GOOGLE_CLOUD_AUTH_PLUGIN");
      if (g?.auth) g.auth.autoRefreshToken = false;
      return tilePool.fetchData(url, options).then((res) => {
        if (res && (res.status === 429 || res.status === 403 || res.status === 401)) {
          onTileThrottle(res.status);
        }
        return res;
      }).catch((err) => {
        lastTileErr = String(err?.message || err).slice(0, 220);
        pendingFailedRetry = true;
        return new Response("", { status: 599, statusText: lastTileErr });
      });
    },
  });
  const startSlot = tilePool.current;
  if (startSlot?.kind === "ion") {
    tiles.registerPlugin(
      new CesiumIonAuthPlugin({
        apiToken: startSlot.token,
        assetId: ION_GOOGLE_TILES_ASSET,
        autoRefreshToken: false,
        useRecommendedSettings: false,
      })
    );
  } else {
    tiles.registerPlugin(
      new GoogleCloudAuthPlugin({
        apiToken: startSlot?.token || tilePool.firstGoogleToken,
        useRecommendedSettings: false,
      })
    );
  }
  tilePool.onSwitch = () => {
    syncTileAuth(tiles, tilePool);
    applyTileQuality(tiles, isMobile);
    pendingFailedRetry = true;
  };
  tiles.registerPlugin(new TileCompressionPlugin({
    disableMipmaps: isMobile,
    compressIndex: true,
  }));
  tiles.registerPlugin(new UpdateOnChangePlugin());
  tiles.registerPlugin(new UnloadTilesPlugin());
  tiles.registerPlugin(new TilesFadePlugin());
  const draco = new DRACOLoader();
  draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
  tiles.registerPlugin(new GLTFExtensionsPlugin({ dracoLoader: draco }));
  tiles.group.rotation.x = -Math.PI / 2;
  tiles.group.visible = false;
  scene.add(tiles.group);
  tiles.setResolutionFromRenderer(camera, renderer);
  tiles.setCamera(camera);
  applyTileQuality(tiles, isMobile);
  const maxAniso = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  tiles.addEventListener("load-model", ({ scene }) => {
    sharpenTileTextures(scene, isMobile ? Math.min(8, maxAniso) : maxAniso);
  });
  tiles.addEventListener("load-tileset", () => {
    applyTileQuality(tiles, isMobile);
    tilePool.rememberPluginSession(
      tiles.getPluginByName("GOOGLE_CLOUD_AUTH_PLUGIN"),
      tiles.rootURL
    );
    syncTileAuth(tiles, tilePool);
  });

  // czytelny komunikat zamiast wiecznego ładowania
  tiles.addEventListener("load-error", (ev) => {
    const msg = String(ev?.error?.message || ev?.error || "");
    lastTileErr = msg.slice(0, 220);
    pendingFailedRetry = true;
    if (/429|403|502|503|quota|resource_exhausted|too many/i.test(msg)) {
      const code = /403/.test(msg) ? 403 : 429;
      onTileThrottle(code);
    }
    if (!loaderDismissed) {
      loadError = tilePool.slots.length
        ? "Map servers are busy – retrying on the next key"
        : "Missing map keys – add VITE_CESIUM_ION_KEYS to .env";
    }
  });
  setTimeout(() => {
    if (!loaderDismissed && tiles.group.children.length === 0) {
      loadError = "The map is not loading… check VITE_CESIUM_ION_KEYS";
    }
  }, 20000);

  // niebo — proceduralna kopuła (gradient + słońce + chmury FBM),
  // horyzont = dokładnie kolor mgły, więc nie ma przerwy ani poświaty
  sky = createSky(0x9dd0ea);
  scene.add(sky.mesh);

  if (!isMobile) {
    new TextureLoader().load(asset("textures/sky_day.jpg"), (tex) => {
      tex.mapping = EquirectangularReflectionMapping;
      tex.colorSpace = SRGBColorSpace;
      scene.environment = tex;
    });
  }

  beacon = createBeacon();
  beacon.visible = false;
  scene.add(beacon);

  loadPlane(selectedPlane);
  resetFlight(startLat, startLon);
  if (planeMesh) planeMesh.visible = false;
  loaderDismissed = true;
  hideLoader();

  window.addEventListener("resize", onResize);
  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    window.__ctxLost = true;
    showFatal("Graphics memory ran out on this phone (WebGL). Close other tabs and tap Start again, or use a computer.");
  });
  window.__game = { get planeMesh() { return planeMesh; }, get plane() { return plane; }, get camera() { return camera; } };
  window.__scene = scene;
  gameReady = true;
  showCrashHints();
  } catch (err) {
    console.error(err);
    const msg = "This phone could not start the 3D engine. Try Safari or Chrome, or a computer.";
    setLoader(msg, 0);
    showFatal(err?.message ? `${msg} (${err.message})` : msg);
  }
}

function loadPlane(key) {
  const spec = PLANES[key];
  camOffset = spec.cam;
  if (planeMesh) scene.remove(planeMesh);
  planeMesh = createPlaneMesh(); // fallback na czas ładowania
  planeMesh.userData.key = key;
  applyRotorState(planeMesh, true);
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
    applyRotorState(wrapper, true);
    scene.remove(planeMesh);
    planeMesh = wrapper;
    scene.add(planeMesh);
  });
}

function disposeMate(id) {
  const mate = mp.mates.get(id);
  if (mate?.mesh && scene) scene.remove(mate.mesh);
  if (mate?.marker && scene) scene.remove(mate.marker);
  mp.mates.delete(id);
}

function disposeAllMates() {
  for (const id of [...mp.mates.keys()]) disposeMate(id);
}

function hideAllMates() {
  for (const mate of mp.mates.values()) {
    if (mate.mesh) mate.mesh.visible = false;
    if (mate.marker) mate.marker.visible = false;
  }
}

function createMateMarker() {
  const g = new Group();
  const mat = new MeshBasicMaterial({ color: 0xffd34d, depthTest: false });
  const shaft = new Mesh(new CylinderGeometry(0.45, 0.45, 9, 7), mat);
  shaft.position.y = 6;
  const head = new Mesh(new ConeGeometry(2.6, 5.5, 7), mat);
  head.rotation.x = Math.PI;
  head.position.y = -1.2;
  g.add(shaft, head);
  g.visible = false;
  g.renderOrder = 10;
  scene.add(g);
  return g;
}

function ensureMateMarker(mate) {
  if (!mate.marker && scene) mate.marker = createMateMarker();
  return mate.marker;
}

function loadMate(id, key) {
  if (!id || !key || !PLANES[key] || !scene) return;
  const prev = mp.mates.get(id);
  if (prev?.key === key && prev.mesh) return;
  disposeMate(id);
  const spec = PLANES[key];
  const placeholder = createPlaneMesh();
  applyRotorState(placeholder, true);
  placeholder.visible = false;
  scene.add(placeholder);
  mp.mates.set(id, { mesh: placeholder, key });
  new GLTFLoader().load(spec.file, (gltf) => {
    const cur = mp.mates.get(id);
    if (!cur || cur.key !== key) return;
    const model = gltf.scene;
    if (spec.prepare) spec.prepare(model);
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
    wrapper.userData.key = key;
    wrapper.visible = cur.mesh.visible;
    applyRotorState(wrapper, true);
    scene.remove(cur.mesh);
    scene.add(wrapper);
    mp.mates.set(id, { mesh: wrapper, key, marker: cur.marker });
  });
}

function resetFlight(latDeg, lonDeg) {
  const spec = PLANES[selectedPlane];
  startLat = latDeg;
  startLon = lonDeg;
  // wysoki spawn poza nizinną Polską, żeby nie trafić w góry zanim teren się zmierzy
  // (menu i tak zostaje do czasu dosadzenia — spawn jest niewidoczny)
  const spawnAlt = mode === "guess" ? guessHoldAlt(guessScope) : 6000;
  plane = new PlaneController(latDeg, lonDeg, spawnAlt, 0, spec);
  groundAlt = TERRAIN_ALT;
  pendingSnap = true; // udany, ustabilizowany pomiar terenu dosadzi samolot na właściwą wysokość
  snapLastGh = null;
  snapStableCount = 0;
  snapFirstAt = 0;
  crashed = false;
  crashStreak = 0;
  crashGraceUntil = 0;
  lastSafeAgl = 200;
  groundSamples.length = 0;
  finished = false;
  shake = 0;
  ctrl.roll = 0;
  ctrl.pitch = 0;
  throttleLever = plane.cruiseT;
  ctrl.throttle = throttleLever;
  syncThrottleUi();
  camInit = false;
  if (planeMesh) planeMesh.visible = true;
  homePath.length = 0;
  hideBanner();
}

function applyPixelRatio() {
  if (!renderer) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.25 : 2));
}

function sharpenTileTextures(root, anisotropy) {
  if (!root) return;
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    const list = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of list) {
      if (!mat) continue;
      for (const key in mat) {
        const tex = mat[key];
        if (!tex || !tex.isTexture || tex.userData.foeSharp) continue;
        tex.userData.foeSharp = true;
        tex.anisotropy = isMobile ? Math.min(4, anisotropy) : anisotropy;
        if (isMobile) {
          tex.generateMipmaps = false;
          tex.minFilter = LinearFilter;
        } else {
          tex.generateMipmaps = true;
          tex.minFilter = LinearMipmapLinearFilter;
        }
        tex.magFilter = LinearFilter;
        tex.needsUpdate = true;
      }
    }
  });
}

function onResize() {
  if (!camera || !renderer) return;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  applyPixelRatio();
  renderer.setSize(innerWidth, innerHeight);
}

function frameAt(lat, lon, height, az, elv, roll) {
  const m = new Matrix4();
  WGS84_ELLIPSOID.getObjectFrame(lat, lon, height, az, elv, roll, m, CAMERA_FRAME);
  m.premultiply(tiles.group.matrixWorld);
  return m;
}

const _probeOrigin = new Vector3();
const _probeDir = new Vector3();
const _probePoint = new Vector3();
const _probeInv = new Matrix4();
const _probeLla = {};

function probeGround(lat, lon, refHeight) {
  WGS84_ELLIPSOID.getCartographicToPosition(lat, lon, refHeight + 100, _probeOrigin);
  _probeOrigin.applyMatrix4(tiles.group.matrixWorld);
  _probeDir.copy(_probeOrigin).normalize().negate();
  raycaster.set(_probeOrigin, _probeDir);
  raycaster.far = refHeight + 1200;
  const prevFirst = raycaster.firstHitOnly;
  raycaster.firstHitOnly = false;
  const hits = raycaster.intersectObject(tiles.group, true);
  raycaster.firstHitOnly = prevFirst;
  if (!hits.length) return null;
  _probeInv.copy(tiles.group.matrixWorld).invert();
  let best = Infinity;
  const n = Math.min(hits.length, 12);
  for (let i = 0; i < n; i++) {
    _probePoint.copy(hits[i].point).applyMatrix4(_probeInv);
    WGS84_ELLIPSOID.getPositionToCartographic(_probePoint, _probeLla);
    if (_probeLla.height < best) best = _probeLla.height;
  }
  return Number.isFinite(best) ? best : null;
}

function adoptGround(gh) {
  if (pendingSnap || awaitingSnap) {
    groundAlt = gh;
    groundSamples.length = 0;
    return;
  }
  const floor = groundSamples.length ? Math.min(...groundSamples) : gh;
  // LOD parent / roof pops the mesh up — that is not the street
  if (gh > floor + 24) {
    armCrashGrace(900);
    return;
  }
  groundSamples.push(gh);
  if (groundSamples.length > 8) groundSamples.shift();
  groundAlt = Math.min(...groundSamples);
}

function armCrashGrace(ms = 2500) {
  crashGraceUntil = performance.now() + ms;
  crashStreak = 0;
}

const _rayOrigin = new Vector3();
const _rayDown = new Vector3();
function hitTerrainAt(worldPos, margin) {
  _rayDown.copy(worldPos).normalize().negate();
  _rayOrigin.copy(worldPos).addScaledVector(_rayDown, -600);
  raycaster.set(_rayOrigin, _rayDown);
  raycaster.far = 1200;
  const hits = raycaster.intersectObject(tiles.group, true);
  if (!hits.length) return false;
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
  if (crashed) return;
  crashed = true;
  crashStreak = 0;
  explosions.push(createExplosion(scene, planePos.clone()));
  playExplosionSound();
  shake = 1;
  if (planeMesh) planeMesh.visible = false;
  if (mode === "home" && plane) homePath.push({ lat: plane.latDeg, lon: plane.lonDeg });
  if (mp.active && mode === "guess") return; // runda trwa — po minucie i tak zgadujecie
  timerActive = false;
  setTimeout(() => showBanner("YOU CRASHED"), 900);
}

async function geocodeCity(name) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(name);
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error("http " + res.status);
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

let placeReq = 0;
let lastPlaceAt = 0;
let lastPlaceLat = 0;
let lastPlaceLon = 0;

function placeNameFromReverse(data) {
  const a = data?.address || {};
  return (
    a.city ||
    a.town ||
    a.village ||
    a.hamlet ||
    a.municipality ||
    a.suburb ||
    data?.name ||
    a.county ||
    a.state ||
    ""
  );
}

function hidePlaceBadge() {
  el.placeBox?.classList.remove("show");
  if (el.place) el.place.textContent = "–";
}

function syncPlaceBadge() {
  if (mode !== "free" || menuOpen || guessOpen || !plane) {
    if (mode !== "free" || menuOpen) hidePlaceBadge();
    return;
  }
  const now = performance.now();
  const moved = lastPlaceAt
    ? distanceM(plane.latDeg, plane.lonDeg, lastPlaceLat, lastPlaceLon)
    : 1e9;
  if (lastPlaceAt && now - lastPlaceAt < 5500 && moved < 2200) return;
  lastPlaceAt = now;
  lastPlaceLat = plane.latDeg;
  lastPlaceLon = plane.lonDeg;
  const token = ++placeReq;
  const url =
    "https://nominatim.openstreetmap.org/reverse?format=json&zoom=12&lat=" +
    plane.latDeg +
    "&lon=" +
    plane.lonDeg;
  fetch(url, { headers: { Accept: "application/json" } })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (token !== placeReq || mode !== "free" || menuOpen) return;
      const name = placeNameFromReverse(data);
      if (!name) return;
      if (el.place) el.place.textContent = name;
      el.placeBox?.classList.add("show");
    })
    .catch(() => {});
}

function placeBeaconAt(latDeg, lonDeg) {
  const gh = probeGround(latDeg * (Math.PI / 180), lonDeg * (Math.PI / 180), TERRAIN_ALT + 200);
  const base = gh !== null ? gh : TERRAIN_ALT;
  beaconGrounded = gh !== null;
  const m = frameAt(latDeg * (Math.PI / 180), lonDeg * (Math.PI / 180), base, 0, 0, 0);
  m.decompose(beacon.position, beacon.quaternion, beacon.scale);
}

// --- start gry ---
async function startGame() {
  if (!gameReady || !tiles || !plane) {
    return menuFail("Still loading – tap Start again in a moment");
  }
  el.start.disabled = true;
  el.menuError.textContent = "";
  try {
    if (mode === "free") {
      const city = el.city.value.trim() || "Niepruszewo";
      el.menuError.textContent = `Looking up: ${city}…`;
      const loc = await geocodeCity(city);
      if (!loc) return menuFail(`Could not find “${city}”`);
      beginFlight(loc.lat, loc.lon);
    } else if (mode === "home") {
      const addr = el.city.value.trim();
      if (!addr) return menuFail("Enter your address");
      el.menuError.textContent = "Looking up address…";
      const loc = await geocodeCity(addr);
      if (!loc) return menuFail("Could not find that address");
      homeTarget = loc;
      const start = offsetPoint(loc.lat, loc.lon, 20 + Math.random() * 10);
      timeLeft = HOME_TIME;
      timerActive = false; // włączy się po dosadzeniu (finishSnapStart)
      beginFlight(start.lat, start.lon);
      placeBeaconAt(loc.lat, loc.lon);
    } else {
      el.menuError.textContent = GUESS_SCOPES[guessScope].status;
      const p = await pickGuessStart(guessScope);
      timeLeft = GUESS_TIME;
      timerActive = false; // włączy się po dosadzeniu (finishSnapStart)
      beginFlight(p.lat, p.lon);
    }
  } catch (err) {
    console.error(err);
    menuFail("Could not start – try again, or use a stronger connection");
  }
}

function menuFail(msg) {
  el.menuError.textContent = msg;
  el.start.disabled = false;
  rememberError(msg);
}

function sleepPreviews() {
  carousel.setActive(false);
  lobbyCarousel.setActive(false);
}

function beginFlight(lat, lon) {
  markStarting();
  sleepPreviews();
  el.menuError.textContent = "Loading terrain…";
  if (selectedPlane !== planeMesh?.userData?.key) loadPlane(selectedPlane);
  resetFlight(lat, lon);
  flushTilesForWarp(tiles);
  retryFailedTiles(true);
  el.timerBox.classList.toggle("show", mode !== "free");
  el.distBox.classList.remove("show");
  lastPlaceAt = 0;
  hidePlaceBadge();
  // menu zostaje we wszystkich trybach — gracz nie widzi wysokiego spawnu,
  // a samolot nie jest szarpany dosadzeniem w trakcie sterowania
  awaitingSnap = true;
  awaitingSnapSince = performance.now();
}

// wywoływane gdy teren zmierzony — właściwy start gry
function finishSnapStart() {
  menuOpen = false;
  guessOpen = false;
  guessAnswered = false;
  el.menu.classList.add("hidden");
  el.landing.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.guessmap.classList.remove("show");
  el.menuError.textContent = "";
  carousel.setActive(false);
  hideMpWait();
  timerActive = mode !== "free";
  clearError();
  updateMpPresence();
  if (mode === "free") {
    lastPlaceAt = 0;
    syncPlaceBadge();
  } else {
    hidePlaceBadge();
  }
  setTimeout(clearStarting, 2500);
  armCrashGrace();
  syncGuessHud();
}

function unlockAudio() {
  try {
    primeAudio();
    primeMusic();
  } catch {
    /* iOS can reject AudioContext; flight still works */
  }
}

function syncMusicButtons() {
  const label = musicEnabled() ? "Music: On" : "Music: Off";
  document.querySelectorAll(".music-btn").forEach((btn) => {
    btn.textContent = label;
  });
}
syncMusicButtons();
document.querySelectorAll(".music-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMusicEnabled(!musicEnabled());
    syncMusicButtons();
  });
});

window.addEventListener("pointerdown", unlockAudio);
window.addEventListener("keydown", unlockAudio);

el.start.addEventListener("click", () => {
  unlockAudio();
  startGame();
});
el.city.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startGame();
});

el.btnSolo.addEventListener("click", () => {
  unlockAudio();
  showSoloMenu();
});
el.btnMulti.addEventListener("click", () => {
  unlockAudio();
  const nick = savedNick();
  if (nick) {
    mp.myName = nick;
    openHostLobby();
    return;
  }
  showNick();
});
el.nickBack?.addEventListener("click", () => showLanding());
el.nickGo?.addEventListener("click", () => {
  unlockAudio();
  submitNick();
});
el.nickInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    unlockAudio();
    submitNick();
  }
});
el.menuBack.addEventListener("click", () => showLanding());
el.lobbyBack.addEventListener("click", () => showLanding());
el.lobbyCopy.addEventListener("click", async () => {
  const link = el.lobbyLink.value;
  if (!link) return;
  try {
    await navigator.clipboard.writeText(link);
    el.lobbyCopy.classList.add("copied");
    el.lobbyCopy.setAttribute("aria-label", "Copied");
    el.lobbyCopy.title = "Copied";
    setTimeout(() => {
      el.lobbyCopy.classList.remove("copied");
      el.lobbyCopy.setAttribute("aria-label", "Copy link");
      el.lobbyCopy.title = "Copy link";
    }, 1600);
  } catch {
    el.lobbyLink.select();
  }
});
function admitPlayer(id) {
  if (!mp.host) return;
  const p = id && mp.players.get(id);
  if (p) p.joined = true;
  if (mp.launching) {
    broadcastRoster();
    return;
  }
  if (isRoundLive() && mp.truth && mp.phase === "fly") {
    if (p) {
      p.waiting = false;
      p.inRound = true;
    }
    if (id && mp.seats[id] == null) mp.seats[id] = Object.keys(mp.seats).length;
    if (id) {
      mp.net.sendTo(id, {
        t: "start",
        mode: "guess",
        lat: mp.truth.lat,
        lon: mp.truth.lon,
        scope: guessScope,
        seats: mp.seats,
        hostId: mp.myId,
        ...phasePayload(),
        ...regionPayload(),
      });
      if (mp.lastGo) mp.net.sendTo(id, { t: "go", ...mp.lastGo });
    }
    broadcastRoster();
    return;
  }
  if (isRoundLive()) {
    if (p) p.waiting = true;
    broadcastRoster();
    return;
  }
  if (p) p.waiting = false;
  finishRoomRound();
  mp.phase = "lobby";
  if (!mp.launching) launchMpRound();
}

function joinCurrentFlight() {
  if (!mp.truth) {
    launchMpRound();
    return;
  }
  mp.wantPlay = true;
  mp.inRound = true;
  mp.roundActive = true;
  mp.waiting = false;
  if (mp.seats[mp.myId] == null) mp.seats[mp.myId] = Object.keys(mp.seats).length;
  const total = Object.keys(mp.seats).length || 1;
  const spawn = offsetByIndex(mp.truth.lat, mp.truth.lon, mp.seats[mp.myId], total);
  menuOpen = true;
  guessOpen = false;
  el.lobby.classList.add("hidden");
  showMpWait("Loading terrain…");
  if (selectedPlane !== planeMesh?.userData?.key) loadPlane(selectedPlane);
  beginFlight(spawn.lat, spawn.lon);
  seedAllMates(plane.height);
  broadcastRoster();
}

function requestPlay() {
  if (!mp.active) return;
  if (isLocallyFlying()) return;
  mp.wantPlay = true;
  mp.myReady = true;
  if (mp.joining || mp.launching) {
    renderLobby();
    return;
  }
  if (mp.host) {
    if (isRoundLive() && mp.truth && mp.phase === "fly" && !isLocallyFlying()) joinCurrentFlight();
    else if (isRoundLive()) {
      mp.waiting = true;
      broadcastRoster();
    } else {
      mp.waiting = false;
      finishRoomRound();
      mp.phase = "lobby";
      launchMpRound();
    }
  } else {
    mp.waiting = false;
    mp.net?.send({ t: "join", from: mp.myId, plane: selectedPlane });
  }
  renderLobby();
}

el.lobbyStart.addEventListener("click", () => {
  unlockAudio();
  requestPlay();
});

const joinId = parseRoomFromUrl() || savedJoin();
if (joinId) showNick({ roomId: joinId });

function syncPauseCopy() {
  if (mp.active) {
    if (el.pauseTitle) el.pauseTitle.textContent = "Leave match?";
    if (el.pauseSub) {
      el.pauseSub.textContent = humansInRound() && otherPlayers().some((p) => p.inRound)
        ? "The round keeps going for everyone else."
        : "You can join again from the lobby.";
    }
    el.resume.textContent = "Continue";
    el.restart.textContent = "Leave";
  } else {
    if (el.pauseTitle) el.pauseTitle.textContent = "Paused";
    if (el.pauseSub) el.pauseSub.textContent = "";
    el.resume.textContent = "Continue";
    el.restart.textContent = "Start over";
  }
}

function setLeaveOpen(v) {
  leaveOpen = v;
  paused = false;
  keys.clear();
  syncPauseCopy();
  el.pause.classList.toggle("show", v);
}

function setPaused(v) {
  if (mp.active) {
    setLeaveOpen(v);
    return;
  }
  leaveOpen = false;
  paused = v;
  keys.clear();
  if (v) {
    freeMap.hide();
    miniMap.hide();
    hideMapNote();
  }
  syncGuessHud();
  syncPauseCopy();
  el.pause.classList.toggle("show", v);
}

el.resume.addEventListener("click", () => {
  if (mp.active) setLeaveOpen(false);
  else setPaused(false);
});
el.restart.addEventListener("click", () => {
  if (mp.active) {
    setLeaveOpen(false);
    backToLobby();
    return;
  }
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
  freeMap.hide();
  miniMap.hide();
  hideMapNote();
  el.guessmap.classList.remove("show");
  hidePlaceBadge();
  el.start.disabled = false;
  el.menuError.textContent = "";
  el.landing.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.menu.classList.remove("hidden");
  carousel.setActive(true);
  syncGuessHud();
}

// --- mapa zgadywania ---
function guessGeoReady() {
  return !!(geoCache?.features?.length && geoCacheScope === guessScope);
}

function drawGuessMap(marks = [], tries = 0) {
  if (!guessGeoReady()) return;
  const canvas = el.gmCanvas;
  if (canvas && (canvas.clientWidth < 8 || canvas.clientHeight < 8) && tries < 12) {
    requestAnimationFrame(() => drawGuessMap(marks, tries + 1));
    return;
  }
  GUESS_SCOPES[guessScope].draw(canvas, geoCache, marks);
}

function loadGuessGeo() {
  if (guessGeoReady()) return Promise.resolve(geoCache);
  const scope = guessScope;
  const id = ++geoLoadId;
  return GUESS_SCOPES[scope].load().then((g) => {
    if (id !== geoLoadId || guessScope !== scope) return geoCache;
    if (!g?.features?.length) throw new Error("empty map");
    geoCache = g;
    geoCacheScope = scope;
    return g;
  });
}

function openGuessMap() {
  guessOpen = true;
  guessAnswered = false;
  keys.clear();
  el.gmResult.textContent = "";
  updateGuessScores();
  el.gmClose.style.display = "none";
  el.gmRetry.style.display = "none";
  el.gmClose.textContent = mp.active ? "Back to room" : "Back to menu";
  el.gmRetry.textContent = mp.active ? "Another round" : "Try again";
  if (mp.active) {
    mp.phase = "mark";
    mp.markLeft = MARK_TIME;
    if (el.gmTitle) el.gmTitle.textContent = "Where are you?";
    el.gmSub.textContent = "You have 10 seconds to mark the map";
  } else {
    if (el.gmTitle) el.gmTitle.textContent = "Where are you?";
    if (el.gmTimer) el.gmTimer.textContent = "";
    el.gmSub.textContent = GUESS_SCOPES[guessScope].sub;
  }
  updateGuessPhaseUi();
  el.guessmap.classList.add("show");
  syncGuessHud();
  const draw = () => requestAnimationFrame(() => drawGuessMap());
  if (guessGeoReady()) {
    draw();
    return;
  }
  el.gmSub.textContent = "Loading map…";
  loadGuessGeo()
    .then(() => {
      if (mp.active && mp.phase === "mark") {
        el.gmSub.textContent = "You have 10 seconds to mark the map";
      } else if (!mp.active) {
        el.gmSub.textContent = GUESS_SCOPES[guessScope].sub;
      }
      draw();
    })
    .catch(() => {
      el.gmResult.textContent = "Could not load the map";
    });
}

function updateGuessPhaseUi() {
  if (!el.gmTimer) return;
  if (!mp.active) {
    el.gmTimer.textContent = "";
    return;
  }
  if (mp.phase === "mark") {
    const sec = Math.max(0, Math.ceil(mp.markLeft));
    el.gmTimer.textContent = `${sec}s to mark`;
    if (el.gmTitle) el.gmTitle.textContent = "Where are you?";
  } else if (mp.phase === "results") {
    const sec = Math.max(0, Math.ceil(mp.resultsLeft));
    el.gmTimer.textContent = sec > 0 ? `Next round in ${sec}s` : "Starting next round…";
    if (el.gmTitle) el.gmTitle.textContent = "Results";
    el.gmSub.textContent = "Scores are in — next location coming up";
  } else {
    el.gmTimer.textContent = "";
  }
}

function maybeRevealGuesses() {
  const need = inRoundPlayers().length;
  if (!need || mp.guesses.size < need) {
    if (guessOpen) {
      el.gmResult.textContent = `Waiting for guesses… ${mp.guesses.size}/${need}`;
    }
    return;
  }
  revealMpGuesses();
}

function revealMpGuesses(force = false) {
  if (!mp.truth || guessAnswered) return;
  if (!force && mp.guesses.size < inRoundPlayers().length) return;
  guessAnswered = true;
  mp.phase = "results";
  mp.resultsLeft = RESULTS_TIME;
  const marks = [
    { lat: mp.truth.lat, lon: mp.truth.lon, color: "#d8a24a", label: "You were here", truth: true },
  ];
  const results = [];
  for (const [id, g] of mp.guesses) {
    const err = distanceM(g.lat, g.lon, mp.truth.lat, mp.truth.lon) / 1000;
    results.push({ id, err, name: playerName(id) });
    marks.push({ lat: g.lat, lon: g.lon, color: playerColor(id), label: playerName(id) });
  }
  for (const p of inRoundPlayers()) {
    if (!mp.guesses.has(p.id)) results.push({ id: p.id, err: Infinity, name: playerName(p.id) });
  }
  drawGuessMap(marks);
  results.sort((a, b) => a.err - b.err);
  const marked = results.filter((r) => Number.isFinite(r.err));
  const best = marked[0]?.err ?? 0;
  const winners = marked.filter((r) => r.err - best < 0.5);
  if (winners.length === 1) {
    const w = winners[0];
    if (w.id === mp.myId) mp.myScore += 1;
    else if (mp.players.has(w.id)) mp.players.get(w.id).score += 1;
  }
  const line = results.map((r) => `${r.name} ${Number.isFinite(r.err) ? `${Math.round(r.err)} km` : "no mark"}`).join(" · ");
  el.gmResult.textContent =
    !winners.length
      ? `No marks – ${line}`
      : winners.length > 1
        ? `Tie – ${line}`
        : winners[0]?.id === mp.myId
          ? `You win – ${line}`
          : `${winners[0]?.name} wins – ${line}`;
  updateGuessScores();
  el.gmClose.style.display = "none";
  el.gmRetry.style.display = "none";
  updateGuessPhaseUi();
  if (mp.host) broadcastRoster();
}

function updateGuessScores() {
  renderGuessStats();
  if (!el.gmScoreLeft || !el.gmScoreRight) return;
  if (!mp.active) {
    el.gmScoreLeft.textContent = "";
    el.gmScoreRight.textContent = "";
    return;
  }
  el.gmScoreLeft.textContent = `You ${mp.myScore}`;
  el.gmScoreRight.textContent = otherPlayers()
    .map((p) => `${p.name} ${p.score ?? 0}`)
    .join("  ");
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
  if (mp.active) {
    if (mp.guesses.has(mp.myId)) return;
    mp.guesses.set(mp.myId, { lat, lon });
    mp.net?.send({ t: "guess", lat, lon, from: mp.myId });
    const marks = [...mp.guesses].map(([id, g]) => ({
      lat: g.lat,
      lon: g.lon,
      color: playerColor(id),
      label: playerName(id),
    }));
    drawGuessMap(marks);
    maybeRevealGuesses();
    return;
  }
  const errKm = distanceM(lat, lon, plane.latDeg, plane.lonDeg) / 1000;
  guessAnswered = true;
  recordSoloGuess(errKm);
  drawGuessMap([
    { lat: plane.latDeg, lon: plane.lonDeg, color: "#d8a24a", label: "You were here", truth: true },
    { lat, lon, color: "#f3ead6", label: "Your guess" },
  ]);
  el.gmResult.textContent = `Off by ${Math.round(errKm)} km`;
  el.gmClose.style.display = "";
  el.gmRetry.style.display = "";
});

el.gmClose.addEventListener("click", () => {
  el.guessmap.classList.remove("show");
  if (mp.active) backToLobby();
  else backToMenu();
});

el.bannerRetry.addEventListener("click", () => {
  if (mp.active) {
    hideBanner();
    backToLobby();
  } else restartMode();
});
el.bannerMenu.addEventListener("click", () => {
  hideBanner();
  if (mp.active) backToLobby();
  else backToMenu();
});

el.gmRetry.addEventListener("click", () => {
  if (mp.active) {
    requestRematch();
    return;
  }
  el.gmResult.textContent = "Picking a new point…";
  el.gmRetry.style.display = "none";
  el.gmClose.style.display = "none";
  restartMode();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && mp.active && !menuOpen) {
    e.preventDefault();
    if (!e.repeat) setTabList(true);
    return;
  }
  if (e.key === "Escape") {
    if (menuOpen) return;
    if (freeMap.open) {
      freeMap.hide();
      updateLocationMaps();
      return;
    }
    if (mp.active) {
      setLeaveOpen(!leaveOpen);
      return;
    }
    if (!guessOpen) setPaused(!paused);
    return;
  }
  if (e.target && e.target.tagName === "INPUT") return;
  const k = e.key.toLowerCase();
  if (k === "t" && voiceEnabled()) {
    if (!e.repeat) startTalk();
    return;
  }
  if (k === "m" && !e.repeat && !menuOpen && !guessOpen && !paused) {
    e.preventDefault();
    if (mode === "free") toggleFreeMap();
    else showMapUnavailable();
    return;
  }
  if (!e.repeat && !menuOpen && !paused && !guessOpen) {
    if (k === "f") {
      e.preventDefault();
      setThrottleLever(1);
      return;
    }
    if (k === "c") {
      e.preventDefault();
      setThrottleLever(0);
      return;
    }
  }
  if (menuOpen || paused || guessOpen) return;
  keys.add(k);
  if (k === "r" && (crashed || finished)) restartMode();
});
window.addEventListener("keyup", (e) => {
  if (e.key === "Tab") setTabList(false);
  if (e.target && e.target.tagName === "INPUT") return;
  const k = e.key.toLowerCase();
  if (k === "t") stopTalk();
  keys.delete(k);
});
el.mpOnline?.addEventListener("click", () => {
  if (!mp.active || menuOpen) return;
  setTabList(!tabListOpen);
});
window.addEventListener("blur", () => stopTalk());

const touch = { roll: 0, pitch: 0, boost: false, brake: false, pid: null, thr: null };

function setThrottleLever(v) {
  throttleLever = Math.max(0, Math.min(1, v));
  syncThrottleUi();
}

function syncThrottleUi() {
  if (el.throttleKnob) {
    el.throttleKnob.style.bottom = `${throttleLever * 100}%`;
  }
  el.throttleRail?.setAttribute("aria-valuenow", String(Math.round(throttleLever * 100)));
}

function syncThrottleVis() {
  const show = !menuOpen && !paused && !leaveOpen && !guessOpen && !crashed && !finished;
  el.throttle?.classList.toggle("hidden", !show);
}

function throttleFromClientY(clientY) {
  if (!el.throttleRail) return throttleLever;
  const r = el.throttleRail.getBoundingClientRect();
  if (r.height < 1) return throttleLever;
  return (r.bottom - clientY) / r.height;
}

function resetStick() {
  touch.roll = 0;
  touch.pitch = 0;
  touch.pid = null;
  if (el.stickKnob) el.stickKnob.style.transform = "";
}

function moveStick(clientX, clientY) {
  if (!el.stick) return;
  const r = el.stick.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  let dx = clientX - cx;
  let dy = clientY - cy;
  const max = r.width * 0.42;
  const mag = Math.hypot(dx, dy);
  if (mag > max) {
    dx = (dx / mag) * max;
    dy = (dy / mag) * max;
  }
  const nx = dx / max;
  const ny = dy / max;
  const dead = 0.12;
  touch.roll = Math.abs(nx) < dead ? 0 : nx;
  touch.pitch = Math.abs(ny) < dead ? 0 : ny;
  if (el.stickKnob) el.stickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
}

function bindHold(btn, down, up) {
  if (!btn) return;
  const start = (e) => {
    e.preventDefault();
    btn.setPointerCapture(e.pointerId);
    btn.classList.add("held");
    down();
  };
  const end = (e) => {
    e.preventDefault();
    btn.classList.remove("held");
    up();
  };
  btn.addEventListener("pointerdown", start);
  btn.addEventListener("pointerup", end);
  btn.addEventListener("pointercancel", end);
}

if (el.stick) {
  el.stick.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    touch.pid = e.pointerId;
    el.stick.setPointerCapture(e.pointerId);
    moveStick(e.clientX, e.clientY);
  });
  el.stick.addEventListener("pointermove", (e) => {
    if (touch.pid !== e.pointerId) return;
    moveStick(e.clientX, e.clientY);
  });
  const endStick = (e) => {
    if (touch.pid != null && e.pointerId !== touch.pid) return;
    resetStick();
  };
  el.stick.addEventListener("pointerup", endStick);
  el.stick.addEventListener("pointercancel", endStick);
}
bindHold(el.touchTalk, () => startTalk(), () => stopTalk());
el.touchPause?.addEventListener("click", () => setPaused(true));
el.touchMap?.addEventListener("click", () => toggleFreeMap());
el.stick?.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

if (el.throttleRail) {
  const startThr = (e) => {
    e.preventDefault();
    touch.thr = e.pointerId;
    el.throttleRail.setPointerCapture(e.pointerId);
    setThrottleLever(throttleFromClientY(e.clientY));
  };
  const moveThr = (e) => {
    if (touch.thr !== e.pointerId) return;
    setThrottleLever(throttleFromClientY(e.clientY));
  };
  const endThr = (e) => {
    if (touch.thr != null && e.pointerId !== touch.thr) return;
    touch.thr = null;
  };
  el.throttleRail.addEventListener("pointerdown", startThr);
  el.throttleRail.addEventListener("pointermove", moveThr);
  el.throttleRail.addEventListener("pointerup", endThr);
  el.throttleRail.addEventListener("pointercancel", endThr);
  el.throttleRail.addEventListener("wheel", (e) => {
    e.preventDefault();
    setThrottleLever(throttleLever + (e.deltaY < 0 ? 0.06 : -0.06));
  }, { passive: false });
}

function syncTouchUi() {
  if (!el.touch) return;
  const show = !menuOpen && !paused && !leaveOpen && !guessOpen && !crashed && !finished;
  el.touch.classList.toggle("hidden", !show);
  el.touch.classList.toggle("show", show);
  el.touch.classList.toggle("talk", voiceEnabled());
  el.touch.classList.toggle("free", mode === "free");
  syncThrottleVis();
  if (!show) resetStick();
}

async function restartMode() {
  if (mp.active) {
    backToLobby();
    return;
  }
  if (mode === "home" && homeTarget) {
    timeLeft = HOME_TIME;
    timerActive = false; // włączy się po dosadzeniu (finishSnapStart)
    awaitingSnap = true;
    awaitingSnapSince = performance.now();
    resetFlight(startLat, startLon);
    placeBeaconAt(homeTarget.lat, homeTarget.lon);
  } else if (mode === "guess") {
    const p = await pickGuessStart(guessScope);
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
window.__foeDebug = () => ({
  state: "dbg",
  lat: plane?.latDeg,
  lon: plane?.lonDeg,
  h: plane?.height,
  speed: plane?.speed,
  menuOpen,
  awaitingSnap,
  guessOpen,
  paused,
  crashed,
  finished,
  tilesLoaded: tiles?.stats?.loaded || 0,
  tilesLoading: tiles?.stats?.loading || 0,
  tilesQueue: tiles?.stats?.inQueue || 0,
  tilesFailed: tiles?.stats?.failed || 0,
  tilesParsed: tiles?.stats?.parsed || 0,
  tileKey: tilePool?.current?.kind || "none",
  tileSlot: tilePool?.current?.slot || -1,
  tileMaxed: tile429Count,
  camPos: camera?.position?.toArray?.() || [],
});
const skyQuat = new Quaternion(); // lokalna ramka N/S (bez kursu) — dla kopuły nieba i słońca
const skyFramePos = new Vector3();
const skyFrameScale = new Vector3();
let camInit = false;

void init();
animate();

window.addEventListener("error", (e) => {
  const msg = e.message || "Unexpected error";
  if (!msg || msg === "Script error.") return;
  rememberError(msg);
  if (awaitingSnap || !menuOpen) showFatal(msg);
  else if (el.menuError) el.menuError.textContent = msg;
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = String(e.reason?.message || e.reason || "Unexpected error");
  rememberError(msg);
  if (awaitingSnap || !menuOpen) showFatal(msg);
  else if (el.menuError) el.menuError.textContent = msg;
});
window.addEventListener("pagehide", () => {
  try {
    if (sessionStorage.getItem(START_FLAG)) {
      rememberError("Phone closed the tab while loading terrain — usually out of memory. Light mode is on; tap Start again.");
    }
  } catch {
    /* ignore */
  }
});

function animate() {
  requestAnimationFrame(animate);
  try {
    tickFrame();
  } catch (err) {
    console.error(err);
    showFatal(err?.message || "The game crashed while drawing a frame");
  }
}

function tickFrame() {
  if (!tiles || !plane) return;

  const dt = Math.min(clock.getDelta(), 0.05);
  frameCount += 1;
  scene.updateMatrixWorld();

  const flying = !menuOpen && !paused && !guessOpen && !crashed && !finished;

  // sterowanie lotnicze: W / góra = drążek od siebie = nos w dół
  const keyRoll =
    (keys.has("d") || keys.has("arrowright") ? 1 : 0) -
    (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
  const keyPitch =
    (keys.has("s") || keys.has("arrowdown") ? 1 : 0) -
    (keys.has("w") || keys.has("arrowup") ? 1 : 0);
  const rollIn = keyRoll || touch.roll;
  const pitchIn = keyPitch || touch.pitch;
  ctrl.roll += (rollIn - ctrl.roll) * Math.min(1, 6 * dt);
  ctrl.pitch += (pitchIn - ctrl.pitch) * Math.min(1, 6 * dt);
  if (flying) {
    if (keys.has("shift")) setThrottleLever(throttleLever + dt * 0.55);
    else if (keys.has("control")) setThrottleLever(throttleLever - dt * 0.55);
  }
  ctrl.throttle = throttleLever;

  if (flying) {
    // równe kroki — duży dt przy ładowaniu kafelków nie robi „przeskoku” przy nitro
    let left = dt;
    const step = 1 / 60;
    while (left > 0) {
      const s = Math.min(step, left);
      plane.update(s, ctrl);
      left -= s;
    }
  }

  // dźwięk silnika — obroty z przepustnicy i prędkości, opływ z prędkości
  const speed01 = plane.speed / plane.boost;
  const rpm01 = Math.min(
    1,
    Math.max(0.15, 0.22 + plane.throttle * 0.78)
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
  spinRotors(planeMesh, dt, plane.speed);
  for (const mate of mp.mates.values()) {
    if (mate.mesh) spinRotors(mate.mesh, dt, plane.speed);
  }

  if (mp.active && !menuOpen && !guessOpen && !crashed) {
    const now = performance.now();
    if (now - mp.lastPoseAt > MATE_SEND_MS) {
      mp.lastPoseAt = now;
      mp.poseSeq += 1;
      mp.net?.send({
        t: "pose",
        from: mp.myId,
        seq: mp.poseSeq,
        at: now,
        lat: plane.latDeg,
        lon: plane.lonDeg,
        h: plane.height,
        heading: plane.heading,
        pitch: plane.pitch,
        roll: plane.roll,
        plane: selectedPlane,
      });
    }
  }
  if (mp.active && !menuOpen) {
    const deg = Math.PI / 180;
    const renderAt = performance.now() - MATE_INTERP_MS;
    for (const [id, track] of mp.poses) {
      if (id === mp.myId) continue;
      const samples = track.samples;
      if (!mp.mates.get(id)?.mesh) loadMate(id, track.plane || "pa28");
      const mate = mp.mates.get(id);
      if (!mate?.mesh || !samples?.length) continue;
      let from = samples[0];
      let to = samples[samples.length - 1];
      let u = 1;
      if (renderAt <= samples[0].at) {
        to = from;
        u = 0;
      } else if (renderAt >= to.at) {
        from = to;
        u = 1;
      } else {
        for (let i = 1; i < samples.length; i++) {
          if (samples[i].at >= renderAt) {
            from = samples[i - 1];
            to = samples[i];
            u = (renderAt - from.at) / Math.max(1, to.at - from.at);
            break;
          }
        }
      }
      const mm = frameAt(
        (from.lat + (to.lat - from.lat) * u) * deg,
        (from.lon + (to.lon - from.lon) * u) * deg,
        from.h + (to.h - from.h) * u,
        lerpAngle(from.heading, to.heading, u),
        from.pitch + (to.pitch - from.pitch) * u,
        -(from.roll + (to.roll - from.roll) * u)
      );
      mm.decompose(matePos, mateQuat, mateScale);
      mate.mesh.position.copy(matePos);
      mate.mesh.quaternion.copy(mateQuat);
      mate.mesh.scale.copy(mateScale);
      mate.mesh.visible = true;
      const marker = ensureMateMarker(mate);
      const markOn = mp.goAt && performance.now() - mp.goAt < MATE_MARKER_MS;
      mateUp.set(0, 1, 0).applyQuaternion(mateQuat).normalize();
      marker.scale.copy(mateScale);
      marker.position.copy(matePos).addScaledVector(mateUp, 18 * (mateScale.y || 1));
      marker.quaternion.copy(mateQuat);
      marker.visible = markOn && Math.sin(performance.now() * 0.014) > 0;
    }
  } else {
    hideAllMates();
  }

  // sztywna kamera za samolotem — tylko kurs, bez przechyłu/pochylenia
  const camFrame = frameAt(plane.lat, plane.lon, plane.height, plane.heading, 0, 0);
  camFrame.decompose(camFramePos, camFrameQuat, camFrameScale);
  offset.set(camOffset[0], camOffset[1], camOffset[2]).applyQuaternion(camFrameQuat).add(planePos);
  camPos.copy(offset);
  camInit = true;
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

  if (!liteMode && !menuOpen && frameCount % 15 === 0) {
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

  if ((!menuOpen || awaitingSnap) && frameCount % 8 === 0) {
    const refH = pendingSnap || awaitingSnap ? Math.max(plane.height, spawnHoldAlt()) : plane.height;
    const gh = probeGround(plane.lat, plane.lon, refH);
    if (gh !== null) {
      adoptGround(gh);
      if (pendingSnap) {
        plane.height = gh + snapAgl();
        if (!snapFirstAt) snapFirstAt = performance.now();
        if (snapLastGh !== null && Math.abs(gh - snapLastGh) < 25) {
          snapStableCount += 1;
        } else {
          snapStableCount = 0;
        }
        snapLastGh = gh;
        const need = tiles.isLoading ? 4 : 2;
        const waited = performance.now() - snapFirstAt > 1500;
        if (snapStableCount >= need && waited) {
          pendingSnap = false;
          armCrashGrace();
          if (awaitingSnap) {
            awaitingSnap = false;
            if (mp.active && mp.inRound) reportSnapped();
            else finishSnapStart();
          }
        }
      }
    }
  }
  if (awaitingSnap && performance.now() - awaitingSnapSince > 20000) {
    awaitingSnap = false;
    pendingSnap = false;
    armCrashGrace();
    const gh = Number.isFinite(snapLastGh) ? snapLastGh : TERRAIN_ALT;
    plane.height = gh + snapAgl();
    groundAlt = gh;
    if (mp.active && mp.inRound) reportSnapped();
    else finishSnapStart();
  }
  const agl = plane.height - groundAlt;
  if (agl > 22) lastSafeAgl = agl;
  if (lastSafeAgl > 28 && lastSafeAgl - agl > 22) {
    armCrashGrace(1400);
  }
  const canCrash = flying && !pendingSnap && performance.now() > crashGraceUntil;
  const hitGround = canCrash && agl < 4;
  const hitBuilding = canCrash && wingHit();
  if (hitGround || hitBuilding) crashStreak += 1;
  else crashStreak = 0;
  if (crashStreak >= 3) crash();

  // aktywne wybuchy
  for (let i = explosions.length - 1; i >= 0; i--) {
    if (!explosions[i].update(dt)) explosions.splice(i, 1);
  }

  // latarnia domu — tylko z bliska, inaczej widać ją z całego lotu
  if (beacon && mode === "home" && homeTarget && !finished && !menuOpen) {
    const dist = distanceM(plane.latDeg, plane.lonDeg, homeTarget.lat, homeTarget.lon);
    const show = dist <= HOME_BEACON_M;
    if (show && (!beaconGrounded || frameCount % 60 === 0)) {
      placeBeaconAt(homeTarget.lat, homeTarget.lon);
    }
    beacon.visible = show;
    if (show) beacon.userData.ring.rotation.z += dt * 0.8;
  } else if (beacon) {
    beacon.visible = false;
  }

  // tryby: timer + warunki wygranej
  if (timerActive && !menuOpen && !paused && !guessOpen && !finished && (!crashed || mp.active)) {
    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      timerActive = false;
      if (mode === "home") {
        finished = true;
        if (plane) homePath.push({ lat: plane.latDeg, lon: plane.lonDeg });
        showBanner("TIME'S UP");
      } else if (mode === "guess") {
        openGuessMap();
      }
    }
  }
  if (mp.active && guessOpen && !paused && mp.inRound) {
    if (mp.phase === "mark" && !guessAnswered) {
      mp.markLeft -= dt;
      if (frameCount % 8 === 0) updateGuessPhaseUi();
      if (mp.markLeft <= 0) revealMpGuesses(true);
    } else if (mp.phase === "results") {
      mp.resultsLeft -= dt;
      if (frameCount % 8 === 0) updateGuessPhaseUi();
      if (mp.resultsLeft <= 0 && mp.host && !mp.launching) {
        if (humansWantPlay()) launchMpRound();
        else {
          finishRoomRound();
          mp.phase = "lobby";
          broadcastRoster();
        }
      }
    }
  }
  tickHostRound(dt);
  if (mp.active && !mp.host && menuOpen && mp.roundActive && !mp.inRound) {
    mp.phaseLeft = Math.max(0, (mp.phaseLeft || 0) - dt);
  }
  if (mp.active && menuOpen && !mp.inRound && frameCount % 20 === 0) {
    if (el.lobbyPhase) el.lobbyPhase.textContent = lobbyPhaseText();
  }
  if (mode === "home" && flying && frameCount % 8 === 0) recordHomePath();
  if (mode === "home" && homeTarget && flying) {
    const dist = distanceM(plane.latDeg, plane.lonDeg, homeTarget.lat, homeTarget.lon);
    if (dist < HOME_CAPTURE_M) {
      finished = true;
      timerActive = false;
      beacon.visible = false;
      homePath.push({ lat: homeTarget.lat, lon: homeTarget.lon });
      showBanner("YOU MADE IT HOME!");
    }
  }

  // HUD
  if (frameCount % 2 === 0) {
    updateHud(agl);
    syncGuessHud();
  }
  if (frameCount % 4 === 0) syncTouchUi();
  if (mode === "free" && !menuOpen && frameCount % 90 === 0) syncPlaceBadge();
  if (frameCount % 2 === 0) updateLocationMaps();

  if (menuOpen) {
    tiles.group.visible = false;
    if (planeMesh) planeMesh.visible = false;
    if (awaitingSnap) {
      tiles.setResolutionFromRenderer(camera, renderer);
      tiles.setCamera(camera);
      camera.updateMatrixWorld();
      retryFailedTiles();
      updateTilesSafe();
    }
  } else {
    tiles.group.visible = true;
    if (planeMesh && !crashed) planeMesh.visible = true;
    tiles.setResolutionFromRenderer(camera, renderer);
    tiles.setCamera(camera);
    camera.updateMatrixWorld();
    retryFailedTiles();
    updateTilesSafe();
  }

  renderer.render(scene, camera);

  const mateDbg = [];
  for (const [id, mate] of mp.mates) {
    mateDbg.push({
      id,
      visible: !!mate.mesh?.visible,
      dist: mate.mesh ? Math.round(mate.mesh.position.distanceTo(planePos)) : -1,
      hasPose: mp.poses.has(id),
      samples: mp.poses.get(id)?.samples?.length || 0,
    });
  }
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
    tileFailed: tiles.stats?.failed ?? -1,
    tileQueued: tiles.stats?.queued ?? -1,
    tileDown: tiles.stats?.downloading ?? -1,
    tileLoaded: tiles.stats?.loaded ?? -1,
    tile429: tile429Count,
    tileJobs: tiles.downloadQueue?.maxJobsPerOrigin ?? -1,
    tileErr: lastTileErr,
    memJs: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : -1,
    memTex: renderer.info?.memory?.textures ?? -1,
    memGeo: renderer.info?.memory?.geometries ?? -1,
    memCache: tiles.lruCache ? Math.round((tiles.lruCache.cachedBytes || 0) / 1048576) : -1,
    tilePool: tilePool.debug(),
    explosions: explosions.length,
    crashed,
    audio: engineDebug(),
    music: musicDebug(),
    camDist: camera.position.distanceTo(planePos),
    camOffset,
    mpActive: mp.active,
    inRound: mp.inRound,
    menuOpen,
    poses: mp.poses.size,
    mates: mateDbg,
  };
  window.__cam = camera;
  window.__planeMesh = planeMesh;
}

window.__forceTestMate = () => {
  mp.active = true;
  menuOpen = false;
  paused = true;
  el.menu.classList.add("hidden");
  el.landing.classList.add("hidden");
  el.lobby.classList.add("hidden");
  hideMpWait();
  const R = 6378137;
  const aheadM = 35;
  const eastM = 10;
  const lat = plane.latDeg + (aheadM / R) * (180 / Math.PI);
  const lon = plane.lonDeg + (eastM / (R * Math.cos(plane.lat))) * (180 / Math.PI);
  seedMatePose("test-mate", lat, lon, plane.height, selectedPlane);
  mp.goAt = performance.now();
};

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

function recordHomePath() {
  if (mode !== "home" || !plane || pendingSnap || awaitingSnap || menuOpen) return;
  const lat = plane.latDeg;
  const lon = plane.lonDeg;
  const last = homePath[homePath.length - 1];
  if (last && distanceM(last.lat, last.lon, lat, lon) < 90) return;
  homePath.push({ lat, lon });
  if (homePath.length > 900) homePath.splice(0, homePath.length - 800);
}

function showHomeTrail() {
  if (!el.homeTrail || !el.banner) return false;
  if (mode !== "home") return false;
  const start = { lat: startLat, lon: startLon };
  const home = homeTarget ? { lat: homeTarget.lat, lon: homeTarget.lon } : null;
  if (!home && homePath.length < 2) return false;
  el.homeTrail.hidden = false;
  el.banner.classList.add("trail");
  requestAnimationFrame(() => {
    paintTrailMap(el.homeTrail, { path: homePath, start, home });
  });
  return true;
}

function showBanner(title, sub = "") {
  if (!el.banner) return;
  el.banner.querySelector(".b-title").textContent = title;
  const subEl = el.banner.querySelector(".b-sub");
  subEl.textContent = sub;
  subEl.style.display = sub ? "" : "none";
  if (!showHomeTrail()) {
    if (el.homeTrail) el.homeTrail.hidden = true;
    el.banner.classList.remove("trail");
  }
  el.banner.classList.add("show");
}

function hideBanner() {
  if (el.banner) {
    el.banner.classList.remove("show", "trail");
  }
  if (el.homeTrail) el.homeTrail.hidden = true;
}
