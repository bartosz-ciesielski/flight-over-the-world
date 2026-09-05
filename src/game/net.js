import { joinRoom as troJoin, selfId } from "trystero";

const TRO = { appId: "flightoverearth-v1" };

function roomId() {
  return "lns" + Math.random().toString(36).slice(2, 8);
}

export function parseRoomFromUrl() {
  const h = location.hash.replace(/^#/, "");
  const q = new URLSearchParams(h.includes("=") ? h : `r=${h}`);
  return q.get("r") || "";
}

export function roomLink(id) {
  const url = new URL(location.href);
  url.hash = `r=${id}`;
  return url.toString();
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

  bus.onMessage = (data, meta) => handlers.onData?.(data, meta?.peerId);
  room.onPeerJoin = (peerId) => handlers.onPeer?.(peerId);
  room.onPeerLeave = (peerId) => handlers.onLeft?.(peerId);

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
