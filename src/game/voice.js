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
const speakers = new Map();

export function bindVoice(api) {
  net = api;
  net?.onPeerStream?.((remote, id) => playRemote(id, remote));
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

export function answerCall() {}

export function syncVoiceCalls() {
  if (!net || !stream) return;
  net.addStream?.(stream);
}

export function dropVoicePeer(id) {
  const audio = speakers.get(id);
  if (!audio) return;
  audio.pause();
  audio.srcObject = null;
  speakers.delete(id);
}

export function destroyVoice() {
  talking = false;
  denied = false;
  for (const id of [...speakers.keys()]) dropVoicePeer(id);
  if (stream) {
    try {
      net?.removeStream?.(stream);
    } catch {
      /* ignore */
    }
    for (const t of stream.getAudioTracks()) t.stop();
    stream = null;
  }
  net = null;
}
