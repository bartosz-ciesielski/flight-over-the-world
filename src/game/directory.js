import { Peer } from "peerjs";
import { CONNECT_OPTS, PEER_OPTS } from "./net.js";

export const LOBBY_ID = "foeearthlobby1";
const STALE_MS = 16000;

function browserId() {
  return "foeb" + Math.random().toString(36).slice(2, 10);
}

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

export function startAnnouncer(connectFn, getRoom) {
  let conn = null;
  let stopped = false;
  let timer = 0;

  function send() {
    if (stopped) return;
    const room = getRoom?.();
    if (!room?.id || room.visibility === "private") return;
    if (conn?.open) {
      conn.send({ t: "announce", room });
      return;
    }
    try {
      conn?.close();
    } catch {
      /* ignore */
    }
    conn = connectFn?.(LOBBY_ID) || null;
    if (!conn) return;
    conn.on("open", () => {
      if (!stopped) conn.send({ t: "announce", room: getRoom() });
    });
    conn.on("close", () => {
      conn = null;
    });
    conn.on("error", () => {
      conn = null;
    });
  }

  send();
  timer = setInterval(send, 4000);
  return {
    stop() {
      stopped = true;
      clearInterval(timer);
      try {
        if (conn?.open) conn.send({ t: "unannounce", id: getRoom?.()?.id });
        conn?.close();
      } catch {
        /* ignore */
      }
      conn = null;
    },
  };
}

export function connectDirectory(onRooms) {
  let peer = null;
  let remote = null;
  let destroyed = false;
  let isHost = false;
  const rooms = new Map();
  const seen = new Map();
  let sweepTimer = 0;
  let retryTimer = 0;

  function emit() {
    if (destroyed) return;
    onRooms?.([...rooms.values()]);
  }

  function put(room) {
    if (!room?.id || room.visibility === "private") return;
    rooms.set(room.id, { ...room, at: Date.now() });
    seen.set(room.id, Date.now());
    emit();
    if (isHost) broadcast();
  }

  function drop(id) {
    if (!id) return;
    rooms.delete(id);
    seen.delete(id);
    emit();
    if (isHost) broadcast();
  }

  function broadcast() {
    const list = [...rooms.values()];
    for (const c of conns) {
      if (c.open) c.send({ t: "rooms", rooms: list });
    }
  }

  const conns = new Set();

  function attachClient(c) {
    conns.add(c);
    c.on("data", (data) => {
      if (!data || !isHost) return;
      if (data.t === "announce") put(data.room);
      else if (data.t === "unannounce") drop(data.id);
      else if (data.t === "hello") c.send({ t: "rooms", rooms: [...rooms.values()] });
    });
    c.on("close", () => conns.delete(c));
    if (c.open) c.send({ t: "rooms", rooms: [...rooms.values()] });
  }

  function becomeHost() {
    if (destroyed || isHost) return;
    cleanupPeer();
    isHost = true;
    peer = new Peer(LOBBY_ID, PEER_OPTS);
    peer.on("open", () => emit());
    peer.on("connection", attachClient);
    peer.on("error", (err) => {
      if (destroyed) return;
      if (err?.type === "unavailable-id") {
        isHost = false;
        joinHost();
      }
    });
    startSweep();
  }

  function joinHost() {
    if (destroyed) return;
    cleanupPeer();
    isHost = false;
    peer = new Peer(browserId(), PEER_OPTS);
    peer.on("open", () => {
      if (destroyed) return;
      remote = peer.connect(LOBBY_ID, CONNECT_OPTS);
      remote.on("open", () => remote.send({ t: "hello" }));
      remote.on("data", (data) => {
        if (data?.t !== "rooms") return;
        rooms.clear();
        for (const room of data.rooms || []) rooms.set(room.id, room);
        emit();
      });
      remote.on("close", () => scheduleRetry());
      remote.on("error", () => scheduleRetry());
    });
    peer.on("error", (err) => {
      if (destroyed) return;
      if (err?.type === "peer-unavailable") becomeHost();
    });
  }

  function scheduleRetry() {
    if (destroyed || retryTimer) return;
    retryTimer = setTimeout(() => {
      retryTimer = 0;
      becomeHost();
    }, 800);
  }

  function startSweep() {
    clearInterval(sweepTimer);
    sweepTimer = setInterval(() => {
      if (!isHost) return;
      const now = Date.now();
      let changed = false;
      for (const [id, at] of seen) {
        if (now - at > STALE_MS) {
          rooms.delete(id);
          seen.delete(id);
          changed = true;
        }
      }
      if (changed) {
        emit();
        broadcast();
      }
    }, 4000);
  }

  function cleanupPeer() {
    try {
      remote?.close();
    } catch {
      /* ignore */
    }
    remote = null;
    for (const c of conns) {
      try {
        c.close();
      } catch {
        /* ignore */
      }
    }
    conns.clear();
    try {
      peer?.destroy();
    } catch {
      /* ignore */
    }
    peer = null;
  }

  joinHost();
  setTimeout(() => {
    if (!destroyed && !isHost && !remote?.open && rooms.size === 0) becomeHost();
  }, 2500);

  return {
    announce(room) {
      if (destroyed || !room) return;
      if (isHost) put(room);
      else if (remote?.open) remote.send({ t: "announce", room });
    },
    unannounce(id) {
      if (destroyed || !id) return;
      if (isHost) drop(id);
      else if (remote?.open) remote.send({ t: "unannounce", id });
    },
    refresh() {
      if (remote?.open) remote.send({ t: "hello" });
      else emit();
    },
    destroy() {
      destroyed = true;
      clearTimeout(retryTimer);
      clearInterval(sweepTimer);
      cleanupPeer();
    },
  };
}
