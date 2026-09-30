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
    <p class="muted n-from">From ${E(n.author_name)} · ${E(n.classes.join(", "))}</p><p class="n-body">${E(n.body)}</p></article>`).join("")}</div>`
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
