import { worldToLatLon } from "./geo.js";

export function setLoader(text, pct) {
  const el = document.getElementById("loader-text");
  const bar = document.getElementById("loader-bar");
  if (el) el.textContent = text;
  if (bar) bar.style.width = `${Math.round(pct * 100)}%`;
}

export function hideLoader() {
  const el = document.getElementById("loader");
  if (!el) return;
  el.classList.add("hidden");
  el.style.display = "none";
}

export function updateCoords(x, z, street = "") {
  const { lat, lon } = worldToLatLon(x, z);
  const el = document.getElementById("coords");
  if (el) el.textContent = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  const streetEl = document.getElementById("street");
  if (streetEl) streetEl.textContent = street ? `ul. ${street}` : "";
}

export function drawMinimap(canvas, player, colliders, yaw) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const scale = 0.42;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#1a2418";
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
  ctx.clip();

  ctx.translate(w / 2, h / 2);
  ctx.rotate(yaw);
  ctx.translate(-player.position.x * scale, -player.position.z * scale);

  ctx.fillStyle = "#6d5a3d";
  for (const ring of colliders) {
    if (ring.length < 3) continue;
    ctx.beginPath();
    ctx.moveTo(ring[0].x * scale, ring[0].z * scale);
    for (let i = 1; i < ring.length; i += 1) {
      ctx.lineTo(ring[i].x * scale, ring[i].z * scale);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = "#e24b45";
  ctx.beginPath();
  ctx.moveTo(w / 2, h / 2 - 9);
  ctx.lineTo(w / 2 + 6, h / 2 + 7);
  ctx.lineTo(w / 2 - 6, h / 2 + 7);
  ctx.closePath();
  ctx.fill();
}

export function createLabels(labels) {
  const nodes = labels.map((l) => {
    const el = document.createElement("div");
    el.className = "world-label";
    el.textContent = l.text;
    document.getElementById("hud")?.appendChild(el);
    return { el, ...l };
  });
  return nodes;
}

export function projectLabels(nodes, camera, width, height) {
  for (const n of nodes) {
    const v = n._v || (n._v = { x: 0, y: 0, z: 0 });
    v.x = n.x;
    v.y = n.y;
    v.z = n.z;
    const projected = project(v, camera, width, height);
    const dx = camera.position.x - n.x;
    const dz = camera.position.z - n.z;
    const dist = Math.hypot(dx, camera.position.y - n.y, dz);
    const show = projected && dist < 85;
    n.el.style.display = show ? "block" : "none";
    if (show) {
      n.el.style.transform = `translate(${projected.x}px, ${projected.y}px) translate(-50%, -100%)`;
    }
  }
}

function project(p, camera, width, height) {
  const x = p.x;
  const y = p.y;
  const z = p.z;
  const e = camera.matrixWorldInverse.elements;
  const cx = e[0] * x + e[4] * y + e[8] * z + e[12];
  const cy = e[1] * x + e[5] * y + e[9] * z + e[13];
  const cz = e[2] * x + e[6] * y + e[10] * z + e[14];
  if (cz >= 0) return null;
  const pe = camera.projectionMatrix.elements;
  const w = pe[3] * cx + pe[7] * cy + pe[11] * cz + pe[15];
  const ndcX = (pe[0] * cx + pe[4] * cy + pe[8] * cz + pe[12]) / w;
  const ndcY = (pe[1] * cx + pe[5] * cy + pe[9] * cz + pe[13]) / w;
  return {
    x: (ndcX * 0.5 + 0.5) * width,
    y: (-ndcY * 0.5 + 0.5) * height,
  };
}
