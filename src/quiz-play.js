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
