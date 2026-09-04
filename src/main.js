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
import {
  parseRoomFromUrl,
  roomLink,
  hostRoom,
  joinRoom,
  wasHosting,
  rememberHost,
} from "./game/net.js";

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
const matePos = new Vector3();
const mateQuat = new Quaternion();
const PLAYER_COLORS = ["#7ec8e3", "#e37e7e", "#9dce6a", "#d4a5f5", "#f0c36e", "#6ec8c1"];

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
  landing: document.getElementById("landing"),
  lobby: document.getElementById("lobby"),
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
  lobbyCarCanvas: document.getElementById("lobby-carousel-canvas"),
  lobbyCarPrev: document.getElementById("lobby-car-prev"),
  lobbyCarNext: document.getElementById("lobby-car-next"),
  lobbyCarName: document.getElementById("lobby-car-name"),
  lobbyCarDesc: document.getElementById("lobby-car-desc"),
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
const lobbyCarousel = createCarousel(
  el.lobbyCarCanvas,
  PLANE_ORDER.map((k) => ({
    key: k,
    file: PLANES[k].file,
    wingspan: PLANES[k].wingspan,
    prepare: PLANES[k].prepare,
  }))
);
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

function showLanding() {
  closeRoom();
  mp.active = false;
  menuOpen = true;
  el.landing.classList.remove("hidden");
  el.menu.classList.add("hidden");
  el.lobby.classList.add("hidden");
  carousel.setActive(false);
  lobbyCarousel.setActive(false);
  rememberHost("");
  history.replaceState(null, "", location.pathname + location.search);
}

function showSoloMenu() {
  mp.active = false;
  menuOpen = true;
  el.landing.classList.add("hidden");
  el.lobby.classList.add("hidden");
  el.menu.classList.remove("hidden");
  carousel.setActive(true);
  lobbyCarousel.setActive(false);
}

function showLobby() {
  menuOpen = true;
  el.landing.classList.add("hidden");
  el.menu.classList.add("hidden");
  el.lobby.classList.remove("hidden");
  carousel.setActive(false);
  lobbyCarousel.setActive(true);
  applyLobbySetup();
  renderLobby();
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
  if (id === mp.myId) return "Ty";
  return mp.players.get(id)?.name || "Gracz";
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
}

function broadcastRoster() {
  if (!mp.host || !mp.net) return;
  mp.net.send({
    t: "roster",
    players: rosterPayload(),
    roundActive: mp.roundActive,
    mode,
    scope: guessScope,
    city: el.lobbyCity.value,
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
    rows.push(`<div class="player-row empty">Czekam na graczy… wyślij link</div>`);
  }
  el.lobbyPlayers.innerHTML = rows.join("");
  el.lobbyScopes.classList.toggle("locked", !mp.host);
  document.querySelector(".lobby-modes")?.classList.toggle("locked", !mp.host);
  el.lobbyCity.classList.toggle("locked", !mp.host);
  el.lobbyCity.readOnly = !mp.host;
  if (mp.roomId) el.lobbyLink.value = roomLink(mp.roomId);

  const queued = mp.waiting || (mp.roundActive && !mp.inRound);
  el.lobbyStart.disabled = queued;
  el.lobbyStart.textContent = queued
    ? "Poczekaj na rundę"
    : mp.myReady
      ? "Anuluj gotowość"
      : "Start";

  const playable = playablePlayers().length;
  const readyN = (mp.myReady && !mp.waiting ? 1 : 0) + otherPlayers().filter((p) => !p.waiting && p.ready).length;
  if (queued) setLobbyStatus("Runda w toku — dołączysz w następnej turze");
  else if (playable < 2) setLobbyStatus("Wyślij link znajomym — wszyscy w pokoju muszą nacisnąć Start");
  else if (mp.myReady && readyN === playable) setLobbyStatus("Startujemy…");
  else if (mp.myReady) setLobbyStatus(`Czekam aż wszyscy naciśną Start (${readyN}/${playable})`);
  else setLobbyStatus(`Wszyscy naciśnijcie Start (${playable} graczy)`);
}

function playerRow(p, isSelf) {
  const plane = PLANES[p.plane]?.name || "";
  const pts = p.score ? ` · ${p.score} pkt` : "";
  let badge = "CZEKA";
  let cls = "";
  if (p.waiting) {
    badge = "W KOLEJCE";
    cls = " waiting";
  } else if (p.inRound) {
    badge = "W GRZE";
    cls = " ingame";
  } else if (p.ready) {
    badge = "GOTOWY";
    cls = " ready";
  }
  return `<div class="player-row${cls}"><div class="p-meta"><span>${p.name}${isSelf ? " (Ty)" : ""}</span><span class="p-plane">${plane}${pts}</span></div><span class="p-ready">${badge}</span></div>`;
}

function applyLobbySetup() {
  document.querySelectorAll("#lobby .mode-card").forEach((b) =>
    b.classList.toggle("selected", b.dataset.mode === mode)
  );
  el.lobbyModeDesc.textContent = MODE_DESCS[mode] || "";
  el.lobbyScopes.style.display = mode === "guess" ? "flex" : "none";
  el.lobbyCity.style.display = mode === "guess" ? "none" : "block";
  el.lobbyCity.placeholder = MODE_PLACEHOLDERS[mode] || "";
}

function selectLobbyMode(m, broadcast = false) {
  mode = m;
  applyLobbySetup();
  if (broadcast && mp.host && mp.net) {
    mp.myReady = false;
    for (const p of mp.players.values()) p.ready = false;
    mp.net.send({ t: "mode", mode: m, city: el.lobbyCity.value, scope: guessScope });
    broadcastRoster();
  }
  renderLobby();
}

function attachNet(api) {
  mp.net = api;
}

function handleNetData(data, fromId) {
  if (!data || !data.t) return;
  if (mp.host && fromId) {
    data = { ...data, from: fromId };
    if (data.t !== "hello") mp.net.sendExcept(fromId, data);
  }

  if (data.t === "hello") {
    if (!mp.host || !fromId) return;
    const waiting = mp.roundActive;
    const name = `Gość ${mp.players.size + 1}`;
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
      mode,
      scope: guessScope,
      city: el.lobbyCity.value,
    });
    broadcastRoster();
    renderLobby();
  } else if (data.t === "welcome") {
    if (data.id) mp.myId = data.id;
    if (data.name) mp.myName = data.name;
    mp.roundActive = !!data.roundActive;
    mp.waiting = !!data.roundActive;
    if (data.scope) setLobbyScope(data.scope);
    if (data.mode) selectLobbyMode(data.mode);
    if (data.city != null) el.lobbyCity.value = data.city;
    applyRoster(data.roster);
    applyLobbySetup();
    renderLobby();
  } else if (data.t === "roster") {
    mp.roundActive = !!data.roundActive;
    if (data.scope) setLobbyScope(data.scope);
    if (data.mode) selectLobbyMode(data.mode);
    if (data.city != null) el.lobbyCity.value = data.city;
    applyRoster(data.players);
    applyLobbySetup();
    renderLobby();
  } else if (data.t === "scope") {
    setLobbyScope(data.scope);
  } else if (data.t === "mode") {
    if (data.scope) setLobbyScope(data.scope);
    if (data.city != null) el.lobbyCity.value = data.city;
    mp.myReady = false;
    for (const p of mp.players.values()) p.ready = false;
    selectLobbyMode(data.mode);
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
  } else if (data.t === "snapped") {
    if (mp.host && data.from) {
      mp.snapped.add(data.from);
      tryReleaseGo();
    }
  } else if (data.t === "go") {
    releaseGo();
  } else if (data.t === "start") {
    if (data.seats && mp.myId && !data.seats[mp.myId]) {
      mp.roundActive = true;
      mp.waiting = true;
      mp.inRound = false;
      renderLobby();
      return;
    }
    startMpFlight(data);
  } else if (data.t === "pose") {
    const id = data.from;
    if (!id || id === mp.myId) return;
    mp.poses.set(id, data);
    if (data.plane) loadMate(id, data.plane);
  } else if (data.t === "guess") {
    const id = data.from;
    if (!id || id === mp.myId) return;
    mp.guesses.set(id, { lat: data.lat, lon: data.lon });
    if (guessOpen) maybeRevealGuesses();
  } else if (data.t === "done") {
    const id = data.from;
    if (id && mp.players.has(id)) mp.players.get(id).inRound = false;
    if (mp.host) checkRoundClear();
    renderLobby();
  } else if (data.t === "roundEnd") {
    finishRoomRound();
    renderLobby();
  }
}

function handlePeerJoined() {
  if (mp.host) return;
  mp.net?.send({ t: "hello", name: mp.myName, plane: selectedPlane });
}

function handlePeerLeft(peerId) {
  if (!peerId) {
    disposeAllMates();
    mp.players.clear();
    mp.roundActive = false;
    mp.inRound = false;
    mp.waiting = false;
    if (!menuOpen) backToLobby();
    else renderLobby();
    setLobbyStatus("Host wyszedł — pokój się zamknął", true);
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
  if (gone) setLobbyStatus(`${gone.name} wyszedł z pokoju`);
}

function handleNetError(err) {
  if (err?.type === "unavailable-id" && mp.host && mp.roomId) {
    openGuestLobby(mp.roomId);
    return;
  }
  const msg = err?.type === "peer-unavailable"
    ? "Nie znaleziono hosta — niech otworzy Multiplayer i nie odświeża strony, potem wejdź w link jeszcze raz"
    : err?.type === "unavailable-id"
      ? "Ten pokój jest zajęty — dołączam jako gość…"
      : "Błąd połączenia — sprawdź sieć i wejdź w link ponownie";
  setLobbyStatus(msg, true);
}

function closeRoom() {
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
  mp.players.clear();
  mp.guesses.clear();
  mp.poses.clear();
  mp.seats = {};
  disposeAllMates();
}

function openHostLobby(existingId) {
  closeRoom();
  mp.active = true;
  mp.host = true;
  mp.myName = "Host";
  if (existingId) mp.roomId = existingId;
  selectLobbyMode("guess");
  showLobby();
  setLobbyStatus("Tworzę pokój…");
  const api = hostRoom({
    onOpen(id) {
      mp.roomId = id;
      mp.myId = id;
      rememberHost(id);
      history.replaceState(null, "", `#r=${id}`);
      el.lobbyLink.value = roomLink(id);
      renderLobby();
    },
    onPeer: handlePeerJoined,
    onData: handleNetData,
    onLeft: handlePeerLeft,
    onError: handleNetError,
  }, existingId);
  attachNet(api);
}

function openGuestLobby(id) {
  closeRoom();
  mp.active = true;
  mp.host = false;
  mp.myName = "Gość";
  mp.roomId = id;
  showLobby();
  el.lobbyLink.value = roomLink(id);
  setLobbyStatus("Łączę z pokojem…");
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
    onLeft: handlePeerLeft,
    onError: handleNetError,
  });
  attachNet(api);
}

function tryStartMp() {
  if (!mp.host || !mp.myReady || mp.roundActive) return;
  const others = otherPlayers().filter((p) => !p.waiting);
  if (!others.length || others.some((p) => !p.ready)) return;
  launchMpRound();
}

async function launchMpRound() {
  el.lobbyStart.disabled = true;
  try {
    if (mode === "guess") {
      const scope = GUESS_SCOPES[guessScope];
      setLobbyStatus(scope.status);
      geoCache = await scope.load();
      const p = scope.random(geoCache);
      const msg = { t: "start", mode, lat: p.lat, lon: p.lon, scope: guessScope, seats: buildSeats() };
      mp.net?.send(msg);
      startMpFlight(msg);
    } else if (mode === "home") {
      const addr = el.lobbyCity.value.trim();
      if (!addr) {
        setLobbyStatus("Wpisz adres domu", true);
        el.lobbyStart.disabled = false;
        return;
      }
      setLobbyStatus("Szukam adresu…");
      const loc = await geocodeCity(addr);
      if (!loc) {
        setLobbyStatus("Nie znaleziono takiego adresu", true);
        el.lobbyStart.disabled = false;
        return;
      }
      const start = offsetPoint(loc.lat, loc.lon, 20 + Math.random() * 10);
      const msg = {
        t: "start",
        mode,
        lat: start.lat,
        lon: start.lon,
        homeLat: loc.lat,
        homeLon: loc.lon,
        seats: buildSeats(),
      };
      mp.net?.send(msg);
      startMpFlight(msg);
    } else {
      const city = el.lobbyCity.value.trim() || "Niepruszewo";
      setLobbyStatus(`Szukam: ${city}…`);
      const loc = await geocodeCity(city);
      if (!loc) {
        setLobbyStatus(`Nie znaleziono miejscowości „${city}"`, true);
        el.lobbyStart.disabled = false;
        return;
      }
      const msg = { t: "start", mode, lat: loc.lat, lon: loc.lon, seats: buildSeats() };
      mp.net?.send(msg);
      startMpFlight(msg);
    }
  } catch {
    setLobbyStatus("Błąd — sprawdź sieć i spróbuj ponownie", true);
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

function offsetByIndex(lat, lon, index, total) {
  if (total <= 1) return { lat, lon };
  const spacingM = 20;
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
  mp.truth = { lat: msg.lat, lon: msg.lon };
  mp.seats = msg.seats || {};
  mp.snapped = new Set();
  mp.goSent = false;
  mp.waitingGo = false;
  markRoundStarted(mp.seats);
  homeTarget = msg.homeLat != null ? { lat: msg.homeLat, lon: msg.homeLon } : null;
  timeLeft = mode === "guess" ? GUESS_TIME : mode === "home" ? HOME_TIME : 0;
  timerActive = false;
  el.lobbyStart.disabled = false;
  setLobbyStatus("Ładowanie terenu… czekam na wszystkich");
  if (mode === "guess" && !geoCache) {
    GUESS_SCOPES[guessScope].load().then((g) => { geoCache = g; }).catch(() => {});
  }
  const seat = mp.seats[mp.myId] ?? 0;
  const total = Object.keys(mp.seats).length || 1;
  const spawn = offsetByIndex(msg.lat, msg.lon, seat, total);
  if (selectedPlane !== planeMesh?.userData?.key) loadPlane(selectedPlane);
  for (const p of otherPlayers()) {
    if (p.inRound) loadMate(p.id, p.plane || "pa28");
  }
  beginFlight(spawn.lat, spawn.lon);
  if (mode === "home" && homeTarget) placeBeaconAt(homeTarget.lat, homeTarget.lon);
  if (mp.host) {
    broadcastRoster();
    setTimeout(() => {
      if (mp.host && mp.roundActive && !mp.goSent) releaseGo();
    }, 10000);
  }
}

function reportSnapped() {
  if (!mp.active || !mp.inRound || mp.goSent || mp.waitingGo) return;
  mp.waitingGo = true;
  setLobbyStatus("Czekam aż wszyscy będą gotowi…");
  mp.net?.send({ t: "snapped", from: mp.myId });
  if (mp.host) {
    mp.snapped.add(mp.myId);
    tryReleaseGo();
  }
}

function tryReleaseGo() {
  if (!mp.host || mp.goSent) return;
  const need = Object.keys(mp.seats || {});
  if (need.length && need.every((id) => mp.snapped.has(id))) releaseGo();
}

function releaseGo() {
  if (mp.goSent) return;
  mp.goSent = true;
  mp.waitingGo = false;
  if (mp.host) mp.net?.send({ t: "go" });
  finishSnapStart();
}

function leaveRound() {
  const wasIn = mp.inRound;
  mp.inRound = false;
  mp.myReady = false;
  if (wasIn) mp.net?.send({ t: "done", from: mp.myId });
  if (mp.host) checkRoundClear();
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
  hideAllMates();
}

function backToLobby() {
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
  if (broadcast && mp.host && mp.net) mp.net.send({ t: "scope", scope });
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

function disposeMate(id) {
  const mate = mp.mates.get(id);
  if (mate?.mesh && scene) scene.remove(mate.mesh);
  mp.mates.delete(id);
}

function disposeAllMates() {
  for (const id of [...mp.mates.keys()]) disposeMate(id);
}

function hideAllMates() {
  for (const mate of mp.mates.values()) {
    if (mate.mesh) mate.mesh.visible = false;
  }
}

function loadMate(id, key) {
  if (!id || !key || !PLANES[key] || !scene) return;
  const prev = mp.mates.get(id);
  if (prev?.key === key && prev.mesh) return;
  disposeMate(id);
  const spec = PLANES[key];
  const placeholder = createPlaneMesh();
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
    scene.remove(cur.mesh);
    scene.add(wrapper);
    mp.mates.set(id, { mesh: wrapper, key });
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
  explosions.push(createExplosion(scene, planePos.clone()));
  playExplosionSound();
  shake = 1;
  if (planeMesh) planeMesh.visible = false;
  if (mp.active && mode === "guess") return; // runda trwa — po minucie i tak zgadujecie
  timerActive = false;
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
  el.landing.classList.add("hidden");
  el.lobby.classList.add("hidden");
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

el.btnSolo.addEventListener("click", () => {
  unlockAudio();
  showSoloMenu();
});
el.btnMulti.addEventListener("click", () => {
  unlockAudio();
  openHostLobby();
});
el.menuBack.addEventListener("click", () => showLanding());
el.lobbyBack.addEventListener("click", () => showLanding());
el.lobbyCopy.addEventListener("click", async () => {
  const link = el.lobbyLink.value;
  if (!link) return;
  try {
    await navigator.clipboard.writeText(link);
    el.lobbyCopy.textContent = "Skopiowano";
    setTimeout(() => { el.lobbyCopy.textContent = "Kopiuj link"; }, 1600);
  } catch {
    el.lobbyLink.select();
  }
});
el.lobbyStart.addEventListener("click", () => {
  unlockAudio();
  if (mp.waiting || (mp.roundActive && !mp.inRound)) {
    setLobbyStatus("Runda w toku — dołączysz w następnej turze");
    return;
  }
  if (playablePlayers().length < 2) {
    setLobbyStatus("Najpierw poczekaj, aż ktoś wejdzie z linku", true);
    return;
  }
  mp.myReady = !mp.myReady;
  mp.net?.send({ t: "ready", ready: mp.myReady, from: mp.myId });
  renderLobby();
  tryStartMp();
});

const joinId = parseRoomFromUrl();
if (joinId) {
  if (wasHosting(joinId)) openHostLobby(joinId);
  else openGuestLobby(joinId);
}

// --- pauza (ESC) ---
function setPaused(v) {
  paused = v;
  keys.clear();
  el.pause.classList.toggle("show", v);
}

el.resume.addEventListener("click", () => setPaused(false));
el.restart.addEventListener("click", () => {
  setPaused(false);
  if (mp.active) backToLobby();
  else backToMenu();
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
  GUESS_SCOPES[guessScope].draw(el.gmCanvas, geoCache, marks);
}

function openGuessMap() {
  guessOpen = true;
  guessAnswered = false;
  keys.clear();
  el.gmResult.textContent = "";
  el.gmClose.style.display = "none";
  el.gmRetry.style.display = "none";
  el.gmClose.textContent = mp.active ? "Wróć do pokoju" : "Wróć do menu";
  el.gmRetry.textContent = mp.active ? "Jeszcze runda" : "Spróbuj ponownie";
  el.gmSub.textContent = mp.active
    ? "Kliknij, gdzie was wyrzucono — kto bliżej, wygrywa"
    : GUESS_SCOPES[guessScope].sub;
  el.guessmap.classList.add("show");
  requestAnimationFrame(() => drawGuessMap());
}

function maybeRevealGuesses() {
  const need = inRoundPlayers().length;
  if (!need || mp.guesses.size < need) {
    if (guessOpen) {
      el.gmResult.textContent = `Czekam na zaznaczenia… ${mp.guesses.size}/${need}`;
    }
    return;
  }
  revealMpGuesses();
}

function revealMpGuesses() {
  if (!mp.truth || guessAnswered) return;
  if (mp.guesses.size < inRoundPlayers().length) return;
  guessAnswered = true;
  const marks = [
    { lat: mp.truth.lat, lon: mp.truth.lon, color: "#d8a24a", label: "Tu byliście", truth: true },
  ];
  const results = [];
  for (const [id, g] of mp.guesses) {
    const err = distanceM(g.lat, g.lon, mp.truth.lat, mp.truth.lon) / 1000;
    results.push({ id, err, name: playerName(id) });
    marks.push({ lat: g.lat, lon: g.lon, color: playerColor(id), label: playerName(id) });
  }
  drawGuessMap(marks);
  results.sort((a, b) => a.err - b.err);
  const best = results[0]?.err ?? 0;
  const winners = results.filter((r) => r.err - best < 0.5);
  if (winners.length === 1) {
    const w = winners[0];
    if (w.id === mp.myId) mp.myScore += 1;
    else if (mp.players.has(w.id)) mp.players.get(w.id).score += 1;
  }
  const line = results.map((r) => `${r.name} ${Math.round(r.err)} km`).join(" · ");
  const scoreboard = [mp.myName, ...otherPlayers().map((p) => p.name)]
    .map((n, i) => {
      const pts = i === 0 ? mp.myScore : otherPlayers()[i - 1].score;
      return `${n} ${pts}`;
    })
    .join("–");
  el.gmResult.textContent =
    winners.length > 1
      ? `Remis — ${line}  (${scoreboard})`
      : `Wygrywa ${winners[0]?.name} — ${line}  (${scoreboard})`;
  el.gmClose.style.display = "";
  el.gmRetry.style.display = "";
  if (mp.host) broadcastRoster();
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
    { lat: plane.latDeg, lon: plane.lonDeg, color: "#d8a24a", label: "Tu byłeś", truth: true },
    { lat, lon, color: "#f3ead6", label: "Twój strzał" },
  ]);
  el.gmResult.textContent = `Różnica: ${Math.round(errKm)} km`;
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
    el.guessmap.classList.remove("show");
    backToLobby();
    return;
  }
  el.gmResult.textContent = "Losuję nowy punkt…";
  el.gmRetry.style.display = "none";
  el.gmClose.style.display = "none";
  restartMode();
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

  if (mp.active && mp.inRound && !menuOpen && !guessOpen && !crashed) {
    const now = performance.now();
    if (now - mp.lastPoseAt > 100) {
      mp.lastPoseAt = now;
      mp.net?.send({
        t: "pose",
        from: mp.myId,
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
  if (mp.active && mp.inRound && !menuOpen) {
    const deg = Math.PI / 180;
    for (const [id, pose] of mp.poses) {
      const mate = mp.mates.get(id);
      if (!mate?.mesh) continue;
      const mm = frameAt(
        pose.lat * deg,
        pose.lon * deg,
        pose.h,
        pose.heading,
        pose.pitch,
        -pose.roll
      );
      mm.decompose(matePos, mateQuat, mate.mesh.scale);
      mate.mesh.position.copy(matePos);
      mate.mesh.quaternion.copy(mateQuat);
      mate.mesh.visible = true;
    }
  } else {
    hideAllMates();
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
            if (mp.active && mp.inRound) reportSnapped();
            else finishSnapStart();
          }
        }
      }
    }
  }
  // teren się nie zmierzył (sieć/błąd kafelków) — startuj mimo to
  if (awaitingSnap && performance.now() - awaitingSnapSince > 15000) {
    awaitingSnap = false;
    pendingSnap = false;
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

  // latarnia celu — dogruntuj gdy kafelki się dociążą
  if (beacon.visible) {
    beacon.userData.ring.rotation.z += dt * 0.8;
    if (!beaconGrounded && frameCount % 60 === 0 && homeTarget) {
      placeBeaconAt(homeTarget.lat, homeTarget.lon);
    }
  }

  // tryby: timer + warunki wygranej
  if (timerActive && !menuOpen && !paused && !guessOpen && !finished && (!crashed || mp.active)) {
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
