import { offsetPoint, pointInPoland, randomPointInEurope, loadEuropeGeo } from "./modes.js";

export const EUROPE_ROOM_ID = "lnseurope";

export const EUROPE_BOTS = [
  { id: "foe-bot-mira", name: "Mira", plane: "pa28", skill: 0.78 },
  { id: "foe-bot-jonas", name: "Jonas", plane: "citation", skill: 0.44 },
];

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

export function pickBotGuess(truth, geo, skill = 0.5) {
  if (!truth) return { lat: 52.1, lon: 19.4 };
  const missKm = (12 + (1 - skill) * 260) * (0.5 + Math.random() * 0.85);
  for (let scale = 1; scale > 0.04; scale *= 0.65) {
    for (let i = 0; i < 10; i++) {
      const p = offsetPoint(truth.lat, truth.lon, missKm * scale);
      if (!geo || pointInPoland(p.lon, p.lat, geo)) return p;
    }
  }
  return geo ? randomPointInEurope(geo) : { lat: truth.lat, lon: truth.lon };
}
