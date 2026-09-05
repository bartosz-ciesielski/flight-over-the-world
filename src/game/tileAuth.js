const ION_ASSET = "2275207";
const GOOGLE_ROOT = "https://tile.googleapis.com/v1/3dtiles/root.json";
const ION_ENDPOINT = `https://api.cesium.com/v1/assets/${ION_ASSET}/endpoint`;
const SLOT_KEY = "foe-tile-slot";

/** Always-on photorealistic budget. Do not lower these when a key is throttled. */
export const TILE_QUALITY = {
  errorTarget: 6,
  maxJobs: 16,
  cacheTiles: 4000,
  cacheBytes: 2e9,
};

function splitKeys(raw) {
  return String(raw || "")
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function unique(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

function extractSession(tileset) {
  const walk = (node) => {
    if (!node) return "";
    const uri = node.content?.uri || node.content?.url || "";
    if (uri.includes("session=")) {
      const q = uri.slice(uri.indexOf("?") + 1);
      return new URLSearchParams(q).get("session") || "";
    }
    for (const child of node.children || []) {
      const found = walk(child);
      if (found) return found;
    }
    return "";
  };
  return walk(tileset?.root || tileset);
}

export function loadTileSlots() {
  const ion = unique([
    ...splitKeys(import.meta.env.VITE_CESIUM_ION_KEYS),
    ...splitKeys(import.meta.env.VITE_CESIUM_ION_KEY),
  ]);
  const google = unique([
    ...splitKeys(import.meta.env.VITE_GOOGLE_TILES_KEYS),
    ...(ion.length ? [] : splitKeys(import.meta.env.VITE_GOOGLE_MAPS_KEY)),
  ]);
  return [
    ...ion.map((token) => ({ kind: "ion", token })),
    ...google.map((token) => ({ kind: "google", token })),
  ];
}

export class TileKeyPool {
  constructor(slots) {
    this.slots = slots.map((s, id) => ({
      ...s,
      id,
      coolUntil: 0,
      fails: 0,
      session: null,
    }));
    this.index = this.#restoreIndex();
    this.rotating = null;
    this.switches = 0;
    this.lastErr = "";
    this.onSwitch = null;
  }

  get current() {
    return this.slots[this.index] || null;
  }

  get firstIonToken() {
    return this.slots.find((s) => s.kind === "ion")?.token || "";
  }

  get firstGoogleToken() {
    return this.slots.find((s) => s.kind === "google")?.token || "";
  }

  debug() {
    const now = Date.now();
    return {
      keys: this.slots.length,
      slot: this.index,
      kind: this.current?.kind || "",
      cooling: this.slots.filter((s) => s.coolUntil > now).length,
      switches: this.switches,
      err: this.lastErr,
    };
  }

  #restoreIndex() {
    if (!this.slots.length) return 0;
    try {
      const i = Number(sessionStorage.getItem(SLOT_KEY));
      if (Number.isInteger(i) && i >= 0 && i < this.slots.length) return i;
    } catch {
      /* ignore */
    }
    return 0;
  }

  #saveIndex() {
    try {
      sessionStorage.setItem(SLOT_KEY, String(this.index));
    } catch {
      /* ignore */
    }
  }

  pickReady(now = Date.now()) {
    const n = this.slots.length;
    if (!n) return 0;
    for (let step = 0; step < n; step++) {
      const i = (this.index + step) % n;
      if (this.slots[i].coolUntil <= now) return i;
    }
    let best = 0;
    for (let i = 1; i < n; i++) {
      if (this.slots[i].coolUntil < this.slots[best].coolUntil) best = i;
    }
    return best;
  }

  async ensureSession(slot = this.current) {
    if (!slot) throw new Error("No map keys configured");
    if (slot.session?.key) return slot.session;
    if (slot.kind === "ion") {
      const endpoint = `${ION_ENDPOINT}?access_token=${encodeURIComponent(slot.token)}`;
      const ep = await fetch(endpoint);
      if (!ep.ok) throw new Error(`Cesium ion ${ep.status}`);
      const json = await ep.json();
      const rootUrl = json.options?.url || json.url;
      if (!rootUrl) throw new Error("Cesium ion endpoint has no tiles URL");
      const root = await fetch(rootUrl);
      if (!root.ok) throw new Error(`Tiles root ${root.status}`);
      const tileset = await root.json();
      const parsed = new URL(rootUrl);
      slot.session = {
        key: parsed.searchParams.get("key") || "",
        session: extractSession(tileset) || parsed.searchParams.get("session") || "",
        rootUrl,
      };
      return slot.session;
    }
    const rootUrl = `${GOOGLE_ROOT}?key=${encodeURIComponent(slot.token)}`;
    const root = await fetch(rootUrl);
    if (!root.ok) throw new Error(`Google tiles ${root.status}`);
    const tileset = await root.json();
    slot.session = {
      key: slot.token,
      session: extractSession(tileset),
      rootUrl,
    };
    return slot.session;
  }

  rememberPluginSession(plugin, rootUrl) {
    const slot = this.current;
    if (!slot || slot.session?.key) return;
    const key = plugin?.apiToken || plugin?.auth?.apiToken || "";
    const session = plugin?.auth?.sessionToken || "";
    if (!key && !session) return;
    slot.session = { key, session, rootUrl: rootUrl || "" };
  }

  applySessionToUrl(url) {
    const auth = this.current?.session;
    if (!auth?.key && !auth?.session) return url;
    try {
      const u = new URL(url, "https://tile.googleapis.com");
      if (u.hostname !== "tile.googleapis.com") return url;
      if (auth.key) u.searchParams.set("key", auth.key);
      if (auth.session) u.searchParams.set("session", auth.session);
      return u.toString();
    } catch {
      return url;
    }
  }

  markCool(status) {
    const slot = this.current;
    if (!slot) return;
    slot.fails += 1;
    slot.session = null;
    const long = status === 403 || slot.fails > 3;
    slot.coolUntil = Date.now() + (long ? 15 * 60 * 1000 : 75 * 1000);
  }

  async rotate(status = 429) {
    if (this.rotating) return this.rotating;
    this.rotating = this.#rotate(status);
    try {
      return await this.rotating;
    } finally {
      this.rotating = null;
    }
  }

  async #rotate(status) {
    this.lastErr = String(status);
    this.markCool(status);
    if (this.slots.length < 2) return false;
    const next = this.pickReady();
    if (next === this.index) return false;
    this.index = next;
    this.switches += 1;
    this.#saveIndex();
    await this.ensureSession(this.slots[this.index]);
    this.onSwitch?.();
    return true;
  }

  async fetchData(url, options) {
    if (!this.current) return fetch(url, options);
    if (!this.current.session) await this.ensureSession();
    let res = await fetch(this.applySessionToUrl(url), options);
    if (res.status !== 429 && res.status !== 403) return res;
    this.lastErr = `${res.status}`;
    const switched = await this.rotate(res.status);
    if (!switched) return res;
    return fetch(this.applySessionToUrl(url), options);
  }
}

export function syncTileAuth(tiles, pool) {
  if (!tiles || !pool?.current) return;
  const slot = pool.current;
  const session = slot.session;
  const google = tiles.getPluginByName("GOOGLE_CLOUD_AUTH_PLUGIN");
  if (google) {
    if (session?.key) google.apiToken = session.key;
    if (google.auth) {
      google.auth.autoRefreshToken = false;
      if (session?.key) google.auth.apiToken = session.key;
      if (session?.session) google.auth.sessionToken = session.session;
    }
  }
  const ion = tiles.getPluginByName("CESIUM_ION_AUTH_PLUGIN");
  if (ion && slot.kind === "ion") {
    ion.apiToken = slot.token;
    if (ion.auth) ion.auth.apiToken = slot.token;
  }
}

export function applyTileQuality(tiles) {
  if (!tiles) return;
  tiles.errorTarget = TILE_QUALITY.errorTarget;
  tiles.downloadQueue.maxJobsPerOrigin = TILE_QUALITY.maxJobs;
  tiles.lruCache.maxSize = TILE_QUALITY.cacheTiles;
  tiles.lruCache.maxBytesSize = TILE_QUALITY.cacheBytes;
}
