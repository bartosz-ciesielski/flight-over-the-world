import * as THREE from "three";

const texCache = new Map();
let roofPatternCanvas = null;

function drawWindow(ctx, cx, cy, w, h) {
  ctx.fillStyle = "#e6e1d5";
  ctx.fillRect(cx - w / 2 - 3, cy - h / 2 - 3, w + 6, h + 6);
  const glass = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
  glass.addColorStop(0, "#a8bfd0");
  glass.addColorStop(0.5, "#7e95a6");
  glass.addColorStop(1, "#54646e");
  ctx.fillStyle = glass;
  ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  ctx.fillStyle = "#e6e1d5";
  ctx.fillRect(cx - 1.5, cy - h / 2, 3, h);
  ctx.fillRect(cx - w / 2, cy - 1.5, w, 3);
  ctx.fillStyle = "#d5cec0";
  ctx.fillRect(cx - w / 2 - 5, cy + h / 2 + 3, w + 10, 4);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(cx - w / 2 - 5, cy + h / 2 + 7, w + 10, 2);
}

function drawDoor(ctx, cx, bandBottom, floorPx) {
  const w = 24;
  const h = Math.floor(floorPx * 0.68);
  const y0 = bandBottom - h;
  ctx.fillStyle = "#4a3a2a";
  ctx.fillRect(cx - w / 2 - 3, y0 - 3, w + 6, h + 3);
  ctx.fillStyle = "#6e4f36";
  ctx.fillRect(cx - w / 2, y0, w, h);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(cx - w / 2 + 5, y0 + 6, w - 10, h / 2 - 10);
  ctx.fillRect(cx - w / 2 + 5, y0 + h / 2 + 2, w - 10, h / 2 - 10);
  ctx.fillStyle = "#c8b060";
  ctx.beginPath();
  ctx.arc(cx + w / 2 - 7, y0 + h / 2, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8d8578";
  ctx.fillRect(cx - w / 2 - 5, bandBottom, w + 10, 4);
}

function wallCanvas({ r, g, b, bays, floors, doorBay }) {
  // ~22 px/m so canvas aspect matches real wall proportions (bay 3.4m, floor 3.1m)
  const bayPx = 76;
  const floorPx = 70;
  const basePx = 12;
  const W = bays * bayPx;
  const H = floors * floorPx + basePx;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");

  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < (W * H) / 50; i += 1) {
    const a = Math.random() * 0.05;
    ctx.fillStyle =
      Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "rgba(255,255,255,0.07)");
  grad.addColorStop(1, "rgba(0,0,0,0.13)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(72,62,54,0.9)";
  ctx.fillRect(0, H - basePx, W, basePx);

  for (let f = 0; f < floors; f += 1) {
    const yTop = H - basePx - (f + 1) * floorPx;
    const isGround = f === 0;
    for (let bIdx = 0; bIdx < bays; bIdx += 1) {
      const cx = bIdx * bayPx + bayPx / 2;
      if (isGround && doorBay === bIdx) {
        drawDoor(ctx, cx, yTop + floorPx, floorPx);
        continue;
      }
      const cy = isGround
        ? yTop + floorPx * 0.44
        : yTop + floorPx * 0.5;
      drawWindow(ctx, cx, cy, 26, 34);
    }
  }
  return c;
}

export function facadeMaterial(color, bays, floors, doorBay) {
  const r = Math.round(color.r);
  const g = Math.round(color.g);
  const b = Math.round(color.b);
  const key = `${r >> 4}-${g >> 4}-${b >> 4}-${bays}-${floors}-${doorBay}`;
  if (texCache.has(key)) return texCache.get(key);

  const canvas = wallCanvas({ r, g, b, bays, floors, doorBay });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  texCache.set(key, mat);
  return mat;
}

export function gableMaterial(color) {
  const r = Math.round(color.r) >> 4;
  const g = Math.round(color.g) >> 4;
  const b = Math.round(color.b) >> 4;
  const key = `gable-${r}-${g}-${b}`;
  if (texCache.has(key)) return texCache.get(key);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color.r / 255, color.g / 255, color.b / 255),
    roughness: 0.92,
    side: THREE.DoubleSide,
  });
  texCache.set(key, mat);
  return mat;
}

function roofPattern() {
  if (roofPatternCanvas) return roofPatternCanvas;
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#c9c9c9";
  ctx.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 12) {
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(0, y, 128, 2);
    const offset = (y / 12) % 2 === 0 ? 0 : 8;
    for (let x = offset; x < 128; x += 16) {
      ctx.fillRect(x, y, 1.5, 12);
    }
  }
  roofPatternCanvas = c;
  return c;
}

export function roofMaterial(color) {
  const r = Math.round(color.r) >> 3;
  const g = Math.round(color.g) >> 3;
  const b = Math.round(color.b) >> 3;
  const key = `roof-${r}-${g}-${b}`;
  if (texCache.has(key)) return texCache.get(key);

  const tex = new THREE.CanvasTexture(roofPattern());
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    color: new THREE.Color(color.r / 255, color.g / 255, color.b / 255),
    roughness: 0.85,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  texCache.set(key, mat);
  return mat;
}
