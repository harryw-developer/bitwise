/* Learner screens: home, side panel, topics, unit, subtopic */
BW.ui = { chip: "all", subTab: "quiz", open: null, search: "" };
const E = BW.esc, I = BW.icon;

BW.myName = () => BW.S.profile?.display_name || "";
BW.avatarHTML = (cls = "avatar", p = BW.S.profile) => `<div class="${cls}" style="background:${E(p?.avatar_color || "#6C5CE7")};color:${BW.onColor(p?.avatar_color || "#6C5CE7")}">${E((p?.display_name || "?").slice(0, 1).toUpperCase())}</div>`;
BW.medalsHTML = (u, s) => `<span class="stars" aria-label="${BW.subStars(u, s)} of 4 medals">${BW.medalsFor(u, s).map((m, i) => `<i class="medal ${m ? BW.LEVELS[i].key : ""}"></i>`).join("")}</span>`;
BW.favBtn = (key, cls = "heart") => { const on = !!BW.favs()[key]; return `<button class="${cls} ${on ? "on" : ""}" data-fav="${key}" aria-label="${on ? "Remove from saved" : "Save"}" aria-pressed="${on}">${I.heart}</button>`; };
BW.unitMedals = u => `${u.subs.reduce((a, s) => a + BW.subStars(u, s), 0)}/${u.subs.length * 4}`;
BW.dueLabel = t => {
  if (!t) return { text: "No due date", cls: "" };
  const d = (new Date(t) - Date.now()) / 864e5;
  if (d < 0) return { text: "Overdue", cls: "bad" };
  if (d < 1) return { text: `Due ${new Date(t).toDateString() === new Date().toDateString() ? "today" : "tomorrow"}`, cls: "warn" };
  if (d < 7) return { text: `Due ${new Date(t).toLocaleDateString(undefined, { weekday: "long" })}`, cls: "" };
  return { text: `Due ${new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`, cls: "" };
};

BW.unitCard = u => `<article class="ucard" data-unit="${u.id}" style="background-image:${BW.unitCover(u, 640, 800)}">
  ${BW.favBtn("u:" + u.id)}
  <span class="eyebrow">Paper ${u.paper} · Unit ${BW.units.indexOf(u) + 1}</span>
  <h3>${E(u.title)}</h3>
  <div class="meta"><span class="glass">${I.star} ${BW.unitMedals(u)}</span><span>${u.subs.length * 4 + 1} quizzes</span>${BW.S.best[u.id + ".boss"]?.pct >= BW.PASS ? `<span class="glass">Boss beaten</span>` : ""}</div>
  <button class="see-more" data-unit="${u.id}">See more <span class="go">${I.chev.replace("<svg", '<svg width="20" height="20"')}</span></button>
</article>`;
BW.labCard = () => { const all = BW.CODE.all, solved = all.filter(BW.codeSolved).length;
  return `<article class="ucard" data-nav="codelab" style="background-image:${BW.cover("codelab", "#0B1220", "#22C55E", "brackets", 640, 800)}">
  <span class="eyebrow">Paper 2 · Practical</span><h3>Coding Lab</h3>
  <div class="meta"><span class="glass">${I.star} ${solved}/${all.length} solved</span><span>${all.length} Python challenges</span></div>
  <button class="see-more" data-nav="codelab">Start coding <span class="go">${I.chev.replace("<svg", '<svg width="20" height="20"')}</span></button></article>`; };
BW.subTile = (u, s, showUnit = true) => `<article class="tile" data-sub="${u.id}/${s.id}">
  <div class="thumb" style="background-image:${BW.subCover(u, s)}">${BW.favBtn("s:" + u.id + "." + s.id)}${BW.X[u.id + "." + s.id] || s.igen ? `<span class="tag-int">Hands-on</span>` : ""}</div>
  <div class="t-title">${E(s.title)}</div>
  <div class="t-meta">${showUnit ? `${E(u.title)} <i class="dot"></i> ` : ""}${s.gen || s.igen ? "Unlimited questions" : `${BW.qCount(s)} questions`}</div>
  <div class="t-foot">${BW.medalsHTML(u, s)}<button class="go-dark" data-sub="${u.id}/${s.id}" aria-label="Open ${E(s.title)}">${I.arrow}</button></div>
</article>`;
BW.searchHits = term => { const t = term.toLowerCase().trim(); if (!t) return [];
  return BW.allSubs().filter(({ u, s }) => (s.title + " " + u.title + " " + (s.notes || []).join(" ")).toLowerCase().includes(t)).slice(0, 8); };
BW.hitsHTML = hits => hits.length ? `<div class="search-results">${hits.map(({ u, s }) => `<button class="target" data-sub="${u.id}/${s.id}"><span class="sw" style="background-image:${BW.subCover(u, s, 120, 120)}"></span><span class="tt"><b>${E(s.title)}</b><small>${E(u.title)}</small></span>${BW.medalsHTML(u, s)}</button>`).join("")}</div>`
  : (BW.ui.search.trim() ? `<p class="note">No topics match “${E(BW.ui.search)}”.</p>` : "");

BW.taskRow = t => {
  const q0 = t.items?.[0]?.quiz_id || "", lab = BW.quizLabel(q0), due = BW.dueLabel(t.due_at), done = !!t.completed_at, u = lab.unit, k = t.items?.length || 1;
  const best = t.best != null ? Math.round(t.best * 100) : null;
  return `<button class="target task ${done ? "is-done" : ""}" data-task="${t.id}">
    <span class="sw" style="background-image:${u ? BW.unitCover(u, 120, 120) : BW.codeCover(q0, 120, 120)}"></span>
    <span class="tt"><b>${E(t.title)}</b><small>${E(t.class_name)} · ${done ? "Done" : `<span class="due ${due.cls}">${due.text}</span>`}${!done ? ` · ${t.items_done}/${k} item${k === 1 ? "" : "s"} done` : ""}</small></span>
    <span class="tick ${done ? "done" : ""}">${done ? I.check : ""}</span></button>`;
};
BW.joinCard = () => `<section class="panel join"><h3>Join a class</h3><p class="muted">Type the code your teacher gave you.</p><form class="nick" id="joinForm"><input id="joinCode" maxlength="8" placeholder="e.g. K7Q2MX" autocomplete="off" aria-label="Class code" style="text-transform:uppercase;font-family:var(--mono)"><button class="small-btn">Join</button></form></section>`;

BW.viewHome = () => {
  const c = BW.ui.chip; let units = BW.units;
  if (c === "p1") units = units.filter(u => u.paper === 1);
  if (c === "p2") units = units.filter(u => u.paper === 2);
  if (c === "prog") units = units.filter(u => { const m = BW.unitMastery(u); return m > 0 && m < 1; });
  if (c === "saved") units = units.filter(u => BW.favs()["u:" + u.id]);
  const savedSubs = c === "saved" ? BW.allSubs().filter(({ u, s }) => BW.favs()["s:" + u.id + "." + s.id]) : [];
  const chips = [["all", "All units"], ["p1", "Paper 1 · Systems"], ["p2", "Paper 2 · Algorithms"], ["prog", "In progress"], ["saved", "Saved"]];
  const lv = BW.levelOf(BW.S.profile.xp), today = BW.S.best["daily." + BW.dayKey()];
  return `<header class="hello"><div><h1>Hello, ${E(BW.myName().split(" ")[0])}</h1><p class="sub">Level ${lv.L} ${E(BW.titleOf(lv.L))} · ${BW.liveStreak() ? `${I.flame} ${BW.liveStreak()}-day streak` : "Answer a quiz today to start a streak"}</p></div><button class="avatar-btn" data-nav="profile" aria-label="Your profile">${BW.avatarHTML()}</button></header>
  <form class="search" id="searchForm" role="search">${I.search}<input id="search" placeholder="Search topics, e.g. hex, SQL, firewall" value="${E(BW.ui.search)}" aria-label="Search topics"><button type="button" class="icon-dark" data-nav="topics" aria-label="Browse all topics">${I.sliders}</button></form>
  <div id="hits">${BW.hitsHTML(BW.searchHits(BW.ui.search))}</div>
  <div class="sec-head"><h2>Pick your next topic</h2><button class="link" data-nav="topics">See all</button></div>
  <div class="chips" role="tablist">${chips.map(([k, l]) => `<button class="chip ${c === k ? "on" : ""}" data-chip="${k}" role="tab" aria-selected="${c === k}">${l}</button>`).join("")}</div>
  ${units.length || c === "all" || c === "p2" ? `<div class="deck" style="margin-top:14px">${c === "all" || c === "p2" ? BW.labCard() : ""}${units.map(BW.unitCard).join("")}</div>` : `<div class="empty">${c === "saved" ? "Tap the heart on a unit or topic to save it here." : "Nothing in progress yet. Start any quiz below."}</div>`}
  ${savedSubs.length ? `<div class="row-cards">${savedSubs.map(({ u, s }) => BW.subTile(u, s)).join("")}</div>` : ""}
  <div class="sec-head"><h2>Quick fire</h2><span class="muted">${BW.quizCount()} quizzes in total</span></div>
  <div class="quick">${BW.quickModes.map(m => `<button class="qcard" data-quick="${m.id}" style="background-image:${BW.cover("q" + m.id, m.c1, m.c2, m.motif, 520, 360)}"><small>${m.id === "daily" ? (today ? `Done today · ${Math.round(today.pct * 100)}%` : "+30 XP bonus today") : m.id === "speed" ? (BW.S.best["quick.speed"] ? `Best ${Math.round(BW.S.best["quick.speed"].pct * 100)}% accuracy` : "Beat the clock") : "Endless practice"}</small><div><b>${m.title}</b><br><small>${m.sub}</small></div></button>`).join("")}</div>`;
};

BW.viewSide = () => {
  const p = BW.S.profile, lv = BW.levelOf(p.xp), teacher = BW.isTeacher();
  const open = BW.S.tasks.filter(t => !t.completed_at).slice(0, 3);
  const cls = BW.myClasses();
  return `<section class="panel"><div class="lvl"><div class="ring" style="--p:${Math.round(lv.into / lv.need * 100)}"><i>${lv.L}</i></div><div><h3 style="margin:0">${E(BW.titleOf(lv.L))}</h3><p class="muted num">${lv.need - lv.into} XP to level ${lv.L + 1}</p></div></div>
    <div class="stat-row"><div class="stat"><b class="num">${BW.weekXp()}</b><span>XP this week</span></div><div class="stat"><b class="num">${BW.liveStreak()}</b><span>Day streak</span></div><div class="stat"><b class="num">${Object.keys(BW.S.badges).length}</b><span>Badges</span></div></div></section>
  ${teacher ? "" : BW.noticeTeaser()}
  ${teacher ? "" : cls.length || BW.S.profile.managed ? `<section class="panel"><div class="sec-head" style="margin:0 0 8px"><h3 style="margin:0">Your tasks</h3><button class="link" data-nav="tasks">See all</button></div>${open.length ? open.map(BW.taskRow).join("") : `<p class="muted">You're all caught up.</p>`}</section>` : BW.joinCard()}
  <section class="panel"><h3>This week's targets</h3>${BW.weeklyTargets().map(({ u, s, li, done }) => `<button class="target" data-start="${u.id}/${s.id}/${li}"><span class="sw" style="background-image:${BW.subCover(u, s, 120, 120)}"></span><span class="tt"><b>${E(s.title)}</b><small>Pass ${BW.LEVELS[li].name} · ${E(u.title)}</small></span><span class="tick ${done ? "done" : ""}">${done ? I.check : ""}</span></button>`).join("")}<p class="note">New targets every Monday.</p></section>
  ${cls.length ? `<section class="panel lb-mini"><div class="sec-head" style="margin:0 0 6px"><h3 style="margin:0">Class leaderboard</h3><button class="link" data-nav="board">See all</button></div><div id="miniBoard"><p class="muted">Loading…</p></div></section>` : ""}`;
};

BW.viewTopics = () => `<h1>All topics</h1>
  <button class="boss-cta lab-cta" data-nav="codelab" style="background-image:${BW.cover("codelab-strip", "#0B1220", "#22C55E", "brackets", 900, 300)}"><span><small>Python in your browser · marked on output</small><b>Coding Lab: ${BW.CODE.all.length} challenges</b><small>${BW.CODE.sections.map(s => s.title).join(" · ")}</small></span><span class="go">${I.arrow}</span></button><p class="muted" style="margin-top:6px">${BW.units.length} units, ${BW.allSubs().length} topics and ${BW.quizCount()} quizzes, following the GCSE (9–1) specification.</p>
  <form class="search" id="searchForm" role="search">${I.search}<input id="search" placeholder="Filter topics" value="${E(BW.ui.search)}" aria-label="Filter topics"></form>
  ${BW.units.map(u => { const hits = BW.ui.search.trim() ? BW.searchHits(BW.ui.search) : null; const subs = u.subs.filter(s => !hits || hits.some(h => h.s === s)); if (!subs.length) return "";
    return `<div class="sec-head"><div style="display:flex;gap:12px;align-items:center"><span class="avatar" style="width:40px;height:40px;background-image:${BW.unitCover(u, 120, 120)};background-size:cover;box-shadow:none"></span><div><h2>${E(u.title)}</h2><span class="muted">Paper ${u.paper} · ${BW.unitMedals(u)} medals</span></div></div><button class="link" data-unit="${u.id}">Open unit</button></div>
    <div class="row-cards">${subs.map(s => BW.subTile(u, s, false)).join("")}</div>`; }).join("")}`;

BW.viewUnit = ({ uid }) => {
  const u = BW.findUnit(uid), best = BW.S.best[u.id + ".boss"];
  return `<div class="hero" style="background-image:${BW.unitCover(u, 1400, 640)}"><button class="back" data-back aria-label="Back">${I.back}</button>${BW.favBtn("u:" + u.id)}</div>
  <div class="sheet"><div class="grab"></div>
    <div class="sheet-top"><div><h1>${E(u.title)}</h1><div class="badge-line"><span class="pbadge" style="background:${u.c1}">${u.paper}</span>Paper ${u.paper} · Unit ${BW.units.indexOf(u) + 1}</div></div>
      <div class="rate"><span class="pillo">${I.star} ${BW.unitMedals(u)}</span><span class="muted">${Math.round(BW.unitMastery(u) * 100)}% mastered</span></div></div>
    <p class="blurb">${E(u.blurb)}</p>
    <button class="boss-cta" data-boss="${u.id}" style="background-image:${BW.cover(u.id + "boss", "#14161A", u.c1, u.motif, 900, 300)}"><span><small>Boss battle · 15 questions · 3 lives</small><b>${E(BW.BOSSES[u.id])}</b><small>${best ? `Best ${Math.round(best.pct * 100)}%${best.pct >= BW.PASS ? " · defeated" : ""}` : "Mixed questions from every topic in this unit"}</small></span><span class="go">${I.arrow}</span></button>
    <div class="sec-head"><h2>Topics</h2><span class="muted">${u.subs.length} topics</span></div>
    <div class="row-cards">${u.subs.map(s => BW.subTile(u, s, false)).join("")}</div>
  </div>`;
};

BW.viewSub = ({ uid, sid }) => {
  const { u, s } = BW.findSub(uid, sid), tab = BW.ui.subTab, med = BW.medalsFor(u, s);
  if (BW.ui.open == null) BW.ui.open = Math.max(0, med.indexOf(false));
  const tabs = [["quiz", "Quizzes"], ["facts", "Key facts"], ["scores", "Your scores"]];
  const arrow = I.arrow.replace("<svg", '<svg width="20" height="20"');
  let body = "";
  if (tab === "quiz") {
    body = BW.LEVELS.map((L, i) => { const b = BW.S.best[BW.qid(u, s, i)], open = BW.ui.open === i;
      return `<div class="acc ${open ? "open" : ""}"><button class="acc-head" data-open="${i}" aria-expanded="${open}"><span class="sw" style="background-image:${BW.cover(u.id + s.id + i, L.hex, u.c1, s.motif || u.motif, 240, 180)}">${med[i] ? I.check.replace("<svg", '<svg width="30" height="30"') : ""}</span><span class="tt"><small>Level ${i + 1}</small><b>${L.name}</b><small>${b ? `Best ${Math.round(b.pct * 100)}% · ${b.tries} attempt${b.tries > 1 ? "s" : ""}` : "Not tried yet"}</small></span>${I.down}</button>
        ${open ? `<div class="acc-body"><div><div class="k">Questions</div><div class="v">${L.n} questions${s.gen || s.igen ? ", freshly generated each time" : ""}</div></div><div><div class="k">How it works</div><div class="v">${L.blurb}</div></div><div><div class="k">Rewards</div><div class="v">${Math.round(10 * L.mult)} XP per first-time answer, combo bonuses, and a ${L.name} medal at ${Math.round(BW.PASS * 100)}%</div></div></div>` : ""}</div>`; }).join("")
      + `<div class="cta-dock"><button class="cta" data-start="${u.id}/${s.id}/${BW.ui.open}">Start ${BW.LEVELS[BW.ui.open].name} quiz ${arrow}</button></div>`;
  } else if (tab === "facts") {
    body = `<div class="facts">${(s.notes || []).map(n => `<div class="fact"><span class="pbadge" style="background:${u.c1};flex:none;margin-top:2px">${I.check.replace("<svg", '<svg width="12" height="12"')}</span><p>${BW.fmt(n)}</p></div>`).join("")}</div>
      <div class="cta-dock"><button class="cta" data-start="${u.id}/${s.id}/0">Test yourself: Bronze quiz ${arrow}</button></div>`;
  } else {
    const h = BW.S.hist.filter(x => x.quiz_id.startsWith(u.id + "." + s.id + "."));
    body = h.length ? `<div class="panel hist">${h.map(x => `<div class="row"><span>${BW.LEVELS[+x.quiz_id.split(".")[2]].name}</span><span class="muted">${new Date(x.finished_at).toLocaleDateString()}</span><span class="num"><b>${Math.round(x.pct * 100)}%</b> · +${x.xp} XP</span></div>`).join("")}</div>` : `<div class="empty">No attempts yet. Start with Bronze.</div>`;
  }
  return `<div class="sub-body"><div class="sub-hdr"><button class="hdr-btn" data-back aria-label="Back">${I.back}</button><div><h1>${E(s.title)}</h1><p class="muted">${E(u.title)} · Paper ${u.paper}</p></div>${BW.favBtn("s:" + u.id + "." + s.id, "hdr-btn heart solid")}</div>
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab ${tab === k ? "on" : ""}" data-tab="${k}" role="tab" aria-selected="${tab === k}">${l}</button>`).join("")}</div>${body}</div>`;
};
