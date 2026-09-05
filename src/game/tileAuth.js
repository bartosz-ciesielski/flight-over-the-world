const ION_ASSET = "2275207";
const GOOGLE_ROOT = "https://tile.googleapis.com/v1/3dtiles/root.json";
const ION_ENDPOINT = `https://api.cesium.com/v1/assets/${ION_ASSET}/endpoint`;
const SLOT_KEY = "foe-tile-slot";
const DEAD_MS = 24 * 60 * 60 * 1000;
const COOL_MS = 90 * 1000;

/** Always-on photorealistic budget. Do not lower these when a key is throttled. */
export const TILE_QUALITY = {
  // Lower = sharper under the plane. Horizon uses errorFalloff so we
  // spend Google's budget on what you actually look at.
  errorTarget: 4,
  errorFalloff: 12,
  errorFalloffDensity: 2.5e-4,
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

function statusOf(err) {
  const m = String(err?.message || err || "").match(/\b(401|403|429|502|503)\b/);
  return m ? Number(m[1]) : 0;
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
      dead: false,
      session: null,
      pending: null,
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
    return this.slots.find((s) => s.kind === "ion" && !s.dead)?.token
      || this.slots.find((s) => s.kind === "ion")?.token
      || "";
  }

  get firstGoogleToken() {
    return this.slots.find((s) => s.kind === "google" && !s.dead)?.token
      || this.slots.find((s) => s.kind === "google")?.token
      || "";
  }

  debug() {
    const now = Date.now();
    return {
      keys: this.slots.length,
      slot: this.index,
      kind: this.current?.kind || "",
      dead: this.slots.filter((s) => s.dead).length,
      cooling: this.slots.filter((s) => !s.dead && s.coolUntil > now).length,
      ready: this.slots.filter((s) => !s.dead && s.coolUntil <= now).length,
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
      const slot = this.slots[i];
      if (!slot.dead && slot.coolUntil <= now) return i;
    }
    let best = -1;
    for (let i = 0; i < n; i++) {
      if (this.slots[i].dead) continue;
      if (best < 0 || this.slots[i].coolUntil < this.slots[best].coolUntil) best = i;
    }
    return best < 0 ? this.index : best;
  }

  markStatus(slot, status) {
    if (!slot) return;
    const code = Number(status) || 0;
    this.lastErr = String(status);
    slot.fails += 1;
    if (code === 401 || (slot.kind === "ion" && code === 403)) {
      slot.dead = true;
      slot.session = null;
      slot.coolUntil = Date.now() + DEAD_MS;
      return;
    }
    // 429 / transient — keep the live session so tiles can resume without
    // re-fetching root.json (that call is also rate-limited).
    slot.coolUntil = Date.now() + (code === 403 || slot.fails > 4 ? 15 * 60 * 1000 : COOL_MS);
  }

  async ensureSession(slot = this.current) {
    if (!slot || slot.dead) return null;
    if (slot.session?.key) return slot.session;
    if (slot.pending) return slot.pending;
    slot.pending = this.#fetchSession(slot);
    try {
      return await slot.pending;
    } finally {
      slot.pending = null;
    }
  }

  async #fetchSession(slot) {
    try {
      if (slot.kind === "ion") {
        const endpoint = `${ION_ENDPOINT}?access_token=${encodeURIComponent(slot.token)}`;
        const ep = await fetch(endpoint);
        if (!ep.ok) {
          this.markStatus(slot, ep.status);
          return null;
        }
        const json = await ep.json();
        const rootUrl = json.options?.url || json.url;
        if (!rootUrl) {
          this.markStatus(slot, 401);
          return null;
        }
        const parsed = new URL(rootUrl);
        const key = parsed.searchParams.get("key") || "";
        let session = parsed.searchParams.get("session") || "";
        try {
          const root = await fetch(rootUrl);
          if (root.ok) {
            const tileset = await root.json();
            session = extractSession(tileset) || session;
          }
        } catch {
          /* ion already gave a usable key — do not kill the slot on a busy root.json */
        }
        if (!key) {
          this.markStatus(slot, 401);
          return null;
        }
        slot.session = { key, session, rootUrl };
        slot.fails = 0;
        return slot.session;
      }
      const rootUrl = `${GOOGLE_ROOT}?key=${encodeURIComponent(slot.token)}`;
      const root = await fetch(rootUrl);
      if (!root.ok) {
        this.markStatus(slot, root.status);
        return null;
      }
      const tileset = await root.json();
      slot.session = {
        key: slot.token,
        session: extractSession(tileset),
        rootUrl,
      };
      slot.fails = 0;
      return slot.session;
    } catch (err) {
      this.markStatus(slot, statusOf(err) || 0);
      return null;
    }
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
      // Google rejects root.json when a session query is present (HTTP 400).
      const path = u.pathname;
      const needsSession =
        u.searchParams.has("session") ||
        path.includes("/files/") ||
        /\.glb$/i.test(path);
      if (auth.session && needsSession) u.searchParams.set("session", auth.session);
      else u.searchParams.delete("session");
      return u.toString();
    } catch {
      return url;
    }
  }

  async warmup() {
    const n = this.slots.length;
    if (!n) return false;
    for (let step = 0; step < n; step++) {
      const i = (this.index + step) % n;
      const slot = this.slots[i];
      if (slot.dead) continue;
      const session = await this.ensureSession(slot);
      if (!session) continue;
      this.index = i;
      this.#saveIndex();
      return true;
    }
    return false;
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
    if (this.current) this.markStatus(this.current, status);
    const n = this.slots.length;
    if (n < 2) return false;
    for (let step = 1; step < n; step++) {
      const i = (this.index + step) % n;
      const slot = this.slots[i];
      if (slot.dead) continue;
      const session = slot.session || await this.ensureSession(slot);
      if (!session) continue;
      if (i === this.index) return false;
      this.index = i;
      this.switches += 1;
      this.#saveIndex();
      this.onSwitch?.();
      return true;
    }
    return false;
  }

  async fetchData(url, options) {
    if (!this.current) return fetch(url, options);
    if (!this.current.session && !this.current.dead) {
      await this.ensureSession(this.current);
    }
    if (!this.current?.session) {
      const switched = await this.rotate(this.lastErr || 401);
      if (!switched || !this.current?.session) {
        return new Response("", { status: 401, statusText: "No map key" });
      }
    }
    let last = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      if (options?.signal?.aborted) {
        return last || new Response("", { status: 499, statusText: "Aborted" });
      }
      try {
        last = await fetch(this.applySessionToUrl(url), options);
      } catch (err) {
        last = new Response("", { status: 599, statusText: String(err?.message || err) });
      }
      if (last.ok) return last;
      if (last.status === 429 || last.status === 502 || last.status === 503) {
        this.lastErr = String(last.status);
        // Stay LOADING so the parent tile is not dropped for a white hole.
        await new Promise((r) => setTimeout(r, 350 * (attempt + 1)));
        continue;
      }
      if (last.status === 401 || last.status === 403) {
        const slot = this.current;
        if (slot) slot.session = null;
        const refreshed = await this.ensureSession(slot);
        if (refreshed) continue;
        const switched = await this.rotate(last.status);
        if (switched) continue;
      }
      return last;
    }
    return last || new Response("", { status: 429, statusText: "Tiles busy" });
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
  tiles.errorFalloff = TILE_QUALITY.errorFalloff;
  tiles.errorFalloffDensity = TILE_QUALITY.errorFalloffDensity;
  tiles.loadAncestors = true;
  tiles.loadSiblings = true;
  tiles.downloadQueue.maxJobsPerOrigin = TILE_QUALITY.maxJobs;
  tiles.lruCache.maxSize = TILE_QUALITY.cacheTiles;
  tiles.lruCache.maxBytesSize = TILE_QUALITY.cacheBytes;
  tiles.lruCache.minSize = 800;
  tiles.lruCache.unloadPercent = 0.05;
}
