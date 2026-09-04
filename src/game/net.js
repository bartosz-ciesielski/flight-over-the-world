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
  let conn = null;

  const api = {
    id,
    host: true,
    send(data) {
      if (conn?.open) conn.send(data);
    },
    destroy() {
      conn?.close();
      peer.destroy();
    },
  };

  peer.on("open", () => handlers.onOpen?.(id));
  peer.on("error", (err) => handlers.onError?.(err));
  peer.on("connection", (c) => {
    conn = c;
    c.on("open", () => handlers.onPeer?.());
    c.on("data", (data) => handlers.onData?.(data));
    c.on("close", () => handlers.onLeft?.());
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
    send(data) {
      if (conn?.open) conn.send(data);
    },
    destroy() {
      conn?.close();
      peer.destroy();
    },
  };

  peer.on("error", (err) => handlers.onError?.(err));
  peer.on("open", () => {
    conn = peer.connect(hostId, { reliable: true });
    conn.on("open", () => {
      handlers.onOpen?.(hostId);
      handlers.onPeer?.();
    });
    conn.on("data", (data) => handlers.onData?.(data));
    conn.on("close", () => handlers.onLeft?.());
    conn.on("error", (err) => handlers.onError?.(err));
  });

  return api;
}
