import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  HemisphereLight,
  DirectionalLight,
  Box3,
  Vector3,
  Group,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { applyRotorState } from "./rotors.js";

// karuzela pojazdów w menu — jeden duży podgląd, strzałki przełączają model
export function createCarousel(canvas, items, opts = {}) {
  if (opts.lite) {
    return {
      show() {},
      resize() {},
      setActive() {},
      dispose() {},
      get currentKey() {
        return null;
      },
    };
  }

  const renderer = new WebGLRenderer({
    canvas,
    antialias: !opts.mobile,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, opts.mobile ? 1 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  scene.add(new HemisphereLight(0xcfe0f0, 0x5a7048, 1.25));
  const key = new DirectionalLight(0xfff2dd, 2.4);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new DirectionalLight(0x9fc4ff, 0.9);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  const camera = new PerspectiveCamera(30, 2, 0.1, 300);

  const loader = new GLTFLoader();
  const models = new Map(); // key -> { group, wingspan }
  let current = null; // { group, wingspan, slideX }
  let currentKey = null;
  let wantedKey = items[0].key;

  function resize() {
    const w = canvas.clientWidth || 640;
    const h = canvas.clientHeight || 340;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (current) frame(current.wingspan);
  }

  function frame(wingspan) {
    camera.position.set(0, wingspan * 0.42, wingspan * 1.75);
    camera.lookAt(0, 0, 0);
  }

  function show(keyName, dir = 0) {
    wantedKey = keyName;
    const entry = models.get(keyName);
    if (!entry) return;
    if (current) scene.remove(current.group);
    current = { group: entry.group, wingspan: entry.wingspan, slideX: dir * entry.wingspan * 1.4 };
    currentKey = keyName;
    scene.add(entry.group);
    frame(entry.wingspan);
  }

  for (const item of items) {
    loader.load(item.file, (gltf) => {
      const model = gltf.scene;
      if (item.prepare) item.prepare(model); // np. poza czarownicy + miotła
      const box = new Box3().setFromObject(model);
      const size = box.getSize(new Vector3());
      model.scale.setScalar(item.wingspan / Math.max(size.x, size.y, size.z));
      box.setFromObject(model);
      model.position.sub(box.getCenter(new Vector3()));
      model.traverse((o) => {
        if (o.isMesh && o.material) {
          o.material.metalness = 0.15;
          o.material.roughness = 0.65;
        }
      });
      const group = new Group();
      group.add(model);
      applyRotorState(group, false);
      models.set(item.key, { group, wingspan: item.wingspan });
      if (item.key === wantedKey && currentKey !== wantedKey) show(item.key);
    });
  }

  let active = true;
  function tick() {
    requestAnimationFrame(tick);
    if (!active || !current) return;
    const t = performance.now() * 0.001;
    // wjazd z boku po przełączeniu + powolny obrót pokazowy
    current.slideX *= 0.86;
    current.group.position.x = current.slideX;
    current.group.rotation.y = t * 0.45;
    current.group.rotation.z = Math.sin(t * 0.6) * 0.05;
    renderer.render(scene, camera);
  }
  tick();
  resize();
  window.addEventListener("resize", resize);

  function dispose() {
    active = false;
    try {
      renderer.dispose();
      const gl = renderer.getContext();
      const ext = gl && gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    } catch {
      /* ignore */
    }
    models.clear();
    current = null;
  }

  return {
    show,
    resize,
    dispose,
    get currentKey() {
      return currentKey;
    },
    setActive(v) {
      active = v;
      if (v) resize();
    },
  };
}
