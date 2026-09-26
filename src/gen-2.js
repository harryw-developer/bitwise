/* Interactive generators: bit toggles, logic circuits, truth-table grids, drag-to-order sorts */
(function (G) {
  const { ri, pick, shuffle, bin, hex } = BW;
  const places = (n, w = 8) => { const p = []; for (let i = w - 1; i >= 0; i--) if (n & (1 << i)) p.push(1 << i); return p.join(" + ") || "0"; };
  const bits = (q, n, why, extra = {}) => ({ type: "bits", q, answer: bin(n), why, ...extra });

  G.bitsDen = d => { const n = ri(d === 1 ? 1 : 20, 255); return bits(`Toggle the bits to make ${n}.`, n, `${n} = ${places(n)}.`, { showSum: d === 1 }); };
  G.bitsHex = d => { const n = ri(d === 1 ? 16 : 40, 255), h = hex(n).padStart(2, "0"); return bits(`Toggle the bits to show hex \`${h}\`.`, n, `${h[0]} = ${bin(n >> 4, 4)} and ${h[1]} = ${bin(n & 15, 4)}.`); };
  G.bitsAdd = d => { let a, b; do { a = ri(d === 1 ? 1 : 20, 200); b = ri(1, 120); } while (a + b > 255);
    return bits("Toggle the bits to show the 8-bit answer.", a + b, `${a} + ${b} = ${a + b} = ${bin(a + b)}.`, { pre: `  ${bin(a)}\n+ ${bin(b)}` }); };
  G.bitsShift = d => { const left = Math.random() < .5, n = d === 1 ? 1 : ri(1, 3), v = left ? ri(1, 255 >> n) : ri(8, 255), r = left ? v << n : v >> n;
    return bits(`Toggle the bits to show \`${bin(v)}\` after a ${left ? "left" : "right"} shift of ${n}.`, r, `Every bit moves ${n} place${n > 1 ? "s" : ""} ${left ? "left" : "right"}; gaps fill with 0: ${bin(r)}.`); };
  G.bitsAscii = d => { const i = ri(0, 25), up = d !== 2, c = String.fromCharCode((up ? 65 : 97) + i);
    return bits(`\`${up ? "A" : "a"}\` is ${up ? 65 : 97} in ASCII. Toggle the bits to make the code for \`${c}\`.`, (up ? 65 : 97) + i, `${c} = ${(up ? 65 : 97) + i} = ${places((up ? 65 : 97) + i)}.`); };

  /* ---- logic expression trees ---- */
  const V = v => ({ v }), NOT = k => ({ op: "NOT", k: [k] });
  BW.evalTree = (t, env) => t.v ? env[t.v] : t.op === "NOT" ? 1 - BW.evalTree(t.k[0], env) : t.op === "AND" ? BW.evalTree(t.k[0], env) & BW.evalTree(t.k[1], env) : BW.evalTree(t.k[0], env) | BW.evalTree(t.k[1], env);
  BW.treeStr = (t, top = true) => t.v ? t.v : t.op === "NOT" ? `NOT ${t.k[0].v ? t.k[0].v : "(" + BW.treeStr(t.k[0]) + ")"}` : `${top ? "" : "("}${BW.treeStr(t.k[0], false)} ${t.op} ${BW.treeStr(t.k[1], false)}${top ? "" : ")"}`;
  const used = (t, s = new Set()) => { t.v ? s.add(t.v) : t.k.forEach(k => used(k, s)); return s; };
  const rows = vs => Array.from({ length: 1 << vs.length }, (_, i) => Object.fromEntries(vs.map((v, j) => [v, (i >> (vs.length - 1 - j)) & 1])));
  const rtree = (depth, vs) => {
    if (depth === 0) return V(pick(vs));
    const r = Math.random();
    if (r < .22) { const k = rtree(depth - 1, vs); return k.op === "NOT" ? k : NOT(k); }
    return { op: r < .61 ? "AND" : "OR", k: [rtree(depth - 1, vs), rtree(depth - 1, vs)] };
  };
  BW.makeTree = d => {
    const vs = d === 3 ? ["A", "B", "C"] : ["A", "B"];
    for (let g = 0; g < 80; g++) {
      const t = rtree(d === 1 ? pick([1, 2]) : d === 2 ? 2 : pick([2, 3]), vs);
      const out = rows(vs).map(e => BW.evalTree(t, e)).join("");
      if (used(t).size === vs.length && /0/.test(out) && /1/.test(out) && BW.treeStr(t).length < 44 && !(t.k && t.k.length === 2 && BW.treeStr(t.k[0]) === BW.treeStr(t.k[1]))) return { t, vs };
    }
    return { t: { op: "OR", k: [{ op: "AND", k: [V("A"), V("B")] }, NOT(V(vs[vs.length - 1]))] }, vs };
  };
  G.gateSet = d => {
    const { t, vs } = BW.makeTree(d), zero = Object.fromEntries(vs.map(v => [v, 0])), target = 1 - BW.evalTree(t, zero);
    const ex = rows(vs).find(e => BW.evalTree(t, e) === target);
    return { type: "gate", q: `Flip the input switches so the output Q = ${target}.`, tree: t, vars: vs, target, expr: BW.treeStr(t),
      why: `Q = ${BW.treeStr(t)}. One way that works: ${vs.map(v => `${v} = ${ex[v]}`).join(", ")}.` };
  };
  G.ttGrid = d => {
    const { t, vs } = BW.makeTree(d === 1 ? 1 : d), col = rows(vs).map(e => BW.evalTree(t, e)).join("");
    return { type: "tt", q: `Click the Q cells to complete the truth table for Q = ${BW.treeStr(t)}.`, tree: t, vars: vs, answer: col, why: `The Q column, top to bottom, is ${col.split("").join(", ")}.` };
  };

  /* ---- drag-to-order sorting ---- */
  const distinct = n => shuffle(Array.from({ length: 40 }, (_, i) => i + 2)).slice(0, n);
  G.orderBubble = d => { let arr, a;
    do { arr = distinct(d === 1 ? 4 : 5); a = arr.slice(); for (let i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]]; } while (a.join() === arr.join());
    return { type: "order", q: `Drag the numbers into the order they will be in after ONE pass of a bubble sort (ascending). Start: [${arr.join(", ")}]`, items: a.map(String), start: arr.map(String), why: `Compare each neighbouring pair left to right and swap if the left one is bigger: ${a.join(", ")}.` }; };
  G.orderInsertion = d => { const arr = distinct(5), k = d === 3 ? 3 : 2, a = arr.slice();
    for (let i = 1; i <= k; i++) { const v = a[i]; let j = i - 1; while (j >= 0 && a[j] > v) { a[j + 1] = a[j]; j--; } a[j + 1] = v; }
    if (a.join() === arr.join()) return G.orderBubble(d);
    return { type: "order", q: `Drag the numbers into their order after ${k} passes of an insertion sort (ascending). Start: [${arr.join(", ")}]`, items: a.map(String), start: arr.map(String), why: `Each pass slides the next item left into the sorted part: ${a.join(", ")}.` }; };

  const attach = (uid, sid, names) => { const s = BW.units.find(u => u.id === uid)?.subs.find(x => x.id === sid); if (s) s.igen = names; };
  attach("mem", "bin", ["bitsDen"]); attach("mem", "hex", ["bitsHex"]); attach("mem", "binadd", ["bitsAdd"]);
  attach("mem", "shifts", ["bitsShift"]); attach("mem", "chars", ["bitsAscii"]);
  attach("logic", "gates", ["gateSet"]); attach("logic", "tables", ["ttGrid"]); attach("logic", "expressions", ["gateSet", "ttGrid"]);
  attach("alg", "sorting", ["orderBubble", "orderInsertion"]);
})(BW.gen);
