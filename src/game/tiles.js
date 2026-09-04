import * as THREE from "three";
import { BBOX } from "./config.js";
import { latLonToWorld, lonLatToTile, tileToLonLat } from "./geo.js";

const ZOOM = 17;
const CACHE_KEY = "niepruszewo-tiles-z17-v1";

function tileUrl(z, x, y) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}

function loadImage(url, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = "";
      reject(new Error("timeout"));
    }, timeoutMs);
    img.crossOrigin = "anonymous";
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error("tile"));
    };
    img.src = url;
  });
}

function openCache() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("niepruszewo-map", 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains("images")) {
        req.result.createObjectStore("images");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function readCache() {
  try {
    const db = await openCache();
    return new Promise((resolve) => {
      const tx = db.transaction("images", "readonly");
      const get = tx.objectStore("images").get(CACHE_KEY);
      get.onsuccess = () => resolve(get.result || null);
      get.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function writeCache(blob) {
  try {
    const db = await openCache();
    const tx = db.transaction("images", "readwrite");
    tx.objectStore("images").put(blob, CACHE_KEY);
  } catch {
    // ignore
  }
}

async function mapInBatches(items, size, worker) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    const slice = items.slice(i, i + size);
    out.push(...(await Promise.all(slice.map(worker))));
  }
  return out;
}

export async function loadMapImagery(onProgress = () => {}) {
  const z = ZOOM;
  const nw = lonLatToTile(BBOX.west, BBOX.north, z);
  const se = lonLatToTile(BBOX.east, BBOX.south, z);
  const x0 = Math.floor(nw.x);
  const y0 = Math.floor(nw.y);
  const x1 = Math.floor(se.x);
  const y1 = Math.floor(se.y);
  const cols = x1 - x0 + 1;
  const rows = y1 - y0 + 1;
  const maxPx = 4096;
  const draw = Math.min(256, Math.floor(maxPx / Math.max(cols, rows)));

  const canvas = document.createElement("canvas");
  canvas.width = cols * draw;
  canvas.height = rows * draw;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  ctx.fillStyle = "#3d5a32";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cached = await readCache();
  if (cached) {
    const url = URL.createObjectURL(cached);
    try {
      const img = await loadImage(url, 8000);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      onProgress(1);
    } finally {
      URL.revokeObjectURL(url);
    }
  } else {
    const jobs = [];
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        jobs.push({ x, y, dx: (x - x0) * draw, dy: (y - y0) * draw });
      }
    }
    let done = 0;
    await mapInBatches(jobs, 24, async (job) => {
      try {
        const img = await loadImage(tileUrl(z, job.x, job.y));
        ctx.drawImage(img, job.dx, job.dy, draw, draw);
      } catch {
        try {
          const img = await loadImage(tileUrl(z, job.x, job.y), 8000);
          ctx.drawImage(img, job.dx, job.dy, draw, draw);
        } catch {
          // leave fallback green
        }
      }
      done += 1;
      onProgress(done / jobs.length);
    });
    canvas.toBlob((blob) => {
      if (blob) writeCache(blob);
    }, "image/jpeg", 0.86);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  const nwLatLon = tileToLonLat(x0, y0, z);
  const seLatLon = tileToLonLat(x1 + 1, y1 + 1, z);
  const a = latLonToWorld(nwLatLon.lat, nwLatLon.lon);
  const b = latLonToWorld(seLatLon.lat, seLatLon.lon);
  const bounds = {
    minX: a.x,
    minZ: a.z,
    width: b.x - a.x,
    depth: b.z - a.z,
  };

  return { texture, bounds, canvas };
}

export function createGround(map) {
  const { texture, bounds } = map;
  const geo = new THREE.PlaneGeometry(bounds.width, bounds.depth);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.96,
    metalness: 0,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(
    bounds.minX + bounds.width / 2,
    -0.03,
    bounds.minZ + bounds.depth / 2
  );
  mesh.receiveShadow = true;
  return mesh;
}
