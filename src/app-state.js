/* Signed-in state, levels, badges, progress helpers */
BW.LEVELS = [
  { key: "b", name: "Bronze", hex: "#8F5424", ink: "#FFFFFF", n: 6, d: [1], mult: 1, mode: "standard", blurb: "Warm-up: core facts and the easiest calculations. Wrong answers come back until you get them right." },
  { key: "s", name: "Silver", hex: "#8A96A3", ink: "#16181B", n: 8, d: [1, 2], mult: 1.2, mode: "standard", blurb: "Recall and application, with hands-on activities. Wrong answers come back at the end." },
  { key: "g", name: "Gold", hex: "#D9A21B", ink: "#16181B", n: 10, d: [2, 3], mult: 1.5, mode: "standard", blurb: "Exam-style questions and harder calculations." },
  { key: "p", name: "Platinum", hex: "#4353E0", ink: "#FFFFFF", n: 12, d: [1, 2, 3], mult: 2, mode: "exam", blurb: "Exam mode: three lives and no second chances. Some questions come from the rest of the unit." }
];
BW.PASS = 0.8;
BW.TITLES = [[1, "Bit Rookie"], [3, "Nibble Ninja"], [5, "Byte Wrangler"], [7, "Packet Pilot"], [10, "Kernel Knight"], [13, "Algorithm Ace"], [16, "Binary Boss"], [20, "Silicon Sage"]];
BW.BADGES = {
  first_steps: ["First Steps", "Finish your first quiz", "01"], daily_done: ["Daily Dose", "Complete a Daily Challenge", "24h"],
  perfect: ["Flawless", "Score 100% on a quiz of 6 or more questions", "100"], combo_10: ["Combo King", "Get 10 answers right in a row", "x10"],
  streak_3: ["On Fire", "Reach a 3-day streak", "3d"], streak_7: ["Week Warrior", "Reach a 7-day streak", "7d"], streak_30: ["Unstoppable", "Reach a 30-day streak", "30d"],
  gold_rush: ["Gold Rush", "Pass any Gold quiz", "Au"], platinum: ["Platinum Mind", "Pass a Platinum exam-mode quiz", "Pt"], boss_slayer: ["Boss Slayer", "Defeat a unit boss", "HP"],
  binary_brain: ["Binary Brain", "Pass Gold or Platinum in Binary or Hexadecimal", "1010"], logic_lord: ["Logic Lord", "Pass Gold or Platinum in Truth Tables or Logic Expressions", "&&"],
  speed_demon: ["Speed Demon", "Get 15 right in one Speed Run", "60s"], xp_1000: ["Kilobyte", "Earn 1,000 XP", "KB"], xp_5000: ["Megabyte", "Earn 5,000 XP", "MB"],
  quiz_25: ["Dedicated", "Finish 25 quizzes", "25"], first_program: ["Hello World", "Pass every test in a coding challenge", "py"], code_10: ["Code Cruncher", "Solve 10 coding challenges", "</>"], on_time: ["Punctual", "Hit a task's target before it's due", "OK"], all_rounder: ["All-Rounder", "Earn a medal in all 11 units", "11"]
};
BW.BOSSES = { arch: "Overclocked Core", mem: "The Byte Hoarder", net: "Packet Storm", sec: "Malware Monarch", sys: "Rogue Kernel", eth: "The Data Broker", alg: "Infinite Loop", prog: "Syntax Serpent", robust: "Edge Case", logic: "The Gatekeeper", lang: "The Compiler" };

BW.londonDay = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
BW.dayKey = BW.londonDay;
BW.weekKey = (d = new Date()) => {
  const [y, m, dd] = BW.londonDay(d).split("-").map(Number), t = new Date(Date.UTC(y, m - 1, dd));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, "0")}`;
};
BW.levelOf = xp => { let L = 1, need = 100, acc = 0; while (xp >= acc + need) { acc += need; L++; need = 100 * L; } return { L, into: xp - acc, need }; };
BW.titleOf = L => BW.TITLES.filter(t => L >= t[0]).pop()[1];

BW.S = { user: null, profile: null, best: {}, badges: {}, hist: [], recent: [], classes: [], tasks: [], notices: [], school: null };
BW.isTeacher = () => BW.S.profile?.role === "teacher";
/* after any saved quiz or code submission: refresh tasks and celebrate any homework that has just been finished */
BW.afterWork = async () => {
  if (BW.isTeacher()) return;
  const before = new Map(BW.S.tasks.map(t => [t.id, !!t.completed_at]));
  try { await BW.refreshTasks(); } catch (e) { return; }
  BW.renderRail(); if (BW.route.name === "tasks") BW.render();
  BW.S.tasks.filter(t => t.completed_at && before.has(t.id) && !before.get(t.id)).forEach(t => BW.queueModal(() => BW.homeworkDone(t)));
};
BW.queueModal = show => { const tryShow = () => document.querySelector(".modal-wrap") ? setTimeout(tryShow, 400) : show(); setTimeout(tryShow, 1300); };
BW.homeworkDone = t => {
  BW.sfx.play("win"); BW.confetti(260); setTimeout(() => BW.confetti(200), 700);
  const k = t.items?.length || 1;
  BW.modal(`<div class="yay"><div class="yay-stars" aria-hidden="true">★ ★ ★</div><h2 class="yay-title"><span class="yay-big">!!YAY!!</span> Homework finished!</h2>
    <p class="muted">${BW.esc(t.title)} · ${k} item${k > 1 ? "s" : ""} done for ${BW.esc(t.class_name)}</p><button class="cta" data-close>Brilliant!</button></div>`);
};
BW.myClasses = () => BW.S.classes.filter(c => BW.isTeacher() ? c.teacher_id === BW.S.user.id : true);

/* favourites live in profile prefs so they follow the learner between devices */
BW.favs = () => BW.S.profile?.prefs?.favs || {};
let prefTimer = null;
BW.toggleFav = key => {
  const p = BW.S.profile, favs = { ...BW.favs() };
  favs[key] ? delete favs[key] : favs[key] = 1;
  p.prefs = { ...(p.prefs || {}), favs };
  clearTimeout(prefTimer);
  prefTimer = setTimeout(() => BW.db.updateProfile({ prefs: p.prefs }).catch(e => BW.toast(BW.errMsg(e))), 700);
  return !!favs[key];
};

BW.liveStreak = () => { const p = BW.S.profile; if (!p?.last_day) return 0; const y = new Date(Date.now() - 864e5); return p.last_day >= BW.londonDay(y) ? p.streak : 0; };
BW.weekXp = () => BW.S.profile?.week_key === BW.weekKey() ? BW.S.profile.week_xp : 0;

BW.allSubs = () => BW.units.flatMap(u => u.subs.map(s => ({ u, s })));
BW.findUnit = id => BW.units.find(u => u.id === id);
BW.findSub = (uid, sid) => { const u = BW.findUnit(uid); return u && { u, s: u.subs.find(s => s.id === sid) }; };
BW.qid = (u, s, li) => `${u.id}.${s.id}.${li}`;
BW.medalsFor = (u, s) => BW.LEVELS.map((L, i) => (BW.S.best[BW.qid(u, s, i)]?.pct || 0) >= BW.PASS);
BW.subStars = (u, s) => BW.medalsFor(u, s).filter(Boolean).length;
BW.unitMastery = u => u.subs.reduce((a, s) => a + BW.subStars(u, s), 0) / (u.subs.length * 4);
BW.totalMedals = () => BW.allSubs().reduce((a, { u, s }) => a + BW.subStars(u, s), 0);
BW.quizCount = () => BW.allSubs().length * 4 + BW.units.length + BW.quickModes.length + BW.CODE.all.length;
BW.qCount = s => (s.bank ? s.bank.length : 0);

/* describe any quiz id for task lists and teacher reports */
BW.quizLabel = id => {
  const [a, b, c] = id.split(".");
  if (a === "code") { const c = BW.findChallenge(b); return { title: c ? c.title : b, sub: c ? `Coding Lab · ${c.section.title}` : "Coding Lab", unit: null, code: true }; }
  if (a === "quick") { const m = BW.quickModes.find(x => x.id === b); return { title: m ? m.title : b, sub: "Quick fire", unit: null }; }
  const u = BW.findUnit(a); if (!u) return { title: id, sub: "", unit: null };
  if (b === "boss") return { title: `Boss battle: ${BW.BOSSES[a]}`, sub: u.title, unit: u };
  const s = u.subs.find(x => x.id === b);
  return { title: s ? s.title : b, sub: `${BW.LEVELS[+c]?.name || ""} · ${u.title}`, unit: u, sub_: s, level: +c };
};

BW.weeklyTargets = () => {
  const r = BW.rng("wk" + BW.weekKey()), all = BW.allSubs();
  const open = all.filter(({ u, s }) => !BW.medalsFor(u, s)[2]);
  const pool = BW.shuffle(open.length >= 3 ? open : all, r), picked = [], units = new Set();
  for (const x of pool) { if (!units.has(x.u.id)) { picked.push(x); units.add(x.u.id); } if (picked.length === 3) break; }
  const wk = BW.weekKey();
  return picked.map((x, i) => { const li = [0, 1, 1][i], id = BW.qid(x.u, x.s, li);
    return { ...x, li, done: BW.S.hist.some(h => h.quiz_id === id && +h.pct >= BW.PASS && BW.weekKey(new Date(h.finished_at)) === wk) }; });
};

/* fold a finish_attempt result into local state */
BW.applyResult = (res, quizId) => {
  const S = BW.S, p = S.profile;
  p.xp = res.xp; p.week_xp = res.week_xp; p.week_key = BW.weekKey(); p.streak = res.streak; p.last_day = BW.londonDay();
  p.best_streak = Math.max(p.best_streak || 0, res.streak);
  const b = S.best[quizId]; S.best[quizId] = { pct: Math.max(+res.pct, b?.pct || 0), tries: (b?.tries || 0) + 1, last: new Date().toISOString() };
  S.hist.unshift({ quiz_id: quizId, pct: res.pct, xp: res.xp_gain, finished_at: new Date().toISOString() });
  (res.badges || []).forEach(k => S.badges[k] = new Date().toISOString());
};
