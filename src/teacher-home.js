/* Teacher: dashboard, class page, tasks (assignments) */
BW.cache = {};
BW.fetchOnce = (key, fn) => {
  const c = BW.cache[key];
  if (c && "data" in c) return c.data;
  if (!c) { BW.cache[key] = {}; fn().then(d => { BW.cache[key].data = d; BW.render(); }).catch(e => { BW.cache[key].data = null; BW.cache[key].err = BW.errMsg(e); BW.render(); }); }
  return undefined;
};
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
  <section class="panel" style="margin-top:18px"><h3>Create a class</h3><form class="nick" id="newClass"><input id="newClassName" maxlength="60" placeholder="e.g. 10X Computer Science" aria-label="Class name" required><button class="small-btn">Create class</button></form><p class="note">Each class gets a join code. Students can join with it, or you can create school logins for them and add them to as many classes as you like.</p></section>
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
  const tab = BW.ui.classTab || "tasks";
  const tabs = [["tasks", "Tasks"], ["students", "Students"], ["notices", "Notices"], ["insights", "Insights"], ["board", "Leaderboard"], ["settings", "Settings"]];
  const body = { tasks: BW.classTasks, students: BW.classStudents, notices: BW.classNoticesTab, insights: BW.classInsights, board: BW.classBoard, settings: BW.classSettings }[tab](c);
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
