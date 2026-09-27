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
  if (!rows) return BW.loading;
  if (!rows.length) return `<p class="note">No question-by-question data for this attempt (it was saved before detailed tracking was added).</p>`;
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
BW.attemptList = (atts, openId) => atts.map(t => { const lab = BW.quizLabel(t.quiz_id), open = openId === t.id;
  return `<div class="att ${open ? "open" : ""}"><button class="att-head" data-att="${t.id}" aria-expanded="${open}"><span class="tt"><b>${E(lab.title)}</b><small class="muted">${E(lab.sub || "")} · ${BW.when(t.finished_at)}</small></span>
    <span class="num att-score ${+t.pct >= BW.PASS ? "good-t" : ""}">${BW.pct(t.pct)}</span><span class="num muted">${t.correct}/${t.total}</span><span class="num muted">${t.active_ms != null ? BW.fmtMs(t.active_ms) : "–"}</span>${I.down}</button>
    ${open ? `<div class="att-body">${BW.answersHTML(t.answers || [])}</div>` : ""}</div>`; }).join("");

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
      ${open ? `<div class="att-body"><div class="item-chips">${r.items.map(it => BW.itemChip(it, a.target_pct)).join("")}</div>${(() => { const atts = studentAtts(r.student_id); return atts === undefined ? BW.loading : !atts?.length ? `<p class="note">No attempts yet.</p>` : `<div class="att-list inner">${BW.attemptList(atts, BW.ui.openAttempt)}</div>`; })()}<button class="link" data-student="${r.student_id}">Open ${E(r.display_name.split(" ")[0])}'s full profile</button></div>` : ""}</div>`; }).join("") || `<p class="muted">No students in this class yet.</p>`}</div>
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
      const atts = (await BW.db.results(cid, task.quiz_ids)).filter(t => people[t.uid] && t.finished_at >= (task.created_at || ""));
      BW.csv(`${safe(task.title)}_answers.csv`, [["Student", "Item", "Attempt finished", "Attempt score %", "Question code", "Type", "Topic", "Question", "Answer given", "Correct answer", "Correct", "Try", "Seconds"],
        ...atts.flatMap(t => t.answers.map(r => [people[t.uid], BW.itemLabel(t.quiz_id).name, t.finished_at, Math.round(t.pct * 100), r.q_code, BW.TYPE_LABELS[r.q_type] || r.q_type, r.topic, r.q_text, r.answer, r.correct_answer, r.is_correct ? "Yes" : "No", r.try_no, (r.ms / 1000).toFixed(1)]))]);
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
    <p class="note" style="margin-bottom:16px">Students with their own email can sign up and join with code <b class="mono">${E(c.join_code)}</b>. School logins can be in as many classes as you like. Select a name to see every answer they've given.</p>`;
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
  ${atts === undefined ? BW.loading : shown.length ? `<div class="panel att-list"><div class="att-cols muted"><span>Quiz</span><span>Score</span><span>Right</span><span>Time</span></div>${BW.attemptList(shown, BW.ui.openAttempt)}</div>` : `<div class="empty">No attempts yet.</div>`}`;
};
BW.bindStudent = (root, { cid }) => {
  root.querySelectorAll("[data-att]").forEach(el => el.onclick = () => { BW.ui.openAttempt = BW.ui.openAttempt === el.dataset.att ? null : el.dataset.att; BW.render(); });
  root.querySelectorAll("[data-attfilter]").forEach(el => el.onclick = () => { BW.ui.attFilter = el.dataset.attfilter; BW.render(); });
};
