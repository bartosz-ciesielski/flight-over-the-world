import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  NormalBlending,
  PointLight,
  Points,
  PointsMaterial,
} from "three";

// Proceduralny wybuch: kula ognia (addytiwne cząsteczki) + dym + błysk światła.
// Dźwięk generowany przez WebAudio — szum przez lowpass + opadający sub-bass.

export function createExplosion(scene, pos) {
  const group = [];

  // --- ogień ---
  const FIRE_N = 240;
  const fireGeo = new BufferGeometry();
  const firePos = new Float32Array(FIRE_N * 3);
  const fireCol = new Float32Array(FIRE_N * 3);
  const fireVel = new Float32Array(FIRE_N * 3);
  for (let i = 0; i < FIRE_N; i++) {
    firePos[i * 3] = pos.x;
    firePos[i * 3 + 1] = pos.y;
    firePos[i * 3 + 2] = pos.z;
    // losowy kierunek sferyczny z lekkim biasem w górę
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const sp = 12 + Math.random() * 42;
    fireVel[i * 3] = Math.sin(ph) * Math.cos(th) * sp;
    fireVel[i * 3 + 1] = Math.abs(Math.cos(ph)) * sp * 0.9 + 6;
    fireVel[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * sp;
    // żółty rdzeń → pomarańcz → czerwień
    const t = Math.random();
    fireCol[i * 3] = 1.0;
    fireCol[i * 3 + 1] = 0.75 - t * 0.55;
    fireCol[i * 3 + 2] = 0.35 - t * 0.3;
  }
  fireGeo.setAttribute("position", new Float32BufferAttribute(firePos, 3));
  fireGeo.setAttribute("color", new Float32BufferAttribute(fireCol, 3));
  const fireMat = new PointsMaterial({
    size: 4.2,
    vertexColors: true,
    blending: AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 1,
  });
  const fire = new Points(fireGeo, fireMat);
  fire.frustumCulled = false;
  scene.add(fire);
  group.push(fire);

  // --- dym ---
  const SMOKE_N = 90;
  const smokeGeo = new BufferGeometry();
  const smokePos = new Float32Array(SMOKE_N * 3);
  const smokeVel = new Float32Array(SMOKE_N * 3);
  for (let i = 0; i < SMOKE_N; i++) {
    smokePos[i * 3] = pos.x;
    smokePos[i * 3 + 1] = pos.y;
    smokePos[i * 3 + 2] = pos.z;
    const th = Math.random() * Math.PI * 2;
    const sp = 3 + Math.random() * 12;
    smokeVel[i * 3] = Math.cos(th) * sp;
    smokeVel[i * 3 + 1] = 8 + Math.random() * 14;
    smokeVel[i * 3 + 2] = Math.sin(th) * sp;
  }
  smokeGeo.setAttribute("position", new Float32BufferAttribute(smokePos, 3));
  const smokeMat = new PointsMaterial({
    size: 9,
    color: 0x2a2624,
    blending: NormalBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.55,
  });
  const smoke = new Points(smokeGeo, smokeMat);
  smoke.frustumCulled = false;
  scene.add(smoke);
  group.push(smoke);

  // --- błysk ---
  const flash = new PointLight(0xffa040, 4000, 600, 1.6);
  flash.position.copy(pos);
  scene.add(flash);
  group.push(flash);

  let age = 0;
  const LIFE = 2.6;

  return {
    update(dt) {
      age += dt;
      const fp = fire.geometry.attributes.position.array;
      for (let i = 0; i < FIRE_N; i++) {
        fireVel[i * 3 + 1] -= 14 * dt; // grawitacja
        const drag = 1 - Math.min(0.9, 1.6 * dt);
        fireVel[i * 3] *= drag;
        fireVel[i * 3 + 1] *= drag;
        fireVel[i * 3 + 2] *= drag;
        fp[i * 3] += fireVel[i * 3] * dt;
        fp[i * 3 + 1] += fireVel[i * 3 + 1] * dt;
        fp[i * 3 + 2] += fireVel[i * 3 + 2] * dt;
      }
      fire.geometry.attributes.position.needsUpdate = true;
      fireMat.opacity = Math.max(0, 1 - age / 1.3);
      fireMat.size = 4.2 + age * 6;

      const sp = smoke.geometry.attributes.position.array;
      for (let i = 0; i < SMOKE_N * 3; i++) sp[i] += smokeVel[i] * dt;
      smoke.geometry.attributes.position.needsUpdate = true;
      smokeMat.opacity = Math.max(0, 0.55 * (1 - age / LIFE));
      smokeMat.size = 9 + age * 10;

      flash.intensity = Math.max(0, 4000 * (1 - age / 0.45));

      if (age >= LIFE) {
        for (const o of group) {
          scene.remove(o);
          o.geometry?.dispose();
          o.material?.dispose();
        }
        return false;
      }
      return true;
    },
  };
}

let audioCtx = null;

// wywołaj przy geście użytkownika (Start), żeby odblokować dźwięk
export function primeAudio() {
  audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

export function getAudioCtx() {
  return audioCtx;
}

export function playExplosionSound() {
  primeAudio();
  const t = audioCtx.currentTime;

  // huk: szum przez opadający lowpass
  const dur = 1.3;
  const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * dur, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.0);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buf;
  const lp = audioCtx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(3200, t);
  lp.frequency.exponentialRampToValueAtTime(110, t + dur);
  const ng = audioCtx.createGain();
  ng.gain.setValueAtTime(0.85, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + dur);
  noise.connect(lp).connect(ng).connect(audioCtx.destination);
  noise.start(t);

  // sub-basowe "bum"
  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(130, t);
  osc.frequency.exponentialRampToValueAtTime(28, t + 0.9);
  const og = audioCtx.createGain();
  og.gain.setValueAtTime(0.9, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
  osc.connect(og).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 1.0);
}
