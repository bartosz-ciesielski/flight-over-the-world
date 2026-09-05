const TILE = 256;
const ZOOM = 12;

function lon2x(lon, z) {
  return ((lon + 180) / 360) * 2 ** z;
}

function lat2y(lat, z) {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
}

function tileUrl(z, x, y) {
  const n = 2 ** z;
  const tx = ((x % n) + n) % n;
  const ty = Math.max(0, Math.min(n - 1, y));
  return `https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`;
}

export function createFreeMap({ root, canvas, place, close }) {
  const ctx = canvas.getContext("2d");
  const cache = new Map();
  let open = false;
  let lastKey = "";
  let pose = { lat: 0, lon: 0, heading: 0, name: "" };

  function loadTile(z, x, y) {
    const url = tileUrl(z, x, y);
    let img = cache.get(url);
    if (img) return img;
    img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      if (open) paint();
    };
    img.src = url;
    cache.set(url, img);
    if (cache.size > 80) {
      const first = cache.keys().next().value;
      cache.delete(first);
    }
    return img;
  }

  function paint() {
    const w = canvas.width;
    const h = canvas.height;
    const cx = lon2x(pose.lon, ZOOM);
    const cy = lat2y(pose.lat, ZOOM);
    const originX = cx * TILE - w / 2;
    const originY = cy * TILE - h / 2;
    const x0 = Math.floor(originX / TILE);
    const y0 = Math.floor(originY / TILE);
    const x1 = Math.floor((originX + w) / TILE);
    const y1 = Math.floor((originY + h) / TILE);

    ctx.fillStyle = "#c9d4c0";
    ctx.fillRect(0, 0, w, h);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const img = loadTile(ZOOM, tx, ty);
        if (img.complete && img.naturalWidth) {
          ctx.drawImage(img, tx * TILE - originX, ty * TILE - originY, TILE, TILE);
        }
      }
    }

    const px = w / 2;
    const py = h / 2;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((pose.heading * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(11, 14);
    ctx.lineTo(0, 8);
    ctx.lineTo(-11, 14);
    ctx.closePath();
    ctx.fillStyle = "#d8a24a";
    ctx.strokeStyle = "#1c1710";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(px, py, 22, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(28, 23, 16, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function setOpen(v) {
    open = !!v;
    root.classList.toggle("show", open);
    if (open) paint();
  }

  close?.addEventListener("click", () => setOpen(false));

  return {
    get open() {
      return open;
    },
    show() {
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
    toggle() {
      setOpen(!open);
    },
    update(lat, lon, headingDeg, name) {
      pose = { lat, lon, heading: headingDeg, name: name || "" };
      if (place) place.textContent = pose.name || `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`;
      if (!open) return;
      const key = `${Math.round(lat * 200)}:${Math.round(lon * 200)}`;
      if (key !== lastKey) {
        lastKey = key;
        paint();
      } else {
        paint();
      }
    },
  };
}
