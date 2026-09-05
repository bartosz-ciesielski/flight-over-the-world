import { distanceM, randomPointInEurope, loadEuropeGeo } from "./modes.js";

export const EUROPE_ROOM_ID = "lnseurope";

export const EUROPE_BOTS = [
  { id: "foe-bot-mira", name: "Mira", plane: "pa28", skill: 0.78 },
  { id: "foe-bot-jonas", name: "Jonas", plane: "citation", skill: 0.44 },
];

export const BOT_ROTATE_SCORE = 5;

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

export function pickBotGuess(truth, geo) {
  if (!geo) return { lat: 48.8, lon: 2.3 };
  const minKm = 250;
  for (let i = 0; i < 80; i++) {
    const p = randomPointInEurope(geo);
    if (!truth || distanceM(p.lat, p.lon, truth.lat, truth.lon) / 1000 >= minKm) return p;
  }
  return randomPointInEurope(geo);
}
