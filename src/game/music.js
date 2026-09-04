const TARGET = 0.22;

const el =
  document.getElementById("bgm") ||
  Object.assign(new Audio("./music/theme.mp3"), { loop: true, preload: "auto" });

el.loop = true;
el.preload = "auto";
el.playsInline = true;
el.volume = TARGET;

function kick() {
  el.muted = false;
  el.volume = TARGET;
  const p = el.play();
  if (p) p.catch(() => {});
}

kick();
el.addEventListener("canplay", kick);
el.addEventListener("loadeddata", kick);

export function updateMusic() {
  if (el.paused) kick();
}

export function primeMusic() {
  kick();
}

export function musicDebug() {
  return {
    paused: el.paused,
    time: Math.round(el.currentTime * 10) / 10,
    gain: el.volume,
  };
}
