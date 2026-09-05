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
  hostRoom,
  joinRoom,
  wasHosting,
  rememberHost,
} from "./game/net.js";
import { connectDirectory } from "./game/directory.js";
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
let planeMesh, plane, beacon;
let groundAlt = TERRAIN_ALT;
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
let snapFirstAt = 0;
let geoCache = null;
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
  roomId: "",
  myId: "",
  net: null,
  myName: "Host",
  myReady: false,
  myScore: 0,
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
  talkers: new Set(),
  visibility: "public",
  roomTitle: "",
  phase: "lobby",
  markLeft: 0,
  resultsLeft: 0,
};

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
  mpWait: document.getElementById("mp-wait"),
  mpWaitText: document.getElementById("mp-wait-text"),
  guessScope: document.getElementById("guess-scope"),
  landing: document.getElementById("landing"),
  rooms: document.getElementById("rooms"),
  roomsList: document.getElementById("rooms-list"),
  roomsStatus: document.getElementById("rooms-status"),
  roomsBack: document.getElementById("rooms-back"),
  roomVis: document.getElementById("room-vis"),
  btnCreateRoom: document.getElementById("btn-create-room"),
  lobbyVisSwitch: document.getElementById("lobby-vis-switch"),
  lobby: document.getElementById("lobby"),
  lobbyTitle: document.getElementById("lobby-title"),
  lobbyVis: document.getElementById("lobby-vis"),
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
  touchTalk: document.getElementById("touch-talk"),
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
}
document.querySelectorAll("#menu .mode-card").forEach((btn) => {
  btn.addEventListener("click", () => selectMode(btn.dataset.mode));
});
document.querySelectorAll("#menu .scope-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    guessScope = btn.dataset.scope;
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

let directory = null;
let publicRooms = [];
let announceTimer = 0;
let roomsLooking = false;

function setRoomsStatus(msg, isErr = false) {
  if (!el.roomsStatus) return;
  el.roomsStatus.textContent = msg || "";
  el.roomsStatus.classList.toggle("err", isErr);
}

function scopeLabel(scope = guessScope) {
  const pack = getRegionPack();
  if (scope === "pl") return pack.country.name;
  if (scope === "eu") return pack.continent.name;
  return "World";
}

function roomTitleFromParams(_visibility = mp.visibility, scope = guessScope) {
  return `Guess the region: ${scopeLabel(scope)}`;
}

function playerCountLabel(n = 1 + mp.players.size) {
  return `${n} player${n === 1 ? "" : "s"}`;
}

function syncRoomTitle() {
  mp.roomTitle = roomTitleFromParams();
}

function publicRoomInfo() {
  return {
    id: mp.roomId,
    title: roomTitleFromParams(),
    count: 1 + mp.players.size,
    scope: guessScope,
    scopeLabel: scopeLabel(guessScope),
    playing: mp.roundActive,
    visibility: mp.visibility,
  };
}

function publishRoom() {
  if (!mp.host || !mp.roomId || mp.visibility !== "public") return;
  ensureDirectory();
  directory?.announce(publicRoomInfo());
  if (!announceTimer) announceTimer = setInterval(() => directory?.announce(publicRoomInfo()), 4000);
}

function stopPublishing() {
  if (directory && mp.roomId) directory.unannounce(mp.roomId);
  clearInterval(announceTimer);
  announceTimer = 0;
}

function ensureDirectory() {
  if (directory) return directory;
  roomsLooking = true;
  renderRoomList();
  directory = connectDirectory((rooms) => {
    roomsLooking = false;
    publicRooms = rooms.filter((r) => r.id && r.visibility !== "private");
    renderRoomList();
  });
  return directory;
}

function closeDirectory() {
  stopPublishing();
  directory?.destroy();
  directory = null;
  publicRooms = [];
}

function renderRoomList() {
  if (!el.roomsList) return;
  const live = publicRooms.filter((r) => r.id !== mp.roomId);
  if (!live.length) {
    const msg = "No rooms yet — create the first one";
    el.roomsList.innerHTML = `<div class="room-row empty">${msg}</div>`;
    return;
  }
  el.roomsList.innerHTML = live.map((r) => {
    const playing = r.playing ? " · in flight" : "";
    const name = r.scopeLabel ? `Guess the region: ${r.scopeLabel}` : (r.title || "Guess the region");
    return `<div class="room-row">
      <div class="r-meta">
        <span class="r-name">${escapeHtml(name)}</span>
        <span class="r-sub">${playerCountLabel(r.count || 1)}${playing}</span>
      </div>
      <button type="button" data-join="${r.id}">Join</button>
    </div>`;
  }).join("");
  el.roomsList.querySelectorAll("[data-join]").forEach((btn) => {
    btn.addEventListener("click", () => openGuestLobby(btn.dataset.join));
  });
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showLanding() {
  hostGen += 1;
  closeRoom();
  closeDirectory();
  mp.active = false;
  menuOpen = true;
  el.landing.classList.remove("hidden");
  el.menu.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.rooms?.classList.add("hidden");
  carousel.setActive(false);
  lobbyCarousel.setActive(false);
  rememberHost("");
  history.replaceState(null, "", location.pathname + location.search);
}

function showRooms() {
  hostGen += 1;
  closeRoom();
  mp.active = false;
  menuOpen = true;
  el.landing.classList.add("hidden");
  el.menu.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.rooms.classList.remove("hidden");
  carousel.setActive(false);
  lobbyCarousel.setActive(false);
  rememberHost("");
  history.replaceState(null, "", location.pathname + location.search);
  ensureDirectory();
  renderRoomList();
}

function showSoloMenu() {
  closeDirectory();
  mp.active = false;
  menuOpen = true;
  el.landing.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.rooms?.classList.add("hidden");
  el.menu.classList.remove("hidden");
  carousel.setActive(true);
  lobbyCarousel.setActive(false);
}

function showLobby() {
  menuOpen = true;
  el.landing.classList.add("hidden");
  el.menu.classList.add("hidden");
  el.rooms?.classList.add("hidden");
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
      waiting: false,
      inRound: mp.inRound,
    },
    ...otherPlayers().map((p) => ({
      id: p.id,
      name: p.name,
      plane: p.plane,
      ready: p.ready,
      score: p.score,
      waiting: !!p.waiting,
      inRound: !!p.inRound,
    })),
  ];
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
    return `<div class="mp-tab-row"><span class="p-name${p.you ? " p-you" : ""}">${escapeHtml(p.name)}${you}</span><span class="p-score">${pts}</span></div>`;
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
      mp.waiting = !!p.waiting;
      mp.inRound = !!p.inRound;
      continue;
    }
    keep.add(p.id);
    const prev = mp.players.get(p.id) || {};
    mp.players.set(p.id, { ...prev, ...p });
  }
  for (const id of [...mp.players.keys()]) {
    if (!keep.has(id)) {
      mp.players.delete(id);
      disposeMate(id);
    }
  }
  updateMpPresence();
}

function broadcastRoster() {
  if (!mp.host || !mp.net) return;
  mp.net.send({
    t: "roster",
    players: rosterPayload(),
    roundActive: mp.roundActive,
    mode: "guess",
    scope: guessScope,
    visibility: mp.visibility,
    title: mp.roomTitle,
    city: el.lobbyCity.value,
    ...regionPayload(),
  });
  publishRoom();
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
    rows.push(`<div class="player-row empty">${mp.visibility === "private" ? "Private room – share the link" : "Waiting for players…"}</div>`);
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
  if (el.roomVis) el.roomVis.checked = mp.visibility === "private";
  el.lobbyVisSwitch?.classList.toggle("locked", !mp.host);
  if (el.lobbyTitle) el.lobbyTitle.textContent = roomTitleFromParams();
  if (el.lobbyVis) el.lobbyVis.textContent = playerCountLabel();

  const queued = mp.waiting || (mp.roundActive && !mp.inRound);
  el.lobbyStart.disabled = queued || !mp.host || mp.roundActive || mp.launching;
  el.lobbyStart.textContent = queued
    ? "Wait for next round"
    : mp.host
      ? "Start match"
      : "Waiting for host";

  if (queued) setLobbyStatus("Round in progress – you will join the next one");
  else if (!mp.host) setLobbyStatus(`Host picks the map. Fly 60s, mark in 10s, then the next round.`);
  else setLobbyStatus(`Pick a country or continent, then start. Anyone can join this ${mp.visibility} room.`);
}

function playerRow(p, isSelf) {
  const plane = PLANES[p.plane]?.name || "";
  const pts = p.score ? ` · ${p.score} pts` : "";
  let badge = "WAITING";
  let cls = "";
  if (p.waiting) {
    badge = "QUEUED";
    cls = " waiting";
  } else if (p.inRound) {
    badge = "IN FLIGHT";
    cls = " ingame";
  } else if (p.ready) {
    badge = "READY";
    cls = " ready";
  }
  return `<div class="player-row${cls}"><div class="p-meta"><span>${p.name}${isSelf ? " (You)" : ""}</span><span class="p-plane">${plane}${pts}</span></div><span class="p-ready">${badge}</span></div>`;
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
  return mp.active && mp.visibility === "private" && !!mp.net;
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
    const waiting = mp.roundActive;
    const name = uniquePlayerName(data.name);
    mp.players.set(fromId, {
      id: fromId,
      name,
      plane: data.plane || "pa28",
      ready: false,
      score: 0,
      waiting,
      inRound: false,
    });
    mp.net.sendTo(fromId, {
      t: "welcome",
      id: fromId,
      name,
      roster: rosterPayload(),
      roundActive: mp.roundActive,
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
  } else if (data.t === "welcome") {
    if (data.id) mp.myId = data.id;
    if (data.name) mp.myName = data.name;
    mp.roundActive = !!data.roundActive;
    mp.waiting = !!data.roundActive;
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
    mp.roundActive = !!data.roundActive;
    applyRemoteRegion(data);
    if (data.visibility) mp.visibility = data.visibility;
    if (data.title) mp.roomTitle = data.title;
    if (data.scope) setLobbyScope(data.scope);
    selectLobbyMode("guess");
    if (data.city != null) el.lobbyCity.value = data.city;
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
  } else if (data.t === "start") {
    if (data.seats && mp.myId && !data.seats[mp.myId]) {
      mp.roundActive = true;
      mp.waiting = true;
      mp.inRound = false;
      renderLobby();
      return;
    }
    applyRemoteRegion(data);
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

function handlePeerJoined() {
  if (mp.host) return;
  mp.net?.send({ t: "hello", name: mp.myName, plane: selectedPlane });
}

function handlePeerLeft(peerId) {
  if (peerId) {
    dropVoicePeer(peerId);
    mp.talkers.delete(peerId);
    updateVoiceUi();
  }
  if (!peerId) {
    disposeAllMates();
    mp.players.clear();
    mp.roundActive = false;
    mp.inRound = false;
    mp.waiting = false;
    if (!menuOpen) backToLobby();
    else renderLobby();
    setLobbyStatus("Host left – the room closed", true);
    return;
  }
  const gone = mp.players.get(peerId);
  mp.players.delete(peerId);
  mp.poses.delete(peerId);
  mp.guesses.delete(peerId);
  disposeMate(peerId);
  if (mp.host) {
    checkRoundClear();
    broadcastRoster();
  }
  if (guessOpen) maybeRevealGuesses();
  renderLobby();
  updateMpPresence();
  if (gone) setLobbyStatus(`${gone.name} left the room`);
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
  stopPublishing();
  mp.net?.destroy();
  mp.net = null;
  mp.roomId = "";
  mp.myId = "";
  mp.host = false;
  mp.myReady = false;
  mp.myScore = 0;
  mp.waiting = false;
  mp.inRound = false;
  mp.roundActive = false;
  mp.phase = "lobby";
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

function openHostLobby(existingId, opts = {}) {
  const gen = ++hostGen;
  if (opts.visibility === "private") closeDirectory();
  closeRoom();
  mp.active = true;
  mp.host = true;
  mp.myName = "Host";
  mp.visibility = opts.visibility === "private" ? "private" : "public";
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
      rememberHost(id);
      history.replaceState(null, "", `#r=${id}`);
      el.lobbyLink.value = roomLink(id);
      publishRoom();
      renderLobby();
      setLobbyStatus(
        mp.visibility === "private"
          ? `Private room ready — share the link`
          : "Public room is live — friends can join from the list or the link"
      );
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
  closeDirectory();
  closeRoom();
  mp.active = true;
  mp.host = false;
  mp.myName = randomUsername();
  mp.roomId = id;
  showLobby();
  el.lobbyLink.value = roomLink(id);
  setLobbyStatus("Joining room…");
  history.replaceState(null, "", `#r=${id}`);
  const api = joinRoom(id, {
    onStatus(msg) {
      setLobbyStatus(msg);
    },
    onOpen(_hostId, myId) {
      if (myId) mp.myId = myId;
      renderLobby();
    },
    onPeer: handlePeerJoined,
    onData: handleNetData,
    onCall: handleVoiceCall,
    onLeft: handlePeerLeft,
    onError: handleNetError,
  });
  attachNet(api);
}

function tryStartMp() {}

async function launchMpRound() {
  if (mp.launching) return;
  mp.launching = true;
  mode = "guess";
  mp.waiting = false;
  for (const p of mp.players.values()) {
    p.waiting = false;
    p.ready = false;
  }
  el.lobbyStart.disabled = true;
  showMpWait("Picking a new point…");
  try {
    const scope = GUESS_SCOPES[guessScope];
    setLobbyStatus(scope.status);
    const p = pickGuessStart(guessScope);
    const msg = { t: "start", mode: "guess", lat: p.lat, lon: p.lon, scope: guessScope, seats: buildSeats(), ...regionPayload() };
    mp.net?.send(msg);
    startMpFlight(msg);
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
  seats[mp.myId] = i++;
  for (const p of otherPlayers()) {
    if (!p.waiting) seats[p.id] = i++;
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
  mp.waiting = !mp.inRound;
  mp.myReady = false;
  for (const p of mp.players.values()) {
    p.ready = false;
    p.inRound = !!(seats && seats[p.id] != null);
  }
}

async function startMpFlight(msg) {
  mode = msg.mode || "guess";
  guessScope = msg.scope || guessScope;
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
  mp.launching = false;
  mp.goAt = 0;
  markRoundStarted(mp.seats);
  mp.phase = "fly";
  mp.markLeft = 0;
  mp.resultsLeft = 0;
  homeTarget = msg.homeLat != null ? { lat: msg.homeLat, lon: msg.homeLon } : null;
  timeLeft = GUESS_TIME;
  publishRoom();
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
  if (mp.host) {
    broadcastRoster();
    const releaseIfSnapped = () => {
      if (!mp.host || !mp.roundActive || mp.goSent) return;
      if ([...mp.snapInfo.values()].some(isTerrainSnap)) applyGo();
    };
    setTimeout(releaseIfSnapped, 12000);
    setTimeout(releaseIfSnapped, 22000);
  }
}

function reportSnapped() {
  if (!mp.active || !mp.inRound || mp.goSent || mp.waitingGo) return;
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
  if (mp.goSent) return;
  const payload = msg && Number.isFinite(msg.h)
    ? { h: msg.h, gh: msg.gh, heading: msg.heading ?? 0 }
    : buildGoPayload();
  if (!payload) return;
  mp.goSent = true;
  mp.waitingGo = false;
  if (mp.host) mp.net?.send({ t: "go", ...payload });
  pendingSnap = false;
  awaitingSnap = false;
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
  finishSnapStart();
}

function leaveRound() {
  const wasIn = mp.inRound;
  mp.inRound = false;
  mp.myReady = false;
  if (wasIn) mp.net?.send({ t: "done", from: mp.myId });
  if (mp.host) {
    if (mp.rematch.size) abortRematchToLobby();
    else checkRoundClear();
  }
}

function checkRoundClear() {
  if (!mp.host) return;
  if (mp.inRound || otherPlayers().some((p) => p.inRound)) return;
  finishRoomRound();
  mp.net?.send({ t: "roundEnd" });
  broadcastRoster();
}

function finishRoomRound() {
  mp.roundActive = false;
  mp.inRound = false;
  mp.waiting = false;
  mp.myReady = false;
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
  guessScope = scope;
  document.querySelectorAll("#lobby-scopes .scope-btn").forEach((b) =>
    b.classList.toggle("selected", b.dataset.scope === scope)
  );
  syncRoomTitle();
  if (el.lobbyTitle) el.lobbyTitle.textContent = roomTitleFromParams();
  if (broadcast && mp.host && mp.net) {
    mp.net.send({ t: "scope", scope, title: mp.roomTitle, ...regionPayload() });
    publishRoom();
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

function init() {
  if (!ION_KEY && !API_KEY) {
    setLoader("Missing map key – add VITE_CESIUM_ION_KEY to .env", 0);
    return;
  }
  setLoader("Start…", 0.4);

  try {
  scene = new Scene();
  scene.background = new Color(0x8ec8e8);
  scene.fog = new FogExp2(0x9dd0ea, 0.00007);

  renderer = new WebGLRenderer({
    antialias: !isMobile,
    powerPreference: "high-performance",
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
  let tileHoldUntil = 0;
  let tileErrorTarget = 10;
  tiles.registerPlugin({
    name: "TILE_HOLD_PLUGIN",
    priority: -100,
    tiles: null,
    init(t) {
      this.tiles = t;
    },
    fetchData(url, options) {
      const g = this.tiles.getPluginByName("GOOGLE_CLOUD_AUTH_PLUGIN");
      if (g?.auth) g.auth.autoRefreshToken = false;
      if (g?.fetchData) return g.fetchData(url, options);
      const ion = this.tiles.getPluginByName("CESIUM_ION_AUTH_PLUGIN");
      if (ion?.auth) return ion.auth.fetch(url, options);
      return null;
    },
  });
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
  const draco = new DRACOLoader();
  draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
  tiles.registerPlugin(new GLTFExtensionsPlugin({ dracoLoader: draco }));
  tiles.group.rotation.x = -Math.PI / 2;
  tiles.group.visible = false;
  scene.add(tiles.group);
  tiles.setResolutionFromRenderer(camera, renderer);
  tiles.setCamera(camera);
  tiles.errorTarget = tileErrorTarget;
  tiles.lruCache.maxSize = isMobile ? 1600 : 3000;
  tiles.lruCache.maxBytesSize = isMobile ? 2.8e8 : 1.5e9;
  if (isMobile) tiles.loadSiblings = false;

  const holdLoadedTiles = () => {
    tileHoldUntil = performance.now() + 12000;
    tiles.resetFailedTiles();
    tiles.errorTarget = 1e6;
    tiles.group.visible = !menuOpen;
  };
  const releaseTileHold = () => {
    if (tileHoldUntil && performance.now() >= tileHoldUntil) {
      tileHoldUntil = 0;
      tiles.errorTarget = tileErrorTarget;
    }
  };

  // czytelny komunikat zamiast wiecznego ładowania
  tiles.addEventListener("load-error", (ev) => {
    const msg = String(ev?.error?.message || "");
    if (msg.includes("429") || msg.includes("error code 429")) holdLoadedTiles();
    if (!loaderDismissed) {
      loadError = ION_KEY
        ? "Cesium ion is not responding – check VITE_CESIUM_ION_KEY"
        : "Google blocked 3D tiles for EEA accounts – add VITE_CESIUM_ION_KEY to .env";
    }
  });
  setTimeout(() => {
    if (!loaderDismissed && tiles.group.children.length === 0) {
      loadError = ION_KEY
        ? "The map is not loading… check VITE_CESIUM_ION_KEY"
        : "Google disabled 3D tiles for EEA accounts – you need a free Cesium ion token (VITE_CESIUM_ION_KEY in .env)";
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
  finished = false;
  shake = 0;
  ctrl.roll = 0;
  ctrl.pitch = 0;
  camInit = false;
  if (planeMesh) planeMesh.visible = true;
  hideBanner();
}

function applyPixelRatio() {
  if (!renderer) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
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
  explosions.push(createExplosion(scene, planePos.clone()));
  playExplosionSound();
  shake = 1;
  if (planeMesh) planeMesh.visible = false;
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
      const p = pickGuessStart(guessScope);
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
  el.timerBox.classList.toggle("show", mode !== "free");
  el.distBox.classList.remove("show");
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
  setTimeout(clearStarting, 2500);
}

function unlockAudio() {
  try {
    primeAudio();
    primeMusic();
  } catch {
    /* iOS can reject AudioContext; flight still works */
  }
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

el.btnSolo.addEventListener("click", () => {
  unlockAudio();
  showSoloMenu();
});
el.btnMulti.addEventListener("click", () => {
  unlockAudio();
  showRooms();
});
el.roomsBack?.addEventListener("click", () => showLanding());
el.btnCreateRoom?.addEventListener("click", () => {
  unlockAudio();
  openHostLobby(null, { visibility: "public" });
});
el.roomVis?.addEventListener("change", () => {
  if (!mp.host) return;
  const next = el.roomVis.checked ? "private" : "public";
  if (next === mp.visibility) return;
  mp.visibility = next;
  syncRoomTitle();
  if (mp.visibility === "private") {
    stopPublishing();
  } else {
    publishRoom();
  }
  mp.net?.send({ t: "roster", players: rosterPayload(), roundActive: mp.roundActive, mode: "guess", scope: guessScope, visibility: mp.visibility, title: mp.roomTitle, ...regionPayload() });
  renderLobby();
  updateVoiceUi();
});
el.menuBack.addEventListener("click", () => showLanding());
el.lobbyBack.addEventListener("click", () => showRooms());
el.lobbyCopy.addEventListener("click", async () => {
  const link = el.lobbyLink.value;
  if (!link) return;
  try {
    await navigator.clipboard.writeText(link);
    el.lobbyCopy.textContent = "Copied";
    setTimeout(() => { el.lobbyCopy.textContent = "Copy link"; }, 1600);
  } catch {
    el.lobbyLink.select();
  }
});
el.lobbyStart.addEventListener("click", () => {
  unlockAudio();
  if (!mp.host) {
    setLobbyStatus("Waiting for the host to start the match");
    return;
  }
  if (mp.waiting || (mp.roundActive && !mp.inRound)) {
    setLobbyStatus("Round in progress – you will join the next one");
    return;
  }
  if (mp.roundActive || mp.launching) return;
  launchMpRound();
});

const joinId = parseRoomFromUrl();
if (joinId) {
  if (wasHosting(joinId)) openHostLobby(joinId);
  else openGuestLobby(joinId);
}

function syncPauseCopy() {
  if (mp.active) {
    if (el.pauseTitle) el.pauseTitle.textContent = "Leave match?";
    if (el.pauseSub) el.pauseSub.textContent = "The round keeps going for everyone else.";
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
  el.guessmap.classList.remove("show");
  el.start.disabled = false;
  el.menuError.textContent = "";
  el.landing.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.menu.classList.remove("hidden");
  carousel.setActive(true);
}

// --- mapa zgadywania ---
function drawGuessMap(marks = []) {
  if (!geoCache) return;
  GUESS_SCOPES[guessScope].draw(el.gmCanvas, geoCache, marks);
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
  const draw = () => requestAnimationFrame(() => drawGuessMap());
  if (geoCache) {
    draw();
    return;
  }
  el.gmSub.textContent = "Loading map…";
  GUESS_SCOPES[guessScope].load()
    .then((g) => {
      geoCache = g;
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
    el.gmTimer.textContent = `Next round in ${sec}s`;
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

const touch = { roll: 0, pitch: 0, boost: false, brake: false, pid: null };

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
bindHold(el.touchBoost, () => { touch.boost = true; }, () => { touch.boost = false; });
bindHold(el.touchBrake, () => { touch.brake = true; }, () => { touch.brake = false; });
bindHold(el.touchTalk, () => startTalk(), () => stopTalk());
el.touchPause?.addEventListener("click", () => setPaused(true));
el.stick?.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

function syncTouchUi() {
  if (!el.touch) return;
  const show = !menuOpen && !paused && !guessOpen && !crashed && !finished;
  el.touch.classList.toggle("hidden", !show);
  el.touch.classList.toggle("show", show);
  el.touch.classList.toggle("talk", voiceEnabled());
  if (!show) {
    resetStick();
    touch.boost = false;
    touch.brake = false;
  }
}

function restartMode() {
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
    const p = pickGuessStart(guessScope);
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
  ctrl.throttle = touch.boost || keys.has("shift") ? 1 : touch.brake || keys.has("control") ? -1 : 0;

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
      groundAlt = gh;
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
    if (snapLastGh !== null) plane.height = snapLastGh + snapAgl();
    if (mp.active && mp.inRound) reportSnapped();
    else finishSnapStart();
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
      if (mp.resultsLeft <= 0 && mp.host && !mp.launching) launchMpRound();
    }
  }
  if (mode === "home" && homeTarget && flying) {
    const dist = distanceM(plane.latDeg, plane.lonDeg, homeTarget.lat, homeTarget.lon);
    if (dist < HOME_CAPTURE_M) {
      finished = true;
      timerActive = false;
      beacon.visible = false;
      showBanner("YOU MADE IT HOME!");
    }
  }

  // HUD
  if (frameCount % 2 === 0) updateHud(agl);
  if (frameCount % 4 === 0) syncTouchUi();

  if (menuOpen) {
    tiles.group.visible = false;
    if (planeMesh) planeMesh.visible = false;
    if (awaitingSnap) {
      tiles.setResolutionFromRenderer(camera, renderer);
      tiles.setCamera(camera);
      camera.updateMatrixWorld();
      releaseTileHold();
      tiles.update();
    }
  } else {
    tiles.group.visible = true;
    if (planeMesh && !crashed) planeMesh.visible = true;
    tiles.setResolutionFromRenderer(camera, renderer);
    tiles.setCamera(camera);
    camera.updateMatrixWorld();
    releaseTileHold();
    tiles.update();
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
