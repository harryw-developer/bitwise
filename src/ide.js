/* Coding Lab: Python runner (Pyodide in a worker), challenge list and the in-browser IDE */
BW.py = {
  worker: null, ready: null, state: "idle", seq: 0, pending: {},
  start() {
    if (this.worker) return this.ready;
    this.state = "loading"; BW.ideStatus?.();
    this.worker = new Worker("py-worker.js?v=__VER__");
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
    <div class="lab-hero-text"><span class="glass">Coding Lab</span><h1>Write real Python in your browser</h1><p>Every program is tested by running it, so any correct approach passes.</p>
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
    $("tests").innerHTML = `<div class="test-score ${pass === total ? "all" : ""}"><b class="num">${pass}/${total}</b> checks passed${R.saved ? ` · ${E(R.saved)}` : ""}</div>` +
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
    /* save to the server */
    const tries = (BW.S.best[key]?.tries || 0) + 1, oldLevel = BW.levelOf(BW.S.profile.xp).L;
    try {
      const id = await ide.attemptP; if (!id) throw new Error("not_saved");
      const res = await BW.api.rpc("finish_attempt", { p_attempt: id, p_total: total, p_correct: passed, p_max_combo: 0, p_active_ms: ide.clock.ms(),
        p_answers: [{ seq: 1, code: "", type: "code", key: "c:" + c.id, text: c.title, topic: "Coding Lab · " + c.section.title, answer: ide.code.slice(0, 20000),
          correct: "Passes all tests", ok: all, try: tries, ms: ide.clock.ms(),
          detail: { tests: tests.map((t, i) => ({ n: i + 1, hidden: !!c.tests[i].h, pass: t.pass, reason: (t.reason || "").slice(0, 200) })), req, runs: ide.runs } }] });
      BW.applyResult(res, key); BW.S.best[key].tries = tries;
      const bn = document.getElementById("bestNote"); if (bn) bn.textContent = BW.bestNote(c);
      ide.results.saved = res.xp_gain ? `+${res.xp_gain} XP` : all ? "Saved (no extra XP: beat your best score to earn more)" : "Saved";
      (res.badges || []).forEach(k => BW.BADGES[k] && setTimeout(() => BW.toast(`Badge unlocked: ${BW.BADGES[k][0]}`), 700));
      BW.afterWork();
      BW.invalidate("board:");
      if (BW.levelOf(BW.S.profile.xp).L > oldLevel) BW.modal(`<div class="levelup"><div class="ring big" style="--p:100"><i>${BW.levelOf(BW.S.profile.xp).L}</i></div><h2>Level up!</h2><button class="cta" data-close>Keep coding</button></div>`);
    } catch (e) { ide.results.saved = BW.errMsg(e); }
    ide.attemptP = BW.api.rpc("start_attempt", { p_quiz_id: key, p_assignment: ide.assignment }).catch(() => null);
    renderTests(); busy(false);
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
    BW.modal(`<h2>Model solution</h2><p class="muted" style="margin:6px 0 12px">One correct approach. Students' programs are marked on output, so other approaches pass too.</p><pre class="codeview">${E(sol)}</pre><button class="cta" data-close style="margin-top:14px">Close</button>`);
  });
  if (ide.results) { showTab("tests"); renderTests(); }
  setTimeout(() => cm?.refresh(), 0);
};
BW.leaveCode = () => { if (BW.ide) { BW.ide.clock.pause(); BW.clocks.delete(BW.ide.clock); } };
