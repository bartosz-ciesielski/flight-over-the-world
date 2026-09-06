import {
  Group,
  Mesh,
  MeshBasicMaterial,
  CylinderGeometry,
  TorusGeometry,
  MathUtils,
} from "three";
import { asset } from "./asset.js";
import { getRegionPack, pickContinentStart, pickCountryStart, placesForScope } from "./regions.js";

const R_EARTH = 6378137;

export function distanceM(lat1, lon1, lat2, lon2) {
  // haversine — dokładne też na dystansach tysięcy km (tryb Świat)
  const p1 = lat1 * MathUtils.DEG2RAD;
  const p2 = lat2 * MathUtils.DEG2RAD;
  const dp = (lat2 - lat1) * MathUtils.DEG2RAD;
  const dl = (lon2 - lon1) * MathUtils.DEG2RAD;
  const a =
    Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.sqrt(a));
}

// punkt startowy oddalony o distKm w losowym kierunku od celu
export function offsetPoint(latDeg, lonDeg, distKm) {
  const brg = Math.random() * 2 * Math.PI;
  const dN = Math.cos(brg) * distKm * 1000;
  const dE = Math.sin(brg) * distKm * 1000;
  return {
    lat: latDeg + (dN / R_EARTH) * MathUtils.RAD2DEG,
    lon: lonDeg + (dE / (R_EARTH * Math.cos(latDeg * MathUtils.DEG2RAD))) * MathUtils.RAD2DEG,
  };
}

// latarnia nad celem — słup światła + pierścień
export function createBeacon() {
  const group = new Group();
  const pillar = new Mesh(
    new CylinderGeometry(90, 90, 1400, 24, 1, true),
    new MeshBasicMaterial({
      color: 0xffc94d,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    })
  );
  pillar.position.y = 700;
  const ring = new Mesh(
    new TorusGeometry(100, 5, 12, 48),
    new MeshBasicMaterial({
      color: 0xffb52e,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 30;
  group.add(pillar, ring);
  group.userData.ring = ring;
  return group;
}

// --- granice Polski (województwa) ---

let polandGeo = null;

async function fetchGeoJson(path) {
  let last = new Error(path);
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(asset(path));
      if (!res.ok) throw new Error(`${path} ${res.status}`);
      const geo = await res.json();
      if (!geo?.features?.length) throw new Error(`${path} empty`);
      return geo;
    } catch (err) {
      last = err;
      await new Promise((r) => setTimeout(r, 280 * (i + 1)));
    }
  }
  throw last;
}

export async function loadPolandGeo() {
  if (!polandGeo) polandGeo = await fetchGeoJson("geo/poland.json");
  return polandGeo;
}

function* iterPolygons(geom) {
  if (geom.type === "Polygon") yield geom.coordinates;
  else if (geom.type === "MultiPolygon") {
    for (const p of geom.coordinates) yield p;
  }
}

function pointInRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function pointInPoland(lon, lat, geo) {
  for (const f of geo.features) {
    for (const poly of iterPolygons(f.geometry)) {
      if (poly.length && pointInRing(lon, lat, poly[0])) return true;
    }
  }
  return false;
}

export function randomPointInPoland(geo) {
  for (let tries = 0; tries < 500; tries++) {
    const lon = 14.3 + Math.random() * (23.95 - 14.3);
    const lat = 49.15 + Math.random() * (54.6 - 49.15);
    if (pointInPoland(lon, lat, geo)) return { lat, lon };
  }
  return { lat: 52.1, lon: 19.4 }; // awaryjnie środek Polski
}

// --- lądy świata (Natural Earth 110m) ---

let worldGeo = null;

export async function loadWorldGeo() {
  if (!worldGeo) worldGeo = await fetchGeoJson("geo/world-land.json");
  return worldGeo;
}

export function randomPointInWorld(geo) {
  for (let tries = 0; tries < 2000; tries++) {
    const lon = -180 + Math.random() * 360;
    // równomiernie na sferze + odcięcie Antarktydy i dalekiej Arktyki
    const lat = Math.asin(2 * Math.random() - 1) * MathUtils.RAD2DEG;
    if (lat < -58 || lat > 78) continue;
    if (pointInPoland(lon, lat, geo)) return { lat, lon }; // ten sam test punkt-w-poligonie
  }
  return { lat: 52.1, lon: 19.4 };
}

// --- Europa (kraje, Natural Earth 110m; Rosja ucięta na 45°E) ---

let europeGeo = null;

export async function loadEuropeGeo() {
  if (!europeGeo) europeGeo = await fetchGeoJson("geo/europe.json");
  return europeGeo;
}

const EU_LON0 = -25, EU_LON1 = 45;
const EU_LAT0 = 34, EU_LAT1 = 72;

export function randomPointInEurope(geo) {
  for (let tries = 0; tries < 2000; tries++) {
    const lon = EU_LON0 + Math.random() * (EU_LON1 - EU_LON0);
    const lat = EU_LAT0 + Math.random() * (EU_LAT1 - EU_LAT0);
    if (pointInPoland(lon, lat, geo)) return { lat, lon }; // ten sam test punkt-w-poligonie
  }
  return { lat: 52.1, lon: 19.4 };
}

function jitterStart({ lat, lon }, meters = 2200) {
  const brg = Math.random() * Math.PI * 2;
  const d = 350 + Math.random() * meters;
  return offsetPoint(lat, lon, d / 1000);
}

export function randomPointInBBox(bbox, landGeo) {
  const [lon0, lat0, lon1, lat1] = bbox;
  for (let tries = 0; tries < 2000; tries++) {
    const lon = lon0 + Math.random() * (lon1 - lon0);
    const lat = lat0 + Math.random() * (lat1 - lat0);
    if (!landGeo || pointInPoland(lon, lat, landGeo)) return { lat, lon };
  }
  return { lat: (lat0 + lat1) / 2, lon: (lon0 + lon1) / 2 };
}

function cityFallback(scope) {
  if (scope === "pl") return pickCountryStart();
  if (scope === "eu") return pickContinentStart();
  const list = placesForScope("world");
  const [lat, lon] = list[Math.floor(Math.random() * list.length)];
  return { lat, lon };
}

function pickListedStart(scope) {
  const list = placesForScope(scope);
  if (!list.length) return cityFallback(scope);
  const [lat, lon] = list[Math.floor(Math.random() * list.length)];
  return jitterStart({ lat, lon });
}

async function pickGuessStartOnce(scope) {
  try {
    return pickListedStart(scope);
  } catch {
    return cityFallback(scope);
  }
}

const recentStarts = [];
const RECENT_KEEP = 14;
const MIN_SEP_M = 45000;

export async function pickGuessStart(scope) {
  let pick = await pickGuessStartOnce(scope);
  for (let i = 0; i < 10; i++) {
    const far = recentStarts.every((q) => distanceM(pick.lat, pick.lon, q.lat, q.lon) > MIN_SEP_M);
    if (far) break;
    pick = await pickGuessStartOnce(scope);
  }
  recentStarts.push(pick);
  if (recentStarts.length > RECENT_KEEP) recentStarts.shift();
  return pick;
}

export function makeBBoxProject(bbox) {
  const [lon0, lat0, lon1, lat1] = bbox;
  const cos = Math.cos(((lat0 + lat1) / 2) * MathUtils.DEG2RAD);
  return {
    project(lon, lat, w, h, pad = 10) {
      const sx = (w - 2 * pad) / ((lon1 - lon0) * cos);
      const sy = (h - 2 * pad) / (lat1 - lat0);
      const s = Math.min(sx, sy);
      const dw = (lon1 - lon0) * cos * s;
      const dh = (lat1 - lat0) * s;
      const ox = (w - dw) / 2;
      const oy = (h - dh) / 2;
      return [ox + (lon - lon0) * cos * s, oy + (lat1 - lat) * s];
    },
    unproject(x, y, w, h, pad = 10) {
      const sx = (w - 2 * pad) / ((lon1 - lon0) * cos);
      const sy = (h - 2 * pad) / (lat1 - lat0);
      const s = Math.min(sx, sy);
      const dw = (lon1 - lon0) * cos * s;
      const dh = (lat1 - lat0) * s;
      const ox = (w - dw) / 2;
      const oy = (h - dh) / 2;
      return {
        lon: lon0 + (x - ox) / (cos * s),
        lat: lat1 - (y - oy) / s,
      };
    },
  };
}

export function drawBBoxMap(canvas, geo, marks, bbox) {
  drawGeoMap(canvas, geo, marks, makeBBoxProject(bbox).project);
}

// --- mapka świata do zgadywania (ekwiprostokątna, bez skrajnych stref) ---

const W_LON0 = -180, W_LON1 = 180;
const W_LAT0 = -60, W_LAT1 = 85;

function projectionWorld(w, h, pad) {
  const sx = (w - 2 * pad) / (W_LON1 - W_LON0);
  const sy = (h - 2 * pad) / (W_LAT1 - W_LAT0);
  const s = Math.min(sx, sy);
  const dw = (W_LON1 - W_LON0) * s;
  const dh = (W_LAT1 - W_LAT0) * s;
  return { s, ox: (w - dw) / 2, oy: (h - dh) / 2 };
}

export function projectWorld(lon, lat, w, h, pad = 10) {
  const p = projectionWorld(w, h, pad);
  return [p.ox + (lon - W_LON0) * p.s, p.oy + (W_LAT1 - lat) * p.s];
}

export function unprojectWorld(x, y, w, h, pad = 10) {
  const p = projectionWorld(w, h, pad);
  return {
    lon: W_LON0 + (x - p.ox) / p.s,
    lat: W_LAT1 - (y - p.oy) / p.s,
  };
}

// --- mapka Polski do zgadywania (projekcja liniowa — dla PL wystarczy) ---

const LON0 = 14.12127, LON1 = 24.153276;
const LAT0 = 49.00613, LAT1 = 54.835693;
const COS52 = Math.cos(52 * MathUtils.DEG2RAD);

function projection(w, h, pad) {
  const sx = (w - 2 * pad) / ((LON1 - LON0) * COS52);
  const sy = (h - 2 * pad) / (LAT1 - LAT0);
  const s = Math.min(sx, sy);
  const dw = (LON1 - LON0) * COS52 * s;
  const dh = (LAT1 - LAT0) * s;
  return { s, ox: (w - dw) / 2, oy: (h - dh) / 2 };
}

export function projectPL(lon, lat, w, h, pad = 10) {
  const p = projection(w, h, pad);
  return [p.ox + (lon - LON0) * COS52 * p.s, p.oy + (LAT1 - lat) * p.s];
}

export function unprojectPL(x, y, w, h, pad = 10) {
  const p = projection(w, h, pad);
  return {
    lon: LON0 + (x - p.ox) / (COS52 * p.s),
    lat: LAT1 - (y - p.oy) / p.s,
  };
}

// --- mapka Europy (projekcja liniowa z poprawką szerokości) ---

const EU_COS = Math.cos(53 * MathUtils.DEG2RAD);

function projectionEU(w, h, pad) {
  const sx = (w - 2 * pad) / ((EU_LON1 - EU_LON0) * EU_COS);
  const sy = (h - 2 * pad) / (EU_LAT1 - EU_LAT0);
  const s = Math.min(sx, sy);
  const dw = (EU_LON1 - EU_LON0) * EU_COS * s;
  const dh = (EU_LAT1 - EU_LAT0) * s;
  return { s, ox: (w - dw) / 2, oy: (h - dh) / 2 };
}

export function projectEU(lon, lat, w, h, pad = 10) {
  const p = projectionEU(w, h, pad);
  return [p.ox + (lon - EU_LON0) * EU_COS * p.s, p.oy + (EU_LAT1 - lat) * p.s];
}

export function unprojectEU(x, y, w, h, pad = 10) {
  const p = projectionEU(w, h, pad);
  return {
    lon: EU_LON0 + (x - p.ox) / (EU_COS * p.s),
    lat: EU_LAT1 - (y - p.oy) / p.s,
  };
}

export function loadCountryGeo() {
  return getRegionPack().countryCode === "PL" ? loadPolandGeo() : loadWorldGeo();
}

export function loadContinentGeo() {
  return getRegionPack().continentId === "europe" ? loadEuropeGeo() : loadWorldGeo();
}

export function unprojectCountry(x, y, w, h) {
  const pack = getRegionPack();
  if (pack.countryCode === "PL") return unprojectPL(x, y, w, h);
  return makeBBoxProject(pack.country.bbox).unproject(x, y, w, h);
}

export function unprojectContinent(x, y, w, h) {
  const pack = getRegionPack();
  if (pack.continentId === "europe") return unprojectEU(x, y, w, h);
  return makeBBoxProject(pack.continent.bbox).unproject(x, y, w, h);
}

// --- generyczne rysowanie mapy ---

function drawGeoMap(canvas, geo, marks, project) {
  const dpr = Math.min(devicePixelRatio, 2);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (w < 8 || h < 8) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  ctx.fillStyle = "rgba(18, 24, 18, 0.9)";
  ctx.fillRect(0, 0, w, h);

  for (const f of geo.features || []) {
    for (const poly of iterPolygons(f.geometry)) {
      for (const ring of poly) {
        ctx.beginPath();
        ring.forEach(([lon, lat], i) => {
          const [x, y] = project(lon, lat, w, h);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(216, 162, 74, 0.07)";
        ctx.fill();
        ctx.strokeStyle = "rgba(243, 234, 214, 0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  for (const m of marks) {
    const [x, y] = project(m.lon, m.lat, w, h);
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = m.color;
    ctx.fill();
    ctx.strokeStyle = "#0a0e0a";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (m.label) {
      ctx.font = "600 13px Georgia, serif";
      ctx.fillStyle = m.color;
      ctx.fillText(m.label, x + 12, y + 4);
    }
  }

  const truth = marks.find((m) => m.truth) || (marks.length === 2 ? marks[0] : null);
  if (truth) {
    const [x1, y1] = project(truth.lon, truth.lat, w, h);
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.5;
    for (const m of marks) {
      if (m === truth) continue;
      const [x2, y2] = project(m.lon, m.lat, w, h);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "rgba(243, 234, 214, 0.6)";
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }
}

export function drawPolandMap(canvas, geo, marks = []) {
  const pack = getRegionPack();
  if (pack.countryCode === "PL") {
    drawGeoMap(canvas, geo, marks, projectPL);
    return;
  }
  drawBBoxMap(canvas, geo, marks, pack.country.bbox);
}

export function drawEuropeMap(canvas, geo, marks = []) {
  const pack = getRegionPack();
  if (pack.continentId === "europe") {
    drawGeoMap(canvas, geo, marks, projectEU);
    return;
  }
  drawBBoxMap(canvas, geo, marks, pack.continent.bbox);
}

export function drawWorldMap(canvas, geo, marks = []) {
  drawGeoMap(canvas, geo, marks, projectWorld);
}
