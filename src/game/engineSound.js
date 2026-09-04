import { getAudioCtx } from "./explosion.js";

// Proceduralne dźwięki napędu + opływ powietrza (WebAudio).
// Zapętlone bezszwowo, wysokość i głośność podążają za obrotami i prędkością.
// Style: "plane" (tłokowy bulgot), "jet" (świst turbiny), "rocket" (niski ryk),
// "wind" (tylko powietrze).

let built = false;
let master, lp, exhaustGain, subGain, noiseGain, bp, am, amDepth;
let osc1, osc2, sub;

function build(ctx) {
  built = true;

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // wydech: dwie lekko rozstrojone piły przez lowpass
  lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 400;
  lp.Q.value = 1.1;
  exhaustGain = ctx.createGain();
  exhaustGain.gain.value = 0.6;
  lp.connect(exhaustGain).connect(master);

  osc1 = ctx.createOscillator();
  osc1.type = "sawtooth";
  osc1.frequency.value = 70;
  osc2 = ctx.createOscillator();
  osc2.type = "sawtooth";
  osc2.frequency.value = 71;
  const og1 = ctx.createGain();
  og1.gain.value = 0.5;
  const og2 = ctx.createGain();
  og2.gain.value = 0.35;
  osc1.connect(og1).connect(lp);
  osc2.connect(og2).connect(lp);
  osc1.start();
  osc2.start();

  // pulsacja wydechu — AM w rytmie zapłonów (tylko silnik tłokowy)
  am = ctx.createOscillator();
  am.type = "sine";
  am.frequency.value = 140;
  amDepth = ctx.createGain();
  amDepth.gain.value = 0.16;
  am.connect(amDepth).connect(exhaustGain.gain);
  am.start();

  // sub-basowy pomruk
  sub = ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.value = 35;
  subGain = ctx.createGain();
  subGain.gain.value = 0.4;
  sub.connect(subGain).connect(master);
  sub.start();

  // opływ powietrza — zapętlony szum przez bandpass
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = buf;
  noiseSrc.loop = true;
  bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 500;
  bp.Q.value = 0.6;
  noiseGain = ctx.createGain();
  noiseGain.gain.value = 0;
  noiseSrc.connect(bp).connect(noiseGain).connect(master);
  noiseSrc.start();
}

// parametry brzmienia per styl:
// fBase/fRange — częstotliwość podstawowa, lpBase/lpRange — filtr (nitro otwiera),
// exG/subG — głośności silnika (0 = bez silnika), noiseMul — siła opływu
const STYLES = {
  plane:  { fBase: 46,  fRange: 64,   subDiv: 2, am: 0.16, lpBase: 240,  lpRange: 640,  exG: 0.5,  exR: 0.5,  subG: 0.32, subR: 0.3,  noiseMul: 1 },
  jet:    { fBase: 480, fRange: 1150, subDiv: 4, am: 0,    lpBase: 1500, lpRange: 2600, exG: 0.10, exR: 0.14, subG: 0.10, subR: 0.12, noiseMul: 2.3 },
  rocket: { fBase: 26,  fRange: 40,   subDiv: 1, am: 0,    lpBase: 130,  lpRange: 380,  exG: 0.85, exR: 0.55, subG: 0.5,  subR: 0.35, noiseMul: 3.1 },
  wind:   { fBase: 46,  fRange: 64,   subDiv: 2, am: 0,    lpBase: 240,  lpRange: 640,  exG: 0,    exR: 0,    subG: 0,    subR: 0,    noiseMul: 1.5 },
};

// audible — czy słychać (lot, nie menu/pauza/kraksa)
// rpm01 — obroty 0..1 (Shift = nitro podbija), speed01 — prędkość 0..1
export function updateEngineSound(audible, rpm01, speed01, style = "plane") {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (!built) build(ctx);
  const t = ctx.currentTime;

  master.gain.setTargetAtTime(audible ? 0.14 : 0, t, audible ? 0.3 : 0.06);
  if (!audible) return;

  const S = STYLES[style] || STYLES.plane;
  const rpm = Math.max(0.12, Math.min(1, rpm01));
  const freq = S.fBase + rpm * S.fRange;
  osc1.frequency.setTargetAtTime(freq, t, 0.1);
  osc2.frequency.setTargetAtTime(freq * 1.006 + 0.6, t, 0.1);
  sub.frequency.setTargetAtTime(freq / S.subDiv, t, 0.1);
  am.frequency.setTargetAtTime(freq * 2, t, 0.1);
  amDepth.gain.setTargetAtTime(S.am, t, 0.1);
  lp.frequency.setTargetAtTime(S.lpBase + rpm * S.lpRange, t, 0.15); // nitro otwiera filtr — ryk
  exhaustGain.gain.setTargetAtTime(S.exG + rpm * S.exR, t, 0.1);
  subGain.gain.setTargetAtTime(S.subG + rpm * S.subR, t, 0.1);

  const wash = Math.max(0, Math.min(1, speed01));
  noiseGain.gain.setTargetAtTime(wash * wash * 0.5 * S.noiseMul, t, 0.25);
  bp.frequency.setTargetAtTime(380 + wash * 720, t, 0.25);
}

export function engineDebug() {
  const ctx = getAudioCtx();
  return {
    ctxState: ctx ? ctx.state : null,
    built,
    masterGain: master ? Math.round(master.gain.value * 1000) / 1000 : null,
  };
}
