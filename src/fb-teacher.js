/* Firebase data layer, part 2: classes, tasks, reports, the school directory, school-managed logins and notices */
BW.db = {};
const me = () => BW.S.user.id;
const WORDS = ["amber", "azure", "coral", "ember", "frost", "jade", "lemon", "maple", "ocean", "olive", "pixel", "quartz", "river", "ruby", "solar", "storm", "tiger", "ultra", "violet", "willow", "binary", "cobalt", "delta", "echo", "falcon", "gamma", "hertz", "ion", "joule", "kilo", "laser", "modem", "nano", "orbit", "proxy", "qubit", "radar", "sonic", "turbo", "vector"];
const rnd = n => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; };
const pupilPassword = () => `${WORDS[rnd(40)]}-${WORDS[rnd(40)]}-${10 + rnd(90)}`;
const slug = name => { const p = name.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().toLowerCase().split(/\s+/); return ((p[0] || "") + (p[1]?.[0] || "")).replace(/[^a-z0-9]/g, "").slice(0, 12) || "student"; };
const memberRow = d => { const x = d.data(), wk = BW.weekKey(), live = x.lastDay && (Date.now() - x.lastDay.toDate()) < 2 * 864e5;
  return { student_id: d.id, user_id: d.id, display_name: x.displayName, avatar_color: x.avatarColor, managed: !!x.managed, username: x.username || null, xp: x.xp || 0,
    week_xp: x.weekKey === wk ? x.weekXp || 0 : 0, streak: live ? x.streak || 0 : 0, medals: x.medals || 0, quizzes: x.quizzes || 0, last_active: ts(x.lastActive),
    joined_at: ts(x.joinedAt), is_me: d.id === me(), stats: x.stats || {}, best: x.best || {}, tries: x.tries || {} }; };
const resultRow = d => { const x = d.data(); return { id: d.id, uid: x.uid, display_name: x.displayName, quiz_id: x.quizId, assignment_id: x.assignmentId,
  total: x.total, correct: x.correct, pct: x.pct, xp: x.xp, active_ms: x.activeMs, finished_at: ts(x.finishedAt), answers: (x.answers || []).map(BW.ansRow) }; };
const keyOf = q => q.replace(/\./g, "_");
const mondayLondon = () => { const d = new Date(); const day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day); return d.toISOString(); };

/* ---------- classes ---------- */
BW.db.createClass = async name => {
  for (let i = 0; i < 6; i++) {
    const cid = newId(), code = randCode(6), b = BW.fs.batch();
    b.set(ref("classCodes", code), { classId: cid });
    b.set(ref("classes", cid), { name: name.slice(0, 60), schoolId: BW.S.profile.school_id, teacherId: me(), joinCode: code, showLeaderboard: true, archived: false, createdAt: FV.serverTimestamp() });
    try { await b.commit(); return BW.toClass(cid, { name, joinCode: code, showLeaderboard: true, archived: false, teacherId: me(), schoolId: BW.S.profile.school_id, createdAt: null }); }
    catch (e) { if (e.code !== "permission-denied" || i === 5) throw e; }   // a clashing code: try another
  }
};
BW.db.regenerateCode = async cid => {
  const c = BW.classById(cid);
  for (let i = 0; i < 6; i++) {
    const code = randCode(6), b = BW.fs.batch();
    b.set(ref("classCodes", code), { classId: cid }); b.update(ref("classes", cid), { joinCode: code }); b.delete(ref("classCodes", c.join_code));
    try { await b.commit(); return code; } catch (e) { if (e.code !== "permission-denied" || i === 5) throw e; }
  }
};
BW.db.updateClass = (cid, patch) => ref("classes", cid).update(Object.fromEntries(Object.entries(patch).map(([k, v]) => [({ show_leaderboard: "showLeaderboard" })[k] || k, v])));
BW.db.deleteClass = async cid => {
  const managed = (await col("classes", cid, "members").where("managed", "==", true).get()).docs.map(d => d.id);   // school logins lose this class from their list
  for (let i = 0; i < managed.length; i += 400) { const b = BW.fs.batch(); managed.slice(i, i + 400).forEach(sid => b.update(ref("users", sid), { classIds: FV.arrayRemove(cid) })); await b.commit().catch(() => { }); }
  for (const sub of ["members", "tasks", "notices", "results"]) {
    const q = await col("classes", cid, sub).get();
    for (let i = 0; i < q.docs.length; i += 400) { const b = BW.fs.batch(); q.docs.slice(i, i + 400).forEach(d => b.delete(d.ref)); await b.commit(); }
  }
  const c = BW.classById(cid), b = BW.fs.batch();
  b.delete(ref("classCodes", c.join_code)); b.delete(ref("classes", cid)); await b.commit();
};
BW.db.joinClass = async raw => {
  if (BW.S.profile.managed) fail("managed_locked");
  if (BW.isTeacher()) fail("own_class");
  const code = raw.replace(/\s/g, "").toUpperCase(), snap = await ref("classCodes", code).get();
  if (!snap.exists) fail("bad_code");
  const cid = snap.data().classId, p = (await ref("users", me()).get()).data(), b = BW.fs.batch();
  b.set(ref("classes", cid, "members", me()), { uid: me(), displayName: p.displayName, avatarColor: p.avatarColor, managed: false, joinedAt: FV.serverTimestamp(), joinCode: code,
    xp: p.xp || 0, weekXp: p.weekXp || 0, weekKey: p.weekKey || "", streak: p.streak || 0, lastDay: p.lastDay || null, medals: BW.totalMedals(), quizzes: 0, lastActive: null });
  b.update(ref("users", me()), { classIds: FV.arrayUnion(cid) });
  try { await b.commit(); } catch (e) { fail(e.code === "permission-denied" ? "bad_code" : e.code); }
  const c = await ref("classes", cid).get();
  return { class_id: cid, name: c.data().name };
};
BW.db.leaveClass = async cid => {
  if (BW.S.profile.managed) fail("managed_locked");
  const b = BW.fs.batch(); b.delete(ref("classes", cid, "members", me())); b.update(ref("users", me()), { classIds: FV.arrayRemove(cid) }); await b.commit();
};
BW.db.becomeTeacher = async raw => {
  const code = raw.trim().toUpperCase(), snap = await ref("teacherCodes", code).get().catch(() => null);
  if (!snap?.exists) fail("bad_teacher_code");
  if (BW.S.profile.managed) fail("managed_locked");
  await ref("users", me()).update({ role: "teacher", schoolId: snap.data().schoolId, teacherCode: code });
  return true;
};
BW.db.rotateTeacherCode = async () => {
  const s = BW.S.school, code = `${randCode(5)}-${randCode(5)}`, b = BW.fs.batch();
  b.set(ref("teacherCodes", code), { schoolId: s.id }); b.update(ref("schools", s.id), { teacherCode: code }); b.delete(ref("teacherCodes", s.teacherCode));
  await b.commit(); s.teacherCode = code; return code;
};

/* ---------- tasks ---------- */
BW.db.tasks = async cid => (await col("classes", cid, "tasks").orderBy("createdAt", "desc").get()).docs.map(d => BW.toTask(d.id, cid, d.data()));
BW.db.task = async (cid, tid) => { const d = await ref("classes", cid, "tasks", tid).get(); if (!d.exists) fail("not_found"); return BW.toTask(d.id, cid, d.data()); };
BW.db.createTask = (cid, t) => col("classes", cid, "tasks").add({ title: t.title, instructions: t.instructions || "", quizIds: t.quiz_ids, targetPct: t.target_pct,
  dueAt: t.due_at ? firebase.firestore.Timestamp.fromDate(new Date(t.due_at)) : null, createdAt: FV.serverTimestamp(), createdBy: me() });
BW.db.deleteTask = (cid, tid) => ref("classes", cid, "tasks", tid).delete();
BW.db.dashboard = async () => {
  const cls = BW.myClasses();
  const per = await Promise.all(cls.map(async c => { const [m, t] = await Promise.all([col("classes", c.id, "members").get(), BW.db.tasks(c.id)]);
    return { c, members: m.docs.map(d => d.id), tasks: t }; }));
  return { m: per.flatMap(x => x.members.map(s => ({ class_id: x.c.id, student_id: s }))), a: per.flatMap(x => x.tasks.map(t => ({ id: t.id, class_id: x.c.id, due_at: t.due_at, quiz_ids: t.quiz_ids, created_at: t.created_at }))) };
};

/* ---------- class members, leaderboards and results ---------- */
BW.db.roster = async cid => (await col("classes", cid, "members").get()).docs.map(memberRow).sort((a, b) => a.display_name.localeCompare(b.display_name));
BW.db.leaderboard = async cid => { try { return await BW.db.roster(cid); } catch (e) { if (e.code === "permission-denied") return []; throw e; } };
BW.db.results = async (cid, quizIds) => {
  let q = col("classes", cid, "results");
  if (quizIds) q = q.where("quizId", "in", quizIds.slice(0, 30));
  return (await q.orderBy("finishedAt", "desc").limit(2000).get()).docs.map(resultRow);
};
BW.db.studentResults = async (cid, sid) => (await col("classes", cid, "results").where("uid", "==", sid).orderBy("finishedAt", "desc").limit(60).get()).docs.map(resultRow);

/* per-student effort and topic bests are kept on each class entry (cheap to read on the free plan) */
BW.updateMemberStats = async (cid, answers, quizId, pct) => {
  const r = ref("classes", cid, "members", me()), cur = (await r.get()).data() || {}, st = { ...(cur.stats || {}) }, wk = BW.weekKey();
  const ms = answers.reduce((s, a) => s + (a.ms || 0), 0);
  st.answered = (st.answered || 0) + answers.length; st.firstTry = (st.firstTry || 0) + answers.filter(a => (a.try || 1) === 1).length;
  st.firstTryOk = (st.firstTryOk || 0) + answers.filter(a => (a.try || 1) === 1 && a.ok).length; st.retries = (st.retries || 0) + answers.filter(a => (a.try || 1) > 1).length;
  st.totalMs = (st.totalMs || 0) + ms; st.weekMs = st.weekKey === wk ? (st.weekMs || 0) + ms : ms; st.weekKey = wk; st.lastAnswer = new Date().toISOString();
  const best = { ...(cur.best || {}) }, tries = { ...(cur.tries || {}) }, k = keyOf(quizId);
  best[k] = Math.max(best[k] || 0, pct); tries[k] = (tries[k] || 0) + 1;
  return { stats: st, best, tries };
};

/* ---------- reports (worked out in the teacher's browser from class results) ---------- */
const reportFor = (task, roster, res) => roster.map(m => {
  const items = task.quiz_ids.map(q => { const mine = res.filter(r => r.uid === m.student_id && r.quiz_id === q && r.finished_at >= (task.created_at || ""));
    const passed = mine.filter(r => r.pct * 100 >= task.target_pct).map(r => r.finished_at).sort();
    return { quiz_id: q, best: mine.length ? Math.max(...mine.map(r => r.pct)) : null, tries: mine.length, completed_at: passed[0] || null, last_at: mine.map(r => r.finished_at).sort().pop() || null, results: mine }; });
  const tries = items.reduce((s, i) => s + i.tries, 0), done = items.filter(i => i.completed_at);
  return { student_id: m.student_id, display_name: m.display_name, avatar_color: m.avatar_color, managed: m.managed, best: tries ? items.reduce((s, i) => s + (i.best || 0), 0) / items.length : null, tries,
    completed_at: done.length === items.length ? done.map(i => i.completed_at).sort().pop() : null, last_at: items.map(i => i.last_at).filter(Boolean).sort().pop() || null, items_done: done.length, items };
});
BW.db.assignmentReport = async (cid, tid) => {
  const [task, roster] = await Promise.all([BW.db.task(cid, tid), BW.db.roster(cid)]);
  return reportFor(task, roster, await BW.db.results(cid, task.quiz_ids));
};
BW.db.assignmentSummary = async cid => {   // one read of the tasks, members and results, however many tasks there are
  const [tasks, roster, res] = await Promise.all([BW.db.tasks(cid), BW.db.roster(cid), BW.db.results(cid)]);
  return tasks.map(t => { const rows = reportFor(t, roster, res), started = rows.filter(r => r.tries > 0);
    return { assignment_id: t.id, students: rows.length, started: started.length, completed: rows.filter(r => r.completed_at).length,
      on_time: rows.filter(r => r.completed_at && (!t.due_at || r.completed_at <= t.due_at)).length,
      avg_best: started.length ? started.reduce((s, r) => s + r.best, 0) / started.length : null, avg_items_done: rows.length ? rows.reduce((s, r) => s + r.items_done, 0) / rows.length : 0 }; });
};
BW.db.questionStats = async (cid, tid) => {
  const task = await BW.db.task(cid, tid), res = (await BW.db.results(cid, task.quiz_ids)).filter(r => r.finished_at >= (task.created_at || ""));
  const per = {};
  res.forEach(r => r.answers.forEach(a => { const k = `${a.q_key}|${r.id}|${a.q_code}`;
    const p = per[k] = per[k] || { key: a.q_key, uid: r.uid, tries: 0, ftc: false, ms: 0, sample: a.q_text, type: a.q_type, topic: a.topic };
    p.tries = Math.max(p.tries, a.try_no); p.ftc = p.ftc || (a.is_correct && a.try_no === 1); p.ms += a.ms; }));
  const byKey = {};
  Object.values(per).forEach(p => (byKey[p.key] = byKey[p.key] || []).push(p));
  return Object.entries(byKey).map(([key, ps]) => {
    const wrong = {}; res.forEach(r => r.answers.forEach(a => { if (a.q_key === key && !a.is_correct) wrong[a.answer] = (wrong[a.answer] || 0) + 1; }));
    const common = Object.entries(wrong).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))[0];
    return { q_key: key, sample: ps[0].sample, q_type: ps[0].type, topic: ps[0].topic, answered: ps.length, students: new Set(ps.map(p => p.uid)).size,
      first_try_pct: ps.filter(p => p.ftc).length / ps.length, avg_ms: ps.reduce((s, p) => s + p.ms, 0) / ps.length, avg_tries: ps.reduce((s, p) => s + p.tries, 0) / ps.length, common_wrong: common ? common[0] : null };
  }).sort((a, b) => a.first_try_pct - b.first_try_pct || b.answered - a.answered);
};
BW.db.topicStats = async cid => (await BW.db.roster(cid)).flatMap(m => {
  const topics = {};
  Object.entries(m.best).forEach(([k, pct]) => { const [u, s, lvl] = k.split("_"); if (lvl == null || !/^[0-3]$/.test(lvl)) return;
    const t = topics[`${u}.${s}`] = topics[`${u}.${s}`] || { student_id: m.student_id, topic: `${u}.${s}`, best: 0, medals: 0, tries: 0 };
    t.best = Math.max(t.best, pct); if (pct >= BW.PASS) t.medals++; t.tries += m.tries[k] || 0; });
  return Object.values(topics);
});
BW.db.studentStats = async cid => { const wk = BW.weekKey();
  return (await BW.db.roster(cid)).map(m => { const s = m.stats || {};
    return { student_id: m.student_id, answered: s.answered || 0, first_try: s.firstTry || 0, first_try_ok: s.firstTryOk || 0, retries: s.retries || 0,
      total_ms: s.totalMs || 0, week_ms: s.weekKey === wk ? s.weekMs || 0 : 0, avg_ms: s.answered ? s.totalMs / s.answered : null, last_answer: s.lastAnswer || null }; }); };

/* ---------- the school directory and school-managed logins ---------- */
BW.db.directory = async () => (await col("users").where("schoolId", "==", BW.S.profile.school_id).get()).docs.map(d => BW.toProfile(d.id, d.data()))
  .sort((a, b) => (a.role === b.role ? 0 : a.role === "teacher" ? -1 : 1) || a.display_name.localeCompare(b.display_name));
BW.db.createStudents = async ({ names, classIds = [] }) => {
  const sec = firebase.initializeApp(BW.CONFIG.firebase, "pupil-maker-" + Date.now()), secAuth = sec.auth(), out = [];
  await secAuth.setPersistence(firebase.auth.Auth.Persistence.NONE);
  try {
    for (const name of names) {
      const pw = pupilPassword(); let username = "", newUid = null, failed = "";
      for (let t = 0; t < 5 && !newUid && !failed; t++) {
        username = `${slug(name)}${100 + rnd(900)}`;
        try { newUid = (await secAuth.createUserWithEmailAndPassword(`${username}@${BW.CONFIG.pupilDomain}`, pw)).user.uid; await secAuth.signOut(); }
        catch (e) { if (e.code !== "auth/email-already-in-use") failed = BW.errMsg(e); }
      }
      if (!newUid) { out.push({ name, error: failed || "Couldn't make a unique username" }); continue; }
      const colour = BW.pick(["#5B4BD5", "#1F7A8C", "#B0306E", "#C2410C", "#167A4B", "#2563EB", "#B3261E", "#6D28D9"]), b = BW.fs.batch();
      b.set(ref("users", newUid), { role: "student", displayName: name.slice(0, 40), avatarColor: colour, schoolId: BW.S.profile.school_id, managed: true, username, createdBy: me(),
        classIds, xp: 0, weekXp: 0, weekKey: "", streak: 0, bestStreak: 0, lastDay: null, prefs: {}, createdAt: FV.serverTimestamp() });
      classIds.forEach(cid => b.set(ref("classes", cid, "members", newUid), { uid: newUid, displayName: name.slice(0, 40), avatarColor: colour, managed: true, username,
        joinedAt: FV.serverTimestamp(), xp: 0, weekXp: 0, weekKey: "", streak: 0, lastDay: null, medals: 0, quizzes: 0, lastActive: null }));
      try { await b.commit(); out.push({ name, username, password: pw, uid: newUid }); } catch (e) { out.push({ name, error: BW.errMsg(e) }); }
    }
  } finally { await sec.delete().catch(() => { }); }
  return { students: out };
};
BW.db.setClasses = async (sid, want) => {   // put a school-managed student into exactly these (of my) classes
  const p = (await ref("users", sid).get()).data(), mine = new Set(BW.myClasses().map(c => c.id)), have = (p.classIds || []).filter(c => mine.has(c));
  const add = want.filter(c => !have.includes(c)), drop = have.filter(c => !want.includes(c)), b = BW.fs.batch();
  add.forEach(cid => b.set(ref("classes", cid, "members", sid), { uid: sid, displayName: p.displayName, avatarColor: p.avatarColor, managed: true, username: p.username || null,
    joinedAt: FV.serverTimestamp(), xp: p.xp || 0, weekXp: p.weekXp || 0, weekKey: p.weekKey || "", streak: p.streak || 0, lastDay: p.lastDay || null, medals: 0, quizzes: 0, lastActive: null }));
  drop.forEach(cid => b.delete(ref("classes", cid, "members", sid)));
  b.update(ref("users", sid), { classIds: [...new Set([...(p.classIds || []).filter(c => !drop.includes(c)), ...add])] });
  await b.commit();
};
BW.db.profileOf = async sid => BW.toProfile(sid, (await ref("users", sid).get()).data() || {});
BW.db.removeMember = (cid, sid) => ref("classes", cid, "members", sid).delete();   // students who joined with a code: their own list tidies itself on next load
BW.db.renameStudent = async (sid, name) => {
  const p = (await ref("users", sid).get()).data(), b = BW.fs.batch();
  b.update(ref("users", sid), { displayName: name.slice(0, 40) });
  (p.classIds || []).filter(c => BW.classById(c)).forEach(cid => b.update(ref("classes", cid, "members", sid), { displayName: name.slice(0, 40) }));
  await b.commit();
};
BW.db.removeFromSchool = async sid => {
  const p = (await ref("users", sid).get()).data(), b = BW.fs.batch();
  (p.classIds || []).forEach(cid => b.delete(ref("classes", cid, "members", sid)));
  b.delete(ref("users", sid)); await b.commit();
};

/* ---------- notices (the student message centre) ---------- */
BW.db.postNotice = async ({ title, body, classIds, pinned }) => {
  const gid = newId(), b = BW.fs.batch(), name = BW.S.profile.display_name;
  classIds.forEach(cid => b.set(ref("classes", cid, "notices", gid), { title: title.slice(0, 120), body: body.slice(0, 4000), authorId: me(), authorName: name,
    createdAt: FV.serverTimestamp(), pinned: !!pinned, groupId: gid, className: BW.classById(cid)?.name || "" }));
  await b.commit(); return gid;
};
BW.db.classNotices = async cid => (await col("classes", cid, "notices").orderBy("createdAt", "desc").limit(50).get()).docs.map(d => ({ id: d.id, ...d.data(), created_at: ts(d.data().createdAt) }));
BW.db.deleteNotice = (cid, nid) => ref("classes", cid, "notices", nid).delete();
BW.db.pinNotice = (cid, nid, pinned) => ref("classes", cid, "notices", nid).update({ pinned });
BW.loadNotices = async () => {
  const S = BW.S, byId = {};
  const [lists, reads] = await Promise.all([Promise.all(S.classes.filter(c => !c.archived).map(c => BW.db.classNotices(c.id).then(ns => ns.map(n => ({ ...n, class_name: c.name }))).catch(() => []))),
    col("users", S.user.id, "reads").get().catch(() => ({ docs: [] }))]);
  const read = new Set(reads.docs.map(d => d.id));
  lists.flat().forEach(n => { const x = byId[n.id] = byId[n.id] || { id: n.id, title: n.title, body: n.body, author_name: n.authorName, created_at: n.created_at, pinned: n.pinned, classes: [], read: read.has(n.id) };
    x.classes.push(n.class_name); x.pinned = x.pinned || n.pinned; });
  return Object.values(byId).sort((a, b) => (b.pinned - a.pinned) || (b.created_at || "").localeCompare(a.created_at || ""));
};
BW.db.markRead = nid => ref("users", me(), "reads", nid).set({ at: FV.serverTimestamp() });

/* ---------- misc ---------- */
BW.db.codeSolution = async id => { const d = await ref("codeSolutions", id).get(); return d.exists ? d.data().solution : null; };
BW.db.updateProfile = async patch => {
  if (BW.S.profile.managed && "display_name" in patch) fail("managed_locked");
  const map = { display_name: "displayName", avatar_color: "avatarColor", prefs: "prefs" };
  await ref("users", me()).update(Object.fromEntries(Object.entries(patch).map(([k, v]) => [map[k] || k, v])));
  (BW.S.profile.class_ids || []).forEach(cid => { const m = {}; if (patch.display_name) m.displayName = patch.display_name; if (patch.avatar_color) m.avatarColor = patch.avatar_color;
    if (Object.keys(m).length) ref("classes", cid, "members", me()).update(m).catch(() => { }); });
};
BW.db.deleteSelf = async password => {
  const S = BW.S, u = BW.auth.currentUser;
  if (S.profile.managed) fail("managed_locked");
  await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email, password));
  if (S.profile.role === "teacher") for (const c of BW.myClasses()) await BW.db.deleteClass(c.id);   // a teacher's classes, tasks and notices go with them
  for (const cid of S.profile.class_ids || []) {
    const mine = await col("classes", cid, "results").where("uid", "==", u.uid).get().catch(() => ({ docs: [] }));
    const b = BW.fs.batch(); mine.docs.forEach(d => b.delete(d.ref)); b.delete(ref("classes", cid, "members", u.uid)); await b.commit().catch(() => { });
  }
  for (const sub of ["attempts", "best", "badges", "daily", "reads"]) {
    const q = await col("users", u.uid, sub).get();
    for (let i = 0; i < q.docs.length; i += 400) { const b = BW.fs.batch(); q.docs.slice(i, i + 400).forEach(d => b.delete(d.ref)); await b.commit(); }
  }
  await ref("users", u.uid).delete();
  await u.delete();
};

/* the same operation names the screens already call */
BW.api.rpc = async (name, a = {}) => {
  switch (name) {
    case "start_attempt": return BW.startAttempt(a.p_quiz_id, a.p_assignment);
    case "finish_attempt": return BW.finishAttempt({ id: a.p_attempt, total: a.p_total, correct: a.p_correct, maxCombo: a.p_max_combo || 0, answers: a.p_answers || [], activeMs: a.p_active_ms || 0 });
    case "my_assignments": return BW.computeTasks();
    case "join_class": return BW.db.joinClass(a.p_code);
    case "become_teacher": return BW.db.becomeTeacher(a.p_code);
    case "create_class": return BW.db.createClass(a.p_name);
    case "regenerate_code": return BW.db.regenerateCode(a.p_class);
    case "class_leaderboard": return BW.db.leaderboard(a.p_class);
    case "class_roster": return BW.db.roster(a.p_class);
    case "class_assignment_summary": return BW.db.assignmentSummary(a.p_class);
    case "assignment_report": return BW.db.assignmentReport(a.p_class, a.p_assignment);
    case "assignment_question_stats": return BW.db.questionStats(a.p_class, a.p_assignment);
    case "class_topic_stats": return BW.db.topicStats(a.p_class);
    case "class_student_stats": return BW.db.studentStats(a.p_class);
  }
  throw new Error("Unknown operation " + name);
};
BW.api.fn = async (action, body = {}) => {
  if (action === "create_students") return BW.db.createStudents({ names: body.names, classIds: body.class_ids || (body.class_id ? [body.class_id] : []) });
  if (action === "reset_password") fail("spark_no_reset");
  if (action === "delete_student") { await BW.db.removeFromSchool(body.student_id); return { ok: true }; }
  if (action === "delete_self") { await BW.db.deleteSelf(body.password); return { ok: true }; }
  throw new Error("Unknown action " + action);
};
