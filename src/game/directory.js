import { joinRoom } from "trystero";

const TRO = { appId: "flightoverearth-v1" };
const LOBBY = "foe-public-v1";
const STALE_MS = 20000;

export function parseJoinCode(raw) {
  const text = String(raw || "").trim();
  if (!text) return "";
  try {
    if (/^https?:/i.test(text) || text.includes("#")) {
      const url = new URL(text, location.href);
      const h = url.hash.replace(/^#/, "");
      const q = new URLSearchParams(h.includes("=") ? h : `r=${h}`);
      if (q.get("r")) return q.get("r");
    }
  } catch {
    /* ignore */
  }
  const compact = text.replace(/\s+/g, "");
  if (/^lns/i.test(compact)) return compact;
  return `lns${compact}`;
}

export function connectDirectory(onRooms) {
  const room = joinRoom(TRO, LOBBY);
  const rooms = new Map();
  const bus = room.makeAction("ann");
  let destroyed = false;
  let sweep = 0;

  function emit() {
    if (!destroyed) onRooms?.([...rooms.values()].filter((r) => !r.gone));
  }

  function put(info) {
    if (!info?.id || info.visibility === "private" || info.gone) {
      if (info?.id) rooms.delete(info.id);
      emit();
      return;
    }
    rooms.set(info.id, { ...info, at: Date.now() });
    emit();
  }

  bus.onMessage = (info) => put(info);
  sweep = setInterval(() => {
    const now = Date.now();
    let changed = false;
    for (const [id, r] of rooms) {
      if (now - (r.at || 0) > STALE_MS) {
        rooms.delete(id);
        changed = true;
      }
    }
    if (changed) emit();
  }, 4000);

  return {
    announce(info) {
      if (destroyed || !info?.id) return;
      put(info);
      bus.send(info);
    },
    unannounce(id) {
      if (destroyed || !id) return;
      rooms.delete(id);
      bus.send({ id, gone: true });
      emit();
    },
    refresh() {
      emit();
    },
    destroy() {
      destroyed = true;
      clearInterval(sweep);
      try {
        room.leave();
      } catch {
        /* ignore */
      }
    },
  };
}
