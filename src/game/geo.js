import { ORIGIN } from "./config.js";

const M_PER_DEG_LAT = 111_320;

function metersPerDegLon(lat) {
  return M_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180);
}

/** Local scene: +X east, +Z south, Y up. Origin is the village center. */
export function latLonToWorld(lat, lon, origin = ORIGIN) {
  return {
    x: (lon - origin.lon) * metersPerDegLon(origin.lat),
    z: (origin.lat - lat) * M_PER_DEG_LAT,
  };
}

export function worldToLatLon(x, z, origin = ORIGIN) {
  return {
    lat: origin.lat - z / M_PER_DEG_LAT,
    lon: origin.lon + x / metersPerDegLon(origin.lat),
  };
}

export function lonLatToTile(lon, lat, zoom) {
  const n = 2 ** zoom;
  const x = ((lon + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
}

export function tileToLonLat(x, y, zoom) {
  const n = 2 ** zoom;
  const lon = (x / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  return { lon, lat: (latRad * 180) / Math.PI };
}

export function ringToWorld(coords) {
  return coords.map(([lon, lat]) => latLonToWorld(lat, lon));
}
