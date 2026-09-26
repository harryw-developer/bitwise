/* Building quizzes: topic levels, boss battles, quick-fire modes */
BW.bankQ = (row, u, s) => { const [d, q, a, w, why] = row; return { type: "mc", q, answer: a, options: BW.shuffle([a, ...w]), why, d, src: s.title, key: "b:" + q }; };
BW.genQ = (name, d, s) => { try { const q = BW.gen[name](d); if (q) { q.d = d; q.src = s ? s.title : q.src || ""; q.key = "g:" + name; } return q; } catch (e) { console.warn(name, e); return null; } };
BW.interactives = (u, s, dset = [1, 2, 3]) => {
  const out = (BW.X[u.id + "." + s.id] || []).map(r => BW.xQuestion(r, s.title));
  (s.igen || []).forEach(g => { const q = BW.genQ(g, BW.pick(dset), s); if (q) out.push(q); });
  return BW.shuffle(out);
};
const qKey = q => q.q + (q.pre || "") + (q.items ? q.items.join() : "") + (q.expr || "");

BW.oneFrom = ({ u, s }, dset = [1, 2, 3], interactive = .25) => {
  if (Math.random() < interactive) { const x = BW.interactives(u, s, dset)[0]; if (x) return x; }
  const d = BW.pick(dset), gens = s.gen || [], bank = s.bank || [];
  if (gens.length && (!bank.length || Math.random() < .6)) { const q = BW.genQ(BW.pick(gens), d, s); if (q) return q; }
  const rows = bank.filter(r => dset.includes(r[0]));
  return BW.bankQ(BW.pick(rows.length ? rows : bank), u, s);
};

BW.buildSubQuiz = (u, s, li) => {
  const L = BW.LEVELS[li], gens = s.gen || [], bank = s.bank || [], seen = new Set(), out = [];
  const add = q => { if (q && !seen.has(qKey(q))) { seen.add(qKey(q)); out.push(q); return true; } return false; };
  const inter = BW.interactives(u, s, L.d), slots = Math.min(inter.length, li === 0 ? 1 : 2);
  const n = L.n - slots;
  const pool = BW.shuffle(bank.filter(r => L.d.includes(r[0]))), rest = BW.shuffle(bank.filter(r => !L.d.includes(r[0])));
  const bankTarget = gens.length ? Math.min(pool.length, Math.ceil(n * .35)) : n;
  pool.slice(0, bankTarget).forEach(r => add(BW.bankQ(r, u, s)));
  if (li === 3) BW.shuffle(u.subs.filter(x => x !== s)).slice(0, 3).forEach(x => add(BW.oneFrom({ u, s: x }, [2, 3], 0)));
  if (!gens.length) for (const r of pool.slice(bankTarget).concat(rest)) { if (out.length >= n) break; add(BW.bankQ(r, u, s)); }
  let guard = 0;
  while (gens.length && out.length < n && guard++ < 200) add(BW.genQ(BW.pick(gens), BW.pick(L.d), s));
  const main = BW.shuffle(out.slice(0, n));
  inter.slice(0, slots).forEach(q => main.splice(1 + Math.floor(Math.random() * main.length), 0, q));
  return main;
};
BW.buildMix = (pairs, n, dset, interactive = .25) => {
  const out = [], seen = new Set(); let i = 0, guard = 0;
  while (out.length < n && guard++ < n * 20) { const q = BW.oneFrom(pairs[i++ % pairs.length], dset, interactive); if (q && !seen.has(qKey(q))) { seen.add(qKey(q)); out.push(q); } }
  return out;
};
BW.buildGenMix = (names, n, dset) => { const out = [], seen = new Set(); let g = 0;
  while (out.length < n && g++ < 300) { const q = BW.genQ(BW.pick(names), BW.pick(dset)); if (q && !seen.has(qKey(q))) { seen.add(qKey(q)); out.push(q); } } return out; };

BW.quickModes = [
  { id: "daily", title: "Daily Challenge", sub: "10 questions from across the course, with bonus XP once a day", c1: "#F15BB5", c2: "#FF9F1C", motif: "ridges" },
  { id: "speed", title: "Speed Run", sub: "60 seconds on the clock. Wrong answers cost 3 seconds", c1: "#FB5607", c2: "#6C5CE7", motif: "waves" },
  { id: "blitz", title: "Binary Blitz", sub: "Flip bits and convert between binary, denary and hex", c1: "#6C5CE7", c2: "#00BBF9", motif: "bits" },
  { id: "logic", title: "Logic Lab", sub: "Wire up circuits and complete truth tables", c1: "#14213D", c2: "#22C55E", motif: "gates" },
  { id: "tracer", title: "Code Tracer", sub: "Trace loops, arrays, strings and SQL", c1: "#00BBF9", c2: "#9B5DE5", motif: "brackets" },
  { id: "weak", title: "Weak Spots", sub: "Targets the topics where you have the fewest medals", c1: "#FB5607", c2: "#FFBE0B", motif: "bars" }
];
const SPEED_GENS = ["binToDen", "denToBin", "hexToDen", "denToHex", "arith", "logicEval", "dataType", "ipv4", "units", "colours", "testData"];

BW.startQuick = (id, assignment) => {
  const m = BW.quickModes.find(x => x.id === id); if (!m) return;
  let qs = [], mode = "practice", more = null;
  if (id === "daily") { const r = BW.rng("day" + BW.dayKey()); qs = BW.buildMix(BW.shuffle(BW.allSubs(), r).slice(0, 10), 10, [1, 2, 3], .3); }
  if (id === "speed") { mode = "speed"; more = () => BW.genQ(BW.pick(SPEED_GENS), BW.pick([1, 2])); qs = [more(), more(), more()]; }
  if (id === "blitz") qs = BW.buildGenMix(["binToDen", "denToBin", "hexToDen", "denToHex", "binToHex", "hexToBin", "binAdd", "bitsDen", "bitsHex", "bitsAdd", "bitsShift"], 12, [1, 2, 3]);
  if (id === "logic") qs = BW.buildGenMix(["gateSet", "ttGrid", "logicEval", "truthTable"], 10, [1, 2, 3]);
  if (id === "tracer") qs = BW.buildGenMix(["traceLoop", "arrays", "strings", "sqlRows", "arith", "orderBubble"], 10, [1, 2, 3]);
  if (id === "weak") { const subs = BW.allSubs().sort((a, b) => BW.subStars(a.u, a.s) - BW.subStars(b.u, b.s) || Math.random() - .5).slice(0, 10); qs = BW.buildMix(subs, 10, [1, 2], .3); }
  const qid = id === "daily" && !assignment ? "daily." + BW.dayKey() : "quick." + id;
  BW.startQuiz({ id: qid, title: m.title, crumb: "Quick fire", mode, mult: id === "daily" ? 1.5 : 1.2, qs, more, back: assignment ? ["tasks"] : ["home"], assignment, cover: [m.c1, m.c2, m.motif] });
};
BW.startSub = (uid, sid, li, assignment) => {
  const { u, s } = BW.findSub(uid, sid), L = BW.LEVELS[li];
  BW.startQuiz({ id: BW.qid(u, s, li), title: s.title, crumb: `${L.name} · ${u.title}`, level: li, mode: L.mode, mult: L.mult, qs: BW.buildSubQuiz(u, s, li), back: assignment ? ["tasks"] : ["sub", { uid, sid }], assignment, lives: L.mode === "exam" ? 3 : 0 });
};
BW.startBoss = (uid, assignment) => {
  const u = BW.findUnit(uid);
  BW.startQuiz({ id: u.id + ".boss", title: BW.BOSSES[u.id], crumb: `Boss battle · ${u.title}`, mode: "boss", mult: 1.8, lives: 3, unit: u,
    qs: BW.buildMix(BW.shuffle(u.subs).map(s => ({ u, s })), 15, [1, 2, 3], .25), back: assignment ? ["tasks"] : ["unit", { uid }], assignment });
};
BW.startById = (quizId, assignment) => {
  const [a, b, c] = quizId.split(".");
  if (a === "quick") return BW.startQuick(b, assignment);
  if (a === "code") return BW.findChallenge(b) ? BW.go("code", { cid: b, a: assignment || null }) : BW.toast("That challenge isn't available any more.");
  if (b === "boss") return BW.startBoss(a, assignment);
  if (BW.findSub(a, b)?.s) return BW.startSub(a, b, +c || 0, assignment);
  BW.toast("That quiz isn't available any more.");
};
