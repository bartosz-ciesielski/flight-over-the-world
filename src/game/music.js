import { asset } from "./asset.js";

const TARGET = 0.22;

function getPlayer() {
  if (window.__bgm) return window.__bgm;
  const el = new Audio(asset("music/theme.mp3"));
  el.loop = true;
  el.preload = "auto";
  el.playsInline = true;
  el.volume = TARGET;
  window.__bgm = el;
  return el;
}

const el = getPlayer();
if (el.paused) el.play().catch(() => {});

export function updateMusic() {}

export function musicDebug() {
  return {
    paused: el.paused,
    time: Math.round(el.currentTime * 10) / 10,
    gain: el.volume,
  };
}
