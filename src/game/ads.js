const CLIENT = String(import.meta.env.VITE_ADSENSE_CLIENT || "ca-pub-6302166317257778").trim();
const SLOT = String(import.meta.env.VITE_ADSENSE_SLOT || "").trim();

export function adsEnabled() {
  return /^ca-pub-\d+$/.test(CLIENT) && /^\d+$/.test(SLOT);
}

export function ensureAds() {
  if (!/^ca-pub-\d+$/.test(CLIENT) || document.getElementById("adsense-sdk")) return;
  const script = document.createElement("script");
  script.id = "adsense-sdk";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(CLIENT)}`;
  document.head.appendChild(script);
}

export function showEndAd(host) {
  if (!host) return;
  if (!adsEnabled()) {
    if (import.meta.env.DEV) {
      host.hidden = false;
      host.replaceChildren();
      const box = document.createElement("div");
      box.className = "ad-placeholder";
      box.textContent = "Ad 300×250";
      host.appendChild(box);
      return;
    }
    host.hidden = true;
    host.replaceChildren();
    return;
  }
  ensureAds();
  host.hidden = false;
  host.replaceChildren();
  const ins = document.createElement("ins");
  ins.className = "adsbygoogle";
  ins.style.display = "inline-block";
  ins.style.width = "300px";
  ins.style.height = "250px";
  ins.setAttribute("data-ad-client", CLIENT);
  ins.setAttribute("data-ad-slot", SLOT);
  host.appendChild(ins);
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    /* AdSense script may still be loading */
  }
}

export function hideEndAd(host) {
  if (!host) return;
  host.hidden = true;
  host.replaceChildren();
}
