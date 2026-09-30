"use strict";
/* ---- src/config.js ---- */
/* Public Firebase web settings. These identify the project and are designed to be public:
   all data access is enforced by the Firestore security rules in firebase/firestore.rules. */
const BW = { units: [], gen: {} };
BW.CONFIG = {
  firebase: {
    apiKey: "AIzaSyDFiQWt-n_K2i2Qw91zifbk9YVokvJHCAY",
    authDomain: "bitwise-1293f.firebaseapp.com",
    projectId: "bitwise-1293f",
    appId: "1:669910761835:web:ccc32a880589399bed4c2e",
    messagingSenderId: "669910761835",
    storageBucket: "bitwise-1293f.firebasestorage.app"
  },
  pupilDomain: "pupils.bitwise.invalid"
};

/* ---- src/core.js ---- */
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

/* ---- src/fx.js ---- */
/* Game feel: synth sound effects and confetti */
BW.pref = (k, v) => { try { if (v === undefined) return localStorage.getItem("bitwise." + k); localStorage.setItem("bitwise." + k, v); } catch (e) { return null; } };
BW.sfx = {
  ctx: null,
  get muted() { return BW.pref("muted") === "1"; },
  toggle() { BW.pref("muted", this.muted ? "0" : "1"); return !this.muted; },
  tone(freq, start, dur, type = "sine", gain = .12) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + start);
    g.gain.setValueAtTime(0, c.currentTime + start);
    g.gain.linearRampToValueAtTime(gain, c.currentTime + start + .01);
    g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + start + dur);
    o.connect(g).connect(c.destination); o.start(c.currentTime + start); o.stop(c.currentTime + start + dur + .02);
  },
  play(name) {
    if (this.muted) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === "suspended") this.ctx.resume();
      const t = (f, s, d, ty, g) => this.tone(f, s, d, ty, g);
      ({
        right: () => { t(660, 0, .12, "triangle"); t(990, .08, .18, "triangle"); },
        wrong: () => { t(180, 0, .22, "sawtooth", .07); t(140, .1, .25, "sawtooth", .06); },
        combo: () => { t(784, 0, .1, "square", .05); t(988, .07, .1, "square", .05); t(1318, .14, .16, "square", .05); },
        hit: () => { t(220, 0, .08, "square", .08); t(110, .05, .15, "triangle", .1); },
        hurt: () => { t(90, 0, .3, "sawtooth", .09); },
        level: () => { [523, 659, 784, 1046].forEach((f, i) => t(f, i * .1, .25, "triangle")); },
        win: () => { [392, 523, 659, 784, 1046, 1318].forEach((f, i) => t(f, i * .08, .3, "triangle", .09)); },
        tick: () => t(1200, 0, .04, "square", .03),
        click: () => t(520, 0, .05, "triangle", .05)
      })[name]?.();
    } catch (e) { }
  }
};

BW.confetti = (n = 140) => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.createElement("canvas"); cv.className = "confetti"; document.body.appendChild(cv);
  const W = cv.width = innerWidth, H = cv.height = innerHeight, g = cv.getContext("2d");
  const cols = ["#F0A35E", "#2F9BB3", "#F15BB5", "#FEE440", "#22C55E", "#6C5CE7", "#FB5607"];
  const ps = Array.from({ length: n }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4, r: Math.random() * 6 + 4, c: BW.pick(cols), a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
  let f = 0;
  (function step() {
    g.clearRect(0, 0, W, H);
    ps.forEach(p => { p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); g.restore(); });
    if (++f < 150) requestAnimationFrame(step); else cv.remove();
  })();
};

/* loading animation: little binary counter (the right-hand bit flips fastest) */
BW.bitLoader = (n = 6, small) => `<span class="bitload ${small ? "sm" : ""}" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<span style="--d:${(0.5 * 2 ** (n - 1 - i)).toFixed(1)}s"><b>0</b><b>1</b></span>`).join("")}</span>`;
BW.splash = text => `<div class="splash" role="status">${BW.bitLoader()}<p class="muted splash-msg">${text}</p></div>`;

BW.modal = (html, onBind) => {
  document.querySelector(".modal-wrap")?.remove();
  const w = document.createElement("div"); w.className = "modal-wrap"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true");
  w.innerHTML = `<div class="modal pop">${html}</div>`;
  document.body.appendChild(w);
  const close = () => w.remove();
  w.addEventListener("click", e => { if (e.target === w || e.target.closest("[data-close]")) close(); });
  document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); } });
  onBind && onBind(w, close);
  w.querySelector("input,button:not([data-close]),select,textarea")?.focus();
  return close;
};

/* Active-time stopwatch: pauses while the tab is hidden, so analytics show real working time */
BW.Clock = class {
  constructor() { this.acc = 0; this.t = performance.now(); this.on = !document.hidden; }
  pause() { if (this.on) { this.acc += performance.now() - this.t; this.on = false; } }
  resume() { if (!this.on && !document.hidden) { this.t = performance.now(); this.on = true; } }
  ms() { return Math.round(this.acc + (this.on ? performance.now() - this.t : 0)); }
};
BW.clocks = new Set();
document.addEventListener("visibilitychange", () => BW.clocks.forEach(c => document.hidden ? c.pause() : c.resume()));

/* ---- src/gen.js ---- */
/* Procedural question generators — every call gives a fresh question */
(function (G) {
  const { ri, pick, shuffle, bin, hex } = BW;
  const inp = (q, answer, norm, why, extra = {}) => ({ type: "input", q, answer: String(answer), norm, why, ...extra });
  const mc = (q, answer, wrongs, why, extra = {}) => {
    const w = [...new Set(wrongs.map(String))].filter(x => x !== String(answer)).slice(0, 3);
    return { type: "mc", q, answer: String(answer), options: shuffle([String(answer), ...w]), why, ...extra };
  };
  const near = (n, spread, count = 3, min = 0) => { const s = new Set(); let g = 0; while (s.size < count && g++ < 99) { const v = n + ri(-spread, spread); if (v !== n && v >= min) s.add(v); } return [...s]; };
  const places = (n, w) => { const p = []; for (let i = w - 1; i >= 0; i--) if (n & (1 << i)) p.push(1 << i); return p.join(" + ") || "0"; };
  const widthFor = d => d === 1 ? 4 : 8;

  G.binToDen = d => { const w = widthFor(d), n = ri(d === 3 ? 128 : 1, (1 << w) - 1), b = bin(n, w);
    return inp(`Convert the ${w}-bit binary number \`${b}\` to denary.`, n, "num", `Add the place values of each 1: ${places(n, w)} = ${n}.`, { pad: "num" }); };
  G.denToBin = d => { const w = widthFor(d), n = ri(1, (1 << w) - 1);
    return inp(`Convert denary ${n} to a ${w}-bit binary number.`, bin(n, w), "bin", `${n} = ${places(n, w)}, so the bits are ${bin(n, w)}.`, { pad: "bin" }); };
  G.hexToDen = d => { const n = d === 1 ? ri(10, 15) : ri(16, 255), h = hex(n);
    const why = n < 16 ? `A=10, B=11, C=12, D=13, E=14, F=15, so ${h} = ${n}.` : `${h[0]} × 16 + ${h[1]} = ${parseInt(h[0], 16) * 16} + ${parseInt(h[1], 16)} = ${n}.`;
    return inp(`Convert hexadecimal \`${h}\` to denary.`, n, "num", why, { pad: "num" }); };
  G.denToHex = d => { const n = d === 1 ? ri(10, 15) : ri(16, 255), h = hex(n);
    const why = n < 16 ? `${n} is a single hex digit: ${h}.` : `${n} DIV 16 = ${n >> 4} (${hex(n >> 4)}), remainder ${n & 15} (${hex(n & 15)}), so ${h}.`;
    return inp(`Convert denary ${n} to hexadecimal.`, h, "hex", why, { pad: "hex" }); };
  G.binToHex = d => { const n = ri(d === 1 ? 1 : 17, 255), b = bin(n);
    return inp(`Convert the binary number \`${b}\` to hexadecimal.`, hex(n).padStart(2, "0"), "hex", `Split into nibbles: ${b.slice(0, 4)} = ${hex(n >> 4)} and ${b.slice(4)} = ${hex(n & 15)}.`, { pad: "hex" }); };
  G.hexToBin = d => { const n = ri(d === 1 ? 16 : 100, 255), h = hex(n);
    return inp(`Convert hexadecimal \`${h}\` to 8-bit binary.`, bin(n), "bin", `Each hex digit becomes 4 bits: ${h[0]} = ${bin(n >> 4, 4)}, ${h[1]} = ${bin(n & 15, 4)}.`, { pad: "bin" }); };

  G.binAdd = d => {
    if (d === 3 && Math.random() < .5) { const a = ri(100, 220), b = ri(40, 200), ov = a + b > 255;
      return mc(`Adding \`${bin(a)}\` and \`${bin(b)}\` in an 8-bit register. What happens?`, ov ? "An overflow error occurs" : "No overflow; the result fits in 8 bits",
        [ov ? "No overflow; the result fits in 8 bits" : "An overflow error occurs", "The result becomes negative", "The CPU rounds the result down"],
        `${a} + ${b} = ${a + b}. The largest 8-bit value is 255, so ${ov ? "a 9th bit is needed: overflow." : "it fits."}`); }
    const w = d === 1 ? 4 : 8; let a, b; do { a = ri(1, (1 << w) - 2); b = ri(1, (1 << w) - 2); } while (a + b > (1 << w) - 1);
    return inp(`Add these ${w}-bit binary numbers. Give a ${w}-bit answer.`, bin(a + b, w), "bin", `${a} + ${b} = ${a + b}, which is ${bin(a + b, w)}. Remember 1 + 1 = 0 carry 1, and 1 + 1 + 1 = 1 carry 1.`, { pre: `  ${bin(a, w)}\n+ ${bin(b, w)}`, pad: "bin" });
  };
  G.shift = d => {
    if (d === 3 && Math.random() < .5) { const n = ri(1, 3), left = Math.random() < .5, f = 1 << n;
      return mc(`What is the effect of a ${left ? "left" : "right"} binary shift of ${n} place${n > 1 ? "s" : ""}?`, `${left ? "Multiplies" : "Divides"} by ${f}`, [`${left ? "Divides" : "Multiplies"} by ${f}`, `${left ? "Multiplies" : "Divides"} by ${n * 2 + (n === 2 ? 2 : 1)}`, `Adds ${f}`],
        `Each place shifted ${left ? "left doubles" : "right halves"} the value, so ${n} place${n > 1 ? "s" : ""} is × or ÷ 2^${n} = ${f}.`); }
    const left = Math.random() < .5, n = d === 1 ? 1 : ri(1, 3);
    const v = left ? ri(1, 255 >> n) : ri(8, 255), r = left ? (v << n) & 255 : v >> n;
    return inp(`Apply a ${left ? "left" : "right"} shift of ${n} place${n > 1 ? "s" : ""} to \`${bin(v)}\`. Give the 8-bit result.`, bin(r), "bin",
      `Move every bit ${n} place${n > 1 ? "s" : ""} ${left ? "left" : "right"} and fill the gap with 0s: ${bin(r)}. ${left ? "Multiplied" : "Divided"} by ${1 << n}: ${v} → ${r}${!left && v % (1 << n) ? " (bits shifted off the end are lost, so it rounds down)" : ""}.`, { pad: "bin" });
  };

  const U = ["bytes", "KB", "MB", "GB", "TB"];
  G.units = d => {
    if (d === 1) { const t = pick([["nibble", "bits", 4], ["byte", "bits", 8], ["byte", "nibbles", 2]]), k = ri(2, 9);
      return inp(`How many ${t[1]} are in ${k} ${t[0]}s?`, k * t[2], "num", `1 ${t[0]} = ${t[2]} ${t[1]}, so ${k} × ${t[2]} = ${k * t[2]}.`, { pad: "num" }); }
    const i = ri(1, 4), k = ri(2, d === 3 ? 900 : 9), down = Math.random() < .5;
    if (down) return inp(`How many ${U[i - 1]} are in ${k} ${U[i]}? (Use 1000.)`, k * 1000, "num", `Each step down the scale is × 1000: ${k} × 1000 = ${k * 1000}.`, { pad: "num" });
    return inp(`Convert ${k * 1000} ${U[i - 1]} to ${U[i]}. (Use 1000.)`, k, "num", `Each step up the scale is ÷ 1000: ${k * 1000} ÷ 1000 = ${k}.`, { pad: "num" });
  };
  G.colours = d => { const n = ri(1, d === 1 ? 4 : 10);
    if (Math.random() < .5) return inp(`How many different colours can be shown with a colour depth of ${n} bit${n > 1 ? "s" : ""}?`, 2 ** n, "num", `n bits give 2^n combinations: 2^${n} = ${2 ** n}.`, { pad: "num" });
    const c = ri(2 ** (n - 1) + 1, 2 ** n);
    return inp(`What is the minimum colour depth (bits per pixel) needed for ${c} colours?`, n, "num", `2^${n} = ${2 ** n} is the first power of 2 ≥ ${c}${n > 1 ? ` (2^${n - 1} = ${2 ** (n - 1)} is too few)` : ""}.`, { pad: "num" });
  };
  G.imageSize = d => { const w = pick(d === 1 ? [4, 8, 10] : [20, 40, 50, 100, 200, 400, 800]), h = pick(d === 1 ? [4, 5, 8] : [10, 25, 40, 100, 200, 500]), cd = pick(d === 1 ? [1, 2, 4] : [4, 8, 16, 24]);
    const bits = w * h * cd;
    if (d === 1) return inp(`An image is ${w} × ${h} pixels with a colour depth of ${cd} bit${cd > 1 ? "s" : ""}. What is its size in bits?`, bits, "num", `Size = width × height × colour depth = ${w} × ${h} × ${cd} = ${bits} bits.`, { pad: "num" });
    if (d === 2) return inp(`An image is ${w} × ${h} pixels with a colour depth of ${cd} bits. What is its size in bytes?`, bits / 8, "num", `${w} × ${h} × ${cd} = ${bits} bits. ÷ 8 = ${bits / 8} bytes.`, { pad: "num" });
    return inp(`An image is ${w} × ${h} pixels with a colour depth of ${cd} bits. What is its size in KB? (1 KB = 1000 bytes)`, +(bits / 8000).toFixed(3), "num", `${w} × ${h} × ${cd} = ${bits} bits → ÷ 8 = ${bits / 8} bytes → ÷ 1000 = ${+(bits / 8000).toFixed(3)} KB.`, { pad: "num" });
  };
  G.soundSize = d => { const sr = pick(d === 1 ? [100, 200, 500, 1000] : [8000, 11000, 22000, 44100, 48000]), bd = pick([8, 16, 24]), s = ri(1, d === 3 ? 60 : 10);
    const bits = sr * bd * s;
    if (d < 3) return inp(`A sound is recorded for ${s} second${s > 1 ? "s" : ""} at ${sr} Hz with a bit depth of ${bd}. What is the file size in ${d === 1 ? "bits" : "bytes"}?`, d === 1 ? bits : bits / 8, "num", `Size = sample rate × bit depth × seconds = ${sr} × ${bd} × ${s} = ${bits} bits${d === 2 ? ` ÷ 8 = ${bits / 8} bytes` : ""}.`, { pad: "num" });
    return inp(`A ${s}-second recording at ${sr} Hz with ${bd}-bit samples. What is the size in KB? (1 KB = 1000 bytes)`, +(bits / 8000).toFixed(3), "num", `${sr} × ${bd} × ${s} = ${bits} bits → ${bits / 8} bytes → ${+(bits / 8000).toFixed(3)} KB.`, { pad: "num" });
  };
  G.ascii = d => { const up = d !== 2, i = ri(1, 25), base = up ? 65 : 97, ch = String.fromCharCode(base + i);
    if (d === 3) return inp(`The ASCII code for \`A\` is 65. What is the 8-bit binary code for \`${ch}\`?`, bin(base + i), "bin", `${ch} is ${i} letters after A, so ${65 + i}, which is ${bin(65 + i)}.`, { pad: "bin" });
    return inp(`The ASCII code for \`${up ? "A" : "a"}\` is ${base}. What is the code for \`${ch}\`?`, base + i, "num", `Letters are in order, so ${ch} = ${base} + ${i} = ${base + i}.`, { pad: "num" }); };
  G.charBits = d => { const t = pick([["7-bit ASCII", 128, 7], ["extended 8-bit ASCII", 256, 8]]);
    if (d === 1) return inp(`How many different characters can ${t[0]} represent?`, t[1], "num", `2^${t[2]} = ${t[1]}.`, { pad: "num" });
    const n = ri(10, 3000), b = Math.ceil(Math.log2(n));
    return inp(`A character set must represent ${n} different characters. What is the minimum number of bits per character?`, b, "num", `2^${b} = ${2 ** b} ≥ ${n}, but 2^${b - 1} = ${2 ** (b - 1)} is not enough.`, { pad: "num" }); };
  G.textSize = d => { const n = ri(10, 400), bpc = pick([7, 8, 16]);
    return inp(`A message has ${n} characters stored using ${bpc} bits per character. How many bits is that?`, n * bpc, "num", `${n} × ${bpc} = ${n * bpc} bits.`, { pad: "num" }); };

  /* Boolean logic */
  const OPS = { AND: (a, b) => a & b, OR: (a, b) => a | b };
  const exprPool = [
    ["A AND B", (a, b) => a & b], ["A OR B", (a, b) => a | b], ["NOT A", a => 1 - a], ["NOT (A AND B)", (a, b) => 1 - (a & b)],
    ["NOT (A OR B)", (a, b) => 1 - (a | b)], ["A AND NOT B", (a, b) => a & (1 - b)], ["NOT A OR B", (a, b) => (1 - a) | b], ["(A OR B) AND NOT A", (a, b) => (a | b) & (1 - a)]
  ];
  const expr3 = [
    ["(A AND B) OR C", (a, b, c) => (a & b) | c], ["A AND (B OR C)", (a, b, c) => a & (b | c)], ["NOT (A OR B) AND C", (a, b, c) => (1 - (a | b)) & c],
    ["(A OR B) AND NOT C", (a, b, c) => (a | b) & (1 - c)], ["NOT A AND (B OR C)", (a, b, c) => (1 - a) & (b | c)], ["(A AND NOT B) OR (B AND C)", (a, b, c) => (a & (1 - b)) | (b & c)]
  ];
  G.logicEval = d => { const three = d === 3, e = three ? pick(expr3) : pick(d === 1 ? exprPool.slice(0, 3) : exprPool);
    const a = ri(0, 1), b = ri(0, 1), c = ri(0, 1), out = e[1](a, b, c);
    return mc(`If A = ${a}, B = ${b}${three ? `, C = ${c}` : ""}, what is the output of \`${e[0]}\`?`, out, [1 - out], `Substitute the values and work inside brackets first: the result is ${out}.`); };
  G.truthTable = d => { const three = d === 3, e = three ? pick(expr3) : pick(d === 1 ? exprPool.slice(0, 2).concat([exprPool[3], exprPool[4]]) : exprPool.filter(x => x[1].length === 2));
    const rows = three ? 8 : 4, n = three ? 3 : 2; let col = "", tbl = (three ? "A B C | Q\n" : "A B | Q\n");
    for (let i = 0; i < rows; i++) { const v = bin(i, n).split("").map(Number), o = e[1](...v); col += o; tbl += v.join(" ") + " | ?\n"; }
    return inp(`Complete the output column Q for \`Q = ${e[0]}\`. Type the ${rows} output bits from top to bottom.`, col, "bits", `The output column is ${col.split("").join(", ")}.`, { pre: tbl.trim(), pad: "bin" }); };

  /* Algorithms */
  G.linearSearch = d => { const len = d === 1 ? 6 : 9, arr = shuffle(Array.from({ length: 40 }, (_, i) => i + 3)).slice(0, len), idx = ri(0, len - 1), t = arr[idx];
    return inp(`A linear search looks for ${t} in the list below. How many items are checked (compared) before it is found?`, idx + 1, "num", `Linear search checks items one by one from the start. ${t} is item ${idx + 1}, so ${idx + 1} comparisons.`, { pre: `[${arr.join(", ")}]`, pad: "num" }); };
  G.binarySearch = d => { const len = pick(d === 1 ? [7, 9] : [9, 11, 13, 15]), arr = Array.from({ length: 30 }, (_, i) => i * 3 + ri(1, 2)).slice(0, len).sort((a, b) => a - b);
    let lo = 0, hi = len - 1; const seq = [], t = pick(arr);
    while (lo <= hi) { const m = (lo + hi) >> 1; seq.push(arr[m]); if (arr[m] === t) break; if (arr[m] < t) lo = m + 1; else hi = m - 1; }
    const pre = `[${arr.join(", ")}]  (indexes 0 to ${len - 1})`;
    if (d === 1) return inp(`A binary search looks for ${t}. Which value is checked first? (Middle = (low + high) DIV 2)`, seq[0], "num", `Middle index = (0 + ${len - 1}) DIV 2 = ${(len - 1) >> 1}, which holds ${seq[0]}.`, { pre, pad: "num" });
    if (d === 2 && seq.length > 1) return inp(`A binary search looks for ${t}. Which value is checked second? (Middle = (low + high) DIV 2)`, seq[1], "num", `Checks in order: ${seq.join(" → ")}.`, { pre, pad: "num" });
    return inp(`A binary search looks for ${t}. How many values are checked in total? (Middle = (low + high) DIV 2)`, seq.length, "num", `Values checked: ${seq.join(" → ")} — that is ${seq.length}.`, { pre, pad: "num" }); };
  G.bubblePass = d => { const arr = shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, d === 1 ? 5 : 6), a = arr.slice();
    const passes = d === 3 ? 2 : 1;
    for (let p = 0; p < passes; p++) for (let i = 0; i < a.length - 1 - p; i++) if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]];
    return inp(`Show the list after ${passes === 1 ? "the first pass" : "two passes"} of a bubble sort (ascending). Separate numbers with commas.`, a.join(","), "list", `Compare neighbours and swap if the left is bigger. After ${passes === 1 ? "one pass the largest value has bubbled to the end" : "two passes the two largest are in place"}: ${a.join(", ")}.`, { pre: `[${arr.join(", ")}]` }); };
  G.insertionPass = d => { const arr = shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 6), k = d === 1 ? 1 : d === 2 ? 2 : 3, a = arr.slice();
    for (let i = 1; i <= k; i++) { const v = a[i]; let j = i - 1; while (j >= 0 && a[j] > v) { a[j + 1] = a[j]; j--; } a[j + 1] = v; }
    return inp(`An insertion sort (ascending) starts on this list. Show the list after the first ${k} item${k > 1 ? "s have" : " has"} been inserted (i.e. after ${k} pass${k > 1 ? "es" : ""}). Use commas.`, a.join(","), "list", `Each pass takes the next item and slides it left into the sorted part: ${a.join(", ")}.`, { pre: `[${arr.join(", ")}]` }); };

  /* Programming */
  G.arith = d => { const a = ri(10, 60), b = ri(2, 9);
    const t = d === 1 ? pick(["MOD", "DIV"]) : d === 2 ? pick(["MOD", "DIV", "^"]) : "combo";
    if (t === "MOD") return inp(`What is \`${a} MOD ${b}\`?`, a % b, "num", `MOD gives the remainder: ${a} ÷ ${b} = ${Math.floor(a / b)} remainder ${a % b}.`, { pad: "num" });
    if (t === "DIV") return inp(`What is \`${a} DIV ${b}\`?`, Math.floor(a / b), "num", `DIV gives the whole-number part: ${a} ÷ ${b} = ${Math.floor(a / b)} remainder ${a % b}.`, { pad: "num" });
    if (t === "^") { const x = ri(2, 5), y = ri(2, 4); return inp(`What is \`${x} ^ ${y}\`?`, x ** y, "num", `^ is exponent: ${x} to the power ${y} = ${x ** y}.`, { pad: "num" }); }
    const r = (Math.floor(a / 3)) % 4; return inp(`What is \`(${a} DIV 3) MOD 4\`?`, r, "num", `${a} DIV 3 = ${Math.floor(a / 3)}, then ${Math.floor(a / 3)} MOD 4 = ${r}.`, { pad: "num" }); };
  G.traceLoop = d => {
    if (d === 1) { const n = ri(3, 7); let t = 0; for (let i = 1; i <= n; i++) t += i;
      return inp("What is printed?", t, "num", `total becomes 1 + 2 + … + ${n} = ${t}.`, { pre: `total = 0\nfor i = 1 to ${n}\n    total = total + i\nnext i\nprint(total)`, pad: "num" }); }
    if (d === 2) { const n = ri(2, 5), m = ri(2, 3); let x = 1; for (let i = 0; i < n; i++) x *= m;
      return inp("What is printed?", x, "num", `x is multiplied by ${m}, ${n} times: ${m}^${n} = ${x}.`, { pre: `x = 1\nfor i = 1 to ${n}\n    x = x * ${m}\nnext i\nprint(x)`, pad: "num" }); }
    const s = ri(40, 200); let v = s, c = 0; while (v > 1) { v = Math.floor(v / 2); c++; }
    return inp("What is printed?", c, "num", `Keep halving (DIV 2) until value is 1: that takes ${c} steps.`, { pre: `value = ${s}\ncount = 0\nwhile value > 1\n    value = value DIV 2\n    count = count + 1\nendwhile\nprint(count)`, pad: "num" });
  };
  const WORDS = ["COMPUTER", "NETWORK", "BINARY", "KEYBOARD", "ALGORITHM", "PROGRAM", "HARDWARE", "VARIABLE", "PROTOCOL", "MEMORY"];
  G.strings = d => { const w = pick(WORDS);
    if (d === 1) return inp(`\`word = "${w}"\` — what does \`word.length\` return?`, w.length, "num", `"${w}" has ${w.length} characters.`, { pad: "num" });
    if (d === 2) { const s = ri(0, 3), n = ri(2, 4); return inp(`\`word = "${w}"\`. In OCR Exam Reference Language, what does \`word.substring(${s}, ${n})\` return? (start index ${s}, ${n} characters, first index is 0)`, w.substr(s, n), "text", `Start at index ${s} ("${w[s]}") and take ${n} characters: ${w.substr(s, n)}.`); }
    const s = ri(1, 3), e = s + ri(2, 3); return inp(`In Python, \`word = "${w}"\`. What does \`word[${s}:${e}]\` give?`, w.slice(s, e), "text", `Slicing takes index ${s} up to but not including ${e}: ${w.slice(s, e)}.`); };
  G.arrays = d => { const arr = Array.from({ length: 6 }, () => ri(1, 50));
    if (d === 1) { const i = ri(0, 5); return inp(`What is printed? (Arrays are zero-indexed.)`, arr[i], "num", `Index ${i} is the ${i + 1}${["st", "nd", "rd"][i] || "th"} item: ${arr[i]}.`, { pre: `scores = [${arr.join(", ")}]\nprint(scores[${i}])`, pad: "num" }); }
    if (d === 2) { const g = [[ri(1, 9), ri(1, 9), ri(1, 9)], [ri(1, 9), ri(1, 9), ri(1, 9)], [ri(1, 9), ri(1, 9), ri(1, 9)]], r = ri(0, 2), c = ri(0, 2);
      return inp(`What is printed? (\`grid[row][column]\`, zero-indexed)`, g[r][c], "num", `Row ${r} is [${g[r].join(", ")}]; column ${c} of it is ${g[r][c]}.`, { pre: `grid = [[${g[0].join(", ")}],\n        [${g[1].join(", ")}],\n        [${g[2].join(", ")}]]\nprint(grid[${r}][${c}])`, pad: "num" }); }
    const lim = ri(15, 35), c = arr.filter(x => x > lim).length;
    return inp("What is printed?", c, "num", `Count the items greater than ${lim}: ${arr.filter(x => x > lim).join(", ") || "none"} → ${c}.`, { pre: `nums = [${arr.join(", ")}]\ncount = 0\nfor i = 0 to 5\n    if nums[i] > ${lim} then\n        count = count + 1\n    endif\nnext i\nprint(count)`, pad: "num" }); };
  const DT = [["42", "Integer"], ["-7", "Integer"], ["3.14", "Real / float"], ["0.5", "Real / float"], ["True", "Boolean"], ["False", "Boolean"], ["'Q'", "Character"], ['"Hello"', "String"], ['"07700 900123"', "String"], ['"2024"', "String"], ["19.99", "Real / float"], ["1000", "Integer"]];
  G.dataType = () => { const t = pick(DT); return mc(`Which data type is the value \`${t[0]}\`?`, t[1], ["Integer", "Real / float", "Boolean", "Character", "String"], t[0].startsWith('"') ? "Anything inside double quotes is a string, even if it looks like a number." : `\`${t[0]}\` is a ${t[1].toLowerCase()}.`); };
  G.sqlRows = d => { const names = shuffle(["Ava", "Ben", "Cal", "Dia", "Eli", "Fay", "Gus", "Hana"]).slice(0, 6);
    const rows = names.map(n => ({ name: n, age: ri(14, 17), house: pick(["Red", "Blue", "Green"]) }));
    const cond = d === 1 ? ["house", "=", pick(["Red", "Blue", "Green"])] : ["age", pick([">", "<", ">=", "<="]), ri(15, 16)];
    const test = r => { const v = r[cond[0]], c = cond[2]; return cond[1] === "=" ? v === c : cond[1] === ">" ? v > c : cond[1] === "<" ? v < c : cond[1] === ">=" ? v >= c : v <= c; };
    let match = rows.filter(test);
    if (d === 3) { const h = pick(["Red", "Blue", "Green"]); match = match.filter(r => r.house === h); cond.push(h); }
    const where = `${cond[0]} ${cond[1]} ${typeof cond[2] === "string" ? `"${cond[2]}"` : cond[2]}${cond[3] ? ` AND house = "${cond[3]}"` : ""}`;
    const pre = "Students\nname | age | house\n" + rows.map(r => `${r.name.padEnd(4)} | ${r.age}  | ${r.house}`).join("\n") + `\n\nSELECT name FROM Students\nWHERE ${where}`;
    return inp("How many records does this query return?", match.length, "num", `Matching: ${match.map(r => r.name).join(", ") || "none"}.`, { pre, pad: "num" }); };
  G.ipv4 = () => { const ok = Math.random() < .5; let p = [ri(1, 223), ri(0, 255), ri(0, 255), ri(1, 254)], why = "Four numbers, each 0–255, separated by dots: valid.";
    if (!ok) { const k = ri(0, 2); if (k === 0) { p[ri(0, 3)] = ri(256, 399); why = "Each part must be 0–255; one is too big."; } else if (k === 1) { p = p.slice(0, 3); why = "An IPv4 address needs exactly four parts."; } else { p.push(ri(1, 254)); why = "An IPv4 address has four parts, not five."; } }
    return mc(`Is \`${p.join(".")}\` a valid IPv4 address?`, ok ? "Valid" : "Not valid", [ok ? "Not valid" : "Valid"], why); };
  G.testData = () => { const lo = ri(1, 20), hi = lo + ri(20, 80), k = pick(["normal", "boundary", "invalid", "erroneous"]);
    const v = k === "normal" ? ri(lo + 2, hi - 2) : k === "boundary" ? pick([lo, hi]) : k === "invalid" ? pick([lo - ri(1, 9), hi + ri(1, 9)]) : pick(['"ten"', '"abc"', '"?"', '""']);
    const name = { normal: "Normal", boundary: "Boundary", invalid: "Invalid", erroneous: "Erroneous" }[k];
    const why = { normal: "It is sensible data well inside the range.", boundary: "It is exactly at the edge of the allowed range.", invalid: "It is the right data type but outside the allowed range.", erroneous: "It is the wrong data type entirely." }[k];
    return mc(`A program accepts whole numbers from ${lo} to ${hi} inclusive. What type of test data is ${v}?`, name, ["Normal", "Boundary", "Invalid", "Erroneous"], why); };
})(BW.gen);

/* ---- src/data-1.js ---- */
/* Unit data format: bank rows are [difficulty 1-3, question, correct answer, [wrong answers], explanation] */
BW.units.push({
  id: "arch", title: "Systems Architecture", paper: 1, c1: "#2F9BB3", c2: "#F0A35E", motif: "circuit",
  blurb: "What the CPU is for, how it runs the fetch–decode–execute cycle, the registers and components inside it, what makes it faster, and where embedded systems fit in.",
  subs: [
    { id: "cpu", title: "The CPU & von Neumann", motif: "circuit",
      notes: ["The CPU processes data and instructions by repeatedly carrying out the fetch–decode–execute cycle.", "In von Neumann architecture, data and instructions are stored together in the same memory.", "The ALU does arithmetic and logic; the Control Unit (CU) decodes instructions and sends control signals.", "Cache is small, very fast memory inside or near the CPU that holds frequently used data and instructions."],
      bank: [
        [1, "What does CPU stand for?", "Central Processing Unit", ["Computer Processing Unit", "Central Program Utility", "Core Processing Unit"], "CPU = Central Processing Unit."],
        [1, "What is the main purpose of the CPU?", "To process data and instructions", ["To store files permanently", "To display output on screen", "To connect to the internet"], "The CPU fetches, decodes and executes instructions to process data."],
        [1, "Which part of the CPU performs calculations and logical comparisons?", "ALU", ["Control Unit", "Cache", "Program Counter"], "The Arithmetic Logic Unit does maths and logic operations."],
        [1, "Which part of the CPU decodes instructions and sends control signals?", "Control Unit", ["ALU", "Accumulator", "Cache"], "The CU coordinates the CPU and decodes instructions."],
        [1, "What is cache?", "Small, fast memory in or near the CPU", ["Secondary storage", "A type of ROM", "A register that holds the next address"], "Cache stores frequently used data/instructions so the CPU can access them quickly."],
        [2, "In von Neumann architecture, where are program instructions stored?", "In the same memory as data", ["In a separate instruction memory", "Only in cache", "On the hard disk only"], "Von Neumann uses a single shared memory for both data and instructions."],
        [2, "Why is cache faster to access than RAM?", "It is physically closer to the CPU and uses faster memory", ["It has a larger capacity than RAM", "It is non-volatile", "It is stored on the hard drive"], "Cache is on/near the CPU die and made of faster (more expensive) memory."],
        [2, "Which statement about the ALU is true?", "It stores the result of calculations in the accumulator", ["It holds the address of the next instruction", "It fetches instructions from memory", "It stores the operating system"], "Results from the ALU are placed in the accumulator."],
        [2, "Why is cache kept small?", "It is expensive to make", ["Larger cache is always slower to fetch the next address", "It is volatile", "The OS cannot use more"], "Cache memory is costly, so it is small in capacity."],
        [3, "Which best describes the 'stored program concept'?", "Instructions are stored in memory and fetched and executed one at a time", ["Programs are permanently stored in the CPU", "Programs run directly from secondary storage", "Each program has its own CPU"], "Von Neumann's key idea: program instructions live in main memory alongside data."],
        [3, "Which CPU component would handle comparing two numbers to see if one is larger?", "ALU", ["CU", "MAR", "MDR"], "Comparisons are logical operations, done by the ALU."],
        [3, "A CPU fetches an instruction and data from the same memory. Which architecture is this?", "Von Neumann", ["Harvard", "Cloud", "Peer-to-peer"], "Shared memory for data and instructions = von Neumann."]
      ] },
    { id: "registers", title: "Registers", motif: "grid",
      notes: ["Program Counter (PC): holds the address of the next instruction to be fetched.", "Memory Address Register (MAR): holds the address currently being read from or written to.", "Memory Data Register (MDR): holds the data or instruction just fetched, or about to be written.", "Accumulator (ACC): holds the results of calculations from the ALU."],
      bank: [
        [1, "Which register holds the address of the next instruction?", "Program Counter", ["Accumulator", "MDR", "MAR"], "The PC always points to the next instruction to fetch."],
        [1, "Which register stores the results of calculations?", "Accumulator", ["Program Counter", "MAR", "Cache"], "The ACC holds ALU results."],
        [1, "What does MAR stand for?", "Memory Address Register", ["Main Access Register", "Memory Allocation Register", "Master Address Router"], "MAR = Memory Address Register."],
        [1, "What does MDR stand for?", "Memory Data Register", ["Main Data Router", "Memory Decode Register", "Maximum Data Rate"], "MDR = Memory Data Register."],
        [2, "Which register holds the data that has just been fetched from memory?", "MDR", ["MAR", "PC", "CU"], "Fetched data or instructions arrive in the MDR."],
        [2, "Which register holds the address of the memory location being accessed?", "MAR", ["MDR", "Accumulator", "PC"], "The MAR holds the address to read from or write to."],
        [2, "What is a register?", "A tiny, very fast storage location inside the CPU", ["A type of secondary storage", "A section of RAM used by the OS", "A list of installed programs"], "Registers are the fastest memory, inside the CPU."],
        [2, "The PC contains 7. After the instruction is fetched, what will it usually contain?", "8", ["7", "6", "0"], "The PC is incremented by 1 during fetch."],
        [3, "During the fetch stage, the contents of which register are copied into the MAR?", "Program Counter", ["Accumulator", "MDR", "ALU"], "The address in the PC is copied to the MAR first."],
        [3, "An instruction says 'store the result at address 20'. Which register holds 20 during the write?", "MAR", ["MDR", "PC", "Accumulator"], "The MAR holds the address; the MDR holds the data being written."],
        [3, "Which pair of registers are used directly when communicating with main memory?", "MAR and MDR", ["PC and ACC", "ACC and CU", "PC and ALU"], "The MAR sends the address, the MDR sends/receives the data."]
      ] },
    { id: "fde", title: "Fetch–Decode–Execute", motif: "waves",
      notes: ["Fetch: the address in the PC is copied to the MAR, the instruction at that address is copied into the MDR, and the PC is incremented.", "Decode: the Control Unit works out what the instruction means.", "Execute: the instruction is carried out, e.g. the ALU does a calculation or data is loaded or stored.", "The cycle repeats billions of times per second."],
      bank: [
        [1, "What are the three stages of the CPU cycle, in order?", "Fetch, decode, execute", ["Decode, fetch, execute", "Execute, fetch, decode", "Fetch, execute, decode"], "Fetch → decode → execute, then repeat."],
        [1, "Which component decodes an instruction?", "Control Unit", ["ALU", "MDR", "RAM"], "The CU decodes instructions."],
        [1, "In which stage is an instruction copied from memory into the CPU?", "Fetch", ["Decode", "Execute", "Store"], "Fetch brings the instruction from RAM."],
        [2, "What happens to the Program Counter during the fetch stage?", "It is incremented by 1", ["It is reset to 0", "It is copied to the accumulator", "Nothing"], "PC + 1 so it points at the next instruction."],
        [2, "Where is the fetched instruction first held in the CPU?", "MDR", ["MAR", "PC", "ALU"], "The instruction travels from memory into the MDR."],
        [2, "Which stage might involve the ALU adding two numbers?", "Execute", ["Fetch", "Decode", "Boot"], "Calculations happen during execute."],
        [3, "Put the fetch stage steps in order: (1) PC incremented, (2) PC copied to MAR, (3) instruction copied to MDR.", "2, 3, 1", ["1, 2, 3", "3, 2, 1", "2, 1, 3"], "PC → MAR, memory → MDR, then PC incremented. (The increment can overlap, but it comes after the address is copied.)"],
        [3, "Why is the PC incremented during fetch rather than after execute?", "So it already points at the next instruction, ready for the next cycle", ["To clear the MDR", "To reset the ALU", "It is required by the ALU"], "Incrementing early prepares the next fetch."],
        [3, "An instruction is a jump (branch). What does execute do to the PC?", "Loads it with the jump address", ["Increments it twice", "Sets it to 0", "Copies it into the MDR"], "Branches change the PC to a new address."],
        [2, "What is transferred along the address bus during fetch?", "The address of the instruction", ["The instruction itself", "The result of the ALU", "Control signals only"], "Addresses go on the address bus; data on the data bus."]
      ] },
    { id: "perf", title: "CPU Performance", motif: "bars",
      notes: ["Clock speed: the number of FDE cycles per second, measured in hertz (e.g. 3.5 GHz = 3.5 billion cycles/second).", "Cores: each core can process instructions independently; more cores can mean more work at once, but not all programs can split tasks.", "Cache size: more cache means more data can be held close to the CPU, so fewer slower trips to RAM.", "Doubling cores doesn't double performance: some tasks depend on each other and cores must share resources."],
      bank: [
        [1, "What is clock speed measured in?", "Hertz (Hz)", ["Bytes", "Bits per second", "Watts"], "Clock speed = cycles per second, in Hz (usually GHz)."],
        [1, "A CPU runs at 3 GHz. How many cycles per second is that?", "3 billion", ["3 million", "3 thousand", "300 million"], "Giga = billion, so 3 GHz = 3,000,000,000 cycles per second."],
        [1, "What is a core?", "An independent processing unit within a CPU", ["A type of RAM", "The CPU's cooling fan", "A section of the hard drive"], "Each core can fetch, decode and execute on its own."],
        [2, "Why might doubling the number of cores not double performance?", "Some programs can't split their tasks across cores", ["Cores slow each other's clock speed by half", "More cores reduce cache to zero", "The OS can only use one core"], "Tasks that depend on previous results must run in sequence."],
        [2, "How does a larger cache improve performance?", "More frequently used data can be accessed without going to RAM", ["It increases clock speed", "It adds more cores", "It makes RAM non-volatile"], "Fewer slow RAM accesses = faster."],
        [2, "Which change would most directly increase the number of instructions processed per second on a single core?", "Increasing the clock speed", ["Adding more secondary storage", "Adding a bigger monitor", "Installing a new browser"], "Higher clock speed = more cycles per second."],
        [3, "What is a disadvantage of increasing clock speed (overclocking)?", "The CPU produces more heat", ["The CPU gets fewer cores", "Cache becomes volatile", "RAM becomes smaller"], "Higher speeds generate more heat and may be unstable."],
        [3, "A game uses one main thread. Which upgrade helps it most?", "A faster clock speed", ["Going from 8 to 16 cores", "A bigger hard drive", "More USB ports"], "Single-threaded work benefits from faster cores, not more of them."],
        [3, "Which three characteristics affect CPU performance?", "Clock speed, cache size, number of cores", ["RAM, ROM, virtual memory", "Screen size, battery, keyboard", "Bus width, fan speed, case size"], "The spec lists clock speed, cache size and number of cores."],
        [2, "Cache comes in levels. Which is fastest?", "Level 1", ["Level 2", "Level 3", "They are all the same speed"], "L1 is smallest and fastest; L3 is larger and slower."]
      ] },
    { id: "embedded", title: "Embedded Systems", motif: "grid",
      notes: ["An embedded system is a computer system built into a larger device to perform a dedicated function.", "Examples: washing machines, microwaves, car engine management, traffic lights, smart thermostats.", "They are usually small, low-power, cheap to produce and reliable.", "Their programs are usually stored in ROM/flash and are rarely changed by the user."],
      bank: [
        [1, "What is an embedded system?", "A computer system inside a larger device with a dedicated function", ["A general-purpose desktop PC", "A cloud storage service", "A program embedded in a web page"], "Embedded = built in, single purpose."],
        [1, "Which is an example of an embedded system?", "A washing machine controller", ["A laptop", "A smartphone app store", "A web server farm"], "The washing machine's controller does one job."],
        [1, "Which is NOT usually an embedded system?", "A gaming PC", ["A microwave", "A digital watch", "A car's ABS controller"], "A gaming PC is general-purpose."],
        [2, "Give a typical characteristic of an embedded system.", "Low power consumption", ["Needs a large monitor", "Runs many different user programs", "Very large storage"], "They are designed to be small and efficient."],
        [2, "Where is an embedded system's program usually stored?", "ROM / flash memory", ["Optical disc", "Cloud storage", "Only in RAM"], "The firmware is in non-volatile memory so it's there at power-on."],
        [2, "Why are embedded systems often cheap to make?", "They only need hardware for one specific task", ["They have no CPU", "They use no memory", "They are always made of recycled parts"], "Dedicated hardware can be minimal."],
        [3, "Why are embedded systems considered reliable?", "They perform a small set of tasks and are tested for that purpose", ["They never need power", "They can't contain bugs", "They have unlimited memory"], "Limited function makes them easier to test thoroughly."],
        [3, "A smart thermostat is described as embedded. Which feature supports that?", "It runs dedicated software to control heating", ["It can install any app", "It has a keyboard and mouse", "It has a hard disk"], "Dedicated function inside a larger system (the heating)."],
        [3, "What is the main difference between an embedded system and a general-purpose computer?", "An embedded system does a specific task; a general-purpose one can run many programs", ["Embedded systems have no processor", "General-purpose computers have no memory", "Embedded systems are always faster"], "Dedicated vs general-purpose."]
      ] }
  ]
});

/* ---- src/data-2.js ---- */
BW.units.push({
  id: "mem", title: "Memory & Storage", paper: 1, c1: "#6C5CE7", c2: "#FF8FB1", motif: "bits",
  blurb: "Primary and secondary storage, units of data, then the part everyone practises most: binary, hex, binary addition, shifts, and how characters, images and sound are stored.",
  subs: [
    { id: "primary", title: "RAM, ROM & Virtual Memory", motif: "grid",
      notes: ["RAM is volatile, read/write memory holding the OS, programs and data currently in use.", "ROM is non-volatile, read-only memory holding the boot-up instructions (BIOS).", "Virtual memory is part of secondary storage used as extra RAM when RAM is full; it is much slower.", "Primary storage is needed because the CPU can only work on data held in main memory."],
      bank: [
        [1, "Which type of memory is volatile?", "RAM", ["ROM", "SSD", "Optical disc"], "Volatile means contents are lost when power is off; that's RAM."],
        [1, "What does ROM stand for?", "Read Only Memory", ["Random Output Memory", "Rapid Online Memory", "Read Output Module"], "ROM = Read Only Memory."],
        [1, "Where are the boot-up (BIOS) instructions stored?", "ROM", ["RAM", "Cache", "Virtual memory"], "ROM is non-volatile, so the boot program is there at power-on."],
        [1, "What does RAM store?", "Programs and data currently in use", ["Only the BIOS", "Files for long-term storage", "Backups"], "RAM holds whatever is running now, including the OS."],
        [2, "What is virtual memory?", "Part of secondary storage used as temporary RAM", ["Memory inside the CPU", "A type of ROM", "Cloud storage"], "When RAM is full, pages are moved to virtual memory on disk."],
        [2, "Why does using lots of virtual memory slow a computer down?", "Secondary storage is much slower than RAM", ["It uses up the cache", "It increases the clock speed", "It deletes files"], "Swapping data to and from disk is slow."],
        [2, "Which is a difference between RAM and ROM?", "RAM is volatile; ROM is non-volatile", ["ROM is faster than cache", "RAM is read-only", "ROM stores open documents"], "RAM loses contents at power-off; ROM keeps them."],
        [2, "Why do computers need primary storage?", "The CPU needs fast access to current data and instructions", ["To keep files after power-off", "To back up the hard drive", "To connect peripherals"], "Secondary storage is too slow for the CPU to work from directly."],
        [3, "A user has many programs open and the computer slows down. What is the most likely cause?", "RAM is full and virtual memory is being used", ["ROM is full", "The cache is non-volatile", "The CPU has too many registers"], "Heavy use of virtual memory causes slow-down ('disk thrashing')."],
        [3, "What would best fix slow performance caused by virtual memory use?", "Install more RAM", ["Add a bigger ROM", "Use a slower hard drive", "Turn off the cache"], "More RAM means less swapping to disk."],
        [3, "Which statement about ROM is correct?", "Its contents can't normally be changed by the user", ["It is erased when you shut down", "It holds the programs you are editing", "It is secondary storage"], "ROM is read-only in normal use."]
      ] },
    { id: "secondary", title: "Secondary Storage", motif: "waves",
      notes: ["Secondary storage is non-volatile and keeps data long-term.", "Magnetic (HDD): high capacity, cheap per GB, moving parts so less durable.", "Solid state (SSD, USB, SD card): fast, durable, no moving parts, silent, more expensive per GB.", "Optical (CD, DVD, Blu-ray): cheap, portable, low capacity and slow.", "Choose using: capacity, speed, portability, durability, reliability and cost."],
      bank: [
        [1, "Why do computers need secondary storage?", "To store data permanently when the power is off", ["To speed up the CPU", "To hold the boot program", "To replace RAM"], "Secondary storage is non-volatile."],
        [1, "Which storage type uses lasers to read data?", "Optical", ["Magnetic", "Solid state", "Cache"], "CDs, DVDs and Blu-rays are read by lasers."],
        [1, "Which is an example of solid state storage?", "USB flash drive", ["DVD", "Hard disk drive", "Magnetic tape"], "Flash memory = solid state."],
        [1, "Which type of storage has moving parts?", "Magnetic hard disk", ["SSD", "SD card", "USB stick"], "HDDs have spinning platters and a moving read/write head."],
        [2, "Why might an SSD be chosen for a laptop instead of an HDD?", "It is more durable because it has no moving parts", ["It is always cheaper per GB", "It stores data magnetically", "It needs a laser"], "No moving parts = less damage if dropped."],
        [2, "Which is the cheapest per gigabyte for large capacities?", "Magnetic hard disk", ["SSD", "Blu-ray", "USB drive"], "HDDs offer high capacity at low cost."],
        [2, "Which characteristic describes how quickly data can be read or written?", "Speed", ["Durability", "Portability", "Capacity"], "Speed = read/write rate."],
        [2, "A music festival wants to sell photos to visitors on physical media. What's most suitable?", "USB flash drive", ["Internal HDD", "Magnetic tape", "RAM"], "Small, portable, durable and cheap enough."],
        [3, "A company needs to archive 500 TB of old records rarely accessed. Which is most cost-effective?", "Magnetic storage", ["Solid state", "Optical discs", "Cache"], "Magnetic (HDD/tape) is cheapest per GB for huge capacity."],
        [3, "Why are optical discs less popular today?", "Low capacity and slower than other options; streaming/cloud replaces them", ["They are volatile", "They can't be read by any device", "They cost more than SSDs per GB"], "Capacity and speed are limited."],
        [3, "Which characteristic is 'reliability'?", "How consistently the device keeps data without errors over time", ["How much it holds", "How easily it can be carried", "How much it costs"], "Reliability relates to failure rate and data integrity."],
        [2, "Which is NOT a type of secondary storage?", "RAM", ["SSD", "Blu-ray", "HDD"], "RAM is primary storage."]
      ] },
    { id: "units", title: "Units of Data", motif: "bars", gen: ["units", "textSize"],
      notes: ["1 nibble = 4 bits; 1 byte = 8 bits.", "Kilobyte (KB) = 1000 bytes, megabyte (MB) = 1000 KB, gigabyte (GB) = 1000 MB, terabyte (TB) = 1000 GB, petabyte (PB) = 1000 TB.", "Some exams accept 1024 instead of 1000 — both are marked correct in OCR J277.", "Data is stored in binary because computers use switches (transistors) with two states: on and off."],
      bank: [
        [1, "What is the smallest unit of data?", "Bit", ["Nibble", "Byte", "Kilobyte"], "A bit is a single 0 or 1."],
        [1, "How many bits are in a nibble?", "4", ["8", "2", "16"], "Nibble = 4 bits."],
        [1, "Why do computers use binary?", "Their circuits use switches with two states", ["It is easier for humans", "It uses less electricity than denary in all cases", "It was chosen by law"], "Transistors are on (1) or off (0)."],
        [2, "Which order is correct from smallest to largest?", "KB, MB, GB, TB", ["MB, KB, TB, GB", "GB, MB, KB, TB", "KB, GB, MB, PB"], "Kilo < Mega < Giga < Tera < Peta."],
        [2, "Which unit comes after terabyte?", "Petabyte", ["Gigabyte", "Exabit", "Megabyte"], "TB → PB."],
        [3, "A 2 GB file is copied to a 500 MB drive. Will it fit?", "No — 2 GB is 2000 MB", ["Yes — GB is smaller than MB", "Yes, exactly", "Only if compressed to 0 bytes"], "2 GB = 2000 MB, which is more than 500 MB."]
      ] },
    { id: "bin", title: "Binary ↔ Denary", motif: "bits", gen: ["binToDen", "denToBin"],
      notes: ["8-bit place values: 128, 64, 32, 16, 8, 4, 2, 1.", "Binary → denary: add up the place values under each 1.", "Denary → binary: work left to right, put a 1 under a place value if it fits and subtract it.", "8 bits can store 0 to 255 (256 values). n bits can store 2^n values."],
      bank: [
        [1, "What is the largest denary number that can be stored in 8 bits?", "255", ["256", "128", "512"], "11111111 = 255."],
        [1, "What is the place value of the leftmost bit in an 8-bit number?", "128", ["256", "64", "8"], "128 64 32 16 8 4 2 1."],
        [2, "How many different values can 4 bits represent?", "16", ["15", "8", "4"], "2^4 = 16 (0–15)."],
        [3, "What is the largest value in 10 bits?", "1023", ["1024", "512", "999"], "2^10 − 1 = 1023."]
      ] },
    { id: "hex", title: "Hexadecimal", motif: "grid", gen: ["hexToDen", "denToHex", "binToHex", "hexToBin"],
      notes: ["Hex is base 16: digits 0–9 then A=10, B=11, C=12, D=13, E=14, F=15.", "One hex digit represents exactly one nibble (4 bits), so 8 bits = 2 hex digits.", "Hex → denary: first digit × 16 + second digit.", "Hex is used because it's shorter and easier for humans to read than binary, with fewer mistakes; e.g. colour codes, MAC addresses, error codes."],
      bank: [
        [1, "What does the hex digit F represent in denary?", "15", ["16", "14", "10"], "F = 15."],
        [1, "Why do programmers use hexadecimal?", "It is shorter and easier to read than binary", ["Computers process hex faster", "It uses less storage", "It is required by the CPU"], "Computers still store binary; hex is for humans."],
        [2, "How many bits does one hex digit represent?", "4", ["8", "2", "16"], "One hex digit = one nibble."],
        [3, "What is the largest value 2 hex digits can represent?", "FF (255)", ["99 (99)", "FF (256)", "1F (31)"], "FF = 15 × 16 + 15 = 255."]
      ] },
    { id: "binadd", title: "Binary Addition & Overflow", motif: "bits", gen: ["binAdd"],
      notes: ["Rules: 0+0=0, 0+1=1, 1+1=0 carry 1, 1+1+1=1 carry 1.", "Work from right to left, carrying into the next column.", "An overflow error happens when the result needs more bits than are available (e.g. more than 255 in 8 bits)."],
      bank: [
        [1, "What is 1 + 1 in binary?", "10", ["2", "11", "01"], "1 + 1 = 0 carry 1, written 10."],
        [2, "What is 1 + 1 + 1 in binary?", "11", ["3", "10", "111"], "1 + 1 + 1 = 1 carry 1 → 11."],
        [2, "What is an overflow error?", "When a result is too large for the number of bits available", ["When a file is too big for RAM", "When the CPU overheats", "When a number is negative"], "The extra carry bit has nowhere to go."],
        [3, "In 8 bits, 200 + 100 would cause…", "An overflow error", ["A syntax error", "A logic error in the compiler", "No error"], "300 > 255."]
      ] },
    { id: "shifts", title: "Binary Shifts", motif: "waves", gen: ["shift"],
      notes: ["A left shift of 1 multiplies by 2; of n places multiplies by 2^n.", "A right shift of 1 divides by 2 (whole number); of n places divides by 2^n.", "Empty places are filled with 0s; bits shifted off the end are lost, so precision can be lost."],
      bank: [
        [1, "A left shift of one place does what to a binary number?", "Multiplies it by 2", ["Divides it by 2", "Adds 1", "Makes it negative"], "Every bit moves up one place value."],
        [2, "A right shift of 2 places does what?", "Divides by 4", ["Divides by 2", "Multiplies by 4", "Subtracts 2"], "2^2 = 4."],
        [3, "Why can a right shift give an inaccurate answer?", "Bits shifted off the right end are lost", ["Hex is used instead", "The sign changes", "It adds an extra 1"], "E.g. 7 >> 1 = 3, not 3.5."]
      ] }
  ]
});

/* ---- src/data-3.js ---- */
BW.units.find(u => u.id === "mem").subs.push(
  { id: "chars", title: "Characters & Character Sets", motif: "brackets", gen: ["ascii", "charBits", "textSize"],
    notes: ["A character set maps each character to a unique binary code.", "ASCII uses 7 bits (128 characters); extended ASCII uses 8 bits (256).", "Unicode uses more bits per character (up to 32), so it can represent characters from almost every language plus emoji.", "Codes are sequential: if A = 65 then B = 66, C = 67 and so on. a = 97."],
    bank: [
      [1, "What is a character set?", "A defined list of characters and their binary codes", ["A font style", "A set of keyboard shortcuts", "A type of encryption"], "Each character maps to a unique binary number."],
      [1, "How many bits does standard ASCII use per character?", "7", ["8", "16", "32"], "7-bit ASCII = 128 characters."],
      [2, "Why was Unicode introduced?", "ASCII couldn't represent characters from all languages", ["ASCII was too slow", "Unicode uses fewer bits", "ASCII can't store numbers"], "Unicode covers world scripts and symbols."],
      [2, "What is a disadvantage of Unicode compared to ASCII?", "Each character can take more storage", ["It has fewer characters", "It can't store English", "It only works offline"], "More bits per character = bigger files."],
      [3, "Why are character codes grouped sequentially (A, B, C…)?", "So sorting and conversion (e.g. case changes) is easy", ["To reduce file size", "To encrypt text", "Because the keyboard is in alphabetical order"], "Consecutive codes make comparisons simple."],
      [3, "The code for '0' in ASCII is 48. What is the code for '7'?", "55", ["7", "54", "56"], "48 + 7 = 55. Digit characters are not the same as the numbers."]
    ] },
  { id: "images", title: "Images", motif: "grid", gen: ["imageSize", "colours"],
    notes: ["A bitmap image is made of pixels; each pixel's colour is stored as a binary code.", "Colour depth = number of bits per pixel. n bits gives 2^n colours.", "Resolution = number of pixels (width × height).", "File size (bits) = width × height × colour depth. Metadata (e.g. width, height, colour depth) is also stored.", "Higher resolution or colour depth = better quality but larger file size."],
    bank: [
      [1, "What is a pixel?", "A single dot of colour in an image", ["A unit of storage", "A type of compression", "A byte of sound"], "Pixel = picture element."],
      [1, "What is colour depth?", "The number of bits used for each pixel", ["The number of pixels", "The brightness of the image", "The file type"], "More bits per pixel = more possible colours."],
      [1, "What is resolution?", "The number of pixels in an image", ["The number of colours", "The file size in KB", "The compression ratio"], "Often given as width × height."],
      [2, "What happens to file size if colour depth increases?", "It increases", ["It decreases", "It stays the same", "It halves"], "More bits per pixel."],
      [2, "What is metadata in an image file?", "Data about the image, e.g. width, height, colour depth", ["The pixel data itself", "The compression algorithm's source code", "A backup copy"], "Metadata describes the file."],
      [3, "Why is metadata needed for an image to display correctly?", "The computer needs to know the dimensions and colour depth to rebuild it", ["It makes the file smaller", "It encrypts the image", "It is only for search engines"], "Without width/colour depth the bits can't be interpreted."],
      [3, "An image's colour depth goes from 1 bit to 8 bits. File size is multiplied by…", "8", ["2", "256", "4"], "Size ∝ colour depth: 8/1 = 8."]
    ] },
  { id: "sound", title: "Sound", motif: "waves", gen: ["soundSize"],
    notes: ["Analogue sound is sampled: its amplitude is measured at regular intervals and stored as binary.", "Sample rate = samples per second (Hz). Bit depth = bits per sample.", "File size (bits) = sample rate × bit depth × duration in seconds.", "Higher sample rate or bit depth = closer to the original, but larger files."],
    bank: [
      [1, "What is sample rate?", "The number of samples taken per second", ["The number of bits per sample", "The length of the recording", "The volume"], "Measured in hertz (Hz)."],
      [1, "What is bit depth?", "The number of bits used to store each sample", ["Samples per second", "The number of channels", "The loudness"], "More bits = more precise amplitude values."],
      [2, "What is the effect of increasing sample rate?", "Better quality, larger file", ["Smaller file, worse quality", "No effect on size", "Louder sound"], "More samples capture the wave more accurately."],
      [2, "Why must sound be sampled?", "Sound is analogue, and computers store digital data", ["To make it louder", "To encrypt it", "To remove noise"], "Sampling converts the wave to numbers."],
      [3, "Sample rate is doubled and bit depth halved. What happens to file size?", "It stays the same", ["It doubles", "It halves", "It quadruples"], "×2 × ½ = ×1."],
      [3, "What is measured each time a sample is taken?", "The amplitude of the sound wave", ["The frequency of the CPU", "The file size", "The number of channels"], "Each sample records the wave's height."]
    ] },
  { id: "compression", title: "Compression", motif: "bars",
    notes: ["Compression reduces file size: less storage, faster transfer, less bandwidth.", "Lossy removes data permanently (e.g. JPEG, MP3, MP4) — much smaller files but some quality is lost.", "Lossless reduces size without losing any data (e.g. PNG, ZIP, FLAC); the original can be rebuilt exactly.", "Text and program files must use lossless compression — losing data would break them."],
    bank: [
      [1, "Why is compression used?", "To reduce file size", ["To increase image quality", "To add metadata", "To encrypt data"], "Smaller files store and transfer faster."],
      [1, "Which type of compression permanently removes data?", "Lossy", ["Lossless", "Run-length", "Huffman"], "Lossy discards data you're less likely to notice."],
      [1, "Which file type uses lossy compression?", "MP3", ["PNG", "ZIP", "TXT"], "MP3 removes sounds humans hardly hear."],
      [2, "Which compression should be used for a program's source code?", "Lossless", ["Lossy", "Either", "Neither is possible"], "Losing even one character would break the program."],
      [2, "What is an advantage of lossless compression?", "The original file can be restored exactly", ["Files are always smaller than lossy", "It works only on images", "It reduces quality"], "No data is lost."],
      [2, "What is an advantage of lossy compression?", "It usually gives much smaller files", ["The original can be perfectly restored", "It improves quality", "It's used for text files"], "Lossy can dramatically reduce size."],
      [3, "Run-length encoding stores `AAAABBB` as…", "4A3B", ["A4B3C", "AB43", "7AB"], "RLE stores each run as count + value."],
      [3, "A photographer sends print-quality images to a publisher. Which is best?", "Lossless — quality must be preserved", ["Lossy — smaller is always better", "No compression is possible", "Lossy at maximum compression"], "Print needs full detail."],
      [3, "Why might a streaming service use lossy compression?", "Smaller files stream faster using less bandwidth", ["It improves video quality", "It is required by law", "It makes files lossless"], "Lower bandwidth, less buffering."]
    ] }
);

BW.units.push({
  id: "net", title: "Networks & Protocols", paper: 1, c1: "#0FA3B1", c2: "#B5E48C", motif: "nodes",
  blurb: "LANs and WANs, client–server and peer-to-peer, the hardware that joins it all up, the internet and the cloud, topologies, Wi-Fi, IP and MAC addresses, protocols and layers.",
  subs: [
    { id: "types", title: "LANs, WANs & Performance", motif: "nodes",
      notes: ["LAN: small geographical area (one site); hardware usually owned by the organisation.", "WAN: large geographical area; connects LANs; often uses leased infrastructure (e.g. telecoms). The internet is the biggest WAN.", "Factors affecting performance: bandwidth, number of users, transmission media, interference, latency, errors."],
      bank: [
        [1, "What does LAN stand for?", "Local Area Network", ["Large Area Network", "Linked Access Node", "Local Access Number"], "LAN = Local Area Network."],
        [1, "What is a WAN?", "A network covering a large geographical area", ["A network in one building", "A wireless-only network", "A single computer"], "WAN = Wide Area Network."],
        [1, "What is the largest WAN?", "The internet", ["A school network", "Bluetooth", "Ethernet"], "The internet is a global WAN."],
        [2, "Who usually owns the infrastructure of a WAN?", "Third-party telecoms companies", ["The school", "Each user", "Nobody"], "WANs often use leased lines."],
        [2, "What is bandwidth?", "The amount of data that can be transferred in a given time", ["The length of a cable", "The number of devices", "The size of a file"], "Measured in bits per second."],
        [2, "Why might a network slow down at lunchtime in school?", "More users are sharing the bandwidth", ["Cables get shorter", "The server's ROM fills up", "Wi-Fi gets faster"], "More traffic = less bandwidth each."],
        [3, "Which factor does NOT directly affect network performance?", "The colour of the network cables", ["Bandwidth", "Number of users", "Interference"], "Colour has no effect!"],
        [3, "Why is wired usually more reliable than wireless?", "It suffers less interference", ["Wires are always shorter", "It has no bandwidth limits", "It doesn't need protocols"], "Walls and other signals interfere with wireless."]
      ] },
    { id: "models", title: "Client–Server & Peer-to-Peer", motif: "nodes",
      notes: ["Client–server: a central server provides services (files, email, web pages) that clients request. Easier to manage security and backups; the server is a single point of failure and costly.", "Peer-to-peer: all computers are equal and share resources directly. Cheap and simple; harder to manage and back up."],
      bank: [
        [1, "In a client–server network, what does the server do?", "Provides services and resources to clients", ["Requests web pages only", "Acts as a peer", "Nothing, it's a backup"], "Clients request, servers respond."],
        [1, "In a peer-to-peer network…", "All computers have equal status", ["One computer controls all others", "There must be a web server", "Only printers are shared"], "Peers share resources directly."],
        [2, "An advantage of client–server is…", "Centralised backups and security", ["No need for a server", "It's always cheaper", "Every device is equal"], "Managed from one place."],
        [2, "A disadvantage of client–server is…", "If the server fails, clients lose access", ["No central security", "It can't store files", "It only works wirelessly"], "Single point of failure."],
        [2, "Which suits a small home network sharing a printer?", "Peer-to-peer", ["Client–server with a data centre", "A WAN", "A mesh WAN"], "Cheap and simple."],
        [3, "Why is peer-to-peer harder to back up?", "Files are spread across many computers", ["It has no storage", "It uses only the cloud", "It can't use cables"], "No central store."],
        [3, "Online games often use servers to…", "Keep a single authoritative game state for all players", ["Make every player a peer", "Avoid using the internet", "Remove the need for clients"], "A central server stops players disagreeing on state (and cheating)."]
      ] },
    { id: "hardware", title: "Network Hardware", motif: "circuit",
      notes: ["NIC: lets a device connect to a network; has a MAC address.", "Switch: connects devices on a LAN and sends data only to the intended device using MAC addresses.", "Router: connects different networks (e.g. LAN to the internet) and forwards packets using IP addresses.", "WAP: allows wireless devices to connect to a wired network.", "Transmission media: Ethernet (copper) cable, fibre optic (light, fastest, long distance), wireless (radio waves)."],
      bank: [
        [1, "Which device lets wireless devices join a wired network?", "Wireless access point", ["Switch", "Router", "Hub"], "A WAP bridges wireless to wired."],
        [1, "What does NIC stand for?", "Network Interface Controller/Card", ["Network Internet Connection", "New Internal Cable", "Node Identity Code"], "The NIC connects a device to the network."],
        [1, "Which device connects a LAN to the internet?", "Router", ["Switch", "NIC", "Monitor"], "Routers connect different networks."],
        [2, "How does a switch decide where to send data?", "Using the destination MAC address", ["It sends it to every device", "Using the file name", "Randomly"], "Switches learn which MAC is on which port."],
        [2, "Routers forward packets using…", "IP addresses", ["MAC addresses only", "Domain names only", "Port colours"], "Routers work with IP addresses between networks."],
        [2, "Which transmission medium uses light?", "Fibre optic", ["Ethernet copper", "Wi-Fi", "Bluetooth"], "Fibre carries pulses of light."],
        [3, "Why is fibre optic used for long-distance backbones?", "High bandwidth and little signal loss over distance", ["It is the cheapest cable", "It is wireless", "It needs no hardware"], "Light suffers little attenuation or interference."],
        [3, "Why would a school choose a switch over broadcasting data to all devices?", "It reduces unnecessary traffic and improves security", ["It is wireless", "It stores web pages", "It assigns domain names"], "Data only goes to the recipient."]
      ] },
    { id: "internet", title: "The Internet, DNS & Cloud", motif: "nodes",
      notes: ["The internet is a worldwide collection of interconnected networks.", "DNS (Domain Name System) translates domain names like example.com into IP addresses.", "Hosting: storing websites or files on a server connected to the internet.", "The cloud: remote servers accessed over the internet for storage, software and processing. Pros: access anywhere, scalable, no maintenance. Cons: needs internet, security/privacy depends on the provider, ongoing cost."],
      bank: [
        [1, "What is the internet?", "A worldwide network of networks", ["A web browser", "A single giant computer", "The World Wide Web"], "The web is a service that runs on the internet."],
        [1, "What does DNS do?", "Converts domain names into IP addresses", ["Stores web pages", "Encrypts emails", "Assigns MAC addresses"], "Like a phone book for the internet."],
        [2, "What does 'hosting' mean?", "Storing a website on a server connected to the internet", ["Buying a domain name", "Designing a website", "Creating a LAN"], "Hosts make content available online."],
        [2, "Give an advantage of cloud storage.", "Files can be accessed from anywhere with internet", ["It works with no internet", "You own the servers", "It never costs money"], "Accessible from any device online."],
        [2, "Give a disadvantage of cloud storage.", "Depends on having an internet connection", ["Files can be shared easily", "It's scalable", "The provider handles backups"], "No connection, no files."],
        [3, "A DNS server can't resolve a name. What does it do?", "Passes the request to another DNS server", ["Deletes the website", "Uses the MAC address", "Shuts down the router"], "DNS is hierarchical; unresolved requests move up."],
        [3, "Why might a company worry about the cloud?", "Its data is stored by a third party, raising security and legal concerns", ["The cloud can't store data", "Cloud servers are volatile", "It requires Bluetooth"], "Control over data is handed to the provider."]
      ] },
    { id: "topologies", title: "Topologies", motif: "nodes",
      notes: ["Star: each device connects to a central switch. If one cable fails only that device is affected; if the switch fails the whole network fails. Easy to add devices.", "Mesh: devices connect to many others. Full mesh = every device to every other. Very reliable (many routes), but lots of cabling/cost. Wireless mesh is common in homes."],
      bank: [
        [1, "In a star topology, what is at the centre?", "A switch", ["A printer", "A router only", "Nothing"], "All devices connect to the central switch."],
        [1, "In a full mesh topology…", "Every device connects to every other device", ["Devices form a line", "All devices connect to one switch", "Only two devices connect"], "Many redundant links."],
        [2, "What happens in a star network if one cable fails?", "Only that device loses connection", ["The whole network fails", "Every other cable fails", "Data is encrypted"], "Other devices keep working."],
        [2, "What is a disadvantage of a star topology?", "If the central switch fails, the network fails", ["It's very hard to add devices", "Data collisions on one shared cable", "It needs no cables"], "The switch is a single point of failure."],
        [2, "Why is mesh reliable?", "Data can take many routes if one fails", ["It uses fewer cables", "It has one central device", "It only uses fibre"], "Redundancy."],
        [3, "Why is a wired full mesh rarely used in a LAN?", "It needs a lot of cabling and is expensive", ["It is unreliable", "It has a single point of failure", "It can't carry data"], "n(n−1)/2 links is costly."],
        [3, "How many links does a full mesh of 5 devices need?", "10", ["5", "20", "25"], "5 × 4 ÷ 2 = 10."]
      ] },
    { id: "wireless", title: "Wired, Wireless & Encryption", motif: "waves",
      notes: ["Wi-Fi: wireless LAN using radio waves; flexible but affected by walls, distance and interference.", "Bluetooth: short-range wireless for connecting nearby devices.", "Ethernet: wired standard; faster and more reliable/secure than wireless.", "Encryption scrambles data so it can't be understood if intercepted — vital on wireless networks (e.g. WPA2/WPA3)."],
      bank: [
        [1, "Which wireless technology is designed for very short range?", "Bluetooth", ["Wi-Fi", "Ethernet", "Fibre"], "Bluetooth is for nearby devices, e.g. headphones."],
        [1, "Which is a wired networking standard?", "Ethernet", ["Wi-Fi", "Bluetooth", "4G"], "Ethernet uses cables."],
        [2, "Why is encryption important on wireless networks?", "Signals can be intercepted by anyone in range", ["It increases range", "It is needed for Bluetooth to work", "It stops interference"], "Intercepted data is unreadable without the key."],
        [2, "Give an advantage of wireless over wired.", "Devices can move around freely", ["Always faster", "More secure", "No interference"], "Mobility and no cables."],
        [2, "What is encryption?", "Scrambling data so only authorised people can read it", ["Compressing data", "Deleting data", "Backing up data"], "Needs a key to decrypt."],
        [3, "What can reduce Wi-Fi performance?", "Walls, distance and interference from other devices", ["Using Ethernet elsewhere", "Encryption keys being long", "Using a switch"], "Radio signals weaken and suffer interference."],
        [3, "Which is a Wi-Fi security standard?", "WPA3", ["HTTP", "SMTP", "TCP"], "WPA2/WPA3 encrypt Wi-Fi traffic."]
      ] },
    { id: "addressing", title: "IP & MAC Addresses", motif: "grid", gen: ["ipv4"],
      notes: ["IP address: logical address used to route data across networks; can change. IPv4 = 4 numbers 0–255 (32 bits); IPv6 = 128 bits, written in hex.", "MAC address: physical, unique address assigned to a NIC when made; 48 bits, written as 6 pairs of hex digits.", "Standards (e.g. IEEE 802.11 Wi-Fi) are agreed rules so hardware and software from different makers work together."],
      bank: [
        [1, "How many bits are in an IPv4 address?", "32", ["48", "64", "128"], "4 bytes × 8 = 32 bits."],
        [1, "Which address is permanently assigned to a NIC?", "MAC address", ["IP address", "URL", "DNS address"], "Burned in by the manufacturer."],
        [2, "How many bits are in a MAC address?", "48", ["32", "128", "16"], "6 bytes = 48 bits."],
        [2, "Why was IPv6 introduced?", "IPv4 was running out of addresses", ["IPv4 was too secure", "MAC addresses are too long", "To replace DNS"], "IPv6 has 128 bits → vastly more addresses."],
        [2, "How is a MAC address usually written?", "As 6 pairs of hex digits", ["As 4 denary numbers", "As a domain name", "As binary only"], "E.g. 3C:22:FB:9A:10:4E."],
        [3, "Why are standards important in networking?", "Devices from different manufacturers can work together", ["They make hardware more expensive", "They stop encryption", "They remove the need for protocols"], "Compatibility."],
        [3, "Which is a valid IPv6 feature?", "Written as groups of hexadecimal", ["Uses 32 bits", "Only four numbers", "Permanently tied to the NIC"], "IPv6 = eight groups of hex digits."]
      ] },
    { id: "protocols", title: "Protocols & Layers", motif: "bars",
      notes: ["A protocol is a set of rules for how devices communicate.", "TCP/IP: splits data into packets, routes them, and reassembles them; HTTP/HTTPS: web pages (HTTPS encrypted); FTP: transfer files; SMTP: send email; POP: download email (removes from server); IMAP: access email kept on the server.", "Layers: protocols are grouped into layers; each layer does a specific job and only talks to layers above and below. This makes development easier and lets layers be changed independently.", "TCP/IP layers: Application, Transport, Internet, Link."],
      bank: [
        [1, "What is a protocol?", "A set of rules for communication", ["A type of cable", "A network device", "A virus"], "Everyone follows the same rules."],
        [1, "Which protocol is used to send emails?", "SMTP", ["POP", "FTP", "HTTP"], "Simple Mail Transfer Protocol."],
        [1, "Which protocol secures web browsing?", "HTTPS", ["HTTP", "FTP", "SMTP"], "S = secure (encrypted)."],
        [2, "Which protocol keeps emails on the server so they sync across devices?", "IMAP", ["POP", "SMTP", "FTP"], "IMAP accesses mail on the server."],
        [2, "Which protocol transfers files between computers?", "FTP", ["HTTP", "IMAP", "DNS"], "File Transfer Protocol."],
        [2, "What does TCP do?", "Splits data into packets and makes sure they arrive and are reassembled", ["Converts names to IPs", "Encrypts Wi-Fi", "Stores web pages"], "Transport layer reliability."],
        [2, "Which TCP/IP layer contains HTTP?", "Application", ["Transport", "Internet", "Link"], "HTTP, FTP, SMTP etc. are application layer."],
        [3, "Why are network protocols organised into layers?", "Each layer can be developed and changed independently", ["It makes data larger", "It removes the need for hardware", "It stops packets being lost entirely"], "Modularity and interoperability."],
        [3, "Which layer is responsible for routing packets using IP addresses?", "Internet", ["Application", "Transport", "Link"], "Also called the network layer."],
        [3, "A packet contains a header. What does the header include?", "Source and destination addresses and packet number", ["The whole file", "The user's password", "The DNS server list"], "Used for routing and reassembly."]
      ] }
  ]
});

/* ---- src/data-4.js ---- */
BW.units.push({
  id: "sec", title: "Network Security", paper: 1, c1: "#1D3557", c2: "#E63946", motif: "shield",
  blurb: "The threats networks face, from malware and phishing to SQL injection and denial of service, and the methods used to detect, prevent and limit them.",
  subs: [
    { id: "malware", title: "Malware & Social Engineering", motif: "shield",
      notes: ["Malware is malicious software: viruses (attach to files and spread when run), worms (self-replicate across networks), trojans (disguised as legitimate software), ransomware (encrypts files and demands payment), spyware (secretly records activity).", "Social engineering manipulates people rather than systems: phishing (fake emails/sites), pretexting/blagging (inventing a scenario), shouldering (watching someone enter a PIN)."],
      bank: [
        [1, "What is malware?", "Software designed to cause harm or gain unauthorised access", ["Any slow software", "Hardware that breaks", "A type of firewall"], "Malicious + software."],
        [1, "What is phishing?", "Fake messages that trick people into giving personal details", ["Scanning ports on a server", "Flooding a server with requests", "Encrypting files"], "Often looks like a bank or delivery company."],
        [1, "Which malware encrypts files and demands payment?", "Ransomware", ["Spyware", "Worm", "Adware"], "Pay the ransom (you shouldn't) for the key."],
        [2, "How is a worm different from a virus?", "A worm spreads by itself without a host file", ["A worm is harmless", "A virus only affects hardware", "A worm needs the user to open it every time"], "Worms self-replicate across networks."],
        [2, "What is a trojan?", "Malware disguised as legitimate software", ["A firewall rule", "A secure password", "A network cable"], "Named after the Trojan horse."],
        [2, "Watching someone type their PIN over their shoulder is called…", "Shouldering", ["Phishing", "Pharming", "Brute force"], "Also called shoulder surfing."],
        [2, "What is social engineering?", "Manipulating people into revealing information or access", ["Designing social media", "Writing secure code", "Building network hardware"], "People are often the weakest link."],
        [3, "Which sign most suggests a phishing email?", "Urgent request to 'verify your account' via a link", ["Email from a known colleague about a meeting", "A newsletter you subscribed to", "A receipt for a purchase you made"], "Urgency + link + request for details."],
        [3, "What is spyware?", "Software that secretly monitors and sends activity to a third party", ["Antivirus software", "A physical security guard", "A backup tool"], "Keyloggers are a type of spyware."],
        [3, "Blagging (pretexting) means…", "Inventing a scenario to persuade someone to give information", ["Guessing passwords", "Intercepting Wi-Fi", "Sending a DoS attack"], "E.g. pretending to be IT support."]
      ] },
    { id: "attacks", title: "Attacks", motif: "nodes",
      notes: ["Brute-force attack: trying every possible password until one works.", "Denial of service (DoS): flooding a server with requests so it can't respond to real users. DDoS uses many computers (a botnet).", "Data interception and theft: capturing data as it travels across a network (e.g. packet sniffing).", "SQL injection: typing SQL code into an input box to access or change a database."],
      bank: [
        [1, "What is a brute-force attack?", "Trying every possible password combination", ["Tricking users with emails", "Flooding a server", "Stealing a laptop"], "Automated trial and error."],
        [1, "What is the aim of a DoS attack?", "Make a service unavailable to real users", ["Steal passwords", "Encrypt files", "Install updates"], "Denial of service."],
        [2, "What does the extra D in DDoS mean?", "Distributed — many computers attack at once", ["Double", "Data", "Direct"], "Often a botnet of infected machines."],
        [2, "What is SQL injection?", "Entering SQL code into a form to manipulate a database", ["Injecting malware into RAM", "Sending too many emails", "Guessing a password"], "Exploits poor input validation."],
        [2, "What is data interception?", "Capturing data packets as they travel on a network", ["Deleting a database", "Using a firewall", "Backing up data"], "Packet sniffers can read unencrypted traffic."],
        [3, "Which input suggests an SQL injection attempt?", "`' OR '1'='1`", ["john.smith", "Password123", "07700900123"], "Makes the WHERE condition always true."],
        [3, "Which measure best prevents SQL injection?", "Input validation / parameterised queries", ["A longer Wi-Fi password", "Physical locks", "Using fibre cables"], "Never let raw input become part of the query."],
        [3, "What makes brute-force attacks less effective?", "Long, complex passwords and locking accounts after failed attempts", ["Using the same password everywhere", "Shorter passwords", "Turning off the firewall"], "More combinations + limited attempts."]
      ] },
    { id: "prevention", title: "Preventing Vulnerabilities", motif: "shield",
      notes: ["Penetration testing: authorised simulated attacks to find weaknesses before criminals do.", "Anti-malware: detects and removes malware; must be kept updated.", "Firewall: monitors traffic and blocks unauthorised access based on rules.", "User access levels: users only get access to what they need.", "Passwords: strong passwords, changed regularly, plus 2FA.", "Encryption: makes intercepted data unreadable.", "Physical security: locks, CCTV, biometrics, keycards."],
      bank: [
        [1, "What does a firewall do?", "Monitors and controls network traffic based on rules", ["Removes viruses from files", "Makes backups", "Speeds up the CPU"], "Blocks unauthorised traffic."],
        [1, "What is penetration testing?", "Authorised simulated attacks to find weaknesses", ["Testing how fast a network is", "Installing antivirus", "Testing a printer"], "Ethical hacking."],
        [1, "Which is an example of physical security?", "Locked server room", ["Firewall", "Encryption", "Anti-malware"], "Stops people physically reaching hardware."],
        [2, "Why use user access levels?", "So users only access data they need", ["To make passwords shorter", "To speed up Wi-Fi", "To stop backups"], "Limits damage from mistakes or compromised accounts."],
        [2, "Why must anti-malware be updated regularly?", "New malware is created all the time", ["It gets slower otherwise", "Updates remove the firewall", "It's a legal requirement for home users"], "Definitions must include new threats."],
        [2, "Which is the strongest password?", "T7#qL9!vRw2$", ["password123", "Fluffy2009", "qwerty"], "Long, random, mixed character types."],
        [2, "What is two-factor authentication?", "Needing two different types of proof to log in", ["Having two passwords that are the same", "Logging in twice", "Using two firewalls"], "e.g. password + code on your phone."],
        [3, "Which method protects data if a laptop is stolen?", "Full-disk encryption", ["A firewall", "User access levels on the server", "Penetration testing"], "Data is unreadable without the key."],
        [3, "Why is penetration testing done by an authorised person?", "Unauthorised access is illegal under the Computer Misuse Act", ["Only they know the password", "It needs special cables", "It must be done at night"], "Authorisation makes it legal."],
        [3, "Which combination best defends against phishing?", "Staff training and email filtering", ["Bigger hard drives", "Faster CPUs", "Fibre cables"], "People-focused threats need people-focused defences."]
      ] }
  ]
});

BW.units.push({
  id: "sys", title: "Systems Software", paper: 1, c1: "#3A86FF", c2: "#8ECAE6", motif: "grid",
  blurb: "What the operating system does behind the scenes, and the utility programs that keep a computer healthy: encryption, defragmentation, compression and backups.",
  subs: [
    { id: "os", title: "Operating Systems", motif: "grid",
      notes: ["User interface: GUI, command line, menu or voice, so users can interact with the computer.", "Memory management and multitasking: allocates RAM to programs, moves data between RAM and virtual memory, lets several programs run at once.", "Peripheral management and drivers: drivers translate OS instructions for specific hardware.", "User management: accounts, passwords, access rights.", "File management: naming, organising into folders, moving, deleting, permissions."],
      bank: [
        [1, "Which is an operating system?", "Windows", ["Word", "Chrome", "Photoshop"], "macOS, Linux, Android and iOS are also OSs."],
        [1, "What does GUI stand for?", "Graphical User Interface", ["General User Input", "Graphical Utility Installer", "Guided User Instruction"], "Windows, icons, menus, pointer."],
        [1, "What is a device driver?", "Software that lets the OS communicate with a specific piece of hardware", ["A USB cable", "A person who fixes computers", "A type of RAM"], "Translates generic OS commands."],
        [2, "What is multitasking?", "Running more than one program at the same time", ["Using two monitors", "Having two users", "Typing quickly"], "The OS shares CPU time and RAM."],
        [2, "Which OS function allocates RAM to programs?", "Memory management", ["File management", "User management", "Peripheral management"], "Keeps programs from overwriting each other."],
        [2, "Which OS function lets you rename and move files into folders?", "File management", ["Memory management", "Encryption", "Defragmentation"], "Organising and accessing files."],
        [2, "Which OS function handles logins and access rights?", "User management", ["Peripheral management", "Compression", "Memory management"], "Accounts, passwords, permissions."],
        [3, "Why might a command line interface be preferred by a technician?", "It's faster for experts and can run scripts", ["It's easier for beginners", "It uses more RAM", "It shows icons"], "Powerful and scriptable, but needs commands learned."],
        [3, "A new printer is plugged in but won't work. What is the most likely missing software?", "A device driver", ["A firewall", "A compiler", "Defragmentation software"], "The OS needs the right driver."],
        [3, "How does the OS let many programs share one CPU?", "It schedules them, switching quickly between processes", ["It runs them all at the exact same time on one core", "It deletes inactive programs", "It uses ROM"], "Time-slicing gives the illusion of simultaneity."]
      ] },
    { id: "utility", title: "Utility Software", motif: "bars",
      notes: ["Utility software helps maintain and protect the computer.", "Encryption software: scrambles data so it can't be read without a key.", "Defragmentation: reorganises a magnetic hard drive so file parts are stored together — faster access. Not needed on SSDs (and can shorten their life).", "Data compression: reduces file sizes.", "Backup: full backup copies everything; incremental backs up only what changed since the last backup."],
      bank: [
        [1, "What is utility software?", "Software that maintains or protects the computer", ["Games and apps", "The CPU's firmware", "Word processors only"], "Housekeeping tools."],
        [1, "What does defragmentation do?", "Rearranges file fragments so they're stored together", ["Deletes viruses", "Encrypts files", "Adds more RAM"], "Speeds up reading on an HDD."],
        [2, "Why shouldn't an SSD be defragmented?", "There is no speed benefit and it adds wear", ["SSDs are volatile", "It would delete the OS", "SSDs use lasers"], "SSDs have no moving read head."],
        [2, "What is an incremental backup?", "Backing up only data that changed since the last backup", ["Backing up everything every time", "Deleting old backups", "Compressing the OS"], "Faster and smaller, slower to restore."],
        [2, "Why does fragmentation slow down a hard disk?", "The read/write head has to move to many places to read one file", ["Files get deleted", "RAM fills up", "The CPU overheats"], "More head movement = slower."],
        [3, "Give a disadvantage of incremental backups.", "Restoring needs the full backup plus every incremental one", ["They take up more space than full backups", "They copy everything every time", "They can't be automated"], "Restore is more complex."],
        [3, "Which utility would protect data on a USB stick if lost?", "Encryption software", ["Defragmenter", "Disk cleanup", "Compression"], "Unreadable without the key."]
      ] }
  ]
});

BW.units.push({
  id: "eth", title: "Ethical, Legal & Environmental", paper: 1, c1: "#2A9D8F", c2: "#E9C46A", motif: "ridges",
  blurb: "How technology affects people and the planet, the key UK laws you need to name correctly, and the difference between open-source and proprietary software.",
  subs: [
    { id: "impacts", title: "Ethical & Cultural Impacts", motif: "ridges",
      notes: ["Ethical issues: privacy, surveillance, AI bias, job loss through automation.", "Cultural issues: the digital divide (unequal access to technology), changes in how we communicate, online behaviour.", "Stakeholders: anyone affected by a technology (users, companies, workers, governments)."],
      bank: [
        [1, "What is the digital divide?", "The gap between people who have access to technology and those who don't", ["A type of network split", "A computer with two screens", "A partition on a hard drive"], "Caused by cost, location, age, skills."],
        [1, "Who is a stakeholder?", "Anyone affected by a technology or decision", ["Only the shareholders", "Only the programmer", "Only the government"], "Users, staff, the public…"],
        [2, "Which is an ethical concern about facial recognition cameras?", "People's privacy and possible bias", ["They use too little power", "They are too cheap", "They only work at night"], "Surveillance and misidentification."],
        [2, "How can automation affect employment?", "Some jobs are replaced while new tech jobs are created", ["It always creates more jobs in every industry", "It has no effect", "It only affects IT jobs"], "Both loss and creation."],
        [2, "Which could reduce the digital divide?", "Free public Wi-Fi and cheap devices in schools", ["Raising broadband prices", "Removing libraries", "Making websites need fast connections"], "Improves access."],
        [3, "An AI hiring tool rejects more applicants from one group. This is an example of…", "Algorithmic bias", ["A syntax error", "Lossy compression", "A DoS attack"], "Biased training data leads to biased decisions."],
        [3, "Why is a self-driving car accident an ethical dilemma?", "It's unclear who is responsible: the owner, maker or programmer", ["Cars can't be programmed", "It's covered by the Copyright Act", "Cars don't use software"], "Accountability is disputed."]
      ] },
    { id: "environment", title: "Environmental Impacts", motif: "ridges",
      notes: ["Negatives: energy use (especially data centres), e-waste with toxic materials, mining rare metals, short device lifespans.", "Positives: smart tech reducing energy use, remote working reducing travel, modelling climate.", "E-waste is often exported and dismantled unsafely."],
      bank: [
        [1, "What is e-waste?", "Discarded electronic devices", ["Spam email", "Unused RAM", "Deleted files"], "Old phones, PCs, TVs…"],
        [2, "Why is e-waste harmful?", "It contains toxic materials that can pollute land and water", ["It uses too much bandwidth", "It is always recycled safely", "It contains viruses"], "Lead, mercury, cadmium."],
        [2, "How can technology help the environment?", "Smart thermostats reduce energy use", ["Replacing phones every year", "Leaving servers on idle", "Printing all emails"], "Efficiency and monitoring."],
        [2, "Why do data centres have a large environmental impact?", "They use huge amounts of electricity and cooling", ["They are made of plastic", "They produce e-waste every day only", "They use lasers"], "Power and cooling demand."],
        [3, "Why is mining for device components an environmental concern?", "It uses rare, finite resources and damages habitats", ["It creates more bandwidth", "It reduces e-waste", "It is fully renewable"], "Metals like cobalt and lithium."],
        [3, "Which action most directly reduces e-waste?", "Repairing and reusing devices for longer", ["Buying the newest model each year", "Using more cloud storage", "Using lossy compression"], "Longer lifespan = less waste."]
      ] },
    { id: "legislation", title: "Legislation", motif: "grid",
      notes: ["Data Protection Act 2018 (UK GDPR): personal data must be used fairly, lawfully and transparently; kept accurate, secure, not kept longer than needed; people can see their data.", "Computer Misuse Act 1990: illegal to access computers without permission, to do so with intent to commit further crime, or to modify data/cause damage without permission (e.g. spreading malware).", "Copyright, Designs and Patents Act 1988: protects creative work (software, music, images) from being copied or distributed without permission."],
      bank: [
        [1, "Which law makes hacking illegal?", "Computer Misuse Act 1990", ["Data Protection Act 2018", "Copyright, Designs and Patents Act 1988", "Freedom of Information Act 2000"], "Unauthorised access is an offence."],
        [1, "Which law protects people's personal data?", "Data Protection Act 2018", ["Computer Misuse Act 1990", "Copyright, Designs and Patents Act 1988", "Road Traffic Act"], "Along with UK GDPR."],
        [1, "Illegally downloading a film breaks which law?", "Copyright, Designs and Patents Act 1988", ["Computer Misuse Act 1990", "Data Protection Act 2018", "No law"], "Copyright protects creative work."],
        [2, "Under the Data Protection Act, personal data must be…", "Kept secure and not kept longer than necessary", ["Shared with any company that asks", "Kept forever", "Published online"], "Key principles of the Act."],
        [2, "Spreading a virus is illegal under which law?", "Computer Misuse Act 1990", ["Data Protection Act 2018", "Copyright Act 1988", "Consumer Rights Act"], "Unauthorised modification of computer material."],
        [2, "Copying a friend's paid-for software to your PC breaks…", "Copyright, Designs and Patents Act 1988", ["Computer Misuse Act 1990", "Data Protection Act 2018", "No law if it's for personal use"], "Software is protected by copyright."],
        [3, "Logging into a friend's account without permission, just to look, is…", "An offence under the Computer Misuse Act (unauthorised access)", ["Legal if you change nothing", "A Data Protection Act offence only", "Legal if they're your friend"], "Access without permission is enough."],
        [3, "Under the DPA, what right does a data subject have?", "To see the data an organisation holds about them", ["To delete any company's records", "To see anyone else's data", "To free software"], "A subject access request."],
        [3, "A company stores customers' card numbers in plain text and is hacked. Which law did they most likely breach?", "Data Protection Act 2018", ["Computer Misuse Act 1990", "Copyright, Designs and Patents Act 1988", "None"], "Personal data must be kept secure."]
      ] },
    { id: "licensing", title: "Open Source vs Proprietary", motif: "brackets",
      notes: ["Open source: source code is available to view and modify; usually free; community-supported. Examples: Linux, Firefox, LibreOffice.", "Proprietary: source code is closed; you buy a licence to use it; the company provides support and updates. Examples: Microsoft Office, Photoshop.", "Open source can be customised but may lack official support; proprietary is well-supported but costs money and can't be modified."],
      bank: [
        [1, "What is open-source software?", "Software whose source code can be viewed and changed", ["Software that is always paid for", "Software with no code", "Software only for schools"], "Code is public."],
        [1, "Which is proprietary software?", "Microsoft Office", ["Linux", "LibreOffice", "Firefox"], "Closed source, paid licence."],
        [2, "Give an advantage of proprietary software.", "Official support and regular updates from the company", ["You can edit the source code", "It's always free", "Anyone can distribute it"], "Paid-for support."],
        [2, "Give a disadvantage of open-source software.", "There may be no official support", ["You can't see the code", "It's always expensive", "It can't be modified"], "Community support varies."],
        [3, "Why might a company choose open source for its servers?", "No licence costs and it can be customised", ["It can't be modified", "It comes with a legal guarantee", "It's closed source"], "E.g. Linux on web servers."],
        [3, "What does a software licence define?", "How the software may be used, copied and distributed", ["The CPU speed needed", "The colour scheme", "The size of the download"], "Legal terms of use."]
      ] }
  ]
});

/* ---- src/data-5.js ---- */
BW.units.push({
  id: "alg", title: "Algorithms", paper: 2, c1: "#F15BB5", c2: "#FEE440", motif: "bars",
  blurb: "Computational thinking, designing algorithms with flowcharts and pseudocode, tracing them, and the standard searching and sorting algorithms you must be able to run by hand.",
  subs: [
    { id: "ct", title: "Computational Thinking", motif: "nodes",
      notes: ["Abstraction: removing unnecessary detail to focus on what matters (e.g. a tube map).", "Decomposition: breaking a problem into smaller, more manageable sub-problems.", "Algorithmic thinking: working out the ordered steps needed to solve a problem.", "Inputs, processes and outputs: identify what goes in, what happens, and what comes out."],
      bank: [
        [1, "What is abstraction?", "Removing unnecessary detail from a problem", ["Breaking a problem into smaller parts", "Writing code in steps", "Testing a program"], "Keep only what matters."],
        [1, "What is decomposition?", "Breaking a problem down into smaller sub-problems", ["Removing detail", "Deleting code", "Compressing data"], "Smaller parts are easier to solve."],
        [2, "A tube map leaves out real distances and streets. This is an example of…", "Abstraction", ["Decomposition", "Iteration", "Validation"], "Only stations and connections remain."],
        [2, "Splitting a game into 'menu', 'player movement' and 'scoring' is…", "Decomposition", ["Abstraction", "Encryption", "Compilation"], "Separate, manageable parts."],
        [2, "What is algorithmic thinking?", "Identifying the steps needed to solve a problem", ["Guessing the answer", "Drawing the user interface", "Buying better hardware"], "A precise sequence of steps."],
        [3, "Why does decomposition help teams of programmers?", "Different people can work on different parts at once", ["It removes the need for testing", "It makes the program run faster", "It hides detail from users"], "Parallel development and easier testing."],
        [3, "A weather app shows 'Sunny, 21°C' rather than raw sensor data. Which technique is this?", "Abstraction", ["Decomposition", "Casting", "Iteration"], "Detail hidden, key info shown."],
        [2, "In a program that calculates a total bill, which is an input?", "The prices of the items", ["The printed receipt", "The addition of prices", "The final total"], "Data going in."]
      ] },
    { id: "design", title: "Flowcharts, Pseudocode & Trace Tables", motif: "brackets", gen: ["traceLoop"],
      notes: ["Flowchart symbols: terminal (rounded rectangle) for start/stop; parallelogram for input/output; rectangle for process; diamond for decision; rectangle with side bars for subroutine.", "Pseudocode describes an algorithm in structured English without strict syntax.", "A trace table records the value of each variable as each line runs — used to find logic errors and work out outputs."],
      bank: [
        [1, "Which flowchart symbol is used for a decision?", "Diamond", ["Rectangle", "Parallelogram", "Oval"], "Decisions have Yes/No exits."],
        [1, "Which flowchart symbol shows input or output?", "Parallelogram", ["Diamond", "Rectangle", "Circle"], "E.g. INPUT name, OUTPUT total."],
        [1, "Which symbol marks the start or end?", "Rounded rectangle (terminal)", ["Diamond", "Parallelogram", "Arrow"], "Terminator."],
        [2, "What is a trace table used for?", "Tracking variable values as an algorithm runs", ["Drawing flowcharts", "Compressing code", "Listing hardware"], "Great for finding logic errors."],
        [2, "What is pseudocode?", "A structured, language-independent way of writing an algorithm", ["A programming language", "Machine code", "Encrypted code"], "Not strict syntax."],
        [2, "Which flowchart symbol represents a process like `total = total + 1`?", "Rectangle", ["Diamond", "Parallelogram", "Oval"], "Processes are rectangles."],
        [3, "A flowchart box with double vertical lines at the sides means…", "A subroutine (predefined process)", ["A decision", "An input", "The end"], "Calls a separate procedure/function."]
      ] },
    { id: "searching", title: "Searching Algorithms", motif: "bars", gen: ["linearSearch", "binarySearch"],
      notes: ["Linear search: check each item in turn until found or the end is reached. Works on unsorted data; slow for large lists.", "Binary search: needs sorted data. Check the middle item; if it's not the target, discard the half it can't be in and repeat.", "Binary search is much faster on large sorted lists (halves the list each time)."],
      bank: [
        [1, "Which search algorithm requires the data to be sorted?", "Binary search", ["Linear search", "Both", "Neither"], "It relies on discarding half."],
        [1, "Linear search checks items…", "One by one from the start", ["From the middle outwards", "In random order", "Only the last item"], "Sequentially."],
        [2, "What is an advantage of linear search?", "It works on unsorted lists", ["It's always fastest", "It halves the list each time", "It needs no loop"], "Simple and works on any list."],
        [2, "In the worst case, how many items does binary search check in a sorted list of 1000?", "About 10", ["1000", "500", "100"], "2^10 = 1024, so about 10 halvings."],
        [2, "After checking the middle item of a sorted list and finding it's too small, binary search…", "Discards the left half including the middle", ["Discards the right half", "Starts again from the start", "Checks every remaining item"], "The target must be to the right."],
        [3, "A list of 1,000,000 unsorted items needs searching once. Which is quicker overall?", "Linear search — sorting first would take longer", ["Binary search without sorting", "Binary search after sorting", "Neither can search it"], "Sorting costs more than one linear pass."],
        [3, "In the worst case, linear search on n items makes how many comparisons?", "n", ["n ÷ 2", "log₂ n", "1"], "It may have to check every item."]
      ] },
    { id: "sorting", title: "Sorting Algorithms", motif: "bars", gen: ["bubblePass", "insertionPass"],
      notes: ["Bubble sort: repeatedly compare adjacent pairs and swap if in the wrong order. After each pass the largest unsorted item is in place. Stop when a pass makes no swaps. Simple but slow.", "Insertion sort: take each item in turn and insert it into the correct place in the sorted part at the start of the list. Efficient on small or nearly sorted lists.", "Merge sort: split the list in half repeatedly until each list has 1 item, then merge pairs back together in order. Much faster on large lists but uses more memory."],
      bank: [
        [1, "Which sort repeatedly swaps adjacent items that are out of order?", "Bubble sort", ["Merge sort", "Insertion sort", "Binary sort"], "Items 'bubble' to the end."],
        [1, "Which sort splits the list into single items and then merges them?", "Merge sort", ["Bubble sort", "Insertion sort", "Linear sort"], "Divide and conquer."],
        [2, "How does bubble sort know the list is sorted?", "A full pass is made with no swaps", ["After exactly one pass", "When the middle item is found", "After n² passes always"], "No swaps = in order."],
        [2, "Which sort is usually fastest on very large lists?", "Merge sort", ["Bubble sort", "Insertion sort", "They're equal"], "Much better scaling."],
        [2, "A disadvantage of merge sort is…", "It uses more memory", ["It's always slow", "It only works on 8 items", "It can't sort numbers"], "It creates extra lists while splitting."],
        [2, "Insertion sort builds a sorted section…", "At the start of the list, one item at a time", ["At the end, largest first", "By splitting in half", "Randomly"], "Each item is inserted into place."],
        [3, "When is insertion sort a good choice?", "The list is small or already nearly sorted", ["The list has millions of random items", "The list can't be changed", "Only when sorting text"], "Few moves needed."],
        [3, "Merge sort on [8, 3, 5, 1]: what are the lists after the first merge step?", "[3, 8] and [1, 5]", ["[1, 3, 5, 8]", "[8, 3] and [5, 1]", "[3, 5] and [8, 1]"], "Split to single items, then merge pairs in order."]
      ] }
  ]
});

BW.units.push({
  id: "prog", title: "Programming Fundamentals", paper: 2, c1: "#00BBF9", c2: "#9B5DE5", motif: "brackets",
  blurb: "Variables and constants, the three constructs, operators, data types, strings, arrays, files, SQL, subroutines and random numbers: everything behind the code questions in Paper 2.",
  subs: [
    { id: "vars", title: "Variables, Constants & I/O", motif: "brackets",
      notes: ["A variable is a named memory location whose value can change while the program runs.", "A constant is a named value that cannot change while the program runs (e.g. VAT = 0.2). Makes code easier to read and update.", "Assignment gives a variable a value: `score = 0`.", "Input takes data from the user; output displays it."],
      bank: [
        [1, "What is a variable?", "A named memory location whose value can change", ["A value that never changes", "A type of loop", "An error in code"], "Its value can vary."],
        [1, "What is a constant?", "A named value that can't change while the program runs", ["A variable inside a loop", "A random number", "An input from the user"], "Fixed during execution."],
        [1, "What does `x = 5` do?", "Assigns the value 5 to x", ["Checks if x equals 5", "Prints 5", "Deletes x"], "Single = is assignment."],
        [2, "Why use a constant for VAT rather than typing 0.2 everywhere?", "It only needs changing in one place and is easier to read", ["It makes the program run slower", "Constants use no memory", "It allows VAT to change during the program"], "Maintainability."],
        [2, "Which is a sensible variable name?", "totalScore", ["x1y2z3", "2ndScore", "total score"], "Meaningful, no spaces, doesn't start with a digit."],
        [3, "After `a = 3`, `b = a`, `a = 7`, what is b?", "3", ["7", "10", "a"], "b copied a's value when it was 3."],
        [3, "What is printed? `name = input()` then `print(\"Hi \" + name)` with input Sam.", "Hi Sam", ["Hi name", "Sam", "Hi + Sam"], "Concatenation joins the strings."]
      ] },
    { id: "constructs", title: "Sequence, Selection & Iteration", motif: "waves",
      notes: ["Sequence: instructions run in order.", "Selection: choosing a path using IF / ELSE IF / ELSE or SWITCH/CASE.", "Iteration: repeating code. Count-controlled (FOR) repeats a set number of times; condition-controlled (WHILE / DO…UNTIL) repeats until a condition changes.", "A WHILE loop checks its condition before running and may run 0 times; a DO…UNTIL runs at least once."],
      bank: [
        [1, "Which construct is used to make a decision?", "Selection", ["Sequence", "Iteration", "Assignment"], "IF statements."],
        [1, "Which construct repeats code?", "Iteration", ["Selection", "Sequence", "Casting"], "Loops."],
        [1, "Which loop is count-controlled?", "FOR", ["WHILE", "DO…UNTIL", "IF"], "Repeats a fixed number of times."],
        [2, "Which loop is best for 'keep asking until the password is correct'?", "A condition-controlled loop (WHILE)", ["A FOR loop from 1 to 3", "An IF statement", "No loop is needed"], "Unknown number of repetitions."],
        [2, "What's the difference between WHILE and DO…UNTIL?", "DO…UNTIL always runs at least once", ["WHILE always runs at least once", "They're identical", "DO…UNTIL can't use conditions"], "The condition is checked at the end."],
        [2, "How many times does `for i = 0 to 4` run (OCR style, inclusive)?", "5", ["4", "3", "6"], "0, 1, 2, 3, 4."],
        [3, "`for i = 1 to 10 step 3` produces which values of i?", "1, 4, 7, 10", ["1, 3, 6, 9", "3, 6, 9", "1, 4, 7"], "Start at 1, add 3 each time, up to 10 inclusive."],
        [3, "What is nesting?", "Putting one construct inside another, e.g. an IF inside a loop", ["Running code in sequence", "Declaring a constant", "Calling the OS"], "Structures within structures."]
      ] },
    { id: "operators", title: "Operators", motif: "grid", gen: ["arith"],
      notes: ["Arithmetic: + − * / plus MOD (remainder), DIV (whole-number division) and ^ (exponent).", "Comparison: == equal, != not equal, <, <=, >, >=.", "Boolean: AND, OR, NOT.", "Python uses % for MOD, // for DIV and ** for power."],
      bank: [
        [1, "Which operator checks if two values are equal?", "==", ["=", "!=", ">="], "= assigns; == compares."],
        [1, "What does `!=` mean?", "Not equal to", ["Equal to", "Greater than", "Factorial"], "Returns True if the values differ."],
        [2, "Which operator gives the remainder of a division?", "MOD", ["DIV", "^", "/"], "17 MOD 5 = 2."],
        [2, "What does `(5 > 3) AND (2 > 4)` evaluate to?", "False", ["True", "5", "Error"], "AND needs both to be True."],
        [2, "What does `NOT (3 == 3)` evaluate to?", "False", ["True", "3", "Error"], "3 == 3 is True; NOT flips it."],
        [3, "How can you test if a number n is even?", "`n MOD 2 == 0`", ["`n DIV 2 == 0`", "`n / 2 == 1`", "`n ^ 2 == 0`"], "Even numbers leave remainder 0."],
        [3, "Which Python operator does integer (DIV) division?", "//", ["/", "%", "**"], "7 // 2 = 3."]
      ] },
    { id: "types", title: "Data Types & Casting", motif: "brackets", gen: ["dataType"],
      notes: ["Integer: whole number. Real/float: number with a decimal part. Boolean: True/False. Character: a single character. String: a sequence of characters.", "Casting changes a value's data type, e.g. `int(\"42\")`, `str(7)`, `float(\"3.5\")`.", "Input is usually a string, so it often needs casting before doing maths."],
      bank: [
        [1, "Which data type holds True or False?", "Boolean", ["Integer", "String", "Real"], "Only two possible values."],
        [2, "What is casting?", "Converting a value from one data type to another", ["Printing a value", "Deleting a variable", "Sorting a list"], "e.g. str(5) → \"5\"."],
        [2, "What does `int(\"12\") + 3` give?", "15", ["\"123\"", "123", "Error"], "The string is cast to an integer first."],
        [2, "What does `\"12\" + \"3\"` give?", "\"123\"", ["15", "Error", "\"15\""], "Adding strings joins (concatenates) them."],
        [3, "Why should a phone number be stored as a string?", "It may start with 0 and you don't do maths with it", ["Strings use less memory than integers", "Integers can't be more than 5 digits", "Phone numbers are Boolean"], "A leading 0 would be lost as an integer."],
        [3, "Which data type best stores a price like £4.99?", "Real / float", ["Integer", "Boolean", "Character"], "It has a decimal part."]
      ] },
    { id: "strings", title: "String Manipulation", motif: "brackets", gen: ["strings"],
      notes: ["Length: `word.length` (OCR) / `len(word)` (Python).", "Substring: `word.substring(start, length)` (OCR) / slicing `word[start:end]` (Python). Indexes start at 0.", "Case: `.upper` / `.lower`.", "Concatenation joins strings with +.", "ASCII conversion: `ASC(\"A\")` = 65, `CHR(65)` = \"A\"."],
      bank: [
        [1, "What is concatenation?", "Joining strings together", ["Splitting a string", "Counting characters", "Changing case"], "\"Hello \" + \"World\"."],
        [2, "What does `\"hello\".upper` return?", "HELLO", ["Hello", "hello", "5"], "All letters to capitals."],
        [2, "What does `ASC(\"B\")` return?", "66", ["65", "B", "98"], "The ASCII code of B."],
        [3, "What does `CHR(ASC(\"a\") + 2)` return?", "c", ["b", "99", "a2"], "97 + 2 = 99 = \"c\"."]
      ] }
  ]
});

/* ---- src/data-6.js ---- */
BW.units.find(u => u.id === "prog").subs.push(
  { id: "arrays", title: "Arrays", motif: "grid", gen: ["arrays"],
    notes: ["An array stores multiple values of the same data type under one identifier.", "Items are accessed by index, starting at 0.", "A 2D array is like a table: `grid[row][column]`.", "Arrays in exam pseudocode are usually fixed size (static)."],
    bank: [
      [1, "What is an array?", "A data structure holding multiple items under one name", ["A single variable", "A type of loop", "A function"], "One identifier, many elements."],
      [1, "In most languages, what is the index of the first item?", "0", ["1", "-1", "It varies each run"], "Zero-indexed."],
      [2, "Why use an array instead of 30 separate variables for student scores?", "It can be processed with a loop and is easier to manage", ["It uses no memory", "Arrays can only hold 30 items", "Variables can't store numbers"], "Loop over indexes."],
      [2, "An array has 8 elements. What is the index of the last one?", "7", ["8", "9", "0"], "Indexes 0–7."],
      [3, "How would you best store a noughts-and-crosses board?", "A 2D array (3 × 3)", ["A single string of length 1", "A Boolean", "Nine constants"], "Rows and columns."],
      [3, "What does `names[3] = \"Zara\"` do?", "Replaces the 4th item with \"Zara\"", ["Adds \"Zara\" 3 times", "Deletes item 3", "Prints the 3rd name"], "Index 3 is the 4th element."]
    ] },
  { id: "files", title: "File Handling", motif: "bars",
    notes: ["Open a file before using it: `f = open(\"scores.txt\")`.", "Read: `f.readLine()`; write: `f.writeLine(\"text\")`; `endOfFile()` checks if you've reached the end.", "Close the file when done: `f.close()` so changes are saved and the file is released.", "Files let data persist after the program ends."],
    bank: [
      [1, "Why do programs store data in files?", "So data is kept after the program closes", ["To make the program faster", "To avoid using variables", "Because RAM is non-volatile"], "Persistence."],
      [1, "What must you do before reading a file?", "Open it", ["Close it", "Delete it", "Compile it"], "Open → read/write → close."],
      [2, "Why should a file be closed after use?", "To save changes and release it for other programs", ["To delete its contents", "To encrypt it", "It is optional and does nothing"], "Unclosed files can lose data."],
      [2, "What is `endOfFile()` used for?", "Checking whether there are more lines to read", ["Deleting the last line", "Closing the file", "Creating a file"], "Used as a loop condition."],
      [3, "Which loop is best for reading every line of a file of unknown length?", "`while NOT file.endOfFile()`", ["`for i = 1 to 10`", "An IF statement", "`do … until i == 5`"], "Stop when the end is reached."],
      [3, "Opening a file in write mode that already exists usually…", "Overwrites its contents", ["Appends to the end", "Makes it read-only", "Deletes the program"], "Use append mode to add to the end."]
    ] },
  { id: "sql", title: "SQL", motif: "grid", gen: ["sqlRows"],
    notes: ["SQL (Structured Query Language) searches databases.", "`SELECT field(s) FROM table WHERE condition` — `*` selects all fields.", "Conditions can use =, <, >, <=, >=, <>, AND, OR, and LIKE with % as a wildcard.", "A record is a row; a field is a column."],
    bank: [
      [1, "What does SQL stand for?", "Structured Query Language", ["Simple Question Language", "Sorted Query List", "System Quality Language"], "Used to query databases."],
      [1, "Which keyword chooses the table to search?", "FROM", ["SELECT", "WHERE", "TABLE"], "SELECT … FROM table."],
      [1, "What does `SELECT *` mean?", "Return all fields", ["Return all tables", "Multiply the fields", "Return nothing"], "* is the wildcard for fields."],
      [2, "Which keyword filters records using a condition?", "WHERE", ["FROM", "ORDER", "SELECT"], "WHERE age > 15."],
      [2, "In a database table, what is a field?", "A single column / attribute", ["A whole row", "The whole table", "A query"], "e.g. 'surname'."],
      [2, "In a database table, what is a record?", "A single row about one item", ["A single column", "A whole database", "A primary key only"], "All data about one entity."],
      [3, "Which query finds names starting with 'J'?", "`SELECT name FROM Students WHERE name LIKE \"J%\"`", ["`SELECT name FROM Students WHERE name = \"J\"`", "`SELECT J FROM Students`", "`SELECT name WHERE J%`"], "% matches any characters."],
      [3, "What does a primary key do?", "Uniquely identifies each record", ["Encrypts the table", "Sorts records alphabetically", "Stores the password"], "No two records share it."]
    ] },
  { id: "subroutines", title: "Subroutines", motif: "brackets",
    notes: ["A subroutine is a named block of code that performs a task and can be called when needed.", "A function returns a value; a procedure does not.", "Parameters pass data into a subroutine.", "Local variables exist only inside the subroutine; global variables can be used anywhere.", "Benefits: reuse, easier testing and maintenance, teams can work on separate parts."],
    bank: [
      [1, "What is the difference between a function and a procedure?", "A function returns a value; a procedure doesn't", ["A procedure returns a value; a function doesn't", "They're identical", "Functions can't take parameters"], "Return value is the key difference."],
      [1, "What is a parameter?", "A value passed into a subroutine", ["A loop counter", "A global constant", "An error message"], "Inputs to the subroutine."],
      [2, "What is a local variable?", "A variable that only exists inside the subroutine it is declared in", ["A variable available everywhere", "A constant", "A variable in a file"], "Scope is limited."],
      [2, "Give a benefit of using subroutines.", "Code can be reused without rewriting it", ["They make programs longer", "They stop all errors", "They remove the need for variables"], "Write once, call many times."],
      [2, "Why are local variables considered good practice?", "They can't be accidentally changed by other parts of the program", ["They use more memory", "They last forever", "They're faster to type"], "Fewer side-effects."],
      [3, "`function double(n)` `return n * 2` `endfunction`. What does `print(double(double(3)))` output?", "12", ["6", "9", "3"], "double(3) = 6, double(6) = 12."],
      [3, "Which is a built-in function in most languages?", "`len()` / `.length`", ["`double()`", "`calculateVAT()`", "`showMenu()`"], "Provided by the language."]
    ] },
  { id: "random", title: "Random Numbers", motif: "bits",
    notes: ["Random numbers are used in games, simulations and testing.", "OCR: `random(1, 6)` returns a random integer from 1 to 6 inclusive.", "Python: `import random` then `random.randint(1, 6)`."],
    bank: [
      [1, "What could `random(1, 6)` be used to simulate?", "Rolling a dice", ["Tossing two coins", "Choosing a letter", "Reading a file"], "Returns 1–6."],
      [2, "Which values can `random(1, 10)` return (OCR style)?", "Any whole number from 1 to 10 inclusive", ["1 to 9 only", "0 to 10", "Only 1 or 10"], "Both ends are inclusive."],
      [2, "In Python, what must you do before using `randint`?", "`import random`", ["Declare a constant", "Open a file", "Nothing"], "It's in the random module."],
      [3, "Which expression simulates a coin toss giving 0 or 1?", "`random(0, 1)`", ["`random(1, 2) * 0`", "`random(0, 2)`", "`random(1, 1)`"], "Two possible outcomes."],
      [1, "Why might a game use random numbers?", "To make events unpredictable, like where an enemy appears", ["To make the game load faster", "To save the player's score", "To stop the game crashing"], "Randomness keeps each play different."],
      [1, "Which Python line picks a random whole number from 1 to 100?", "`random.randint(1, 100)`", ["`random(100)`", "`randint.random(1, 100)`", "`random.int(1, 100)`"], "randint(a, b) includes both a and b."],
      [2, "`x = random(1, 6) + random(1, 6)`. What is the smallest possible value of x?", "2", ["1", "0", "6"], "Each dice gives at least 1, so 1 + 1 = 2."],
      [2, "`x = random(1, 6) + random(1, 6)`. What is the largest possible value of x?", "12", ["6", "11", "36"], "Each dice gives at most 6, so 6 + 6 = 12."],
      [3, "Why are random numbers useful when testing a program?", "They can generate lots of varied test data quickly", ["They guarantee every bug is found", "They make the program run faster", "They replace boundary testing"], "Random data covers many cases, but you still need boundary tests."],
      [3, "Which expression gives a random even number from 2 to 20 (OCR style)?", "`random(1, 10) * 2`", ["`random(2, 20)`", "`random(1, 20) * 2`", "`random(2, 20) / 2`"], "1 to 10 doubled gives 2, 4, … 20."]
    ] }
);

BW.units.push({
  id: "robust", title: "Producing Robust Programs", paper: 2, c1: "#FB5607", c2: "#FFBE0B", motif: "shield",
  blurb: "Defensive design, validation and authentication, writing maintainable code, and how to test properly with the right kinds of test data.",
  subs: [
    { id: "defensive", title: "Defensive Design & Validation", motif: "shield",
      notes: ["Defensive design anticipates misuse so programs don't crash or get exploited.", "Input validation checks data is sensible: range check, type check, length check, presence check, format check.", "Authentication confirms a user's identity (usernames/passwords, 2FA).", "Validation can't check data is correct — only that it's reasonable. Verification (e.g. typing a password twice) checks it was entered correctly."],
      bank: [
        [1, "What is input validation?", "Checking that input data is sensible before using it", ["Encrypting the input", "Making input faster", "Deleting wrong input"], "Reject unreasonable data."],
        [1, "Which check makes sure a field isn't left empty?", "Presence check", ["Range check", "Length check", "Type check"], "Something must be entered."],
        [1, "Which check ensures an age is between 0 and 120?", "Range check", ["Presence check", "Format check", "Type check"], "Within limits."],
        [2, "Which check ensures a postcode matches a pattern like 'AA9 9AA'?", "Format check", ["Range check", "Presence check", "Type check"], "Matches a pattern."],
        [2, "Which check ensures a password is at least 8 characters?", "Length check", ["Range check", "Type check", "Presence check"], "Counts characters."],
        [2, "What is authentication?", "Confirming a user is who they claim to be", ["Checking input is sensible", "Compressing data", "Commenting code"], "Logins, passwords, biometrics."],
        [3, "Why can't validation guarantee data is correct?", "Data can be sensible but still wrong, e.g. a mistyped but valid date", ["Validation deletes data", "Validation only works on numbers", "It encrypts the data"], "Reasonable ≠ correct."],
        [3, "Typing a new password twice is an example of…", "Verification", ["Validation", "Casting", "Abstraction"], "Checks it was entered accurately."],
        [3, "How does defensive design protect against SQL injection?", "By validating and sanitising user input", ["By adding more RAM", "By using a faster CPU", "By removing all comments"], "Don't trust input."]
      ] },
    { id: "maintain", title: "Maintainability", motif: "brackets",
      notes: ["Use subroutines to structure code.", "Use meaningful variable and subroutine names.", "Use indentation to show structure.", "Use comments to explain what code does.", "Maintainable code is easier for others (and you, later) to understand, fix and update."],
      bank: [
        [1, "Why add comments to code?", "To explain what the code does to other programmers", ["To make it run faster", "The computer needs them", "To hide the code"], "Comments are ignored by the translator."],
        [1, "Which improves maintainability?", "Meaningful variable names", ["Single-letter names everywhere", "No indentation", "One giant subroutine"], "e.g. totalCost not tc."],
        [2, "Why is indentation useful?", "It shows the structure of loops and selection", ["It speeds up the program", "It encrypts code", "It's required for all languages to compile"], "Readability (and required in Python)."],
        [2, "Why is maintainability important?", "Code is easier to fix and update in future", ["The program uses less RAM", "Users see the comments", "It stops hacking"], "Other programmers can understand it."],
        [3, "Which is the most maintainable?", "`for student in students: total = total + student.score`", ["`for s in x: t=t+s.q`", "`for a in b: c=c+a.d`", "Everything on one line with no names"], "Clear names explain intent."]
      ] },
    { id: "testing", title: "Testing & Test Data", motif: "bars", gen: ["testData"],
      notes: ["Iterative testing: testing each part while developing. Final (terminal) testing: testing the whole program at the end.", "Normal data: valid, typical data. Boundary data: at the edge of the valid range (and just outside, depending on the spec). Invalid data: correct type but outside the range. Erroneous data: wrong data type.", "A test plan lists test data, expected result and actual result."],
      bank: [
        [1, "Why do we test programs?", "To find errors and check it meets requirements", ["To make it longer", "To add comments", "To compress it"], "Make sure it works as intended."],
        [2, "What is iterative testing?", "Testing each module during development", ["Testing only at the very end", "Testing by users only", "Never testing"], "Test as you build."],
        [2, "What is final (terminal) testing?", "Testing the whole program once it's complete", ["Testing each line as it is typed", "Deleting old tests", "Testing hardware"], "End-of-development check."],
        [2, "What should a test plan include?", "Test data, expected result and actual result", ["The source code only", "The user's password", "The CPU model"], "Compare expected vs actual."],
        [3, "An age field accepts 11–18. Which is erroneous test data?", "\"eleven\"", ["11", "19", "15"], "Wrong data type."],
        [3, "Why test with boundary data?", "Errors often occur at the edges of ranges (e.g. < vs <=)", ["It's the most common input", "It's faster to type", "It always crashes"], "Off-by-one mistakes."]
      ] },
    { id: "errors", title: "Syntax & Logic Errors", motif: "brackets",
      notes: ["Syntax error: breaks the rules of the language, so it won't compile/run (e.g. missing bracket, misspelt keyword).", "Logic error: the program runs but gives the wrong result (e.g. using > instead of >=).", "Runtime errors (e.g. dividing by zero) crash a running program."],
      bank: [
        [1, "A missing closing bracket is a…", "Syntax error", ["Logic error", "Runtime error", "Hardware error"], "Breaks the language rules."],
        [1, "A program runs but calculates the wrong average. This is a…", "Logic error", ["Syntax error", "Compilation error", "Network error"], "Runs, wrong output."],
        [2, "Which is a syntax error?", "`pritn(\"Hello\")`", ["`total = a - b` when it should be a + b", "`if age > 18` when it should be >=", "Looping one time too many"], "Misspelt keyword."],
        [2, "Why are logic errors harder to find than syntax errors?", "The program still runs, so the translator doesn't flag them", ["They only happen on Tuesdays", "They're always in comments", "They stop the computer booting"], "Need testing to spot them."],
        [3, "`if score > 50 then print(\"Pass\")` should pass 50 too. What error is this?", "Logic error — should be >=", ["Syntax error — missing bracket", "Runtime error", "No error"], "Boundary logic mistake."],
        [3, "Which tool helps find a logic error?", "A trace table or breakpoints", ["A syntax highlighter only", "A bigger monitor", "Defragmentation"], "Step through and watch values."]
      ] }
  ]
});

BW.units.push({
  id: "logic", title: "Boolean Logic", paper: 2, c1: "#14213D", c2: "#22C55E", motif: "gates",
  blurb: "AND, OR and NOT gates, their symbols and truth tables, and combining them into logic diagrams and expressions with up to three inputs.",
  subs: [
    { id: "gates", title: "Logic Gates", motif: "gates",
      notes: ["AND: output 1 only if both inputs are 1. Symbol: D-shape.", "OR: output 1 if at least one input is 1. Symbol: curved shield shape.", "NOT: output is the opposite of the input. Symbol: triangle with a small circle.", "Computers use logic gates made from transistors to process binary."],
      bank: [
        [1, "An AND gate outputs 1 when…", "Both inputs are 1", ["Either input is 1", "Both inputs are 0", "The input is 0"], "All must be true."],
        [1, "An OR gate outputs 1 when…", "At least one input is 1", ["Both inputs are 0", "Only both are 1", "Never"], "Any true input."],
        [1, "What does a NOT gate do?", "Reverses the input", ["Adds two inputs", "Always outputs 1", "Needs two inputs"], "0→1, 1→0."],
        [2, "Which gate's symbol is a triangle with a small circle?", "NOT", ["AND", "OR", "XOR"], "The bubble means inversion."],
        [2, "Which gate's symbol has a flat back and a round front, like a D?", "AND", ["OR", "NOT", "NAND"], "D for anD."],
        [2, "How many inputs does a NOT gate have?", "1", ["2", "3", "0"], "It inverts a single input."],
        [3, "How many rows does a truth table with 3 inputs have?", "8", ["6", "3", "9"], "2^3 = 8."],
        [3, "A car alarm sounds if the door is opened OR the window is broken, AND the alarm is set. Which expression fits?", "(D OR W) AND S", ["D OR (W AND S)", "D AND W AND S", "NOT (D OR W)"], "Either trigger, but only when set."]
      ] },
    { id: "tables", title: "Truth Tables", motif: "grid", gen: ["truthTable"],
      notes: ["A truth table lists every combination of inputs and the resulting output.", "With n inputs there are 2^n rows: 2 inputs → 4 rows, 3 inputs → 8 rows.", "Work out intermediate columns (e.g. A AND B) before the final output."],
      bank: [
        [1, "How many rows does a 2-input truth table have?", "4", ["2", "3", "8"], "2^2 = 4."],
        [2, "In the AND truth table, how many rows output 1?", "1", ["2", "3", "0"], "Only 1,1."],
        [2, "In the OR truth table, how many rows output 1?", "3", ["1", "2", "4"], "All except 0,0."]
      ] },
    { id: "expressions", title: "Logic Expressions & Diagrams", motif: "gates", gen: ["logicEval"],
      notes: ["Expressions can be written with words (A AND B) or symbols: ∧ AND, ∨ OR, ¬ NOT.", "Brackets are evaluated first.", "A logic diagram connects gates: the output of one feeds into the input of another."],
      bank: [
        [1, "What symbol is used for AND?", "∧", ["∨", "¬", "+"], "∧ looks like an A for And."],
        [1, "What symbol is used for NOT?", "¬", ["∧", "∨", "!="], "¬A = NOT A."],
        [2, "What symbol is used for OR?", "∨", ["∧", "¬", "&"], "∨ is OR."],
        [3, "`¬(A ∧ B)` is equivalent to…", "NOT (A AND B)", ["NOT A AND B", "A OR B", "A AND NOT B"], "Brackets first, then NOT."]
      ] }
  ]
});

BW.units.push({
  id: "lang", title: "Languages & IDEs", paper: 2, c1: "#8338EC", c2: "#3A86FF", motif: "brackets",
  blurb: "High- and low-level languages, how compilers, interpreters and assemblers translate code, and the IDE tools that help you write and debug it.",
  subs: [
    { id: "levels", title: "High & Low-Level Languages", motif: "brackets",
      notes: ["High-level languages (Python, Java, C#) are close to English, portable, and easier to write, read and debug. One statement may become many machine code instructions.", "Low-level languages: machine code (binary the CPU runs directly) and assembly language (mnemonics like LDA, ADD). Specific to a processor.", "Low-level is used for fast, memory-efficient code or direct hardware control (e.g. embedded systems, drivers)."],
      bank: [
        [1, "Which is a high-level language?", "Python", ["Machine code", "Assembly", "Binary"], "Close to English."],
        [1, "What is machine code?", "Binary instructions the CPU can run directly", ["Python code", "A type of compiler", "An IDE"], "The CPU's native language."],
        [2, "Give an advantage of high-level languages.", "Easier to read, write and debug", ["They run directly on the CPU", "They're specific to one CPU", "They use mnemonics"], "Human-friendly."],
        [2, "Assembly language uses…", "Mnemonics such as ADD and LDA", ["English sentences", "Only 1s and 0s", "Drag-and-drop blocks"], "Short codes for machine instructions."],
        [2, "Why might a programmer use low-level language for a device driver?", "It gives direct control of hardware and memory", ["It's easier to learn", "It's portable to all CPUs", "It has no errors"], "Efficiency and control."],
        [3, "Why is high-level code described as portable?", "It can be translated to run on different processors", ["It fits on a USB stick", "It is always compiled", "It doesn't need translating"], "Not tied to one CPU."],
        [3, "Why must high-level code be translated?", "The CPU only understands machine code", ["To make it shorter", "To add comments", "To encrypt it"], "Translation to binary."]
      ] },
    { id: "translators", title: "Compilers, Interpreters & Assemblers", motif: "bars",
      notes: ["Compiler: translates the whole program into machine code at once, producing an executable. Runs fast; errors are reported after compiling the whole program; source code isn't needed to run it.", "Interpreter: translates and runs one line at a time. Stops at the first error — good for debugging. Slower; needs the interpreter every time it runs.", "Assembler: translates assembly language into machine code."],
      bank: [
        [1, "What does a compiler do?", "Translates the whole program into machine code at once", ["Runs code one line at a time", "Converts assembly only", "Checks spelling in comments"], "Produces an executable."],
        [1, "What translates assembly language into machine code?", "Assembler", ["Compiler", "Interpreter", "Linker"], "Assembly → machine code."],
        [2, "Which translator stops at the first error it meets while running?", "Interpreter", ["Compiler", "Assembler", "Defragmenter"], "Line-by-line."],
        [2, "Give an advantage of a compiler.", "The compiled program runs quickly without needing the translator", ["It stops at each error line by line", "Source code must be shared", "It translates while running"], "Executable runs on its own."],
        [2, "Why are interpreters useful when developing?", "Errors can be found and fixed line by line", ["They produce fast executables", "They hide the source code", "They only work on assembly"], "Quick feedback."],
        [3, "A company wants to sell software without revealing the source code. Which translator?", "Compiler", ["Interpreter", "Assembler", "None"], "Distribute the executable, not the source."],
        [3, "Why does interpreted code usually run slower?", "It is translated every time it runs", ["It is written in binary", "It uses no CPU", "It has fewer lines"], "Translation overhead at runtime."]
      ] },
    { id: "ide", title: "IDE Features", motif: "grid",
      notes: ["An IDE (Integrated Development Environment) provides tools for writing programs.", "Editor: syntax highlighting, auto-complete, auto-indent, line numbers.", "Error diagnostics: highlights and explains errors.", "Run-time environment: runs the program inside the IDE.", "Translator: built-in compiler/interpreter.", "Debugging tools: breakpoints, stepping through code, watching variables."],
      bank: [
        [1, "What does IDE stand for?", "Integrated Development Environment", ["Internal Data Editor", "Interactive Design Engine", "Integrated Debug Executor"], "One app with many tools."],
        [1, "Which IDE feature colours keywords differently?", "Syntax highlighting", ["Breakpoints", "Translator", "Run-time environment"], "Makes code easier to read."],
        [2, "What is a breakpoint?", "A point where the program pauses so values can be inspected", ["A syntax error", "The end of the program", "A type of loop"], "Debugging aid."],
        [2, "Which IDE feature suggests code as you type?", "Auto-complete", ["Error diagnostics", "Stepping", "Defragmentation"], "Saves typing and reduces mistakes."],
        [2, "What does 'stepping' through code do?", "Runs the program one line at a time", ["Deletes lines", "Compiles instantly", "Encrypts code"], "Watch exactly what happens."],
        [3, "How do error diagnostics help a programmer?", "They show where errors are and what may have caused them", ["They fix all logic errors automatically", "They make code run faster", "They write comments"], "Point to the line and the problem."],
        [3, "Why is a run-time environment useful in an IDE?", "The program can be run and tested without leaving the IDE", ["It removes the need for a translator", "It makes the program portable", "It encrypts the output"], "Quick test cycle."]
      ] }
  ]
});

/* ---- src/gen-2.js ---- */
/* Interactive generators: bit toggles, logic circuits, truth-table grids, drag-to-order sorts */
(function (G) {
  const { ri, pick, shuffle, bin, hex } = BW;
  const places = (n, w = 8) => { const p = []; for (let i = w - 1; i >= 0; i--) if (n & (1 << i)) p.push(1 << i); return p.join(" + ") || "0"; };
  const bits = (q, n, why, extra = {}) => ({ type: "bits", q, answer: bin(n), why, ...extra });

  G.bitsDen = d => { const n = ri(d === 1 ? 1 : 20, 255); return bits(`Toggle the bits to make ${n}.`, n, `${n} = ${places(n)}.`, { showSum: d === 1 }); };
  G.bitsHex = d => { const n = ri(d === 1 ? 16 : 40, 255), h = hex(n).padStart(2, "0"); return bits(`Toggle the bits to show hex \`${h}\`.`, n, `${h[0]} = ${bin(n >> 4, 4)} and ${h[1]} = ${bin(n & 15, 4)}.`); };
  G.bitsAdd = d => { let a, b; do { a = ri(d === 1 ? 1 : 20, 200); b = ri(1, 120); } while (a + b > 255);
    return bits("Toggle the bits to show the 8-bit answer.", a + b, `${a} + ${b} = ${a + b} = ${bin(a + b)}.`, { pre: `  ${bin(a)}\n+ ${bin(b)}` }); };
  G.bitsShift = d => { const left = Math.random() < .5, n = d === 1 ? 1 : ri(1, 3), v = left ? ri(1, 255 >> n) : ri(8, 255), r = left ? v << n : v >> n;
    return bits(`Toggle the bits to show \`${bin(v)}\` after a ${left ? "left" : "right"} shift of ${n}.`, r, `Every bit moves ${n} place${n > 1 ? "s" : ""} ${left ? "left" : "right"}; gaps fill with 0: ${bin(r)}.`); };
  G.bitsAscii = d => { const i = ri(0, 25), up = d !== 2, c = String.fromCharCode((up ? 65 : 97) + i);
    return bits(`\`${up ? "A" : "a"}\` is ${up ? 65 : 97} in ASCII. Toggle the bits to make the code for \`${c}\`.`, (up ? 65 : 97) + i, `${c} = ${(up ? 65 : 97) + i} = ${places((up ? 65 : 97) + i)}.`); };

  /* ---- logic expression trees ---- */
  const V = v => ({ v }), NOT = k => ({ op: "NOT", k: [k] });
  BW.evalTree = (t, env) => t.v ? env[t.v] : t.op === "NOT" ? 1 - BW.evalTree(t.k[0], env) : t.op === "AND" ? BW.evalTree(t.k[0], env) & BW.evalTree(t.k[1], env) : BW.evalTree(t.k[0], env) | BW.evalTree(t.k[1], env);
  BW.treeStr = (t, top = true) => t.v ? t.v : t.op === "NOT" ? `NOT ${t.k[0].v ? t.k[0].v : "(" + BW.treeStr(t.k[0]) + ")"}` : `${top ? "" : "("}${BW.treeStr(t.k[0], false)} ${t.op} ${BW.treeStr(t.k[1], false)}${top ? "" : ")"}`;
  const used = (t, s = new Set()) => { t.v ? s.add(t.v) : t.k.forEach(k => used(k, s)); return s; };
  const rows = vs => Array.from({ length: 1 << vs.length }, (_, i) => Object.fromEntries(vs.map((v, j) => [v, (i >> (vs.length - 1 - j)) & 1])));
  const rtree = (depth, vs) => {
    if (depth === 0) return V(pick(vs));
    const r = Math.random();
    if (r < .22) { const k = rtree(depth - 1, vs); return k.op === "NOT" ? k : NOT(k); }
    return { op: r < .61 ? "AND" : "OR", k: [rtree(depth - 1, vs), rtree(depth - 1, vs)] };
  };
  BW.makeTree = d => {
    const vs = d === 3 ? ["A", "B", "C"] : ["A", "B"];
    for (let g = 0; g < 80; g++) {
      const t = rtree(d === 1 ? pick([1, 2]) : d === 2 ? 2 : pick([2, 3]), vs);
      const out = rows(vs).map(e => BW.evalTree(t, e)).join("");
      if (used(t).size === vs.length && /0/.test(out) && /1/.test(out) && BW.treeStr(t).length < 44 && !(t.k && t.k.length === 2 && BW.treeStr(t.k[0]) === BW.treeStr(t.k[1]))) return { t, vs };
    }
    return { t: { op: "OR", k: [{ op: "AND", k: [V("A"), V("B")] }, NOT(V(vs[vs.length - 1]))] }, vs };
  };
  G.gateSet = d => {
    const { t, vs } = BW.makeTree(d), zero = Object.fromEntries(vs.map(v => [v, 0])), target = 1 - BW.evalTree(t, zero);
    const ex = rows(vs).find(e => BW.evalTree(t, e) === target);
    return { type: "gate", q: `Flip the input switches so the output Q = ${target}.`, tree: t, vars: vs, target, expr: BW.treeStr(t),
      why: `Q = ${BW.treeStr(t)}. One way that works: ${vs.map(v => `${v} = ${ex[v]}`).join(", ")}.` };
  };
  G.ttGrid = d => {
    const { t, vs } = BW.makeTree(d === 1 ? 1 : d), col = rows(vs).map(e => BW.evalTree(t, e)).join("");
    return { type: "tt", q: `Click the Q cells to complete the truth table for Q = ${BW.treeStr(t)}.`, tree: t, vars: vs, answer: col, why: `The Q column, top to bottom, is ${col.split("").join(", ")}.` };
  };

  /* ---- drag-to-order sorting ---- */
  const distinct = n => shuffle(Array.from({ length: 40 }, (_, i) => i + 2)).slice(0, n);
  G.orderBubble = d => { let arr, a;
    do { arr = distinct(d === 1 ? 4 : 5); a = arr.slice(); for (let i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]]; } while (a.join() === arr.join());
    return { type: "order", q: `Drag the numbers into the order they will be in after ONE pass of a bubble sort (ascending). Start: [${arr.join(", ")}]`, items: a.map(String), start: arr.map(String), why: `Compare each neighbouring pair left to right and swap if the left one is bigger: ${a.join(", ")}.` }; };
  G.orderInsertion = d => { const arr = distinct(5), k = d === 3 ? 3 : 2, a = arr.slice();
    for (let i = 1; i <= k; i++) { const v = a[i]; let j = i - 1; while (j >= 0 && a[j] > v) { a[j + 1] = a[j]; j--; } a[j + 1] = v; }
    if (a.join() === arr.join()) return G.orderBubble(d);
    return { type: "order", q: `Drag the numbers into their order after ${k} passes of an insertion sort (ascending). Start: [${arr.join(", ")}]`, items: a.map(String), start: arr.map(String), why: `Each pass slides the next item left into the sorted part: ${a.join(", ")}.` }; };

  const attach = (uid, sid, names) => { const s = BW.units.find(u => u.id === uid)?.subs.find(x => x.id === sid); if (s) s.igen = names; };
  attach("mem", "bin", ["bitsDen"]); attach("mem", "hex", ["bitsHex"]); attach("mem", "binadd", ["bitsAdd"]);
  attach("mem", "shifts", ["bitsShift"]); attach("mem", "chars", ["bitsAscii"]);
  attach("logic", "gates", ["gateSet"]); attach("logic", "tables", ["ttGrid"]); attach("logic", "expressions", ["gateSet", "ttGrid"]);
  attach("alg", "sorting", ["orderBubble", "orderInsertion"]);
})(BW.gen);

/* ---- src/data-interactive.js ---- */
/* Hands-on activities per topic: ["match", prompt, pairs] · ["order", prompt, items in correct order] · ["sort", prompt, buckets, [item, bucket]] */
BW.X = {
  "arch.cpu": [["match", "Match each part of the CPU to its job", [["ALU", "Does arithmetic and logic operations"], ["Control Unit", "Decodes instructions and sends control signals"], ["Cache", "Small, fast memory for frequently used data"], ["Registers", "Tiny, super-fast storage inside the CPU"]]]],
  "arch.registers": [["match", "Match each register to what it holds", [["Program Counter", "Address of the next instruction"], ["MAR", "Address being read from or written to"], ["MDR", "Data or instruction just fetched"], ["Accumulator", "Results of calculations"]]]],
  "arch.fde": [["order", "Put the stages of one CPU cycle in order", ["The address in the PC is copied into the MAR", "The instruction at that address is copied into the MDR", "The Control Unit decodes the instruction", "The instruction is executed"]]],
  "arch.perf": [["sort", "Sort each upgrade by whether it directly makes the CPU faster", ["Speeds up the CPU", "Doesn't directly"], [["Higher clock speed", 0], ["More cores", 0], ["Larger cache", 0], ["Bigger monitor", 1], ["Larger hard drive", 1], ["Faster printer", 1]]]],
  "arch.embedded": [["sort", "Embedded system or general-purpose computer?", ["Embedded", "General-purpose"], [["Washing machine controller", 0], ["Car engine management", 0], ["Smart thermostat", 0], ["Laptop", 1], ["Desktop PC", 1], ["Games console running many apps", 1]]]],
  "mem.primary": [["sort", "Volatile or non-volatile?", ["Volatile", "Non-volatile"], [["RAM", 0], ["Cache", 0], ["Registers", 0], ["ROM", 1], ["SSD", 1], ["Hard disk drive", 1]]]],
  "mem.secondary": [["match", "Match each storage type to an example", [["Magnetic", "Hard disk drive"], ["Optical", "Blu-ray disc"], ["Solid state", "SD card"], ["Cloud", "Files on remote servers"]]]],
  "mem.units": [["order", "Order these units from smallest to largest", ["Bit", "Nibble", "Byte", "Kilobyte", "Megabyte", "Gigabyte", "Terabyte", "Petabyte"]]],
  "mem.images": [["match", "Match each image term to its meaning", [["Pixel", "A single dot of colour"], ["Colour depth", "Bits used per pixel"], ["Resolution", "Number of pixels in the image"], ["Metadata", "Data about the file, like width and height"]]]],
  "mem.sound": [["match", "Match each sound term to its meaning", [["Sample rate", "Samples taken per second"], ["Bit depth", "Bits stored per sample"], ["Amplitude", "The height of the wave measured each sample"], ["Duration", "Length of the recording in seconds"]]]],
  "mem.compression": [["sort", "Lossy or lossless?", ["Lossy", "Lossless"], [["MP3", 0], ["JPEG", 0], ["MP4 video", 0], ["PNG", 1], ["ZIP", 1], ["FLAC", 1]]]],
  "net.types": [["sort", "LAN or WAN?", ["LAN", "WAN"], [["A school's network", 0], ["Devices in one home", 0], ["One office building", 0], ["The internet", 1], ["A bank's branches across the UK", 1], ["Uses leased telecom lines", 1]]]],
  "net.models": [["sort", "Client–server or peer-to-peer?", ["Client–server", "Peer-to-peer"], [["Central backups", 0], ["Server is a single point of failure", 0], ["Easier to manage security", 0], ["All computers are equal", 1], ["Cheap to set up", 1], ["Files spread across many machines", 1]]]],
  "net.hardware": [["match", "Match each device to its job", [["Router", "Joins different networks, using IP addresses"], ["Switch", "Sends data to the right device on a LAN"], ["WAP", "Lets wireless devices join a wired network"], ["NIC", "Lets a device connect to a network"]]]],
  "net.topologies": [["sort", "Star or mesh?", ["Star", "Mesh"], [["Every device connects to a central switch", 0], ["Switch failure stops the network", 0], ["Easy to add a device", 0], ["Many routes for data", 1], ["Lots of cabling", 1], ["Very reliable", 1]]]],
  "net.protocols": [["match", "Match each protocol to its job", [["HTTPS", "Secure web pages"], ["SMTP", "Sending email"], ["IMAP", "Reading email kept on the server"], ["FTP", "Transferring files"]]], ["order", "Put the TCP/IP layers in order, from top to bottom", ["Application", "Transport", "Internet", "Link"]]],
  "net.addressing": [["sort", "IP address or MAC address?", ["IP address", "MAC address"], [["Used to route data across networks", 0], ["Can change", 0], ["IPv4 is 32 bits", 0], ["Set by the manufacturer", 1], ["48 bits long", 1], ["Written as 6 pairs of hex", 1]]]],
  "sec.malware": [["match", "Match each threat to what it does", [["Virus", "Attaches to files and spreads when they run"], ["Worm", "Copies itself across a network"], ["Trojan", "Pretends to be useful software"], ["Ransomware", "Encrypts files and demands payment"]]]],
  "sec.attacks": [["match", "Match each attack to the best defence", [["Brute force", "Lock accounts after failed attempts"], ["SQL injection", "Validate input"], ["Data interception", "Encryption"], ["Phishing", "Staff training"]]]],
  "sec.prevention": [["sort", "Physical or software protection?", ["Physical", "Software"], [["Locked server room", 0], ["CCTV", 0], ["Keycard entry", 0], ["Firewall", 1], ["Anti-malware", 1], ["Encryption", 1]]]],
  "sys.os": [["match", "Match each OS job to an example", [["Memory management", "Giving RAM to each open program"], ["Peripheral management", "Using a driver for a printer"], ["User management", "Logins and access rights"], ["File management", "Moving files into folders"]]]],
  "sys.utility": [["match", "Match each utility to its purpose", [["Defragmentation", "Puts file pieces back together on an HDD"], ["Encryption", "Makes data unreadable without a key"], ["Compression", "Makes files smaller"], ["Backup", "Copies data in case of loss"]]]],
  "eth.legislation": [["sort", "Which law is broken?", ["Data Protection Act", "Computer Misuse Act", "Copyright Act"], [["Selling customer emails without consent", 0], ["Keeping personal data insecurely", 0], ["Guessing a teacher's password", 1], ["Spreading a virus", 1], ["Sharing a paid film online", 2], ["Copying someone's software", 2]]]],
  "eth.licensing": [["sort", "Open source or proprietary?", ["Open source", "Proprietary"], [["Linux", 0], ["Firefox", 0], ["Code can be modified", 0], ["Microsoft Office", 1], ["Photoshop", 1], ["Paid-for licence", 1]]]],
  "alg.ct": [["match", "Match each technique to an example", [["Abstraction", "A tube map leaves out real distances"], ["Decomposition", "Splitting a game into menu, movement and scoring"], ["Algorithmic thinking", "Writing the exact steps to solve it"], ["Pattern recognition", "Spotting that two problems work the same way"]]]],
  "alg.design": [["match", "Match each flowchart symbol to its meaning", [["Rounded rectangle", "Start or stop"], ["Parallelogram", "Input or output"], ["Rectangle", "Process"], ["Diamond", "Decision"]]]],
  "alg.searching": [["order", "Put the steps of a binary search in order", ["Find the middle item", "Compare it with the target", "If not found, discard the half the target can't be in", "Repeat on the remaining half"]]],
  "alg.sorting": [["match", "Match each sort to how it works", [["Bubble sort", "Swaps neighbouring pairs until a pass makes no swaps"], ["Insertion sort", "Takes each item and slides it into place in the sorted part"], ["Merge sort", "Splits into single items then merges pairs in order"]]]],
  "prog.constructs": [["match", "Match each construct to an example", [["Sequence", "Lines running one after another"], ["Selection", "if age >= 18 then"], ["Count-controlled iteration", "for i = 1 to 10"], ["Condition-controlled iteration", "while password != \"secret\""]]]],
  "prog.operators": [["match", "Match each operator to its meaning", [["MOD", "Remainder after division"], ["DIV", "Whole-number division"], ["^", "Power (exponent)"], ["!=", "Not equal to"]]]],
  "prog.types": [["sort", "Sort the values into data types", ["Integer", "Real", "Boolean", "String"], [["42", 0], ["-7", 0], ["3.14", 1], ["0.5", 1], ["True", 2], ["False", 2], ["\"Hello\"", 3], ["\"07700 900123\"", 3]]]],
  "prog.files": [["order", "Put the file handling steps in order", ["Open the file", "Read or write the data", "Close the file"]]],
  "prog.sql": [["order", "Build the query in the right order", ["SELECT name", "FROM Students", "WHERE age > 15"]]],
  "prog.subroutines": [["sort", "Function or procedure?", ["Function", "Procedure"], [["Returns a value", 0], ["Can be used in an expression", 0], ["Like len()", 0], ["Doesn't return a value", 1], ["Just carries out a task", 1], ["Like a showMenu() routine", 1]]]],
  "robust.defensive": [["match", "Match each validation check to an example", [["Range check", "Age between 0 and 120"], ["Presence check", "Field not left blank"], ["Length check", "Password at least 8 characters"], ["Format check", "Postcode like AA9 9AA"]]]],
  "robust.testing": [["sort", "An input accepts whole numbers 1 to 10. Sort the test data.", ["Normal", "Boundary", "Invalid", "Erroneous"], [["5", 0], ["7", 0], ["1", 1], ["10", 1], ["11", 2], ["0", 2], ["\"five\"", 3], ["\"?\"", 3]]]],
  "robust.errors": [["sort", "Syntax error or logic error?", ["Syntax error", "Logic error"], [["Missing bracket", 0], ["Misspelt keyword like pritn", 0], ["Missing colon in Python", 0], ["Using > instead of >=", 1], ["Adding instead of subtracting", 1], ["Loop runs one time too many", 1]]]],
  "logic.gates": [["match", "Match each gate to its rule", [["AND", "Output 1 only if both inputs are 1"], ["OR", "Output 1 if at least one input is 1"], ["NOT", "Output is the opposite of the input"]]]],
  "lang.levels": [["sort", "High-level or low-level?", ["High-level", "Low-level"], [["Python", 0], ["Portable between CPUs", 0], ["Close to English", 0], ["Machine code", 1], ["Assembly language", 1], ["Direct control of hardware", 1]]]],
  "lang.translators": [["sort", "Compiler or interpreter?", ["Compiler", "Interpreter"], [["Translates the whole program at once", 0], ["Produces an executable", 0], ["Source code not needed to run", 0], ["Translates one line at a time", 1], ["Stops at the first error", 1], ["Needed every time it runs", 1]]]],
  "lang.ide": [["match", "Match each IDE feature to what it does", [["Breakpoint", "Pauses the program at a chosen line"], ["Syntax highlighting", "Colours keywords"], ["Auto-complete", "Suggests code as you type"], ["Error diagnostics", "Shows where errors are"]]]]
};

/* turn a raw activity into a fresh question object (random subset, shuffled) */
BW.xQuestion = (raw, src) => {
  const [type, q] = raw, key = "x:" + q;
  if (type === "match") { const pairs = BW.shuffle(raw[2]).slice(0, 4);
    return { type, q, pairs, src, key, why: pairs.map(p => `${p[0]} → ${p[1]}`).join(" · ") }; }
  if (type === "order") return { type, q, items: raw[2].slice(), src, key, why: `Correct order: ${raw[2].join(" → ")}.` };
  const items = BW.shuffle(raw[3]).slice(0, 6);
  return { type, q, buckets: raw[2], items, src, key, why: raw[2].map((b, i) => `${b}: ${items.filter(it => it[1] === i).map(it => it[0]).join(", ") || "none"}`).join(" · ") };
};

/* ---- build/data-code.gen.js ---- */
(() => {
BW.CODE = {"id":"code","title":"Coding Lab","c1":"#0B1220","c2":"#22C55E","motif":"brackets","blurb":"Write real Python in the browser. Your programs are checked by running them against test cases, so any correct approach passes, not just one exact answer.","sections":[{"id":"io","title":"Input & output","items":[{"id":"hello","title":"Hello, World!","level":1,"brief":"Write a program that prints the message `Hello, World!`","starter":"# Print a message on the screen\n","tests":[{"i":[],"o":{"has":["hello","world"]},"h":false}],"req":[],"hints":["Use the print() function.","Text goes inside quotation marks: print(\"...\")"]},{"id":"greet","title":"Personal greeting","level":1,"brief":"Ask the user for their name, then greet them by name, e.g. `Hello, Sam!`","starter":"name = input(\"What is your name? \")\n","tests":[{"i":["Sam"],"o":{"has":["hello","sam"]},"h":false},{"i":["Priya"],"o":{"has":["hello","priya"]},"h":true}],"req":[],"hints":["input() gives you back what the user typed.","Join strings with +, or use print(\"Hello,\", name)."]},{"id":"rectangle","title":"Area of a rectangle","level":1,"brief":"Ask for the width and height of a rectangle (whole numbers) and print its area.","starter":"width = int(input(\"Width: \"))\n","tests":[{"i":["3","4"],"o":{"nums":[12]},"h":false},{"i":["7","6"],"o":{"nums":[42]},"h":false},{"i":["1","1"],"o":{"nums":[1]},"h":true},{"i":["12","0"],"o":{"nums":[0]},"h":true}],"req":[],"hints":["int() turns the text the user typed into a whole number.","Area = width × height."]},{"id":"average3","title":"Average of three","level":1,"brief":"Ask for three numbers (they might be decimals) and print their mean average.","starter":"# Ask for three numbers, then print the average\n","tests":[{"i":["4","5","6"],"o":{"nums":[5],"tol":0.01},"h":false},{"i":["1","2","2"],"o":{"nums":[1.6667],"tol":0.01},"h":false},{"i":["10","0","5"],"o":{"nums":[5],"tol":0.01},"h":true},{"i":["2.5","2.5","4"],"o":{"nums":[3],"tol":0.01},"h":true}],"req":[],"hints":["Use float() so decimals work.","Add them up first, then divide by 3. Brackets matter!"]},{"id":"minutes","title":"Minutes to hours","level":2,"brief":"Ask for a number of minutes and print it as hours and minutes, e.g. `135` → `2 hours 15 minutes`. Use `//` (DIV) and `%` (MOD).","starter":"total = int(input(\"Minutes: \"))\n","tests":[{"i":["135"],"o":{"nums":[2,15]},"h":false},{"i":["59"],"o":{"nums":[0,59]},"h":false},{"i":["240"],"o":{"nums":[4,0]},"h":true},{"i":["61"],"o":{"nums":[1,1]},"h":true}],"req":[],"hints":["total // 60 gives the whole hours.","total % 60 gives the minutes left over."]},{"id":"vat","title":"Add VAT","level":2,"brief":"Ask for a price in pounds and print the price including 20% VAT, to 2 decimal places (e.g. `12.00`).","starter":"price = float(input(\"Price: £\"))\n","tests":[{"i":["10"],"o":{"nums":[12],"regex":"\\d\\.\\d\\d(?!\\d)","regex_msg":"Show the price to 2 decimal places, e.g. 12.00"},"h":false},{"i":["2.50"],"o":{"nums":[3],"regex":"\\d\\.\\d\\d(?!\\d)","regex_msg":"Show the price to 2 decimal places, e.g. 3.00"},"h":false},{"i":["19.99"],"o":{"nums":[23.99],"tol":0.001,"regex":"\\d\\.\\d\\d(?!\\d)","regex_msg":"Show the price to 2 decimal places"},"h":true}],"req":[],"hints":["Adding 20% is the same as multiplying by 1.2.","f\"{value:.2f}\" or round(value, 2) with formatting shows 2 decimal places."]}]},{"id":"sel","title":"Selection","items":[{"id":"evenodd","title":"Odd or even","level":1,"brief":"Ask for a whole number. Print `Even` if it is even, otherwise print `Odd`.","starter":"number = int(input(\"Enter a number: \"))\n","tests":[{"i":["4"],"o":{"words":["even"],"not":["odd"]},"h":false},{"i":["7"],"o":{"words":["odd"],"not":["even"]},"h":false},{"i":["0"],"o":{"words":["even"],"not":["odd"]},"h":true},{"i":["-3"],"o":{"words":["odd"],"not":["even"]},"h":true}],"req":["if"],"hints":["n % 2 gives the remainder after dividing by 2.","Even numbers have a remainder of 0."]},{"id":"password","title":"Password check","level":1,"brief":"Ask for a password. If it is exactly `letmein` print `Access granted`, otherwise print `Access denied`.","starter":"attempt = input(\"Password: \")\n","tests":[{"i":["letmein"],"o":{"has":["granted"],"not":["denied"]},"h":false},{"i":["password"],"o":{"has":["denied"],"not":["granted"]},"h":false},{"i":["LetMeIn"],"o":{"has":["denied"],"not":["granted"]},"h":true}],"req":["if"],"hints":["Compare with == (two equals signs).","Passwords are case-sensitive, so LetMeIn should be denied."]},{"id":"grade","title":"Grade boundaries","level":2,"brief":"Ask for a test score out of 100 and print the grade: `A` for 70+, `B` for 60–69, `C` for 50–59, otherwise `U`.","starter":"score = int(input(\"Score: \"))\n","tests":[{"i":["85"],"o":{"words":["A"],"not":["B","C","U"],"cs":true},"h":false},{"i":["65"],"o":{"words":["B"],"not":["A","C","U"],"cs":true},"h":false},{"i":["50"],"o":{"words":["C"],"not":["A","B","U"],"cs":true},"h":false},{"i":["49"],"o":{"words":["U"],"not":["A","B","C"],"cs":true},"h":true},{"i":["70"],"o":{"words":["A"],"not":["B","C","U"],"cs":true},"h":true}],"req":["if"],"hints":["Use if, elif and else.","Check the highest boundary first, and watch the boundaries: 70 is an A."]},{"id":"largest","title":"Largest of three","level":2,"brief":"Ask for three whole numbers and print the largest. Don't use `max()`: use selection instead.","starter":"a = int(input(\"First: \"))\n","tests":[{"i":["3","9","2"],"o":{"nums":[9]},"h":false},{"i":["8","8","1"],"o":{"nums":[8]},"h":false},{"i":["-5","-2","-9"],"o":{"nums":[-2]},"h":true},{"i":["1","2","3"],"o":{"nums":[3]},"h":true}],"req":["if","no:max"],"hints":["Start by assuming the first number is the largest.","Then compare each other number with your current largest."]},{"id":"tickets","title":"Ticket prices","level":2,"brief":"Ask for someone's age. Children under 12 pay £5, people aged 65 or over pay £7, and everyone else pays £10. Print the price.","starter":"age = int(input(\"Age: \"))\n","tests":[{"i":["8"],"o":{"nums":[5]},"h":false},{"i":["30"],"o":{"nums":[10]},"h":false},{"i":["12"],"o":{"nums":[10]},"h":true},{"i":["65"],"o":{"nums":[7]},"h":true},{"i":["11"],"o":{"nums":[5]},"h":true}],"req":["if"],"hints":["Think about the boundaries: 12 is not under 12.","Use if / elif / else with three prices."]},{"id":"leapyear","title":"Leap year","level":3,"brief":"Ask for a year and say whether it is a leap year. A year is a leap year if it divides by 4, unless it divides by 100, but years that divide by 400 are leap years. Print e.g. `2024 is a leap year` or `2023 is not a leap year`.","starter":"year = int(input(\"Year: \"))\n","tests":[{"i":["2024"],"o":{"words":["leap"],"not":["not"]},"h":false},{"i":["2023"],"o":{"words":["not"]},"h":false},{"i":["1900"],"o":{"words":["not"]},"h":true},{"i":["2000"],"o":{"words":["leap"],"not":["not"]},"h":true}],"req":["if"],"hints":["Use % to test if one number divides by another.","Combine conditions with and / or. Brackets help."]}]},{"id":"loop","title":"Iteration","items":[{"id":"count10","title":"Count to 10","level":1,"brief":"Print the numbers 1 to 10, each on its own line. Use a loop.","starter":"# Use a for loop\n","tests":[{"i":[],"o":{"nums":[1,2,3,4,5,6,7,8,9,10],"exact":true},"h":false}],"req":["loop"],"hints":["range(1, 11) gives 1 up to 10.","print(i) inside the loop."]},{"id":"times","title":"Times table","level":2,"brief":"Ask for a number and print its times table from 1 to 12, e.g. `3 x 4 = 12`.","starter":"n = int(input(\"Which times table? \"))\n","tests":[{"i":["3"],"o":{"nums":[3,6,9,12,15,18,21,24,27,30,33,36],"mode":"subseq","slack":30},"h":false},{"i":["7"],"o":{"nums":[7,14,21,28,35,42,49,56,63,70,77,84],"mode":"subseq","slack":30},"h":true}],"req":["loop"],"hints":["Loop i from 1 to 12.","Each line shows n, i and n * i."]},{"id":"sumto","title":"Add them up","level":2,"brief":"Ask for a whole number n and print the total of 1 + 2 + … + n. Use a loop, not `sum()`.","starter":"n = int(input(\"n: \"))\ntotal = 0\n","tests":[{"i":["10"],"o":{"nums":[55]},"h":false},{"i":["4"],"o":{"nums":[10]},"h":false},{"i":["1"],"o":{"nums":[1]},"h":true},{"i":["100"],"o":{"nums":[5050]},"h":true}],"req":["loop","no:sum"],"hints":["Start total at 0.","Add each number to total inside the loop."]},{"id":"countdown","title":"Countdown","level":2,"brief":"Ask for a starting number and count down to 1, one number per line, then print `Blast off!`","starter":"start = int(input(\"Start from: \"))\n","tests":[{"i":["5"],"o":{"nums":[5,4,3,2,1],"has":["blast off"]},"h":false},{"i":["3"],"o":{"nums":[3,2,1],"has":["blast off"]},"h":true}],"req":["loop"],"hints":["range(start, 0, -1) counts down.","Or use a while loop that subtracts 1 each time."]},{"id":"valid","title":"Validation loop","level":2,"brief":"Keep asking for a number between 1 and 10 until the user types a valid one, then print `Thank you`.","starter":"n = int(input(\"Number 1-10: \"))\n","tests":[{"i":["15","0","7"],"o":{"has":["thank"],"used":3},"h":false},{"i":["3"],"o":{"has":["thank"],"used":1},"h":true},{"i":["11","-2","100","10"],"o":{"has":["thank"],"used":4},"h":true}],"req":["while"],"hints":["A while loop repeats while a condition is true.","Ask again inside the loop, otherwise it never ends."]},{"id":"guess","title":"Guess the number","level":2,"brief":"The secret number is 7. Keep asking for guesses. Print `Too high` or `Too low` after a wrong guess, and `Correct` when they get it.","starter":"secret = 7\n","tests":[{"i":["3","9","7"],"o":{"has":["too low","too high","correct"],"used":3},"h":false},{"i":["7"],"o":{"has":["correct"],"not":["too"],"used":1},"h":true},{"i":["10","8","1","7"],"o":{"has":["too high","too high","too low","correct"],"used":4},"h":true}],"req":["loop"],"hints":["Loop while the guess isn't the secret.","Ask for a new guess at the end of each loop."]},{"id":"fizzbuzz","title":"FizzBuzz","level":3,"brief":"Print the numbers 1 to 30, but print `Fizz` for multiples of 3, `Buzz` for multiples of 5 and `FizzBuzz` for multiples of both.","starter":"for i in range(1, 31):\n    pass\n","tests":[{"i":[],"o":{"lines":["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz","16","17","Fizz","19","Buzz","Fizz","22","23","Fizz","Buzz","26","Fizz","28","29","FizzBuzz"]},"h":false}],"req":["loop","if"],"hints":["Check for multiples of both (15) first.","i % 3 == 0 means i is a multiple of 3."]},{"id":"avgloop","title":"Average of many","level":3,"brief":"Ask how many numbers there will be, then ask for each one, then print their average.","starter":"count = int(input(\"How many numbers? \"))\n","tests":[{"i":["3","4","5","6"],"o":{"nums":[5],"tol":0.01,"used":4},"h":false},{"i":["2","1","2"],"o":{"nums":[1.5],"tol":0.01,"used":3},"h":false},{"i":["1","9"],"o":{"nums":[9],"tol":0.01,"used":2},"h":true},{"i":["4","10","20","30","40"],"o":{"nums":[25],"tol":0.01,"used":5},"h":true}],"req":["loop"],"hints":["Loop count times, asking for a number each time.","Keep a running total, then divide by count at the end."]}]},{"id":"str","title":"Strings","items":[{"id":"reverse","title":"Reverse a word","level":1,"brief":"Ask for a word and print it backwards.","starter":"word = input(\"Word: \")\n","tests":[{"i":["hello"],"o":{"words":["olleh"],"cs":true},"h":false},{"i":["Python"],"o":{"words":["nohtyP"],"cs":true},"h":false},{"i":["computer"],"o":{"words":["retupmoc"],"cs":true},"h":true}],"req":[],"hints":["word[::-1] reverses a string in Python.","Or loop through the word and build a new string."]},{"id":"vowels","title":"Count the vowels","level":2,"brief":"Ask for a sentence and print how many vowels (a, e, i, o, u, upper or lower case) it contains.","starter":"sentence = input(\"Sentence: \")\ncount = 0\n","tests":[{"i":["Hello World"],"o":{"nums":[3]},"h":false},{"i":["AEIOU aeiou"],"o":{"nums":[10]},"h":false},{"i":["rhythm"],"o":{"nums":[0]},"h":true},{"i":["Computer Science"],"o":{"nums":[6]},"h":true}],"req":["loop"],"hints":["Loop through each character.","ch.lower() in \"aeiou\" checks for a vowel."]},{"id":"palindrome","title":"Palindrome checker","level":2,"brief":"Ask for a word and print whether it is a palindrome (reads the same backwards), ignoring capital letters. Print e.g. `Palindrome` or `Not a palindrome`.","starter":"word = input(\"Word: \")\n","tests":[{"i":["Racecar"],"o":{"words":["palindrome"],"not":["not"]},"h":false},{"i":["hello"],"o":{"words":["not"]},"h":false},{"i":["Level"],"o":{"words":["palindrome"],"not":["not"]},"h":true},{"i":["ab"],"o":{"words":["not"]},"h":true}],"req":["if"],"hints":["Convert to lower case first.","Compare the word with its reverse."]},{"id":"initials","title":"Initials","level":2,"brief":"Ask for someone's full name and print their initials in capitals, e.g. `ada lovelace` → `AL`.","starter":"name = input(\"Full name: \")\n","tests":[{"i":["ada lovelace"],"o":{"compact":"AL","cs":true},"h":false},{"i":["Alan Turing"],"o":{"compact":"AT","cs":true},"h":false},{"i":["grace brewster hopper"],"o":{"compact":"GBH","cs":true},"h":true}],"req":["loop"],"hints":["name.split() splits the name into a list of words.","word[0] is the first letter; .upper() makes it a capital."]},{"id":"countchar","title":"Letter counter","level":2,"brief":"Ask for a sentence and then a single letter. Print how many times the letter appears, ignoring case. Don't use `.count()`.","starter":"text = input(\"Sentence: \")\nletter = input(\"Letter: \")\n","tests":[{"i":["banana","a"],"o":{"nums":[3]},"h":false},{"i":["Mississippi","s"],"o":{"nums":[4]},"h":false},{"i":["Hello","L"],"o":{"nums":[2]},"h":true},{"i":["xyz","a"],"o":{"nums":[0]},"h":true}],"req":["loop","no:count"],"hints":["Make both lower case so A and a match.","Add 1 to a counter each time the characters match."]},{"id":"caesar","title":"Caesar cipher","level":3,"brief":"Ask for a lower-case word and encrypt it by shifting each letter 3 places along the alphabet (x → a, y → b, z → c). Print the result.","starter":"word = input(\"Word: \")\nresult = \"\"\n","tests":[{"i":["abc"],"o":{"words":["def"],"cs":true},"h":false},{"i":["xyz"],"o":{"words":["abc"],"cs":true},"h":false},{"i":["hello"],"o":{"words":["khoor"],"cs":true},"h":true},{"i":["zebra"],"o":{"words":["cheud"],"cs":true},"h":true}],"req":["loop"],"hints":["ord(\"a\") is 97; chr(97) is \"a\".","Use % 26 so z wraps round to c."]}]},{"id":"list","title":"Lists & arrays","items":[{"id":"listmax","title":"Biggest in a list","level":2,"brief":"Ask for 5 numbers, store them in a list, and print the biggest. Don't use `max()`.","starter":"numbers = []\n","tests":[{"i":["3","9","2","7","5"],"o":{"nums":[9],"used":5},"h":false},{"i":["-4","-9","-1","-7","-3"],"o":{"nums":[-1],"used":5},"h":true},{"i":["5","5","5","5","5"],"o":{"nums":[5],"used":5},"h":true}],"req":["loop","no:max"],"hints":["numbers.append(x) adds to the list.","Keep track of the biggest so far as you loop."]},{"id":"listavg","title":"Average from a list","level":2,"brief":"Ask the user to type numbers separated by commas (e.g. `4,8,15`) and print their average.","starter":"text = input(\"Numbers: \")\n","tests":[{"i":["4,8,15"],"o":{"nums":[9],"tol":0.01},"h":false},{"i":["1,2"],"o":{"nums":[1.5],"tol":0.01},"h":false},{"i":["10"],"o":{"nums":[10],"tol":0.01},"h":true},{"i":["2.5,7.5,5,5"],"o":{"nums":[5],"tol":0.01},"h":true}],"req":[],"hints":["text.split(\",\") makes a list of strings.","Convert each one with float() before adding."]},{"id":"countitems","title":"Count matches","level":2,"brief":"Write a function `count_items(items, x)` that returns how many times `x` appears in the list `items`. Don't use `.count()`.","starter":"def count_items(items, x):\n    pass\n","tests":[{"call":"count_items([1, 2, 2, 3, 2], 2)","ret":"3","h":false},{"call":"count_items([\"a\", \"b\"], \"c\")","ret":"0","h":false},{"call":"count_items([], 5)","ret":"0","h":true},{"call":"count_items([7, 7, 7], 7)","ret":"3","h":true}],"req":["def:count_items","loop","no:count"],"hints":["Start a counter at 0.","return the counter at the end, don't print it."]},{"id":"linsearch","title":"Linear search","level":3,"brief":"Write a function `linear_search(items, target)` that returns the index of `target` in the list, or `-1` if it isn't there. Don't use `.index()`.","starter":"def linear_search(items, target):\n    pass\n","tests":[{"call":"linear_search([4, 8, 15, 16], 15)","ret":"2","h":false},{"call":"linear_search([4, 8, 15, 16], 5)","ret":"-1","h":false},{"call":"linear_search([9], 9)","ret":"0","h":true},{"call":"linear_search([], 1)","ret":"-1","h":true},{"call":"linear_search([\"a\", \"b\", \"b\"], \"b\")","ret":"1","h":true}],"req":["def:linear_search","loop","no:index"],"hints":["Loop through the positions with range(len(items)).","Return as soon as you find it; return -1 after the loop."]},{"id":"bubble","title":"Bubble sort","level":3,"brief":"Write a function `bubble_sort(items)` that returns the list sorted into ascending order using a bubble sort. Don't use `sorted()` or `.sort()`.","starter":"def bubble_sort(items):\n    items = items[:]\n    return items\n","tests":[{"call":"bubble_sort([5, 1, 4, 2, 8])","ret":"[1, 2, 4, 5, 8]","h":false},{"call":"bubble_sort([3, 2, 1])","ret":"[1, 2, 3]","h":false},{"call":"bubble_sort([])","ret":"[]","h":true},{"call":"bubble_sort([1, 2, 3])","ret":"[1, 2, 3]","h":true},{"call":"bubble_sort([9, -1, 9, 0])","ret":"[-1, 0, 9, 9]","h":true}],"req":["def:bubble_sort","loop","no:sorted","no:sort"],"hints":["Compare neighbouring items and swap if they're in the wrong order.","Repeat passes until the list is sorted."]}]},{"id":"func","title":"Subroutines","items":[{"id":"iseven","title":"is_even()","level":1,"brief":"Write a function `is_even(n)` that returns `True` if n is even and `False` if not.","starter":"def is_even(n):\n    pass\n","tests":[{"call":"is_even(4)","ret":"True","h":false},{"call":"is_even(7)","ret":"False","h":false},{"call":"is_even(0)","ret":"True","h":true},{"call":"is_even(-3)","ret":"False","h":true}],"req":["def:is_even","return"],"hints":["return sends a value back from the function.","n % 2 == 0 is already True or False."]},{"id":"ctof","title":"Celsius to Fahrenheit","level":1,"brief":"Write a function `c_to_f(c)` that returns the temperature in Fahrenheit using F = C × 9 ÷ 5 + 32.","starter":"def c_to_f(c):\n    pass\n","tests":[{"call":"c_to_f(0)","ret":"32","h":false},{"call":"c_to_f(100)","ret":"212","h":false},{"call":"c_to_f(-40)","ret":"-40","h":true},{"call":"c_to_f(37)","ret":"98.6","h":true}],"req":["def:c_to_f","return"],"hints":["Return the calculation, don't print it.","Multiply by 9, divide by 5, then add 32."]},{"id":"factorial","title":"Factorial","level":2,"brief":"Write a function `factorial(n)` that returns n! (e.g. 5! = 5 × 4 × 3 × 2 × 1 = 120). 0! is 1.","starter":"def factorial(n):\n    pass\n","tests":[{"call":"factorial(5)","ret":"120","h":false},{"call":"factorial(1)","ret":"1","h":false},{"call":"factorial(0)","ret":"1","h":true},{"call":"factorial(10)","ret":"3628800","h":true}],"req":["def:factorial","return"],"hints":["Start with result = 1.","Multiply by every number from 2 up to n."]},{"id":"circle","title":"Area of a circle","level":2,"brief":"Write a function `area_circle(r)` that returns the area of a circle (π r²) rounded to 2 decimal places. Use `math.pi`.","starter":"import math\n\ndef area_circle(r):\n    pass\n","tests":[{"call":"area_circle(5)","ret":"78.54","h":false,"tol":1e-9},{"call":"area_circle(1)","ret":"3.14","h":false,"tol":1e-9},{"call":"area_circle(0)","ret":"0","h":true,"tol":1e-9},{"call":"area_circle(2.5)","ret":"19.63","h":true,"tol":1e-9}],"req":["def:area_circle","return"],"hints":["r ** 2 is r squared.","round(value, 2) rounds to 2 decimal places."]},{"id":"maxof3","title":"Biggest of three","level":2,"brief":"Write a function `biggest(a, b, c)` that returns the largest of three numbers without using `max()`.","starter":"def biggest(a, b, c):\n    pass\n","tests":[{"call":"biggest(1, 2, 3)","ret":"3","h":false},{"call":"biggest(9, 2, 5)","ret":"9","h":false},{"call":"biggest(4, 8, 8)","ret":"8","h":true},{"call":"biggest(-1, -5, -3)","ret":"-1","h":true}],"req":["def:biggest","if","no:max"],"hints":["Compare the numbers with if statements.","Remember two might be equal."]},{"id":"isprime","title":"Prime checker","level":3,"brief":"Write a function `is_prime(n)` that returns `True` if n is a prime number and `False` otherwise. Numbers below 2 aren't prime.","starter":"def is_prime(n):\n    pass\n","tests":[{"call":"is_prime(2)","ret":"True","h":false},{"call":"is_prime(17)","ret":"True","h":false},{"call":"is_prime(21)","ret":"False","h":false},{"call":"is_prime(1)","ret":"False","h":true},{"call":"is_prime(97)","ret":"True","h":true},{"call":"is_prime(0)","ret":"False","h":true},{"call":"is_prime(49)","ret":"False","h":true}],"req":["def:is_prime","loop"],"hints":["Try dividing n by every number from 2 up to n - 1.","If any divides exactly (n % d == 0) it isn't prime."]}]},{"id":"alg","title":"Exam algorithms","items":[{"id":"validpw","title":"Password rules","level":2,"brief":"Write a function `valid_password(p)` that returns `True` only if the password is at least 8 characters long and contains at least one digit.","starter":"def valid_password(p):\n    pass\n","tests":[{"call":"valid_password(\"secret12\")","ret":"True","h":false},{"call":"valid_password(\"short1\")","ret":"False","h":false},{"call":"valid_password(\"nodigitshere\")","ret":"False","h":true},{"call":"valid_password(\"12345678\")","ret":"True","h":true}],"req":["def:valid_password"],"hints":["len(p) gives the length.","ch.isdigit() is True for 0–9."]},{"id":"bintoden","title":"Binary to denary","level":3,"brief":"Write a function `binary_to_denary(bits)` that takes a string like `\"1010\"` and returns the denary value (10). Use a loop rather than `int(bits, 2)`.","starter":"def binary_to_denary(bits):\n    pass\n","tests":[{"call":"binary_to_denary(\"1010\")","ret":"10","h":false},{"call":"binary_to_denary(\"11111111\")","ret":"255","h":false},{"call":"binary_to_denary(\"0\")","ret":"0","h":true},{"call":"binary_to_denary(\"10000000\")","ret":"128","h":true}],"req":["def:binary_to_denary","loop"],"hints":["Each step: value = value × 2 + next bit.","Or add up place values 128, 64, 32 …"]},{"id":"dentobin","title":"Denary to binary","level":3,"brief":"Write a function `denary_to_binary(n)` that returns n (0–255) as an 8-bit binary string, e.g. `10` → `\"00001010\"`. Don't use `bin()` or `format()`.","starter":"def denary_to_binary(n):\n    pass\n","tests":[{"call":"denary_to_binary(10)","ret":"\"00001010\"","h":false},{"call":"denary_to_binary(255)","ret":"\"11111111\"","h":false},{"call":"denary_to_binary(0)","ret":"\"00000000\"","h":true},{"call":"denary_to_binary(128)","ret":"\"10000000\"","h":true}],"req":["def:denary_to_binary","loop","no:bin","no:format"],"hints":["n % 2 gives the last bit; n // 2 moves to the next.","Build the string from right to left 8 times."]},{"id":"binsearch","title":"Binary search","level":3,"brief":"Write a function `binary_search(items, target)` for a sorted list. Return the index of `target`, or `-1` if it isn't there. Don't use `.index()`.","starter":"def binary_search(items, target):\n    low = 0\n    high = len(items) - 1\n","tests":[{"call":"binary_search([2, 5, 8, 12, 16, 23], 12)","ret":"3","h":false},{"call":"binary_search([2, 5, 8, 12, 16, 23], 7)","ret":"-1","h":false},{"call":"binary_search([1], 1)","ret":"0","h":true},{"call":"binary_search([], 3)","ret":"-1","h":true},{"call":"binary_search(list(range(0, 100, 3)), 99)","ret":"33","h":true}],"req":["def:binary_search","while","no:index"],"hints":["Look at the middle item: mid = (low + high) // 2.","Move low up or high down to discard half each time."]}]},{"id":"files","title":"File handling","items":[{"id":"filescore","title":"High score file","level":3,"brief":"The file `scores.txt` has one player per line, like `Sam,12`. Print the name of the player with the highest score.","starter":"file = open(\"scores.txt\", \"r\")\n","tests":[{"i":[],"files":{"scores.txt":"Sam,12\nAva,19\nBen,7\n"},"o":{"words":["Ava"],"not":["Sam","Ben"]},"h":false},{"i":[],"files":{"scores.txt":"Zed,3\nMia,40\n"},"o":{"words":["Mia"],"not":["Zed"]},"h":true},{"i":[],"files":{"scores.txt":"Lo,100\nHi,99\nMid,50\n"},"o":{"words":["Lo"],"not":["Hi","Mid"]},"h":true}],"req":["file","loop"],"hints":["Loop over the file line by line.","line.strip().split(\",\") separates the name and score."]},{"id":"filewords","title":"Longest word in a file","level":3,"brief":"The file `words.txt` has one word per line. Print how many words there are and then the longest word.","starter":"file = open(\"words.txt\", \"r\")\n","tests":[{"i":[],"files":{"words.txt":"cat\nelephant\ndog\n"},"o":{"nums":[3],"words":["elephant"]},"h":false},{"i":[],"files":{"words.txt":"binary\nbit\nalgorithm\nbyte\n"},"o":{"nums":[4],"words":["algorithm"]},"h":true}],"req":["file"],"hints":["Read each line and strip() the newline.","Keep the longest word seen so far."]}]},{"id":"fill","title":"Finish the code","kind":"fill","items":[{"id":"fillavg","title":"Finish: class average","level":1,"brief":"Part of this program is written for you. It asks how many scores there are, then reads each one. Finish it so it adds up the scores and prints the average.","starter":"count = int(input(\"How many scores? \"))\ntotal = 0\nfor i in range(count):\n    score = int(input(\"Score: \"))\n    # 1. add score to total\n    pass\n# 2. print the average (total divided by count)\n","tests":[{"i":["3","10","20","30"],"o":{"nums":[20],"tol":0.01,"used":4},"h":false},{"i":["2","7","8"],"o":{"nums":[7.5],"tol":0.01,"used":3},"h":false},{"i":["4","1","2","3","4"],"o":{"nums":[2.5],"tol":0.01},"h":true},{"i":["1","9"],"o":{"nums":[9],"tol":0.01},"h":true}],"req":["keep:for i in range(count):","keep:score = int(input(\"Score: \"))"],"hints":["Replace `pass` with a line that adds `score` to `total`.","After the loop (not indented), divide `total` by `count`."]},{"id":"fillage","title":"Finish: age check","level":1,"brief":"Finish `valid_age(age)` so it returns `True` for ages 11 to 18 inclusive, and `False` for anything else.","starter":"def valid_age(age):\n    # return True if age is between 11 and 18 (inclusive)\n    pass\n","tests":[{"call":"valid_age(11)","ret":"True","h":false},{"call":"valid_age(19)","ret":"False","h":false},{"call":"valid_age(18)","ret":"True","h":true},{"call":"valid_age(10)","ret":"False","h":true},{"call":"valid_age(15)","ret":"True","h":true}],"req":["def:valid_age","return","keep:def valid_age(age):"],"hints":["Use >= and <= so 11 and 18 both count.","`return age >= 11 and age <= 18` works."]},{"id":"filltri","title":"Finish: triangle area","level":2,"brief":"The input and output are done. Finish the function `area_of_triangle(base, height)` so it returns base × height ÷ 2.","starter":"def area_of_triangle(base, height):\n    # return the area of the triangle\n    pass\n\nb = float(input(\"Base: \"))\nh = float(input(\"Height: \"))\nprint(\"Area:\", area_of_triangle(b, h))\n","tests":[{"i":["6","3"],"o":{"nums":[9]},"h":false},{"call":"area_of_triangle(10, 4)","ret":"20","h":false,"i":["1","1"]},{"call":"area_of_triangle(5, 5)","ret":"12.5","h":true,"i":["1","1"]},{"i":["7","2"],"o":{"nums":[7]},"h":true}],"req":["def:area_of_triangle","return","keep:def area_of_triangle(base, height):"],"hints":["The function must `return` the answer, not print it.","Area = base * height / 2"]},{"id":"fillmenu","title":"Finish: calculator menu","level":2,"brief":"The menu and option 1 are done. Add an `elif` so choice `2` prints a − b, and an `else` that prints `Invalid choice`.","starter":"print(\"1. Add\")\nprint(\"2. Subtract\")\nchoice = input(\"Choice: \")\na = int(input(\"First number: \"))\nb = int(input(\"Second number: \"))\nif choice == \"1\":\n    print(\"Answer:\", a + b)\n# add an elif for choice \"2\" here\n# add an else here\n","tests":[{"i":["1","5","3"],"o":{"nums":[8]},"h":false},{"i":["2","9","4"],"o":{"nums":[5]},"h":false},{"i":["2","3","10"],"o":{"nums":[-7]},"h":true},{"i":["7","1","1"],"o":{"has":["invalid"]},"h":true}],"req":["keep:if choice == \"1\":","if"],"hints":["`choice` is a string, so compare it with \"2\" in quotes.","`else:` needs no condition."]},{"id":"fillshop","title":"Finish: shopping list","level":2,"brief":"Items are read until the user types `done`. Finish the program so each item is added to `shopping`, then print how many items are on the list.","starter":"shopping = []\nitem = input(\"Item (or done): \")\nwhile item != \"done\":\n    # 1. add item to the shopping list\n\n    item = input(\"Item (or done): \")\n# 2. print how many items are in the list\n","tests":[{"i":["milk","eggs","bread","done"],"o":{"nums":[3],"used":4},"h":false},{"i":["done"],"o":{"nums":[0],"used":1},"h":false},{"i":["a","b","done"],"o":{"nums":[2],"used":3},"h":true}],"req":["keep:while item != \"done\":","list"],"hints":["`shopping.append(item)` adds to the list.","`len(shopping)` gives how many items it holds."]},{"id":"fillsearch","title":"Finish: linear search","level":2,"brief":"Finish `find(items, target)` so it returns the position of `target` in the list, or `-1` if it isn't there.","starter":"def find(items, target):\n    for i in range(len(items)):\n        # if items[i] is the target, return i\n        pass\n    # the target wasn't found\n    return -1\n","tests":[{"call":"find([3, 8, 1], 8)","ret":"1","h":false},{"call":"find([3, 8, 1], 5)","ret":"-1","h":false},{"call":"find([], 1)","ret":"-1","h":true},{"call":"find([\"x\", \"y\", \"x\"], \"x\")","ret":"0","h":true}],"req":["keep:for i in range(len(items)):","keep:return -1","no:index"],"hints":["Compare `items[i]` with `target` using ==.","Return `i` straight away when they match."]},{"id":"fillbubble","title":"Finish: bubble sort","level":3,"brief":"The loops of this bubble sort are written. Finish the inside of the inner loop so neighbouring items are swapped when they're in the wrong order.","starter":"def bubble_sort(items):\n    items = items[:]\n    n = len(items)\n    for p in range(n - 1):\n        for i in range(n - 1 - p):\n            # swap items[i] and items[i + 1] if they are in the wrong order\n            pass\n    return items\n","tests":[{"call":"bubble_sort([4, 2, 3, 1])","ret":"[1, 2, 3, 4]","h":false},{"call":"bubble_sort([1, 2])","ret":"[1, 2]","h":false},{"call":"bubble_sort([5, -1, 5, 0])","ret":"[-1, 0, 5, 5]","h":true},{"call":"bubble_sort([])","ret":"[]","h":true}],"req":["keep:for i in range(n - 1 - p):","no:sorted","no:sort"],"hints":["Only swap when `items[i] > items[i + 1]`.","Python can swap two values in one line: `a, b = b, a`."]},{"id":"fillfile","title":"Finish: add to a file","level":3,"brief":"The program asks for a new name and counts the lines in `names.txt`. Finish it by writing the new name to the file, on its own line, before the count happens.","starter":"name = input(\"New name: \")\nfile = open(\"names.txt\", \"a\")\n# write the new name to the file, followed by a new line\n\nfile.close()\n\nfile = open(\"names.txt\", \"r\")\ncount = 0\nfor line in file:\n    count = count + 1\nfile.close()\nprint(\"There are now\", count, \"names\")\n","tests":[{"i":["Cal"],"files":{"names.txt":"Ava\nBen\n"},"o":{"nums":[3]},"h":false},{"i":["Mo"],"files":{"names.txt":"Zed\n"},"o":{"nums":[2]},"h":true},{"i":["Xi"],"files":{"names.txt":""},"o":{"nums":[1]},"h":true}],"req":["keep:file = open(\"names.txt\", \"a\")","file"],"hints":["`file.write(...)` writes text to the file.","Add \"\\n\" after the name so the next name starts on a new line."]}]},{"id":"debug","title":"Debugging","kind":"debug","items":[{"id":"dbeven","title":"Debug: odd or even","level":1,"brief":"This program should print `Even` for even numbers and `Odd` for odd numbers, but it gets them the wrong way round. Fix it.","starter":"number = int(input(\"Number: \"))\nif number % 2 == 1:\n    print(\"Even\")\nelse:\n    print(\"Odd\")\n","tests":[{"i":["4"],"o":{"words":["even"],"not":["odd"]},"h":false},{"i":["7"],"o":{"words":["odd"],"not":["even"]},"h":false},{"i":["0"],"o":{"words":["even"],"not":["odd"]},"h":true},{"i":["-3"],"o":{"words":["odd"],"not":["even"]},"h":true}],"req":["if"],"hints":["Run it with 4. What does it print?","An even number leaves a remainder of 0 when divided by 2."]},{"id":"dbsyntax","title":"Debug: syntax errors","level":1,"brief":"This greeting program won't run at all. There are two syntax errors. Use the error messages to find and fix them.","starter":"name = input(\"Name: \")\nif name == \"Ada\"\n    print(\"Hello, Ada! Welcome back.\")\nelse:\n    print(\"Hello, \" + name\n","tests":[{"i":["Ada"],"o":{"has":["hello","ada"]},"h":false},{"i":["Sam"],"o":{"has":["hello","sam"]},"h":false},{"i":["Bo"],"o":{"has":["hello","bo"]},"h":true}],"req":[],"hints":["Every `if` and `else` line must end with a colon.","Count the brackets on the last line."]},{"id":"dbtypes","title":"Debug: type errors","level":1,"brief":"This program should say how old the user will be next year, but it crashes. Fix the type errors.","starter":"age = input(\"How old are you? \")\nnext_year = age + 1\nprint(\"Next year you will be \" + next_year)\n","tests":[{"i":["14"],"o":{"nums":[15]},"h":false},{"i":["30"],"o":{"nums":[31]},"h":true},{"i":["0"],"o":{"nums":[1]},"h":true}],"req":[],"hints":["`input()` always gives back a string.","Use `int()` to do maths and `str()` to join a number onto text."]},{"id":"dbtotal","title":"Debug: add up to n","level":1,"brief":"This should print the total of 1 + 2 + … + n, but the answers are wrong. There are two bugs.","starter":"n = int(input(\"n: \"))\ntotal = 0\nfor i in range(1, n):\n    total = i\nprint(\"Total:\", total)\n","tests":[{"i":["5"],"o":{"nums":[15]},"h":false},{"i":["10"],"o":{"nums":[55]},"h":false},{"i":["1"],"o":{"nums":[1]},"h":true},{"i":["100"],"o":{"nums":[5050]},"h":true}],"req":["loop","no:sum"],"hints":["`range(1, n)` stops before n.","`total = i` replaces the total instead of adding to it."]},{"id":"dbgrade","title":"Debug: grade boundaries","level":2,"brief":"A should be 70 or more, B 60–69, C 50–59, otherwise U. Some scores get the wrong grade. Find the boundary bugs.","starter":"score = int(input(\"Score: \"))\nif score > 70:\n    print(\"Grade A\")\nelif score > 60:\n    print(\"Grade B\")\nelif score >= 50:\n    print(\"Grade C\")\nelse:\n    print(\"Grade U\")\n","tests":[{"i":["70"],"o":{"words":["A"],"not":["B","C","U"],"cs":true},"h":false},{"i":["60"],"o":{"words":["B"],"not":["A","C","U"],"cs":true},"h":false},{"i":["85"],"o":{"words":["A"],"not":["B","C","U"],"cs":true},"h":false},{"i":["69"],"o":{"words":["B"],"not":["A","C","U"],"cs":true},"h":true},{"i":["50"],"o":{"words":["C"],"not":["A","B","U"],"cs":true},"h":true},{"i":["49"],"o":{"words":["U"],"not":["A","B","C"],"cs":true},"h":true}],"req":["if"],"hints":["Test with exactly 70. Which grade do you get?","`>` and `>=` behave differently on the boundary."]},{"id":"dbloop","title":"Debug: the endless countdown","level":2,"brief":"This countdown never finishes. Fix it so it counts down to 1 and then prints `Lift off!`","starter":"count = int(input(\"Count down from: \"))\nwhile count > 0:\n    print(count)\nprint(\"Lift off!\")\n","tests":[{"i":["3"],"o":{"nums":[3,2,1],"has":["lift off"]},"h":false},{"i":["5"],"o":{"nums":[5,4,3,2,1],"has":["lift off"]},"h":true}],"req":["while"],"hints":["What stops a while loop? Something in the condition has to change.","Take 1 off `count` inside the loop."]},{"id":"dbmax","title":"Debug: largest in a list","level":2,"brief":"`largest(numbers)` works for most lists but gives the wrong answer for some. Work out which lists break it and fix it. Don't use `max()`.","starter":"def largest(numbers):\n    biggest = 0\n    for n in numbers:\n        if n > biggest:\n            biggest = n\n    return biggest\n","tests":[{"call":"largest([3, 9, 2])","ret":"9","h":false},{"call":"largest([-5, -2, -9])","ret":"-2","h":false},{"call":"largest([-1])","ret":"-1","h":true},{"call":"largest([7, 7])","ret":"7","h":true}],"req":["def:largest","no:max"],"hints":["Try a list where every number is negative.","Start `biggest` at the first item in the list instead of 0."]},{"id":"dbindex","title":"Debug: search crash","level":3,"brief":"`contains(items, target)` should return `True` if the target is in the list and `False` if not. It crashes when the target is missing. Fix it.","starter":"def contains(items, target):\n    i = 0\n    while i <= len(items):\n        if items[i] == target:\n            return True\n        i = i + 1\n    return False\n","tests":[{"call":"contains([1, 2, 3], 2)","ret":"True","h":false},{"call":"contains([1, 2, 3], 5)","ret":"False","h":false},{"call":"contains([], 1)","ret":"False","h":true},{"call":"contains([\"a\"], \"a\")","ret":"True","h":true}],"req":["def:contains"],"hints":["The last position in a list is `len(items) - 1`.","Read the IndexError message: which line and why?"]},{"id":"dbbinary","title":"Debug: binary search","level":3,"brief":"This binary search sometimes misses items and sometimes never finishes. Fix it so it returns the index of `target`, or `-1` if it isn't in the sorted list.","starter":"def binary_search(items, target):\n    low = 0\n    high = len(items)\n    while low < high:\n        mid = (low + high) // 2\n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            low = mid\n        else:\n            high = mid - 1\n    return -1\n","tests":[{"call":"binary_search([2, 5, 8, 12, 16, 23], 12)","ret":"3","h":false},{"call":"binary_search([2, 5, 8, 12, 16, 23], 2)","ret":"0","h":false},{"call":"binary_search([2, 5, 8, 12, 16, 23], 23)","ret":"5","h":true},{"call":"binary_search([2, 5, 8, 12, 16, 23], 7)","ret":"-1","h":true},{"call":"binary_search([], 1)","ret":"-1","h":true}],"req":["def:binary_search","while","no:index"],"hints":["If `low = mid`, can the range ever get smaller?","`high` should be the last valid index, and the loop should run while `low <= high`."]}]},{"id":"adv","title":"Advanced","items":[{"id":"advrle","title":"Run-length encoding","level":3,"brief":"Ask for some text and print it run-length encoded: each run of the same character becomes its count followed by the character, e.g. `AAABBC` → `3A2B1C`.","starter":"text = input(\"Text: \")\n","tests":[{"i":["AAABBC"],"o":{"words":["3A2B1C"],"cs":true},"h":false},{"i":["WWWWBWW"],"o":{"words":["4W1B2W"],"cs":true},"h":false},{"i":["Z"],"o":{"words":["1Z"],"cs":true},"h":true},{"i":["ABAB"],"o":{"words":["1A1B1A1B"],"cs":true},"h":true}],"req":["loop"],"hints":["Count how many times the current character repeats before it changes.","Build the answer as a string: `out += str(count) + ch`."]},{"id":"advgrid","title":"Times-table grid","level":3,"brief":"Ask for n and print an n × n multiplication grid, one row per line with numbers separated by spaces, e.g. for 3: `1 2 3`, `2 4 6`, `3 6 9`.","starter":"n = int(input(\"Size: \"))\n","tests":[{"i":["3"],"o":{"lines":["1 2 3","2 4 6","3 6 9"]},"h":false},{"i":["1"],"o":{"lines":["1"]},"h":true},{"i":["4"],"o":{"lines":["1 2 3 4","2 4 6 8","3 6 9 12","4 8 12 16"]},"h":true}],"req":["loop"],"hints":["Use one loop for the rows and another loop inside it for the columns.","`print(a, b, c)` puts spaces between values; `\" \".join(list)` does too."]},{"id":"advanagram","title":"Anagram checker","level":3,"brief":"Write `is_anagram(a, b)` that returns `True` if the two phrases use exactly the same letters, ignoring capitals and spaces.","starter":"def is_anagram(a, b):\n    pass\n","tests":[{"call":"is_anagram(\"listen\", \"silent\")","ret":"True","h":false},{"call":"is_anagram(\"hello\", \"world\")","ret":"False","h":false},{"call":"is_anagram(\"Dormitory\", \"Dirty room\")","ret":"True","h":true},{"call":"is_anagram(\"aab\", \"abb\")","ret":"False","h":true},{"call":"is_anagram(\"\", \"\")","ret":"True","h":true}],"req":["def:is_anagram","return"],"hints":["Remove spaces and make everything lower case first.","Two words are anagrams if their sorted letters are the same."]},{"id":"advprimes","title":"Primes up to n","level":3,"brief":"Ask for a number n and print every prime number from 2 up to n (inclusive).","starter":"n = int(input(\"Up to: \"))\n","tests":[{"i":["20"],"o":{"nums":[2,3,5,7,11,13,17,19],"mode":"subseq","slack":2},"h":false},{"i":["10"],"o":{"nums":[2,3,5,7],"mode":"subseq","slack":2},"h":false},{"i":["2"],"o":{"nums":[2],"mode":"subseq","slack":2},"h":true},{"i":["30"],"o":{"nums":[2,3,5,7,11,13,17,19,23,29],"mode":"subseq","slack":2},"h":true}],"req":["loop"],"hints":["Check each number from 2 to n in turn.","A number is prime if nothing from 2 up to its square root divides it exactly."]},{"id":"advhex","title":"Denary to hex","level":3,"brief":"Write `to_hex(n)` that returns n (0 or more) as a hexadecimal string in capitals, e.g. `255` → `\"FF\"`. Don't use `hex()` or `format()`.","starter":"def to_hex(n):\n    digits = \"0123456789ABCDEF\"\n","tests":[{"call":"to_hex(255)","ret":"\"FF\"","h":false},{"call":"to_hex(16)","ret":"\"10\"","h":false},{"call":"to_hex(0)","ret":"\"0\"","h":true},{"call":"to_hex(171)","ret":"\"AB\"","h":true},{"call":"to_hex(4096)","ret":"\"1000\"","h":true}],"req":["def:to_hex","loop","no:hex","no:format"],"hints":["`n % 16` gives the last hex digit; `n // 16` moves to the next.","Don't forget the special case of 0."]},{"id":"advmerge","title":"Merge sorted lists","level":3,"brief":"Write `merge(a, b)` that takes two lists already in ascending order and returns one list with every item in ascending order. Don't use `sorted()` or `.sort()`: this is the merge step of merge sort.","starter":"def merge(a, b):\n    result = []\n    i = 0\n    j = 0\n","tests":[{"call":"merge([1, 4, 9], [2, 3, 10])","ret":"[1, 2, 3, 4, 9, 10]","h":false},{"call":"merge([], [1, 2])","ret":"[1, 2]","h":false},{"call":"merge([5], [])","ret":"[5]","h":true},{"call":"merge([1, 1], [1])","ret":"[1, 1, 1]","h":true}],"req":["def:merge","loop","no:sorted","no:sort"],"hints":["Compare the front item of each list and take the smaller one.","When one list runs out, add everything left in the other."]},{"id":"advwords","title":"Most common word","level":3,"brief":"Write `most_common_word(sentence)` that returns the word used most often, in lower case. If there's a tie, return the one that appears first.","starter":"def most_common_word(sentence):\n    counts = {}\n","tests":[{"call":"most_common_word(\"the cat and the hat\")","ret":"\"the\"","h":false},{"call":"most_common_word(\"Red blue RED green\")","ret":"\"red\"","h":false},{"call":"most_common_word(\"one two\")","ret":"\"one\"","h":true},{"call":"most_common_word(\"b a a b b\")","ret":"\"b\"","h":true}],"req":["def:most_common_word","return"],"hints":["A dictionary can count each word: `counts[w] = counts.get(w, 0) + 1`.","Loop through the words in order so ties go to the earliest."]},{"id":"advstrength","title":"Password strength","level":3,"brief":"Write `strength(p)` that scores a password on four rules: at least 8 characters, contains a digit, contains a capital letter, contains a symbol (not a letter or digit). Return `\"weak\"` for 0–1 rules, `\"medium\"` for 2–3 and `\"strong\"` for all 4.","starter":"def strength(p):\n    score = 0\n","tests":[{"call":"strength(\"abc\")","ret":"\"weak\"","h":false,"cs":false},{"call":"strength(\"abcdefgh1\")","ret":"\"medium\"","h":false,"cs":false},{"call":"strength(\"Abcdefg1!\")","ret":"\"strong\"","h":false,"cs":false},{"call":"strength(\"ABC!\")","ret":"\"medium\"","h":true,"cs":false},{"call":"strength(\"password\")","ret":"\"weak\"","h":true,"cs":false},{"call":"strength(\"P4ss!\")","ret":"\"medium\"","h":true,"cs":false}],"req":["def:strength","return"],"hints":["Add 1 to `score` for each rule the password meets.","`c.isdigit()`, `c.isupper()` and `c.isalnum()` test single characters."]},{"id":"advdigits","title":"Recursive digit sum","level":3,"brief":"Write `digit_sum(n)` that returns the sum of the digits of n (e.g. 1234 → 10) using recursion: the function must call itself.","starter":"def digit_sum(n):\n    pass\n","tests":[{"call":"digit_sum(1234)","ret":"10","h":false},{"call":"digit_sum(9)","ret":"9","h":false},{"call":"digit_sum(0)","ret":"0","h":true},{"call":"digit_sum(99999)","ret":"45","h":true},{"call":"digit_sum(1000)","ret":"1","h":true}],"req":["def:digit_sum","recursive:digit_sum"],"hints":["Base case: a single digit is its own sum.","`n % 10` is the last digit and `n // 10` is the rest."]}]}]};
BW.CODE.all = BW.CODE.sections.flatMap(s => s.items.map(c => ({ ...c, kind: c.kind || s.kind || null, section: s })));
BW.findChallenge = id => BW.CODE.all.find(c => c.id === id);
})();

/* ---- src/widgets.js ---- */
/* Interactive question widgets: bits · order · match · sort · gate · tt */
BW.initWS = q => {
  switch (q.type) {
    case "bits": return { bits: Array(q.answer.length).fill(0) };
    case "order": { let o = q.start ? q.start.slice() : BW.shuffle(q.items); let g = 0; while (!q.start && o.join("\u0001") === q.items.join("\u0001") && g++ < 9) o = BW.shuffle(q.items); return { order: o, sel: null }; }
    case "match": return { right: BW.shuffle(q.pairs.map(p => p[1])), link: {}, selL: null, selR: null };
    case "sort": return { place: {}, sel: null };
    case "gate": return { env: Object.fromEntries(q.vars.map(v => [v, 0])) };
    case "tt": return { out: Array(1 << q.vars.length).fill(null) };
  }
  return {};
};
BW.ttRows = vs => Array.from({ length: 1 << vs.length }, (_, i) => Object.fromEntries(vs.map((v, j) => [v, (i >> (vs.length - 1 - j)) & 1])));
BW.wsReady = (q, ws) => q.type === "match" ? Object.keys(ws.link).length === q.pairs.length : q.type === "sort" ? Object.keys(ws.place).length === q.items.length : q.type === "tt" ? ws.out.every(v => v !== null) : true;
BW.wsCheck = (q, ws) => {
  switch (q.type) {
    case "bits": return ws.bits.join("") === q.answer;
    case "order": return ws.order.join("\u0001") === q.items.join("\u0001");
    case "match": return q.pairs.every((p, i) => ws.right[ws.link[i]] === p[1]);
    case "sort": return q.items.every((it, i) => ws.place[i] === it[1]);
    case "gate": return BW.evalTree(q.tree, ws.env) === q.target;
    case "tt": return ws.out.join("") === q.answer;
  }
  return false;
};

const PAIR_COLS = 6;
BW.renderWidget = (q, ws, fin) => {
  const E = BW.esc, F = BW.fmt;
  if (q.type === "bits") {
    const w = q.answer.length, val = parseInt(ws.bits.join(""), 2);
    const row = (arr, cls, click) => `<div class="bitrow ${cls}">${arr.map((b, i) => `<button class="bit ${+b ? "on" : ""} ${fin && click ? (String(b) === q.answer[i] ? "" : "bad") : ""}" ${click ? `data-bit="${i}"` : ""} aria-pressed="${!!+b}" aria-label="Bit worth ${1 << (w - 1 - i)}" ${fin || !click ? "disabled" : ""}><small>${1 << (w - 1 - i)}</small><b>${b}</b></button>`).join("")}</div>`;
    return row(ws.bits, "", true) + (q.showSum && !fin ? `<div class="bitsum">Value: <b class="num">${val}</b></div>` : "")
      + (fin && ws.bits.join("") !== q.answer ? `<p class="k" style="margin-top:12px">Correct answer</p>${row(q.answer.split(""), "ghost", false)}` : "");
  }
  if (q.type === "order") {
    return `<ol class="olist">${ws.order.map((it, i) => `<li class="oitem ${ws.sel === i ? "sel" : ""} ${fin ? (it === q.items[i] ? "good" : "bad") : ""}" ${fin ? "" : `draggable="true" data-oi="${i}" tabindex="0"`}>
      <span class="grip" aria-hidden="true">⋮⋮</span><span class="otext">${F(it)}</span>${fin ? "" : `<span class="oarrows"><button data-up="${i}" aria-label="Move up" ${i === 0 ? "disabled" : ""}>↑</button><button data-down="${i}" aria-label="Move down" ${i === ws.order.length - 1 ? "disabled" : ""}>↓</button></span>`}</li>`).join("")}</ol>
      ${fin ? "" : `<p class="note">Drag items, use the arrows, or tap one item then tap where it should go.</p>`}`;
  }
  if (q.type === "match") {
    const leftOf = j => { for (const k in ws.link) if (ws.link[k] === j) return +k; return null; };
    return `<div class="match"><div class="mcol">${q.pairs.map((p, i) => { const l = ws.link[i] != null; const ok = fin && ws.right[ws.link[i]] === p[1];
      return `<button class="mitem ${ws.selL === i ? "sel" : ""} ${l ? "linked pc" + (i % PAIR_COLS) : ""} ${fin ? (ok ? "good" : "bad") : ""}" data-ml="${i}" ${fin ? "disabled" : ""} draggable="${!fin}">${l ? `<i class="pairno">${i + 1}</i>` : ""}${F(p[0])}</button>`; }).join("")}</div>
      <div class="mcol">${ws.right.map((r, j) => { const li = leftOf(j);
      return `<button class="mitem ${ws.selR === j ? "sel" : ""} ${li != null ? "linked pc" + (li % PAIR_COLS) : ""}" data-mr="${j}" ${fin ? "disabled" : ""}>${li != null ? `<i class="pairno">${li + 1}</i>` : ""}${F(r)}</button>`; }).join("")}</div></div>
      ${fin ? "" : `<p class="note">Tap an item on the left, then its partner on the right. Tap a matched item to undo.</p>`}`;
  }
  if (q.type === "sort") {
    const chip = i => { const it = q.items[i], placed = ws.place[i] != null;
      return `<button class="schip ${ws.sel === i ? "sel" : ""} ${fin ? (ws.place[i] === it[1] ? "good" : "bad") : ""}" data-si="${i}" draggable="${!fin}" ${fin ? "disabled" : ""} aria-label="${E(it[0])}${placed ? ", in " + E(q.buckets[ws.place[i]]) : ""}">${F(it[0])}</button>`; };
    const pool = q.items.map((_, i) => i).filter(i => ws.place[i] == null);
    return `${fin ? "" : `<div class="pool" data-bk="pool">${pool.map(chip).join("") || `<span class="muted">All sorted. Check your answer.</span>`}</div>`}
      <div class="buckets" style="--n:${q.buckets.length}">${q.buckets.map((b, k) => `<div class="bucket ${ws.sel != null && !fin ? "ready" : ""}" data-bk="${k}" role="button" tabindex="${fin ? -1 : 0}" aria-label="Put in ${E(b)}"><div class="bhead">${E(b)}</div><div class="bitems">${q.items.map((_, i) => i).filter(i => ws.place[i] === k).map(chip).join("")}</div></div>`).join("")}</div>
      ${fin ? "" : `<p class="note">Tap a card then a group, or drag it. Tap a placed card to take it back.</p>`}`;
  }
  if (q.type === "gate") {
    return `<div class="gatebox"><div class="switches">${q.vars.map(v => `<button class="swt ${ws.env[v] ? "on" : ""}" data-sw="${v}" aria-pressed="${!!ws.env[v]}" ${fin ? "disabled" : ""}><span class="knob"></span>${v} = <b>${ws.env[v]}</b></button>`).join("")}</div>
      <div class="circuit">${BW.circuitSVG(q.tree, ws.env, fin)}</div><p class="note mono">Q = ${E(q.expr)}</p></div>`;
  }
  if (q.type === "tt") {
    const rows = BW.ttRows(q.vars);
    return `<div class="tt-wrap"><table class="ttable"><thead><tr>${q.vars.map(v => `<th>${v}</th>`).join("")}<th class="q">Q</th></tr></thead><tbody>${rows.map((r, i) => `<tr>${q.vars.map(v => `<td>${r[v]}</td>`).join("")}<td class="q"><button class="ttcell ${ws.out[i] == null ? "" : "set"} ${fin ? (String(ws.out[i]) === q.answer[i] ? "good" : "bad") : ""}" data-tt="${i}" ${fin ? "disabled" : ""} aria-label="Output for row ${i + 1}">${ws.out[i] == null ? "?" : ws.out[i]}</button></td></tr>`).join("")}</tbody></table></div>`;
  }
  return "";
};

BW.bindWidget = (root, q, ws, rerender) => {
  const on = (sel, fn) => root.querySelectorAll(sel).forEach(el => el.addEventListener("click", e => { e.stopPropagation(); fn(el, e); BW.sfx.play("click"); rerender(); }));
  const move = (from, to) => { if (from === to) return; const [x] = ws.order.splice(from, 1); ws.order.splice(to, 0, x); };
  if (q.type === "bits") on("[data-bit]", el => { const i = +el.dataset.bit; ws.bits[i] = 1 - ws.bits[i]; });
  if (q.type === "order") {
    on("[data-up]", el => move(+el.dataset.up, +el.dataset.up - 1));
    on("[data-down]", el => move(+el.dataset.down, +el.dataset.down + 1));
    on("[data-oi]", el => { const i = +el.dataset.oi; if (ws.sel == null) ws.sel = i; else { move(ws.sel, i); ws.sel = null; } });
    root.querySelectorAll("[data-oi]").forEach(el => {
      el.addEventListener("dragstart", e => { e.dataTransfer.setData("text/plain", el.dataset.oi); el.classList.add("dragging"); });
      el.addEventListener("dragover", e => { e.preventDefault(); el.classList.add("over"); });
      el.addEventListener("dragleave", () => el.classList.remove("over"));
      el.addEventListener("drop", e => { e.preventDefault(); move(+e.dataTransfer.getData("text/plain"), +el.dataset.oi); ws.sel = null; rerender(); });
    });
  }
  if (q.type === "match") {
    const link = (i, j) => { for (const k in ws.link) if (ws.link[k] === j) delete ws.link[k]; ws.link[i] = j; ws.selL = ws.selR = null; };
    on("[data-ml]", el => { const i = +el.dataset.ml; if (ws.link[i] != null && ws.selR == null) { delete ws.link[i]; ws.selL = null; return; } if (ws.selR != null) link(i, ws.selR); else ws.selL = ws.selL === i ? null : i; });
    on("[data-mr]", el => { const j = +el.dataset.mr; const linkedTo = Object.keys(ws.link).find(k => ws.link[k] === j);
      if (ws.selL != null) link(ws.selL, j); else if (linkedTo != null) delete ws.link[linkedTo]; else ws.selR = ws.selR === j ? null : j; });
    root.querySelectorAll("[data-ml]").forEach(el => el.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", el.dataset.ml)));
    root.querySelectorAll("[data-mr]").forEach(el => { el.addEventListener("dragover", e => e.preventDefault());
      el.addEventListener("drop", e => { e.preventDefault(); link(+e.dataTransfer.getData("text/plain"), +el.dataset.mr); rerender(); }); });
  }
  if (q.type === "sort") {
    root.querySelectorAll("[data-si]").forEach(el => {
      el.addEventListener("click", e => { e.stopPropagation(); const i = +el.dataset.si; if (ws.place[i] != null) { delete ws.place[i]; ws.sel = null; } else ws.sel = ws.sel === i ? null : i; BW.sfx.play("click"); rerender(); });
      el.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", el.dataset.si));
    });
    root.querySelectorAll("[data-bk]").forEach(el => {
      const put = i => { if (el.dataset.bk === "pool") delete ws.place[i]; else ws.place[i] = +el.dataset.bk; ws.sel = null; BW.sfx.play("click"); rerender(); };
      el.addEventListener("click", () => { if (ws.sel != null) put(ws.sel); });
      el.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && ws.sel != null) { e.preventDefault(); put(ws.sel); } });
      el.addEventListener("dragover", e => e.preventDefault());
      el.addEventListener("drop", e => { e.preventDefault(); put(+e.dataTransfer.getData("text/plain")); });
    });
  }
  if (q.type === "gate") on("[data-sw]", el => { const v = el.dataset.sw; ws.env[v] = 1 - ws.env[v]; });
  if (q.type === "tt") on("[data-tt]", el => { const i = +el.dataset.tt; ws.out[i] = ws.out[i] == null ? 0 : 1 - ws.out[i]; });
};

/* ---- logic circuit drawing ---- */
BW.circuitSVG = (tree, env, live) => {
  let row = 0;
  const depth = n => n.v ? 0 : 1 + Math.max(...n.k.map(depth)), D = depth(tree);
  const colW = 108, rowH = 58, X0 = 30, Y0 = 34;
  const place = (n, level) => {
    if (n.v) return { n, x: X0, y: Y0 + (row++) * rowH, leaf: true };
    const kids = n.k.map(k => place(k, level + 1));
    return { n, kids, x: X0 + 40 + (D - level) * colW - colW / 2, y: kids.reduce((a, k) => a + k.y, 0) / kids.length };
  };
  const root = place(tree, 0), W = X0 + 40 + D * colW + 70, H = Y0 + (row - 1) * rowH + 34;
  const val = n => BW.evalTree(n, env), wc = v => live ? (v ? "w1" : "w0") : "wn";
  let out = "";
  const outPt = p => p.leaf ? [p.x + 13, p.y] : [p.x + (p.n.op === "AND" ? 13 : p.n.op === "OR" ? 19 : 17), p.y];
  const draw = p => {
    if (p.leaf) { out += `<g class="leaf ${live && env[p.n.v] ? "on" : ""}"><circle cx="${p.x}" cy="${p.y}" r="13"/><text x="${p.x}" y="${p.y + 5}">${p.n.v}</text></g>`; return; }
    const { x, y } = p, op = p.n.op, ins = op === "NOT" ? [[x - 18, y]] : [[x - 20, y - 9], [x - 20, y + 9]];
    p.kids.forEach((k, i) => { draw(k); const [ox, oy] = outPt(k), [ix, iy] = ins[i], mx = ix - 10 - i * 6;
      out += `<path class="wire ${wc(val(k.n))}" d="M${ox} ${oy} H${mx} V${iy} H${ix}"/>`; });
    const shape = op === "AND" ? `<path d="M${x - 20} ${y - 15} h18 a15 15 0 0 1 0 30 h-18 z"/>`
      : op === "OR" ? `<path d="M${x - 22} ${y - 15} q12 15 0 30 q28 0 41 -15 q-13 -15 -41 -15 z"/>`
      : `<path d="M${x - 18} ${y - 12} L${x + 8} ${y} L${x - 18} ${y + 12} z"/><circle cx="${x + 12.5}" cy="${y}" r="4.5"/>`;
    out += `<g class="gate">${shape}<text x="${x - (op === "NOT" ? 8 : 5)}" y="${y + 3.5}">${op}</text></g>`;
  };
  draw(root);
  const [ox, oy] = outPt(root), q = val(root.n);
  out += `<path class="wire ${wc(q)}" d="M${ox} ${oy} H${W - 30}"/><g class="lamp ${live && q ? "lit" : ""}"><circle cx="${W - 20}" cy="${oy}" r="14"/><text x="${W - 20}" y="${oy + 5}">Q</text></g>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Logic circuit for the expression">${out}</svg>`;
};

/* ---- src/fb.js ---- */
/* Firebase data layer (Auth + Firestore). Keeps the same operations the screens used before (BW.api.rpc / BW.api.fn / BW.db),
   now implemented against Firestore, with the security rules in firebase/firestore.rules doing the server's checking. */
BW.fbApp = firebase.initializeApp(BW.CONFIG.firebase);
BW.auth = firebase.auth();
BW.fs = firebase.firestore();
// plain HTTP requests instead of a streaming connection: school proxies, filters and some browsers stall the stream,
// which left the loading screen spinning until a refresh
BW.fs.settings({ experimentalForceLongPolling: true, experimentalAutoDetectLongPolling: false });
const FV = firebase.firestore.FieldValue;
const col = (...p) => BW.fs.collection(p.join("/"));
const ref = (...p) => BW.fs.doc(p.join("/"));
const ts = v => v && typeof v.toDate === "function" ? v.toDate().toISOString() : v ?? null;
const utcDay = d => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
/* A request that never answers (a sleeping laptop, flaky school Wi-Fi) shouldn't leave a page spinning for ever */
BW.withTimeout = (p, ms = 20000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => { const e = new Error("timeout"); e.code = "timeout"; rej(e); }, ms))]);
/* After the tab has been asleep or the network dropped, Firestore can sit in a long back-off before reconnecting,
   which is what made pages hang until a refresh. Reconnect straight away instead. */
BW.reconnect = () => BW.fs.disableNetwork().then(() => BW.fs.enableNetwork()).catch(() => { });
{ let hiddenAt = 0;
  document.addEventListener("visibilitychange", () => { if (document.hidden) hiddenAt = Date.now(); else if (hiddenAt && Date.now() - hiddenAt > 20000) BW.reconnect(); });
  addEventListener("online", BW.reconnect); }
const newId = () => BW.fs.collection("_").doc().id;
const CODE_ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const randCode = n => { const a = new Uint32Array(n); crypto.getRandomValues(a); return [...a].map(x => CODE_ABC[x % 32]).join(""); };
const AVATARS = ["#5B4BD5", "#1F7A8C", "#B0306E", "#C2410C", "#167A4B", "#2563EB", "#B3261E", "#6D28D9"];

const ERRORS = {
  "auth/invalid-credential": "That email or username and password don't match.",
  "auth/wrong-password": "That email or username and password don't match.",
  "auth/user-not-found": "That email or username and password don't match.",
  "auth/invalid-email": "That doesn't look like an email address or username.",
  "auth/email-already-in-use": "There's already an account with that email. Try signing in.",
  "auth/weak-password": "Use a longer password: at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
  "auth/requires-recent-login": "For your security, sign in again and then retry.",
  "auth/network-request-failed": "Can't reach Bitwise. Check your internet connection.",
  timeout: "This is taking too long. Check your connection and try again.",
  not_saved: "Couldn't reach Bitwise. Check your connection, then check your code again.",
  unavailable: "Can't reach Bitwise. Check your internet connection.",
  "auth/operation-not-allowed": "Email sign-in isn't switched on for this Bitwise project yet.",
  "auth/configuration-not-found": "Sign-in isn't set up for this Bitwise project yet (Firebase console → Authentication → Get started).",
  "permission-denied": "You don't have permission to do that.",
  bad_code: "That class code doesn't match an open class. Check it with your teacher.",
  own_class: "That's your own class, so you're already in it as the teacher.",
  bad_teacher_code: "That teacher code isn't right. Ask your school's Bitwise admin for it.",
  managed_locked: "Your school manages this account, so ask your teacher to make that change.",
  too_fast: "That quiz was finished too quickly to count, so it wasn't saved.",
  spark_no_reset: "School login passwords can't be reset. Use the login card from when the account was made, or remove the student from your school and create a new login.",
  not_found: "That couldn't be found. It may have been deleted.",
  forbidden: "You don't have access to that."
};
BW.errMsg = e => {
  const code = e?.code || "", m = (e && (e.message || e.error)) || String(e);
  for (const k in ERRORS) if (code === k || code.endsWith("/" + k) || m.includes(k)) return ERRORS[k];
  if (code === "permission-denied" || /insufficient permissions/i.test(m)) return ERRORS["permission-denied"];
  return /fetch|network|offline/i.test(m) ? "Can't reach Bitwise. Check your internet connection." : m;
};
const fail = code => { const e = new Error(code); e.code = code; throw e; };

/* ---------- shape converters (Firestore → the shapes the screens use) ---------- */
BW.toProfile = (id, d) => ({ id, role: d.role, display_name: d.displayName, avatar_color: d.avatarColor, school_id: d.schoolId || null, managed: !!d.managed,
  username: d.username || null, class_ids: d.classIds || [], xp: d.xp || 0, week_xp: d.weekXp || 0, week_key: d.weekKey || "", streak: d.streak || 0,
  best_streak: d.bestStreak || 0, last_day: d.lastDay ? BW.londonDay(d.lastDay.toDate()) : null, last_day_ts: d.lastDay || null, prefs: d.prefs || {}, created_by: d.createdBy || null });
BW.toClass = (id, d) => ({ id, name: d.name, join_code: d.joinCode, show_leaderboard: !!d.showLeaderboard, archived: !!d.archived, teacher_id: d.teacherId, school_id: d.schoolId, created_at: ts(d.createdAt) });
BW.toTask = (id, cid, d) => ({ id, class_id: cid, title: d.title, instructions: d.instructions || "", quiz_ids: d.quizIds, target_pct: d.targetPct, due_at: ts(d.dueAt), created_at: ts(d.createdAt) });
BW.ansRow = (a, i) => ({ seq: a.seq ?? i + 1, q_code: a.code || "", q_type: a.type, q_key: a.key || "", q_text: a.text || "", topic: a.topic || "", answer: a.answer || "",
  correct_answer: a.correct || "", is_correct: !!a.ok, try_no: a.try || 1, ms: a.ms || 0, detail: a.detail || null });

/* ---------- auth ---------- */
BW.api = {
  loginEmail: id => id.includes("@") ? id.trim() : `${id.trim().toLowerCase()}@${BW.CONFIG.pupilDomain}`,
  async signIn(id, pw) { await BW.auth.signInWithEmailAndPassword(BW.api.loginEmail(id), pw); },
  async signOut() { await BW.auth.signOut(); },
  async resetEmail(email) { await BW.auth.sendPasswordResetEmail(email.trim(), { url: location.origin + location.pathname }); },
  async changePassword(pw) { if (BW.S.profile?.managed) fail("managed_locked"); await BW.auth.currentUser.updatePassword(pw); },
  /* sign up: a student, a teacher joining a school with its teacher code, or a teacher creating a new school */
  async signUp({ email, password, name, role, teacherCode, schoolName }) {
    const cred = await BW.auth.createUserWithEmailAndPassword(email.trim(), password);
    const uid = cred.user.uid, batch = BW.fs.batch();
    const profile = { role: "student", displayName: name.slice(0, 40), avatarColor: BW.pick(AVATARS), schoolId: null, managed: false, classIds: [],
      xp: 0, weekXp: 0, weekKey: "", streak: 0, bestStreak: 0, lastDay: null, prefs: {}, createdAt: FV.serverTimestamp() };
    try {
      if (role === "teacher" && schoolName) {
        const sid = newId(), code = `${randCode(5)}-${randCode(5)}`;
        batch.set(ref("teacherCodes", code), { schoolId: sid });
        batch.set(ref("schools", sid), { name: schoolName.slice(0, 80), createdBy: uid, createdAt: FV.serverTimestamp(), teacherCode: code });
        Object.assign(profile, { role: "teacher", schoolId: sid });
      } else if (role === "teacher") {
        const snap = await ref("teacherCodes", teacherCode.trim().toUpperCase()).get();
        if (!snap.exists) fail("bad_teacher_code");
        Object.assign(profile, { role: "teacher", schoolId: snap.data().schoolId, teacherCode: teacherCode.trim().toUpperCase() });
      }
      batch.set(ref("users", uid), profile);
      await batch.commit();
    } catch (e) { await cred.user.delete().catch(() => { }); throw e; }   // don't leave a login with no profile behind
    cred.user.sendEmailVerification({ url: location.origin + location.pathname }).catch(() => { });
    return uid;
  }
};

/* ---------- loading a signed-in person's world ----------
   Everything that doesn't depend on the profile starts at the same time as the profile, so a student's home page
   needs three quick round trips and small downloads (attempt documents hold every answer, so only a few are fetched). */
const attemptLite = d => { const x = d.data(); return { id: d.id, quizId: x.quizId, pct: x.pct, xp: x.xp, finishedAt: ts(x.finishedAt) }; };
const quiet = p => p.catch(() => null);
const classBundle = cid => Promise.all([quiet(ref("classes", cid).get()), quiet(col("classes", cid, "tasks").get()),
  quiet(col("classes", cid, "notices").orderBy("createdAt", "desc").limit(50).get()), quiet(col("classes", cid, "resubs").where("uid", "==", BW.S.user.id).get())]);
/* a student's classes, tasks, notices and redo requests from the per-class downloads */
const applyStudent = async (got, reads) => {
  const S = BW.S;
  S.classes = got.filter(([c]) => c?.exists).map(([c]) => BW.toClass(c.id, c.data()));
  const live = new Set(S.classes.filter(c => !c.archived).map(c => c.id)), name = cid => S.classes.find(c => c.id === cid)?.name || "", ok = c => c?.exists && live.has(c.id);
  S.rawTasks = got.flatMap(([c, t]) => ok(c) && t ? t.docs.map(d => ({ ...BW.toTask(d.id, c.id, d.data()), class_name: name(c.id) })) : []);
  S.resubs = Object.fromEntries(got.flatMap(([c, , , r]) => ok(c) && r ? r.docs.map(d => [d.data().taskId, { ...BW.resubRow(d), class_name: name(c.id) }]) : []));
  const read = new Set((reads?.docs || []).map(d => d.id));
  const redo = Object.values(S.resubs).filter(r => S.rawTasks.some(t => t.id === r.task_id)).map(r => { const id = `redo_${r.id}_${Date.parse(r.requested_at) || 0}`;
    return { id, title: `Please redo: ${r.task_title}`, body: r.reason || "Your teacher has asked you to have another go at this task.", author_name: r.teacher_name, created_at: r.requested_at,
      pinned: false, classes: [r.class_name], read: read.has(id), redo: r.task_id }; });
  S.notices = [...redo, ...BW.buildNotices(got.flatMap(([c, , n]) => ok(c) && n ? n.docs.map(d => ({ id: d.id, ...d.data(), created_at: ts(d.data().createdAt), class_name: name(c.id) })) : []), read)]
    .sort((a, b) => (b.pinned - a.pinned) || (b.created_at || "").localeCompare(a.created_at || ""));
  S.taskAtts = await BW.loadTaskAttempts(S.rawTasks);
  S.tasks = BW.buildTasks();
};
BW.loadAll = async () => {
  const S = BW.S, uid = S.user.id, mine = n => col("users", uid, n);
  const early = Promise.all([mine("best").get(), mine("badges").get(),
    mine("attempts").where("status", "==", "done").orderBy("finishedAt", "desc").limit(40).get(), quiet(mine("reads").get())]);
  early.catch(() => { });
  const psnap = await ref("users", uid).get();
  if (!psnap.exists) fail(S.user.email?.endsWith("@" + BW.CONFIG.pupilDomain) ? "removed_from_school" : "no_profile");
  const profile = BW.toProfile(uid, psnap.data()), teacher = profile.role === "teacher";
  const second = teacher ? Promise.all([col("classes").where("teacherId", "==", uid).get(), profile.school_id ? quiet(ref("schools", profile.school_id).get()) : null])
    : Promise.all(profile.class_ids.map(classBundle));
  const [[best, badges, hist, reads], got] = await Promise.all([early, second]);
  S.profile = profile;
  S.best = Object.fromEntries(best.docs.map(d => [d.id, { pct: +d.data().pct, tries: d.data().tries, last: ts(d.data().lastAt) }]));
  S.badges = Object.fromEntries(badges.docs.map(d => [d.id, ts(d.data().earnedAt)]));
  S.hist = hist.docs.map(attemptLite).map(a => ({ quiz_id: a.quizId, pct: a.pct, xp: a.xp, finished_at: a.finishedAt }));
  S.loadedAt = Date.now();
  if (teacher) {
    const [cls, school] = got;
    S.classes = cls.docs.map(d => BW.toClass(d.id, d.data())).sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
    S.school = school?.exists ? { id: school.id, ...school.data(), created_at: ts(school.data().createdAt) } : null;
    S.rawTasks = []; S.tasks = []; S.notices = []; S.taskAtts = {};
    return;
  }
  S.school = null;
  await applyStudent(got, reads);
};
/* attempts on the items of the student's tasks (only since each task was set), fetched 30 quizzes at a time */
BW.loadTaskAttempts = async tasks => {
  const since = {};
  tasks.forEach(t => t.quiz_ids.forEach(q => { const c = t.created_at || "2000-01-01T00:00:00.000Z"; if (!since[q] || c < since[q]) since[q] = c; }));
  const ids = Object.keys(since), out = Object.fromEntries(ids.map(q => [q, []]));
  const groups = []; for (let i = 0; i < ids.length; i += 30) groups.push(ids.slice(i, i + 30));
  await Promise.all(groups.map(async g => {
    const from = new Date(g.map(q => since[q]).sort()[0]);
    const snap = await col("users", BW.S.user.id, "attempts").where("quizId", "in", g).where("finishedAt", ">=", from).orderBy("finishedAt", "desc").limit(500).get();
    snap.docs.map(attemptLite).forEach(a => out[a.quizId].push(a));
  }));
  return out;
};
/* the student's tasks with progress on every item, worked out locally */
BW.buildTasks = () => {
  const S = BW.S, atts = S.taskAtts || {};
  return (S.rawTasks || []).map(t => {
    const r = S.resubs?.[t.id], sinceOf = q => r && r.quiz_ids.includes(q) && (r.requested_at || "") > (t.created_at || "") ? r.requested_at : t.created_at || "";
    const items = t.quiz_ids.map(q => { const since = sinceOf(q), mine = (atts[q] || []).filter(a => a.finishedAt >= since);
      const passed = mine.filter(a => a.pct * 100 >= t.target_pct).map(a => a.finishedAt).sort();
      return { quiz_id: q, best: mine.length ? Math.max(...mine.map(a => a.pct)) : null, tries: mine.length, completed_at: passed[0] || null }; });
    const itemsDone = items.filter(i => i.completed_at).length, tries = items.reduce((s, i) => s + i.tries, 0);
    return { ...t, resub: r || null, items, items_done: itemsDone, tries, best: tries ? items.reduce((s, i) => s + (i.best || 0), 0) / items.length : null,
      completed_at: itemsDone === items.length ? items.map(i => i.completed_at).sort().pop() : null };
  }).sort((a, b) => (a.due_at || "9999").localeCompare(b.due_at || "9999") || (b.created_at || "").localeCompare(a.created_at || ""));
};
BW.computeTasks = async () => { await BW.refreshStudent(true); return BW.S.tasks; };
BW.refreshTasks = async () => { if (!BW.isTeacher()) BW.S.tasks = BW.buildTasks(); };   // after a quiz: no downloads needed
/* new homework and notices while the app is open: re-check at most every couple of minutes */
BW.refreshStudent = async force => {
  const S = BW.S; if (BW.isTeacher() || !S.profile || (!force && Date.now() - (S.loadedAt || 0) < 120000)) return false;
  S.loadedAt = Date.now();
  const [psnap, reads] = await Promise.all([ref("users", S.user.id).get(), quiet(col("users", S.user.id, "reads").get())]);
  if (!psnap.exists) return false;
  const profile = BW.toProfile(S.user.id, psnap.data()), got = await Promise.all(profile.class_ids.map(classBundle));   // picks up classes a teacher has just added
  S.profile = profile;
  await applyStudent(got, reads);
  return true;
};

/* ---------- attempts: start, and finish with the exact XP the rules will check ---------- */
BW.quizMult = q => /\.0$/.test(q) ? 1.0 : /\.1$/.test(q) ? 1.2 : /\.2$/.test(q) ? 1.5 : /\.3$/.test(q) ? 2.0 : /\.boss$/.test(q) ? 1.8 : /^daily\./.test(q) ? 1.5 : /^code\./.test(q) ? 1.5 : 1.2;
BW.startAttempt = async (quizId, assignmentId) => {
  const r = col("users", BW.S.user.id, "attempts").doc();
  await BW.withTimeout(r.set({ quizId, assignmentId: assignmentId || null, status: "open", startedAt: FV.serverTimestamp() }));
  (BW.openAttempts = BW.openAttempts || {})[r.id] = quizId;
  return r.id;
};
BW.finishAttempt = async ({ id, total, correct, maxCombo = 0, answers = [], activeMs = 0 }) => {
  const S = BW.S, uid = S.user.id, attemptRef = ref("users", uid, "attempts", id);
  // read everything the score depends on in one go (we already know which quiz this attempt is for)
  const reads = q => Promise.all([ref("users", uid, "best", q).get(), q.startsWith("daily.") ? ref("users", uid, "daily", q).get() : null]);
  const hint = BW.openAttempts?.[id];
  let [att, prof, [bestSnap, dailySnap]] = await BW.withTimeout(Promise.all([attemptRef.get(), ref("users", uid).get(), hint ? reads(hint) : [null, null]]));
  if (!att.exists) fail("not_found");
  if (att.data().status === "done") {   // an earlier save that timed out on our side actually reached the server
    const a = att.data(), p = prof.data();
    return { xp_gain: a.xp, xp: p.xp, week_xp: p.weekXp, streak: p.streak, pct: a.pct, pass: a.correct * 5 >= a.total * 4, first_daily: false, badges: [] };
  }
  const quizId = att.data().quizId, mult = BW.quizMult(quizId), pct = correct / total, pass = correct * 5 >= total * 4;
  if (quizId !== hint) [bestSnap, dailySnap] = await reads(quizId);
  const p = prof.data(), prevBest = bestSnap.exists ? bestSnap.data().pct : 0, prevTries = bestSnap.exists ? bestSnap.data().tries : 0;
  let xp, firstDaily = false;
  if (quizId.startsWith("code.")) xp = pct > prevBest ? Math.round((pct - prevBest) * total * 10 * mult) + (pass && prevBest < 0.8 ? Math.round(20 * mult) : 0) : 0;
  else {
    xp = Math.round(correct * 10 * mult) + (pass ? Math.round(20 * mult) : 0) + (maxCombo >= 3 ? Math.min(maxCombo, 20) * 2 : 0);
    if (dailySnap && !dailySnap.exists) { firstDaily = true; xp += 30; }
  }
  const wk = BW.weekKey(), today = utcDay(new Date());
  const lastDay = p.lastDay ? utcDay(p.lastDay.toDate()) : null, yesterday = utcDay(new Date(Date.now() - 864e5));
  const streakGuess = lastDay === today ? p.streak : lastDay === yesterday ? p.streak + 1 : 1;
  // the server's date decides the streak; try our best guess first, then the other possibilities (clock drift around midnight)
  const candidates = [...new Set([streakGuess, p.streak, p.streak + 1, 1])];
  let lastErr, saved;
  for (const streak of candidates) {
    const b = BW.fs.batch();
    b.update(attemptRef, { status: "done", finishedAt: FV.serverTimestamp(), total, correct, pct, xp, maxCombo, activeMs: Math.max(0, Math.round(activeMs)), answers: answers.slice(0, 150) });
    if (firstDaily) b.set(ref("users", uid, "daily", quizId), { at: FV.serverTimestamp() });
    b.set(ref("users", uid, "best", quizId), { pct: Math.max(pct, prevBest), tries: prevTries + 1, lastAt: FV.serverTimestamp(), attempt: id });
    const upd = { xp: (p.xp || 0) + xp, weekXp: p.weekKey === wk ? (p.weekXp || 0) + xp : xp, weekKey: wk, streak, bestStreak: Math.max(p.bestStreak || 0, streak) };
    b.update(ref("users", uid), { ...upd, lastDay: FV.serverTimestamp(), lastAttempt: id });
    try { await BW.withTimeout(b.commit()); lastErr = null; saved = upd; break; } catch (e) { lastErr = e; if (e.code !== "permission-denied") break; }
  }
  if (lastErr) {
    const tooFast = (Date.now() - att.data().startedAt.toDate()) < total * 1500 + 2000;
    fail(tooFast ? "too_fast" : lastErr.code || "permission-denied");
  }
  const after = { ...p, ...saved, lastDay: firebase.firestore.Timestamp.now() };   // what the server now holds (no need to read it back)
  S.profile = BW.toProfile(uid, after);
  S.best[quizId] = { pct: Math.max(pct, prevBest), tries: prevTries + 1, last: new Date().toISOString() };
  if (S.taskAtts?.[quizId]) S.taskAtts[quizId].unshift({ id, quizId, pct, xp, finishedAt: new Date().toISOString() });
  delete BW.openAttempts?.[id];
  const badges = BW.newBadges({ quizId, pct, pass, total, correct, maxCombo, firstDaily, assignmentId: att.data().assignmentId });
  BW.shareResult(id, badges).catch(e => console.warn("class copy", e));   // leaderboards, teacher analytics, badges
  return { xp_gain: xp, xp: after.xp, week_xp: after.weekXp, streak: after.streak, pct, pass, first_daily: firstDaily, badges };
};
BW.newBadges = ({ quizId, pct, pass, total, correct, maxCombo, firstDaily, assignmentId }) => {
  const S = BW.S, p = S.profile, isCode = quizId.startsWith("code."), c = ["first_steps"];
  if (pct === 1 && total >= 6) c.push("perfect");
  if (p.streak >= 3) c.push("streak_3"); if (p.streak >= 7) c.push("streak_7"); if (p.streak >= 30) c.push("streak_30");
  if (pass && /\.2$/.test(quizId)) c.push("gold_rush"); if (pass && /\.3$/.test(quizId)) c.push("platinum"); if (pass && /\.boss$/.test(quizId)) c.push("boss_slayer");
  if (pass && ["mem.bin.2", "mem.hex.2", "mem.bin.3", "mem.hex.3"].includes(quizId)) c.push("binary_brain");
  if (pass && ["logic.tables.2", "logic.expressions.2", "logic.tables.3", "logic.expressions.3"].includes(quizId)) c.push("logic_lord");
  if (quizId === "quick.speed" && correct >= 15) c.push("speed_demon");
  if (maxCombo >= 10) c.push("combo_10"); if (p.xp >= 1000) c.push("xp_1000"); if (p.xp >= 5000) c.push("xp_5000");
  if (firstDaily) c.push("daily_done");
  if (isCode && pct === 1) c.push("first_program");
  if (Object.entries(S.best).filter(([q, b]) => q.startsWith("code.") && b.pct >= 1).length >= 10) c.push("code_10");
  if (Object.values(S.best).reduce((s, b) => s + (b.tries || 0), 0) >= 25) c.push("quiz_25");
  const task = assignmentId && S.tasks.find(t => t.id === assignmentId);
  if (task && pct * 100 >= task.target_pct && (!task.due_at || new Date(task.due_at) >= new Date())) c.push("on_time");
  if (new Set(Object.entries(S.best).filter(([q, b]) => /\.[0-3]$/.test(q) && b.pct >= BW.PASS).map(([q]) => q.split(".")[0])).size >= 11) c.push("all_rounder");
  return [...new Set(c)].filter(b => !S.badges[b]);
};
/* copy a finished attempt into each class (so teachers can analyse it), refresh leaderboard entries, award badges */
BW.shareResult = async (attemptId, badges) => {
  const S = BW.S, uid = S.user.id, a = (await ref("users", uid, "attempts", attemptId).get()).data(), p = (await ref("users", uid).get()).data();
  const medals = BW.totalMedals();
  // one small write per class, so a class the student has since left can't block the others
  await Promise.all((p.classIds || []).map(async cid => { const b = BW.fs.batch();
    const extra = await BW.updateMemberStats(cid, a.answers || [], a.quizId, a.pct).catch(() => ({}));
    b.update(ref("classes", cid, "members", uid), { displayName: p.displayName, avatarColor: p.avatarColor, xp: p.xp, weekXp: p.weekXp, weekKey: p.weekKey,
      streak: p.streak, lastDay: p.lastDay, medals, quizzes: FV.increment(1), lastActive: FV.serverTimestamp(), ...extra });
    b.set(ref("classes", cid, "results", attemptId), { uid, displayName: p.displayName, quizId: a.quizId, assignmentId: a.assignmentId || null, total: a.total,
      correct: a.correct, pct: a.pct, xp: a.xp, activeMs: a.activeMs, finishedAt: a.finishedAt, answered: (a.answers || []).length });
    b.set(ref("classes", cid, "answers", attemptId), { uid, quizId: a.quizId, finishedAt: a.finishedAt, answers: a.answers || [] });
    return b.commit().catch(e => console.warn("class", cid, e.code)); }));
  if (badges.length) { const b = BW.fs.batch();
    badges.forEach(k => { b.set(ref("users", uid, "badges", k), { earnedAt: FV.serverTimestamp() }); S.badges[k] = new Date().toISOString(); });
    await b.commit(); }
};

/* ---- src/fb-teacher.js ---- */
/* Firebase data layer, part 2: classes, tasks, reports, the school directory, school-managed logins and notices */
BW.db = {};
const me = () => BW.S.user.id;
const WORDS = ["amber", "azure", "coral", "ember", "frost", "jade", "lemon", "maple", "ocean", "olive", "pixel", "quartz", "river", "ruby", "solar", "storm", "tiger", "ultra", "violet", "willow", "binary", "cobalt", "delta", "echo", "falcon", "gamma", "hertz", "ion", "joule", "kilo", "laser", "modem", "nano", "orbit", "proxy", "qubit", "radar", "sonic", "turbo", "vector"];
const rnd = n => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; };
const pupilPassword = () => `${WORDS[rnd(40)]}-${WORDS[rnd(40)]}-${10 + rnd(90)}`;
const slug = name => { const p = name.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().toLowerCase().split(/\s+/); return ((p[0] || "") + (p[1]?.[0] || "")).replace(/[^a-z0-9]/g, "").slice(0, 12) || "student"; };
const memberRow = d => { const x = d.data(), wk = BW.weekKey(), live = x.lastDay && (Date.now() - x.lastDay.toDate()) < 2 * 864e5;
  return { student_id: d.id, user_id: d.id, display_name: x.displayName, avatar_color: x.avatarColor, managed: !!x.managed, username: x.username || null, xp: x.xp || 0,
    week_xp: x.weekKey === wk ? x.weekXp || 0 : 0, streak: live ? x.streak || 0 : 0, medals: x.medals || 0, quizzes: x.quizzes || 0, last_active: ts(x.lastActive),
    joined_at: ts(x.joinedAt), is_me: d.id === me(), stats: x.stats || {}, best: x.best || {}, tries: x.tries || {} }; };
const resultRow = d => { const x = d.data(); return { id: d.id, uid: x.uid, display_name: x.displayName, quiz_id: x.quizId, assignment_id: x.assignmentId,
  total: x.total, correct: x.correct, pct: x.pct, xp: x.xp, active_ms: x.activeMs, finished_at: ts(x.finishedAt), answers: x.answers ? x.answers.map(BW.ansRow) : null }; };
const keyOf = q => q.replace(/\./g, "_");
const mondayLondon = () => { const d = new Date(); const day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day); return d.toISOString(); };

/* ---------- classes ---------- */
BW.db.createClass = async name => {
  for (let i = 0; i < 6; i++) {
    const cid = newId(), code = randCode(6), b = BW.fs.batch();
    b.set(ref("classCodes", code), { classId: cid });
    b.set(ref("classes", cid), { name: name.slice(0, 60), schoolId: BW.S.profile.school_id, teacherId: me(), joinCode: code, showLeaderboard: true, archived: false, createdAt: FV.serverTimestamp() });
    try { await b.commit(); return BW.toClass(cid, { name, joinCode: code, showLeaderboard: true, archived: false, teacherId: me(), schoolId: BW.S.profile.school_id, createdAt: null }); }
    catch (e) { if (e.code !== "permission-denied" || i === 5) throw e; }   // a clashing code: try another
  }
};
BW.db.regenerateCode = async cid => {
  const c = BW.classById(cid);
  for (let i = 0; i < 6; i++) {
    const code = randCode(6), b = BW.fs.batch();
    b.set(ref("classCodes", code), { classId: cid }); b.update(ref("classes", cid), { joinCode: code }); b.delete(ref("classCodes", c.join_code));
    try { await b.commit(); return code; } catch (e) { if (e.code !== "permission-denied" || i === 5) throw e; }
  }
};
BW.db.updateClass = (cid, patch) => ref("classes", cid).update(Object.fromEntries(Object.entries(patch).map(([k, v]) => [({ show_leaderboard: "showLeaderboard" })[k] || k, v])));
BW.db.deleteClass = async cid => {
  const managed = (await col("classes", cid, "members").where("managed", "==", true).get()).docs.map(d => d.id);   // school logins lose this class from their list
  for (let i = 0; i < managed.length; i += 400) { const b = BW.fs.batch(); managed.slice(i, i + 400).forEach(sid => b.update(ref("users", sid), { classIds: FV.arrayRemove(cid) })); await b.commit().catch(() => { }); }
  for (const sub of ["members", "tasks", "notices", "results", "answers", "resubs"]) {
    const q = await col("classes", cid, sub).get();
    for (let i = 0; i < q.docs.length; i += 400) { const b = BW.fs.batch(); q.docs.slice(i, i + 400).forEach(d => b.delete(d.ref)); await b.commit(); }
  }
  const c = BW.classById(cid), b = BW.fs.batch();
  b.delete(ref("classCodes", c.join_code)); b.delete(ref("classes", cid)); await b.commit();
};
BW.db.joinClass = async raw => {
  if (BW.S.profile.managed) fail("managed_locked");
  if (BW.isTeacher()) fail("own_class");
  const code = raw.replace(/\s/g, "").toUpperCase(), snap = await ref("classCodes", code).get();
  if (!snap.exists) fail("bad_code");
  const cid = snap.data().classId, p = (await ref("users", me()).get()).data(), b = BW.fs.batch();
  b.set(ref("classes", cid, "members", me()), { uid: me(), displayName: p.displayName, avatarColor: p.avatarColor, managed: false, joinedAt: FV.serverTimestamp(), joinCode: code,
    xp: p.xp || 0, weekXp: p.weekXp || 0, weekKey: p.weekKey || "", streak: p.streak || 0, lastDay: p.lastDay || null, medals: BW.totalMedals(), quizzes: 0, lastActive: null });
  b.update(ref("users", me()), { classIds: FV.arrayUnion(cid) });
  try { await b.commit(); } catch (e) { fail(e.code === "permission-denied" ? "bad_code" : e.code); }
  const c = await ref("classes", cid).get();
  return { class_id: cid, name: c.data().name };
};
BW.db.leaveClass = async cid => {
  if (BW.S.profile.managed) fail("managed_locked");
  const b = BW.fs.batch(); b.delete(ref("classes", cid, "members", me())); b.update(ref("users", me()), { classIds: FV.arrayRemove(cid) }); await b.commit();
};
BW.db.becomeTeacher = async raw => {
  const code = raw.trim().toUpperCase(), snap = await ref("teacherCodes", code).get().catch(() => null);
  if (!snap?.exists) fail("bad_teacher_code");
  if (BW.S.profile.managed) fail("managed_locked");
  await ref("users", me()).update({ role: "teacher", schoolId: snap.data().schoolId, teacherCode: code });
  return true;
};
BW.db.rotateTeacherCode = async () => {
  const s = BW.S.school, code = `${randCode(5)}-${randCode(5)}`, b = BW.fs.batch();
  b.set(ref("teacherCodes", code), { schoolId: s.id }); b.update(ref("schools", s.id), { teacherCode: code }); b.delete(ref("teacherCodes", s.teacherCode));
  await b.commit(); s.teacherCode = code; return code;
};

/* ---------- tasks ---------- */
BW.db.tasks = async cid => (await col("classes", cid, "tasks").orderBy("createdAt", "desc").get()).docs.map(d => BW.toTask(d.id, cid, d.data()));
BW.db.task = async (cid, tid) => { const d = await ref("classes", cid, "tasks", tid).get(); if (!d.exists) fail("not_found"); return BW.toTask(d.id, cid, d.data()); };
BW.db.createTask = (cid, t) => col("classes", cid, "tasks").add({ title: t.title, instructions: t.instructions || "", quizIds: t.quiz_ids, targetPct: t.target_pct,
  dueAt: t.due_at ? firebase.firestore.Timestamp.fromDate(new Date(t.due_at)) : null, createdAt: FV.serverTimestamp(), createdBy: me() });
BW.db.deleteTask = (cid, tid) => ref("classes", cid, "tasks", tid).delete();
BW.db.dashboard = async () => {
  const cls = BW.myClasses();
  const per = await Promise.all(cls.map(async c => { const [m, t] = await Promise.all([col("classes", c.id, "members").get(), BW.db.tasks(c.id)]);
    return { c, members: m.docs.map(d => d.id), tasks: t }; }));
  return { m: per.flatMap(x => x.members.map(s => ({ class_id: x.c.id, student_id: s }))), a: per.flatMap(x => x.tasks.map(t => ({ id: t.id, class_id: x.c.id, due_at: t.due_at, quiz_ids: t.quiz_ids, created_at: t.created_at }))) };
};

/* ---------- class members, leaderboards and results ---------- */
BW.db.roster = async cid => (await col("classes", cid, "members").get()).docs.map(memberRow).sort((a, b) => a.display_name.localeCompare(b.display_name));
BW.db.leaderboard = async cid => { try { return await BW.db.roster(cid); } catch (e) { if (e.code === "permission-denied") return []; throw e; } };
BW.db.results = async (cid, quizIds) => {
  if (!quizIds) return (await col("classes", cid, "results").orderBy("finishedAt", "desc").limit(3000).get()).docs.map(resultRow);
  const groups = []; for (let i = 0; i < quizIds.length; i += 30) groups.push(quizIds.slice(i, i + 30));
  const snaps = await Promise.all(groups.map(g => col("classes", cid, "results").where("quizId", "in", g).orderBy("finishedAt", "desc").limit(3000).get()));
  return snaps.flatMap(q => q.docs.map(resultRow));
};
/* the answers behind one result (fetched only when a teacher opens it); older results carry them inside */
BW.db.answers = async (cid, aid) => { const d = await ref("classes", cid, "answers", aid).get(); return d.exists ? (d.data().answers || []).map(BW.ansRow) : []; };
BW.db.answersFor = async (cid, quizIds) => {   // every answer given on these quizzes in the class: [{ id, uid, quiz_id, finished_at, answers }]
  const groups = []; for (let i = 0; i < quizIds.length; i += 30) groups.push(quizIds.slice(i, i + 30));
  const snaps = await Promise.all(groups.map(g => col("classes", cid, "answers").where("quizId", "in", g).get()));
  const out = snaps.flatMap(q => q.docs.map(d => ({ id: d.id, uid: d.data().uid, quiz_id: d.data().quizId, finished_at: ts(d.data().finishedAt), answers: (d.data().answers || []).map(BW.ansRow) })));
  // results saved before the split kept their answers inside the result itself
  (await BW.db.results(cid, quizIds)).filter(r => r.answers && !out.some(o => o.id === r.id)).forEach(r => out.push({ id: r.id, uid: r.uid, quiz_id: r.quiz_id, finished_at: r.finished_at, answers: r.answers }));
  return out;
};
BW.db.studentResults = async (cid, sid) => (await col("classes", cid, "results").where("uid", "==", sid).orderBy("finishedAt", "desc").limit(60).get()).docs.map(resultRow);

/* per-student effort and topic bests are kept on each class entry (cheap to read on the free plan) */
BW.updateMemberStats = async (cid, answers, quizId, pct) => {
  const r = ref("classes", cid, "members", me()), cur = (await r.get()).data() || {}, st = { ...(cur.stats || {}) }, wk = BW.weekKey();
  const ms = answers.reduce((s, a) => s + (a.ms || 0), 0);
  st.answered = (st.answered || 0) + answers.length; st.firstTry = (st.firstTry || 0) + answers.filter(a => (a.try || 1) === 1).length;
  st.firstTryOk = (st.firstTryOk || 0) + answers.filter(a => (a.try || 1) === 1 && a.ok).length; st.retries = (st.retries || 0) + answers.filter(a => (a.try || 1) > 1).length;
  st.totalMs = (st.totalMs || 0) + ms; st.weekMs = st.weekKey === wk ? (st.weekMs || 0) + ms : ms; st.weekKey = wk; st.lastAnswer = new Date().toISOString();
  const best = { ...(cur.best || {}) }, tries = { ...(cur.tries || {}) }, k = keyOf(quizId);
  best[k] = Math.max(best[k] || 0, pct); tries[k] = (tries[k] || 0) + 1;
  return { stats: st, best, tries };
};

/* ---------- reports (worked out in the teacher's browser from class results) ---------- */
/* a student's progress on one task; after a resubmission request only work done since the request counts for the items it names */
const sinceFor = (task, uid, q, resubs) => { const r = resubs?.[`${task.id}_${uid}`], c = task.created_at || "";
  return r && r.quiz_ids.includes(q) && (r.requested_at || "") > c ? r.requested_at : c; };
const reportFor = (task, roster, res, resubs) => roster.map(m => {
  const items = task.quiz_ids.map(q => { const since = sinceFor(task, m.student_id, q, resubs), mine = res.filter(r => r.uid === m.student_id && r.quiz_id === q && r.finished_at >= since);
    const passed = mine.filter(r => r.pct * 100 >= task.target_pct).map(r => r.finished_at).sort();
    return { quiz_id: q, best: mine.length ? Math.max(...mine.map(r => r.pct)) : null, tries: mine.length, completed_at: passed[0] || null, last_at: mine.map(r => r.finished_at).sort().pop() || null, results: mine }; });
  const tries = items.reduce((s, i) => s + i.tries, 0), done = items.filter(i => i.completed_at);
  return { student_id: m.student_id, display_name: m.display_name, avatar_color: m.avatar_color, managed: m.managed, resub: resubs?.[`${task.id}_${m.student_id}`] || null, best: tries ? items.reduce((s, i) => s + (i.best || 0), 0) / items.length : null, tries,
    completed_at: done.length === items.length ? done.map(i => i.completed_at).sort().pop() : null, last_at: items.map(i => i.last_at).filter(Boolean).sort().pop() || null, items_done: done.length, items };
});
BW.db.assignmentReport = async (cid, tid) => {
  const [task, roster, resubs] = await Promise.all([BW.db.task(cid, tid), BW.db.roster(cid), BW.db.resubs(cid)]);
  return reportFor(task, roster, await BW.db.results(cid, task.quiz_ids), resubs);
};
/* the class progress grid: every student against every task */
BW.db.classGrid = async cid => {
  const [tasks, roster, res, resubs] = await Promise.all([BW.db.tasks(cid), BW.db.roster(cid), BW.db.results(cid), BW.db.resubs(cid)]);
  return { tasks, roster, resubs, results: res, cells: Object.fromEntries(tasks.map(t => [t.id, Object.fromEntries(reportFor(t, roster, res, resubs).map(r => [r.student_id, r]))])) };
};
/* resubmission requests */
const resubRow = d => { const x = d.data(); return { id: d.id, uid: x.uid, task_id: x.taskId, task_title: x.taskTitle, quiz_ids: x.quizIds || [], reason: x.reason || "",
  requested_at: ts(x.requestedAt), teacher_name: x.teacherName || "" }; };
BW.db.resubs = async cid => Object.fromEntries((await col("classes", cid, "resubs").get()).docs.map(d => [d.id, resubRow(d)]));
BW.db.requestResub = (cid, task, uid, quizIds, reason) => ref("classes", cid, "resubs", `${task.id}_${uid}`).set({ uid, taskId: task.id, taskTitle: task.title.slice(0, 100),
  quizIds, reason: reason.slice(0, 1000), requestedAt: FV.serverTimestamp(), requestedBy: me(), teacherName: BW.S.profile.display_name });
BW.db.cancelResub = (cid, taskId, uid) => ref("classes", cid, "resubs", `${taskId}_${uid}`).delete();
BW.resubRow = resubRow;
BW.db.assignmentSummary = async cid => {   // one read of the tasks, members and results, however many tasks there are
  const [tasks, roster, res, resubs] = await Promise.all([BW.db.tasks(cid), BW.db.roster(cid), BW.db.results(cid), BW.db.resubs(cid)]);
  return tasks.map(t => { const rows = reportFor(t, roster, res, resubs), started = rows.filter(r => r.tries > 0);
    return { assignment_id: t.id, students: rows.length, started: started.length, completed: rows.filter(r => r.completed_at).length,
      on_time: rows.filter(r => r.completed_at && (!t.due_at || r.completed_at <= t.due_at)).length,
      avg_best: started.length ? started.reduce((s, r) => s + r.best, 0) / started.length : null, avg_items_done: rows.length ? rows.reduce((s, r) => s + r.items_done, 0) / rows.length : 0 }; });
};
BW.db.questionStats = async (cid, tid) => {
  const task = await BW.db.task(cid, tid), res = (await BW.db.answersFor(cid, task.quiz_ids)).filter(r => r.finished_at >= (task.created_at || ""));
  const per = {};
  res.forEach(r => r.answers.forEach(a => { const k = `${a.q_key}|${r.id}|${a.q_code}`;
    const p = per[k] = per[k] || { key: a.q_key, uid: r.uid, tries: 0, ftc: false, ms: 0, sample: a.q_text, type: a.q_type, topic: a.topic };
    p.tries = Math.max(p.tries, a.try_no); p.ftc = p.ftc || (a.is_correct && a.try_no === 1); p.ms += a.ms; }));
  const byKey = {};
  Object.values(per).forEach(p => (byKey[p.key] = byKey[p.key] || []).push(p));
  return Object.entries(byKey).map(([key, ps]) => {
    const wrong = {}; res.forEach(r => r.answers.forEach(a => { if (a.q_key === key && !a.is_correct) wrong[a.answer] = (wrong[a.answer] || 0) + 1; }));
    const common = Object.entries(wrong).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))[0];
    return { q_key: key, sample: ps[0].sample, q_type: ps[0].type, topic: ps[0].topic, answered: ps.length, students: new Set(ps.map(p => p.uid)).size,
      first_try_pct: ps.filter(p => p.ftc).length / ps.length, avg_ms: ps.reduce((s, p) => s + p.ms, 0) / ps.length, avg_tries: ps.reduce((s, p) => s + p.tries, 0) / ps.length, common_wrong: common ? common[0] : null };
  }).sort((a, b) => a.first_try_pct - b.first_try_pct || b.answered - a.answered);
};
BW.db.topicStats = async cid => (await BW.db.roster(cid)).flatMap(m => {
  const topics = {};
  Object.entries(m.best).forEach(([k, pct]) => { const [u, s, lvl] = k.split("_"); if (lvl == null || !/^[0-3]$/.test(lvl)) return;
    const t = topics[`${u}.${s}`] = topics[`${u}.${s}`] || { student_id: m.student_id, topic: `${u}.${s}`, best: 0, medals: 0, tries: 0 };
    t.best = Math.max(t.best, pct); if (pct >= BW.PASS) t.medals++; t.tries += m.tries[k] || 0; });
  return Object.values(topics);
});
BW.db.studentStats = async cid => { const wk = BW.weekKey();
  return (await BW.db.roster(cid)).map(m => { const s = m.stats || {};
    return { student_id: m.student_id, answered: s.answered || 0, first_try: s.firstTry || 0, first_try_ok: s.firstTryOk || 0, retries: s.retries || 0,
      total_ms: s.totalMs || 0, week_ms: s.weekKey === wk ? s.weekMs || 0 : 0, avg_ms: s.answered ? s.totalMs / s.answered : null, last_answer: s.lastAnswer || null }; }); };

/* ---------- the school directory and school-managed logins ---------- */
BW.db.directory = async () => (await col("users").where("schoolId", "==", BW.S.profile.school_id).get()).docs.map(d => BW.toProfile(d.id, d.data()))
  .sort((a, b) => (a.role === b.role ? 0 : a.role === "teacher" ? -1 : 1) || a.display_name.localeCompare(b.display_name));
BW.db.createStudents = async ({ names, classIds = [] }) => {
  const sec = firebase.initializeApp(BW.CONFIG.firebase, "pupil-maker-" + Date.now()), secAuth = sec.auth(), out = [];
  await secAuth.setPersistence(firebase.auth.Auth.Persistence.NONE);
  try {
    for (const name of names) {
      const pw = pupilPassword(); let username = "", newUid = null, failed = "";
      for (let t = 0; t < 5 && !newUid && !failed; t++) {
        username = `${slug(name)}${100 + rnd(900)}`;
        try { newUid = (await secAuth.createUserWithEmailAndPassword(`${username}@${BW.CONFIG.pupilDomain}`, pw)).user.uid; await secAuth.signOut(); }
        catch (e) { if (e.code !== "auth/email-already-in-use") failed = BW.errMsg(e); }
      }
      if (!newUid) { out.push({ name, error: failed || "Couldn't make a unique username" }); continue; }
      const colour = BW.pick(["#5B4BD5", "#1F7A8C", "#B0306E", "#C2410C", "#167A4B", "#2563EB", "#B3261E", "#6D28D9"]), b = BW.fs.batch();
      b.set(ref("users", newUid), { role: "student", displayName: name.slice(0, 40), avatarColor: colour, schoolId: BW.S.profile.school_id, managed: true, username, createdBy: me(),
        classIds, xp: 0, weekXp: 0, weekKey: "", streak: 0, bestStreak: 0, lastDay: null, prefs: {}, createdAt: FV.serverTimestamp() });
      classIds.forEach(cid => b.set(ref("classes", cid, "members", newUid), { uid: newUid, displayName: name.slice(0, 40), avatarColor: colour, managed: true, username,
        joinedAt: FV.serverTimestamp(), xp: 0, weekXp: 0, weekKey: "", streak: 0, lastDay: null, medals: 0, quizzes: 0, lastActive: null }));
      try { await b.commit(); out.push({ name, username, password: pw, uid: newUid }); } catch (e) { out.push({ name, error: BW.errMsg(e) }); }
    }
  } finally { await sec.delete().catch(() => { }); }
  return { students: out };
};
BW.db.setClasses = async (sid, want) => {   // put a school-managed student into exactly these (of my) classes
  const p = (await ref("users", sid).get()).data(), mine = new Set(BW.myClasses().map(c => c.id)), have = (p.classIds || []).filter(c => mine.has(c));
  const add = want.filter(c => !have.includes(c)), drop = have.filter(c => !want.includes(c)), b = BW.fs.batch();
  add.forEach(cid => b.set(ref("classes", cid, "members", sid), { uid: sid, displayName: p.displayName, avatarColor: p.avatarColor, managed: true, username: p.username || null,
    joinedAt: FV.serverTimestamp(), xp: p.xp || 0, weekXp: p.weekXp || 0, weekKey: p.weekKey || "", streak: p.streak || 0, lastDay: p.lastDay || null, medals: 0, quizzes: 0, lastActive: null }));
  drop.forEach(cid => b.delete(ref("classes", cid, "members", sid)));
  b.update(ref("users", sid), { classIds: [...new Set([...(p.classIds || []).filter(c => !drop.includes(c)), ...add])] });
  await b.commit();
};
BW.db.profileOf = async sid => BW.toProfile(sid, (await ref("users", sid).get()).data() || {});
BW.db.removeMember = (cid, sid) => ref("classes", cid, "members", sid).delete();   // students who joined with a code: their own list tidies itself on next load
BW.db.renameStudent = async (sid, name) => {
  const p = (await ref("users", sid).get()).data(), b = BW.fs.batch();
  b.update(ref("users", sid), { displayName: name.slice(0, 40) });
  (p.classIds || []).filter(c => BW.classById(c)).forEach(cid => b.update(ref("classes", cid, "members", sid), { displayName: name.slice(0, 40) }));
  await b.commit();
};
BW.db.removeFromSchool = async sid => {
  const p = (await ref("users", sid).get()).data(), b = BW.fs.batch();
  (p.classIds || []).forEach(cid => b.delete(ref("classes", cid, "members", sid)));
  b.delete(ref("users", sid)); await b.commit();
};

/* ---------- notices (the student message centre) ---------- */
BW.db.postNotice = async ({ title, body, classIds, pinned }) => {
  const gid = newId(), b = BW.fs.batch(), name = BW.S.profile.display_name;
  classIds.forEach(cid => b.set(ref("classes", cid, "notices", gid), { title: title.slice(0, 120), body: body.slice(0, 4000), authorId: me(), authorName: name,
    createdAt: FV.serverTimestamp(), pinned: !!pinned, groupId: gid, className: BW.classById(cid)?.name || "" }));
  await b.commit(); return gid;
};
BW.db.classNotices = async cid => (await col("classes", cid, "notices").orderBy("createdAt", "desc").limit(50).get()).docs.map(d => ({ id: d.id, ...d.data(), created_at: ts(d.data().createdAt) }));
BW.db.deleteNotice = (cid, nid) => ref("classes", cid, "notices", nid).delete();
BW.db.pinNotice = (cid, nid, pinned) => ref("classes", cid, "notices", nid).update({ pinned });
BW.buildNotices = (list, read) => {   // one entry per notice even when it was sent to several of the student's classes
  const byId = {};
  list.forEach(n => { const x = byId[n.id] = byId[n.id] || { id: n.id, title: n.title, body: n.body, author_name: n.authorName, created_at: n.created_at, pinned: n.pinned, classes: [], read: read.has(n.id) };
    x.classes.push(n.class_name); x.pinned = x.pinned || n.pinned; });
  return Object.values(byId).sort((a, b) => (b.pinned - a.pinned) || (b.created_at || "").localeCompare(a.created_at || ""));
};
BW.db.markRead = nid => ref("users", me(), "reads", nid).set({ at: FV.serverTimestamp() });

/* ---------- misc ---------- */
BW.db.codeSolution = async id => { const d = await ref("codeSolutions", id).get(); return d.exists ? d.data().solution : null; };
BW.db.updateProfile = async patch => {
  if (BW.S.profile.managed && "display_name" in patch) fail("managed_locked");
  const map = { display_name: "displayName", avatar_color: "avatarColor", prefs: "prefs" };
  await ref("users", me()).update(Object.fromEntries(Object.entries(patch).map(([k, v]) => [map[k] || k, v])));
  (BW.S.profile.class_ids || []).forEach(cid => { const m = {}; if (patch.display_name) m.displayName = patch.display_name; if (patch.avatar_color) m.avatarColor = patch.avatar_color;
    if (Object.keys(m).length) ref("classes", cid, "members", me()).update(m).catch(() => { }); });
};
BW.db.deleteSelf = async password => {
  const S = BW.S, u = BW.auth.currentUser;
  if (S.profile.managed) fail("managed_locked");
  await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email, password));
  if (S.profile.role === "teacher") for (const c of BW.myClasses()) await BW.db.deleteClass(c.id);   // a teacher's classes, tasks and notices go with them
  for (const cid of S.profile.class_ids || []) {
    const [mine, ans] = await Promise.all(["results", "answers"].map(sub => col("classes", cid, sub).where("uid", "==", u.uid).get().catch(() => ({ docs: [] }))));
    const docs = [...mine.docs, ...ans.docs];
    for (let i = 0; i < docs.length; i += 400) { const b = BW.fs.batch(); docs.slice(i, i + 400).forEach(d => b.delete(d.ref)); await b.commit().catch(() => { }); }
    await ref("classes", cid, "members", u.uid).delete().catch(() => { });
  }
  for (const sub of ["attempts", "best", "badges", "daily", "reads"]) {
    const q = await col("users", u.uid, sub).get();
    for (let i = 0; i < q.docs.length; i += 400) { const b = BW.fs.batch(); q.docs.slice(i, i + 400).forEach(d => b.delete(d.ref)); await b.commit(); }
  }
  await ref("users", u.uid).delete();
  await u.delete();
};

/* the same operation names the screens already call */
BW.api.rpc = async (name, a = {}) => {
  switch (name) {
    case "start_attempt": return BW.startAttempt(a.p_quiz_id, a.p_assignment);
    case "finish_attempt": return BW.finishAttempt({ id: a.p_attempt, total: a.p_total, correct: a.p_correct, maxCombo: a.p_max_combo || 0, answers: a.p_answers || [], activeMs: a.p_active_ms || 0 });
    case "my_assignments": return BW.computeTasks();
    case "join_class": return BW.db.joinClass(a.p_code);
    case "become_teacher": return BW.db.becomeTeacher(a.p_code);
    case "create_class": return BW.db.createClass(a.p_name);
    case "regenerate_code": return BW.db.regenerateCode(a.p_class);
    case "class_leaderboard": return BW.db.leaderboard(a.p_class);
    case "class_roster": return BW.db.roster(a.p_class);
    case "class_assignment_summary": return BW.db.assignmentSummary(a.p_class);
    case "assignment_report": return BW.db.assignmentReport(a.p_class, a.p_assignment);
    case "assignment_question_stats": return BW.db.questionStats(a.p_class, a.p_assignment);
    case "class_topic_stats": return BW.db.topicStats(a.p_class);
    case "class_student_stats": return BW.db.studentStats(a.p_class);
  }
  throw new Error("Unknown operation " + name);
};
BW.api.fn = async (action, body = {}) => {
  if (action === "create_students") return BW.db.createStudents({ names: body.names, classIds: body.class_ids || (body.class_id ? [body.class_id] : []) });
  if (action === "reset_password") fail("spark_no_reset");
  if (action === "delete_student") { await BW.db.removeFromSchool(body.student_id); return { ok: true }; }
  if (action === "delete_self") { await BW.db.deleteSelf(body.password); return { ok: true }; }
  throw new Error("Unknown action " + action);
};

/* ---- src/app-state.js ---- */
/* Signed-in state, levels, badges, progress helpers */
BW.LEVELS = [
  { key: "b", name: "Bronze", hex: "#8F5424", ink: "#FFFFFF", n: 6, d: [1], mult: 1, mode: "standard", blurb: "Warm-up: core facts and the easiest calculations. Wrong answers come back until you get them right." },
  { key: "s", name: "Silver", hex: "#8A96A3", ink: "#16181B", n: 8, d: [1, 2], mult: 1.2, mode: "standard", blurb: "Recall and application, with hands-on activities. Wrong answers come back at the end." },
  { key: "g", name: "Gold", hex: "#D9A21B", ink: "#16181B", n: 10, d: [2, 3], mult: 1.5, mode: "standard", blurb: "Exam-style questions and harder calculations." },
  { key: "p", name: "Platinum", hex: "#4353E0", ink: "#FFFFFF", n: 12, d: [1, 2, 3], mult: 2, mode: "exam", blurb: "Exam mode: three lives and no second chances. Some questions come from the rest of the unit." }
];
BW.PASS = 0.8;
BW.TITLES = [[1, "Bit Rookie"], [3, "Nibble Ninja"], [5, "Byte Wrangler"], [7, "Packet Pilot"], [10, "Kernel Knight"], [13, "Algorithm Ace"], [16, "Binary Boss"], [20, "Silicon Sage"]];
BW.BADGES = {
  first_steps: ["First Steps", "Finish your first quiz", "01"], daily_done: ["Daily Dose", "Complete a Daily Challenge", "24h"],
  perfect: ["Flawless", "Score 100% on a quiz of 6 or more questions", "100"], combo_10: ["Combo King", "Get 10 answers right in a row", "x10"],
  streak_3: ["On Fire", "Reach a 3-day streak", "3d"], streak_7: ["Week Warrior", "Reach a 7-day streak", "7d"], streak_30: ["Unstoppable", "Reach a 30-day streak", "30d"],
  gold_rush: ["Gold Rush", "Pass any Gold quiz", "Au"], platinum: ["Platinum Mind", "Pass a Platinum exam-mode quiz", "Pt"], boss_slayer: ["Boss Slayer", "Defeat a unit boss", "HP"],
  binary_brain: ["Binary Brain", "Pass Gold or Platinum in Binary or Hexadecimal", "1010"], logic_lord: ["Logic Lord", "Pass Gold or Platinum in Truth Tables or Logic Expressions", "&&"],
  speed_demon: ["Speed Demon", "Get 15 right in one Speed Run", "60s"], xp_1000: ["Kilobyte", "Earn 1,000 XP", "KB"], xp_5000: ["Megabyte", "Earn 5,000 XP", "MB"],
  quiz_25: ["Dedicated", "Finish 25 quizzes", "25"], first_program: ["Hello World", "Pass every test in a coding challenge", "py"], code_10: ["Code Cruncher", "Solve 10 coding challenges", "</>"], on_time: ["Punctual", "Hit a task's target before it's due", "OK"], all_rounder: ["All-Rounder", "Earn a medal in all 11 units", "11"]
};
BW.BOSSES = { arch: "Overclocked Core", mem: "The Byte Hoarder", net: "Packet Storm", sec: "Malware Monarch", sys: "Rogue Kernel", eth: "The Data Broker", alg: "Infinite Loop", prog: "Syntax Serpent", robust: "Edge Case", logic: "The Gatekeeper", lang: "The Compiler" };

BW.londonDay = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
BW.dayKey = BW.londonDay;
BW.weekKey = (d = new Date()) => {
  const [y, m, dd] = BW.londonDay(d).split("-").map(Number), t = new Date(Date.UTC(y, m - 1, dd));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, "0")}`;
};
BW.levelOf = xp => { let L = 1, need = 100, acc = 0; while (xp >= acc + need) { acc += need; L++; need = 100 * L; } return { L, into: xp - acc, need }; };
BW.titleOf = L => BW.TITLES.filter(t => L >= t[0]).pop()[1];

BW.S = { user: null, profile: null, best: {}, badges: {}, hist: [], recent: [], classes: [], tasks: [], notices: [], school: null };
BW.isTeacher = () => BW.S.profile?.role === "teacher";
/* after any saved quiz or code submission: refresh tasks and celebrate any homework that has just been finished */
BW.afterWork = async () => {
  if (BW.isTeacher()) return;
  const before = new Map(BW.S.tasks.map(t => [t.id, !!t.completed_at]));
  try { await BW.refreshTasks(); } catch (e) { return; }
  BW.renderRail(); if (BW.route.name === "tasks") BW.render();
  BW.S.tasks.filter(t => t.completed_at && before.has(t.id) && !before.get(t.id)).forEach(t => BW.queueModal(() => BW.homeworkDone(t)));
};
BW.queueModal = show => { const tryShow = () => document.querySelector(".modal-wrap") ? setTimeout(tryShow, 400) : show(); setTimeout(tryShow, 1300); };
BW.homeworkDone = t => {
  BW.sfx.play("win"); BW.confetti(260); setTimeout(() => BW.confetti(200), 700);
  const k = t.items?.length || 1;
  BW.modal(`<div class="yay"><div class="yay-stars" aria-hidden="true">★ ★ ★</div><h2 class="yay-title"><span class="yay-big">!!YAY!!</span> Homework finished!</h2>
    <p class="muted">${BW.esc(t.title)} · ${k} item${k > 1 ? "s" : ""} done for ${BW.esc(t.class_name)}</p><button class="cta" data-close>Brilliant!</button></div>`);
};
BW.myClasses = () => BW.S.classes.filter(c => BW.isTeacher() ? c.teacher_id === BW.S.user.id : true);

/* favourites live in profile prefs so they follow the learner between devices */
BW.favs = () => BW.S.profile?.prefs?.favs || {};
let prefTimer = null;
BW.toggleFav = key => {
  const p = BW.S.profile, favs = { ...BW.favs() };
  favs[key] ? delete favs[key] : favs[key] = 1;
  p.prefs = { ...(p.prefs || {}), favs };
  clearTimeout(prefTimer);
  prefTimer = setTimeout(() => BW.db.updateProfile({ prefs: p.prefs }).catch(e => BW.toast(BW.errMsg(e))), 700);
  return !!favs[key];
};

BW.liveStreak = () => { const p = BW.S.profile; if (!p?.last_day) return 0; const y = new Date(Date.now() - 864e5); return p.last_day >= BW.londonDay(y) ? p.streak : 0; };
BW.weekXp = () => BW.S.profile?.week_key === BW.weekKey() ? BW.S.profile.week_xp : 0;

BW.allSubs = () => BW.units.flatMap(u => u.subs.map(s => ({ u, s })));
BW.findUnit = id => BW.units.find(u => u.id === id);
BW.findSub = (uid, sid) => { const u = BW.findUnit(uid); return u && { u, s: u.subs.find(s => s.id === sid) }; };
BW.qid = (u, s, li) => `${u.id}.${s.id}.${li}`;
BW.medalsFor = (u, s) => BW.LEVELS.map((L, i) => (BW.S.best[BW.qid(u, s, i)]?.pct || 0) >= BW.PASS);
BW.subStars = (u, s) => BW.medalsFor(u, s).filter(Boolean).length;
BW.unitMastery = u => u.subs.reduce((a, s) => a + BW.subStars(u, s), 0) / (u.subs.length * 4);
BW.totalMedals = () => BW.allSubs().reduce((a, { u, s }) => a + BW.subStars(u, s), 0);
BW.quizCount = () => BW.allSubs().length * 4 + BW.units.length + BW.quickModes.length + BW.CODE.all.length;
BW.qCount = s => (s.bank ? s.bank.length : 0);

/* describe any quiz id for task lists and teacher reports */
BW.quizLabel = id => {
  const [a, b, c] = id.split(".");
  if (a === "code") { const c = BW.findChallenge(b); return { title: c ? c.title : b, sub: c ? `Coding Lab · ${c.section.title}` : "Coding Lab", unit: null, code: true }; }
  if (a === "quick") { const m = BW.quickModes.find(x => x.id === b); return { title: m ? m.title : b, sub: "Quick fire", unit: null }; }
  const u = BW.findUnit(a); if (!u) return { title: id, sub: "", unit: null };
  if (b === "boss") return { title: `Boss battle: ${BW.BOSSES[a]}`, sub: u.title, unit: u };
  const s = u.subs.find(x => x.id === b);
  return { title: s ? s.title : b, sub: `${BW.LEVELS[+c]?.name || ""} · ${u.title}`, unit: u, sub_: s, level: +c };
};

BW.weeklyTargets = () => {
  const r = BW.rng("wk" + BW.weekKey()), all = BW.allSubs();
  const open = all.filter(({ u, s }) => !BW.medalsFor(u, s)[2]);
  const pool = BW.shuffle(open.length >= 3 ? open : all, r), picked = [], units = new Set();
  for (const x of pool) { if (!units.has(x.u.id)) { picked.push(x); units.add(x.u.id); } if (picked.length === 3) break; }
  const wk = BW.weekKey();
  return picked.map((x, i) => { const li = [0, 1, 1][i], id = BW.qid(x.u, x.s, li);
    return { ...x, li, done: BW.S.hist.some(h => h.quiz_id === id && +h.pct >= BW.PASS && BW.weekKey(new Date(h.finished_at)) === wk) }; });
};

/* fold a finish_attempt result into local state */
BW.applyResult = (res, quizId) => {
  const S = BW.S, p = S.profile;
  p.xp = res.xp; p.week_xp = res.week_xp; p.week_key = BW.weekKey(); p.streak = res.streak; p.last_day = BW.londonDay();
  p.best_streak = Math.max(p.best_streak || 0, res.streak);
  const b = S.best[quizId]; S.best[quizId] = { pct: Math.max(+res.pct, b?.pct || 0), tries: (b?.tries || 0) + 1, last: new Date().toISOString() };
  S.hist.unshift({ quiz_id: quizId, pct: res.pct, xp: res.xp_gain, finished_at: new Date().toISOString() });
  (res.badges || []).forEach(k => S.badges[k] = new Date().toISOString());
};

/* ---- src/quiz-build.js ---- */
/* Building quizzes: topic levels, boss battles, quick-fire modes */
BW.bankQ = (row, u, s) => { const [d, q, a, w, why] = row; return { type: "mc", q, answer: a, options: BW.shuffle([a, ...w]), why, d, src: s.title, key: "b:" + q }; };
BW.genQ = (name, d, s) => { try { const q = BW.gen[name](d); if (q) { q.d = d; q.src = s ? s.title : q.src || ""; q.key = "g:" + name; } return q; } catch (e) { console.warn(name, e); return null; } };
BW.interactives = (u, s, dset = [1, 2, 3]) => {
  const out = (BW.X[u.id + "." + s.id] || []).map(r => BW.xQuestion(r, s.title));
  (s.igen || []).forEach(g => { const q = BW.genQ(g, BW.pick(dset), s); if (q) out.push(q); });
  return BW.shuffle(out);
};
const qKey = q => q.q + (q.pre || "") + (q.items ? q.items.join() : "") + (q.expr || "");

BW.oneFrom = ({ u, s }, dset = [1, 2, 3], interactive = .25) => {
  if (Math.random() < interactive) { const x = BW.interactives(u, s, dset)[0]; if (x) return x; }
  const d = BW.pick(dset), gens = s.gen || [], bank = s.bank || [];
  if (gens.length && (!bank.length || Math.random() < .6)) { const q = BW.genQ(BW.pick(gens), d, s); if (q) return q; }
  const rows = bank.filter(r => dset.includes(r[0]));
  return BW.bankQ(BW.pick(rows.length ? rows : bank), u, s);
};

BW.buildSubQuiz = (u, s, li) => {
  const L = BW.LEVELS[li], gens = s.gen || [], bank = s.bank || [], seen = new Set(), out = [];
  const add = q => { if (q && !seen.has(qKey(q))) { seen.add(qKey(q)); out.push(q); return true; } return false; };
  const inter = BW.interactives(u, s, L.d), slots = Math.min(inter.length, li === 0 ? 1 : 2);
  const n = L.n - slots;
  const pool = BW.shuffle(bank.filter(r => L.d.includes(r[0]))), rest = BW.shuffle(bank.filter(r => !L.d.includes(r[0])));
  const bankTarget = gens.length ? Math.min(pool.length, Math.ceil(n * .35)) : n;
  pool.slice(0, bankTarget).forEach(r => add(BW.bankQ(r, u, s)));
  if (li === 3) BW.shuffle(u.subs.filter(x => x !== s)).slice(0, 3).forEach(x => add(BW.oneFrom({ u, s: x }, [2, 3], 0)));
  if (!gens.length) for (const r of pool.slice(bankTarget).concat(rest)) { if (out.length >= n) break; add(BW.bankQ(r, u, s)); }
  let guard = 0;
  while (gens.length && out.length < n && guard++ < 200) add(BW.genQ(BW.pick(gens), BW.pick(L.d), s));
  const main = BW.shuffle(out.slice(0, n));
  inter.slice(0, slots).forEach(q => main.splice(1 + Math.floor(Math.random() * main.length), 0, q));
  return main;
};
BW.buildMix = (pairs, n, dset, interactive = .25) => {
  const out = [], seen = new Set(); let i = 0, guard = 0;
  while (out.length < n && guard++ < n * 20) { const q = BW.oneFrom(pairs[i++ % pairs.length], dset, interactive); if (q && !seen.has(qKey(q))) { seen.add(qKey(q)); out.push(q); } }
  return out;
};
BW.buildGenMix = (names, n, dset) => { const out = [], seen = new Set(); let g = 0;
  while (out.length < n && g++ < 300) { const q = BW.genQ(BW.pick(names), BW.pick(dset)); if (q && !seen.has(qKey(q))) { seen.add(qKey(q)); out.push(q); } } return out; };

BW.quickModes = [
  { id: "daily", title: "Daily Challenge", sub: "10 questions from across the course, with bonus XP once a day", c1: "#F15BB5", c2: "#FF9F1C", motif: "ridges" },
  { id: "speed", title: "Speed Run", sub: "60 seconds on the clock. Wrong answers cost 3 seconds", c1: "#FB5607", c2: "#6C5CE7", motif: "waves" },
  { id: "blitz", title: "Binary Blitz", sub: "Flip bits and convert between binary, denary and hex", c1: "#6C5CE7", c2: "#00BBF9", motif: "bits" },
  { id: "logic", title: "Logic Lab", sub: "Wire up circuits and complete truth tables", c1: "#14213D", c2: "#22C55E", motif: "gates" },
  { id: "tracer", title: "Code Tracer", sub: "Trace loops, arrays, strings and SQL", c1: "#00BBF9", c2: "#9B5DE5", motif: "brackets" },
  { id: "weak", title: "Weak Spots", sub: "Targets the topics where you have the fewest medals", c1: "#FB5607", c2: "#FFBE0B", motif: "bars" }
];
const SPEED_GENS = ["binToDen", "denToBin", "hexToDen", "denToHex", "arith", "logicEval", "dataType", "ipv4", "units", "colours", "testData"];

BW.startQuick = (id, assignment) => {
  const m = BW.quickModes.find(x => x.id === id); if (!m) return;
  let qs = [], mode = "practice", more = null;
  if (id === "daily") { const r = BW.rng("day" + BW.dayKey()); qs = BW.buildMix(BW.shuffle(BW.allSubs(), r).slice(0, 10), 10, [1, 2, 3], .3); }
  if (id === "speed") { mode = "speed"; more = () => BW.genQ(BW.pick(SPEED_GENS), BW.pick([1, 2])); qs = [more(), more(), more()]; }
  if (id === "blitz") qs = BW.buildGenMix(["binToDen", "denToBin", "hexToDen", "denToHex", "binToHex", "hexToBin", "binAdd", "bitsDen", "bitsHex", "bitsAdd", "bitsShift"], 12, [1, 2, 3]);
  if (id === "logic") qs = BW.buildGenMix(["gateSet", "ttGrid", "logicEval", "truthTable"], 10, [1, 2, 3]);
  if (id === "tracer") qs = BW.buildGenMix(["traceLoop", "arrays", "strings", "sqlRows", "arith", "orderBubble"], 10, [1, 2, 3]);
  if (id === "weak") { const subs = BW.allSubs().sort((a, b) => BW.subStars(a.u, a.s) - BW.subStars(b.u, b.s) || Math.random() - .5).slice(0, 10); qs = BW.buildMix(subs, 10, [1, 2], .3); }
  const qid = id === "daily" && !assignment ? "daily." + BW.dayKey() : "quick." + id;
  BW.startQuiz({ id: qid, title: m.title, crumb: "Quick fire", mode, mult: id === "daily" ? 1.5 : 1.2, qs, more, back: assignment ? ["tasks"] : ["home"], assignment, cover: [m.c1, m.c2, m.motif] });
};
BW.startSub = (uid, sid, li, assignment) => {
  const { u, s } = BW.findSub(uid, sid), L = BW.LEVELS[li];
  BW.startQuiz({ id: BW.qid(u, s, li), title: s.title, crumb: `${L.name} · ${u.title}`, level: li, mode: L.mode, mult: L.mult, qs: BW.buildSubQuiz(u, s, li), back: assignment ? ["tasks"] : ["sub", { uid, sid }], assignment, lives: L.mode === "exam" ? 3 : 0 });
};
BW.startBoss = (uid, assignment) => {
  const u = BW.findUnit(uid);
  BW.startQuiz({ id: u.id + ".boss", title: BW.BOSSES[u.id], crumb: `Boss battle · ${u.title}`, mode: "boss", mult: 1.8, lives: 3, unit: u,
    qs: BW.buildMix(BW.shuffle(u.subs).map(s => ({ u, s })), 15, [1, 2, 3], .25), back: assignment ? ["tasks"] : ["unit", { uid }], assignment });
};
BW.startById = (quizId, assignment) => {
  const [a, b, c] = quizId.split(".");
  if (a === "quick") return BW.startQuick(b, assignment);
  if (a === "code") return BW.findChallenge(b) ? BW.go("code", { cid: b, a: assignment || null }) : BW.toast("That challenge isn't available any more.");
  if (b === "boss") return BW.startBoss(a, assignment);
  if (BW.findSub(a, b)?.s) return BW.startSub(a, b, +c || 0, assignment);
  BW.toast("That quiz isn't available any more.");
};

/* ---- src/quiz-play.js ---- */
/* Quiz player: HUD, lives, combos, boss battles, speed runs, per-question timing + answer log, server saving */
const CODES = "ABCDEFGH", WIDGETS = ["bits", "order", "match", "sort", "gate", "tt"];
BW.startQuiz = cfg => {
  cfg.qs = cfg.qs.filter(Boolean);
  cfg.qs.forEach((q, i) => { q.code = `${1 + Math.floor(i / 8)}${CODES[i % 8]}`; q.tries = 0; });
  clearInterval(BW.Q?.timer);
  BW.Q?.qClock && BW.clocks.delete(BW.Q.qClock); BW.Q?.totalClock && BW.clocks.delete(BW.Q.totalClock);
  const Q = BW.Q = { ...cfg, queue: cfg.qs.slice(), total: cfg.qs.length, resolved: 0, firstRight: 0, combo: 0, maxCombo: 0,
    log: [], seq: 0, totalClock: new BW.Clock(), qClock: null, cur: null, phase: "ask", lives: cfg.lives || 0, hp: cfg.qs.length, answered: 0, t0: Date.now() };
  Q.attemptP = BW.api.rpc("start_attempt", { p_quiz_id: cfg.id, p_assignment: cfg.assignment || null }).catch(e => { Q.startErr = e; return null; });
  if (Q.mode === "speed") {
    Q.timeLeft = 60;
    Q.timer = setInterval(() => {
      Q.timeLeft = Math.max(0, Q.timeLeft - 1);
      const t = document.getElementById("timeLeft"), b = document.getElementById("timeBar");
      if (t) t.textContent = Q.timeLeft + "s"; if (b) b.style.width = (Q.timeLeft / 60 * 100) + "%";
      if (Q.timeLeft <= 5 && Q.timeLeft > 0) BW.sfx.play("tick");
      if (Q.timeLeft <= 0) BW.finishQuiz();
    }, 1000);
  }
  BW.clocks.add(Q.totalClock);
  BW.nextQ();
};
BW.nextQ = () => {
  const Q = BW.Q; if (Q.finished) return;
  if (Q.mode === "speed") { if (Q.timeLeft <= 0) return BW.finishQuiz(); while (Q.queue.length < 2) { const m = Q.more(); if (m) { m.code = ""; m.tries = 0; Q.queue.push(m); } } }
  if (!Q.queue.length || ((Q.mode === "exam" || Q.mode === "boss") && Q.lives <= 0)) return BW.finishQuiz();
  Q.cur = Q.queue.shift(); Q.phase = "ask"; Q.sel = null; Q.gain = 0;
  if (Q.qClock) BW.clocks.delete(Q.qClock);
  Q.qClock = new BW.Clock(); BW.clocks.add(Q.qClock);
  Q.ws = WIDGETS.includes(Q.cur.type) ? BW.initWS(Q.cur) : null;
  BW.go("quiz");
};
BW.norm = (v, kind) => {
  v = String(v).trim();
  if (kind === "num") { const x = parseFloat(v.replace(/[,\s£]/g, "")); return isNaN(x) ? null : x; }
  if (kind === "bin") { const b = v.replace(/\s/g, ""); return /^[01]+$/.test(b) ? parseInt(b, 2) : null; }
  if (kind === "bits") return v.replace(/[\s,]/g, "");
  if (kind === "hex") { const h = v.replace(/\s/g, "").replace(/^(0x|&|#)/i, "").toUpperCase(); return /^[0-9A-F]+$/.test(h) ? parseInt(h, 16) : null; }
  if (kind === "list") return v.split(/[^0-9-]+/).filter(Boolean).map(Number).join(",");
  return v.replace(/^["']|["']$/g, "").toUpperCase();
};
BW.checkInput = (q, v) => { const a = BW.norm(v, q.norm), b = BW.norm(q.answer, q.norm); if (a === null || a === "") return null; return q.norm === "num" ? Math.abs(a - b) < 1e-6 : a === b; };
BW.previewXp = Q => Math.round(Q.firstRight * 10 * Q.mult) + (Q.maxCombo >= 3 ? Math.min(Q.maxCombo, 20) * 2 : 0);

BW.submit = val => {
  const Q = BW.Q, q = Q.cur; if (Q.phase !== "ask" || Q.finished) return;
  let ok;
  if (q.type === "mc") { ok = val === q.answer; Q.sel = val; }
  else if (q.type === "input") {
    ok = BW.checkInput(q, val);
    if (ok === null) { BW.toast(q.norm === "bin" || q.norm === "bits" ? "Use only 0s and 1s" : q.norm === "num" ? "Enter a number" : q.norm === "hex" ? "Use 0–9 and A–F" : "Type an answer first"); return; }
    Q.sel = val;
  } else ok = BW.wsCheck(q, Q.ws);
  Q.phase = ok ? "right" : "wrong"; Q.answered++;
  const before = BW.previewXp(Q), tryNo = q.tries + 1, ms = Q.qClock ? Q.qClock.ms() : 0;
  if (Q.qClock) { Q.qClock.pause(); BW.clocks.delete(Q.qClock); }
  Q.log.push({ seq: ++Q.seq, code: q.code || "", type: q.type, key: (q.key || "t:" + q.q).slice(0, 160), text: BW.qPlain(q), topic: q.src || Q.title,
    answer: String(BW.answerText(q, val, Q.ws) ?? "").slice(0, 2000), correct: String(BW.correctText(q) ?? "").slice(0, 2000), ok: !!ok, try: tryNo, ms });
  if (ok) {
    Q.combo++; Q.maxCombo = Math.max(Q.maxCombo, Q.combo);
    if (q.tries === 0) Q.firstRight++;
    Q.resolved++;
    if (Q.mode === "boss") { Q.hp--; BW.sfx.play("hit"); } else BW.sfx.play(Q.combo > 0 && Q.combo % 5 === 0 ? "combo" : "right");
  } else {
    Q.combo = 0; q.tries++;
    if (Q.mode === "standard") Q.queue.push(q); else Q.resolved++;
    if (Q.mode === "exam" || Q.mode === "boss") { Q.lives--; BW.sfx.play("hurt"); } else BW.sfx.play("wrong");
    if (Q.mode === "speed") Q.timeLeft = Math.max(0, Q.timeLeft - 3);
  }
  Q.gain = BW.previewXp(Q) - before;
  BW.go("quiz");
  if (Q.mode === "speed") setTimeout(() => { if (BW.Q === Q && Q.phase !== "ask" && BW.route.name === "quiz") BW.nextQ(); }, ok ? 450 : 1400);
};

BW.finishQuiz = async () => {
  const Q = BW.Q; if (Q.finished) return;
  Q.finished = true; clearInterval(Q.timer);
  Q.totalClock.pause(); BW.clocks.delete(Q.totalClock); if (Q.qClock) BW.clocks.delete(Q.qClock);
  const total = Q.mode === "speed" ? Math.max(1, Math.min(40, Q.resolved)) : Q.total;
  const log = Q.mode === "speed" ? Q.log.slice(0, 40) : Q.log.slice(0, 150);
  if (Q.mode === "speed") Q.firstRight = log.filter(x => x.ok).length;
  Q.maxCombo = Math.min(Q.maxCombo, Q.firstRight);
  Q.finalTotal = total; Q.pct = Q.firstRight / total; Q.pass = Q.pct >= BW.PASS;
  Q.victory = Q.mode === "boss" ? Q.hp <= 0 && Q.lives > 0 : null;
  Q.saving = true; BW.go("results");
  if (Q.pass || Q.victory) { BW.confetti(); BW.sfx.play("win"); }
  BW.saveQuiz(Q, total, log);
};
/* save the score; if the connection fails the results page offers "Try again" (a save that did get through isn't counted twice) */
BW.saveQuiz = async (Q, total, log) => {
  Q.saving = true; Q.saveErr = null; Q.saveArgs = [total, log];
  if (BW.Q === Q && BW.route.name === "results") BW.render();
  const oldLevel = BW.levelOf(BW.S.profile.xp).L;
  try {
    const id = await Q.attemptP;   // started when the quiz opened (a quiz started later couldn't pass the minimum-time check)
    if (!id) throw Q.startErr || new Error("not_saved");
    const res = await BW.api.rpc("finish_attempt", { p_attempt: id, p_total: total, p_correct: Q.firstRight,
      p_max_combo: Q.maxCombo, p_answers: log, p_active_ms: Q.totalClock.ms() });
    BW.applyResult(res, Q.id); Q.res = res;
    BW.afterWork();
    BW.invalidate("board:");
  } catch (e) { Q.saveErr = BW.errMsg(e); }
  Q.saving = false;
  if (BW.Q === Q && BW.route.name === "results") BW.render();
  const L = BW.levelOf(BW.S.profile.xp).L;
  if (Q.res && L > oldLevel) setTimeout(() => { BW.sfx.play("level"); BW.confetti(200);
    BW.modal(`<div class="levelup"><div class="ring big" style="--p:100"><i>${L}</i></div><h2>Level up!</h2><p class="muted">You're now level ${L}: <b>${BW.titleOf(L)}</b>.</p><button class="cta" data-close>Keep going</button></div>`); }, 900);
};

/* ---------- views ---------- */
BW.viewQuiz = () => {
  const Q = BW.Q, q = Q.cur, E = BW.esc, I = BW.icon, fin = Q.phase !== "ask", isW = !!Q.ws;
  const pct = Q.mode === "speed" ? Q.timeLeft / 60 * 100 : Math.min(100, Q.resolved / Q.total * 100);
  const hearts = Q.lives || Q.mode === "exam" || Q.mode === "boss" ? `<span class="lives" aria-label="${Q.lives} lives left">${[0, 1, 2].map(i => `<i class="${i < Q.lives ? "" : "lost"}">${I.heart}</i>`).join("")}</span>` : "";
  let body = "";
  if (q.type === "mc") {
    body = `<div class="opts">${q.options.map((o, i) => { let cls = ""; if (fin) { if (o === q.answer) cls = "right"; else if (o === Q.sel) cls = "wrong"; }
      return `<button class="opt ${cls}" data-opt="${E(o)}" ${fin ? "disabled" : ""}><span class="key">${i + 1}</span><span>${BW.fmt(o)}</span></button>`; }).join("")}</div>`;
  } else if (q.type === "input") {
    const st = fin ? (Q.phase === "right" ? "right" : "wrong") : "";
    const mode = q.norm === "num" ? 'inputmode="decimal"' : q.norm === "bin" || q.norm === "bits" ? 'inputmode="numeric"' : "";
    body = `<form class="ans-in" id="ansForm"><input id="ans" class="${st}" autocomplete="off" spellcheck="false" ${mode} placeholder="${q.norm === "list" ? "e.g. 3,7,9" : "Your answer"}" value="${fin ? E(Q.sel) : ""}" ${fin ? "disabled" : ""} aria-label="Your answer"></form>
      ${!fin && q.pad === "bin" ? `<div class="bitpad"><button data-k="0">0</button><button data-k="1">1</button><button data-k="del" aria-label="Delete">⌫</button></div>` : ""}`;
  } else body = `<div id="widget" class="widget">${BW.renderWidget(q, Q.ws, fin)}</div>`;
  let fb = "";
  if (fin) {
    const ok = Q.phase === "right";
    const head = ok ? (Q.gain ? `Correct · +${Q.gain} XP` : "Correct") : isW ? "Not quite." : `Not quite. The answer is ${BW.fmt(q.answer)}`;
    const extra = !ok ? (Q.mode === "standard" ? "This question will come back at the end." : Q.mode === "speed" ? "−3 seconds." : Q.lives >= 0 && (Q.mode === "exam" || Q.mode === "boss") ? `You lost a life. ${Q.lives} left.` : "") : "";
    fb = `<div class="feedback ${ok ? "ok" : "no"} pop"><span class="fi">${ok ? I.check : I.cross}</span><div><b>${head}</b>${BW.fmt(q.why || "")}${extra ? `<br><span class="muted">${extra}</span>` : ""}</div></div>`;
  }
  const boss = Q.mode === "boss" ? `<div class="boss ${Q.phase === "right" ? "hit" : ""}"><div class="boss-art" style="background-image:${BW.unitCover(Q.unit, 200, 200)}"><span>${E(Q.unit.id.toUpperCase())}</span></div><div class="boss-info"><b>${E(Q.title)}</b><div class="hpbar"><i style="width:${Q.hp / Q.total * 100}%"></i></div><small class="num">HP ${Q.hp}/${Q.total}</small></div></div>` : "";
  const action = fin ? (Q.mode === "speed" ? "" : `<button class="cta" data-act="next" id="nextBtn">Continue ${I.arrow.replace("<svg", '<svg width="20" height="20"')}</button>`)
    : q.type === "input" ? `<button class="cta" data-act="check">Check answer</button>` : isW ? `<button class="cta" data-act="checkw" ${BW.wsReady(q, Q.ws) ? "" : "disabled"}>Check answer</button>` : "";
  return `<div class="quiz mode-${Q.mode}">
    <div class="qtop"><button class="hdr-btn" data-act="quit" aria-label="Leave quiz">${I.close}</button>
      <div class="bar ${Q.mode === "speed" ? "timebar" : ""}" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i id="timeBar" style="width:${pct}%"></i></div>
      ${Q.mode === "speed" ? `<span class="xp-pill num" id="timeLeft">${Q.timeLeft}s</span>` : ""}${hearts}<span class="xp-pill num">${BW.previewXp(Q)} XP</span></div>
    ${boss}
    <div class="qcard-main ${Q.phase === "wrong" ? "shake" : ""} ${Q.phase === "right" && Q.combo >= 3 ? "glow" : ""}">
      <div class="qmeta">${q.code ? `<span class="code-chip">${q.code}</span>` : ""}<span class="tagc">${E(Q.crumb)}</span>${q.src && q.src !== Q.title ? `<span class="tagc">${E(q.src)}</span>` : ""}${q.tries ? `<span class="tagc">Second go</span>` : ""}${Q.combo >= 2 ? `<span class="combo pop">${I.flame} Combo ×${Q.combo}</span>` : ""}</div>
      <div class="qtext">${BW.fmt(q.q)}</div>
      ${q.pre ? `<div class="qpre">${E(q.pre)}</div>` : ""}
      ${body}${fb}
      <div class="q-actions">${action}</div>
    </div>
    <p class="note" style="text-align:center">${Q.mode === "speed" ? `${Q.firstRight} right so far` : `${Math.max(0, Q.total - Q.resolved)} question${Q.total - Q.resolved === 1 ? "" : "s"} to go`} · keys 1–4 pick an option, Enter continues</p>
  </div>`;
};
BW.bindQuiz = root => {
  const Q = BW.Q;
  root.querySelectorAll("[data-opt]").forEach(b => b.onclick = () => BW.submit(b.dataset.opt));
  const f = root.querySelector("#ansForm"), inp = root.querySelector("#ans");
  if (f) f.onsubmit = e => { e.preventDefault(); BW.submit(inp.value); };
  root.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { if (b.dataset.k === "del") inp.value = inp.value.slice(0, -1); else inp.value += b.dataset.k; inp.focus(); });
  root.querySelector("[data-act=check]")?.addEventListener("click", () => BW.submit(inp.value));
  root.querySelector("[data-act=checkw]")?.addEventListener("click", () => BW.submit());
  root.querySelector("[data-act=next]")?.addEventListener("click", BW.nextQ);
  root.querySelector("[data-act=quit]").onclick = () => {
    if (Q.resolved === 0) { clearInterval(Q.timer); Q.finished = true; return BW.go(...Q.back); }
    BW.modal(`<h2>Leave this quiz?</h2><p class="muted" style="margin:8px 0 18px">Your answers so far won't be saved.</p><div class="row-btns"><button class="cta ghost" data-close>Keep playing</button><button class="cta" id="leaveQ">Leave</button></div>`,
      (w, close) => w.querySelector("#leaveQ").onclick = () => { close(); clearInterval(Q.timer); Q.finished = true; BW.go(...Q.back); });
  };
  const wEl = root.querySelector("#widget");
  if (wEl && Q.phase === "ask") {
    const rerender = () => { wEl.innerHTML = BW.renderWidget(Q.cur, Q.ws, false); BW.bindWidget(wEl, Q.cur, Q.ws, rerender); const c = root.querySelector("[data-act=checkw]"); if (c) c.disabled = !BW.wsReady(Q.cur, Q.ws); };
    BW.bindWidget(wEl, Q.cur, Q.ws, rerender);
  }
  if (Q.phase === "ask" && inp) inp.focus(); else if (Q.phase !== "ask") root.querySelector("#nextBtn")?.focus();
};
document.addEventListener("keydown", e => {
  if (BW.route?.name !== "quiz" || !BW.Q || document.querySelector(".modal-wrap")) return;
  const Q = BW.Q;
  if (Q.phase === "ask" && Q.cur.type === "mc" && /^[1-4]$/.test(e.key)) { const o = Q.cur.options[+e.key - 1]; if (o !== undefined) BW.submit(o); }
  else if (Q.phase !== "ask" && Q.mode !== "speed" && e.key === "Enter" && document.activeElement?.id !== "nextBtn") { e.preventDefault(); BW.nextQ(); }
});

BW.viewResults = () => {
  const Q = BW.Q, E = BW.esc, L = Q.level != null ? BW.LEVELS[Q.level] : null, pct = Math.round(Q.pct * 100);
  let hero = "";
  if (Q.mode === "boss") hero = `<div class="boss-result ${Q.victory ? "win" : "lose"} pop"><div class="boss-art big" style="background-image:${BW.unitCover(Q.unit, 300, 300)}"><span>${E(Q.unit.id.toUpperCase())}</span></div><h2>${Q.victory ? `${E(Q.title)} defeated!` : `${E(Q.title)} wins this round`}</h2></div>`;
  else if (L && Q.pass) hero = `<div class="medal-big pop" style="background:${L.hex};color:${L.ink}">${L.name}</div>`;
  const msg = Q.mode === "speed" ? `You answered ${Q.resolved} and got ${Q.firstRight} right in 60 seconds.`
    : Q.pass ? (L ? `${L.name} medal earned for ${E(Q.title)}.` : "Great work. That's a pass.") : `You need ${Math.round(BW.PASS * 100)}% right first time to pass. Have another go.`;
  const r = Q.res, badges = (r?.badges || []).map(k => BW.BADGES[k]).filter(Boolean);
  return `<div class="results">
    ${hero}
    <div class="big-score num">${Q.mode === "speed" ? Q.firstRight : pct + "%"}</div>
    <h2>${Q.mode === "speed" ? "Time's up" : Q.pass ? "Nailed it" : "Keep going"}</h2>
    <p class="muted" style="margin-top:6px">${msg}</p>
    <div class="res-stats">
      <div class="stat"><b class="num">${Q.firstRight}/${Q.finalTotal}</b><span>First time</span></div>
      <div class="stat"><b class="num">${Q.saving ? `<span class="dots" aria-label="Saving"><i></i><i></i><i></i></span>` : r ? "+" + r.xp_gain : "–"}</b><span>XP earned</span></div>
      <div class="stat"><b class="num">${Q.maxCombo}</b><span>Best combo</span></div>
    </div>
    ${Q.saving ? `<p class="note saving-note">${BW.bitLoader(4, true)} Saving your score…</p>` : Q.saveErr ? `<p class="note err">Your score wasn't saved. ${E(Q.saveErr)} <button class="link" data-act="retrysave">Try again</button></p>` : r?.first_daily ? `<p class="note">Includes +30 XP Daily Challenge bonus.</p>` : ""}
    ${badges.length ? `<div class="new-badges"><h3>New badge${badges.length > 1 ? "s" : ""}</h3><div class="badge-grid">${badges.map(b => BW.badgeHTML(b, true)).join("")}</div></div>` : ""}
    <div style="display:grid;gap:10px;margin-top:18px">
      <button class="cta" data-act="again">${Q.mode === "boss" && !Q.victory ? "Rematch" : "Play again"}</button>
      <button class="cta ghost" data-act="done">${Q.assignment ? "Back to tasks" : "Done"}</button>
    </div>
  </div>`;
};
BW.bindResults = root => {
  const Q = BW.Q;
  root.querySelector("[data-act=done]").onclick = () => BW.go(...Q.back);
  root.querySelector("[data-act=again]").onclick = () => BW.startById(Q.id.startsWith("daily.") ? "quick.daily" : Q.id, Q.assignment);
  root.querySelector("[data-act=retrysave]")?.addEventListener("click", () => { BW.reconnect().then(() => BW.saveQuiz(Q, ...Q.saveArgs)); });
};
BW.badgeHTML = (b, earned) => `<div class="badge ${earned ? "earned pop" : ""}" title="${BW.esc(b[1])}"><div class="hex"><span>${BW.esc(b[2])}</span></div><b>${BW.esc(b[0])}</b><small>${BW.esc(b[1])}</small></div>`;

/* plain-text versions of a question, the learner's answer and the right answer (for teacher analytics) */
BW.qPlain = q => (q.q + (q.pre ? "\n" + q.pre : "")).replace(/`/g, "").slice(0, 600);
BW.answerText = (q, val, ws) => {
  switch (q.type) {
    case "mc": case "input": return String(val ?? "");
    case "bits": return ws.bits.join("");
    case "order": return ws.order.join(" → ");
    case "match": return q.pairs.map((p, i) => `${p[0]} → ${ws.right[ws.link[i]] ?? "?"}`).join("; ");
    case "sort": return q.buckets.map((b, k) => `${b}: ${q.items.filter((_, i) => ws.place[i] === k).map(it => it[0]).join(", ") || "none"}`).join(" | ");
    case "gate": return Object.entries(ws.env).map(([k, v]) => `${k}=${v}`).join(", ") + ` → Q=${BW.evalTree(q.tree, ws.env)}`;
    case "tt": return ws.out.map(v => v ?? "?").join("");
  }
  return "";
};
BW.correctText = q => {
  switch (q.type) {
    case "order": return q.items.join(" → ");
    case "match": return q.pairs.map(p => `${p[0]} → ${p[1]}`).join("; ");
    case "sort": return q.buckets.map((b, k) => `${b}: ${q.items.filter(it => it[1] === k).map(it => it[0]).join(", ")}`).join(" | ");
    case "gate": return `Any inputs giving Q = ${q.target} (Q = ${q.expr})`;
  }
  return String(q.answer ?? "");
};

/* ---- src/app-views.js ---- */
/* Learner screens: home, side panel, topics, unit, subtopic */
BW.ui = { chip: "all", subTab: "quiz", open: null, search: "" };
const E = BW.esc, I = BW.icon;

BW.myName = () => BW.S.profile?.display_name || "";
BW.avatarHTML = (cls = "avatar", p = BW.S.profile) => `<div class="${cls}" style="background:${E(p?.avatar_color || "#6C5CE7")};color:${BW.onColor(p?.avatar_color || "#6C5CE7")}">${E((p?.display_name || "?").slice(0, 1).toUpperCase())}</div>`;
BW.medalsHTML = (u, s) => `<span class="stars" aria-label="${BW.subStars(u, s)} of 4 medals">${BW.medalsFor(u, s).map((m, i) => `<i class="medal ${m ? BW.LEVELS[i].key : ""}"></i>`).join("")}</span>`;
BW.favBtn = (key, cls = "heart") => { const on = !!BW.favs()[key]; return `<button class="${cls} ${on ? "on" : ""}" data-fav="${key}" aria-label="${on ? "Remove from saved" : "Save"}" aria-pressed="${on}">${I.heart}</button>`; };
BW.unitMedals = u => `${u.subs.reduce((a, s) => a + BW.subStars(u, s), 0)}/${u.subs.length * 4}`;
BW.dueLabel = t => {
  if (!t) return { text: "No due date", cls: "" };
  const d = (new Date(t) - Date.now()) / 864e5;
  if (d < 0) return { text: "Overdue", cls: "bad" };
  if (d < 1) return { text: `Due ${new Date(t).toDateString() === new Date().toDateString() ? "today" : "tomorrow"}`, cls: "warn" };
  if (d < 7) return { text: `Due ${new Date(t).toLocaleDateString(undefined, { weekday: "long" })}`, cls: "" };
  return { text: `Due ${new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`, cls: "" };
};

BW.unitCard = u => `<article class="ucard" data-unit="${u.id}" style="background-image:${BW.unitCover(u, 640, 800)}">
  ${BW.favBtn("u:" + u.id)}
  <span class="eyebrow">Unit ${BW.units.indexOf(u) + 1}</span>
  <h3>${E(u.title)}</h3>
  <div class="meta"><span class="glass">${I.star} ${BW.unitMedals(u)}</span><span>${u.subs.length * 4 + 1} quizzes</span>${BW.S.best[u.id + ".boss"]?.pct >= BW.PASS ? `<span class="glass">Boss beaten</span>` : ""}</div>
  <button class="see-more" data-unit="${u.id}">See more <span class="go">${I.chev.replace("<svg", '<svg width="20" height="20"')}</span></button>
</article>`;
BW.labCard = () => { const all = BW.CODE.all, solved = all.filter(BW.codeSolved).length;
  return `<article class="ucard" data-nav="codelab" style="background-image:${BW.cover("codelab", "#0B1220", "#22C55E", "brackets", 640, 800)}">
  <span class="eyebrow">Python</span><h3>Coding Lab</h3>
  <div class="meta"><span class="glass">${I.star} ${solved}/${all.length} solved</span><span>${all.length} Python challenges</span></div>
  <button class="see-more" data-nav="codelab">Start coding <span class="go">${I.chev.replace("<svg", '<svg width="20" height="20"')}</span></button></article>`; };
BW.subTile = (u, s, showUnit = true) => `<article class="tile" data-sub="${u.id}/${s.id}">
  <div class="thumb" style="background-image:${BW.subCover(u, s)}">${BW.favBtn("s:" + u.id + "." + s.id)}${BW.X[u.id + "." + s.id] || s.igen ? `<span class="tag-int">Hands-on</span>` : ""}</div>
  <div class="t-title">${E(s.title)}</div>
  <div class="t-meta">${showUnit ? `${E(u.title)} <i class="dot"></i> ` : ""}${s.gen || s.igen ? "Unlimited questions" : `${BW.qCount(s)} questions`}</div>
  <div class="t-foot">${BW.medalsHTML(u, s)}<button class="go-dark" data-sub="${u.id}/${s.id}" aria-label="Open ${E(s.title)}">${I.arrow}</button></div>
</article>`;
BW.searchHits = term => { const t = term.toLowerCase().trim(); if (!t) return [];
  return BW.allSubs().filter(({ u, s }) => (s.title + " " + u.title + " " + (s.notes || []).join(" ")).toLowerCase().includes(t)).slice(0, 8); };
BW.hitsHTML = hits => hits.length ? `<div class="search-results">${hits.map(({ u, s }) => `<button class="target" data-sub="${u.id}/${s.id}"><span class="sw" style="background-image:${BW.subCover(u, s, 120, 120)}"></span><span class="tt"><b>${E(s.title)}</b><small>${E(u.title)}</small></span>${BW.medalsHTML(u, s)}</button>`).join("")}</div>`
  : (BW.ui.search.trim() ? `<p class="note">No topics match “${E(BW.ui.search)}”.</p>` : "");

BW.taskRow = t => {
  const q0 = t.items?.[0]?.quiz_id || "", lab = BW.quizLabel(q0), due = BW.dueLabel(t.due_at), done = !!t.completed_at, u = lab.unit, k = t.items?.length || 1;
  const best = t.best != null ? Math.round(t.best * 100) : null;
  return `<button class="target task ${done ? "is-done" : ""}" data-task="${t.id}">
    <span class="sw" style="background-image:${u ? BW.unitCover(u, 120, 120) : BW.codeCover(q0, 120, 120)}"></span>
    <span class="tt"><b>${E(t.title)}</b><small>${E(t.class_name)} · ${done ? "Done" : `<span class="due ${due.cls}">${due.text}</span>`}${!done ? ` · ${t.items_done}/${k} item${k === 1 ? "" : "s"} done` : ""}</small></span>
    <span class="tick ${done ? "done" : ""}">${done ? I.check : ""}</span></button>`;
};
BW.joinCard = () => `<section class="panel join"><h3>Join a class</h3><p class="muted">Type the code your teacher gave you.</p><form class="nick" id="joinForm"><input id="joinCode" maxlength="8" placeholder="e.g. K7Q2MX" autocomplete="off" aria-label="Class code" style="text-transform:uppercase;font-family:var(--mono)"><button class="small-btn">Join</button></form></section>`;

BW.viewHome = () => {
  const c = BW.ui.chip; let units = BW.units;
  if (c === "p1") units = units.filter(u => u.paper === 1);
  if (c === "p2") units = units.filter(u => u.paper === 2);
  if (c === "prog") units = units.filter(u => { const m = BW.unitMastery(u); return m > 0 && m < 1; });
  if (c === "saved") units = units.filter(u => BW.favs()["u:" + u.id]);
  const savedSubs = c === "saved" ? BW.allSubs().filter(({ u, s }) => BW.favs()["s:" + u.id + "." + s.id]) : [];
  const chips = [["all", "All units"], ["p1", "Computer systems"], ["p2", "Algorithms & programming"], ["prog", "In progress"], ["saved", "Saved"]];
  const lv = BW.levelOf(BW.S.profile.xp), today = BW.S.best["daily." + BW.dayKey()];
  return `<header class="hello"><div><h1>Hello, ${E(BW.myName().split(" ")[0])}</h1><p class="sub">Level ${lv.L} ${E(BW.titleOf(lv.L))} · ${BW.liveStreak() ? `${I.flame} ${BW.liveStreak()}-day streak` : "Answer a quiz today to start a streak"}</p></div><button class="avatar-btn" data-nav="profile" aria-label="Your profile">${BW.avatarHTML()}</button></header>
  <form class="search" id="searchForm" role="search">${I.search}<input id="search" placeholder="Search topics, e.g. hex, SQL, firewall" value="${E(BW.ui.search)}" aria-label="Search topics"><button type="button" class="icon-dark" data-nav="topics" aria-label="Browse all topics">${I.sliders}</button></form>
  <div id="hits">${BW.hitsHTML(BW.searchHits(BW.ui.search))}</div>
  <div class="sec-head"><h2>Pick your next topic</h2><button class="link" data-nav="topics">See all</button></div>
  <div class="chips" role="tablist">${chips.map(([k, l]) => `<button class="chip ${c === k ? "on" : ""}" data-chip="${k}" role="tab" aria-selected="${c === k}">${l}</button>`).join("")}</div>
  ${units.length || c === "all" || c === "p2" ? `<div class="deck" style="margin-top:14px">${c === "all" || c === "p2" ? BW.labCard() : ""}${units.map(BW.unitCard).join("")}</div>` : `<div class="empty">${c === "saved" ? "Tap the heart on a unit or topic to save it here." : "Nothing in progress yet. Start any quiz below."}</div>`}
  ${savedSubs.length ? `<div class="row-cards">${savedSubs.map(({ u, s }) => BW.subTile(u, s)).join("")}</div>` : ""}
  <div class="sec-head"><h2>Quick fire</h2></div>
  <div class="quick">${BW.quickModes.map(m => `<button class="qcard" data-quick="${m.id}" style="background-image:${BW.cover("q" + m.id, m.c1, m.c2, m.motif, 520, 360)}"><small>${m.id === "daily" ? (today ? `Done today · ${Math.round(today.pct * 100)}%` : "+30 XP bonus today") : m.id === "speed" ? (BW.S.best["quick.speed"] ? `Best ${Math.round(BW.S.best["quick.speed"].pct * 100)}% accuracy` : "Beat the clock") : "Endless practice"}</small><div><b>${m.title}</b><br><small>${m.sub}</small></div></button>`).join("")}</div>`;
};

BW.viewSide = () => {
  const p = BW.S.profile, lv = BW.levelOf(p.xp), teacher = BW.isTeacher();
  const open = BW.S.tasks.filter(t => !t.completed_at).slice(0, 3);
  const cls = BW.myClasses();
  return `<section class="panel"><div class="lvl"><div class="ring" style="--p:${Math.round(lv.into / lv.need * 100)}"><i>${lv.L}</i></div><div><h3 style="margin:0">${E(BW.titleOf(lv.L))}</h3><p class="muted num">${lv.need - lv.into} XP to level ${lv.L + 1}</p></div></div>
    <div class="stat-row"><div class="stat"><b class="num">${BW.weekXp()}</b><span>XP this week</span></div><div class="stat"><b class="num">${BW.liveStreak()}</b><span>Day streak</span></div><div class="stat"><b class="num">${Object.keys(BW.S.badges).length}</b><span>Badges</span></div></div></section>
  ${teacher ? "" : BW.noticeTeaser()}
  ${teacher ? "" : cls.length || BW.S.profile.managed ? `<section class="panel"><div class="sec-head" style="margin:0 0 8px"><h3 style="margin:0">Your tasks</h3><button class="link" data-nav="tasks">See all</button></div>${open.length ? open.map(BW.taskRow).join("") : `<p class="muted">You're all caught up.</p>`}</section>` : BW.joinCard()}
  <section class="panel"><h3>This week's targets</h3>${BW.weeklyTargets().map(({ u, s, li, done }) => `<button class="target" data-start="${u.id}/${s.id}/${li}"><span class="sw" style="background-image:${BW.subCover(u, s, 120, 120)}"></span><span class="tt"><b>${E(s.title)}</b><small>Pass ${BW.LEVELS[li].name} · ${E(u.title)}</small></span><span class="tick ${done ? "done" : ""}">${done ? I.check : ""}</span></button>`).join("")}<p class="note">New targets every Monday.</p></section>
  ${cls.length ? `<section class="panel lb-mini"><div class="sec-head" style="margin:0 0 6px"><h3 style="margin:0">Class leaderboard</h3><button class="link" data-nav="board">See all</button></div><div id="miniBoard"><p class="muted">Loading…</p></div></section>` : ""}`;
};

BW.viewTopics = () => `<h1>All topics</h1>
  <button class="boss-cta lab-cta" data-nav="codelab" style="background-image:${BW.cover("codelab-strip", "#0B1220", "#22C55E", "brackets", 900, 300)}"><span><b>Coding Lab</b><small>${BW.CODE.sections.map(s => s.title).join(" · ")}</small></span><span class="go">${I.arrow}</span></button>
  <form class="search" id="searchForm" role="search">${I.search}<input id="search" placeholder="Filter topics" value="${E(BW.ui.search)}" aria-label="Filter topics"></form>
  ${BW.units.map(u => { const hits = BW.ui.search.trim() ? BW.searchHits(BW.ui.search) : null; const subs = u.subs.filter(s => !hits || hits.some(h => h.s === s)); if (!subs.length) return "";
    return `<div class="sec-head"><div style="display:flex;gap:12px;align-items:center"><span class="avatar" style="width:40px;height:40px;background-image:${BW.unitCover(u, 120, 120)};background-size:cover;box-shadow:none"></span><div><h2>${E(u.title)}</h2><span class="muted">${BW.unitMedals(u)} medals</span></div></div><button class="link" data-unit="${u.id}">Open unit</button></div>
    <div class="row-cards">${subs.map(s => BW.subTile(u, s, false)).join("")}</div>`; }).join("")}`;

BW.viewUnit = ({ uid }) => {
  const u = BW.findUnit(uid), best = BW.S.best[u.id + ".boss"];
  return `<div class="hero" style="background-image:${BW.unitCover(u, 1400, 640)}"><button class="back" data-back aria-label="Back">${I.back}</button>${BW.favBtn("u:" + u.id)}</div>
  <div class="sheet"><div class="grab"></div>
    <div class="sheet-top"><div><h1>${E(u.title)}</h1><div class="badge-line"><span class="pbadge" style="background:${u.c1}">${u.paper}</span>Paper ${u.paper} · Unit ${BW.units.indexOf(u) + 1}</div></div>
      <div class="rate"><span class="pillo">${I.star} ${BW.unitMedals(u)}</span><span class="muted">${Math.round(BW.unitMastery(u) * 100)}% mastered</span></div></div>
    <p class="blurb">${E(u.blurb)}</p>
    <button class="boss-cta" data-boss="${u.id}" style="background-image:${BW.cover(u.id + "boss", "#14161A", u.c1, u.motif, 900, 300)}"><span><small>Boss battle · 15 questions · 3 lives</small><b>${E(BW.BOSSES[u.id])}</b><small>${best ? `Best ${Math.round(best.pct * 100)}%${best.pct >= BW.PASS ? " · defeated" : ""}` : "Mixed questions from every topic in this unit"}</small></span><span class="go">${I.arrow}</span></button>
    <div class="sec-head"><h2>Topics</h2><span class="muted">${u.subs.length} topics</span></div>
    <div class="row-cards">${u.subs.map(s => BW.subTile(u, s, false)).join("")}</div>
  </div>`;
};

BW.viewSub = ({ uid, sid }) => {
  const { u, s } = BW.findSub(uid, sid), tab = BW.ui.subTab, med = BW.medalsFor(u, s);
  if (BW.ui.open == null) BW.ui.open = Math.max(0, med.indexOf(false));
  const tabs = [["quiz", "Quizzes"], ["facts", "Key facts"], ["scores", "Your scores"]];
  const arrow = I.arrow.replace("<svg", '<svg width="20" height="20"');
  let body = "";
  if (tab === "quiz") {
    body = BW.LEVELS.map((L, i) => { const b = BW.S.best[BW.qid(u, s, i)], open = BW.ui.open === i;
      return `<div class="acc ${open ? "open" : ""}"><button class="acc-head" data-open="${i}" aria-expanded="${open}"><span class="sw" style="background-image:${BW.cover(u.id + s.id + i, L.hex, u.c1, s.motif || u.motif, 240, 180)}">${med[i] ? I.check.replace("<svg", '<svg width="30" height="30"') : ""}</span><span class="tt"><small>Level ${i + 1}</small><b>${L.name}</b><small>${b ? `Best ${Math.round(b.pct * 100)}% · ${b.tries} attempt${b.tries > 1 ? "s" : ""}` : "Not tried yet"}</small></span>${I.down}</button>
        ${open ? `<div class="acc-body"><div><div class="k">Questions</div><div class="v">${L.n} questions${s.gen || s.igen ? ", freshly generated each time" : ""}</div></div><div><div class="k">How it works</div><div class="v">${L.blurb}</div></div><div><div class="k">Rewards</div><div class="v">${Math.round(10 * L.mult)} XP per first-time answer, combo bonuses, and a ${L.name} medal at ${Math.round(BW.PASS * 100)}%</div></div></div>` : ""}</div>`; }).join("")
      + `<div class="cta-dock"><button class="cta" data-start="${u.id}/${s.id}/${BW.ui.open}">Start ${BW.LEVELS[BW.ui.open].name} quiz ${arrow}</button></div>`;
  } else if (tab === "facts") {
    body = `<div class="facts">${(s.notes || []).map(n => `<div class="fact"><span class="pbadge" style="background:${u.c1};flex:none;margin-top:2px">${I.check.replace("<svg", '<svg width="12" height="12"')}</span><p>${BW.fmt(n)}</p></div>`).join("")}</div>
      <div class="cta-dock"><button class="cta" data-start="${u.id}/${s.id}/0">Test yourself: Bronze quiz ${arrow}</button></div>`;
  } else {
    const h = BW.S.hist.filter(x => x.quiz_id.startsWith(u.id + "." + s.id + "."));
    body = h.length ? `<div class="panel hist">${h.map(x => `<div class="row"><span>${BW.LEVELS[+x.quiz_id.split(".")[2]].name}</span><span class="muted">${new Date(x.finished_at).toLocaleDateString()}</span><span class="num"><b>${Math.round(x.pct * 100)}%</b> · +${x.xp} XP</span></div>`).join("")}</div>` : `<div class="empty">No attempts yet. Start with Bronze.</div>`;
  }
  return `<div class="sub-body"><div class="sub-hdr"><button class="hdr-btn" data-back aria-label="Back">${I.back}</button><div><h1>${E(s.title)}</h1><p class="muted">${E(u.title)} · Paper ${u.paper}</p></div>${BW.favBtn("s:" + u.id + "." + s.id, "hdr-btn heart solid")}</div>
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab ${tab === k ? "on" : ""}" data-tab="${k}" role="tab" aria-selected="${tab === k}">${l}</button>`).join("")}</div>${body}</div>`;
};

/* ---- src/app-student.js ---- */
/* Student tasks + everyone's profile page */
BW.viewTasks = () => {
  const S = BW.S, todo = S.tasks.filter(t => !t.completed_at), done = S.tasks.filter(t => t.completed_at), cls = BW.myClasses();
  const card = t => { const due = BW.dueLabel(t.due_at), items = t.items || [], k = items.length, first = BW.itemLabel(items[0]?.quiz_id || "");
    const next = items.findIndex(it => !it.completed_at), cover = (() => { const lab = BW.quizLabel(items[0]?.quiz_id || ""); return lab.unit ? BW.unitCover(lab.unit, 240, 240) : BW.codeCover(items[0]?.quiz_id || "t", 240, 240); })();
    return `<article class="task-card multi"><div class="sw" style="background-image:${cover}"></div>
      <div class="tc-body"><div class="tc-top"><span class="due-chip ${due.cls}">${due.text}</span><span class="muted">${E(t.class_name)}</span></div>
      <h3>${E(t.title)}</h3>${t.instructions ? `<p class="tc-note">${E(t.instructions)}</p>` : ""}
      ${t.resub && !t.completed_at ? `<div class="redo-box"><b>↺ ${E(t.resub.teacher_name || "Your teacher")} asked you to resubmit</b>${t.resub.reason ? `<p>${E(t.resub.reason)}</p>` : ""}</div>` : ""}
      <div class="tc-prog"><div class="bar"><i style="width:${k ? t.items_done / k * 100 : 0}%"></i></div><span class="num">${t.items_done}/${k} item${k === 1 ? "" : "s"} done · target ${t.target_pct}% each</span></div>
      <ol class="task-items">${items.map((it, i) => { const l = BW.itemLabel(it.quiz_id), done = !!it.completed_at, b = it.best != null ? Math.round(it.best * 100) : null;
        return `<li><button class="task-item ${done ? "done" : ""} ${i === next ? "next" : ""}" data-taskitem="${t.id}|${E(it.quiz_id)}"><span class="ex-ico">${l.icon}</span>
          <span class="tt"><b>${E(l.name)}</b><small>${!done && t.resub?.quiz_ids.includes(it.quiz_id) ? "Resubmit" : done ? `Done · best ${b}%` : b != null ? `Best ${b}% · keep going` : i === next ? "Up next" : "Not started"}</small></span>
          <span class="tick ${done ? "done" : ""}">${done ? I.check : ""}</span></button></li>`; }).join("")}</ol></div></article>`; };
  return `<h1>Tasks</h1><p class="muted" style="margin-top:6px">A task is done when you reach its target score on every item.</p>
    ${cls.length || BW.S.profile.managed ? "" : `<div style="margin-top:20px">${BW.joinCard()}</div>`}
    <div class="sec-head"><h2>To do</h2><span class="muted">${todo.length}</span></div>
    ${todo.length ? `<div class="task-list">${todo.map(card).join("")}</div>` : `<div class="empty">${cls.length ? "Nothing to do right now. Try a Daily Challenge." : "Join a class to see tasks here."}</div>`}
    ${done.length ? `<div class="sec-head"><h2>Completed</h2><span class="muted">${done.length}</span></div><div class="panel">${done.map(BW.taskRow).join("")}</div>` : ""}
    ${cls.length ? `<div class="sec-head"><h2>Your classes</h2></div><div class="panel">${cls.map(c => `<div class="row-line"><span class="pbadge" style="background:#2F9BB3">${E(c.name.slice(0, 1).toUpperCase())}</span><b style="flex:1">${E(c.name)}</b>${BW.S.profile.managed ? "" : `<button class="link" data-leave="${c.id}">Leave</button>`}</div>`).join("")}</div>${BW.S.profile.managed ? `<p class="note">${BW.managedBadge()} Your teachers add you to classes.</p>` : `<div style="margin-top:16px">${BW.joinCard()}</div>`}` : ""}`;
};

const SWATCHES = ["#5B4BD5", "#1F7A8C", "#B0306E", "#C2410C", "#167A4B", "#2563EB", "#B3261E", "#6D28D9", "#8A5A00", "#14213D"]; // all give white text ≥ 4.5:1
BW.viewProfile = () => {
  const S = BW.S, p = S.profile, lv = BW.levelOf(p.xp), teacher = BW.isTeacher();
  const earned = Object.keys(BW.BADGES).filter(k => S.badges[k]), locked = Object.keys(BW.BADGES).filter(k => !S.badges[k]);
  const tries = Object.values(S.best).reduce((a, b) => a + b.tries, 0);
  return `<div class="profile-hd">${BW.avatarHTML("avatar xl")}<div><h1>${E(p.display_name)}</h1><p class="muted">${teacher ? `Teacher${S.school ? " · " + E(S.school.name) : ""}` : "Student"} · Level ${lv.L} ${E(BW.titleOf(lv.L))}</p>${p.managed ? BW.managedBadge() : ""}
    <div class="bar" style="margin-top:10px;max-width:320px"><i style="width:${lv.into / lv.need * 100}%"></i></div><p class="note num">${lv.into}/${lv.need} XP to level ${lv.L + 1}</p></div></div>
  <div class="stat-row wide">
    <div class="stat"><b class="num">${p.xp}</b><span>Total XP</span></div><div class="stat"><b class="num">${BW.liveStreak()}</b><span>Day streak</span></div>
    <div class="stat"><b class="num">${p.best_streak}</b><span>Best streak</span></div><div class="stat"><b class="num">${BW.totalMedals()}</b><span>Medals</span></div><div class="stat"><b class="num">${tries}</b><span>Quizzes</span></div></div>
  <div class="sec-head"><h2>Badges</h2><span class="muted">${earned.length} of ${Object.keys(BW.BADGES).length}</span></div>
  <div class="badge-grid">${earned.map(k => BW.badgeHTML(BW.BADGES[k], true)).join("")}${locked.map(k => BW.badgeHTML(BW.BADGES[k], false)).join("")}</div>
  <div class="two-col" style="margin-top:28px">
    <section class="panel"><h3>Mastery by unit</h3>${BW.units.map(u => { const m = Math.round(BW.unitMastery(u) * 100); return `<button class="unit-prog" data-unit="${u.id}" style="width:100%;text-align:left"><span class="sw" style="background-image:${BW.unitCover(u, 120, 120)}"></span><span class="tt"><b>${E(u.title)}</b><div class="bar" style="margin-top:6px"><i style="width:${m}%"></i></div></span><span class="pc">${m}%</span></button>`; }).join("")}</section>
    <div style="display:grid;gap:18px;align-content:start">
      ${p.managed ? `<section class="panel managed-note"><h3>${BW.managedBadge()}</h3><p>Ask your teacher to change your name, classes or password.</p>${p.username ? `<p class="muted">Username: <span class="mono">${E(p.username)}</span></p>` : ""}</section>` : ""}
      ${teacher && S.school ? BW.schoolPanel() : ""}
      <section class="panel"><h3>Your profile</h3><form id="profileForm" class="form"><label for="pfName">Display name</label><input id="pfName" maxlength="40" required value="${E(p.display_name)}" ${p.managed ? 'disabled aria-describedby="nameLock"' : ""}>${p.managed ? `<p class="note" id="nameLock">Only your teacher can change your name.</p>` : ""}
        <label>Avatar colour</label><div class="swatches">${SWATCHES.map(c => `<button type="button" class="swatch ${c === p.avatar_color ? "on" : ""}" data-swatch="${c}" style="background:${c}" aria-label="Colour ${c}"></button>`).join("")}</div>
        <button class="small-btn">Save profile</button></form></section>
      <section class="panel"><h3>Settings</h3><div class="row-line"><span style="flex:1">Sound effects</span><button class="toggle ${BW.sfx.muted ? "" : "on"}" data-act="sound" aria-pressed="${!BW.sfx.muted}"><span></span></button></div>
        <div class="row-line"><span style="flex:1">Dark mode</span><button class="toggle ${document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches) ? "on" : ""}" data-act="theme"><span></span></button></div></section>
      <section class="panel"><h3>Account</h3>
        ${p.managed ? `` : `<form id="pwForm" class="form"><label for="pfPw">New password</label><input id="pfPw" type="password" minlength="8" autocomplete="new-password" placeholder="At least 8 characters"><button class="small-btn">Change password</button></form>`}
        ${!teacher && !p.managed ? `<details class="more"><summary>I'm a teacher</summary><form id="teachForm" class="form"><label for="tcCode">Teacher code</label><input id="tcCode" autocomplete="off" placeholder="From a colleague already on Bitwise"><button class="small-btn">Switch to a teacher account</button></form></details>` : ""}
        <div class="row-btns" style="margin-top:14px"><button class="cta ghost" data-act="signout">Sign out</button>${p.managed ? "" : `<button class="cta danger" data-act="delete">Delete account</button>`}</div></section>
    </div></div>`;
};
BW.bindProfile = root => {
  let colour = BW.S.profile.avatar_color;
  root.querySelectorAll("[data-swatch]").forEach(b => b.onclick = () => { colour = b.dataset.swatch; root.querySelectorAll("[data-swatch]").forEach(x => x.classList.toggle("on", x === b)); });
  root.querySelector("#profileForm").onsubmit = async e => { e.preventDefault();
    const name = root.querySelector("#pfName").value.trim().slice(0, 40); if (!name) return;
    const patch = BW.S.profile.managed ? { avatar_color: colour } : { display_name: name, avatar_color: colour };
    try { await BW.db.updateProfile(patch); } catch (err) { return BW.toast(BW.errMsg(err)); }
    Object.assign(BW.S.profile, patch); BW.toast("Profile saved"); BW.render(); };
  const pf = root.querySelector("#pwForm");
  if (pf) pf.onsubmit = async e => { e.preventDefault(); const pw = root.querySelector("#pfPw").value;
    if (pw.length < 8) return BW.toast("Use at least 8 characters");
    try { await BW.api.changePassword(pw); BW.toast("Password changed"); root.querySelector("#pfPw").value = ""; } catch (err) { BW.toast(BW.errMsg(err)); } };
  const tf = root.querySelector("#teachForm");
  if (tf) tf.onsubmit = async e => { e.preventDefault();
    try { await BW.api.rpc("become_teacher", { p_code: root.querySelector("#tcCode").value }); await BW.loadAll(); BW.toast("You're now a teacher"); BW.go("home"); } catch (err) { BW.toast(BW.errMsg(err)); } };
  root.querySelector("[data-act=sound]").onclick = () => { BW.sfx.toggle(); BW.sfx.play("click"); BW.render(); };
  root.querySelector("[data-act=theme]").onclick = () => { BW.toggleTheme(); BW.render(); };
  root.querySelector("[data-act=signout]").onclick = () => BW.api.signOut();
  BW.bindSchoolPanel?.(root);
  root.querySelector("[data-act=delete]")?.addEventListener("click", () => BW.modal(`<h2>Delete your account?</h2><p class="muted" style="margin:8px 0 14px">This permanently removes your profile, scores and badges${BW.isTeacher() ? ", and every class you teach" : ""}. It can't be undone.</p>
    <form id="delForm" class="form"><label for="delTxt">Type DELETE to confirm</label><input id="delTxt" autocomplete="off"><label for="delPw">Your password</label><input id="delPw" type="password" autocomplete="current-password"><div class="row-btns"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta danger">Delete for ever</button></div></form>`,
    (w, close) => w.querySelector("#delForm").onsubmit = async e => { e.preventDefault(); if (w.querySelector("#delTxt").value.trim() !== "DELETE") return BW.toast("Type DELETE to confirm");
      try { await BW.api.fn("delete_self", { password: w.querySelector("#delPw").value }); close(); BW.toast("Your account has been deleted"); } catch (err) { BW.toast(BW.errMsg(err)); } }));
};
BW.managedBadge = () => `<span class="managed-badge">${BW.icon.school.replace("<svg", '<svg width="15" height="15"')}Managed by your School</span>`;

/* ---- src/teacher-home.js ---- */
/* Teacher: dashboard, class page, tasks (assignments) */
BW.cache = {};
/* Page data: fetched once, shown straight away on later visits and quietly refreshed when it's over a minute old
   (so reports stay current without reloading). A slow request gets one automatic retry on a fresh connection. */
BW.fetchOnce = (key, fn, maxAge = 60000) => {
  const c = BW.cache[key];
  const redraw = () => { if (!["quiz", "code", "results"].includes(BW.route.name)) BW.render(); };
  const run = e => { e.busy = true;
    const attempt = n => BW.withTimeout(fn(), 20000).catch(err => { if (n) throw err; return BW.reconnect().then(() => attempt(1)); });
    attempt(0).then(d => { const changed = !("data" in e) || JSON.stringify(d) !== JSON.stringify(e.data);
        Object.assign(e, { data: d, err: null, at: Date.now(), busy: false }); if (changed && BW.cache[key] === e) redraw(); })
      .catch(err => { e.busy = false; if (e.data == null) { e.data = null; e.err = BW.errMsg(err); if (BW.cache[key] === e) redraw(); } }); };
  if (!c) { run(BW.cache[key] = {}); return undefined; }
  if ("data" in c && c.data !== null && !c.busy && Date.now() - c.at > maxAge) run(c);
  return c.data;
};
BW.dropFailed = () => Object.keys(BW.cache).forEach(k => BW.cache[k].data === null && delete BW.cache[k]);   // try failed ones again on the next visit
BW.cacheErr = key => BW.cache[key]?.err;
BW.invalidate = (...prefixes) => Object.keys(BW.cache).forEach(k => prefixes.some(p => k.startsWith(p)) && delete BW.cache[k]);
BW.loading = `<div class="skel" role="status" aria-label="Loading"><i></i><i></i><i></i><span class="skel-bits">${BW.bitLoader(5, true)}</span></div>`;
BW.classById = id => BW.S.classes.find(c => c.id === id);
BW.classCover = c => BW.cover("class" + c.id, ["#2F9BB3", "#6C5CE7", "#F15BB5", "#FB5607", "#1F9D62", "#3A86FF"][parseInt(c.id.slice(0, 2), 16) % 6], "#F0A35E", ["nodes", "bits", "circuit", "waves"][parseInt(c.id.slice(2, 4), 16) % 4], 640, 360);
BW.csv = (name, rows) => {
  const txt = rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + txt], { type: "text/csv" })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};
BW.copy = async text => { try { await navigator.clipboard.writeText(text); BW.toast("Copied"); } catch (e) { BW.toast("Copy didn't work. Select the text instead."); } };

BW.viewTeach = () => {
  const cls = BW.myClasses(), dash = BW.fetchOnce("tdash", () => BW.db.dashboard());
  const count = (arr, id) => dash ? arr.filter(x => x.class_id === id).length : "…";
  const live = cls.filter(c => !c.archived), archived = cls.filter(c => c.archived);
  const dueSoon = dash ? dash.a.filter(a => a.due_at && new Date(a.due_at) > Date.now() && new Date(a.due_at) - Date.now() < 7 * 864e5).length : "…";
  const card = c => `<article class="class-card" data-class="${c.id}"><div class="cc-cover" style="background-image:${BW.classCover(c)}"><span class="glass">${c.archived ? "Archived" : "Join code " + E(c.join_code)}</span></div>
    <div class="cc-body"><h3>${E(c.name)}</h3><p class="muted num">${count(dash?.m || [], c.id)} students · ${count(dash?.a || [], c.id)} tasks</p></div><button class="go-dark" data-class="${c.id}" aria-label="Open ${E(c.name)}">${I.arrow}</button></article>`;
  return `<header class="hello"><div><h1>Hello, ${E(BW.myName())}</h1><p class="sub">Teacher dashboard</p></div><button class="avatar-btn" data-nav="profile" aria-label="Your profile">${BW.avatarHTML()}</button></header>
  <div class="stat-row wide" style="margin-top:22px"><div class="stat card"><b class="num">${live.length}</b><span>Classes</span></div><div class="stat card"><b class="num">${dash ? new Set(dash.m.filter(x => live.some(c => c.id === x.class_id)).map(x => x.student_id)).size : "…"}</b><span>Students</span></div><div class="stat card"><b class="num">${dash ? dash.a.length : "…"}</b><span>Tasks set</span></div><div class="stat card"><b class="num">${dueSoon}</b><span>Due this week</span></div></div>
  ${live.length ? `<div class="row-btns" style="margin-top:18px"><button class="cta ghost" data-act="compose">${I.mail.replace("<svg", '<svg width="20" height="20"')}Send a notice to students</button><button class="cta ghost" data-nav="directory">${I.school.replace("<svg", '<svg width="20" height="20"')}School directory</button></div>` : ""}
  <section class="panel" style="margin-top:18px"><h3>Create a class</h3><form class="nick" id="newClass"><input id="newClassName" maxlength="60" placeholder="e.g. 10X Computer Science" aria-label="Class name" required><button class="small-btn">Create class</button></form></section>
  ${BW.teachSearchHTML()}
  <div class="sec-head"><h2>Your classes</h2><button class="link" data-nav="topics">Browse the quizzes</button></div>
  ${live.length ? `<div class="class-grid">${live.map(card).join("")}</div>` : `<div class="empty">Create your first class above.</div>`}
  ${archived.length ? `<details class="more" style="margin-top:18px"><summary>Archived classes (${archived.length})</summary><div class="class-grid" style="margin-top:12px">${archived.map(card).join("")}</div></details>` : ""}`;
};
BW.bindTeach = root => {
  BW.bindTeachSearch(root);
  root.querySelector("[data-act=compose]")?.addEventListener("click", () => BW.composeNotice());
  root.querySelector("#newClass").onsubmit = async e => { e.preventDefault(); const name = root.querySelector("#newClassName").value.trim(); if (!name) return;
    try { const c = await BW.api.rpc("create_class", { p_name: name }); BW.S.classes.push(c); BW.invalidate("tdash"); BW.toast(`Created ${c.name}`); BW.go("class", { cid: c.id }); } catch (err) { BW.toast(BW.errMsg(err)); } };
};

/* ---------- class page ---------- */
BW.viewClass = ({ cid }) => {
  const c = BW.classById(cid); if (!c) return `<div class="empty">Class not found.</div>`;
  const tab = BW.ui.classTab || "progress";
  const tabs = [["progress", "Progress"], ["tasks", "Tasks"], ["students", "Students"], ["notices", "Notices"], ["insights", "Insights"], ["board", "Leaderboard"], ["settings", "Settings"]];
  const body = { progress: BW.classProgress, tasks: BW.classTasks, students: BW.classStudents, notices: BW.classNoticesTab, insights: BW.classInsights, board: BW.classBoard, settings: BW.classSettings }[tab](c);
  return `<div class="class-hero" style="background-image:${BW.classCover(c)}"><button class="back" data-back aria-label="Back">${I.back}</button>
    <div class="ch-info"><h1>${E(c.name)}</h1><div class="joincode"><small>Join code</small><b class="mono">${E(c.join_code)}</b><button class="glass" data-copy="${E(c.join_code)}">Copy</button><button class="glass" data-act="newcode">New code</button></div></div></div>
  <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab ${tab === k ? "on" : ""}" data-ctab="${k}" role="tab" aria-selected="${tab === k}">${l}</button>`).join("")}</div>
  <div id="classBody">${body}</div>`;
};

BW.classTasks = c => {
  const list = BW.fetchOnce("assign:" + c.id, () => BW.db.tasks(c.id));
  const sum = BW.fetchOnce("asum:" + c.id, () => BW.api.rpc("class_assignment_summary", { p_class: c.id }));
  const head = `<div class="row-btns" style="margin-bottom:18px"><button class="cta" data-act="openlib">${BW.icon.folder.replace("<svg", '<svg width="20" height="20"')}Set homework from the Task Library</button></div>`;
  if (list === undefined) return head + BW.loading;
  if (!list) return head + `<div class="empty">${E(BW.cacheErr("assign:" + c.id))}</div>`;
  const byId = Object.fromEntries((sum || []).map(s => [s.assignment_id, s]));
  return head + (list.length ? `<div class="panel">${list.map(a => { const s = byId[a.id], due = BW.dueLabel(a.due_at), n = s ? +s.students : 0, done = s ? +s.completed : 0, k = a.quiz_ids.length;
    const names = a.quiz_ids.map(q => BW.itemLabel(q).name), what = k === 1 ? names[0] : `${k} items: ${names.slice(0, 2).join(", ")}${k > 2 ? ` +${k - 2} more` : ""}`;
    return `<button class="assign-row" data-assign="${a.id}"><span class="tt"><b>${E(a.title)}</b><small>${E(what)} · target ${a.target_pct}%</small></span>
      <span class="due-chip ${due.cls}">${due.text}</span><span class="ar-prog"><span class="bar"><i style="width:${n ? done / n * 100 : 0}%"></i></span><small class="num">${sum ? `${done}/${n} finished` : "…"}</small></span>${I.chev.replace("<svg", '<svg width="18" height="18"')}</button>`; }).join("")}</div>`
    : `<div class="empty">No tasks yet. Open the Task Library, tick the quizzes and coding challenges you want, and set them as one piece of homework.</div>`);
};

/* ---- src/teacher-class.js ---- */
/* Teacher class tabs: students, insights, leaderboard, settings */
BW.classInsights = c => {
  const roster = BW.fetchOnce("roster:" + c.id, () => BW.api.rpc("class_roster", { p_class: c.id }));
  const stats = BW.fetchOnce("stats:" + c.id, () => BW.api.rpc("class_topic_stats", { p_class: c.id }));
  if (roster === undefined || stats === undefined) return BW.loading;
  if (!roster || !stats) return `<div class="empty">${E(BW.cacheErr("roster:" + c.id) || BW.cacheErr("stats:" + c.id))}</div>`;
  if (!roster.length) return `<div class="empty">Insights appear once students join and start quizzes.</div>`;
  const medals = {}; stats.forEach(r => { const u = r.topic.split(".")[0]; medals[r.student_id + u] = (medals[r.student_id + u] || 0) + +r.medals; });
  const heat = `<div class="table-wrap"><table class="dtable heat"><thead><tr><th>Student</th>${BW.units.map((u, i) => `<th class="c" title="${E(u.title)}">U${i + 1}</th>`).join("")}</tr></thead><tbody>
    ${roster.map(r => `<tr><td><span class="who">${BW.avatarHTML("av-sm", r)}${E(r.display_name)}</span></td>${BW.units.map(u => { const v = (medals[r.student_id + u.id] || 0) / (u.subs.length * 4); return `<td class="c"><span class="hm ${v > .5 ? "hot" : ""}" style="--v:${v.toFixed(2)}" title="${E(u.title)}: ${Math.round(v * 100)}%">${v ? Math.round(v * 100) : ""}</span></td>`; }).join("")}</tr>`).join("")}
    </tbody></table></div><p class="note">Unit mastery = medals earned out of the 4 per topic. ${BW.units.map((u, i) => `U${i + 1} ${E(u.title)}`).join(" · ")}</p>`;
  const agg = {}; stats.forEach(r => { const a = agg[r.topic] = agg[r.topic] || { sum: 0, n: 0 }; a.sum += +r.best; a.n++; });
  const topics = BW.allSubs().map(({ u, s }) => ({ u, s, key: u.id + "." + s.id, a: agg[u.id + "." + s.id] }));
  const weak = topics.filter(t => t.a).sort((x, y) => x.a.sum / x.a.n - y.a.sum / y.a.n).slice(0, 8);
  const untouched = topics.filter(t => !t.a);
  const row = (t, right) => `<div class="row-line"><span class="sw sm" style="background-image:${BW.subCover(t.u, t.s, 80, 80)}"></span><span class="tt"><b>${E(t.s.title)}</b><small class="muted">${E(t.u.title)}</small></span>${right}<button class="link" data-settask="${t.key}">Set as task</button></div>`;
  return `<div class="two-col"><section class="panel"><h3>Weakest topics</h3>${weak.length ? weak.map(t => row(t, `<span class="num pc-chip" style="--v:${(t.a.sum / t.a.n).toFixed(2)}">${Math.round(t.a.sum / t.a.n * 100)}%</span><small class="muted num">${t.a.n}/${roster.length} tried</small>`)).join("") : `<p class="muted">No quiz results yet.</p>`}</section>
    <section class="panel"><h3>Not tried yet</h3><p class="muted" style="margin-bottom:8px">${untouched.length} of ${topics.length} topics have no attempts from this class.</p>${untouched.slice(0, 8).map(t => row(t, "")).join("")}</section></div>
    <div class="sec-head"><h2>Mastery heatmap</h2></div>${heat}`;
};

BW.classBoard = c => { const rows = BW.fetchOnce("board:" + c.id, () => BW.api.rpc("class_leaderboard", { p_class: c.id }));
  return rows === undefined ? BW.loading : BW.boardHTML(rows || [], c, true); };

BW.classSettings = c => `<div class="two-col"><section class="panel"><h3>Class details</h3><form id="renameForm" class="form"><label for="csName">Class name</label><input id="csName" maxlength="60" value="${E(c.name)}" required><button class="small-btn">Save name</button></form>
    <div class="row-line" style="margin-top:14px"><span style="flex:1">Show the leaderboard to students</span><button class="toggle ${c.show_leaderboard ? "on" : ""}" data-act="toggleboard" aria-pressed="${c.show_leaderboard}"><span></span></button></div>
    <div class="row-line"><span style="flex:1">Archive this class<br><small class="muted">Hides it and its tasks from students. Nothing is deleted.</small></span><button class="toggle ${c.archived ? "on" : ""}" data-act="togglearchive" aria-pressed="${c.archived}"><span></span></button></div></section>
  <section class="panel"><h3>Delete class</h3><p class="muted" style="margin-bottom:12px">Removes the class, its tasks and notices. Student accounts, school logins and their scores stay.</p><button class="cta danger" data-act="delclass">Delete ${E(c.name)}</button></section></div>`;

BW.bindClass = (root, { cid }) => {
  const c = BW.classById(cid); if (!c) return;
  const on = (sel, fn) => root.querySelectorAll(sel).forEach(el => el.addEventListener("click", e => fn(el, e)));
  const upd = async patch => { try { await BW.db.updateClass(cid, patch); } catch (e) { return BW.toast(BW.errMsg(e)); } Object.assign(c, patch); BW.invalidate("tdash", "board:" + cid); BW.toast("Saved"); BW.render(); };
  on("[data-ctab]", el => { BW.ui.classTab = el.dataset.ctab; BW.render(); });
  on("[data-copy]", el => BW.copy(el.dataset.copy));
  on("[data-act=newcode]", () => BW.modal(`<h2>Make a new join code?</h2><p class="muted" style="margin:8px 0 18px">The old code stops working. Students already in the class stay.</p><div class="row-btns"><button class="cta ghost" data-close>Cancel</button><button class="cta" id="yesCode">New code</button></div>`,
    (w, close) => w.querySelector("#yesCode").onclick = async () => { try { c.join_code = await BW.api.rpc("regenerate_code", { p_class: cid }); close(); BW.render(); } catch (e) { BW.toast(BW.errMsg(e)); } }));
  on("[data-act=openlib]", () => { BW.lib.cid = cid; BW.go("library"); });
  on("[data-assign]", el => BW.go("assignment", { aid: el.dataset.assign, cid }));
  on("[data-cell]", el => { const [tid, sid] = el.dataset.cell.split("|"); BW.openCell(c, tid, sid); });
  on("[data-settask]", el => BW.newTaskDialog({ items: [el.dataset.settask + ".1"], cid }));
  on("[data-board]", el => { BW.boardTab = el.dataset.board; BW.render(); });
  /* students */
  on("[data-act=addstudents]", () => BW.newLoginsDialog(cid));
  on("[data-act=fromdir]", () => BW.addFromDirectory(c));
  on("[data-act=rostercsv]", () => { const r = BW.cache["roster:" + cid]?.data || [];
    BW.csv(`${c.name.replace(/[^\w-]+/g, "_")}_students.csv`, [["Name", "Username", "XP this week", "Total XP", "Streak", "Last active", "Quizzes"], ...r.map(x => [x.display_name, x.username || "", x.week_xp, x.xp, x.streak, x.last_active || "", x.quizzes])]); });
  const refresh = () => { BW.invalidate("roster:" + cid, "stats:" + cid, "sstats:" + cid, "board:" + cid, "asum:" + cid, "tdash", "dir"); BW.render(); };
  const rosterRow = sid => (BW.cache["roster:" + cid]?.data || []).find(r => r.student_id === sid) || {};
  on("[data-reset]", el => { const r = rosterRow(el.dataset.reset); BW.resetInfo({ display_name: r.display_name, username: r.username }); });
  on("[data-remove]", el => { const r = rosterRow(el.dataset.remove);
    BW.modal(`<h2>Remove from ${E(c.name)}?</h2><p class="muted" style="margin:8px 0 18px">${r.managed ? "They stay in your school directory with their scores, and you can add them back any time." : "They keep their account and scores, and can rejoin with the code."}</p><div class="row-btns"><button class="cta ghost" data-close>Cancel</button><button class="cta danger" id="yesRm">Remove</button></div>`,
      (w, close) => w.querySelector("#yesRm").onclick = async () => {
        try { if (r.managed) { const p = await BW.db.profileOf(el.dataset.remove); await BW.db.setClasses(el.dataset.remove, p.class_ids.filter(x => x !== cid && BW.classById(x))); } else await BW.db.removeMember(cid, el.dataset.remove); }
        catch (e) { close(); return BW.toast(BW.errMsg(e)); }
        close(); BW.toast("Removed"); refresh(); }); });
  on("[data-delstudent]", el => { const r = rosterRow(el.dataset.delstudent); BW.removeFromSchoolDialog({ id: el.dataset.delstudent, display_name: r.display_name || "this student" }, refresh); });
  /* notices */
  on("[data-act=compose]", () => BW.composeNotice(cid));
  on("[data-pinnotice]", async el => { const [nid, v] = el.dataset.pinnotice.split("|"); try { await BW.db.pinNotice(cid, nid, v === "1"); BW.invalidate("notices:" + cid); BW.render(); } catch (e) { BW.toast(BW.errMsg(e)); } });
  on("[data-delnotice]", el => BW.modal(`<h2>Delete this notice?</h2><p class="muted" style="margin:8px 0 18px">It disappears from students' Messages in ${E(c.name)}.</p><div class="row-btns"><button class="cta ghost" data-close>Cancel</button><button class="cta danger" id="yesDn">Delete</button></div>`,
    (w, close) => w.querySelector("#yesDn").onclick = async () => { try { await BW.db.deleteNotice(cid, el.dataset.delnotice); } catch (e) { close(); return BW.toast(BW.errMsg(e)); } close(); BW.invalidate("notices:" + cid); BW.render(); }));
  /* settings */
  const rf = root.querySelector("#renameForm"); if (rf) rf.onsubmit = e => { e.preventDefault(); const n = root.querySelector("#csName").value.trim(); if (n) upd({ name: n.slice(0, 60) }); };
  on("[data-act=toggleboard]", () => upd({ show_leaderboard: !c.show_leaderboard }));
  on("[data-act=togglearchive]", () => upd({ archived: !c.archived }));
  on("[data-act=delclass]", () => BW.modal(`<h2>Delete ${E(c.name)}?</h2><p class="muted" style="margin:8px 0 12px">This removes the class and all its tasks. It can't be undone.</p><form id="dcForm" class="form"><label for="dcName">Type the class name to confirm</label><input id="dcName" autocomplete="off"><div class="row-btns"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta danger">Delete class</button></div></form>`,
    (w, close) => w.querySelector("#dcForm").onsubmit = async e => { e.preventDefault(); if (w.querySelector("#dcName").value.trim() !== c.name) return BW.toast("The name doesn't match");
      try { await BW.db.deleteClass(cid); } catch (x) { close(); return BW.toast(BW.errMsg(x)); } close();
      BW.S.classes = BW.S.classes.filter(x => x.id !== cid); BW.invalidate("tdash"); BW.toast("Class deleted"); BW.go("home"); }));
};


/* ---- src/teacher-analytics.js ---- */
/* Teacher analytics: per-question answers and timings, student pages, task question breakdowns, topic search */
BW.GEN_LABELS = { binToDen: "Binary → denary", denToBin: "Denary → binary", hexToDen: "Hex → denary", denToHex: "Denary → hex", binToHex: "Binary → hex", hexToBin: "Hex → binary",
  binAdd: "Binary addition", shift: "Binary shifts", units: "Units of data", colours: "Colour depth", imageSize: "Image file size", soundSize: "Sound file size", ascii: "ASCII codes",
  charBits: "Bits per character", textSize: "Text file size", logicEval: "Evaluate a logic expression", truthTable: "Truth table (typed)", linearSearch: "Linear search comparisons",
  binarySearch: "Binary search steps", bubblePass: "Bubble sort pass (typed)", insertionPass: "Insertion sort pass (typed)", arith: "MOD, DIV and powers", traceLoop: "Trace a loop",
  strings: "String manipulation", arrays: "Arrays and indexes", dataType: "Data types", sqlRows: "SQL query results", ipv4: "Valid IPv4 address?", testData: "Test data types",
  bitsDen: "Bit toggles: make a number", bitsHex: "Bit toggles: hex", bitsAdd: "Bit toggles: addition", bitsShift: "Bit toggles: shifts", bitsAscii: "Bit toggles: ASCII",
  gateSet: "Logic circuit switches", ttGrid: "Truth table grid", orderBubble: "Order: bubble sort pass", orderInsertion: "Order: insertion sort passes" };
BW.TYPE_LABELS = { mc: "Multiple choice", input: "Typed answer", bits: "Bit toggles", order: "Drag to order", match: "Match pairs", sort: "Sort into groups", gate: "Logic circuit", tt: "Truth table", code: "Code" };
BW.qLabel = (key, sample) => {
  const [k, ...rest] = (key || "").split(":"), v = rest.join(":");
  if (k === "g") return `${BW.GEN_LABELS[v] || v} (a new question each time)`;
  if (k === "c") return `Coding: ${BW.findChallenge(v)?.title || v}`;
  return (v || sample || "").replace(/`/g, "");
};
BW.fmtMs = ms => { ms = +ms || 0; if (ms < 60000) return (ms / 1000).toFixed(ms < 10000 ? 1 : 0) + " s"; const m = Math.floor(ms / 60000), s = Math.round(ms % 60000 / 1000); return ms >= 3600000 ? `${Math.floor(m / 60)} h ${m % 60} m` : `${m} m ${String(s).padStart(2, "0")} s`; };
BW.pct = x => x == null ? "–" : Math.round(+x * 100) + "%";
BW.when = t => t ? new Date(t).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "–";

/* ---------- search across topics + coding challenges ---------- */
BW.findTopics = (term, kinds = ["topic", "code"]) => {
  const t = term.toLowerCase().trim(); if (!t) return [];
  const words = t.split(/\s+/), hit = s => words.every(w => s.toLowerCase().includes(w)), out = [];
  if (kinds.includes("topic")) BW.allSubs().forEach(({ u, s }) => { const hay = `${s.title} ${u.title} ${(s.notes || []).join(" ")}`; if (hit(hay)) out.push({ kind: "topic", key: `${u.id}.${s.id}`, title: s.title, sub: u.title, score: hit(s.title) ? 0 : 1, u, s }); });
  if (kinds.includes("code")) BW.CODE.all.forEach(c => { if (hit(`${c.title} ${c.section.title} ${c.brief} coding python`)) out.push({ kind: "code", key: c.id, title: c.title, sub: `Coding Lab · ${c.section.title} · ${BW.LEVEL_NAMES[c.level]}`, score: hit(c.title) ? 0 : 1, c }); });
  return out.sort((a, b) => a.score - b.score).slice(0, 10);
};
BW.hitSwatch = h => h.kind === "code" ? BW.codeCover(h.key, 120, 120) : BW.subCover(h.u, h.s, 120, 120);
BW.teachSearchHTML = () => `<section class="panel" style="margin-top:18px"><h3>Find a topic or coding challenge</h3>
  <form class="search inset" id="tSearchForm" role="search">${I.search}<input id="tSearch" placeholder="e.g. hexadecimal, SQL, bubble sort, fizzbuzz" value="${E(BW.ui.tSearch || "")}" aria-label="Search topics and coding challenges" autocomplete="off"></form>
  <div id="tHits">${BW.teachHitsHTML()}</div></section>`;
BW.teachHitsHTML = () => { const hits = BW.findTopics(BW.ui.tSearch || ""); if (!(BW.ui.tSearch || "").trim()) return "";
  return hits.length ? hits.map(h => `<div class="row-line"><span class="sw sm" style="background-image:${BW.hitSwatch(h)}"></span><span class="tt"><b>${E(h.title)}</b><small class="muted">${E(h.sub)}</small></span>
    <button class="link" ${h.kind === "code" ? `data-code="${h.key}"` : `data-sub="${h.key.replace(".", "/")}"`}>Preview</button><button class="link" data-libreveal="${h.kind === "code" ? "code." + h.key : h.key + ".1"}">Show in library</button><button class="small-btn" data-assignhit="${h.kind}:${h.key}">Set as task</button></div>`).join("") : `<p class="note">Nothing matches “${E(BW.ui.tSearch)}”.</p>`; };
BW.assignHit = (kind, key) => BW.newTaskDialog({ items: [kind === "code" ? `code.${key}` : `${key}.1`], cid: BW.route.params?.cid });
BW.bindTeachSearch = root => {
  const inp = root.querySelector("#tSearch"); if (!inp) return;
  inp.oninput = () => { BW.ui.tSearch = inp.value; root.querySelector("#tHits").innerHTML = BW.teachHitsHTML(); };
  root.querySelector("#tSearchForm").onsubmit = e => e.preventDefault();
};

/* ---------- answers table (shared by task reports and student pages) ---------- */
BW.answersHTML = rows => {
  if (rows === undefined) return BW.loading;
  if (!rows) return `<p class="note err">Couldn't load these answers. Try again in a moment.</p>`;
  if (!rows.length) return `<p class="note">No answers recorded for this attempt.</p>`;
  const code = rows.find(r => r.q_type === "code");
  if (code) { const d = code.detail || {};
    return `<div class="code-sub"><div class="code-meta"><span class="chip-s ${code.is_correct ? "good" : "bad"}">${code.is_correct ? "Passed every test" : "Some tests failed"}</span><span>Submission ${code.try_no}</span><span>Time coding: <b>${BW.fmtMs(code.ms)}</b></span>${d.runs != null ? `<span>Runs before submitting: <b>${d.runs}</b></span>` : ""}</div>
      <pre class="codeview">${E(code.answer)}</pre>
      ${d.tests ? `<div class="test-chips">${d.tests.map(t => `<span class="chip-s ${t.pass ? "good" : "bad"}" title="${E(t.reason || "")}">${t.hidden ? "Hidden " : ""}test ${t.n} ${t.pass ? "✓" : "✗"}</span>`).join("")}${(d.req || []).map(q => `<span class="chip-s ${q.ok ? "good" : "bad"}">${E(q.label)} ${q.ok ? "✓" : "✗"}</span>`).join("")}</div>` : ""}</div>`; }
  const max = Math.max(...rows.map(r => r.ms), 1);
  return `<div class="table-wrap"><table class="dtable answers"><thead><tr><th>Q</th><th>Question</th><th>Answer given</th><th>Correct answer</th><th>Result</th><th class="r">Time</th></tr></thead><tbody>
    ${rows.map(r => `<tr class="${r.is_correct ? "" : "wrong-row"}"><td><span class="code-chip">${E(r.q_code || r.seq)}</span></td>
      <td class="qcell"><div class="clamp" title="${E(r.q_text)}">${E(r.q_text)}</div><small class="muted">${E(BW.TYPE_LABELS[r.q_type] || r.q_type)} · ${E(r.topic)}</small></td>
      <td class="mono ans">${E(r.answer || "–")}</td><td class="mono ans muted-t">${E(r.correct_answer)}</td>
      <td><span class="chip-s ${r.is_correct ? "good" : "bad"}">${r.is_correct ? "Correct" : "Wrong"}</span>${r.try_no > 1 ? `<small class="muted"> try ${r.try_no}</small>` : ""}</td>
      <td class="r num"><span class="tbar"><i style="width:${Math.max(4, r.ms / max * 100)}%"></i></span>${BW.fmtMs(r.ms)}</td></tr>`).join("")}
    </tbody></table></div>`;
};
BW.answersOf = (cid, t) => t.answers || BW.fetchOnce(`ans:${cid}:${t.id}`, () => BW.db.answers(cid, t.id));
BW.attemptList = (atts, openId, cid) => atts.map(t => { const lab = BW.quizLabel(t.quiz_id), open = openId === t.id;
  return `<div class="att ${open ? "open" : ""}"><button class="att-head" data-att="${t.id}" aria-expanded="${open}"><span class="tt"><b>${E(lab.title)}</b><small class="muted">${E(lab.sub || "")} · ${BW.when(t.finished_at)}</small></span>
    <span class="num att-score ${+t.pct >= BW.PASS ? "good-t" : ""}">${BW.pct(t.pct)}</span><span class="num muted">${t.correct}/${t.total}</span><span class="num muted">${t.active_ms != null ? BW.fmtMs(t.active_ms) : "–"}</span>${I.down}</button>
    ${open ? `<div class="att-body">${BW.answersHTML(BW.answersOf(cid, t))}</div>` : ""}</div>`; }).join("");

/* ---------- one task's report ---------- */
BW.itemChip = (it, target) => { const l = BW.itemLabel(it.quiz_id), done = !!it.completed_at, st = done ? "good" : +it.tries ? "" : "muted";
  return `<span class="item-chip ${st}" title="${E(l.name)}"><span class="ex-ico xs">${l.icon}</span>${E(l.name)}<b class="num">${it.best != null ? BW.pct(it.best) : "–"}</b></span>`; };
BW.viewAssignment = ({ aid, cid }) => {
  const list = BW.fetchOnce("assign:" + cid, () => BW.db.tasks(cid));
  const rep = BW.fetchOnce("rep:" + aid, () => BW.api.rpc("assignment_report", { p_class: cid, p_assignment: aid }));
  const qs = BW.fetchOnce("qstats:" + aid, () => BW.api.rpc("assignment_question_stats", { p_class: cid, p_assignment: aid }));
  const a = list?.find(x => x.id === aid), c = BW.classById(cid);
  if (list === undefined || rep === undefined) return BW.loading;
  if (!a) return `<div class="empty">That task was deleted.</div>`;
  const due = BW.dueLabel(a.due_at), rows = rep || [], overdue = a.due_at && new Date(a.due_at) < Date.now(), nItems = a.quiz_ids.length;
  const status = r => r.completed_at ? (a.due_at && new Date(r.completed_at) > new Date(a.due_at) ? ["Done late", "warn"] : ["Done", "good"]) : r.tries > 0 ? (overdue ? ["Overdue", "bad"] : ["In progress", ""]) : (overdue ? ["Overdue", "bad"] : ["Not started", "muted"]);
  const done = rows.filter(r => r.completed_at).length, started = rows.filter(r => r.tries > 0), avg = started.length ? Math.round(started.reduce((s, r) => s + +r.best, 0) / started.length * 100) : 0;
  const itemsDoneAvg = rows.length ? rows.reduce((s, r) => s + r.items_done, 0) / rows.length : 0;
  const openS = BW.ui.openStudent;
  const studentAtts = sid => (rows.find(r => r.student_id === sid)?.items || []).flatMap(i => i.results || []).sort((x, y) => (y.finished_at || "").localeCompare(x.finished_at || "")).slice(0, 40);
  const qsHTML = qs === undefined ? BW.loading : !qs?.length ? `<p class="note">The breakdown appears once students have answered.</p>` :
    `<div class="table-wrap"><table class="dtable"><thead><tr><th>Question</th><th>Type</th><th class="r">Students</th><th>Right first time</th><th class="r">Avg time</th><th class="r">Avg tries</th><th>Most common wrong answer</th></tr></thead><tbody>
    ${qs.map(q => `<tr><td class="qcell"><div class="clamp" title="${E(q.sample)}">${E(BW.qLabel(q.q_key, q.sample))}</div><small class="muted">${E(q.topic)}</small></td><td>${E(BW.TYPE_LABELS[q.q_type] || q.q_type)}</td><td class="r num">${q.students}</td>
      <td><span class="meter"><i style="width:${+q.first_try_pct * 100}%;background:${+q.first_try_pct < .5 ? "var(--bad)" : +q.first_try_pct < .8 ? "var(--warn)" : "var(--good)"}"></i></span><span class="num">${BW.pct(q.first_try_pct)}</span></td>
      <td class="r num">${BW.fmtMs(q.avg_ms)}</td><td class="r num">${(+q.avg_tries).toFixed(1)}</td><td class="mono ans">${E(q.common_wrong || "–")}</td></tr>`).join("")}</tbody></table></div>`;
  return `<div class="sub-hdr"><button class="hdr-btn" data-back aria-label="Back">${I.back}</button><div><h1>${E(a.title)}</h1><p class="muted">${E(c?.name || "")} · ${nItems} item${nItems > 1 ? "s" : ""} · target ${a.target_pct}% on each</p></div><span></span></div>
  <div class="stat-row wide" style="margin:22px 0"><div class="stat card"><b class="num">${done}/${rows.length}</b><span>Finished everything</span></div><div class="stat card"><b class="num">${itemsDoneAvg.toFixed(1)}/${nItems}</b><span>Avg items done</span></div><div class="stat card"><b class="num">${avg}%</b><span>Average best</span></div><div class="stat card"><b>${due.text}</b><span>${a.due_at ? BW.when(a.due_at) : "No due date"}</span></div></div>
  ${a.instructions ? `<p class="panel">${E(a.instructions)}</p>` : ""}
  <div class="sec-head"><h2>Items</h2><button class="link" data-libreveal="${E(a.quiz_ids[0])}">Open in library</button></div>
  <ol class="task-items-t panel">${a.quiz_ids.map((q, i) => { const l = BW.itemLabel(q), n = rows.filter(r => r.items[i]?.completed_at).length;
    return `<li><span class="ex-ico">${l.icon}</span><span class="tt"><b>${E(l.name)}</b><small class="muted">${E(l.sub)}</small></span><span class="meter"><i style="width:${rows.length ? n / rows.length * 100 : 0}%;background:var(--good)"></i></span><span class="num muted">${n}/${rows.length} done</span></li>`; }).join("")}</ol>
  <div class="sec-head"><h2>Students</h2><span class="muted">Select a student to see every answer</span></div>
  <div class="panel att-list">${rows.map(r => { const [st, cls] = status(r), open = openS === r.student_id;
    return `<div class="att ${open ? "open" : ""}"><button class="att-head s" data-openstudent="${r.student_id}" aria-expanded="${open}"><span class="who">${BW.avatarHTML("av-sm", r)}${E(r.display_name)}</span><span class="chip-s ${cls}">${st}</span>
      <span class="num">${r.items_done}/${nItems} items</span><span class="num muted">${r.best != null ? BW.pct(r.best) + " avg" : "–"}</span><span class="muted">${r.last_at ? BW.when(r.last_at) : "–"}</span>${I.down}</button>
      ${open ? `<div class="att-body"><div class="item-chips">${r.items.map(it => BW.itemChip(it, a.target_pct)).join("")}</div>${(() => { const atts = studentAtts(r.student_id); return atts === undefined ? BW.loading : !atts?.length ? `<p class="note">No attempts yet.</p>` : `<div class="att-list inner">${BW.attemptList(atts, BW.ui.openAttempt, cid)}</div>`; })()}<button class="link" data-student="${r.student_id}">Open ${E(r.display_name.split(" ")[0])}'s full profile</button></div>` : ""}</div>`; }).join("") || `<p class="muted">No students in this class yet.</p>`}</div>
  <div class="sec-head"><h2>Question breakdown</h2><span class="muted">Across every item, hardest first</span></div>${qsHTML}
  <div class="row-btns" style="margin-top:18px"><button class="cta ghost" data-act="csv">Export summary CSV</button><button class="cta ghost" data-act="anscsv">Export every answer (CSV)</button><button class="cta danger" data-act="deltask">Delete task</button></div>`;
};
BW.bindAssignment = (root, { aid, cid }) => {
  const on = (sel, fn) => root.querySelectorAll(sel).forEach(el => el.addEventListener("click", e => { e.stopPropagation(); fn(el); }));
  on("[data-openstudent]", el => { BW.ui.openStudent = BW.ui.openStudent === el.dataset.openstudent ? null : el.dataset.openstudent; BW.ui.openAttempt = null; BW.render(); });
  on("[data-att]", el => { BW.ui.openAttempt = BW.ui.openAttempt === el.dataset.att ? null : el.dataset.att; BW.render(); });
  on("[data-student]", el => BW.go("student", { sid: el.dataset.student, cid }));
  const a = () => BW.cache["assign:" + cid].data.find(x => x.id === aid), safe = s => s.replace(/[^\w-]+/g, "_");
  root.querySelector("[data-act=csv]")?.addEventListener("click", () => { const task = a(), rows = BW.cache["rep:" + aid].data, names = task.quiz_ids.map(q => BW.itemLabel(q).name);
    BW.csv(`${safe(task.title)}.csv`, [["Student", "Items done", ...names.map(n => `${n} best %`), "Finished at", "Last attempt"],
      ...rows.map(r => [r.display_name, `${r.items_done}/${task.quiz_ids.length}`, ...r.items.map(it => it.best != null ? Math.round(it.best * 100) : ""), r.completed_at || "", r.last_at || ""])]); });
  root.querySelector("[data-act=anscsv]")?.addEventListener("click", async () => {
    const task = a(), people = Object.fromEntries((BW.cache["rep:" + aid].data || []).map(r => [r.student_id, r.display_name]));
    try {
      const [ans, res] = await Promise.all([BW.db.answersFor(cid, task.quiz_ids), BW.db.results(cid, task.quiz_ids)]), pct = Object.fromEntries(res.map(r => [r.id, r.pct]));
      const atts = ans.filter(t => people[t.uid] && t.finished_at >= (task.created_at || "")).sort((x, y) => (x.finished_at || "").localeCompare(y.finished_at || ""));
      BW.csv(`${safe(task.title)}_answers.csv`, [["Student", "Item", "Attempt finished", "Attempt score %", "Question code", "Type", "Topic", "Question", "Answer given", "Correct answer", "Correct", "Try", "Seconds"],
        ...atts.flatMap(t => t.answers.map(r => [people[t.uid], BW.itemLabel(t.quiz_id).name, t.finished_at, pct[t.id] != null ? Math.round(pct[t.id] * 100) : "", r.q_code, BW.TYPE_LABELS[r.q_type] || r.q_type, r.topic, r.q_text, r.answer, r.correct_answer, r.is_correct ? "Yes" : "No", r.try_no, (r.ms / 1000).toFixed(1)]))]);
    } catch (e) { BW.toast(BW.errMsg(e)); }
  });
  root.querySelector("[data-act=deltask]")?.addEventListener("click", () => BW.modal(`<h2>Delete this task?</h2><p class="muted" style="margin:8px 0 18px">Students' scores and answers stay; the task disappears from their list.</p><div class="row-btns"><button class="cta ghost" data-close>Cancel</button><button class="cta danger" id="yesDel">Delete</button></div>`,
    (w, close) => w.querySelector("#yesDel").onclick = async () => { try { await BW.db.deleteTask(cid, aid); } catch (e) { close(); return BW.toast(BW.errMsg(e)); } close(); BW.invalidate("assign:" + cid, "asum:" + cid, "rep:" + aid, "qstats:" + aid, "tdash"); BW.toast("Task deleted"); BW.back(); }));
};

/* ---------- students tab with effort + accuracy ---------- */
BW.classStudents = c => {
  const roster = BW.fetchOnce("roster:" + c.id, () => BW.api.rpc("class_roster", { p_class: c.id }));
  const stats = BW.fetchOnce("sstats:" + c.id, () => BW.api.rpc("class_student_stats", { p_class: c.id }));
  const head = `<div class="row-btns" style="margin-bottom:12px"><button class="cta" data-act="fromdir">${BW.icon.school.replace("<svg", '<svg width="20" height="20"')}Add from school directory</button><button class="cta ghost" data-act="addstudents">Create student logins</button><button class="cta ghost" data-act="rostercsv" ${roster?.length ? "" : "disabled"}>Export CSV</button></div>
    <p class="note" style="margin-bottom:16px">Join code <b class="mono">${E(c.join_code)}</b>. Select a name to see their answers.</p>`;
  if (roster === undefined) return head + BW.loading;
  if (!roster) return head + `<div class="empty">${E(BW.cacheErr("roster:" + c.id))}</div>`;
  const S = Object.fromEntries((stats || []).map(s => [s.student_id, s]));
  const ago = t => { if (!t) return "Never"; const d = (Date.now() - new Date(t)) / 864e5; return d < 1 ? "Today" : d < 2 ? "Yesterday" : `${Math.floor(d)} days ago`; };
  return head + (roster.length ? `<div class="table-wrap"><table class="dtable"><thead><tr><th>Student</th><th>Username</th><th>Right first time</th><th class="r">Avg per question</th><th class="r">Time this week</th><th class="r">Retries</th><th class="r">XP this week</th><th>Last active</th><th></th></tr></thead><tbody>
    ${roster.map(r => { const s = S[r.student_id] || {}, acc = +s.first_try ? +s.first_try_ok / +s.first_try : null;
      return `<tr><td><button class="who link-plain" data-student="${r.student_id}">${BW.avatarHTML("av-sm", r)}${E(r.display_name)}</button></td><td>${r.username ? `<span class="mono">${E(r.username)}</span><br>${BW.managedBadge()}` : `<span class="muted">own email</span>`}</td>
      <td>${acc == null ? `<span class="muted">–</span>` : `<span class="meter"><i style="width:${acc * 100}%;background:${acc < .5 ? "var(--bad)" : acc < .8 ? "var(--warn)" : "var(--good)"}"></i></span><span class="num">${BW.pct(acc)}</span>`}</td>
      <td class="r num">${s.avg_ms != null ? BW.fmtMs(s.avg_ms) : "–"}</td><td class="r num">${BW.fmtMs(s.week_ms || 0)}</td><td class="r num">${s.retries ?? 0}</td><td class="r num">${r.week_xp}</td>
      <td class="${r.last_active && Date.now() - new Date(r.last_active) > 14 * 864e5 ? "warn-t" : "muted"}">${ago(r.last_active)}</td>
      <td class="r"><div class="act-btns">${r.managed ? `<button class="link" data-reset="${r.student_id}">Password</button>` : ""}<button class="link" data-remove="${r.student_id}">Remove from class</button>${r.managed ? `<button class="link danger-t" data-delstudent="${r.student_id}">Remove from school</button>` : ""}</div></td></tr>`; }).join("")}
    </tbody></table></div>` : `<div class="empty">No students yet. Share the join code or create logins.</div>`);
};

/* ---------- a single student's analytics ---------- */
BW.viewStudent = ({ sid, cid }) => {
  const roster = BW.fetchOnce("roster:" + cid, () => BW.api.rpc("class_roster", { p_class: cid }));
  const stats = BW.fetchOnce("sstats:" + cid, () => BW.api.rpc("class_student_stats", { p_class: cid }));
  const topics = BW.fetchOnce("stats:" + cid, () => BW.api.rpc("class_topic_stats", { p_class: cid }));
  const atts = BW.fetchOnce(`atts:${cid}:${sid}`, () => BW.db.studentResults(cid, sid));
  if (roster === undefined) return BW.loading;
  const r = (roster || []).find(x => x.student_id === sid); if (!r) return `<div class="empty">That student isn't in this class.</div>`;
  const s = (stats || []).find(x => x.student_id === sid) || {}, acc = +s.first_try ? +s.first_try_ok / +s.first_try : null;
  const mine = (topics || []).filter(t => t.student_id === sid).sort((a, b) => a.best - b.best);
  const filter = BW.ui.attFilter || "all";
  const shown = (atts || []).filter(t => filter === "all" || (filter === "code" ? t.quiz_id.startsWith("code.") : !t.quiz_id.startsWith("code.")));
  return `<div class="sub-hdr"><button class="hdr-btn" data-back aria-label="Back">${I.back}</button><div><h1>${E(r.display_name)}</h1><p class="muted">${E(BW.classById(cid)?.name || "")}${r.username ? ` · username <span class="mono">${E(r.username)}</span> ${BW.managedBadge()}` : ""} · last active ${r.last_active ? BW.when(r.last_active) : "never"}</p></div>${BW.avatarHTML("avatar", r)}</div>
  <div class="stat-row wide" style="margin:22px 0">
    <div class="stat card"><b class="num">${BW.pct(acc)}</b><span>Right first time</span></div><div class="stat card"><b class="num">${s.avg_ms != null ? BW.fmtMs(s.avg_ms) : "–"}</b><span>Avg per question</span></div>
    <div class="stat card"><b class="num">${BW.fmtMs(s.week_ms || 0)}</b><span>Time this week</span></div><div class="stat card"><b class="num">${BW.fmtMs(s.total_ms || 0)}</b><span>Total time</span></div>
    <div class="stat card"><b class="num">${s.answered || 0}</b><span>Answers</span></div><div class="stat card"><b class="num">${s.retries || 0}</b><span>Retries</span></div>
    <div class="stat card"><b class="num">${r.xp}</b><span>Total XP</span></div><div class="stat card"><b class="num">${r.streak}</b><span>Day streak</span></div></div>
  <div class="two-col"><section class="panel"><h3>Weakest topics</h3>${topics === undefined ? BW.loading : mine.length ? mine.slice(0, 6).map(t => { const [u, sb] = t.topic.split("."), fs = BW.findSub(u, sb);
      return `<div class="row-line"><span class="tt"><b>${E(fs?.s?.title || t.topic)}</b><small class="muted">${E(fs?.u?.title || "")} · ${t.tries} attempt${+t.tries === 1 ? "" : "s"}</small></span><span class="num pc-chip" style="--v:${(+t.best).toFixed(2)}">${BW.pct(t.best)}</span>${fs?.s ? `<button class="link" data-assignhit="topic:${t.topic}">Set as task</button>` : ""}</div>`; }).join("") : `<p class="muted">No topic quizzes yet.</p>`}</section>
    <section class="panel"><h3>Coding Lab</h3>${(() => { const codes = (atts || []).filter(t => t.quiz_id.startsWith("code.")), best = {}; codes.forEach(t => best[t.quiz_id] = Math.max(best[t.quiz_id] || 0, +t.pct));
      const ids = Object.keys(best); return ids.length ? `<p class="muted" style="margin-bottom:8px">${ids.filter(k => best[k] >= 1).length} solved · ${codes.length} submissions</p>` + ids.slice(0, 8).map(k => `<div class="row-line"><span class="tt"><b>${E(BW.findChallenge(k.slice(5))?.title || k)}</b></span><span class="num pc-chip" style="--v:${best[k].toFixed(2)}">${BW.pct(best[k])}</span></div>`).join("") : `<p class="muted">No code submitted yet.</p>`; })()}</section></div>
  <div class="sec-head"><h2>Every attempt</h2><div class="chips">${[["all", "All"], ["quiz", "Quizzes"], ["code", "Coding"]].map(([k, l]) => `<button class="chip ${filter === k ? "on" : ""}" data-attfilter="${k}">${l}</button>`).join("")}</div></div>
  ${atts === undefined ? BW.loading : shown.length ? `<div class="panel att-list"><div class="att-cols muted"><span>Quiz</span><span>Score</span><span>Right</span><span>Time</span></div>${BW.attemptList(shown, BW.ui.openAttempt, cid)}</div>` : `<div class="empty">No attempts yet.</div>`}`;
};
BW.bindStudent = (root, { cid }) => {
  root.querySelectorAll("[data-att]").forEach(el => el.onclick = () => { BW.ui.openAttempt = BW.ui.openAttempt === el.dataset.att ? null : el.dataset.att; BW.render(); });
  root.querySelectorAll("[data-attfilter]").forEach(el => el.onclick = () => { BW.ui.attFilter = el.dataset.attfilter; BW.render(); });
};

/* ---- src/teacher-library.js ---- */
/* Teacher Task Library: a File Explorer-style browser for building homework from quizzes and coding challenges */
BW.lib = { path: ["lib"], back: [], fwd: [], focus: null, anchor: null, basket: [], view: "details", sort: { k: "name", d: 1 }, q: "", preview: true,
  expanded: new Set(["lib", "lib/topics", "lib/code"]), cid: null, menu: null };

/* ---------- icons (Windows 10-style folders, paper files with a coloured type band) ---------- */
const FOLDER_SVG = '<svg viewBox="0 0 48 40" aria-hidden="true"><path d="M2 6a3 3 0 0 1 3-3h13.5l4 5H43a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#D9A43A"/><path d="M2 13a2 2 0 0 1 2-2h40a2 2 0 0 1 2 2v22a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#F4C752"/></svg>';
BW.fileSVG = (color, label) => `<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M5 1.5h21l11.5 11.5v31a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-40.5a2 2 0 0 1 2-2z" fill="#FFFFFF" stroke="#8C96A0"/><path d="M26 1.5v9a2.5 2.5 0 0 0 2.5 2.5h9" fill="#E9ECEF" stroke="#8C96A0"/><rect x="1" y="26" width="27" height="13" rx="2" fill="${color}"/><text x="14.5" y="35.5" font-size="8.5" font-weight="700" text-anchor="middle" fill="#FFFFFF" font-family="ui-monospace,Menlo,monospace">${label}</text></svg>`;
const TYPE_ICON = { code: ["#1F6FB2", "PY"], debug: ["#9A3412", "BUG"], fill: ["#0F766E", "PY+"], boss: ["#B3261E", "HP"], quick: ["#B0306E", "QF"] };
const LEVEL_ICON = [["#8F5424", "BR"], ["#5F6B77", "SI"], ["#8A5A00", "GO"], ["#4353E0", "PT"]];
BW.nodeIcon = n => n.kind === "folder" ? FOLDER_SVG : n.lvl != null ? BW.fileSVG(...LEVEL_ICON[n.lvl]) : n.c?.kind ? BW.fileSVG(...TYPE_ICON[n.c.kind]) : BW.fileSVG(...(TYPE_ICON[n.quiz.split(".")[0]] || (n.quiz.endsWith(".boss") ? TYPE_ICON.boss : TYPE_ICON.quick)));
const ICO = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  fwd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  details: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  icons: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>',
  pane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M14 4v16"/></svg>',
  task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H7l-4 9z"/><path d="M3 19 7 10h15l-4 9z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
};

/* ---------- virtual file system ---------- */
BW.libRoot = null;
BW.libBuild = () => {
  if (BW.libRoot) return BW.libRoot;
  const F = (id, name, children, extra = {}) => ({ id, name, kind: "folder", children, ...extra });
  const file = (quiz, name, type, detail, extra = {}) => ({ id: quiz, quiz, name, full: extra.full || name, kind: "file", type, detail, ...extra });
  const unitF = u => F(u.id, `${BW.units.indexOf(u) + 1}. ${u.title}`, u.subs.map(s => F(s.id, s.title,
    BW.LEVELS.map((L, i) => file(`${u.id}.${s.id}.${i}`, L.name, `${L.name} quiz`, `${L.n} questions`, { lvl: i, u, s, diff: i + 1, full: `${s.title} · ${L.name}` })), { u, s })), { u });
  const root = F("lib", "Task Library", [
    F("topics", "Topic quizzes", [F("p1", "Computer systems", BW.units.filter(u => u.paper === 1).map(unitF)), F("p2", "Algorithms and programming", BW.units.filter(u => u.paper === 2).map(unitF))]),
    F("code", "Coding Lab", BW.CODE.sections.map(sec => F(sec.id, sec.title, sec.items.map(x => BW.findChallenge(x.id)).map(c => file(`code.${c.id}`, c.title, c.kind ? BW.KIND[c.kind].type : "Python challenge", `${c.tests.length} test${c.tests.length === 1 ? "" : "s"}${c.req.length ? ` · ${c.req.length} rule${c.req.length > 1 ? "s" : ""}` : ""}`, { c, diff: c.level }))))),
    F("boss", "Boss battles", BW.units.map(u => file(`${u.id}.boss`, BW.BOSSES[u.id], "Boss battle", `15 questions · ${u.title}`, { u, diff: 3, full: `Boss battle: ${BW.BOSSES[u.id]}` }))),
    F("quick", "Quick fire", BW.quickModes.map(m => file(`quick.${m.id}`, m.title, "Quick fire", m.sub, { m, diff: 2 })))
  ]);
  BW.libFiles = {};
  const walk = (n, path) => { n.path = path; n.key = path.join("/"); if (n.kind === "file") BW.libFiles[n.quiz] = n;
    (n.children || []).forEach(ch => { ch.parent = n; walk(ch, [...path, ch.id]); }); };
  walk(root, ["lib"]);
  return BW.libRoot = root;
};
BW.libUsage = () => {
  const rows = BW.fetchOnce("tdash", () => BW.db.dashboard())?.a.slice().sort((x, y) => (y.created_at || "").localeCompare(x.created_at || ""));
  const used = {}, recent = [];
  (rows || []).filter(r => BW.classById(r.class_id)?.teacher_id === BW.S.user.id).forEach(r => r.quiz_ids.forEach(q => { used[q] = (used[q] || 0) + 1; if (!recent.includes(q)) recent.push(q); }));
  return { used, recent: recent.slice(0, 30), loading: !BW.cache.tdash || !("data" in BW.cache.tdash) };
};
BW.libNode = path => {
  BW.libBuild();
  if (path[0] === "@sel") return { id: "@sel", name: "Selected for task", kind: "folder", virtual: true, path, key: "@sel", children: BW.lib.basket.map(q => BW.libFiles[q]).filter(Boolean) };
  if (path[0] === "@recent") return { id: "@recent", name: "Recently used", kind: "folder", virtual: true, path, key: "@recent", children: BW.libUsage().recent.map(q => BW.libFiles[q]).filter(Boolean) };
  let n = BW.libRoot;
  for (const id of path.slice(1)) { const next = (n.children || []).find(c => c.id === id && c.kind === "folder"); if (!next) break; n = next; }
  return n;
};
BW.libLocation = n => { const names = []; for (let p = n.parent; p; p = p.parent) names.unshift(p.name); return names.slice(1).join(" › ") || "Task Library"; };
BW.libItems = () => {
  const L = BW.lib, node = BW.libNode(L.path), usage = BW.libUsage().used;
  let items, searching = !!L.q.trim();
  if (searching) {
    const words = L.q.toLowerCase().trim().split(/\s+/), out = [];
    const rec = n => (n.children || []).forEach(ch => {
      const hay = [ch.name, ch.full, ch.type, ch.detail, ch.c?.brief, ch.c?.section?.title, ch.s?.notes?.join(" "), ch.u?.title, ch.m?.sub].join(" ").toLowerCase();
      if (words.every(w => hay.includes(w))) out.push(ch);
      if (ch.kind === "folder") rec(ch); });
    rec(node); items = out;
  } else items = (node.children || []).slice();
  const { k, d } = L.sort, key = n => k === "type" ? (n.kind === "folder" ? "" : n.type) : k === "diff" ? (n.diff || 0) : k === "used" ? (usage[n.quiz] || 0) : n.lvl != null ? (searching ? `${n.s.title}\u0001${n.lvl}` : n.lvl) : (searching ? n.full || n.name : n.name);
  if (!node.virtual) items.sort((a, b) => (a.kind === "folder" ? 0 : 1) - (b.kind === "folder" ? 0 : 1) || (typeof key(a) === "number" ? key(a) - key(b) : String(key(a)).localeCompare(String(key(b)), undefined, { numeric: true })) * d);
  return { node, items, searching, usage };
};

/* ---------- navigation ---------- */
BW.libGo = (path, push = true) => {
  const L = BW.lib; if (path.join("/") === L.path.join("/") && !L.q) return;
  if (push) { L.back.push(L.path); L.fwd = []; }
  L.path = path; L.focus = null; L.anchor = null; L.q = ""; L.menu = null;
  if (path[0] === "lib") for (let i = 1; i <= path.length; i++) L.expanded.add(path.slice(0, i).join("/"));
  BW.libRender("exMain");
};
BW.libBack = () => { const L = BW.lib; if (!L.back.length) return; L.fwd.push(L.path); BW.libGo(L.back.pop(), false); };
BW.libFwd = () => { const L = BW.lib; if (!L.fwd.length) return; L.back.push(L.path); const p = L.fwd.pop(); L.path = []; BW.libGo(p, false); };
BW.libUp = () => { const L = BW.lib; if (L.q) { L.q = ""; return BW.libRender("exMain"); } if (L.path[0] !== "lib") return BW.libGo(["lib"]); if (L.path.length > 1) BW.libGo(L.path.slice(0, -1)); };
BW.libRender = keepFocus => {
  const act = document.activeElement, id = act?.id || keepFocus, pos = act?.selectionStart, scroll = document.getElementById("exMain")?.scrollTop;
  BW.render();
  const main = document.getElementById("exMain"); if (main && scroll != null && id !== "exMain") main.scrollTop = scroll;
  const el = id && document.getElementById(id);
  if (el) { el.focus({ preventScroll: true }); if (pos != null && el.setSelectionRange) try { el.setSelectionRange(pos, pos); } catch (e) { } }
  document.querySelector(".ex-row.focus,.ex-tile.focus")?.scrollIntoView({ block: "nearest" });
};
BW.libToggle = (quiz, on) => {
  const b = BW.lib.basket, has = b.includes(quiz), want = on == null ? !has : on;
  if (want && !has) { if (b.length >= 20) { BW.toast("A task can hold up to 20 items"); return false; } b.push(quiz); }
  if (!want && has) b.splice(b.indexOf(quiz), 1);
  return true;
};
BW.libTry = n => {
  if (!n || n.kind !== "file") return;
  const back = ["library"];
  if (n.c) return BW.go("code", { cid: n.c.id });
  if (n.lvl != null) { BW.startSub(n.u.id, n.s.id, n.lvl); BW.Q.back = back; return; }
  if (n.quiz.endsWith(".boss")) { BW.startBoss(n.u.id); BW.Q.back = back; return; }
  BW.startQuick(n.m.id); BW.Q.back = back;
};
BW.libReveal = quiz => { const n = BW.libFiles?.[quiz] || (BW.libBuild(), BW.libFiles[quiz]); if (!n) return; BW.go("library"); BW.libGo(n.parent.path); const { items } = BW.libItems(); BW.lib.focus = items.indexOf(n); BW.libRender("exMain"); };

/* ---------- view ---------- */
const diffDots = d => d ? `<span class="lvl-dots" title="${BW.LEVEL_NAMES[Math.min(d, 3)] || ""}">${[1, 2, 3].map(i => `<i class="${i <= Math.min(d, 3) ? "on" : ""}"></i>`).join("")}</span>` : "";
BW.viewLibrary = ({ cid } = {}) => {
  if (cid) BW.lib.cid = cid;
  const L = BW.lib, { node, items, searching, usage } = BW.libItems(); BW.libView = items;
  const n = L.basket.length, inView = items.filter(x => x.kind === "file");
  const crumbs = node.virtual ? [{ name: node.name, i: 0 }] : node.path.map((id, i) => ({ name: BW.libNode(node.path.slice(0, i + 1)).name, i }));
  const tree = (f, depth) => { const folders = (f.children || []).filter(c => c.kind === "folder"), open = L.expanded.has(f.key), on = f.key === node.key;
    return `<div class="tn-row" style="--d:${depth}"><button class="tw" data-extoggle="${f.key}" aria-label="${open ? "Collapse" : "Expand"} ${E(f.name)}" ${folders.length ? "" : "hidden"}>${open ? "▾" : "▸"}</button><button class="tn ${on ? "on" : ""}" data-exgo="${f.key}"><span class="tn-ico">${FOLDER_SVG}</span><span class="tn-name">${E(f.name)}</span></button></div>` +
      (open ? folders.map(c => tree(c, depth + 1)).join("") : ""); };
  const row = (x, i) => { const file = x.kind === "file", chk = file && L.basket.includes(x.quiz), u = file ? usage[x.quiz] || 0 : 0;
    return `<tr class="ex-row ${L.focus === i ? "focus" : ""} ${chk ? "checked" : ""}" data-exi="${i}" aria-selected="${chk}">
      <td class="ck">${file ? `<input type="checkbox" data-exck="${i}" ${chk ? "checked" : ""} aria-label="Select ${E(x.full || x.name)}">` : ""}</td>
      <td class="nm"><span class="ex-ico">${BW.nodeIcon(x)}</span><span class="ex-name">${E(searching ? x.full || x.name : x.name)}</span></td>
      <td>${file ? E(x.type) : "File folder"}</td><td class="muted">${file ? E(x.detail) : `${x.children.length} item${x.children.length === 1 ? "" : "s"}`}</td>
      <td>${diffDots(x.diff)}</td><td class="num">${u ? `${u} task${u > 1 ? "s" : ""}` : ""}</td>${searching ? `<td class="muted">${E(BW.libLocation(x))}</td>` : ""}</tr>`; };
  const tile = (x, i) => { const file = x.kind === "file", chk = file && L.basket.includes(x.quiz);
    return `<div class="ex-tile ${L.focus === i ? "focus" : ""} ${chk ? "checked" : ""}" data-exi="${i}" role="gridcell" aria-selected="${chk}">${file ? `<input type="checkbox" class="tile-ck" data-exck="${i}" ${chk ? "checked" : ""} aria-label="Select ${E(x.full || x.name)}">` : ""}
      <span class="big-ico">${BW.nodeIcon(x)}</span><span class="tile-name">${E(searching ? x.full || x.name : x.name)}</span></div>`; };
  const sortTh = (k, label) => `<th data-sortk="${k}" aria-sort="${L.sort.k === k ? (L.sort.d > 0 ? "ascending" : "descending") : "none"}">${label}${L.sort.k === k ? `<span class="sort-ar">${L.sort.d > 0 ? "▲" : "▼"}</span>` : ""}</th>`;
  const f = L.focus != null ? items[L.focus] : null;
  const body = !items.length ? `<div class="ex-empty">${searching ? `No results for “${E(L.q)}” in ${E(node.name)}.` : node.id === "@sel" ? "Nothing selected yet. Tick the boxes next to quizzes or coding challenges to add them here." : node.id === "@recent" ? (BW.libUsage().loading ? "Loading…" : "Items you set as tasks will appear here.") : "This folder is empty."}</div>`
    : L.view === "details" ? `<table class="ex-table"><thead><tr><th class="ck"><input type="checkbox" data-exact="toggleall" ${inView.length && inView.every(x => L.basket.includes(x.quiz)) ? "checked" : ""} aria-label="Select every file in this folder" ${inView.length ? "" : "disabled"}></th>${sortTh("name", "Name")}${sortTh("type", "Type")}<th>Details</th>${sortTh("diff", "Difficulty")}${sortTh("used", "Used in")}${searching ? "<th>Folder</th>" : ""}</tr></thead><tbody>${items.map(row).join("")}</tbody></table>`
    : `<div class="ex-grid" role="grid">${items.map(tile).join("")}</div>`;
  return `<div class="explorer" id="explorer">
  <div class="ex-titlebar"><span class="ex-ico sm">${FOLDER_SVG}</span><b>${E(node.name)}</b><span class="muted">Task Library${L.cid && BW.classById(L.cid) ? ` · setting work for ${E(BW.classById(L.cid).name)}` : ""}</span></div>
  <div class="ex-ribbon" role="toolbar" aria-label="Library actions">
    <button class="rb primary" data-exact="create" ${n ? "" : "disabled"}>${ICO.task}<span>New task${n ? ` (${n})` : ""}</span></button><span class="rb-sep"></span>
    <button class="rb" data-exact="open" ${f ? "" : "disabled"}>${ICO.open}<span>${f?.kind === "file" ? "Try it" : "Open"}</span></button>
    <button class="rb" data-exact="add" ${f?.kind === "file" ? "" : "disabled"}>${ICO.check}<span>${f?.kind === "file" && L.basket.includes(f.quiz) ? "Remove from task" : "Add to task"}</span></button><span class="rb-sep"></span>
    <button class="rb" data-exact="all" ${inView.length ? "" : "disabled"}>Select all</button><button class="rb" data-exact="none" ${n ? "" : "disabled"}>Select none</button><button class="rb" data-exact="invert" ${inView.length ? "" : "disabled"}>Invert selection</button><span class="rb-sep"></span>
    <button class="rb ${L.preview ? "on" : ""}" data-exact="pane" aria-pressed="${L.preview}" title="Preview pane (Alt+P)">${ICO.pane}<span>Preview pane</span></button>
  </div>
  <div class="ex-addr">
    <button class="ex-nb" data-exact="back" ${L.back.length ? "" : "disabled"} aria-label="Back" title="Back (Alt+Left)">${ICO.back}</button><button class="ex-nb" data-exact="fwd" ${L.fwd.length ? "" : "disabled"} aria-label="Forward" title="Forward (Alt+Right)">${ICO.fwd}</button><button class="ex-nb" data-exact="up" ${node.path.length > 1 || node.virtual || searching ? "" : "disabled"} aria-label="Up" title="Up (Alt+Up)">${ICO.up}</button>
    <div class="ex-crumbs" role="navigation" aria-label="Current folder"><span class="ex-ico sm">${FOLDER_SVG}</span>${crumbs.map(c => `<button class="crumb" data-crumb="${c.i}">${E(c.name)}</button><button class="crumb-chev" data-chev="${c.i}" aria-label="Folders in ${E(c.name)}" ${node.virtual ? "hidden" : ""}>›</button>`).join("")}${searching ? `<span class="crumb-srch">Search results</span>` : ""}</div>
    <label class="ex-search">${ICO.search}<input id="exSearch" placeholder="Search ${E(node.name)}" value="${E(L.q)}" autocomplete="off" aria-label="Search ${E(node.name)}"></label>
  </div>
  <div class="ex-body ${L.preview ? "with-pane" : ""}">
    <nav class="ex-nav" aria-label="Folders">
      <div class="nav-h">Quick access</div>
      <div class="tn-row" style="--d:0"><span class="tw"></span><button class="tn ${node.id === "@sel" ? "on" : ""}" data-exgo="@sel"><span class="tn-ico qa">${ICO.check}</span><span class="tn-name">Selected for task</span>${n ? `<span class="cnt num">${n}</span>` : ""}</button></div>
      <div class="tn-row" style="--d:0"><span class="tw"></span><button class="tn ${node.id === "@recent" ? "on" : ""}" data-exgo="@recent"><span class="tn-ico qa">${ICO.clock}</span><span class="tn-name">Recently used</span></button></div>
      <div class="nav-h">This library</div>${tree(BW.libBuild(), 0)}
    </nav>
    <section class="ex-main" id="exMain" tabindex="0" aria-label="Items in ${E(node.name)}">${body}</section>
    ${L.preview ? `<aside class="ex-pane" aria-label="Preview">${BW.libPane(f || node, !f)}</aside>` : ""}
  </div>
  <div class="ex-status"><span class="num">${items.length} item${items.length === 1 ? "" : "s"}</span><span class="sb-sep"></span><span class="num">${n} selected for the task</span>${n ? `<button class="link" data-exact="none">Clear</button>` : ""}
    <span class="spacer"></span><button class="ex-vb ${L.view === "details" ? "on" : ""}" data-exview="details" aria-label="Details view" title="Details">${ICO.details}</button><button class="ex-vb ${L.view === "icons" ? "on" : ""}" data-exview="icons" aria-label="Large icons view" title="Large icons">${ICO.icons}</button></div>
  ${L.menu ? BW.libMenuHTML() : ""}
</div>`;
};
BW.libPane = (x, isFolder) => {
  const L = BW.lib;
  if (x.kind === "folder") { const files = (x.children || []).filter(c => c.kind === "file"), folders = (x.children || []).filter(c => c.kind === "folder");
    return `<div class="pane-ico">${FOLDER_SVG}</div><h3>${E(x.name)}</h3><p class="muted">${folders.length ? `${folders.length} folder${folders.length > 1 ? "s" : ""}` : ""}${folders.length && files.length ? " · " : ""}${files.length ? `${files.length} file${files.length > 1 ? "s" : ""}` : ""}${!folders.length && !files.length ? "Empty" : ""}</p>
      ${isFolder ? `<p class="note">Double-click a folder to open it. Tick files to collect them into one task, even across different folders.</p>` : `<button class="cta small" data-exact="open">Open folder</button>`}
      ${files.length && !x.virtual ? `<button class="cta ghost small" data-exact="addfolder">Select all ${files.length} here</button>` : ""}`; }
  const chk = L.basket.includes(x.quiz);
  let about = "";
  if (x.c) about = `<p>${BW.fmt(x.c.brief)}</p><div class="pane-facts"><span>${x.c.tests.filter(t => !t.h).length} example + ${x.c.tests.filter(t => t.h).length} hidden tests</span>${x.c.req.map(r => `<span>${E(BW.reqLabel(r))}</span>`).join("")}</div>`;
  else if (x.lvl != null) about = `<p>${E(BW.LEVELS[x.lvl].blurb)}</p><ul class="pane-notes">${(x.s.notes || []).slice(0, 3).map(t => `<li>${BW.fmt(t)}</li>`).join("")}</ul>`;
  else if (x.quiz.endsWith(".boss")) about = `<p>15 mixed questions from every topic in ${E(x.u.title)}, with 3 lives.</p>`;
  else about = `<p>${E(x.m.sub)}.</p>`;
  return `<div class="pane-ico">${BW.nodeIcon(x)}</div><h3>${E(x.full || x.name)}</h3><p class="muted">${E(x.type)} · ${E(x.detail)}</p>${diffDots(x.diff)}${about}
    <div class="pane-btns"><button class="cta small ${chk ? "ghost" : ""}" data-exact="add">${chk ? "Remove from task" : "Add to task"}</button><button class="cta ghost small" data-exact="open">Try it</button></div>`;
};
BW.libMenuHTML = () => {
  const m = BW.lib.menu;
  return `<div class="ex-menu" role="menu" style="left:${m.x}px;top:${m.y}px">${m.items.map(it => it === "-" ? `<div class="mi-sep"></div>` : `<button role="menuitem" class="mi ${it.bold ? "bold" : ""}" data-exmenu="${it.act}" ${it.disabled ? "disabled" : ""}>${E(it.label)}${it.keys ? `<span class="mi-k">${E(it.keys)}</span>` : ""}</button>`).join("")}</div>`;
};

/* ---------- interaction ---------- */
BW.libOpen = i => { const x = BW.libView[i]; if (!x) return; if (x.kind === "folder") return BW.libGo(x.path); BW.libTry(x); };
BW.libClick = (i, e) => {
  const L = BW.lib, x = BW.libView[i]; if (!x) return;
  const now = Date.now(), dbl = L.lastClick && L.lastClick.i === i && now - L.lastClick.t < 450 && !e.shiftKey && !e.ctrlKey && !e.metaKey;
  L.lastClick = { i, t: now };
  if (dbl) { L.lastClick = null; return BW.libOpen(i); }
  if (e.shiftKey && L.anchor != null) { const [a, b] = [Math.min(L.anchor, i), Math.max(L.anchor, i)]; for (let k = a; k <= b; k++) { const y = BW.libView[k]; if (y.kind === "file") BW.libToggle(y.quiz, true); } }
  else if ((e.ctrlKey || e.metaKey) && x.kind === "file") { BW.libToggle(x.quiz); L.anchor = i; }
  else L.anchor = i;
  L.focus = i; L.menu = null; BW.libRender("exMain");
};
BW.libContext = (i, e) => {
  e.preventDefault();
  const L = BW.lib, x = i != null ? BW.libView[i] : null; if (i != null) L.focus = i;
  const items = x ? (x.kind === "folder" ? [{ act: "open", label: "Open", bold: true, keys: "Enter" }, { act: "addfolder", label: "Select all files inside", disabled: !x.children.some(c => c.kind === "file") }, "-", { act: "expand", label: "Show in folder tree" }]
    : [{ act: "open", label: "Try it", bold: true, keys: "Enter" }, { act: "add", label: L.basket.includes(x.quiz) ? "Remove from task" : "Add to task", keys: "Space" }, { act: "newone", label: "New task with just this" }, "-",
       ...(L.q || x.parent !== BW.libNode(L.path) ? [{ act: "location", label: "Open file location" }] : []), { act: "preview", label: "Show in preview pane" }])
    : [{ act: "all", label: "Select all", keys: "Ctrl+A" }, { act: "none", label: "Select none", disabled: !L.basket.length }, "-", { act: "view:details", label: "View: Details" }, { act: "view:icons", label: "View: Large icons" }, "-", { act: "sort:name", label: "Sort by name" }, { act: "sort:type", label: "Sort by type" }, { act: "sort:diff", label: "Sort by difficulty" }];
  const r = document.getElementById("explorer").getBoundingClientRect();
  L.menu = { x: Math.min(e.clientX - r.left, r.width - 230), y: Math.min(e.clientY - r.top, r.height - 40 - items.length * 34), items, i };
  BW.libRender("exMain");
};
BW.libAction = act => {
  const L = BW.lib, f = L.focus != null ? BW.libView[L.focus] : null, files = BW.libView.filter(x => x.kind === "file");
  L.menu = null;
  if (act === "create") return BW.newTaskDialog({ items: L.basket.slice(), fromBasket: true });
  if (act === "open") return f ? BW.libOpen(L.focus) : BW.libRender("exMain");
  if (act === "add" && f?.kind === "file") BW.libToggle(f.quiz);
  if (act === "newone" && f?.kind === "file") return BW.newTaskDialog({ items: [f.quiz] });
  if (act === "all" || act === "toggleall" && !files.every(x => L.basket.includes(x.quiz))) files.forEach(x => BW.libToggle(x.quiz, true));
  else if (act === "toggleall") files.forEach(x => BW.libToggle(x.quiz, false));
  if (act === "none") L.basket = [];
  if (act === "invert") files.forEach(x => BW.libToggle(x.quiz));
  if (act === "addfolder") { const folder = f?.kind === "folder" ? f : BW.libNode(L.path); (folder.children || []).filter(c => c.kind === "file").forEach(c => BW.libToggle(c.quiz, true)); }
  if (act === "pane") L.preview = !L.preview;
  if (act === "back") return BW.libBack();
  if (act === "fwd") return BW.libFwd();
  if (act === "up") return BW.libUp();
  if (act === "expand" && f) { for (let k = 1; k <= f.path.length; k++) L.expanded.add(f.path.slice(0, k).join("/")); }
  if (act === "location" && f) return BW.libReveal(f.quiz);
  if (act.startsWith("view:")) L.view = act.slice(5);
  if (act.startsWith("sort:")) { const k = act.slice(5); L.sort = { k, d: L.sort.k === k ? -L.sort.d : 1 }; }
  if (act.startsWith("go:")) return BW.libGo(act.slice(3).split("/"));
  BW.libRender("exMain");
};
BW.bindLibrary = root => {
  const L = BW.lib, ex = root.querySelector("#explorer"); if (!ex) return;
  ex.addEventListener("click", e => {
    const t = e.target;
    if (!t.closest(".ex-menu") && L.menu) { L.menu = null; if (!t.closest("[data-chev]")) { BW.libRender("exMain"); return; } }
    const ck = t.closest("[data-exck]"); if (ck) { const x = BW.libView[+ck.dataset.exck]; BW.libToggle(x.quiz); L.focus = +ck.dataset.exck; L.anchor = L.focus; return BW.libRender("exMain"); }
    const act = t.closest("[data-exact]"); if (act) { e.preventDefault(); return BW.libAction(act.dataset.exact); }
    const mi = t.closest("[data-exmenu]"); if (mi) return BW.libAction(mi.dataset.exmenu);
    const go = t.closest("[data-exgo]"); if (go) return BW.libGo(go.dataset.exgo.split("/"));
    const tg = t.closest("[data-extoggle]"); if (tg) { const k = tg.dataset.extoggle; L.expanded.has(k) ? L.expanded.delete(k) : L.expanded.add(k); return BW.libRender(); }
    const cr = t.closest("[data-crumb]"); if (cr) { const node = BW.libNode(L.path); return node.virtual ? BW.libRender() : BW.libGo(node.path.slice(0, +cr.dataset.crumb + 1)); }
    const ch = t.closest("[data-chev]"); if (ch) { const node = BW.libNode(L.path), folder = BW.libNode(node.path.slice(0, +ch.dataset.chev + 1)), r = ex.getBoundingClientRect(), b = ch.getBoundingClientRect();
      const subs = (folder.children || []).filter(c => c.kind === "folder");
      L.menu = { x: b.left - r.left, y: b.bottom - r.top + 4, items: subs.length ? subs.map(s => ({ act: "go:" + s.path.join("/"), label: s.name, bold: node.path.includes(s.id) })) : [{ act: "noop", label: "No folders", disabled: true }] };
      return BW.libRender(); }
    const vb = t.closest("[data-exview]"); if (vb) { L.view = vb.dataset.exview; return BW.libRender("exMain"); }
    const th = t.closest("[data-sortk]"); if (th) return BW.libAction("sort:" + th.dataset.sortk);
    const it = t.closest("[data-exi]"); if (it) return BW.libClick(+it.dataset.exi, e);
    if (t.closest("#exMain") && L.focus != null) { L.focus = null; BW.libRender("exMain"); }
  });
  ex.addEventListener("contextmenu", e => { if (e.target.closest("input,.ex-menu")) return; const it = e.target.closest("[data-exi]"); if (it || e.target.closest("#exMain")) BW.libContext(it ? +it.dataset.exi : null, e); });
  const s = root.querySelector("#exSearch");
  s.oninput = () => { L.q = s.value; L.focus = null; BW.libRender("exSearch"); };
  s.onkeydown = e => { if (e.key === "Escape") { L.q = ""; BW.libRender("exMain"); } if (e.key === "ArrowDown" || e.key === "Enter") { e.preventDefault(); L.focus = 0; BW.libRender("exMain"); } };
};
document.addEventListener("keydown", e => {
  if (BW.route?.name !== "library" || document.querySelector(".modal-wrap")) return;
  const L = BW.lib, inField = e.target.matches?.("input:not([type=checkbox]),textarea,select");
  const mod = e.ctrlKey || e.metaKey;
  if (e.altKey && e.key === "ArrowLeft") { e.preventDefault(); return BW.libBack(); }
  if (e.altKey && e.key === "ArrowRight") { e.preventDefault(); return BW.libFwd(); }
  if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); return BW.libUp(); }
  if (e.altKey && e.key.toLowerCase() === "p") { e.preventDefault(); return BW.libAction("pane"); }
  if ((mod && e.key.toLowerCase() === "e") || e.key === "F3" || (mod && e.key.toLowerCase() === "f" && document.activeElement?.closest?.("#explorer"))) { e.preventDefault(); return document.getElementById("exSearch")?.focus(); }
  if (inField) return;
  if (e.key === "Escape") { if (L.menu) { L.menu = null; return BW.libRender("exMain"); } if (L.q) { L.q = ""; return BW.libRender("exMain"); } if (L.focus != null) { L.focus = null; return BW.libRender("exMain"); } return; }
  if (!document.activeElement?.closest?.("#explorer") && document.activeElement !== document.body) return;
  const n = BW.libView?.length || 0; if (!n && !["Backspace"].includes(e.key)) return;
  const cols = L.view === "icons" ? Math.max(1, Math.floor((document.querySelector(".ex-grid")?.clientWidth || 600) / 128)) : 1;
  const move = d => { e.preventDefault(); const next = Math.max(0, Math.min(n - 1, (L.focus ?? -1) + d)); if (e.shiftKey) { const [a, b] = [Math.min(L.anchor ?? next, next), Math.max(L.anchor ?? next, next)]; for (let k = a; k <= b; k++) BW.libView[k].kind === "file" && BW.libToggle(BW.libView[k].quiz, true); } else L.anchor = next; L.focus = next; BW.libRender("exMain"); };
  if (e.key === "ArrowDown") return move(cols);
  if (e.key === "ArrowUp") return move(-cols);
  if (e.key === "ArrowRight" && L.view === "icons") return move(1);
  if (e.key === "ArrowLeft" && L.view === "icons") return move(-1);
  if (e.key === "Home") return move(-n);
  if (e.key === "End") return move(n);
  if (e.key === "Enter" && L.focus != null) { e.preventDefault(); return BW.libOpen(L.focus); }
  if (e.key === " " && L.focus != null && BW.libView[L.focus].kind === "file") { e.preventDefault(); BW.libToggle(BW.libView[L.focus].quiz); return BW.libRender("exMain"); }
  if (e.key === "Backspace") { e.preventDefault(); return BW.libUp(); }
  if ((e.key === "Delete") && L.path[0] === "@sel" && L.focus != null) { BW.libToggle(BW.libView[L.focus].quiz, false); L.focus = Math.min(L.focus, BW.lib.basket.length - 1); if (L.focus < 0) L.focus = null; return BW.libRender("exMain"); }
  if (mod && e.key.toLowerCase() === "a") { e.preventDefault(); return BW.libAction("all"); }
});

/* ---------- new task dialog (one task, many items) ---------- */
BW.itemLabel = q => { const n = BW.libFiles?.[q] || (BW.libBuild(), BW.libFiles[q]); const lab = BW.quizLabel(q);
  return { name: n ? n.full || n.name : lab.title, sub: n ? `${n.type} · ${n.detail}` : lab.sub || "", icon: n ? BW.nodeIcon(n) : FOLDER_SVG }; };
BW.newTaskDialog = ({ items, cid, fromBasket }) => {
  const cls = BW.myClasses().filter(c => !c.archived);
  if (!cls.length) return BW.toast("Create a class first, then set work for it.");
  let list = [...new Set(items)].slice(0, 20), touched = false;
  const def = cid || BW.lib.cid || (BW.route.name === "class" && BW.route.params.cid) || cls[0].id;
  const allCode = () => list.every(q => q.startsWith("code."));
  const autoTitle = () => !list.length ? "" : list.length === 1 ? BW.itemLabel(list[0]).name : `${allCode() ? "Coding homework" : "Homework"}: ${BW.itemLabel(list[0]).name} + ${list.length - 1} more`;
  const due = new Date(Date.now() + 7 * 864e5); due.setHours(17, 0, 0, 0);
  const local = new Date(due - due.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
  const itemsHTML = () => list.map((q, i) => { const l = BW.itemLabel(q);
    return `<li class="nt-item"><span class="ex-ico">${l.icon}</span><span class="tt"><b>${E(l.name)}</b><small class="muted">${E(l.sub)}</small></span>
      <span class="nt-btns"><button type="button" data-ntup="${i}" aria-label="Move up" ${i ? "" : "disabled"}>↑</button><button type="button" data-ntdown="${i}" aria-label="Move down" ${i < list.length - 1 ? "" : "disabled"}>↓</button><button type="button" data-ntdel="${i}" aria-label="Remove">✕</button></span></li>`; }).join("") || `<li class="muted">No items left. Close this and pick some from the library.</li>`;
  BW.modal(`<h2>New task</h2><p class="muted" style="margin:4px 0 12px">Students complete every item. An item counts once they reach the target score on it.</p>
    <form id="ntForm" class="form">
      <label for="ntClass">Class</label><select id="ntClass">${cls.map(c => `<option value="${c.id}" ${c.id === def ? "selected" : ""}>${E(c.name)}</option>`).join("")}</select>
      <label>Items <span class="muted num" id="ntCount">(${list.length})</span></label><ol class="nt-items" id="ntItems">${itemsHTML()}</ol>
      <label for="ntTitle">Title</label><input id="ntTitle" maxlength="100" value="${E(autoTitle())}" required>
      <div class="grid2 form"><div><label for="ntTarget">Target score per item</label><select id="ntTarget">${[50, 60, 70, 80, 90, 100].map(v => `<option value="${v}" ${v === (allCode() ? 100 : 80) ? "selected" : ""}>${v}%</option>`).join("")}</select></div>
        <div><label for="ntDue">Due</label><input id="ntDue" type="datetime-local" value="${local}"></div></div>
      <label for="ntNote">Instructions (optional)</label><textarea id="ntNote" maxlength="1000" rows="2" placeholder="e.g. Do these in order. Use the hints if you get stuck."></textarea>
      <div class="row-btns" style="margin-top:8px"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta" id="ntGo">Set homework</button></div>
    </form>`, (w, close) => {
    const $ = id => w.querySelector("#" + id);
    const redraw = () => { $("ntItems").innerHTML = itemsHTML(); $("ntCount").textContent = `(${list.length})`; if (!touched) $("ntTitle").value = autoTitle(); $("ntGo").disabled = !list.length; };
    $("ntTitle").oninput = () => touched = true;
    $("ntItems").onclick = e => { const b = e.target.closest("button"); if (!b) return; const i = +(b.dataset.ntup ?? b.dataset.ntdown ?? b.dataset.ntdel);
      if (b.dataset.ntup != null) [list[i - 1], list[i]] = [list[i], list[i - 1]];
      if (b.dataset.ntdown != null) [list[i + 1], list[i]] = [list[i], list[i + 1]];
      if (b.dataset.ntdel != null) list.splice(i, 1);
      redraw(); };
    $("ntForm").onsubmit = async e => { e.preventDefault(); if (!list.length) return;
      const classId = $("ntClass").value, btn = $("ntGo"); btn.disabled = true; btn.textContent = "Setting…";
      try { await BW.db.createTask(classId, { quiz_ids: list, title: $("ntTitle").value.trim().slice(0, 100) || autoTitle(),
        instructions: $("ntNote").value.trim().slice(0, 1000), target_pct: +$("ntTarget").value, due_at: $("ntDue").value ? new Date($("ntDue").value).toISOString() : null }); }
      catch (x) { btn.disabled = false; btn.textContent = "Set homework"; return BW.toast(BW.errMsg(x)); }
      close(); if (fromBasket) BW.lib.basket = [];
      BW.invalidate("assign:" + classId, "asum:" + classId, "tdash");
      BW.toast(`Homework set for ${BW.classById(classId)?.name || "the class"}`); BW.sfx.play("win");
      BW.go("class", { cid: classId }); BW.ui.classTab = "tasks"; BW.render(); };
  });
};

/* ---- src/teacher-progress.js ---- */
/* Class progress grid (students × tasks) and the per-student task view with resubmission requests */
BW.cellState = r => !r ? "none" : r.completed_at ? "done" : r.resub ? "redo" : r.tries > 0 ? "prog" : "none";
BW.CELL_LABEL = { done: "Completed", prog: "In progress", none: "Not started", redo: "Resubmission requested" };

BW.classProgress = c => {
  const g = BW.fetchOnce("grid:" + c.id, () => BW.db.classGrid(c.id));
  if (g === undefined) return BW.loading;
  if (!g) return `<div class="empty">${E(BW.cacheErr("grid:" + c.id))}</div>`;
  if (!g.tasks.length) return `<div class="empty">No tasks yet. <button class="link" data-act="openlib">Set homework from the Task Library</button></div>`;
  if (!g.roster.length) return `<div class="empty">No students in this class yet.</div>`;
  const tasks = g.tasks.slice().sort((a, b) => (a.due_at || "9999").localeCompare(b.due_at || "9999"));
  const cell = (t, m) => { const r = g.cells[t.id]?.[m.student_id], st = BW.cellState(r), k = t.quiz_ids.length;
    const txt = st === "done" ? "✓" : st === "redo" ? "↺" : st === "prog" ? `${r.items_done}/${k}` : "–";
    return `<td class="c"><button class="pcell ${st}" data-cell="${t.id}|${m.student_id}" title="${E(m.display_name)} · ${E(t.title)}: ${BW.CELL_LABEL[st]}" aria-label="${E(m.display_name)}, ${E(t.title)}: ${BW.CELL_LABEL[st]}">${txt}</button></td>`; };
  return `<div class="pg-legend"><span><i class="pcell done"></i>Completed</span><span><i class="pcell prog"></i>In progress</span><span><i class="pcell none"></i>Not started</span><span><i class="pcell redo"></i>Resubmission requested</span></div>
  <div class="table-wrap pgrid-wrap"><table class="dtable pgrid"><thead><tr><th class="stick">Student</th>
    ${tasks.map(t => { const due = BW.dueLabel(t.due_at); return `<th class="tcol"><button class="link-plain" data-assign="${t.id}" title="Open the task report">${E(t.title)}</button><small class="due-chip ${due.cls}">${due.text}</small></th>`; }).join("")}
    <th class="r">Done</th></tr></thead><tbody>
    ${g.roster.map(m => { const done = tasks.filter(t => g.cells[t.id]?.[m.student_id]?.completed_at).length;
      return `<tr><td class="stick"><button class="who link-plain" data-student="${m.student_id}">${BW.avatarHTML("av-sm", m)}${E(m.display_name)}</button></td>${tasks.map(t => cell(t, m)).join("")}<td class="r num">${done}/${tasks.length}</td></tr>`; }).join("")}
  </tbody></table></div>`;
};

/* one student's work on one task */
BW.openCell = (c, tid, sid) => {
  const g = BW.cache["grid:" + c.id]?.data; if (!g) return;
  const t = g.tasks.find(x => x.id === tid), m = g.roster.find(x => x.student_id === sid), r = g.cells[tid]?.[sid]; if (!t || !m) return;
  const st = BW.cellState(r), redo = r?.resub, since = t.created_at || "";
  const all = q => g.results.filter(x => x.uid === sid && x.quiz_id === q && x.finished_at >= since);   // every attempt since the task was set, newest first
  const items = t.quiz_ids.map((q, i) => ({ q, i, lab: BW.itemLabel(q), rep: r?.items[i], atts: all(q) }));
  const chip = { done: "good", prog: "warn", none: "bad", redo: "warn" }[st];
  BW.modal(`<div class="cellview"><h2>${E(m.display_name)}</h2><p class="muted">${E(t.title)} · target ${t.target_pct}% · ${BW.dueLabel(t.due_at).text}</p>
    <p style="margin:8px 0"><span class="chip-s ${chip}">${BW.CELL_LABEL[st]}</span></p>
    ${redo ? `<div class="redo-box"><b>Resubmission requested ${BW.when(redo.requested_at)}</b>${redo.reason ? `<p>${E(redo.reason)}</p>` : ""}<small class="muted">Items: ${redo.quiz_ids.map(q => E(BW.itemLabel(q).name)).join(", ")}</small><button class="link danger-t" id="cancelRedo">Cancel request</button></div>` : ""}
    ${items.map(it => { const done = !!it.rep?.completed_at, tried = it.atts.length;
      return `<section class="ci"><div class="ci-head"><span class="ex-ico">${it.lab.icon}</span><b>${E(it.lab.name)}</b><span class="chip-s ${done ? "good" : tried ? "warn" : "bad"}">${done ? "Done" : tried ? "Tried" : "Not started"}</span>
        ${it.rep?.best != null ? `<span class="num muted">best ${BW.pct(it.rep.best)}</span>` : ""}</div>
        ${tried ? `<div class="chips ci-atts">${it.atts.map((a, k) => `<button class="chip small ${k === 0 ? "on" : ""}" data-pick="${it.i}|${a.id}">${BW.when(a.finished_at)} · ${BW.pct(a.pct)}${redo && redo.quiz_ids.includes(it.q) && a.finished_at < redo.requested_at ? " · before request" : ""}</button>`).join("")}</div>
          <div class="ci-ans" id="ciAns${it.i}">${BW.loading}</div>` : `<p class="muted">No attempts yet.</p>`}</section>`; }).join("")}
    <div id="redoArea"><div class="row-btns" style="margin-top:14px"><button class="cta ghost" data-close>Close</button>${r?.tries || g.results.some(x => x.uid === sid && t.quiz_ids.includes(x.quiz_id)) ? `<button class="cta" id="askRedo">${redo ? "Update request" : "Request resubmission"}</button>` : ""}</div></div></div>`,
    (w, close) => {
      w.querySelector(".modal").classList.add("wide");
      const show = async (i, aid) => { const box = w.querySelector("#ciAns" + i); if (!box) return;
        const a = g.results.find(x => x.id === aid); box.innerHTML = BW.loading;
        try { const rows = a?.answers || await BW.db.answers(c.id, aid); box.innerHTML = BW.answersHTML(rows); } catch (e) { box.innerHTML = `<p class="note err">${E(BW.errMsg(e))}</p>`; } };
      items.forEach(it => it.atts[0] && show(it.i, it.atts[0].id));
      w.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => { const [i, aid] = b.dataset.pick.split("|");
        b.parentElement.querySelectorAll(".chip").forEach(x => x.classList.toggle("on", x === b)); show(+i, aid); });
      const refresh = () => { BW.invalidate("grid:" + c.id, "asum:" + c.id, "rep:"); BW.render(); };
      w.querySelector("#cancelRedo")?.addEventListener("click", async () => { try { await BW.db.cancelResub(c.id, tid, sid); close(); BW.toast("Request cancelled"); refresh(); } catch (e) { BW.toast(BW.errMsg(e)); } });
      w.querySelector("#askRedo")?.addEventListener("click", () => {
        w.querySelector("#redoArea").innerHTML = `<form id="redoForm" class="form redo-form"><h3>Request resubmission</h3>
          <label for="redoWhy">Reason (${E(m.display_name.split(" ")[0])} will see this)</label>
          <textarea id="redoWhy" rows="3" maxlength="1000" placeholder="e.g. Try a different approach: use a while loop instead of a for loop.">${E(redo?.reason || "")}</textarea>
          <label>Items to redo</label><div class="check-list">${items.map(it => `<label class="check-row"><input type="checkbox" value="${E(it.q)}" ${!redo || redo.quiz_ids.includes(it.q) ? "checked" : ""}> ${E(it.lab.name)}</label>`).join("")}</div>
          <p class="note">Only work done after this request will count for these items.</p>
          <div class="row-btns"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta">Send request</button></div></form>`;
        w.querySelector("#redoWhy").focus();
        w.querySelector("#redoForm").onsubmit = async e => { e.preventDefault(); const qs = [...w.querySelectorAll(".redo-form input:checked")].map(x => x.value);
          if (!qs.length) return BW.toast("Tick at least one item");
          const btn = e.target.querySelector("button.cta:not(.ghost)"); btn.disabled = true;
          try { await BW.db.requestResub(c.id, t, sid, qs, w.querySelector("#redoWhy").value.trim()); close(); BW.toast(`Resubmission requested from ${m.display_name}`); refresh(); }
          catch (x) { btn.disabled = false; BW.toast(BW.errMsg(x)); } };
      });
    });
};

/* ---- src/school.js ---- */
/* School directory (teachers), login cards, the teacher code panel, notices and the student message centre */

/* ---------- school directory ---------- */
BW.ui.dirSel = new Set();
BW.viewDirectory = () => {
  const S = BW.S, dir = BW.fetchOnce("dir", () => BW.db.directory()), mine = BW.myClasses().filter(c => !c.archived);
  const head = `<h1>School directory</h1><p class="muted" style="margin-top:6px">${S.school ? E(S.school.name) : ""}</p>`;
  if (dir === undefined) return head + BW.loading;
  if (!dir) return head + `<div class="empty">${E(BW.cacheErr("dir"))}</div>`;
  const q = (BW.ui.dirQ || "").toLowerCase(), f = BW.ui.dirFilter || "all";
  const students = dir.filter(p => p.role === "student" && p.managed), teachers = dir.filter(p => p.role === "teacher");
  const mineIds = new Set(mine.map(c => c.id));
  const shown = students.filter(p => (!q || (p.display_name + " " + (p.username || "")).toLowerCase().includes(q)) && (f === "all" || (f === "none" ? !p.class_ids.some(c => mineIds.has(c)) : p.class_ids.includes(f))));
  const sel = [...BW.ui.dirSel].filter(id => students.some(p => p.id === id));
  return head + `
  <div class="dir-bar"><button class="cta small" data-act="newlogins">+ Create student logins</button>
    <label class="search inset dir-search">${I.search}<input id="dirQ" placeholder="Search names or usernames" value="${E(BW.ui.dirQ || "")}" autocomplete="off" aria-label="Search the directory"></label>
    <select id="dirFilter" aria-label="Filter"><option value="all">Everyone</option><option value="none" ${f === "none" ? "selected" : ""}>Not in any of my classes</option>${mine.map(c => `<option value="${c.id}" ${f === c.id ? "selected" : ""}>In ${E(c.name)}</option>`).join("")}</select></div>
  ${sel.length ? `<div class="dir-bulk"><b class="num">${sel.length} selected</b><span class="muted">Add to class:</span>${mine.map(c => `<button class="chip" data-bulkadd="${c.id}">${E(c.name)}</button>`).join("") || `<span class="muted">Create a class first</span>`}<button class="link" data-act="clearsel">Clear</button></div>` : ""}
  ${students.length ? `<div class="table-wrap"><table class="dtable"><thead><tr><th class="ck"><input type="checkbox" data-dirall ${shown.length && shown.every(p => sel.includes(p.id)) ? "checked" : ""} aria-label="Select everyone shown"></th><th>Student</th><th>Username</th><th>Your classes</th><th class="r">XP</th><th></th></tr></thead><tbody>
    ${shown.map(p => { const my = p.class_ids.filter(c => mineIds.has(c)).map(c => BW.classById(c)), other = p.class_ids.length - my.length;
      return `<tr><td class="ck"><input type="checkbox" data-dirsel="${p.id}" ${sel.includes(p.id) ? "checked" : ""} aria-label="Select ${E(p.display_name)}"></td>
      <td><span class="who">${BW.avatarHTML("av-sm", p)}<span>${E(p.display_name)}<br>${BW.managedBadge()}</span></span></td><td class="mono">${E(p.username || "")}</td>
      <td><div class="item-chips">${my.map(c => `<span class="item-chip">${E(c.name)}</span>`).join("")}${other > 0 ? `<span class="item-chip muted">+${other} other</span>` : ""}${!p.class_ids.length ? `<span class="muted">No classes</span>` : ""}</div></td>
      <td class="r num">${p.xp}</td><td class="r"><div class="act-btns"><button class="link" data-dirclasses="${p.id}">Classes…</button><button class="link" data-dirrename="${p.id}">Rename</button><button class="link" data-dirreset="${p.id}">Password</button><button class="link danger-t" data-dirremove="${p.id}">Remove from school</button></div></td></tr>`; }).join("") || `<tr><td colspan="6" class="muted">Nobody matches.</td></tr>`}
    </tbody></table></div>` : `<div class="empty">No school logins yet. Create some and they'll appear here for every teacher at your school.</div>`}
  <div class="sec-head"><h2>Teachers</h2><span class="muted">${teachers.length}</span></div>
  <div class="panel">${teachers.map(t => `<div class="row-line"><span class="who">${BW.avatarHTML("av-sm", t)}${E(t.display_name)}</span>${t.id === S.user.id ? `<span class="muted">(you)</span>` : ""}</div>`).join("")}</div>`;
};
BW.bindDirectory = root => {
  const dir = BW.cache.dir?.data || [], byId = id => dir.find(p => p.id === id), refresh = () => { BW.invalidate("dir", "roster:", "sstats:", "stats:", "board:", "tdash"); BW.render(); };
  const q = root.querySelector("#dirQ"); if (q) q.oninput = () => { BW.ui.dirQ = q.value; BW.render(); const n = document.getElementById("dirQ"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); };
  root.querySelector("#dirFilter")?.addEventListener("change", e => { BW.ui.dirFilter = e.target.value; BW.render(); });
  root.querySelectorAll("[data-dirsel]").forEach(c => c.onchange = () => { c.checked ? BW.ui.dirSel.add(c.dataset.dirsel) : BW.ui.dirSel.delete(c.dataset.dirsel); BW.render(); });
  root.querySelector("[data-dirall]")?.addEventListener("change", e => { root.querySelectorAll("[data-dirsel]").forEach(c => e.target.checked ? BW.ui.dirSel.add(c.dataset.dirsel) : BW.ui.dirSel.delete(c.dataset.dirsel)); BW.render(); });
  root.querySelector("[data-act=clearsel]")?.addEventListener("click", () => { BW.ui.dirSel.clear(); BW.render(); });
  root.querySelector("[data-act=newlogins]")?.addEventListener("click", () => BW.newLoginsDialog());
  root.querySelectorAll("[data-bulkadd]").forEach(b => b.onclick = async () => { const cid = b.dataset.bulkadd, ids = [...BW.ui.dirSel]; b.disabled = true;
    try { for (const id of ids) { const p = byId(id); if (p && !p.class_ids.includes(cid)) await BW.db.setClasses(id, [...p.class_ids.filter(c => BW.classById(c)), cid]); }
      BW.toast(`Added ${ids.length} to ${BW.classById(cid).name}`); BW.ui.dirSel.clear(); refresh(); } catch (e) { BW.toast(BW.errMsg(e)); b.disabled = false; } });
  root.querySelectorAll("[data-dirclasses]").forEach(b => b.onclick = () => { const p = byId(b.dataset.dirclasses), mine = BW.myClasses().filter(c => !c.archived);
    BW.modal(`<h2>${E(p.display_name)}'s classes</h2><p class="muted" style="margin:6px 0 12px">Tick the classes they should be in.</p>
      <form id="clsForm" class="form">${mine.map(c => `<label class="check-row"><input type="checkbox" value="${c.id}" ${p.class_ids.includes(c.id) ? "checked" : ""}> ${E(c.name)}</label>`).join("") || `<p class="muted">Create a class first.</p>`}
      <div class="row-btns" style="margin-top:10px"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta">Save classes</button></div></form>`,
      (w, close) => w.querySelector("#clsForm").onsubmit = async e => { e.preventDefault(); const want = [...w.querySelectorAll("input:checked")].map(i => i.value);
        try { await BW.db.setClasses(p.id, want); close(); BW.toast("Classes saved"); refresh(); } catch (x) { BW.toast(BW.errMsg(x)); } }); });
  root.querySelectorAll("[data-dirrename]").forEach(b => b.onclick = () => { const p = byId(b.dataset.dirrename);
    BW.modal(`<h2>Rename student</h2><p class="muted" style="margin:6px 0 12px">Students with school logins can't change their own name.</p><form id="rnForm" class="form"><label for="rnName">Name</label><input id="rnName" maxlength="40" value="${E(p.display_name)}" required>
      <div class="row-btns" style="margin-top:10px"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta">Save name</button></div></form>`,
      (w, close) => w.querySelector("#rnForm").onsubmit = async e => { e.preventDefault(); const n = w.querySelector("#rnName").value.trim(); if (!n) return;
        try { await BW.db.renameStudent(p.id, n); close(); BW.toast("Name changed"); refresh(); } catch (x) { BW.toast(BW.errMsg(x)); } }); });
  root.querySelectorAll("[data-dirreset]").forEach(b => b.onclick = () => BW.resetInfo(byId(b.dataset.dirreset)));
  root.querySelectorAll("[data-dirremove]").forEach(b => b.onclick = () => BW.removeFromSchoolDialog(byId(b.dataset.dirremove), refresh));
};
BW.addFromDirectory = c => {
  BW.modal(`<h2>Add to ${E(c.name)}</h2><p class="muted" style="margin:6px 0 12px">Tick the students to add.</p><div id="afdBody">${BW.loading}</div>`, async (w, close) => {
    const body = w.querySelector("#afdBody");
    try {
      const dir = (await BW.db.directory()).filter(p => p.role === "student" && p.managed && !p.class_ids.includes(c.id));
      if (!dir.length) { body.innerHTML = `<p class="note">Everyone in your school directory is already in this class. Create new logins instead.</p><div class="row-btns"><button class="cta ghost" data-close>Close</button><button class="cta" id="afdNew">Create student logins</button></div>`;
        body.querySelector("#afdNew").onclick = () => { close(); BW.newLoginsDialog(c.id); }; return; }
      body.innerHTML = `<label class="search inset">${I.search}<input id="afdQ" placeholder="Filter names" autocomplete="off" aria-label="Filter names"></label>
        <form id="afdForm" class="form"><div class="check-list tall">${dir.map(p => `<label class="check-row" data-n="${E((p.display_name + " " + (p.username || "")).toLowerCase())}"><input type="checkbox" value="${p.id}"> ${E(p.display_name)} <span class="mono muted">${E(p.username || "")}</span>${p.class_ids.length ? `<small class="muted"> · in ${p.class_ids.length} class${p.class_ids.length > 1 ? "es" : ""}</small>` : ""}</label>`).join("")}</div>
        <div class="row-btns" style="margin-top:10px"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta" id="afdGo">Add to class</button></div></form>`;
      body.querySelector("#afdQ").oninput = e => body.querySelectorAll(".check-row").forEach(r => r.hidden = !r.dataset.n.includes(e.target.value.toLowerCase().trim()));
      body.querySelector("#afdForm").onsubmit = async e => { e.preventDefault(); const ids = [...body.querySelectorAll("input[type=checkbox]:checked")].map(i => i.value); if (!ids.length) return BW.toast("Tick at least one student");
        const btn = body.querySelector("#afdGo"); btn.disabled = true; btn.textContent = "Adding…";
        try { for (const id of ids) { const p = dir.find(x => x.id === id); await BW.db.setClasses(id, [...p.class_ids.filter(x => BW.classById(x)), c.id]); }
          close(); BW.toast(`Added ${ids.length} student${ids.length > 1 ? "s" : ""}`); BW.invalidate("roster:" + c.id, "sstats:" + c.id, "stats:" + c.id, "board:" + c.id, "asum:" + c.id, "tdash", "dir"); BW.render(); }
        catch (x) { btn.disabled = false; btn.textContent = "Add to class"; BW.toast(BW.errMsg(x)); } };
    } catch (x) { body.innerHTML = `<p class="note err">${E(BW.errMsg(x))}</p>`; }
  });
};
BW.resetInfo = p => BW.modal(`<h2>Password for ${E(p?.display_name || "this student")}</h2><p class="muted" style="margin:8px 0 12px">${E(BW.errMsg({ code: "spark_no_reset" }))}</p>
  ${p?.username ? `<p>Username: <span class="mono">${E(p.username)}</span></p>` : ""}<button class="cta" data-close style="margin-top:12px">OK</button>`);
BW.removeFromSchoolDialog = (p, done) => BW.modal(`<h2>Remove ${E(p.display_name)} from the school?</h2><p class="muted" style="margin:8px 0 14px">They're taken out of every class and their login stops working. Their scores can't be recovered. This can't be undone.</p>
  <form id="rmForm" class="form"><label for="rmTxt">Type REMOVE to confirm</label><input id="rmTxt" autocomplete="off"><div class="row-btns"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta danger">Remove from school</button></div></form>`,
  (w, close) => w.querySelector("#rmForm").onsubmit = async e => { e.preventDefault(); if (w.querySelector("#rmTxt").value.trim() !== "REMOVE") return BW.toast("Type REMOVE to confirm");
    try { await BW.db.removeFromSchool(p.id); close(); BW.toast(`${p.display_name} removed`); done && done(); } catch (x) { BW.toast(BW.errMsg(x)); } });

/* ---------- creating logins + login cards ---------- */
BW.newLoginsDialog = (presetClass) => {
  const mine = BW.myClasses().filter(c => !c.archived);
  BW.modal(`<h2>Create student logins</h2><p class="muted" style="margin:8px 0 12px">One name per line, up to 40.</p>
    <form id="namesForm" class="form"><label for="namesTxt">Student names</label><textarea id="namesTxt" rows="7" placeholder="Amira Khan&#10;Ben Thompson"></textarea>
    <label>Put them in these classes (optional)</label><div class="check-list">${mine.map(c => `<label class="check-row"><input type="checkbox" value="${c.id}" ${c.id === presetClass ? "checked" : ""}> ${E(c.name)}</label>`).join("") || `<span class="muted">No classes yet</span>`}</div>
    <div class="row-btns" style="margin-top:10px"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta" id="mkBtn">Create logins</button></div></form>`,
    (w, close) => w.querySelector("#namesForm").onsubmit = async e => { e.preventDefault();
      const names = w.querySelector("#namesTxt").value.split("\n").map(x => x.trim()).filter(Boolean).slice(0, 40), cids = [...w.querySelectorAll(".check-list input:checked")].map(i => i.value);
      if (!names.length) return BW.toast("Add at least one name");
      const btn = w.querySelector("#mkBtn"); btn.disabled = true; btn.textContent = `Creating 0 of ${names.length}…`;
      try { const res = await BW.db.createStudents({ names, classIds: cids }); close(); BW.invalidate("dir", "roster:", "tdash", "board:"); BW.render(); BW.showCredentials(res.students, cids.length === 1 ? BW.classById(cids[0]) : { name: BW.S.school?.name || "school" }); }
      catch (x) { btn.disabled = false; btn.textContent = "Create logins"; BW.toast(BW.errMsg(x)); } });
};
BW.showCredentials = (list, c) => {
  const ok = list.filter(x => x.username), bad = list.filter(x => x.error), text = ok.map(x => `${x.name}\t${x.username}\t${x.password}`).join("\n");
  BW.modal(`<h2>Student logins created</h2><p class="muted" style="margin:8px 0 12px"><b>Passwords are shown only once.</b> Print the login cards or download the file now.</p>
    <div class="table-wrap cred-table"><table class="dtable"><thead><tr><th>Name</th><th>Username</th><th>Password</th></tr></thead><tbody>${ok.map(x => `<tr><td>${E(x.name)}</td><td class="mono">${E(x.username)}</td><td class="mono">${E(x.password)}</td></tr>`).join("")}</tbody></table></div>
    ${bad.length ? `<p class="note err">Couldn't create: ${bad.map(x => E(x.name) + " (" + E(x.error) + ")").join(", ")}</p>` : ""}
    <p class="note">Students sign in with their username (no @) and password at ${E(location.origin + location.pathname)}</p>
    <div class="row-btns" style="margin-top:14px"><button class="cta ghost" id="cpAll">Copy all</button><button class="cta ghost" id="dlCsv">Download CSV</button><button class="cta ghost" id="prCards">Print login cards</button><button class="cta" data-close>Done</button></div>`,
    w => { w.querySelector("#cpAll").onclick = () => BW.copy(text);
      w.querySelector("#dlCsv").onclick = () => BW.csv(`${(c?.name || "school").replace(/[^\w-]+/g, "_")}_logins.csv`, [["Name", "Username", "Password"], ...ok.map(x => [x.name, x.username, x.password])]);
      w.querySelector("#prCards").onclick = () => BW.printCards(ok); });
};
BW.printCards = list => {
  const url = location.origin + location.pathname, win = window.open("", "_blank");
  if (!win) return BW.toast("Allow pop-ups to print login cards");
  win.document.write(`<!doctype html><title>Bitwise login cards</title><style>body{font-family:system-ui,sans-serif;margin:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .card{border:2px dashed #999;border-radius:12px;padding:14px;break-inside:avoid}.card b{font-size:18px}.row{margin-top:6px;font-size:14px}.mono{font-family:ui-monospace,Menlo,monospace;font-size:16px}
    @media print{button{display:none}}</style><button onclick="print()">Print</button><div class="grid">${list.map(x => `<div class="card"><b>${BW.esc(x.name)}</b><div class="row">Bitwise: ${BW.esc(url)}</div>
    <div class="row">Username: <span class="mono">${BW.esc(x.username)}</span></div><div class="row">Password: <span class="mono">${BW.esc(x.password)}</span></div></div>`).join("")}</div>`);
  win.document.close(); win.focus(); setTimeout(() => win.print(), 300);
};

/* ---------- teacher code panel (profile page) ---------- */
BW.schoolPanel = () => { const s = BW.S.school, admin = s.createdBy === BW.S.user.id;
  return `<section class="panel"><h3>${E(s.name)}</h3><p class="muted">Share this teacher code with colleagues so they join your school when they sign up.</p>
    <div class="joincode dark"><b class="mono">${E(s.teacherCode)}</b><button class="small-btn" data-copycode>Copy</button>${admin ? `<button class="link" data-rotatecode>New code</button>` : ""}</div></section>`; };
BW.bindSchoolPanel = root => {
  root.querySelector("[data-copycode]")?.addEventListener("click", () => BW.copy(BW.S.school.teacherCode));
  root.querySelector("[data-rotatecode]")?.addEventListener("click", () => BW.modal(`<h2>Make a new teacher code?</h2><p class="muted" style="margin:8px 0 18px">The old code stops working. Teachers already in your school stay.</p><div class="row-btns"><button class="cta ghost" data-close>Cancel</button><button class="cta" id="yesRot">New code</button></div>`,
    (w, close) => w.querySelector("#yesRot").onclick = async () => { try { await BW.db.rotateTeacherCode(); close(); BW.render(); } catch (x) { BW.toast(BW.errMsg(x)); } }));
};

/* ---------- notices: teachers post, students read in the message centre ---------- */
BW.composeNotice = presetClass => {
  const mine = BW.myClasses().filter(c => !c.archived);
  if (!mine.length) return BW.toast("Create a class first");
  BW.modal(`<h2>Send a notice</h2><p class="muted" style="margin:6px 0 12px">Students see it in Messages.</p>
    <form id="ntcForm" class="form"><label for="ntcTitle">Title</label><input id="ntcTitle" maxlength="120" required placeholder="e.g. Coding homework due Friday">
    <label for="ntcBody">Message</label><textarea id="ntcBody" rows="5" maxlength="4000" required></textarea>
    <label>Send to</label><div class="check-list">${mine.map(c => `<label class="check-row"><input type="checkbox" value="${c.id}" ${!presetClass || c.id === presetClass ? "checked" : ""}> ${E(c.name)}</label>`).join("")}</div>
    <label class="check-row"><input type="checkbox" id="ntcPin"> Pin to the top</label>
    <div class="row-btns" style="margin-top:10px"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta">Send notice</button></div></form>`,
    (w, close) => w.querySelector("#ntcForm").onsubmit = async e => { e.preventDefault(); const cids = [...w.querySelectorAll(".check-list input:checked")].map(i => i.value);
      if (!cids.length) return BW.toast("Pick at least one class");
      try { await BW.db.postNotice({ title: w.querySelector("#ntcTitle").value.trim(), body: w.querySelector("#ntcBody").value.trim(), classIds: cids, pinned: w.querySelector("#ntcPin").checked });
        close(); BW.toast(`Notice sent to ${cids.length} class${cids.length > 1 ? "es" : ""}`); BW.invalidate("notices:"); BW.render(); } catch (x) { BW.toast(BW.errMsg(x)); } });
};
BW.classNoticesTab = c => {
  const list = BW.fetchOnce("notices:" + c.id, () => BW.db.classNotices(c.id));
  const head = `<div class="row-btns" style="margin-bottom:14px"><button class="cta" data-act="compose">${BW.icon.mail.replace("<svg", '<svg width="20" height="20"')}Send a notice</button></div>`;
  if (list === undefined) return head + BW.loading;
  return head + (list?.length ? `<div class="notice-list">${list.map(n => `<article class="notice ${n.pinned ? "pinned" : ""}"><div class="n-top">${n.pinned ? `<span class="chip-s good">Pinned</span>` : ""}<b>${E(n.title)}</b><span class="muted">${BW.when(n.created_at)}</span></div><p>${E(n.body)}</p>
    <div class="act-btns"><button class="link" data-pinnotice="${n.id}|${n.pinned ? 0 : 1}">${n.pinned ? "Unpin" : "Pin"}</button><button class="link danger-t" data-delnotice="${n.id}">Delete</button></div></article>`).join("")}</div>`
    : `<div class="empty">No notices yet. Send one and it appears in your students' Messages.</div>`);
};
BW.noticeTeaser = () => { const n = (BW.S.notices || []).filter(x => !x.read), latest = n[0];
  return latest ? `<section class="panel notice-teaser" data-nav="messages" role="button" tabindex="0"><div class="sec-head" style="margin:0 0 6px"><h3 style="margin:0">${BW.icon.mail.replace("<svg", '<svg width="18" height="18"')} New message${n.length > 1 ? `s (${n.length})` : ""}</h3></div><b>${E(latest.title)}</b><p class="muted">${E(latest.author_name)} · ${E(latest.classes.join(", "))}</p></section>` : ""; };
BW.viewMessages = () => {
  const list = BW.S.notices || [], unread = list.filter(n => !n.read).length;
  return `<h1>Messages</h1><p class="muted" style="margin-top:6px">Notices from your teachers.${unread ? ` ${unread} unread.` : ""}</p>
  ${unread ? `<div class="row-btns" style="margin:14px 0"><button class="cta ghost small" data-act="readall">Mark all as read</button></div>` : ""}
  ${list.length ? `<div class="notice-list">${list.map(n => `<article class="notice ${n.read ? "" : "unread"} ${n.pinned ? "pinned" : ""}" data-notice="${n.id}" tabindex="0">
    <div class="n-top">${n.read ? "" : `<span class="dot-new" aria-label="Unread"></span>`}${n.pinned ? `<span class="chip-s good">Pinned</span>` : ""}<b>${E(n.title)}</b><span class="muted">${BW.when(n.created_at)}</span></div>
    <p class="muted n-from">From ${E(n.author_name)} · ${E(n.classes.join(", "))}</p><p class="n-body">${E(n.body)}</p>${n.redo ? `<button class="link" data-nav="tasks">Open task</button>` : ""}</article>`).join("")}</div>`
    : `<div class="empty">No messages yet. Notices from your teachers will appear here.</div>`}`;
};
BW.bindMessages = root => {
  const mark = async ids => { const todo = ids.filter(id => BW.S.notices.find(n => n.id === id && !n.read)); if (!todo.length) return;
    todo.forEach(id => BW.S.notices.find(n => n.id === id).read = true); BW.renderRail(); await Promise.all(todo.map(id => BW.db.markRead(id).catch(() => { }))); };
  root.querySelectorAll("[data-notice]").forEach(el => el.addEventListener("click", () => { mark([el.dataset.notice]); el.classList.remove("unread"); el.querySelector(".dot-new")?.remove(); }));
  root.querySelector("[data-act=readall]")?.addEventListener("click", async () => { await mark(BW.S.notices.map(n => n.id)); BW.render(); });
  // opening the message centre marks what's on screen as read after a moment
  setTimeout(() => BW.route.name === "messages" && mark(BW.S.notices.filter(n => !n.read).slice(0, 3).map(n => n.id)), 2500);
};

/* ---- src/app-board.js ---- */
/* Class leaderboards (week / all time) */
BW.boardTab = "week";
BW.sortBoard = (rows, kind) => rows.map(r => ({ ...r, score: kind === "week" ? +r.week_xp : +r.xp })).sort((a, b) => b.score - a.score || b.medals - a.medals || a.display_name.localeCompare(b.display_name));
BW.boardRows = (list, mini, start = 0) => list.map((p, i) => `<div class="row ${p.is_me ? "me-row" : ""}"><span class="rank">${start + i + 1}</span>${BW.avatarHTML("av-sm", p)}<span class="lb-name">${E(p.display_name)}${p.is_me ? " (you)" : ""}${mini ? "" : `<div class="lb-sub">Level ${BW.levelOf(p.xp).L} · ${p.medals} medals · ${p.streak}-day streak</div>`}</span><span class="lb-xp num">${p.score} XP</span></div>`).join("");
BW.boardHTML = (rows, c, teacher) => {
  const tabs = `<div class="tabs">${[["week", "This week"], ["all", "All time"]].map(([k, l]) => `<button class="tab ${BW.boardTab === k ? "on" : ""}" data-board="${k}">${l}</button>`).join("")}</div>`;
  if (!rows.length) return tabs + `<div class="empty">${!teacher && c && !c.show_leaderboard ? "Your teacher has hidden the leaderboard for this class." : "No students in this class yet."}</div>`;
  const list = BW.sortBoard(rows, BW.boardTab), top = list.slice(0, 3), order = [1, 0, 2].filter(i => top[i] && list.length >= 3);
  const me = list.findIndex(p => p.is_me);
  return tabs + (order.length ? `<div class="podium">${order.map(i => { const p = top[i]; return `<div class="pod p${i + 1}">${BW.avatarHTML("avatar", p)}<span class="place">${i + 1}</span><span class="nm">${E(p.display_name)}</span><span class="muted num">${p.score} XP</span></div>`; }).join("")}</div>` : "")
    + `<div class="lb-table">${BW.boardRows(order.length ? list.slice(3) : list, false, order.length ? 3 : 0)}</div>`
    + (me >= 0 ? `<p class="note">You're ${me + 1} of ${list.length}${BW.boardTab === "week" ? " this week. Weekly XP resets every Monday" : ""}.</p>` : "");
};
BW.viewBoard = () => {
  const cls = BW.myClasses().filter(c => !c.archived);
  if (!cls.length) return `<h1>Leaderboard</h1>${BW.isTeacher() ? `<div class="empty">Create a class to see its leaderboard.</div>` : BW.joinCard()}`;
  const cid = cls.some(c => c.id === BW.ui.boardClass) ? BW.ui.boardClass : cls[0].id, c = cls.find(x => x.id === cid);
  const rows = BW.fetchOnce("board:" + cid, () => BW.api.rpc("class_leaderboard", { p_class: cid }));
  return `<h1>Leaderboard</h1>
    ${cls.length > 1 ? `<div class="chips" style="margin-top:16px">${cls.map(x => `<button class="chip ${x.id === cid ? "on" : ""}" data-bclass="${x.id}">${E(x.name)}</button>`).join("")}</div>` : `<p class="note" style="margin-top:12px">${E(c.name)}</p>`}
    ${rows === undefined ? BW.loading : BW.boardHTML(rows || [], c, BW.isTeacher())}`;
};
BW.fillMiniBoard = async () => {
  const el = document.getElementById("miniBoard"), c = BW.myClasses().find(x => !x.archived); if (!el || !c) return;
  try {
    const key = "board:" + c.id;
    const rows = BW.cache[key]?.data || await BW.api.rpc("class_leaderboard", { p_class: c.id });
    BW.cache[key] = { data: rows };
    const el2 = document.getElementById("miniBoard"); if (!el2) return;
    el2.innerHTML = rows.length ? BW.boardRows(BW.sortBoard(rows, "week").slice(0, 5), true) : `<p class="muted">${c.show_leaderboard ? "No scores yet." : "Hidden by your teacher."}</p>`;
  } catch (e) { el.innerHTML = `<p class="muted">${E(BW.errMsg(e))}</p>`; }
};

/* ---- src/ide.js ---- */
/* Coding Lab: Python runner (Pyodide in a worker), challenge list and the in-browser IDE */
BW.py = {
  worker: null, ready: null, state: "idle", seq: 0, pending: {},
  start() {
    if (this.worker) return this.ready;
    this.state = "loading"; BW.ideStatus?.();
    this.worker = new Worker("py-worker.js?v=20260930194417");
    this.ready = new Promise((res, rej) => { this._res = res; this._rej = rej; });
    this.worker.onmessage = e => {
      const d = e.data;
      if (d.type === "ready") { this.state = "ready"; BW.ideStatus?.(); return this._res(); }
      if (d.type === "fatal") { this.state = "error"; BW.ideStatus?.(); return this._rej(new Error(d.error)); }
      const p = this.pending[d.id]; if (!p) return;
      delete this.pending[d.id]; clearTimeout(p.t); d.ok ? p.res(d.result) : p.rej(new Error(d.error));
    };
    this.worker.onerror = e => { this.state = "error"; BW.ideStatus?.(); this._rej(new Error(e.message || "Python failed to start")); };
    return this.ready;
  },
  kill() {
    this.worker?.terminate(); this.worker = null; this.state = "idle";
    Object.values(this.pending).forEach(p => { clearTimeout(p.t); p.rej(new Error("stopped")); }); this.pending = {};
  },
  async call(payload, timeoutMs = 5000) {
    await this.start();
    return new Promise((res, rej) => {
      const id = ++this.seq;
      const t = setTimeout(() => { delete this.pending[id]; this.kill(); this.start().catch(() => { }); rej(new Error("timeout")); }, timeoutMs);
      this.pending[id] = { res, rej, t };
      this.worker.postMessage({ id, payload });
    });
  }
};

BW.LEVEL_NAMES = ["", "Easy", "Medium", "Hard"];
BW.KIND = { debug: { label: "Debug", type: "Debugging challenge", note: "This code has bugs. Run it, read what goes wrong, then fix it. You don't need to start again." },
  fill: { label: "Finish the code", type: "Finish-the-code challenge", note: "Some of the code is written for you. Add the missing parts without deleting the lines you were given." } };
BW.codeBest = c => BW.S.best["code." + c.id];
BW.codeSolved = c => (BW.codeBest(c)?.pct || 0) >= 1;
BW.codeCover = (seed, w = 480, h = 320) => BW.cover("code" + seed, "#0B1220", "#1F9D62", "brackets", w, h);

/* ---------- Coding Lab overview ---------- */
BW.viewCodeLab = () => {
  const all = BW.CODE.all, solved = all.filter(BW.codeSolved).length;
  return `<div class="hero lab-hero" style="background-image:${BW.cover("codelab-hero", "#0B1220", "#22C55E", "brackets", 1400, 560)}">
    <div class="lab-hero-text"><h1>Coding Lab</h1>
      <div class="lab-prog"><div class="bar"><i style="width:${solved / all.length * 100}%"></i></div><span class="num">${solved} of ${all.length} solved</span></div></div></div>
  ${BW.CODE.sections.map(s => `<div class="sec-head"><h2>${E(s.title)}</h2><span class="muted num">${s.items.filter(BW.codeSolved).length}/${s.items.length} solved</span></div>
    <div class="row-cards">${s.items.map(c => { const b = BW.codeBest(c), st = BW.codeSolved(c) ? "Solved" : b ? `Best ${Math.round(b.pct * 100)}%` : "New";
      return `<article class="tile code-tile" data-code="${c.id}"><div class="thumb" style="background-image:${BW.codeCover(c.id)}"><span class="code-glyph mono">${E(c.title)}</span><span class="tag-int">${BW.LEVEL_NAMES[c.level]}</span></div>
        <div class="t-meta"><span class="chip-s ${BW.codeSolved(c) ? "good" : ""}">${st}</span>${c.kind ? `<span class="chip-s kind-${c.kind}">${BW.KIND[c.kind].label}</span>` : ""}${c.req.length ? `<span>${c.req.length} rule${c.req.length > 1 ? "s" : ""}</span>` : ""}<span>${c.tests.length} test${c.tests.length === 1 ? "" : "s"}</span></div>
        <div class="t-foot"><span class="lvl-dots" aria-label="${BW.LEVEL_NAMES[c.level]}">${[1, 2, 3].map(i => `<i class="${i <= c.level ? "on" : ""}"></i>`).join("")}</span><button class="go-dark" data-code="${c.id}" aria-label="Open ${E(c.title)}">${I.arrow}</button></div></article>`; }).join("")}</div>`).join("")}`;
};

/* ---------- IDE ---------- */
BW.specText = t => {
  if (t.call) return `${t.call} → ${t.ret}`;
  const o = t.o || {}, bits = [];
  if (o.lines) bits.push(o.lines.join("\n"));
  if (o.nums) bits.push((o.mode === "subseq" ? "Includes " : "Ends with ") + o.nums.join(", "));
  if (o.has) bits.push("Includes “" + o.has.join("”, then “") + "”");
  if (o.words) bits.push("Includes " + o.words.map(w => `“${w}”`).join(", "));
  if (o.not) bits.push("Not " + o.not.map(w => `“${w}”`).join(" or "));
  if (o.compact) bits.push(`Shows “${o.compact}”`);
  if (o.used) bits.push(`Asks for input ${o.used} time${o.used > 1 ? "s" : ""}`);
  if (o.regex_msg) bits.push(o.regex_msg);
  return bits.join(" · ") || "Runs without errors";
};
BW.viewCode = ({ cid }) => {
  const c = BW.findChallenge(cid); if (!c) return `<div class="empty">That challenge doesn't exist.</div>`;
  const b = BW.codeBest(c), shown = c.tests.filter(t => !t.h), hidden = c.tests.length - shown.length;
  return `<div class="ide">
  <div class="ide-top"><button class="hdr-btn" data-back aria-label="Back">${I.back}</button>
    <div class="ide-title"><small class="muted">${E(c.section.title)} · ${BW.LEVEL_NAMES[c.level]}</small><h1>${E(c.title)}</h1></div>
    <span class="py-status" id="pyStatus"></span>
    <div class="ide-actions"><button class="cta ghost small" id="runBtn" title="Run (Ctrl/⌘ + Enter)">▶ Run</button><button class="cta small" id="submitBtn" title="Check with all tests (Ctrl/⌘ + Shift + Enter)">Check my code</button></div></div>
  <div class="ide-grid">
    <aside class="ide-brief panel">
      ${c.kind ? `<p class="kind-note kind-${c.kind}"><b>${BW.KIND[c.kind].label}.</b> ${BW.KIND[c.kind].note}</p>` : ""}
      <p class="brief">${BW.fmt(c.brief)}</p>
      ${c.req.length ? `<h3>Rules</h3><ul class="rules">${c.req.map(r => `<li>${E(BW.reqLabel(r))}</li>`).join("")}</ul>` : ""}
      <h3>Examples</h3>
      ${shown.map(t => `<div class="example">${t.i?.length ? `<div><small class="k">Input</small><pre>${E(t.i.join("\n"))}</pre></div>` : ""}${t.files ? `<div><small class="k">File ${E(Object.keys(t.files)[0])}</small><pre>${E(Object.values(t.files)[0])}</pre></div>` : ""}<div><small class="k">${t.call ? "Call" : "Output check"}</small><pre>${E(BW.specText(t))}</pre></div></div>`).join("")}
      ${hidden ? `<p class="note">Plus ${hidden} hidden test${hidden > 1 ? "s" : ""} with different inputs, so hard-coding answers won't work.</p>` : ""}
      <h3>Hints</h3><div id="hints"></div><button class="link" id="hintBtn">Show a hint</button>
      <p class="note" id="bestNote">${BW.bestNote(c)}</p>
      ${BW.isTeacher() ? `<button class="cta ghost small" id="solBtn" style="margin-top:8px">Show model solution</button>` : ""}
    </aside>
    <section class="ide-main">
      <div class="editor-wrap"><div class="editor-bar"><span class="mono">main.py</span><span class="spacer"></span><button class="link" id="resetBtn">Reset code</button></div><div id="editor"></div></div>
      <div class="ide-out panel">
        <div class="tabs slim"><button class="tab on" data-otab="console">Console</button><button class="tab" data-otab="tests">Tests <span id="testSum"></span></button><span class="spacer"></span><button class="link" id="clearBtn">Clear</button></div>
        <div id="consolePane"><pre class="console" id="console" aria-live="polite"></pre><form class="con-in" id="conForm" hidden><input id="conIn" autocomplete="off" aria-label="Type input for your program"><button class="small-btn">Enter</button></form></div>
        <div id="testsPane" hidden><div id="tests" class="tests"><p class="muted">Press <b>Check my code</b> to run every test, including the hidden ones.</p></div></div>
      </div>
    </section>
  </div></div>`;
};
BW.bestNote = c => { const b = BW.codeBest(c); return b ? `Your best: ${Math.round(b.pct * 100)}% · ${b.tries} submission${b.tries > 1 ? "s" : ""}` : "Not submitted yet"; };
BW.reqLabel = r => r.startsWith("keep:") ? `Keep the given line: ${r.slice(5).trim()}` : r.startsWith("recursive:") ? `${r.slice(10)}() must call itself (recursion)` : r.startsWith("def:") ? `Define a function called ${r.slice(4)}` : r.startsWith("no:") ? `Don't use ${r.slice(3)}()` : ({ loop: "Use a loop", for: "Use a for loop", while: "Use a while loop", if: "Use selection (if)", def: "Define a function", return: "Return a value", list: "Use a list", file: "Open a file" })[r] || r;

BW.ideStatus = () => { const el = document.getElementById("pyStatus"); if (!el) return;
  el.className = "py-status " + BW.py.state;
  el.textContent = { idle: "Python idle", loading: "Starting Python…", ready: "Python ready", error: "Python couldn't start" }[BW.py.state]; };

BW.bindCode = (root, { cid, a }) => {
  const c = BW.findChallenge(cid); if (!c) return;
  const key = "code." + c.id;
  let ide = BW.ide;
  if (!ide || ide.cid !== c.id) {
    let draft = null; try { draft = localStorage.getItem("bitwise.draft." + c.id); } catch (e) { }
    ide = BW.ide = { cid: c.id, code: draft || c.starter, inputs: [], runs: 0, hint: 0, clock: new BW.Clock(), assignment: a || null, results: null };
    ide.attemptP = BW.api.rpc("start_attempt", { p_quiz_id: key, p_assignment: ide.assignment }).catch(() => null);
  }
  BW.clocks.add(ide.clock); ide.clock.resume();
  const $ = id => root.querySelector("#" + id), con = $("console");
  BW.ideStatus(); BW.py.start().catch(() => { });

  /* editor */
  let cm = null;
  if (window.CodeMirror) {
    cm = CodeMirror($("editor"), { value: ide.code, mode: "python", theme: "bitwise", lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: false,
      matchBrackets: true, autoCloseBrackets: true, viewportMargin: Infinity, lineWrapping: false,
      extraKeys: { Tab: cm => cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("    ", "end"), "Shift-Tab": cm => cm.indentSelection("subtract"),
        "Ctrl-Enter": () => run(), "Cmd-Enter": () => run(), "Shift-Ctrl-Enter": () => submit(), "Shift-Cmd-Enter": () => submit() } });
    cm.on("change", () => { ide.code = cm.getValue(); saveDraft(); clearErr(); });
  } else {
    $("editor").innerHTML = `<textarea id="plainEd" class="plain-editor" spellcheck="false" aria-label="Python code">${E(ide.code)}</textarea>`;
    $("plainEd").oninput = e => { ide.code = e.target.value; saveDraft(); };
  }
  let draftT = null;
  const saveDraft = () => { clearTimeout(draftT); draftT = setTimeout(() => { try { localStorage.setItem("bitwise.draft." + c.id, ide.code); } catch (e) { } }, 400); };
  let errLine = null;
  const clearErr = () => { if (cm && errLine != null) { cm.removeLineClass(errLine, "background", "cm-errline"); errLine = null; } };
  const markErr = line => { if (cm && line) { clearErr(); errLine = line - 1; cm.addLineClass(errLine, "background", "cm-errline"); cm.scrollIntoView({ line: errLine, ch: 0 }, 80); } };

  /* console */
  const showTab = t => { root.querySelectorAll("[data-otab]").forEach(b => b.classList.toggle("on", b.dataset.otab === t)); $("consolePane").hidden = t !== "console"; $("testsPane").hidden = t !== "tests"; };
  root.querySelectorAll("[data-otab]").forEach(b => b.onclick = () => showTab(b.dataset.otab));
  const write = (text, cls) => { const s = document.createElement("span"); if (cls) s.className = cls; s.textContent = text; con.appendChild(s); con.scrollTop = con.scrollHeight; };
  const errorText = e => `\n${e.type}${e.line ? ` on line ${e.line}` : ""}: ${e.msg}\n${e.hint ? "Tip: " + e.hint + "\n" : ""}`;
  $("clearBtn").onclick = () => { con.textContent = ""; };
  const busy = on => { $("runBtn").disabled = on; $("submitBtn").disabled = on; };

  const exec = async () => {
    busy(true); $("conForm").hidden = true;
    const files = c.tests.find(t => t.files)?.files;
    try {
      const r = await BW.py.call({ op: "run", code: ide.code, inputs: ide.inputs, seed: ide.seed, files }, 6000);
      con.textContent = ""; write(r.transcript);
      if (r.error) { write(errorText(r.error), "con-err"); markErr(r.error.line); }
      else if (r.need_input) { $("conForm").hidden = false; $("conIn").value = ""; $("conIn").focus(); }
      else write("\n— Program finished —\n", "con-done");
    } catch (e) {
      write(e.message === "timeout" ? "\n\nStopped: your program ran for more than 6 seconds. Is there a loop that never ends?\n" : `\n\n${e.message}\n`, "con-err");
    }
    busy(false);
  };
  const run = () => { ide.runs++; ide.inputs = []; ide.seed = Math.floor(Math.random() * 1e6); showTab("console"); con.textContent = ""; write("Running…\n", "con-done"); exec(); BW.sfx.play("click"); };
  $("conForm").onsubmit = e => { e.preventDefault(); ide.inputs.push($("conIn").value); exec(); };
  $("runBtn").onclick = run;

  /* tests */
  const renderTests = () => {
    const R = ide.results; if (!R) return;
    const pass = R.tests.filter(t => t.pass).length + R.req.filter(q => q.ok).length, total = R.tests.length + R.req.length;
    $("testSum").textContent = `${pass}/${total}`; $("testSum").className = pass === total ? "ok" : "";
    $("tests").innerHTML = `<div class="test-score ${pass === total ? "all" : ""}"><b class="num">${pass}/${total}</b> checks passed${R.saved === "saving" ? ` · <span class="saving-inline"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span> Saving…</span>` : R.saved ? ` · <span class="${R.saved.startsWith("Not saved") ? "err-t" : ""}">${E(R.saved)}</span>` : ""}</div>` +
      R.tests.map((r, i) => { const t = c.tests[i];
        return `<div class="test ${r.pass ? "pass" : "fail"}"><span class="tick ${r.pass ? "done" : "no"}">${r.pass ? I.check : I.cross}</span><div class="tt"><b>${t.h ? `Hidden test ${i + 1}` : `Test ${i + 1}`}${t.call ? ` · <code>${E(t.call)}</code>` : ""}</b>
          ${!t.h && t.i?.length ? `<small class="muted">Input: ${E(t.i.join(", "))}</small>` : ""}
          ${r.pass ? "" : `<p class="why">${E(t.h && !r.error ? "Your program gave the wrong result for a hidden input. Think about edge cases (zero, negatives, boundaries)." : r.reason)}</p>`}
          ${!r.pass && !t.h && r.stdout ? `<details><summary>Your output</summary><pre>${E(r.stdout)}</pre></details>` : ""}</div></div>`; }).join("") +
      R.req.map(q => `<div class="test ${q.ok ? "pass" : "fail"}"><span class="tick ${q.ok ? "done" : "no"}">${q.ok ? I.check : I.cross}</span><div class="tt"><b>Rule: ${E(q.label)}</b></div></div>`).join("");
  };
  const submit = async () => {
    busy(true); showTab("tests"); $("tests").innerHTML = `<p class="muted">Running ${c.tests.length} tests…</p>`;
    const tests = [];
    for (let i = 0; i < c.tests.length; i++) {
      $("tests").innerHTML = `<p class="muted">Running test ${i + 1} of ${c.tests.length}…</p>`;
      try { tests.push(await BW.py.call({ op: "test", code: ide.code, test: c.tests[i] }, 4000)); }
      catch (e) { tests.push({ pass: false, reason: e.message === "timeout" ? "Timed out after 4 seconds. Is there a loop that never ends?" : e.message }); }
    }
    let req = [];
    try { req = c.req.length ? await BW.py.call({ op: "requires", code: ide.code, requires: c.req }, 4000) : []; } catch (e) { req = c.req.map(r => ({ label: BW.reqLabel(r), ok: false })); }
    const firstErr = tests.find(t => t.error?.line); if (firstErr) markErr(firstErr.error.line);
    ide.results = { tests, req };
    const passed = tests.filter(t => t.pass).length + req.filter(q => q.ok).length, total = tests.length + req.length, all = passed === total;
    renderTests(); BW.sfx.play(all ? "win" : "wrong"); if (all) BW.confetti();
    /* save in the background: the results are already on screen and the buttons work again straight away */
    busy(false);
    const R = ide.results, attemptP = ide.attemptP, tries = (BW.S.best[key]?.tries || 0) + 1, oldLevel = BW.levelOf(BW.S.profile.xp).L;
    ide.attemptP = BW.api.rpc("start_attempt", { p_quiz_id: key, p_assignment: ide.assignment }).catch(() => null);   // ready for the next check
    R.saved = "saving"; renderTests();
    try {
      const id = await attemptP; if (!id) throw new Error("not_saved");
      const res = await BW.api.rpc("finish_attempt", { p_attempt: id, p_total: total, p_correct: passed, p_max_combo: 0, p_active_ms: ide.clock.ms(),
        p_answers: [{ seq: 1, code: "", type: "code", key: "c:" + c.id, text: c.title, topic: "Coding Lab · " + c.section.title, answer: ide.code.slice(0, 20000),
          correct: "Passes all tests", ok: all, try: tries, ms: ide.clock.ms(),
          detail: { tests: tests.map((t, i) => ({ n: i + 1, hidden: !!c.tests[i].h, pass: t.pass, reason: (t.reason || "").slice(0, 200) })), req, runs: ide.runs } }] });
      BW.applyResult(res, key); BW.S.best[key].tries = tries;
      const bn = document.getElementById("bestNote"); if (bn) bn.textContent = BW.bestNote(c);
      R.saved = res.xp_gain ? `Saved · +${res.xp_gain} XP` : all ? "Saved (beat your best score to earn more XP)" : "Saved";
      (res.badges || []).forEach(k => BW.BADGES[k] && setTimeout(() => BW.toast(`Badge unlocked: ${BW.BADGES[k][0]}`), 700));
      BW.afterWork();
      BW.invalidate("board:");
      if (BW.levelOf(BW.S.profile.xp).L > oldLevel) BW.modal(`<div class="levelup"><div class="ring big" style="--p:100"><i>${BW.levelOf(BW.S.profile.xp).L}</i></div><h2>Level up!</h2><button class="cta" data-close>Keep coding</button></div>`);
    } catch (e) { R.saved = "Not saved: " + BW.errMsg(e); }
    if (ide.results === R && BW.ide === ide && BW.route.name === "code" && $("tests")) renderTests();
  };
  $("submitBtn").onclick = submit;

  /* hints, reset, solution */
  const renderHints = () => { $("hints").innerHTML = c.hints.slice(0, ide.hint).map((h, i) => `<p class="hint"><b>Hint ${i + 1}.</b> ${BW.fmt(h)}</p>`).join(""); $("hintBtn").hidden = ide.hint >= c.hints.length; };
  $("hintBtn").onclick = () => { ide.hint++; renderHints(); };
  renderHints();
  $("resetBtn").onclick = () => BW.modal(`<h2>Reset your code?</h2><p class="muted" style="margin:8px 0 18px">This replaces your code with the starting code.</p><div class="row-btns"><button class="cta ghost" data-close>Cancel</button><button class="cta danger" id="yesReset">Reset</button></div>`,
    (w, close) => w.querySelector("#yesReset").onclick = () => { ide.code = c.starter; cm ? cm.setValue(c.starter) : ($("plainEd").value = c.starter); saveDraft(); close(); });
  $("solBtn")?.addEventListener("click", async () => {
    let sol; try { sol = await BW.db.codeSolution(c.id) || "Not available"; } catch (e) { sol = BW.errMsg(e); }
    BW.modal(`<h2>Model solution</h2><p class="muted" style="margin:6px 0 12px">One correct approach. Other correct approaches also pass.</p><pre class="codeview">${E(sol)}</pre><button class="cta" data-close style="margin-top:14px">Close</button>`);
  });
  if (ide.results) { showTab("tests"); renderTests(); }
  setTimeout(() => cm?.refresh(), 0);
};
BW.leaveCode = () => { if (BW.ide) { BW.ide.clock.pause(); BW.clocks.delete(BW.ide.clock); } };

/* ---- src/app-auth.js ---- */
/* Sign in, sign up (student / teacher joining a school / teacher creating a school), password reset */
BW.ui.authMode = "signin";
BW.viewAuth = () => {
  const m = BW.ui.authMode, role = BW.ui.signupRole || "student", tmode = BW.ui.teacherMode || "join";
  let form = "";
  if (m === "signin") form = `<h2>Welcome back</h2><p class="muted">Use your email or school username.</p>
    <form id="authForm" class="form"><label for="siId">Email or username</label><input id="siId" autocomplete="username" required>
    <label for="siPw">Password</label><input id="siPw" type="password" autocomplete="current-password" required>
    <button class="cta">Sign in</button></form>
    <div class="auth-links"><button class="link" data-auth="forgot">Forgot password?</button><span>New here? <button class="link" data-auth="signup">Create an account</button></span></div>`;
  if (m === "signup") form = `<h2>Create your account</h2>
    <div class="seg" role="radiogroup" aria-label="Account type"><button type="button" class="${role === "student" ? "on" : ""}" data-role="student" role="radio" aria-checked="${role === "student"}">I'm a student</button><button type="button" class="${role === "teacher" ? "on" : ""}" data-role="teacher" role="radio" aria-checked="${role === "teacher"}">I'm a teacher</button></div>
    ${role === "teacher" ? `<div class="seg small" role="radiogroup" aria-label="School"><button type="button" class="${tmode === "join" ? "on" : ""}" data-tmode="join">Join my school</button><button type="button" class="${tmode === "create" ? "on" : ""}" data-tmode="create">Set up a new school</button></div>` : ""}
    <form id="authForm" class="form"><label for="suName">${role === "teacher" ? "Name students will see (e.g. Ms Patel)" : "Your name (first name and initial is fine)"}</label><input id="suName" maxlength="40" autocomplete="name" required>
    <label for="suEmail">Email</label><input id="suEmail" type="email" autocomplete="email" required>
    <label for="suPw">Password</label><input id="suPw" type="password" minlength="8" autocomplete="new-password" placeholder="At least 8 characters" required>
    ${role === "teacher" && tmode === "join" ? `<label for="suCode">Teacher code</label><input id="suCode" autocomplete="off" placeholder="From a colleague already on Bitwise, e.g. ABCDE-FGHJK" required>` : ""}
    ${role === "teacher" && tmode === "create" ? `<label for="suSchool">School name</label><input id="suSchool" maxlength="80" placeholder="e.g. Kingsbridge Academy" required><p class="note">You'll get a teacher code to share with colleagues.</p>` : ""}
    <p class="note">We store your name, email and progress. You can delete your account at any time from your profile.</p>
    <button class="cta">Create account</button></form>
    <div class="auth-links"><span>Already have an account? <button class="link" data-auth="signin">Sign in</button></span></div>
    ${role === "student" ? `<p class="note">Have a school username? Sign in with it instead.</p>` : ""}`;
  if (m === "forgot") form = `<h2>Reset your password</h2><p class="muted">We'll email you a link. For a school username, ask your teacher.</p>
    <form id="authForm" class="form"><label for="fgEmail">Email</label><input id="fgEmail" type="email" autocomplete="email" required><button class="cta">Send reset link</button></form>
    <div class="auth-links"><button class="link" data-auth="signin">Back to sign in</button></div>`;
  if (m === "check") form = `<h2>Check your inbox</h2><p class="muted">If there's an account for <b>${E(BW.ui.authEmail || "that email")}</b>, a reset link is on its way. Follow it, then come back and sign in.</p><div class="auth-links"><button class="link" data-auth="signin">Back to sign in</button></div>`;
  return `<div class="auth">
    <section class="auth-art" style="background-image:${BW.cover("auth-hero", "#2F9BB3", "#F0A35E", "bits", 900, 1100)}">
      <div class="logo big" aria-hidden="true">01</div>
      <div><h1>Master computer science, one bit at a time.</h1></div>
    </section>
    <section class="auth-card"><div class="auth-brand"><b>Bitwise</b></div>${form}<p class="auth-err" id="authErr" role="alert"></p></section>
  </div>`;
};
BW.bindAuth = root => {
  const err = t => { root.querySelector("#authErr").textContent = t || ""; };
  root.querySelectorAll("[data-auth]").forEach(b => b.onclick = () => { BW.ui.authMode = b.dataset.auth; BW.render(); });
  root.querySelectorAll("[data-role]").forEach(b => b.onclick = () => { BW.ui.signupRole = b.dataset.role; BW.render(); });
  root.querySelectorAll("[data-tmode]").forEach(b => b.onclick = () => { BW.ui.teacherMode = b.dataset.tmode; BW.render(); });
  const f = root.querySelector("#authForm"); if (!f) return;
  const v = id => root.querySelector("#" + id)?.value.trim() || "";
  f.onsubmit = async e => {
    e.preventDefault(); err("");
    const btn = f.querySelector("button.cta"), label = btn.textContent; btn.disabled = true; btn.textContent = "Please wait…";
    const m = BW.ui.authMode;
    try {
      if (m === "signin") await BW.api.signIn(v("siId"), root.querySelector("#siPw").value);
      else if (m === "signup") {
        const role = BW.ui.signupRole || "student", create = role === "teacher" && (BW.ui.teacherMode || "join") === "create";
        BW.ui.signingUp = true;
        await BW.api.signUp({ email: v("suEmail"), password: root.querySelector("#suPw").value, name: v("suName"), role,
          teacherCode: role === "teacher" && !create ? v("suCode") : "", schoolName: create ? v("suSchool") : "" });
        BW.ui.signingUp = false; BW.enter(BW.auth.currentUser, true);
      } else if (m === "forgot") {
        await BW.api.resetEmail(v("fgEmail")).catch(x => { if (x.code !== "auth/user-not-found") throw x; });
        BW.ui.authEmail = v("fgEmail"); BW.ui.authMode = "check"; BW.render();
      }
    } catch (x) { BW.ui.signingUp = false; err(BW.errMsg(x)); btn.disabled = false; btn.textContent = label; }
  };
  root.querySelector("#siId, #suName, #fgEmail")?.focus();
};

/* ---- src/app-main.js ---- */
/* Router, navigation rail, global events, theme, boot */
Object.assign(BW.icon, {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  tasks: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="4"/><path d="m8 9 1.5 1.5L12 8M8 15l1.5 1.5L12 14M14.5 9.5H16M14.5 15.5H16"/></svg>',
  topics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="7" cy="7" r="2.6"/><circle cx="17" cy="7" r="2.6"/><circle cx="7" cy="17" r="2.6"/><circle cx="17" cy="17" r="2.6"/></svg>',
  board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21V11H3v10zM15 21V4h-5v17zM21 21v-7h-5v7z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  classes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0M16 4.5a3.2 3.2 0 0 1 0 6.4M18 14a6 6 0 0 1 3 6"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4.5l2 2.5H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 10h18"/></svg>',
  school: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5M10 11h4"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14"/></svg>',
  soundOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>'
});

BW.route = { name: "auth", params: {} };
BW.stack = [];
const TOP = ["home", "topics", "board", "tasks", "profile", "codelab", "library", "directory", "messages"], PLAY = ["quiz", "results"];

BW.go = (name, params = {}) => {
  const prev = BW.route;
  BW.dropFailed();
  if (prev.name === "code" && name !== "code") BW.leaveCode();
  if (TOP.includes(name)) BW.stack = [];
  else if (!PLAY.includes(prev.name) && !PLAY.includes(name) && prev.name !== name && prev.name !== "auth") BW.stack.push(prev);
  else if (PLAY.includes(prev.name) && !PLAY.includes(name)) BW.stack = BW.stack.filter(r => r.name !== name);
  if (name === "sub" && !PLAY.includes(prev.name) && (prev.name !== "sub" || prev.params.sid !== params.sid)) { BW.ui.open = null; BW.ui.subTab = "quiz"; }
  if (name === "class" && prev.params?.cid !== params.cid) BW.ui.classTab = "progress";
  BW.route = { name, params };
  BW.render();
  if (name !== prev.name || name === "quiz") window.scrollTo({ top: 0 });
  if (name === "codelab") (window.requestIdleCallback || setTimeout)(() => BW.py.start().catch(() => { }));   // Python is ready by the time a challenge opens
  if (["home", "tasks", "messages"].includes(name)) BW.refreshStudent?.().then(changed => { if (changed && BW.route.name === name) BW.render(); }).catch(() => { });
};
BW.back = () => { BW.route = BW.stack.pop() || { name: "home", params: {} }; BW.render(); window.scrollTo({ top: 0 }); };

BW.renderRail = () => {
  const rail = document.getElementById("rail"), I = BW.icon;
  if (!BW.S.profile) { rail.hidden = true; return; }
  rail.hidden = false;
  const t = BW.isTeacher(), due = BW.S.tasks.filter(x => !x.completed_at).length;
  const unread = (BW.S.notices || []).filter(n => !n.read).length;
  const items = t ? [["home", "Classes", I.classes], ["directory", "School directory", I.school], ["library", "Task Library", I.folder], ["codelab", "Coding Lab", I.code], ["board", "Leaderboard", I.board], ["profile", "Profile", I.user]]
    : [["home", "Home", I.home], ["tasks", "Tasks", I.tasks], ["messages", "Messages", I.mail], ["topics", "Topics", I.topics], ["codelab", "Coding Lab", I.code], ["board", "Leaderboard", I.board], ["profile", "Profile", I.user]];
  const nav = { home: "home", unit: "home", class: "home", assignment: "home", student: "home", library: "library", directory: "directory", messages: "messages", codelab: "codelab", code: "codelab", topics: "topics", sub: "topics", board: "board", tasks: "tasks", profile: "profile" }[BW.route.name];
  rail.innerHTML = `<div class="logo" aria-hidden="true">01</div>${items.map(([k, l, ic]) => `<button class="nav-btn ${nav === k ? "on" : ""}" data-nav="${k}" aria-label="${l}"${nav === k ? ' aria-current="page"' : ""}>${ic}${k === "tasks" && due ? `<span class="nav-dot num">${due}</span>` : k === "messages" && unread ? `<span class="nav-dot num">${unread}</span>` : ""}<span class="tip">${l}</span></button>`).join("")}
    <div class="spacer"></div><button class="nav-btn desk" data-act="sound" aria-label="Sound effects ${BW.sfx.muted ? "off" : "on"}">${BW.sfx.muted ? I.soundOff : I.soundOn}<span class="tip">Sound ${BW.sfx.muted ? "off" : "on"}</span></button>
    <button class="nav-btn desk" data-act="theme" aria-label="Switch light or dark">${BW.isDark() ? I.sun : I.moon}<span class="tip">Light / dark</span></button>`;
};

BW.render = () => {
  window.BW_BOOTED = true;
  if (!BW.S.profile && BW.route.name !== "auth") BW.route = { name: "auth", params: {} };
  const { name, params } = BW.route, v = document.getElementById("view"), side = document.getElementById("side"), shell = document.getElementById("shell");
  const teacher = BW.isTeacher();
  const views = { auth: BW.viewAuth, home: teacher ? BW.viewTeach : BW.viewHome, topics: BW.viewTopics, unit: BW.viewUnit, sub: BW.viewSub, quiz: BW.viewQuiz, results: BW.viewResults,
    board: BW.viewBoard, tasks: BW.viewTasks, profile: BW.viewProfile, class: BW.viewClass, assignment: BW.viewAssignment, student: BW.viewStudent, codelab: BW.viewCodeLab, code: BW.viewCode, library: BW.viewLibrary, directory: BW.viewDirectory, messages: BW.viewMessages };
  try { v.innerHTML = (views[name] || BW.viewHome)(params); }
  catch (e) { console.error(e); v.innerHTML = `<div class="empty">Something went wrong showing this page. <button class="link" data-nav="home">Go home</button></div>`; }
  const withSide = name === "home" && !teacher;
  side.hidden = !withSide; shell.classList.toggle("has-side", withSide); shell.classList.toggle("is-auth", name === "auth");
  if (withSide) { side.innerHTML = BW.viewSide(); BW.fillMiniBoard(); }
  BW.renderRail();
  ({ auth: BW.bindAuth, quiz: BW.bindQuiz, results: BW.bindResults, profile: BW.bindProfile, class: BW.bindClass, assignment: BW.bindAssignment, student: BW.bindStudent, code: BW.bindCode, library: BW.bindLibrary, directory: BW.bindDirectory, messages: BW.bindMessages, home: teacher ? BW.bindTeach : null })[name]?.(v, params);
  const s = document.getElementById("search");
  if (s) { s.oninput = () => { BW.ui.search = s.value; if (name === "home") document.getElementById("hits").innerHTML = BW.hitsHTML(BW.searchHits(s.value)); else { BW.render(); const n = document.getElementById("search"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); } };
    document.getElementById("searchForm").onsubmit = e => { e.preventDefault(); const h = BW.searchHits(s.value)[0]; if (h) BW.go("sub", { uid: h.u.id, sid: h.s.id }); }; }
  document.querySelectorAll("#joinForm").forEach(f => f.onsubmit = async e => { e.preventDefault(); const code = f.querySelector("input").value.trim(); if (!code) return;
    try { const r = await BW.api.rpc("join_class", { p_code: code }); await BW.loadAll(); BW.invalidate("board:"); BW.toast(`You joined ${r.name}`); BW.sfx.play("win"); BW.render(); } catch (x) { BW.toast(BW.errMsg(x)); } });
  document.title = name === "auth" ? "Bitwise" : `Bitwise · ${({ home: teacher ? "Classes" : "Home", topics: "Topics", board: "Leaderboard", tasks: "Tasks", profile: "Profile", quiz: BW.Q?.title, results: "Results", class: BW.classById(params.cid)?.name, unit: BW.findUnit(params.uid)?.title, sub: BW.findSub(params.uid, params.sid)?.s?.title, assignment: "Task report", codelab: "Coding Lab", library: "Task Library", directory: "School directory", messages: "Messages", code: BW.findChallenge(params.cid)?.title, student: "Student" })[name] || ""}`;
};

BW.toast = msg => { document.querySelector(".toast")?.remove(); const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; t.setAttribute("role", "status"); document.body.appendChild(t); setTimeout(() => t.remove(), 2600); };

document.addEventListener("click", e => {
  const t = e.target.closest("[data-fav],[data-nav],[data-back],[data-start],[data-quick],[data-boss],[data-task],[data-leave],[data-chip],[data-tab],[data-open],[data-bclass],[data-board],[data-class],[data-sub],[data-unit],[data-code],[data-assignhit],[data-student],[data-taskitem],[data-libreveal],.rail [data-act]");
  if (!t || t.closest(".modal-wrap") || (BW.route.name === "class" && t.matches("[data-board]"))) return;
  const d = t.dataset;
  if (d.fav) { e.stopPropagation(); const on = BW.toggleFav(d.fav); BW.toast(on ? "Saved" : "Removed from saved"); return BW.render(); }
  if (d.act === "sound") { BW.sfx.toggle(); BW.sfx.play("click"); return BW.renderRail(); }
  if (d.act === "theme") { BW.toggleTheme(); return BW.renderRail(); }
  if (d.nav) return BW.go(d.nav);
  if (t.hasAttribute("data-back")) return BW.back();
  if (d.start) { const [uid, sid, li] = d.start.split("/"); return BW.startSub(uid, sid, +li); }
  if (d.quick) return BW.startQuick(d.quick);
  if (d.boss) return BW.startBoss(d.boss);
  if (d.task) { const task = BW.S.tasks.find(x => x.id === d.task); if (!task) return; const it = task.items.find(x => !x.completed_at) || task.items[0]; return BW.startById(it.quiz_id, task.id); }
  if (d.taskitem) { const [tid, q] = d.taskitem.split("|"); return BW.startById(q, tid); }
  if (d.libreveal) return BW.libReveal(d.libreveal);
  if (d.leave) { const c = BW.classById(d.leave); return BW.modal(`<h2>Leave ${E(c.name)}?</h2><p class="muted" style="margin:8px 0 18px">You'll stop seeing its tasks and leaderboard. You can rejoin with the code.</p><div class="row-btns"><button class="cta ghost" data-close>Stay</button><button class="cta danger" id="yesLeave">Leave class</button></div>`,
    (w, close) => w.querySelector("#yesLeave").onclick = async () => { try { await BW.db.leaveClass(c.id); } catch (x) { close(); return BW.toast(BW.errMsg(x)); } close(); await BW.loadAll(); BW.invalidate("board:"); BW.render(); }); }
  if (d.chip) { BW.ui.chip = d.chip; return BW.render(); }
  if (d.tab) { BW.ui.subTab = d.tab; return BW.render(); }
  if (d.open) { BW.ui.open = +d.open; return BW.render(); }
  if (d.bclass) { BW.ui.boardClass = d.bclass; return BW.render(); }
  if (d.board) { BW.boardTab = d.board; return BW.render(); }
  if (d.class) return BW.go("class", { cid: d.class });
  if (d.code) return BW.go("code", { cid: d.code });
  if (d.assignhit) { const [kind, ...key] = d.assignhit.split(":"); return BW.assignHit(kind, key.join(":")); }
  if (d.student) return BW.go("student", { sid: d.student, cid: BW.route.params?.cid });
  if (d.sub) { const [uid, sid] = d.sub.split("/"); return BW.go("sub", { uid, sid }); }
  if (d.unit) return BW.go("unit", { uid: d.unit });
});
document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches?.("article.tile,article.ucard,article.class-card,section.notice-teaser,article.notice")) e.target.click(); });

/* theme: follows the system until the person picks one */
BW.isDark = () => { const t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
BW.toggleTheme = () => { const next = BW.isDark() ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next); BW.pref("theme", next); };
{ const t = BW.pref("theme"); if (t) document.documentElement.setAttribute("data-theme", t); }

/* ---------- boot ---------- */
BW.freshState = () => ({ user: null, profile: null, best: {}, badges: {}, hist: [], recent: [], classes: [], tasks: [], notices: [], school: null });
let entering = null;
BW.enter = (user, force) => {
  if (!force && entering === user.uid) return; entering = user.uid;
  BW.S.user = { id: user.uid, email: user.email };
  document.getElementById("view").innerHTML = BW.splash("Loading your progress…");
  const slow = setTimeout(() => { const sp = document.querySelector(".splash"); if (sp && entering === user.uid && !sp.querySelector("#slowReload"))
    sp.insertAdjacentHTML("beforeend", `<button class="cta ghost small" id="slowReload">Taking a while? Reload</button>`), document.getElementById("slowReload").onclick = () => location.reload(); }, 8000);
  BW.withTimeout(BW.loadAll(), 12000).catch(e => { if (["removed_from_school", "no_profile"].includes(e.code)) throw e;
    const m = document.querySelector(".splash-msg"); if (m) m.textContent = "Reconnecting…";
    return BW.reconnect().then(() => BW.withTimeout(BW.loadAll(), 15000)); }).finally(() => clearTimeout(slow)).then(() => { BW.stack = []; BW.route = { name: "home", params: {} }; BW.render(); })
    .catch(e => { entering = null;
      const removed = e.code === "removed_from_school", missing = e.code === "no_profile";
      document.getElementById("view").innerHTML = `<div class="splash"><h2>${removed ? "This school login has been removed" : missing ? "Your account isn't set up" : "Couldn't load Bitwise"}</h2>
        <p class="muted" style="max-width:46ch">${removed ? "Your school has removed this account. Ask your teacher if you think this is a mistake." : missing ? "Sign-up didn't finish. Sign out and create your account again." : E(BW.errMsg(e))}</p>
        <div class="row-btns">${removed || missing ? "" : `<button class="cta" id="retry">Try again</button>`}<button class="cta ghost" id="so">Sign out</button></div></div>`;
      document.getElementById("retry")?.addEventListener("click", () => BW.reconnect().then(() => BW.enter(user, true))); document.getElementById("so").onclick = () => BW.api.signOut(); });
};
BW.auth.onAuthStateChanged(user => setTimeout(() => {
  if (!user) { entering = null; BW.S = BW.freshState(); BW.cache = {}; BW.Q && clearInterval(BW.Q.timer); BW.route = { name: "auth", params: {} }; return BW.render(); }
  if (BW.ui.signingUp) return;   // the sign-up form enters once the profile exists
  BW.enter(user);
}, 0));

