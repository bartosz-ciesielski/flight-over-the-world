const TILE = 256;
const ZOOM = 12;
const tileCache = new Map();
const tileReady = new Set();

function notifyTiles() {
  for (const fn of tileReady) fn();
}

function lon2x(lon, z) {
  return ((lon + 180) / 360) * 2 ** z;
}

function lat2y(lat, z) {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
}

function tileUrl(z, x, y) {
  const n = 2 ** z;
  const tx = ((x % n) + n) % n;
  const ty = Math.max(0, Math.min(n - 1, y));
  return `https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`;
}

function loadTile(z, x, y) {
  const url = tileUrl(z, x, y);
  let img = tileCache.get(url);
  if (img) return img;
  img = new Image();
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.onload = notifyTiles;
  img.src = url;
  tileCache.set(url, img);
  if (tileCache.size > 120) {
    const first = tileCache.keys().next().value;
    tileCache.delete(first);
  }
  return img;
}

function paintOsm(canvas, pose, markerScale = 1, clipCircle = false) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.save();
  if (clipCircle) {
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    ctx.clip();
  }
  const cx = lon2x(pose.lon, ZOOM);
  const cy = lat2y(pose.lat, ZOOM);
  const originX = cx * TILE - w / 2;
  const originY = cy * TILE - h / 2;
  const x0 = Math.floor(originX / TILE);
  const y0 = Math.floor(originY / TILE);
  const x1 = Math.floor((originX + w) / TILE);
  const y1 = Math.floor((originY + h) / TILE);

  ctx.fillStyle = "#c9d4c0";
  ctx.fillRect(0, 0, w, h);
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const img = loadTile(ZOOM, tx, ty);
      if (img.complete && img.naturalWidth) {
        ctx.drawImage(img, tx * TILE - originX, ty * TILE - originY, TILE, TILE);
      }
    }
  }

  const px = w / 2;
  const py = h / 2;
  const s = markerScale;
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate((pose.heading * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, -16 * s);
  ctx.lineTo(11 * s, 14 * s);
  ctx.lineTo(0, 8 * s);
  ctx.lineTo(-11 * s, 14 * s);
  ctx.closePath();
  ctx.fillStyle = "#d8a24a";
  ctx.strokeStyle = "#1c1710";
  ctx.lineWidth = Math.max(1.2, 2 * s);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(px, py, 22 * s, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(28, 23, 16, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function toPx(lat, lon, zoom, originX, originY) {
  return [lon2x(lon, zoom) * TILE - originX, lat2y(lat, zoom) * TILE - originY];
}

function marker(ctx, x, y, fill, label) {
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = "#1c1710";
  ctx.lineWidth = 2;
  ctx.stroke();
  if (!label) return;
  ctx.font = "600 13px Georgia, serif";
  ctx.fillStyle = "#1c1710";
  ctx.strokeStyle = "rgba(243, 234, 214, 0.85)";
  ctx.lineWidth = 3;
  ctx.strokeText(label, x + 11, y + 4);
  ctx.fillText(label, x + 11, y + 4);
}

let trailJob = null;

export function paintTrailMap(canvas, { path = [], start, home } = {}) {
  if (!canvas) return;
  const pts = [];
  if (start) pts.push(start);
  for (const p of path) pts.push(p);
  if (home) pts.push(home);
  if (!pts.length) return;

  const job = { canvas, path, start, home };
  trailJob = job;

  let lat0 = 90, lat1 = -90, lon0 = 180, lon1 = -180;
  for (const p of pts) {
    if (!Number.isFinite(p.lat) || !Number.isFinite(p.lon)) continue;
    lat0 = Math.min(lat0, p.lat);
    lat1 = Math.max(lat1, p.lat);
    lon0 = Math.min(lon0, p.lon);
    lon1 = Math.max(lon1, p.lon);
  }
  const padLat = Math.max(0.018, (lat1 - lat0) * 0.2);
  const padLon = Math.max(0.018, (lon1 - lon0) * 0.2);
  lat0 -= padLat;
  lat1 += padLat;
  lon0 -= padLon;
  lon1 += padLon;

  const w = canvas.width;
  const h = canvas.height;
  let zoom = 6;
  for (let z = 14; z >= 6; z--) {
    const pw = Math.abs(lon2x(lon1, z) - lon2x(lon0, z)) * TILE;
    const ph = Math.abs(lat2y(lat0, z) - lat2y(lat1, z)) * TILE;
    if (pw <= w * 0.9 && ph <= h * 0.9) {
      zoom = z;
      break;
    }
    zoom = z;
  }

  const originX = ((lon2x(lon0, zoom) + lon2x(lon1, zoom)) / 2) * TILE - w / 2;
  const originY = ((lat2y(lat0, zoom) + lat2y(lat1, zoom)) / 2) * TILE - h / 2;
  const x0 = Math.floor(originX / TILE);
  const y0 = Math.floor(originY / TILE);
  const x1 = Math.floor((originX + w) / TILE);
  const y1 = Math.floor((originY + h) / TILE);

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#c9d4c0";
  ctx.fillRect(0, 0, w, h);
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const img = loadTile(zoom, tx, ty);
      if (img.complete && img.naturalWidth) {
        ctx.drawImage(img, tx * TILE - originX, ty * TILE - originY, TILE, TILE);
      }
    }
  }

  if (path.length > 1) {
    ctx.beginPath();
    path.forEach((p, i) => {
      const [x, y] = toPx(p.lat, p.lon, zoom, originX, originY);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(28, 23, 16, 0.35)";
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.strokeStyle = "#d8a24a";
    ctx.lineWidth = 3.5;
    ctx.stroke();
  }

  if (start) {
    const [x, y] = toPx(start.lat, start.lon, zoom, originX, originY);
    marker(ctx, x, y, "#f3ead6", "Start");
  }
  if (home) {
    const [x, y] = toPx(home.lat, home.lon, zoom, originX, originY);
    marker(ctx, x, y, "#d8a24a", "Home");
  }
  const last = path[path.length - 1];
  if (last && (!home || Math.abs(last.lat - home.lat) > 0.002 || Math.abs(last.lon - home.lon) > 0.002)) {
    const [x, y] = toPx(last.lat, last.lon, zoom, originX, originY);
    marker(ctx, x, y, "#c23a2e", "You");
  }
}

tileReady.add(() => {
  if (trailJob) paintTrailMap(trailJob.canvas, trailJob);
});

export function createFreeMap({ root, canvas, place, close, onChange }) {
  let open = false;
  let pose = { lat: 0, lon: 0, heading: 0, name: "" };

  function paint() {
    paintOsm(canvas, pose, 1);
  }

  function setOpen(v) {
    open = !!v;
    root.classList.toggle("show", open);
    if (open) paint();
  }

  close?.addEventListener("click", () => {
    setOpen(false);
    onChange?.(false);
  });
  tileReady.add(() => {
    if (open) paint();
  });

  return {
    get open() {
      return open;
    },
    show() {
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
    toggle() {
      setOpen(!open);
    },
    update(lat, lon, headingDeg, name) {
      pose = { lat, lon, heading: headingDeg, name: name || "" };
      if (place) place.textContent = pose.name || `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`;
      if (open) paint();
    },
  };
}

export function createMiniMap({ root, canvas, onOpen }) {
  let visible = false;
  let pose = { lat: 0, lon: 0, heading: 0 };

  function paint() {
    paintOsm(canvas, pose, 0.62, true);
  }

  function setVisible(v) {
    const next = !!v;
    if (visible === next) {
      if (next) paint();
      return;
    }
    visible = next;
    if (root) root.hidden = !visible;
    if (visible) paint();
  }

  root?.addEventListener("click", () => {
    if (visible) onOpen?.();
  });
  tileReady.add(() => {
    if (visible) paint();
  });

  return {
    get visible() {
      return visible;
    },
    show() {
      setVisible(true);
    },
    hide() {
      setVisible(false);
    },
    update(lat, lon, headingDeg) {
      pose = { lat, lon, heading: headingDeg };
      if (visible) paint();
    },
  };
}
