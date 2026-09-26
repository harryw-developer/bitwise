/* Interactive question widgets: bits · order · match · sort · gate · tt */
BW.initWS = q => {
  switch (q.type) {
    case "bits": return { bits: Array(q.answer.length).fill(0) };
    case "order": { let o = q.start ? q.start.slice() : BW.shuffle(q.items); let g = 0; while (!q.start && o.join("\u0001") === q.items.join("\u0001") && g++ < 9) o = BW.shuffle(q.items); return { order: o, sel: null }; }
    case "match": return { right: BW.shuffle(q.pairs.map(p => p[1])), link: {}, selL: null, selR: null };
    case "sort": return { place: {}, sel: null };
    case "gate": return { env: Object.fromEntries(q.vars.map(v => [v, 0])) };
    case "tt": return { out: Array(1 << q.vars.length).fill(null) };
  }
  return {};
};
BW.ttRows = vs => Array.from({ length: 1 << vs.length }, (_, i) => Object.fromEntries(vs.map((v, j) => [v, (i >> (vs.length - 1 - j)) & 1])));
BW.wsReady = (q, ws) => q.type === "match" ? Object.keys(ws.link).length === q.pairs.length : q.type === "sort" ? Object.keys(ws.place).length === q.items.length : q.type === "tt" ? ws.out.every(v => v !== null) : true;
BW.wsCheck = (q, ws) => {
  switch (q.type) {
    case "bits": return ws.bits.join("") === q.answer;
    case "order": return ws.order.join("\u0001") === q.items.join("\u0001");
    case "match": return q.pairs.every((p, i) => ws.right[ws.link[i]] === p[1]);
    case "sort": return q.items.every((it, i) => ws.place[i] === it[1]);
    case "gate": return BW.evalTree(q.tree, ws.env) === q.target;
    case "tt": return ws.out.join("") === q.answer;
  }
  return false;
};

const PAIR_COLS = 6;
BW.renderWidget = (q, ws, fin) => {
  const E = BW.esc, F = BW.fmt;
  if (q.type === "bits") {
    const w = q.answer.length, val = parseInt(ws.bits.join(""), 2);
    const row = (arr, cls, click) => `<div class="bitrow ${cls}">${arr.map((b, i) => `<button class="bit ${+b ? "on" : ""} ${fin && click ? (String(b) === q.answer[i] ? "" : "bad") : ""}" ${click ? `data-bit="${i}"` : ""} aria-pressed="${!!+b}" aria-label="Bit worth ${1 << (w - 1 - i)}" ${fin || !click ? "disabled" : ""}><small>${1 << (w - 1 - i)}</small><b>${b}</b></button>`).join("")}</div>`;
    return row(ws.bits, "", true) + (q.showSum && !fin ? `<div class="bitsum">Value: <b class="num">${val}</b></div>` : "")
      + (fin && ws.bits.join("") !== q.answer ? `<p class="k" style="margin-top:12px">Correct answer</p>${row(q.answer.split(""), "ghost", false)}` : "");
  }
  if (q.type === "order") {
    return `<ol class="olist">${ws.order.map((it, i) => `<li class="oitem ${ws.sel === i ? "sel" : ""} ${fin ? (it === q.items[i] ? "good" : "bad") : ""}" ${fin ? "" : `draggable="true" data-oi="${i}" tabindex="0"`}>
      <span class="grip" aria-hidden="true">⋮⋮</span><span class="otext">${F(it)}</span>${fin ? "" : `<span class="oarrows"><button data-up="${i}" aria-label="Move up" ${i === 0 ? "disabled" : ""}>↑</button><button data-down="${i}" aria-label="Move down" ${i === ws.order.length - 1 ? "disabled" : ""}>↓</button></span>`}</li>`).join("")}</ol>
      ${fin ? "" : `<p class="note">Drag items, use the arrows, or tap one item then tap where it should go.</p>`}`;
  }
  if (q.type === "match") {
    const leftOf = j => { for (const k in ws.link) if (ws.link[k] === j) return +k; return null; };
    return `<div class="match"><div class="mcol">${q.pairs.map((p, i) => { const l = ws.link[i] != null; const ok = fin && ws.right[ws.link[i]] === p[1];
      return `<button class="mitem ${ws.selL === i ? "sel" : ""} ${l ? "linked pc" + (i % PAIR_COLS) : ""} ${fin ? (ok ? "good" : "bad") : ""}" data-ml="${i}" ${fin ? "disabled" : ""} draggable="${!fin}">${l ? `<i class="pairno">${i + 1}</i>` : ""}${F(p[0])}</button>`; }).join("")}</div>
      <div class="mcol">${ws.right.map((r, j) => { const li = leftOf(j);
      return `<button class="mitem ${ws.selR === j ? "sel" : ""} ${li != null ? "linked pc" + (li % PAIR_COLS) : ""}" data-mr="${j}" ${fin ? "disabled" : ""}>${li != null ? `<i class="pairno">${li + 1}</i>` : ""}${F(r)}</button>`; }).join("")}</div></div>
      ${fin ? "" : `<p class="note">Tap an item on the left, then its partner on the right. Tap a matched item to undo.</p>`}`;
  }
  if (q.type === "sort") {
    const chip = i => { const it = q.items[i], placed = ws.place[i] != null;
      return `<button class="schip ${ws.sel === i ? "sel" : ""} ${fin ? (ws.place[i] === it[1] ? "good" : "bad") : ""}" data-si="${i}" draggable="${!fin}" ${fin ? "disabled" : ""} aria-label="${E(it[0])}${placed ? ", in " + E(q.buckets[ws.place[i]]) : ""}">${F(it[0])}</button>`; };
    const pool = q.items.map((_, i) => i).filter(i => ws.place[i] == null);
    return `${fin ? "" : `<div class="pool" data-bk="pool">${pool.map(chip).join("") || `<span class="muted">All sorted. Check your answer.</span>`}</div>`}
      <div class="buckets" style="--n:${q.buckets.length}">${q.buckets.map((b, k) => `<div class="bucket ${ws.sel != null && !fin ? "ready" : ""}" data-bk="${k}" role="button" tabindex="${fin ? -1 : 0}" aria-label="Put in ${E(b)}"><div class="bhead">${E(b)}</div><div class="bitems">${q.items.map((_, i) => i).filter(i => ws.place[i] === k).map(chip).join("")}</div></div>`).join("")}</div>
      ${fin ? "" : `<p class="note">Tap a card then a group, or drag it. Tap a placed card to take it back.</p>`}`;
  }
  if (q.type === "gate") {
    return `<div class="gatebox"><div class="switches">${q.vars.map(v => `<button class="swt ${ws.env[v] ? "on" : ""}" data-sw="${v}" aria-pressed="${!!ws.env[v]}" ${fin ? "disabled" : ""}><span class="knob"></span>${v} = <b>${ws.env[v]}</b></button>`).join("")}</div>
      <div class="circuit">${BW.circuitSVG(q.tree, ws.env, fin)}</div><p class="note mono">Q = ${E(q.expr)}</p></div>`;
  }
  if (q.type === "tt") {
    const rows = BW.ttRows(q.vars);
    return `<div class="tt-wrap"><table class="ttable"><thead><tr>${q.vars.map(v => `<th>${v}</th>`).join("")}<th class="q">Q</th></tr></thead><tbody>${rows.map((r, i) => `<tr>${q.vars.map(v => `<td>${r[v]}</td>`).join("")}<td class="q"><button class="ttcell ${ws.out[i] == null ? "" : "set"} ${fin ? (String(ws.out[i]) === q.answer[i] ? "good" : "bad") : ""}" data-tt="${i}" ${fin ? "disabled" : ""} aria-label="Output for row ${i + 1}">${ws.out[i] == null ? "?" : ws.out[i]}</button></td></tr>`).join("")}</tbody></table></div>`;
  }
  return "";
};

BW.bindWidget = (root, q, ws, rerender) => {
  const on = (sel, fn) => root.querySelectorAll(sel).forEach(el => el.addEventListener("click", e => { e.stopPropagation(); fn(el, e); BW.sfx.play("click"); rerender(); }));
  const move = (from, to) => { if (from === to) return; const [x] = ws.order.splice(from, 1); ws.order.splice(to, 0, x); };
  if (q.type === "bits") on("[data-bit]", el => { const i = +el.dataset.bit; ws.bits[i] = 1 - ws.bits[i]; });
  if (q.type === "order") {
    on("[data-up]", el => move(+el.dataset.up, +el.dataset.up - 1));
    on("[data-down]", el => move(+el.dataset.down, +el.dataset.down + 1));
    on("[data-oi]", el => { const i = +el.dataset.oi; if (ws.sel == null) ws.sel = i; else { move(ws.sel, i); ws.sel = null; } });
    root.querySelectorAll("[data-oi]").forEach(el => {
      el.addEventListener("dragstart", e => { e.dataTransfer.setData("text/plain", el.dataset.oi); el.classList.add("dragging"); });
      el.addEventListener("dragover", e => { e.preventDefault(); el.classList.add("over"); });
      el.addEventListener("dragleave", () => el.classList.remove("over"));
      el.addEventListener("drop", e => { e.preventDefault(); move(+e.dataTransfer.getData("text/plain"), +el.dataset.oi); ws.sel = null; rerender(); });
    });
  }
  if (q.type === "match") {
    const link = (i, j) => { for (const k in ws.link) if (ws.link[k] === j) delete ws.link[k]; ws.link[i] = j; ws.selL = ws.selR = null; };
    on("[data-ml]", el => { const i = +el.dataset.ml; if (ws.link[i] != null && ws.selR == null) { delete ws.link[i]; ws.selL = null; return; } if (ws.selR != null) link(i, ws.selR); else ws.selL = ws.selL === i ? null : i; });
    on("[data-mr]", el => { const j = +el.dataset.mr; const linkedTo = Object.keys(ws.link).find(k => ws.link[k] === j);
      if (ws.selL != null) link(ws.selL, j); else if (linkedTo != null) delete ws.link[linkedTo]; else ws.selR = ws.selR === j ? null : j; });
    root.querySelectorAll("[data-ml]").forEach(el => el.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", el.dataset.ml)));
    root.querySelectorAll("[data-mr]").forEach(el => { el.addEventListener("dragover", e => e.preventDefault());
      el.addEventListener("drop", e => { e.preventDefault(); link(+e.dataTransfer.getData("text/plain"), +el.dataset.mr); rerender(); }); });
  }
  if (q.type === "sort") {
    root.querySelectorAll("[data-si]").forEach(el => {
      el.addEventListener("click", e => { e.stopPropagation(); const i = +el.dataset.si; if (ws.place[i] != null) { delete ws.place[i]; ws.sel = null; } else ws.sel = ws.sel === i ? null : i; BW.sfx.play("click"); rerender(); });
      el.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", el.dataset.si));
    });
    root.querySelectorAll("[data-bk]").forEach(el => {
      const put = i => { if (el.dataset.bk === "pool") delete ws.place[i]; else ws.place[i] = +el.dataset.bk; ws.sel = null; BW.sfx.play("click"); rerender(); };
      el.addEventListener("click", () => { if (ws.sel != null) put(ws.sel); });
      el.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && ws.sel != null) { e.preventDefault(); put(ws.sel); } });
      el.addEventListener("dragover", e => e.preventDefault());
      el.addEventListener("drop", e => { e.preventDefault(); put(+e.dataTransfer.getData("text/plain")); });
    });
  }
  if (q.type === "gate") on("[data-sw]", el => { const v = el.dataset.sw; ws.env[v] = 1 - ws.env[v]; });
  if (q.type === "tt") on("[data-tt]", el => { const i = +el.dataset.tt; ws.out[i] = ws.out[i] == null ? 0 : 1 - ws.out[i]; });
};

/* ---- logic circuit drawing ---- */
BW.circuitSVG = (tree, env, live) => {
  let row = 0;
  const depth = n => n.v ? 0 : 1 + Math.max(...n.k.map(depth)), D = depth(tree);
  const colW = 108, rowH = 58, X0 = 30, Y0 = 34;
  const place = (n, level) => {
    if (n.v) return { n, x: X0, y: Y0 + (row++) * rowH, leaf: true };
    const kids = n.k.map(k => place(k, level + 1));
    return { n, kids, x: X0 + 40 + (D - level) * colW - colW / 2, y: kids.reduce((a, k) => a + k.y, 0) / kids.length };
  };
  const root = place(tree, 0), W = X0 + 40 + D * colW + 70, H = Y0 + (row - 1) * rowH + 34;
  const val = n => BW.evalTree(n, env), wc = v => live ? (v ? "w1" : "w0") : "wn";
  let out = "";
  const outPt = p => p.leaf ? [p.x + 13, p.y] : [p.x + (p.n.op === "AND" ? 13 : p.n.op === "OR" ? 19 : 17), p.y];
  const draw = p => {
    if (p.leaf) { out += `<g class="leaf ${live && env[p.n.v] ? "on" : ""}"><circle cx="${p.x}" cy="${p.y}" r="13"/><text x="${p.x}" y="${p.y + 5}">${p.n.v}</text></g>`; return; }
    const { x, y } = p, op = p.n.op, ins = op === "NOT" ? [[x - 18, y]] : [[x - 20, y - 9], [x - 20, y + 9]];
    p.kids.forEach((k, i) => { draw(k); const [ox, oy] = outPt(k), [ix, iy] = ins[i], mx = ix - 10 - i * 6;
      out += `<path class="wire ${wc(val(k.n))}" d="M${ox} ${oy} H${mx} V${iy} H${ix}"/>`; });
    const shape = op === "AND" ? `<path d="M${x - 20} ${y - 15} h18 a15 15 0 0 1 0 30 h-18 z"/>`
      : op === "OR" ? `<path d="M${x - 22} ${y - 15} q12 15 0 30 q28 0 41 -15 q-13 -15 -41 -15 z"/>`
      : `<path d="M${x - 18} ${y - 12} L${x + 8} ${y} L${x - 18} ${y + 12} z"/><circle cx="${x + 12.5}" cy="${y}" r="4.5"/>`;
    out += `<g class="gate">${shape}<text x="${x - (op === "NOT" ? 8 : 5)}" y="${y + 3.5}">${op}</text></g>`;
  };
  draw(root);
  const [ox, oy] = outPt(root), q = val(root.n);
  out += `<path class="wire ${wc(q)}" d="M${ox} ${oy} H${W - 30}"/><g class="lamp ${live && q ? "lit" : ""}"><circle cx="${W - 20}" cy="${oy}" r="14"/><text x="${W - 20}" y="${oy + 5}">Q</text></g>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Logic circuit for the expression">${out}</svg>`;
};
