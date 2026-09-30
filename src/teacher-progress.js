/* Class progress grid (students × tasks) and the per-student task view with resubmission requests */
BW.cellState = r => !r ? "none" : r.completed_at ? "done" : r.resub ? "redo" : r.tries > 0 ? "prog" : "none";
BW.CELL_LABEL = { done: "Completed", prog: "In progress", none: "Not started", redo: "Resubmission requested" };

BW.classProgress = c => {
  const g = BW.fetchOnce("grid:" + c.id, () => BW.db.classGrid(c.id));
  if (g === undefined) return BW.loading;
  if (!g) return `<div class="empty">${E(BW.cacheErr("grid:" + c.id))}</div>`;
  if (!g.tasks.length) return `<div class="empty">No tasks yet. <button class="link" data-act="openlib">Set homework from the Task Library</button></div>`;
  if (!g.roster.length) return `<div class="empty">No students in this class yet.</div>`;
  const tasks = g.tasks.slice().sort((a, b) => (a.due_at || "9999").localeCompare(b.due_at || "9999"));
  const cell = (t, m) => { const r = g.cells[t.id]?.[m.student_id], st = BW.cellState(r), k = t.quiz_ids.length;
    const txt = st === "done" ? "✓" : st === "redo" ? "↺" : st === "prog" ? `${r.items_done}/${k}` : "–";
    return `<td class="c"><button class="pcell ${st}" data-cell="${t.id}|${m.student_id}" title="${E(m.display_name)} · ${E(t.title)}: ${BW.CELL_LABEL[st]}" aria-label="${E(m.display_name)}, ${E(t.title)}: ${BW.CELL_LABEL[st]}">${txt}</button></td>`; };
  return `<div class="pg-legend"><span><i class="pcell done"></i>Completed</span><span><i class="pcell prog"></i>In progress</span><span><i class="pcell none"></i>Not started</span><span><i class="pcell redo"></i>Resubmission requested</span></div>
  <div class="table-wrap pgrid-wrap"><table class="dtable pgrid"><thead><tr><th class="stick">Student</th>
    ${tasks.map(t => { const due = BW.dueLabel(t.due_at); return `<th class="tcol"><button class="link-plain" data-assign="${t.id}" title="Open the task report">${E(t.title)}</button><small class="due-chip ${due.cls}">${due.text}</small></th>`; }).join("")}
    <th class="r">Done</th></tr></thead><tbody>
    ${g.roster.map(m => { const done = tasks.filter(t => g.cells[t.id]?.[m.student_id]?.completed_at).length;
      return `<tr><td class="stick"><button class="who link-plain" data-student="${m.student_id}">${BW.avatarHTML("av-sm", m)}${E(m.display_name)}</button></td>${tasks.map(t => cell(t, m)).join("")}<td class="r num">${done}/${tasks.length}</td></tr>`; }).join("")}
  </tbody></table></div>`;
};

/* one student's work on one task */
BW.openCell = (c, tid, sid) => {
  const g = BW.cache["grid:" + c.id]?.data; if (!g) return;
  const t = g.tasks.find(x => x.id === tid), m = g.roster.find(x => x.student_id === sid), r = g.cells[tid]?.[sid]; if (!t || !m) return;
  const st = BW.cellState(r), redo = r?.resub, since = t.created_at || "";
  const all = q => g.results.filter(x => x.uid === sid && x.quiz_id === q && x.finished_at >= since);   // every attempt since the task was set, newest first
  const items = t.quiz_ids.map((q, i) => ({ q, i, lab: BW.itemLabel(q), rep: r?.items[i], atts: all(q) }));
  const chip = { done: "good", prog: "warn", none: "bad", redo: "warn" }[st];
  BW.modal(`<div class="cellview"><h2>${E(m.display_name)}</h2><p class="muted">${E(t.title)} · target ${t.target_pct}% · ${BW.dueLabel(t.due_at).text}</p>
    <p style="margin:8px 0"><span class="chip-s ${chip}">${BW.CELL_LABEL[st]}</span></p>
    ${redo ? `<div class="redo-box"><b>Resubmission requested ${BW.when(redo.requested_at)}</b>${redo.reason ? `<p>${E(redo.reason)}</p>` : ""}<small class="muted">Items: ${redo.quiz_ids.map(q => E(BW.itemLabel(q).name)).join(", ")}</small><button class="link danger-t" id="cancelRedo">Cancel request</button></div>` : ""}
    ${items.map(it => { const done = !!it.rep?.completed_at, tried = it.atts.length;
      return `<section class="ci"><div class="ci-head"><span class="ex-ico">${it.lab.icon}</span><b>${E(it.lab.name)}</b><span class="chip-s ${done ? "good" : tried ? "warn" : "bad"}">${done ? "Done" : tried ? "Tried" : "Not started"}</span>
        ${it.rep?.best != null ? `<span class="num muted">best ${BW.pct(it.rep.best)}</span>` : ""}</div>
        ${tried ? `<div class="chips ci-atts">${it.atts.map((a, k) => `<button class="chip small ${k === 0 ? "on" : ""}" data-pick="${it.i}|${a.id}">${BW.when(a.finished_at)} · ${BW.pct(a.pct)}${redo && redo.quiz_ids.includes(it.q) && a.finished_at < redo.requested_at ? " · before request" : ""}</button>`).join("")}</div>
          <div class="ci-ans" id="ciAns${it.i}">${BW.loading}</div>` : `<p class="muted">No attempts yet.</p>`}</section>`; }).join("")}
    <div id="redoArea"><div class="row-btns" style="margin-top:14px"><button class="cta ghost" data-close>Close</button>${r?.tries || g.results.some(x => x.uid === sid && t.quiz_ids.includes(x.quiz_id)) ? `<button class="cta" id="askRedo">${redo ? "Update request" : "Request resubmission"}</button>` : ""}</div></div></div>`,
    (w, close) => {
      w.querySelector(".modal").classList.add("wide");
      const show = async (i, aid) => { const box = w.querySelector("#ciAns" + i); if (!box) return;
        const a = g.results.find(x => x.id === aid); box.innerHTML = BW.loading;
        try { const rows = a?.answers || await BW.db.answers(c.id, aid); box.innerHTML = BW.answersHTML(rows); } catch (e) { box.innerHTML = `<p class="note err">${E(BW.errMsg(e))}</p>`; } };
      items.forEach(it => it.atts[0] && show(it.i, it.atts[0].id));
      w.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => { const [i, aid] = b.dataset.pick.split("|");
        b.parentElement.querySelectorAll(".chip").forEach(x => x.classList.toggle("on", x === b)); show(+i, aid); });
      const refresh = () => { BW.invalidate("grid:" + c.id, "asum:" + c.id, "rep:"); BW.render(); };
      w.querySelector("#cancelRedo")?.addEventListener("click", async () => { try { await BW.db.cancelResub(c.id, tid, sid); close(); BW.toast("Request cancelled"); refresh(); } catch (e) { BW.toast(BW.errMsg(e)); } });
      w.querySelector("#askRedo")?.addEventListener("click", () => {
        w.querySelector("#redoArea").innerHTML = `<form id="redoForm" class="form redo-form"><h3>Request resubmission</h3>
          <label for="redoWhy">Reason (${E(m.display_name.split(" ")[0])} will see this)</label>
          <textarea id="redoWhy" rows="3" maxlength="1000" placeholder="e.g. Try a different approach: use a while loop instead of a for loop.">${E(redo?.reason || "")}</textarea>
          <label>Items to redo</label><div class="check-list">${items.map(it => `<label class="check-row"><input type="checkbox" value="${E(it.q)}" ${!redo || redo.quiz_ids.includes(it.q) ? "checked" : ""}> ${E(it.lab.name)}</label>`).join("")}</div>
          <p class="note">Only work done after this request will count for these items.</p>
          <div class="row-btns"><button type="button" class="cta ghost" data-close>Cancel</button><button class="cta">Send request</button></div></form>`;
        w.querySelector("#redoWhy").focus();
        w.querySelector("#redoForm").onsubmit = async e => { e.preventDefault(); const qs = [...w.querySelectorAll(".redo-form input:checked")].map(x => x.value);
          if (!qs.length) return BW.toast("Tick at least one item");
          const btn = e.target.querySelector("button.cta:not(.ghost)"); btn.disabled = true;
          try { await BW.db.requestResub(c.id, t, sid, qs, w.querySelector("#redoWhy").value.trim()); close(); BW.toast(`Resubmission requested from ${m.display_name}`); refresh(); }
          catch (x) { btn.disabled = false; BW.toast(BW.errMsg(x)); } };
      });
    });
};
