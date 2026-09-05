import { joinRoom as troJoin, selfId } from "trystero";

const TRO = { appId: "flightoverearth-v1" };

function roomId() {
  return "lns" + Math.random().toString(36).slice(2, 8);
}

export function parseRoomFromUrl() {
  const fromQuery = new URLSearchParams(location.search).get("r");
  if (fromQuery) return fromQuery;
  const h = location.hash.replace(/^#/, "");
  if (!h) return "";
  const q = new URLSearchParams(h.includes("=") ? h : `r=${h}`);
  return q.get("r") || "";
}

export function roomLink(id) {
  const url = new URL(location.origin + location.pathname);
  url.searchParams.set("r", id);
  return url.toString();
}

export function setRoomUrl(id) {
  const url = new URL(location.href);
  if (id) url.searchParams.set("r", id);
  else url.searchParams.delete("r");
  url.hash = "";
  history.replaceState(null, "", url.pathname + url.search);
}

export function wasHosting(id) {
  try {
    return sessionStorage.getItem("lns-host") === id;
  } catch {
    return false;
  }
}

export function rememberHost(id) {
  try {
    if (id) sessionStorage.setItem("lns-host", id);
    else sessionStorage.removeItem("lns-host");
  } catch {
    /* ignore */
  }
}

function openRoom(id, handlers, isHost) {
  const room = troJoin(TRO, id);
  const bus = room.makeAction("d");
  const seen = new Set();

  const onPeer = (peerId) => {
    if (!peerId || seen.has(peerId)) return;
    seen.add(peerId);
    handlers.onPeer?.(peerId);
  };

  bus.onMessage = (data, meta) => handlers.onData?.(data, meta?.peerId);
  room.onPeerJoin = onPeer;
  room.onPeerLeave = (peerId) => {
    if (peerId) seen.delete(peerId);
    handlers.onLeft?.(peerId);
  };

  const flushPeers = () => {
    const peers = Object.keys(room.getPeers?.() || {});
    for (const peerId of peers) onPeer(peerId);
  };
  const flushTimers = [];
  queueMicrotask(flushPeers);
  flushTimers.push(setTimeout(flushPeers, 200), setTimeout(flushPeers, 800), setTimeout(flushPeers, 2000));

  const api = {
    id,
    host: isHost,
    myPeerId: selfId,
    send(data) {
      bus.send(data);
    },
    sendTo(peerId, data) {
      if (peerId) bus.send(data, { target: peerId });
    },
    sendExcept(peerId, data) {
      const peers = Object.keys(room.getPeers() || {});
      for (const pid of peers) {
        if (pid !== peerId) bus.send(data, { target: pid });
      }
    },
    addStream(stream, target) {
      try {
        room.addStream(stream, target ? { target } : undefined);
      } catch {
        /* ignore */
      }
    },
    removeStream(stream) {
      try {
        room.removeStream(stream);
      } catch {
        /* ignore */
      }
    },
    onPeerStream(cb) {
      room.onPeerStream = cb;
    },
    call() {
      return null;
    },
    destroy() {
      for (const t of flushTimers) clearTimeout(t);
      try {
        room.leave();
      } catch {
        /* ignore */
      }
    },
  };

  if (isHost) rememberHost(id);
  queueMicrotask(() => handlers.onOpen?.(id, selfId));
  return api;
}

export function hostRoom(handlers, existingId) {
  return openRoom(existingId || roomId(), handlers, true);
}

export function joinRoom(hostId, handlers) {
  return openRoom(hostId, handlers, false);
}
