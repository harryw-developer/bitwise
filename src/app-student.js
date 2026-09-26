/* Student tasks + everyone's profile page */
BW.viewTasks = () => {
  const S = BW.S, todo = S.tasks.filter(t => !t.completed_at), done = S.tasks.filter(t => t.completed_at), cls = BW.myClasses();
  const card = t => { const due = BW.dueLabel(t.due_at), items = t.items || [], k = items.length, first = BW.itemLabel(items[0]?.quiz_id || "");
    const next = items.findIndex(it => !it.completed_at), cover = (() => { const lab = BW.quizLabel(items[0]?.quiz_id || ""); return lab.unit ? BW.unitCover(lab.unit, 240, 240) : BW.codeCover(items[0]?.quiz_id || "t", 240, 240); })();
    return `<article class="task-card multi"><div class="sw" style="background-image:${cover}"></div>
      <div class="tc-body"><div class="tc-top"><span class="due-chip ${due.cls}">${due.text}</span><span class="muted">${E(t.class_name)}</span></div>
      <h3>${E(t.title)}</h3>${t.instructions ? `<p class="tc-note">${E(t.instructions)}</p>` : ""}
      <div class="tc-prog"><div class="bar"><i style="width:${k ? t.items_done / k * 100 : 0}%"></i></div><span class="num">${t.items_done}/${k} item${k === 1 ? "" : "s"} done · target ${t.target_pct}% each</span></div>
      <ol class="task-items">${items.map((it, i) => { const l = BW.itemLabel(it.quiz_id), done = !!it.completed_at, b = it.best != null ? Math.round(it.best * 100) : null;
        return `<li><button class="task-item ${done ? "done" : ""} ${i === next ? "next" : ""}" data-taskitem="${t.id}|${E(it.quiz_id)}"><span class="ex-ico">${l.icon}</span>
          <span class="tt"><b>${E(l.name)}</b><small>${done ? `Done · best ${b}%` : b != null ? `Best ${b}% · keep going` : i === next ? "Up next" : "Not started"}</small></span>
          <span class="tick ${done ? "done" : ""}">${done ? I.check : ""}</span></button></li>`; }).join("")}</ol></div></article>`; };
  return `<h1>Tasks</h1><p class="muted" style="margin-top:6px">Work set by your teachers. A task is done when you reach its target score. Extra practice on the same quiz counts too.</p>
    ${cls.length ? "" : `<div style="margin-top:20px">${BW.joinCard()}</div>`}
    <div class="sec-head"><h2>To do</h2><span class="muted">${todo.length}</span></div>
    ${todo.length ? `<div class="task-list">${todo.map(card).join("")}</div>` : `<div class="empty">${cls.length ? "Nothing to do right now. Try a Daily Challenge." : "Join a class to see tasks here."}</div>`}
    ${done.length ? `<div class="sec-head"><h2>Completed</h2><span class="muted">${done.length}</span></div><div class="panel">${done.map(BW.taskRow).join("")}</div>` : ""}
    ${cls.length ? `<div class="sec-head"><h2>Your classes</h2></div><div class="panel">${cls.map(c => `<div class="row-line"><span class="pbadge" style="background:#2F9BB3">${E(c.name.slice(0, 1).toUpperCase())}</span><b style="flex:1">${E(c.name)}</b><button class="link" data-leave="${c.id}">Leave</button></div>`).join("")}</div><div style="margin-top:16px">${BW.joinCard()}</div>` : ""}`;
};

const SWATCHES = ["#5B4BD5", "#1F7A8C", "#B0306E", "#C2410C", "#167A4B", "#2563EB", "#B3261E", "#6D28D9", "#8A5A00", "#14213D"]; // all give white text ≥ 4.5:1
BW.viewProfile = () => {
  const S = BW.S, p = S.profile, lv = BW.levelOf(p.xp), teacher = BW.isTeacher();
  const earned = Object.keys(BW.BADGES).filter(k => S.badges[k]), locked = Object.keys(BW.BADGES).filter(k => !S.badges[k]);
  const tries = Object.values(S.best).reduce((a, b) => a + b.tries, 0);
  return `<div class="profile-hd">${BW.avatarHTML("avatar xl")}<div><h1>${E(p.display_name)}</h1><p class="muted">${teacher ? "Teacher" : "Student"} · Level ${lv.L} ${E(BW.titleOf(lv.L))}${p.managed ? " · school-managed account" : ""}</p>
    <div class="bar" style="margin-top:10px;max-width:320px"><i style="width:${lv.into / lv.need * 100}%"></i></div><p class="note num">${lv.into}/${lv.need} XP to level ${lv.L + 1}</p></div></div>
  <div class="stat-row wide">
    <div class="stat"><b class="num">${p.xp}</b><span>Total XP</span></div><div class="stat"><b class="num">${BW.liveStreak()}</b><span>Day streak</span></div>
    <div class="stat"><b class="num">${p.best_streak}</b><span>Best streak</span></div><div class="stat"><b class="num">${BW.totalMedals()}</b><span>Medals</span></div><div class="stat"><b class="num">${tries}</b><span>Quizzes</span></div></div>
  <div class="sec-head"><h2>Badges</h2><span class="muted">${earned.length} of ${Object.keys(BW.BADGES).length}</span></div>
  <div class="badge-grid">${earned.map(k => BW.badgeHTML(BW.BADGES[k], true)).join("")}${locked.map(k => BW.badgeHTML(BW.BADGES[k], false)).join("")}</div>
  <div class="two-col" style="margin-top:28px">
    <section class="panel"><h3>Mastery by unit</h3>${BW.units.map(u => { const m = Math.round(BW.unitMastery(u) * 100); return `<button class="unit-prog" data-unit="${u.id}" style="width:100%;text-align:left"><span class="sw" style="background-image:${BW.unitCover(u, 120, 120)}"></span><span class="tt"><b>${E(u.title)}</b><div class="bar" style="margin-top:6px"><i style="width:${m}%"></i></div></span><span class="pc">${m}%</span></button>`; }).join("")}</section>
    <div style="display:grid;gap:18px;align-content:start">
      <section class="panel"><h3>Your profile</h3><form id="profileForm" class="form"><label for="pfName">Display name</label><input id="pfName" maxlength="40" required value="${E(p.display_name)}">
        <label>Avatar colour</label><div class="swatches">${SWATCHES.map(c => `<button type="button" class="swatch ${c === p.avatar_color ? "on" : ""}" data-swatch="${c}" style="background:${c}" aria-label="Colour ${c}"></button>`).join("")}</div>
        <button class="small-btn">Save profile</button></form></section>
      <section class="panel"><h3>Settings</h3><div class="row-line"><span style="flex:1">Sound effects</span><button class="toggle ${BW.sfx.muted ? "" : "on"}" data-act="sound" aria-pressed="${!BW.sfx.muted}"><span></span></button></div>
        <div class="row-line"><span style="flex:1">Dark mode</span><button class="toggle ${document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches) ? "on" : ""}" data-act="theme"><span></span></button></div></section>
      <section class="panel"><h3>Account</h3><form id="pwForm" class="form"><label for="pfPw">New password</label><input id="pfPw" type="password" minlength="8" autocomplete="new-password" placeholder="At least 8 characters"><button class="small-btn">Change password</button></form>
        ${!teacher && !p.managed ? `<details class="more"><summary>I'm a teacher</summary><form id="teachForm" class="form"><label for="tcCode">Teacher code</label><input id="tcCode" autocomplete="off" placeholder="From your school's Bitwise admin"><button class="small-btn">Switch to a teacher account</button></form></details>` : ""}
        <div class="row-btns" style="margin-top:14px"><button class="cta ghost" data-act="signout">Sign out</button><button class="cta danger" data-act="delete">Delete account</button></div></section>
    </div></div>`;
};
BW.bindProfile = root => {
  let colour = BW.S.profile.avatar_color;
  root.querySelectorAll("[data-swatch]").forEach(b => b.onclick = () => { colour = b.dataset.swatch; root.querySelectorAll("[data-swatch]").forEach(x => x.classList.toggle("on", x === b)); });
  root.querySelector("#profileForm").onsubmit = async e => { e.preventDefault();
    const name = root.querySelector("#pfName").value.trim().slice(0, 40); if (!name) return;
    const { error } = await BW.sb.from("profiles").update({ display_name: name, avatar_color: colour }).eq("id", BW.S.profile.id);
    if (error) return BW.toast(BW.errMsg(error));
    Object.assign(BW.S.profile, { display_name: name, avatar_color: colour }); BW.toast("Profile saved"); BW.render(); };
  root.querySelector("#pwForm").onsubmit = async e => { e.preventDefault(); const pw = root.querySelector("#pfPw").value;
    if (pw.length < 8) return BW.toast("Use at least 8 characters");
    const { error } = await BW.sb.auth.updateUser({ password: pw }); BW.toast(error ? BW.errMsg(error) : "Password changed"); if (!error) root.querySelector("#pfPw").value = ""; };
  const tf = root.querySelector("#teachForm");
  if (tf) tf.onsubmit = async e => { e.preventDefault();
    try { await BW.api.rpc("become_teacher", { p_code: root.querySelector("#tcCode").value }); await BW.loadAll(); BW.toast("You're now a teacher"); BW.go("home"); } catch (err) { BW.toast(BW.errMsg(err)); } };
  root.querySelector("[data-act=sound]").onclick = () => { BW.sfx.toggle(); BW.sfx.play("click"); BW.render(); };
  root.querySelector("[data-act=theme]").onclick = () => { BW.toggleTheme(); BW.render(); };
  root.querySelector("[data-act=signout]").onclick = () => BW.sb.auth.signOut();
  root.querySelector("[data-act=delete]").onclick = () => BW.modal(`<h2>Delete your account?</h2><p class="muted" style="margin:8px 0 14px">This permanently removes your profile, scores and badges${BW.isTeacher() ? ", and every class you teach" : ""}. It can't be undone.</p>
    <form id="delForm" class="form"><label for="delTxt">Type DELETE to confirm</label><input id="delTxt" autocomplete="off"><div class="row-btns"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta danger">Delete for ever</button></div></form>`,
    (w, close) => w.querySelector("#delForm").onsubmit = async e => { e.preventDefault(); if (w.querySelector("#delTxt").value.trim() !== "DELETE") return BW.toast("Type DELETE to confirm");
      try { await BW.api.fn("delete_self"); close(); await BW.sb.auth.signOut(); BW.toast("Your account has been deleted"); } catch (err) { BW.toast(BW.errMsg(err)); } });
};
