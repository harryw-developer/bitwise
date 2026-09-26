/* Bitwise core: namespace, helpers, generative cover art */
/* BW namespace is created in config.js */

BW.rng = function (seed) {
  let s = typeof seed === "number" ? seed : [...String(seed)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 2166136261);
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};
BW.R = Math.random;
BW.ri = (a, b, r = BW.R) => Math.floor(r() * (b - a + 1)) + a;
BW.pick = (arr, r = BW.R) => arr[Math.floor(r() * arr.length)];
BW.shuffle = (arr, r = BW.R) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
BW.esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/* `code` spans in question text */
BW.fmt = s => BW.esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
BW.onColor = hex => {
  const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  if (!/^#[0-9a-f]{6}$/i.test(hex || "")) return "#FFFFFF";
  const L = lum(hex); return (1.05 / (L + .05)) >= (L + .05) / (lum("#16181B") + .05) ? "#FFFFFF" : "#16181B";
};
BW.bin = (n, w = 8) => n.toString(2).padStart(w, "0");
BW.hex = n => n.toString(16).toUpperCase();

BW.icon = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>',
  down: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  flame: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-3.8 2-5 .3 1.7 1 2.6 2 3 0-3.2-.4-6 1-9z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'
};

/* ---------- generative covers (stand-in for the reference's photos) ---------- */
BW.coverCache = {};
BW.cover = function (key, c1, c2, motif, w = 640, h = 800) {
  const id = key + w + "x" + h;
  if (BW.coverCache[id]) return BW.coverCache[id];
  let url = "";
  try {
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    const g = cv.getContext("2d"), r = BW.rng(key);
    const grd = g.createLinearGradient(0, 0, w * .3, h);
    grd.addColorStop(0, c1); grd.addColorStop(1, c2);
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    // soft sun
    const sx = w * (.25 + r() * .5), sy = h * (.18 + r() * .2);
    const sun = g.createRadialGradient(sx, sy, 0, sx, sy, w * .55);
    sun.addColorStop(0, "rgba(255,255,255,.45)"); sun.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sun; g.fillRect(0, 0, w, h);
    BW.motifs[motif](g, w, h, r);
    // grain
    const img = g.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 18; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    g.putImageData(img, 0, 0);
    url = cv.toDataURL("image/jpeg", .82);
  } catch (e) { url = ""; }
  const css = url ? `url(${url})` : `linear-gradient(160deg,${c1},${c2})`;
  BW.coverCache[id] = css;
  return css;
};

BW.motifs = {
  bits(g, w, h, r) {
    g.font = `700 ${Math.round(w / 16)}px "JetBrains Mono", monospace`;
    for (let y = h * .4; y < h + 40; y += w / 13) for (let x = 0; x < w; x += w / 11) {
      g.fillStyle = `rgba(255,255,255,${(.06 + r() * .35) * (y / h)})`;
      g.fillText(r() > .5 ? "1" : "0", x + r() * 6, y);
    }
  },
  circuit(g, w, h, r) {
    g.lineWidth = 3; g.lineCap = "round";
    for (let i = 0; i < 26; i++) {
      let x = r() * w, y = h * .35 + r() * h * .7;
      g.strokeStyle = `rgba(255,255,255,${.15 + r() * .35})`;
      g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 4; k++) { if (r() > .5) x += (r() - .5) * 180; else y += (r() - .5) * 180; g.lineTo(x, y); }
      g.stroke();
      g.fillStyle = "rgba(255,255,255,.7)"; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill();
    }
    g.fillStyle = "rgba(10,12,14,.35)"; g.fillRect(w * .3, h * .55, w * .4, w * .4);
    g.strokeStyle = "rgba(255,255,255,.6)"; g.strokeRect(w * .3, h * .55, w * .4, w * .4);
  },
  nodes(g, w, h, r) {
    const pts = Array.from({ length: 22 }, () => [r() * w, h * .3 + r() * h * .7]);
    g.strokeStyle = "rgba(255,255,255,.28)"; g.lineWidth = 2;
    pts.forEach((p, i) => pts.forEach((q, j) => { if (j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < w * .33) { g.beginPath(); g.moveTo(...p); g.lineTo(...q); g.stroke(); } }));
    pts.forEach(p => { g.fillStyle = "rgba(255,255,255,.85)"; g.beginPath(); g.arc(p[0], p[1], 4 + r() * 8, 0, 7); g.fill(); });
  },
  bars(g, w, h, r) {
    const n = 14, bw = w / n;
    for (let i = 0; i < n; i++) {
      const bh = h * (.12 + r() * .5);
      g.fillStyle = `rgba(255,255,255,${.12 + r() * .3})`;
      g.fillRect(i * bw + 4, h - bh, bw - 8, bh);
    }
  },
  ridges(g, w, h, r) {
    for (let layer = 0; layer < 4; layer++) {
      g.fillStyle = `rgba(${layer * 18},${layer * 12},${20 + layer * 10},${.18 + layer * .14})`;
      g.beginPath(); g.moveTo(0, h);
      let y = h * (.5 + layer * .1);
      for (let x = 0; x <= w; x += w / 12) { y += (r() - .5) * h * .12; g.lineTo(x, y - (layer === 1 && x > w * .3 && x < w * .6 ? h * .15 * r() : 0)); }
      g.lineTo(w, h); g.fill();
    }
  },
  shield(g, w, h, r) {
    g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 2;
    for (let i = 1; i < 9; i++) { g.beginPath(); g.arc(w / 2, h * .72, i * w * .08, 0, 7); g.stroke(); }
    g.fillStyle = "rgba(255,255,255,.8)";
    g.beginPath(); const cx = w / 2, cy = h * .68, s = w * .16;
    g.moveTo(cx, cy - s); g.lineTo(cx + s * .85, cy - s * .6); g.lineTo(cx + s * .7, cy + s * .4); g.lineTo(cx, cy + s); g.lineTo(cx - s * .7, cy + s * .4); g.lineTo(cx - s * .85, cy - s * .6); g.closePath(); g.fill();
  },
  waves(g, w, h, r) {
    for (let k = 0; k < 7; k++) {
      g.strokeStyle = `rgba(255,255,255,${.12 + k * .06})`; g.lineWidth = 3;
      g.beginPath(); const amp = 20 + r() * 50, f = .01 + r() * .02, ph = r() * 7;
      for (let x = 0; x <= w; x += 6) { const y = h * (.45 + k * .07) + Math.sin(x * f + ph) * amp; x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
    }
  },
  grid(g, w, h, r) {
    const s = w / 10;
    for (let y = h * .35; y < h; y += s) for (let x = 0; x < w; x += s) {
      if (r() > .45) { g.fillStyle = `rgba(255,255,255,${.08 + r() * .3})`; g.beginPath(); g.roundRect ? g.roundRect(x + 4, y + 4, s - 8, s - 8, 8) : g.rect(x + 4, y + 4, s - 8, s - 8); g.fill(); }
    }
  },
  gates(g, w, h, r) {
    g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      const x = r() * w * .7, y = h * .4 + r() * h * .5, s = 50 + r() * 40;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + s * .6, y); g.arc(x + s * .6, y + s / 2, s / 2, -Math.PI / 2, Math.PI / 2); g.lineTo(x, y + s); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(x - 40, y + s * .25); g.lineTo(x, y + s * .25); g.moveTo(x - 40, y + s * .75); g.lineTo(x, y + s * .75); g.moveTo(x + s * 1.1, y + s / 2); g.lineTo(x + s * 1.1 + 50, y + s / 2); g.stroke();
    }
  },
  brackets(g, w, h, r) {
    g.font = `700 ${Math.round(w / 9)}px "JetBrains Mono", monospace`;
    const toks = ["{ }", "( )", "[ ]", "=>", "if", "for", "def", "==", "<>", "++"];
    for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(255,255,255,${.1 + r() * .4})`; g.fillText(BW.pick(toks, r), r() * w * .85, h * .35 + r() * h * .65); }
  }
};

BW.unitCover = (u, w, h) => BW.cover(u.id, u.c1, u.c2, u.motif, w, h);
BW.subCover = (u, s, w = 480, h = 320) => BW.cover(u.id + s.id, u.c1, u.c2, s.motif || u.motif, w, h);
