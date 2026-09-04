import { getAudioCtx, primeAudio } from "./explosion.js";
import { asset } from "./asset.js";

const TARGET = 0.22;

let el = null;
let gain = null;
let hooked = false;

function ensure() {
  const ctx = getAudioCtx();
  if (!ctx) return null;
  if (!el) {
    el = new Audio(asset("music/theme.mp3"));
    el.loop = true;
    el.preload = "auto";
    el.crossOrigin = "anonymous";
  }
  if (!hooked) {
    try {
      const src = ctx.createMediaElementSource(el);
      gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(gain).connect(ctx.destination);
      hooked = true;
    } catch {
      // MediaElementSource można podpiąć tylko raz na element
    }
  }
  return ctx;
}

export function updateMusic() {
  const ctx = ensure();
  if (!ctx || !el || !gain) return;

  const t = ctx.currentTime;
  gain.gain.setTargetAtTime(TARGET, t, 0.8);
  if (el.paused) el.play().catch(() => {});
}

/** Odblokuj przy pierwszym geście — menu, lot, pauza, wszędzie. */
export function primeMusic() {
  primeAudio();
  if (ensure() && el) el.play().catch(() => {});
}

export function musicDebug() {
  return {
    paused: el ? el.paused : null,
    time: el ? Math.round(el.currentTime * 10) / 10 : null,
    gain: gain ? Math.round(gain.gain.value * 1000) / 1000 : null,
  };
}
