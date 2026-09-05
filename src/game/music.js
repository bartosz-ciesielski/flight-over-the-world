const TARGET = 0.22;
const KEY = "foe-music";

const el = document.getElementById("bgm");
let enabled = true;
try {
  enabled = localStorage.getItem(KEY) !== "0";
} catch {
  /* ignore */
}

if (el) {
  el.loop = true;
  el.volume = TARGET;
  el.autoplay = enabled;
  window.__bgm = el;
  if (enabled) el.play().catch(() => {});
  else el.pause();
}

export function musicEnabled() {
  return enabled;
}

export function setMusicEnabled(on) {
  enabled = !!on;
  try {
    localStorage.setItem(KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (!el) return;
  if (enabled) el.play().catch(() => {});
  else el.pause();
}

export function updateMusic() {
  if (!el) return;
  if (!enabled) {
    if (!el.paused) el.pause();
    return;
  }
  if (el.paused) el.play().catch(() => {});
}

export function primeMusic() {
  if (el && enabled) el.play().catch(() => {});
}

export function musicDebug() {
  if (!el) return { paused: null, time: null, gain: null, enabled };
  return {
    paused: el.paused,
    time: Math.round(el.currentTime * 10) / 10,
    gain: el.volume,
    enabled,
  };
}
