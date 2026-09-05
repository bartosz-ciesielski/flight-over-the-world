import { distanceM, offsetPoint, pointInPoland, randomPointInEurope, loadEuropeGeo } from "./modes.js";

export const EUROPE_ROOM_ID = "lnseurope";

export const EUROPE_BOTS = [
  { id: "foe-bot-mira", name: "Mira", plane: "pa28", skill: 0.78 },
  { id: "foe-bot-jonas", name: "Jonas", plane: "citation", skill: 0.44 },
];

export const BOT_ROTATE_SCORE = 5;
const BOT_STORE = "foe-europe-bots";

const BOT_NICKS = [
  "Mira", "Jonas", "Alba", "Nils", "Vera", "Otto", "Lena", "Erik",
  "Sofia", "Piotr", "Hugo", "Ania", "Lars", "Kira", "Theo", "Maja",
  "Felix", "Iga", "Nina", "Oskar", "Luca", "Zofia", "Rene", "Ewa",
];

export function nextBotName(taken = []) {
  const used = new Set(taken.filter(Boolean));
  const pool = BOT_NICKS.filter((n) => !used.has(n));
  if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  for (let i = 0; i < 40; i++) {
    const n = `${BOT_NICKS[i % BOT_NICKS.length]} ${2 + Math.floor(i / BOT_NICKS.length)}`;
    if (!used.has(n)) return n;
  }
  return "Pilot";
}

export function isEuropeRoom(id) {
  return id === EUROPE_ROOM_ID;
}

export function isBotId(id) {
  return String(id || "").startsWith("foe-bot-");
}

export function loadBotPersist() {
  try {
    const rows = JSON.parse(localStorage.getItem(BOT_STORE) || "[]");
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

export function saveBotPersist(players) {
  try {
    const rows = EUROPE_BOTS.map((b) => {
      const p = players?.get?.(b.id);
      return { id: b.id, name: p?.name || b.name, score: Number(p?.score) || 0 };
    });
    localStorage.setItem(BOT_STORE, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

export function pinnedEuropeRoom(live) {
  return {
    id: EUROPE_ROOM_ID,
    title: live?.title || "Guess the region: Europe",
    scope: "eu",
    scopeLabel: live?.scopeLabel || "Europe",
    count: Math.max(2, Number(live?.count) || 2),
    playing: true,
    visibility: "public",
  };
}

export async function pickEuropeLandStart() {
  return randomPointInEurope(await loadEuropeGeo());
}

const BOT_GUESS_MIN_KM = 1100;
const BOT_GUESS_FALLBACKS = [
  { lat: 64.1, lon: -21.9 },
  { lat: 37.0, lon: -8.0 },
  { lat: 41.0, lon: 29.0 },
  { lat: 69.6, lon: 18.9 },
];

function guessFarEnough(p, truth) {
  if (!truth || !Number.isFinite(truth.lat)) return true;
  return distanceM(p.lat, p.lon, truth.lat, truth.lon) / 1000 >= BOT_GUESS_MIN_KM;
}

export function pickBotGuess(truth, geo) {
  const pool = [];
  if (geo) {
    for (let i = 0; i < 240; i++) {
      const p = randomPointInEurope(geo);
      if (guessFarEnough(p, truth)) pool.push(p);
      if (pool.length >= 12) break;
    }
  }
  if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  if (truth && geo) {
    for (let km = 2600; km >= BOT_GUESS_MIN_KM; km -= 200) {
      for (let i = 0; i < 16; i++) {
        const p = offsetPoint(truth.lat, truth.lon, km * (0.85 + Math.random() * 0.3));
        if (pointInPoland(p.lon, p.lat, geo) && guessFarEnough(p, truth)) return p;
      }
    }
  }
  const ok = BOT_GUESS_FALLBACKS.filter((p) => guessFarEnough(p, truth));
  return ok[Math.floor(Math.random() * ok.length)] || BOT_GUESS_FALLBACKS[0];
}
