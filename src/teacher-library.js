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
