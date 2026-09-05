const MIC_OPTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: false,
};

let net = null;
let stream = null;
let talking = false;
let denied = false;
const calls = new Map();
const speakers = new Map();

export function bindVoice(api) {
  net = api;
}

export function isTalking() {
  return talking;
}

export function voiceDenied() {
  return denied;
}

export async function ensureMic() {
  if (stream) return stream;
  if (denied || !navigator.mediaDevices?.getUserMedia) {
    denied = true;
    return null;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia(MIC_OPTS);
    for (const t of stream.getAudioTracks()) t.enabled = talking;
  } catch {
    denied = true;
    stream = null;
  }
  return stream;
}

export function setTalking(on) {
  talking = !!on;
  if (stream) {
    for (const t of stream.getAudioTracks()) t.enabled = talking;
  }
}

function playRemote(id, remote) {
  let audio = speakers.get(id);
  if (!audio) {
    audio = new Audio();
    audio.autoplay = true;
    audio.playsInline = true;
    speakers.set(id, audio);
  }
  audio.srcObject = remote;
  audio.play().catch(() => {});
}

function dropPeer(id) {
  const call = calls.get(id);
  try {
    call?.close();
  } catch {
    /* ignore */
  }
  calls.delete(id);
  const audio = speakers.get(id);
  if (audio) {
    audio.pause();
    audio.srcObject = null;
    speakers.delete(id);
  }
}

function hookCall(id, call) {
  if (!id || !call) return;
  const prev = calls.get(id);
  if (prev && prev !== call) {
    try {
      prev.close();
    } catch {
      /* ignore */
    }
  }
  calls.set(id, call);
  call.on("stream", (remote) => playRemote(id, remote));
  call.on("close", () => dropPeer(id));
  call.on("error", () => dropPeer(id));
}

export function answerCall(call) {
  if (!call) return;
  try {
    if (stream) call.answer(stream);
    else call.answer();
  } catch {
    return;
  }
  hookCall(call.peer, call);
}

export function syncVoiceCalls(peerIds = []) {
  if (!net || !stream) return;
  const mine = net.myPeerId || "";
  const want = new Set(peerIds.filter((id) => id && id !== mine));
  for (const id of [...calls.keys()]) {
    if (!want.has(id)) dropPeer(id);
  }
  for (const id of want) {
    if (calls.has(id)) continue;
    if (mine && mine < id) {
      try {
        hookCall(id, net.call(id, stream));
      } catch {
        /* ignore */
      }
    }
  }
}

export function dropVoicePeer(id) {
  if (id) dropPeer(id);
}

export function destroyVoice() {
  talking = false;
  denied = false;
  for (const id of [...calls.keys()]) dropPeer(id);
  if (stream) {
    for (const t of stream.getAudioTracks()) t.stop();
    stream = null;
  }
  net = null;
}
