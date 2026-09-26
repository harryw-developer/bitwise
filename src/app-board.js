/* Class leaderboards (week / all time) */
BW.boardTab = "week";
BW.sortBoard = (rows, kind) => rows.map(r => ({ ...r, score: kind === "week" ? +r.week_xp : +r.xp })).sort((a, b) => b.score - a.score || b.medals - a.medals || a.display_name.localeCompare(b.display_name));
BW.boardRows = (list, mini, start = 0) => list.map((p, i) => `<div class="row ${p.is_me ? "me-row" : ""}"><span class="rank">${start + i + 1}</span>${BW.avatarHTML("av-sm", p)}<span class="lb-name">${E(p.display_name)}${p.is_me ? " (you)" : ""}${mini ? "" : `<div class="lb-sub">Level ${BW.levelOf(p.xp).L} · ${p.medals} medals · ${p.streak}-day streak</div>`}</span><span class="lb-xp num">${p.score} XP</span></div>`).join("");
BW.boardHTML = (rows, c, teacher) => {
  const tabs = `<div class="tabs">${[["week", "This week"], ["all", "All time"]].map(([k, l]) => `<button class="tab ${BW.boardTab === k ? "on" : ""}" data-board="${k}">${l}</button>`).join("")}</div>`;
  if (!rows.length) return tabs + `<div class="empty">${!teacher && c && !c.show_leaderboard ? "Your teacher has hidden the leaderboard for this class." : "No students in this class yet."}</div>`;
  const list = BW.sortBoard(rows, BW.boardTab), top = list.slice(0, 3), order = [1, 0, 2].filter(i => top[i] && list.length >= 3);
  const me = list.findIndex(p => p.is_me);
  return tabs + (order.length ? `<div class="podium">${order.map(i => { const p = top[i]; return `<div class="pod p${i + 1}">${BW.avatarHTML("avatar", p)}<span class="place">${i + 1}</span><span class="nm">${E(p.display_name)}</span><span class="muted num">${p.score} XP</span></div>`; }).join("")}</div>` : "")
    + `<div class="lb-table">${BW.boardRows(order.length ? list.slice(3) : list, false, order.length ? 3 : 0)}</div>`
    + (me >= 0 ? `<p class="note">You're ${me + 1} of ${list.length}${BW.boardTab === "week" ? " this week. Weekly XP resets every Monday" : ""}.</p>` : "");
};
BW.viewBoard = () => {
  const cls = BW.myClasses().filter(c => !c.archived);
  if (!cls.length) return `<h1>Leaderboard</h1><p class="muted" style="margin:6px 0 20px">Leaderboards are private to each class.</p>${BW.isTeacher() ? `<div class="empty">Create a class to see its leaderboard.</div>` : BW.joinCard()}`;
  const cid = cls.some(c => c.id === BW.ui.boardClass) ? BW.ui.boardClass : cls[0].id, c = cls.find(x => x.id === cid);
  const rows = BW.fetchOnce("board:" + cid, () => BW.api.rpc("class_leaderboard", { p_class: cid }));
  return `<h1>Leaderboard</h1><p class="muted" style="margin-top:6px">Only people in the same class can see each other here.</p>
    ${cls.length > 1 ? `<div class="chips" style="margin-top:16px">${cls.map(x => `<button class="chip ${x.id === cid ? "on" : ""}" data-bclass="${x.id}">${E(x.name)}</button>`).join("")}</div>` : `<p class="note" style="margin-top:12px">${E(c.name)}</p>`}
    ${rows === undefined ? BW.loading : BW.boardHTML(rows || [], c, BW.isTeacher())}`;
};
BW.fillMiniBoard = async () => {
  const el = document.getElementById("miniBoard"), c = BW.myClasses().find(x => !x.archived); if (!el || !c) return;
  try {
    const key = "board:" + c.id;
    const rows = BW.cache[key]?.data || await BW.api.rpc("class_leaderboard", { p_class: c.id });
    BW.cache[key] = { data: rows };
    const el2 = document.getElementById("miniBoard"); if (!el2) return;
    el2.innerHTML = rows.length ? BW.boardRows(BW.sortBoard(rows, "week").slice(0, 5), true) : `<p class="muted">${c.show_leaderboard ? "No scores yet." : "Hidden by your teacher."}</p>`;
  } catch (e) { el.innerHTML = `<p class="muted">${E(BW.errMsg(e))}</p>`; }
};
