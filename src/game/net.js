import { Peer } from "peerjs";

const PEER_OPTS = {
  debug: 0,
  secure: true,
  host: "0.peerjs.com",
  port: 443,
  path: "/",
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun.cloudflare.com:3478" },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
  },
};

const CONNECT_OPTS = { reliable: true, serialization: "json" };

function roomId() {
  return "lns" + Math.random().toString(36).slice(2, 8);
}

function guestId() {
  return "lnsc" + Math.random().toString(36).slice(2, 10);
}

function makePeer(id) {
  return new Peer(id, PEER_OPTS);
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

export function hostRoom(handlers, existingId) {
  const id = existingId || roomId();
  const peer = makePeer(id);
  const conns = new Map();

  function each(fn, exceptId) {
    for (const [pid, c] of conns) {
      if (exceptId && pid === exceptId) continue;
      if (c.open) fn(c, pid);
    }
  }

  function attach(c) {
    const pid = c.peer;
    conns.set(pid, c);
    const ready = () => handlers.onPeer?.(pid);
    c.on("open", ready);
    c.on("data", (data) => handlers.onData?.(data, pid));
    c.on("close", () => {
      conns.delete(pid);
      handlers.onLeft?.(pid);
    });
    c.on("error", (err) => handlers.onError?.(err));
    if (c.open) ready();
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

  peer.on("open", () => {
    rememberHost(id);
    handlers.onOpen?.(id);
  });
  peer.on("error", (err) => handlers.onError?.(err));
  peer.on("connection", attach);

  return api;
}

export function joinRoom(hostId, handlers) {
  const myId = guestId();
  const peer = makePeer(myId);
  let conn = null;
  let tries = 0;
  let opened = false;
  let destroyed = false;
  const maxTries = 8;

  function wire(c) {
    conn = c;
    c.on("open", () => {
      if (opened || destroyed) return;
      opened = true;
      handlers.onOpen?.(hostId, myId);
      handlers.onPeer?.();
    });
    c.on("data", (data) => handlers.onData?.(data));
    c.on("close", () => {
      if (!destroyed && opened) handlers.onLeft?.();
    });
    c.on("error", (err) => handlers.onError?.(err));
    if (c.open && !opened) {
      opened = true;
      handlers.onOpen?.(hostId, myId);
      handlers.onPeer?.();
    }
  }

  function tryConnect() {
    if (destroyed || opened) return;
    tries += 1;
    handlers.onStatus?.(`Łączę z pokojem… (${tries}/${maxTries})`);
    try {
      if (conn) {
        conn.close();
        conn = null;
      }
    } catch {
      /* ignore */
    }
    wire(peer.connect(hostId, CONNECT_OPTS));
    setTimeout(() => {
      if (!opened && !destroyed && tries < maxTries) tryConnect();
      else if (!opened && !destroyed) {
        handlers.onError?.({ type: "peer-unavailable" });
      }
    }, 3500);
  }

  const api = {
    id: hostId,
    host: false,
    myPeerId: myId,
    send(data) {
      if (conn?.open) conn.send(data);
    },
    sendTo() {},
    sendExcept() {},
    destroy() {
      destroyed = true;
      try {
        conn?.close();
      } catch {
        /* ignore */
      }
      peer.destroy();
    },
  };

  peer.on("error", (err) => {
    if (destroyed) return;
    if (err?.type === "peer-unavailable" && tries < maxTries) {
      setTimeout(tryConnect, 800);
      return;
    }
    handlers.onError?.(err);
  });
  peer.on("open", () => tryConnect());

  return api;
}
