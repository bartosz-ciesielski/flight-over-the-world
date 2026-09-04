import { BBOX } from "./config.js";
import { asset } from "./asset.js";

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

function query() {
  const { south, west, north, east } = BBOX;
  return `
[out:json][timeout:90];
(
  way["building"](${south},${west},${north},${east});
  relation["building"](${south},${west},${north},${east});
  way["highway"](${south},${west},${north},${east});
  way["natural"="water"](${south},${west},${north},${east});
  way["water"](${south},${west},${north},${east});
  relation["natural"="water"](${south},${west},${north},${east});
  way["waterway"="riverbank"](${south},${west},${north},${east});
  way["landuse"~"forest|meadow|farmland|orchard|grass|residential|allotments"](${south},${west},${north},${east});
  way["natural"="wood"](${south},${west},${north},${east});
  node["natural"="tree"](${south},${west},${north},${east});
  node["name"]["place"](${south},${west},${north},${east});
  node["amenity"](${south},${west},${north},${east});
  node["shop"](${south},${west},${north},${east});
  node["tourism"](${south},${west},${north},${east});
  way["amenity"](${south},${west},${north},${east});
  way["shop"](${south},${west},${north},${east});
);
out body;
>;
out skel qt;
`.trim();
}

async function fetchFrom(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(body)}`,
  });
  if (!response.ok) {
    throw new Error(`Overpass ${response.status}`);
  }
  return response.json();
}

export async function loadOsm() {
  try {
    const local = await fetch(asset("niepruszewo.osm.json"));
    if (local.ok) {
      const data = await local.json();
      if (data?.elements?.length) return data;
    }
  } catch {
    // fall through to live Overpass
  }

  const body = query();
  let lastError;
  for (const url of ENDPOINTS) {
    try {
      return await fetchFrom(url, body);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export function parseOsm(data) {
  const nodes = new Map();
  const ways = new Map();
  const relations = [];

  for (const el of data.elements) {
    if (el.type === "node") nodes.set(el.id, el);
    if (el.type === "way") ways.set(el.id, el);
    if (el.type === "relation") relations.push(el);
  }

  const wayCoords = (way) =>
    (way.nodes || [])
      .map((id) => nodes.get(id))
      .filter(Boolean)
      .map((n) => [n.lon, n.lat]);

  const buildings = [];
  const roads = [];
  const water = [];
  const land = [];
  const trees = [];
  const pois = [];

  for (const way of ways.values()) {
    const tags = way.tags || {};
    const coords = wayCoords(way);
    if (coords.length < 2) continue;

    if (tags.building) {
      buildings.push({
        coords,
        tags,
        height: buildingHeight(tags),
      });
    } else if (tags.highway) {
      roads.push({ coords, tags });
    } else if (isWater(tags)) {
      water.push({ coords, tags });
    } else if (isLand(tags)) {
      land.push({ coords, tags });
    }

    if (namedPoi(tags) && coords.length) {
      const mid = coords[Math.floor(coords.length / 2)];
      pois.push({ lon: mid[0], lat: mid[1], tags });
    }
  }

  for (const rel of relations) {
    const tags = rel.tags || {};
    const outers = (rel.members || [])
      .filter((m) => m.type === "way" && m.role === "outer")
      .map((m) => ways.get(m.ref))
      .filter(Boolean);
    for (const way of outers) {
      const coords = wayCoords(way);
      if (coords.length < 3) continue;
      if (tags.building) {
        buildings.push({ coords, tags, height: buildingHeight(tags) });
      } else if (isWater(tags)) {
        water.push({ coords, tags });
      }
    }
  }

  for (const node of nodes.values()) {
    const tags = node.tags || {};
    if (tags.natural === "tree") {
      trees.push({ lon: node.lon, lat: node.lat });
    }
    if (namedPoi(tags)) {
      pois.push({ lon: node.lon, lat: node.lat, tags });
    }
  }

  return { buildings, roads, water, land, trees, pois };
}

function buildingHeight(tags) {
  if (tags.height) {
    const n = parseFloat(String(tags.height).replace(",", "."));
    if (!Number.isNaN(n)) return Math.min(Math.max(n, 2.4), 40);
  }
  if (tags["building:levels"]) {
    const n = parseFloat(tags["building:levels"]);
    if (!Number.isNaN(n)) return Math.min(Math.max(n * 3.1, 2.8), 40);
  }
  if (tags.building === "church" || tags.amenity === "place_of_worship") return 16;
  if (tags.building === "garage" || tags.building === "shed") return 3.2;
  if (tags.building === "industrial" || tags.building === "warehouse") return 8.5;
  return 6.4;
}

function isWater(tags) {
  return (
    tags.natural === "water" ||
    Boolean(tags.water) ||
    tags.waterway === "riverbank"
  );
}

function isLand(tags) {
  return Boolean(tags.landuse) || tags.natural === "wood";
}

function namedPoi(tags) {
  return Boolean(
    tags.name && (tags.amenity || tags.shop || tags.tourism || tags.place)
  );
}
