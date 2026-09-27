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
