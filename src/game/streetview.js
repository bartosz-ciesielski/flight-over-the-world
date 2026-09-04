import { SPAWN } from "./config.js";

export function loadGoogleMaps(key) {
  if (window.google?.maps?.StreetViewPanorama) {
    return Promise.resolve(window.google.maps);
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-gmaps]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google.maps));
      existing.addEventListener("error", () => reject(new Error("Google Maps")));
      return;
    }
    const script = document.createElement("script");
    script.dataset.gmaps = "1";
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Nie udało się wczytać Google Maps"));
    document.head.appendChild(script);
  });
}

export async function createStreetWalk(container, maps, origin = SPAWN) {
  const service = new maps.StreetViewService();
  const data = await findPano(service, maps, origin.lat, origin.lon);
  if (!data) {
    throw new Error(
      "Brak Street View przy Jarzębinowej, albo klucz nie ma włączonego Maps JavaScript API."
    );
  }

  const pano = new maps.StreetViewPanorama(container, {
    pano: data.location.pano,
    pov: { heading: firstHeading(data), pitch: 0 },
    zoom: 0,
    disableDefaultUI: true,
    linksControl: false,
    panControl: false,
    zoomControl: false,
    addressControl: false,
    fullscreenControl: false,
    motionTracking: false,
    enableCloseButton: false,
    clickToGo: true,
    scrollwheel: true,
    showRoadLabels: true,
  });

  const state = {
    pano,
    maps,
    service,
    moving: false,
    keys: new Set(),
    lastStep: 0,
    place: data.location.shortDescription || origin.name,
  };

  const onKey = (down) => (e) => {
    const k = e.key.toLowerCase();
    if (down) state.keys.add(k);
    else state.keys.delete(k);
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
      e.preventDefault();
    }
  };
  window.addEventListener("keydown", onKey(true));
  window.addEventListener("keyup", onKey(false));

  maps.event.addListenerOnce(pano, "status_changed", () => {
    maps.event.trigger(pano, "resize");
  });
  requestAnimationFrame(() => maps.event.trigger(pano, "resize"));

  pano.addListener("position_changed", () => {
    const loc = pano.getLocation();
    if (loc?.shortDescription) state.place = loc.shortDescription;
  });

  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const pov = pano.getPov();
    let heading = pov.heading;
    if (state.keys.has("a") || state.keys.has("arrowleft")) heading -= 72 * dt;
    if (state.keys.has("d") || state.keys.has("arrowright")) heading += 72 * dt;
    if (heading !== pov.heading) pano.setPov({ heading, pitch: pov.pitch });

    const forward = state.keys.has("w") || state.keys.has("arrowup");
    const back = state.keys.has("s") || state.keys.has("arrowdown");
    if ((forward || back) && now - state.lastStep > 380) {
      stepAlong(state, forward ? heading : heading + 180);
      state.lastStep = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  return state;
}

function findPano(service, maps, lat, lon) {
  const radii = [70, 160, 350, 700];
  return radii.reduce(
    (prev, radius) =>
      prev.then((found) => {
        if (found) return found;
        return new Promise((resolve) => {
          service.getPanorama(
            {
              location: { lat, lng: lon },
              radius,
              source: maps.StreetViewSource.OUTDOOR,
              preference: maps.StreetViewPreference.NEAREST,
            },
            (data, status) => resolve(status === "OK" ? data : null)
          );
        });
      }),
    Promise.resolve(null)
  );
}

function firstHeading(data) {
  return data.links?.[0]?.heading ?? 0;
}

function stepAlong(state, desiredHeading) {
  const links = state.pano.getLinks() || [];
  if (!links.length || state.moving) return;
  let best = null;
  let bestDiff = 75;
  for (const link of links) {
    const diff = angleDiff(desiredHeading, link.heading);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = link;
    }
  }
  if (!best) return;
  state.moving = true;
  state.pano.setPano(best.pano);
  state.pano.setPov({
    heading: best.heading,
    pitch: state.pano.getPov().pitch,
  });
  setTimeout(() => {
    state.moving = false;
  }, 260);
}

function angleDiff(a, b) {
  return Math.abs(((a - b + 540) % 360) - 180);
}

export function streetLatLon(state) {
  const pos = state.pano.getPosition();
  if (!pos) return { lat: SPAWN.lat, lon: SPAWN.lon };
  return { lat: pos.lat(), lon: pos.lng() };
}

let peekPano = null;

/** Live Street View at current GPS — no download, no cache. */
export async function showStreetPeek(container, lat, lon, heading = 0) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  if (!key) return false;
  const maps = await loadGoogleMaps(key);
  const service = new maps.StreetViewService();
  const data = await findPano(service, maps, lat, lon);
  if (!data) return false;
  container.classList.add("open");
  if (!peekPano) {
    peekPano = new maps.StreetViewPanorama(container, {
      pano: data.location.pano,
      pov: { heading, pitch: 0 },
      zoom: 0,
      disableDefaultUI: true,
      addressControl: false,
      fullscreenControl: false,
      motionTracking: false,
      enableCloseButton: false,
      clickToGo: false,
      scrollwheel: true,
    });
  } else {
    peekPano.setPano(data.location.pano);
    peekPano.setPov({ heading, pitch: 0 });
  }
  requestAnimationFrame(() => maps.event.trigger(peekPano, "resize"));
  return true;
}

export function hideStreetPeek(container) {
  container.classList.remove("open");
}
