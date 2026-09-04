import { Peer } from "peerjs";

function roomId() {
  return "lns" + Math.random().toString(36).slice(2, 8);
}

function makePeer(id) {
  return id
    ? new Peer(id, { debug: 0 })
    : new Peer({ debug: 0 });
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

export function hostRoom(handlers) {
  const id = roomId();
  const peer = makePeer(id);
  const conns = new Map();

  function each(fn, exceptId) {
    for (const [pid, c] of conns) {
      if (exceptId && pid === exceptId) continue;
      if (c.open) fn(c, pid);
    }
  }

  const api = {
    id,
    host: true,
    myPeerId: id,
    send(data) {
      each((c) => c.send(data));
    },
    sendTo(peerId, data) {
      const c = conns.get(peerId);
      if (c?.open) c.send(data);
    },
    sendExcept(peerId, data) {
      each((c) => c.send(data), peerId);
    },
    destroy() {
      for (const c of conns.values()) c.close();
      conns.clear();
      peer.destroy();
    },
  };

  peer.on("open", () => handlers.onOpen?.(id));
  peer.on("error", (err) => handlers.onError?.(err));
  peer.on("connection", (c) => {
    conns.set(c.peer, c);
    c.on("open", () => handlers.onPeer?.(c.peer));
    c.on("data", (data) => handlers.onData?.(data, c.peer));
    c.on("close", () => {
      conns.delete(c.peer);
      handlers.onLeft?.(c.peer);
    });
    c.on("error", (err) => handlers.onError?.(err));
  });

  return api;
}

export function joinRoom(hostId, handlers) {
  const peer = makePeer();
  let conn = null;

  const api = {
    id: hostId,
    host: false,
    myPeerId: "",
    send(data) {
      if (conn?.open) conn.send(data);
    },
    sendTo() {},
    sendExcept() {},
    destroy() {
      conn?.close();
      peer.destroy();
    },
  };

  peer.on("error", (err) => handlers.onError?.(err));
  peer.on("open", (myId) => {
    api.myPeerId = myId;
    conn = peer.connect(hostId, { reliable: true });
    conn.on("open", () => {
      handlers.onOpen?.(hostId, myId);
      handlers.onPeer?.();
    });
    conn.on("data", (data) => handlers.onData?.(data));
    conn.on("close", () => handlers.onLeft?.());
    conn.on("error", (err) => handlers.onError?.(err));
  });

  return api;
}
