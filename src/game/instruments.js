// Przyrządy lotnicze — prędkościomierz, wysokościomierz, kompas (canvas 2D)

const TAU = Math.PI * 2;
const GOLD = "#d8a24a";
const PAPER = "#f3ead6";

function setup(canvas) {
  const dpr = Math.min(devicePixelRatio, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

function face(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.fillStyle = "rgba(14, 12, 9, 0.72)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(243, 234, 214, 0.35)";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 3.5, 0, TAU);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(243, 234, 214, 0.12)";
  ctx.stroke();
}

function needle(ctx, cx, cy, angle, len) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 9);
  ctx.lineTo(2.4, 0);
  ctx.lineTo(0, -len);
  ctx.lineTo(-2.4, 0);
  ctx.closePath();
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, 3.6, 0, TAU);
  ctx.fillStyle = GOLD;
  ctx.fill();
}

// tarcza łukowa: 0 w lewym dolnym, max w prawym dolnym (zakres 240°)
function arcGauge(canvas, value, max, unit, majorStep, minorStep) {
  const { ctx, w, h } = setup(canvas);
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 2;
  face(ctx, cx, cy, r);

  const start = (Math.PI * 2) / 3; // 120° od góry w lewo
  const sweep = (Math.PI * 4) / 3; // 240°

  ctx.save();
  ctx.translate(cx, cy);
  for (let v = 0; v <= max + 1e-9; v += minorStep) {
    const a = start + (v / max) * sweep;
    const major = Math.abs(v / majorStep - Math.round(v / majorStep)) < 1e-6;
    const r1 = r - (major ? 13 : 8);
    const r0 = r - 4.5;
    ctx.beginPath();
    ctx.moveTo(Math.sin(a) * r0, -Math.cos(a) * r0);
    ctx.lineTo(Math.sin(a) * r1, -Math.cos(a) * r1);
    ctx.lineWidth = major ? 2 : 1;
    ctx.strokeStyle = major ? PAPER : "rgba(243, 234, 214, 0.5)";
    ctx.stroke();
    if (major) {
      ctx.save();
      ctx.rotate(a);
      ctx.fillStyle = PAPER;
      ctx.font = "600 9px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(v), 0, -(r - 22));
      ctx.restore();
    }
  }
  ctx.restore();

  const clamped = Math.max(0, Math.min(max, value));
  needle(ctx, cx, cy, start + (clamped / max) * sweep, r - 30);

  // tabliczka odczytu — kryje wskazówkę i podziałkę, tekst zawsze czytelny
  const label = String(Math.round(value));
  ctx.font = "600 15px Georgia, serif";
  const pw = Math.max(ctx.measureText(label).width + 18, 52);
  const py = cy + r * 0.55;
  ctx.beginPath();
  ctx.roundRect(cx - pw / 2, py - 16, pw, 34, 6);
  ctx.fillStyle = "rgba(10, 8, 6, 0.94)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(243, 234, 214, 0.3)";
  ctx.stroke();

  ctx.fillStyle = PAPER;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx, py - 6);
  ctx.fillStyle = "rgba(243, 234, 214, 0.55)";
  ctx.font = "7px Georgia, serif";
  ctx.fillText(unit, cx, py + 9);
}

export function drawAirspeed(canvas, kmh, max = 400) {
  // 4 działki główne — etykiety zawsze czytelne niezależnie od skali
  arcGauge(canvas, kmh, max, "KM/H", max / 4, max / 20);
}

export function drawAltimeter(canvas, aglM) {
  arcGauge(canvas, aglM, 1000, "METRY", 200, 100);
}

export function drawCompass(canvas, headingDeg) {
  const { ctx, w, h } = setup(canvas);
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 2;
  face(ctx, cx, cy, r);

  // obracająca się róża
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-headingDeg * Math.PI) / 180);
  for (let d = 0; d < 360; d += 10) {
    const a = (d * Math.PI) / 180;
    const cardinal = d % 90 === 0;
    const major = d % 30 === 0;
    const r1 = r - (major ? 11 : 6);
    const r0 = r - 4.5;
    ctx.beginPath();
    ctx.moveTo(Math.sin(a) * r0, -Math.cos(a) * r0);
    ctx.lineTo(Math.sin(a) * r1, -Math.cos(a) * r1);
    ctx.lineWidth = major ? 2 : 1;
    ctx.strokeStyle = major ? PAPER : "rgba(243, 234, 214, 0.5)";
    ctx.stroke();
    if (cardinal) {
      ctx.save();
      ctx.rotate(a);
      ctx.fillStyle = d === 0 ? GOLD : PAPER;
      ctx.font = "700 13px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText({ 0: "N", 90: "E", 180: "S", 270: "W" }[d], 0, -(r - 22));
      ctx.restore();
    } else if (major) {
      ctx.save();
      ctx.rotate(a);
      ctx.fillStyle = "rgba(243, 234, 214, 0.75)";
      ctx.font = "600 8px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(d / 10), 0, -(r - 21));
      ctx.restore();
    }
  }
  ctx.restore();

  // nieruchomy znacznik kursu u góry
  ctx.beginPath();
  ctx.moveTo(cx, cy - r + 3);
  ctx.lineTo(cx - 5, cy - r + 12);
  ctx.lineTo(cx + 5, cy - r + 12);
  ctx.closePath();
  ctx.fillStyle = GOLD;
  ctx.fill();

  // samolot w centrum
  ctx.save();
  ctx.translate(cx, cy - 6);
  ctx.beginPath();
  ctx.moveTo(0, -7);
  ctx.lineTo(2, 2);
  ctx.lineTo(9, 6);
  ctx.lineTo(9, 8);
  ctx.lineTo(2, 6);
  ctx.lineTo(2, 12);
  ctx.lineTo(5, 14);
  ctx.lineTo(5, 15.5);
  ctx.lineTo(0, 14);
  ctx.lineTo(-5, 15.5);
  ctx.lineTo(-5, 14);
  ctx.lineTo(-2, 12);
  ctx.lineTo(-2, 6);
  ctx.lineTo(-9, 8);
  ctx.lineTo(-9, 6);
  ctx.lineTo(-2, 2);
  ctx.closePath();
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.restore();

  const hdg = ((Math.round(headingDeg) % 360) + 360) % 360;
  const label = `${String(hdg).padStart(3, "0")}°`;
  ctx.font = "600 13px Georgia, serif";
  const pw = ctx.measureText(label).width + 16;
  const py = cy + r * 0.32;
  ctx.beginPath();
  ctx.roundRect(cx - pw / 2, py - 11, pw, 22, 6);
  ctx.fillStyle = "rgba(10, 8, 6, 0.94)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(243, 234, 214, 0.3)";
  ctx.stroke();
  ctx.fillStyle = PAPER;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx, py);
}
