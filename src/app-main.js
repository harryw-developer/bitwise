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
  if (name === "class" && prev.params?.cid !== params.cid) BW.ui.classTab = "tasks";
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
  BW.withTimeout(BW.loadAll(), 20000).catch(e => { if (["removed_from_school", "no_profile"].includes(e.code)) throw e;
    const m = document.querySelector(".splash-msg"); if (m) m.textContent = "Reconnecting…";
    return BW.reconnect().then(() => BW.withTimeout(BW.loadAll(), 20000)); }).then(() => { BW.stack = []; BW.route = { name: "home", params: {} }; BW.render(); })
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
