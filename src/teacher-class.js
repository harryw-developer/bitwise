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

