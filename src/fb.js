/* Firebase data layer (Auth + Firestore). Keeps the same operations the screens used before (BW.api.rpc / BW.api.fn / BW.db),
   now implemented against Firestore, with the security rules in firebase/firestore.rules doing the server's checking. */
BW.fbApp = firebase.initializeApp(BW.CONFIG.firebase);
BW.auth = firebase.auth();
BW.fs = firebase.firestore();
// plain HTTP requests instead of a streaming connection: school proxies, filters and some browsers stall the stream,
// which left the loading screen spinning until a refresh
BW.fs.settings({ experimentalForceLongPolling: true, experimentalAutoDetectLongPolling: false });
const FV = firebase.firestore.FieldValue;
const col = (...p) => BW.fs.collection(p.join("/"));
const ref = (...p) => BW.fs.doc(p.join("/"));
const ts = v => v && typeof v.toDate === "function" ? v.toDate().toISOString() : v ?? null;
const utcDay = d => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
/* A request that never answers (a sleeping laptop, flaky school Wi-Fi) shouldn't leave a page spinning for ever */
BW.withTimeout = (p, ms = 20000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => { const e = new Error("timeout"); e.code = "timeout"; rej(e); }, ms))]);
/* After the tab has been asleep or the network dropped, Firestore can sit in a long back-off before reconnecting,
   which is what made pages hang until a refresh. Reconnect straight away instead. */
BW.reconnect = () => BW.fs.disableNetwork().then(() => BW.fs.enableNetwork()).catch(() => { });
{ let hiddenAt = 0;
  document.addEventListener("visibilitychange", () => { if (document.hidden) hiddenAt = Date.now(); else if (hiddenAt && Date.now() - hiddenAt > 20000) BW.reconnect(); });
  addEventListener("online", BW.reconnect); }
const newId = () => BW.fs.collection("_").doc().id;
const CODE_ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const randCode = n => { const a = new Uint32Array(n); crypto.getRandomValues(a); return [...a].map(x => CODE_ABC[x % 32]).join(""); };
const AVATARS = ["#5B4BD5", "#1F7A8C", "#B0306E", "#C2410C", "#167A4B", "#2563EB", "#B3261E", "#6D28D9"];

const ERRORS = {
  "auth/invalid-credential": "That email or username and password don't match.",
  "auth/wrong-password": "That email or username and password don't match.",
  "auth/user-not-found": "That email or username and password don't match.",
  "auth/invalid-email": "That doesn't look like an email address or username.",
  "auth/email-already-in-use": "There's already an account with that email. Try signing in.",
  "auth/weak-password": "Use a longer password: at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
  "auth/requires-recent-login": "For your security, sign in again and then retry.",
  "auth/network-request-failed": "Can't reach Bitwise. Check your internet connection.",
  timeout: "This is taking too long. Check your connection and try again.",
  not_saved: "Couldn't reach Bitwise. Check your connection, then check your code again.",
  unavailable: "Can't reach Bitwise. Check your internet connection.",
  "auth/operation-not-allowed": "Email sign-in isn't switched on for this Bitwise project yet.",
  "auth/configuration-not-found": "Sign-in isn't set up for this Bitwise project yet (Firebase console → Authentication → Get started).",
  "permission-denied": "You don't have permission to do that.",
  bad_code: "That class code doesn't match an open class. Check it with your teacher.",
  own_class: "That's your own class, so you're already in it as the teacher.",
  bad_teacher_code: "That teacher code isn't right. Ask your school's Bitwise admin for it.",
  managed_locked: "Your school manages this account, so ask your teacher to make that change.",
  too_fast: "That quiz was finished too quickly to count, so it wasn't saved.",
  spark_no_reset: "School login passwords can't be reset. Use the login card from when the account was made, or remove the student from your school and create a new login.",
  not_found: "That couldn't be found. It may have been deleted.",
  forbidden: "You don't have access to that."
};
BW.errMsg = e => {
  const code = e?.code || "", m = (e && (e.message || e.error)) || String(e);
  for (const k in ERRORS) if (code === k || code.endsWith("/" + k) || m.includes(k)) return ERRORS[k];
  if (code === "permission-denied" || /insufficient permissions/i.test(m)) return ERRORS["permission-denied"];
  return /fetch|network|offline/i.test(m) ? "Can't reach Bitwise. Check your internet connection." : m;
};
const fail = code => { const e = new Error(code); e.code = code; throw e; };

/* ---------- shape converters (Firestore → the shapes the screens use) ---------- */
BW.toProfile = (id, d) => ({ id, role: d.role, display_name: d.displayName, avatar_color: d.avatarColor, school_id: d.schoolId || null, managed: !!d.managed,
  username: d.username || null, class_ids: d.classIds || [], xp: d.xp || 0, week_xp: d.weekXp || 0, week_key: d.weekKey || "", streak: d.streak || 0,
  best_streak: d.bestStreak || 0, last_day: d.lastDay ? BW.londonDay(d.lastDay.toDate()) : null, last_day_ts: d.lastDay || null, prefs: d.prefs || {}, created_by: d.createdBy || null });
BW.toClass = (id, d) => ({ id, name: d.name, join_code: d.joinCode, show_leaderboard: !!d.showLeaderboard, archived: !!d.archived, teacher_id: d.teacherId, school_id: d.schoolId, created_at: ts(d.createdAt) });
BW.toTask = (id, cid, d) => ({ id, class_id: cid, title: d.title, instructions: d.instructions || "", quiz_ids: d.quizIds, target_pct: d.targetPct, due_at: ts(d.dueAt), created_at: ts(d.createdAt) });
BW.ansRow = (a, i) => ({ seq: a.seq ?? i + 1, q_code: a.code || "", q_type: a.type, q_key: a.key || "", q_text: a.text || "", topic: a.topic || "", answer: a.answer || "",
  correct_answer: a.correct || "", is_correct: !!a.ok, try_no: a.try || 1, ms: a.ms || 0, detail: a.detail || null });

/* ---------- auth ---------- */
BW.api = {
  loginEmail: id => id.includes("@") ? id.trim() : `${id.trim().toLowerCase()}@${BW.CONFIG.pupilDomain}`,
  async signIn(id, pw) { await BW.auth.signInWithEmailAndPassword(BW.api.loginEmail(id), pw); },
  async signOut() { await BW.auth.signOut(); },
  async resetEmail(email) { await BW.auth.sendPasswordResetEmail(email.trim(), { url: location.origin + location.pathname }); },
  async changePassword(pw) { if (BW.S.profile?.managed) fail("managed_locked"); await BW.auth.currentUser.updatePassword(pw); },
  /* sign up: a student, a teacher joining a school with its teacher code, or a teacher creating a new school */
  async signUp({ email, password, name, role, teacherCode, schoolName }) {
    const cred = await BW.auth.createUserWithEmailAndPassword(email.trim(), password);
    const uid = cred.user.uid, batch = BW.fs.batch();
    const profile = { role: "student", displayName: name.slice(0, 40), avatarColor: BW.pick(AVATARS), schoolId: null, managed: false, classIds: [],
      xp: 0, weekXp: 0, weekKey: "", streak: 0, bestStreak: 0, lastDay: null, prefs: {}, createdAt: FV.serverTimestamp() };
    try {
      if (role === "teacher" && schoolName) {
        const sid = newId(), code = `${randCode(5)}-${randCode(5)}`;
        batch.set(ref("teacherCodes", code), { schoolId: sid });
        batch.set(ref("schools", sid), { name: schoolName.slice(0, 80), createdBy: uid, createdAt: FV.serverTimestamp(), teacherCode: code });
        Object.assign(profile, { role: "teacher", schoolId: sid });
      } else if (role === "teacher") {
        const snap = await ref("teacherCodes", teacherCode.trim().toUpperCase()).get();
        if (!snap.exists) fail("bad_teacher_code");
        Object.assign(profile, { role: "teacher", schoolId: snap.data().schoolId, teacherCode: teacherCode.trim().toUpperCase() });
      }
      batch.set(ref("users", uid), profile);
      await batch.commit();
    } catch (e) { await cred.user.delete().catch(() => { }); throw e; }   // don't leave a login with no profile behind
    cred.user.sendEmailVerification({ url: location.origin + location.pathname }).catch(() => { });
    return uid;
  }
};

/* ---------- loading a signed-in person's world ----------
   Everything that doesn't depend on the profile starts at the same time as the profile, so a student's home page
   needs three quick round trips and small downloads (attempt documents hold every answer, so only a few are fetched). */
const attemptLite = d => { const x = d.data(); return { id: d.id, quizId: x.quizId, pct: x.pct, xp: x.xp, finishedAt: ts(x.finishedAt) }; };
const quiet = p => p.catch(() => null);
const classBundle = cid => Promise.all([quiet(ref("classes", cid).get()), quiet(col("classes", cid, "tasks").get()),
  quiet(col("classes", cid, "notices").orderBy("createdAt", "desc").limit(50).get()), quiet(col("classes", cid, "resubs").where("uid", "==", BW.S.user.id).get())]);
/* a student's classes, tasks, notices and redo requests from the per-class downloads */
const applyStudent = async (got, reads) => {
  const S = BW.S;
  S.classes = got.filter(([c]) => c?.exists).map(([c]) => BW.toClass(c.id, c.data()));
  const live = new Set(S.classes.filter(c => !c.archived).map(c => c.id)), name = cid => S.classes.find(c => c.id === cid)?.name || "", ok = c => c?.exists && live.has(c.id);
  S.rawTasks = got.flatMap(([c, t]) => ok(c) && t ? t.docs.map(d => ({ ...BW.toTask(d.id, c.id, d.data()), class_name: name(c.id) })) : []);
  S.resubs = Object.fromEntries(got.flatMap(([c, , , r]) => ok(c) && r ? r.docs.map(d => [d.data().taskId, { ...BW.resubRow(d), class_name: name(c.id) }]) : []));
  const read = new Set((reads?.docs || []).map(d => d.id));
  const redo = Object.values(S.resubs).filter(r => S.rawTasks.some(t => t.id === r.task_id)).map(r => { const id = `redo_${r.id}_${Date.parse(r.requested_at) || 0}`;
    return { id, title: `Please redo: ${r.task_title}`, body: r.reason || "Your teacher has asked you to have another go at this task.", author_name: r.teacher_name, created_at: r.requested_at,
      pinned: false, classes: [r.class_name], read: read.has(id), redo: r.task_id }; });
  S.notices = [...redo, ...BW.buildNotices(got.flatMap(([c, , n]) => ok(c) && n ? n.docs.map(d => ({ id: d.id, ...d.data(), created_at: ts(d.data().createdAt), class_name: name(c.id) })) : []), read)]
    .sort((a, b) => (b.pinned - a.pinned) || (b.created_at || "").localeCompare(a.created_at || ""));
  S.taskAtts = await BW.loadTaskAttempts(S.rawTasks);
  S.tasks = BW.buildTasks();
};
BW.loadAll = async () => {
  const S = BW.S, uid = S.user.id, mine = n => col("users", uid, n);
  const early = Promise.all([mine("best").get(), mine("badges").get(),
    mine("attempts").where("status", "==", "done").orderBy("finishedAt", "desc").limit(40).get(), quiet(mine("reads").get())]);
  early.catch(() => { });
  const psnap = await ref("users", uid).get();
  if (!psnap.exists) fail(S.user.email?.endsWith("@" + BW.CONFIG.pupilDomain) ? "removed_from_school" : "no_profile");
  const profile = BW.toProfile(uid, psnap.data()), teacher = profile.role === "teacher";
  const second = teacher ? Promise.all([col("classes").where("teacherId", "==", uid).get(), profile.school_id ? quiet(ref("schools", profile.school_id).get()) : null])
    : Promise.all(profile.class_ids.map(classBundle));
  const [[best, badges, hist, reads], got] = await Promise.all([early, second]);
  S.profile = profile;
  S.best = Object.fromEntries(best.docs.map(d => [d.id, { pct: +d.data().pct, tries: d.data().tries, last: ts(d.data().lastAt) }]));
  S.badges = Object.fromEntries(badges.docs.map(d => [d.id, ts(d.data().earnedAt)]));
  S.hist = hist.docs.map(attemptLite).map(a => ({ quiz_id: a.quizId, pct: a.pct, xp: a.xp, finished_at: a.finishedAt }));
  S.loadedAt = Date.now();
  if (teacher) {
    const [cls, school] = got;
    S.classes = cls.docs.map(d => BW.toClass(d.id, d.data())).sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
    S.school = school?.exists ? { id: school.id, ...school.data(), created_at: ts(school.data().createdAt) } : null;
    S.rawTasks = []; S.tasks = []; S.notices = []; S.taskAtts = {};
    return;
  }
  S.school = null;
  await applyStudent(got, reads);
};
/* attempts on the items of the student's tasks (only since each task was set), fetched 30 quizzes at a time */
BW.loadTaskAttempts = async tasks => {
  const since = {};
  tasks.forEach(t => t.quiz_ids.forEach(q => { const c = t.created_at || "2000-01-01T00:00:00.000Z"; if (!since[q] || c < since[q]) since[q] = c; }));
  const ids = Object.keys(since), out = Object.fromEntries(ids.map(q => [q, []]));
  const groups = []; for (let i = 0; i < ids.length; i += 30) groups.push(ids.slice(i, i + 30));
  await Promise.all(groups.map(async g => {
    const from = new Date(g.map(q => since[q]).sort()[0]);
    const snap = await col("users", BW.S.user.id, "attempts").where("quizId", "in", g).where("finishedAt", ">=", from).orderBy("finishedAt", "desc").limit(500).get();
    snap.docs.map(attemptLite).forEach(a => out[a.quizId].push(a));
  }));
  return out;
};
/* the student's tasks with progress on every item, worked out locally */
BW.buildTasks = () => {
  const S = BW.S, atts = S.taskAtts || {};
  return (S.rawTasks || []).map(t => {
    const r = S.resubs?.[t.id], sinceOf = q => r && r.quiz_ids.includes(q) && (r.requested_at || "") > (t.created_at || "") ? r.requested_at : t.created_at || "";
    const items = t.quiz_ids.map(q => { const since = sinceOf(q), mine = (atts[q] || []).filter(a => a.finishedAt >= since);
      const passed = mine.filter(a => a.pct * 100 >= t.target_pct).map(a => a.finishedAt).sort();
      return { quiz_id: q, best: mine.length ? Math.max(...mine.map(a => a.pct)) : null, tries: mine.length, completed_at: passed[0] || null }; });
    const itemsDone = items.filter(i => i.completed_at).length, tries = items.reduce((s, i) => s + i.tries, 0);
    return { ...t, resub: r || null, items, items_done: itemsDone, tries, best: tries ? items.reduce((s, i) => s + (i.best || 0), 0) / items.length : null,
      completed_at: itemsDone === items.length ? items.map(i => i.completed_at).sort().pop() : null };
  }).sort((a, b) => (a.due_at || "9999").localeCompare(b.due_at || "9999") || (b.created_at || "").localeCompare(a.created_at || ""));
};
BW.computeTasks = async () => { await BW.refreshStudent(true); return BW.S.tasks; };
BW.refreshTasks = async () => { if (!BW.isTeacher()) BW.S.tasks = BW.buildTasks(); };   // after a quiz: no downloads needed
/* new homework and notices while the app is open: re-check at most every couple of minutes */
BW.refreshStudent = async force => {
  const S = BW.S; if (BW.isTeacher() || !S.profile || (!force && Date.now() - (S.loadedAt || 0) < 120000)) return false;
  S.loadedAt = Date.now();
  const [psnap, reads] = await Promise.all([ref("users", S.user.id).get(), quiet(col("users", S.user.id, "reads").get())]);
  if (!psnap.exists) return false;
  const profile = BW.toProfile(S.user.id, psnap.data()), got = await Promise.all(profile.class_ids.map(classBundle));   // picks up classes a teacher has just added
  S.profile = profile;
  await applyStudent(got, reads);
  return true;
};

/* ---------- attempts: start, and finish with the exact XP the rules will check ---------- */
BW.quizMult = q => /\.0$/.test(q) ? 1.0 : /\.1$/.test(q) ? 1.2 : /\.2$/.test(q) ? 1.5 : /\.3$/.test(q) ? 2.0 : /\.boss$/.test(q) ? 1.8 : /^daily\./.test(q) ? 1.5 : /^code\./.test(q) ? 1.5 : 1.2;
BW.startAttempt = async (quizId, assignmentId) => {
  const r = col("users", BW.S.user.id, "attempts").doc();
  await BW.withTimeout(r.set({ quizId, assignmentId: assignmentId || null, status: "open", startedAt: FV.serverTimestamp() }));
  (BW.openAttempts = BW.openAttempts || {})[r.id] = quizId;
  return r.id;
};
BW.finishAttempt = async ({ id, total, correct, maxCombo = 0, answers = [], activeMs = 0 }) => {
  const S = BW.S, uid = S.user.id, attemptRef = ref("users", uid, "attempts", id);
  // read everything the score depends on in one go (we already know which quiz this attempt is for)
  const reads = q => Promise.all([ref("users", uid, "best", q).get(), q.startsWith("daily.") ? ref("users", uid, "daily", q).get() : null]);
  const hint = BW.openAttempts?.[id];
  let [att, prof, [bestSnap, dailySnap]] = await BW.withTimeout(Promise.all([attemptRef.get(), ref("users", uid).get(), hint ? reads(hint) : [null, null]]));
  if (!att.exists) fail("not_found");
  if (att.data().status === "done") {   // an earlier save that timed out on our side actually reached the server
    const a = att.data(), p = prof.data();
    return { xp_gain: a.xp, xp: p.xp, week_xp: p.weekXp, streak: p.streak, pct: a.pct, pass: a.correct * 5 >= a.total * 4, first_daily: false, badges: [] };
  }
  const quizId = att.data().quizId, mult = BW.quizMult(quizId), pct = correct / total, pass = correct * 5 >= total * 4;
  if (quizId !== hint) [bestSnap, dailySnap] = await reads(quizId);
  const p = prof.data(), prevBest = bestSnap.exists ? bestSnap.data().pct : 0, prevTries = bestSnap.exists ? bestSnap.data().tries : 0;
  let xp, firstDaily = false;
  if (quizId.startsWith("code.")) xp = pct > prevBest ? Math.round((pct - prevBest) * total * 10 * mult) + (pass && prevBest < 0.8 ? Math.round(20 * mult) : 0) : 0;
  else {
    xp = Math.round(correct * 10 * mult) + (pass ? Math.round(20 * mult) : 0) + (maxCombo >= 3 ? Math.min(maxCombo, 20) * 2 : 0);
    if (dailySnap && !dailySnap.exists) { firstDaily = true; xp += 30; }
  }
  const wk = BW.weekKey(), today = utcDay(new Date());
  const lastDay = p.lastDay ? utcDay(p.lastDay.toDate()) : null, yesterday = utcDay(new Date(Date.now() - 864e5));
  const streakGuess = lastDay === today ? p.streak : lastDay === yesterday ? p.streak + 1 : 1;
  // the server's date decides the streak; try our best guess first, then the other possibilities (clock drift around midnight)
  const candidates = [...new Set([streakGuess, p.streak, p.streak + 1, 1])];
  let lastErr, saved;
  for (const streak of candidates) {
    const b = BW.fs.batch();
    b.update(attemptRef, { status: "done", finishedAt: FV.serverTimestamp(), total, correct, pct, xp, maxCombo, activeMs: Math.max(0, Math.round(activeMs)), answers: answers.slice(0, 150) });
    if (firstDaily) b.set(ref("users", uid, "daily", quizId), { at: FV.serverTimestamp() });
    b.set(ref("users", uid, "best", quizId), { pct: Math.max(pct, prevBest), tries: prevTries + 1, lastAt: FV.serverTimestamp(), attempt: id });
    const upd = { xp: (p.xp || 0) + xp, weekXp: p.weekKey === wk ? (p.weekXp || 0) + xp : xp, weekKey: wk, streak, bestStreak: Math.max(p.bestStreak || 0, streak) };
    b.update(ref("users", uid), { ...upd, lastDay: FV.serverTimestamp(), lastAttempt: id });
    try { await BW.withTimeout(b.commit()); lastErr = null; saved = upd; break; } catch (e) { lastErr = e; if (e.code !== "permission-denied") break; }
  }
  if (lastErr) {
    const tooFast = (Date.now() - att.data().startedAt.toDate()) < total * 1500 + 2000;
    fail(tooFast ? "too_fast" : lastErr.code || "permission-denied");
  }
  const after = { ...p, ...saved, lastDay: firebase.firestore.Timestamp.now() };   // what the server now holds (no need to read it back)
  S.profile = BW.toProfile(uid, after);
  S.best[quizId] = { pct: Math.max(pct, prevBest), tries: prevTries + 1, last: new Date().toISOString() };
  if (S.taskAtts?.[quizId]) S.taskAtts[quizId].unshift({ id, quizId, pct, xp, finishedAt: new Date().toISOString() });
  delete BW.openAttempts?.[id];
  const badges = BW.newBadges({ quizId, pct, pass, total, correct, maxCombo, firstDaily, assignmentId: att.data().assignmentId });
  BW.shareResult(id, badges).catch(e => console.warn("class copy", e));   // leaderboards, teacher analytics, badges
  return { xp_gain: xp, xp: after.xp, week_xp: after.weekXp, streak: after.streak, pct, pass, first_daily: firstDaily, badges };
};
BW.newBadges = ({ quizId, pct, pass, total, correct, maxCombo, firstDaily, assignmentId }) => {
  const S = BW.S, p = S.profile, isCode = quizId.startsWith("code."), c = ["first_steps"];
  if (pct === 1 && total >= 6) c.push("perfect");
  if (p.streak >= 3) c.push("streak_3"); if (p.streak >= 7) c.push("streak_7"); if (p.streak >= 30) c.push("streak_30");
  if (pass && /\.2$/.test(quizId)) c.push("gold_rush"); if (pass && /\.3$/.test(quizId)) c.push("platinum"); if (pass && /\.boss$/.test(quizId)) c.push("boss_slayer");
  if (pass && ["mem.bin.2", "mem.hex.2", "mem.bin.3", "mem.hex.3"].includes(quizId)) c.push("binary_brain");
  if (pass && ["logic.tables.2", "logic.expressions.2", "logic.tables.3", "logic.expressions.3"].includes(quizId)) c.push("logic_lord");
  if (quizId === "quick.speed" && correct >= 15) c.push("speed_demon");
  if (maxCombo >= 10) c.push("combo_10"); if (p.xp >= 1000) c.push("xp_1000"); if (p.xp >= 5000) c.push("xp_5000");
  if (firstDaily) c.push("daily_done");
  if (isCode && pct === 1) c.push("first_program");
  if (Object.entries(S.best).filter(([q, b]) => q.startsWith("code.") && b.pct >= 1).length >= 10) c.push("code_10");
  if (Object.values(S.best).reduce((s, b) => s + (b.tries || 0), 0) >= 25) c.push("quiz_25");
  const task = assignmentId && S.tasks.find(t => t.id === assignmentId);
  if (task && pct * 100 >= task.target_pct && (!task.due_at || new Date(task.due_at) >= new Date())) c.push("on_time");
  if (new Set(Object.entries(S.best).filter(([q, b]) => /\.[0-3]$/.test(q) && b.pct >= BW.PASS).map(([q]) => q.split(".")[0])).size >= 11) c.push("all_rounder");
  return [...new Set(c)].filter(b => !S.badges[b]);
};
/* copy a finished attempt into each class (so teachers can analyse it), refresh leaderboard entries, award badges */
BW.shareResult = async (attemptId, badges) => {
  const S = BW.S, uid = S.user.id, a = (await ref("users", uid, "attempts", attemptId).get()).data(), p = (await ref("users", uid).get()).data();
  const medals = BW.totalMedals();
  // one small write per class, so a class the student has since left can't block the others
  await Promise.all((p.classIds || []).map(async cid => { const b = BW.fs.batch();
    const extra = await BW.updateMemberStats(cid, a.answers || [], a.quizId, a.pct).catch(() => ({}));
    b.update(ref("classes", cid, "members", uid), { displayName: p.displayName, avatarColor: p.avatarColor, xp: p.xp, weekXp: p.weekXp, weekKey: p.weekKey,
      streak: p.streak, lastDay: p.lastDay, medals, quizzes: FV.increment(1), lastActive: FV.serverTimestamp(), ...extra });
    b.set(ref("classes", cid, "results", attemptId), { uid, displayName: p.displayName, quizId: a.quizId, assignmentId: a.assignmentId || null, total: a.total,
      correct: a.correct, pct: a.pct, xp: a.xp, activeMs: a.activeMs, finishedAt: a.finishedAt, answered: (a.answers || []).length });
    b.set(ref("classes", cid, "answers", attemptId), { uid, quizId: a.quizId, finishedAt: a.finishedAt, answers: a.answers || [] });
    return b.commit().catch(e => console.warn("class", cid, e.code)); }));
  if (badges.length) { const b = BW.fs.batch();
    badges.forEach(k => { b.set(ref("users", uid, "badges", k), { earnedAt: FV.serverTimestamp() }); S.badges[k] = new Date().toISOString(); });
    await b.commit(); }
};
