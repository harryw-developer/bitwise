/* Procedural question generators — every call gives a fresh question */
(function (G) {
  const { ri, pick, shuffle, bin, hex } = BW;
  const inp = (q, answer, norm, why, extra = {}) => ({ type: "input", q, answer: String(answer), norm, why, ...extra });
  const mc = (q, answer, wrongs, why, extra = {}) => {
    const w = [...new Set(wrongs.map(String))].filter(x => x !== String(answer)).slice(0, 3);
    return { type: "mc", q, answer: String(answer), options: shuffle([String(answer), ...w]), why, ...extra };
  };
  const near = (n, spread, count = 3, min = 0) => { const s = new Set(); let g = 0; while (s.size < count && g++ < 99) { const v = n + ri(-spread, spread); if (v !== n && v >= min) s.add(v); } return [...s]; };
  const places = (n, w) => { const p = []; for (let i = w - 1; i >= 0; i--) if (n & (1 << i)) p.push(1 << i); return p.join(" + ") || "0"; };
  const widthFor = d => d === 1 ? 4 : 8;

  G.binToDen = d => { const w = widthFor(d), n = ri(d === 3 ? 128 : 1, (1 << w) - 1), b = bin(n, w);
    return inp(`Convert the ${w}-bit binary number \`${b}\` to denary.`, n, "num", `Add the place values of each 1: ${places(n, w)} = ${n}.`, { pad: "num" }); };
  G.denToBin = d => { const w = widthFor(d), n = ri(1, (1 << w) - 1);
    return inp(`Convert denary ${n} to a ${w}-bit binary number.`, bin(n, w), "bin", `${n} = ${places(n, w)}, so the bits are ${bin(n, w)}.`, { pad: "bin" }); };
  G.hexToDen = d => { const n = d === 1 ? ri(10, 15) : ri(16, 255), h = hex(n);
    const why = n < 16 ? `A=10, B=11, C=12, D=13, E=14, F=15, so ${h} = ${n}.` : `${h[0]} × 16 + ${h[1]} = ${parseInt(h[0], 16) * 16} + ${parseInt(h[1], 16)} = ${n}.`;
    return inp(`Convert hexadecimal \`${h}\` to denary.`, n, "num", why, { pad: "num" }); };
  G.denToHex = d => { const n = d === 1 ? ri(10, 15) : ri(16, 255), h = hex(n);
    const why = n < 16 ? `${n} is a single hex digit: ${h}.` : `${n} DIV 16 = ${n >> 4} (${hex(n >> 4)}), remainder ${n & 15} (${hex(n & 15)}), so ${h}.`;
    return inp(`Convert denary ${n} to hexadecimal.`, h, "hex", why, { pad: "hex" }); };
  G.binToHex = d => { const n = ri(d === 1 ? 1 : 17, 255), b = bin(n);
    return inp(`Convert the binary number \`${b}\` to hexadecimal.`, hex(n).padStart(2, "0"), "hex", `Split into nibbles: ${b.slice(0, 4)} = ${hex(n >> 4)} and ${b.slice(4)} = ${hex(n & 15)}.`, { pad: "hex" }); };
  G.hexToBin = d => { const n = ri(d === 1 ? 16 : 100, 255), h = hex(n);
    return inp(`Convert hexadecimal \`${h}\` to 8-bit binary.`, bin(n), "bin", `Each hex digit becomes 4 bits: ${h[0]} = ${bin(n >> 4, 4)}, ${h[1]} = ${bin(n & 15, 4)}.`, { pad: "bin" }); };

  G.binAdd = d => {
    if (d === 3 && Math.random() < .5) { const a = ri(100, 220), b = ri(40, 200), ov = a + b > 255;
      return mc(`Adding \`${bin(a)}\` and \`${bin(b)}\` in an 8-bit register. What happens?`, ov ? "An overflow error occurs" : "No overflow; the result fits in 8 bits",
        [ov ? "No overflow; the result fits in 8 bits" : "An overflow error occurs", "The result becomes negative", "The CPU rounds the result down"],
        `${a} + ${b} = ${a + b}. The largest 8-bit value is 255, so ${ov ? "a 9th bit is needed: overflow." : "it fits."}`); }
    const w = d === 1 ? 4 : 8; let a, b; do { a = ri(1, (1 << w) - 2); b = ri(1, (1 << w) - 2); } while (a + b > (1 << w) - 1);
    return inp(`Add these ${w}-bit binary numbers. Give a ${w}-bit answer.`, bin(a + b, w), "bin", `${a} + ${b} = ${a + b}, which is ${bin(a + b, w)}. Remember 1 + 1 = 0 carry 1, and 1 + 1 + 1 = 1 carry 1.`, { pre: `  ${bin(a, w)}\n+ ${bin(b, w)}`, pad: "bin" });
  };
  G.shift = d => {
    if (d === 3 && Math.random() < .5) { const n = ri(1, 3), left = Math.random() < .5, f = 1 << n;
      return mc(`What is the effect of a ${left ? "left" : "right"} binary shift of ${n} place${n > 1 ? "s" : ""}?`, `${left ? "Multiplies" : "Divides"} by ${f}`, [`${left ? "Divides" : "Multiplies"} by ${f}`, `${left ? "Multiplies" : "Divides"} by ${n * 2 + (n === 2 ? 2 : 1)}`, `Adds ${f}`],
        `Each place shifted ${left ? "left doubles" : "right halves"} the value, so ${n} place${n > 1 ? "s" : ""} is × or ÷ 2^${n} = ${f}.`); }
    const left = Math.random() < .5, n = d === 1 ? 1 : ri(1, 3);
    const v = left ? ri(1, 255 >> n) : ri(8, 255), r = left ? (v << n) & 255 : v >> n;
    return inp(`Apply a ${left ? "left" : "right"} shift of ${n} place${n > 1 ? "s" : ""} to \`${bin(v)}\`. Give the 8-bit result.`, bin(r), "bin",
      `Move every bit ${n} place${n > 1 ? "s" : ""} ${left ? "left" : "right"} and fill the gap with 0s: ${bin(r)}. ${left ? "Multiplied" : "Divided"} by ${1 << n}: ${v} → ${r}${!left && v % (1 << n) ? " (bits shifted off the end are lost, so it rounds down)" : ""}.`, { pad: "bin" });
  };

  const U = ["bytes", "KB", "MB", "GB", "TB"];
  G.units = d => {
    if (d === 1) { const t = pick([["nibble", "bits", 4], ["byte", "bits", 8], ["byte", "nibbles", 2]]), k = ri(2, 9);
      return inp(`How many ${t[1]} are in ${k} ${t[0]}s?`, k * t[2], "num", `1 ${t[0]} = ${t[2]} ${t[1]}, so ${k} × ${t[2]} = ${k * t[2]}.`, { pad: "num" }); }
    const i = ri(1, 4), k = ri(2, d === 3 ? 900 : 9), down = Math.random() < .5;
    if (down) return inp(`How many ${U[i - 1]} are in ${k} ${U[i]}? (Use 1000.)`, k * 1000, "num", `Each step down the scale is × 1000: ${k} × 1000 = ${k * 1000}.`, { pad: "num" });
    return inp(`Convert ${k * 1000} ${U[i - 1]} to ${U[i]}. (Use 1000.)`, k, "num", `Each step up the scale is ÷ 1000: ${k * 1000} ÷ 1000 = ${k}.`, { pad: "num" });
  };
  G.colours = d => { const n = ri(1, d === 1 ? 4 : 10);
    if (Math.random() < .5) return inp(`How many different colours can be shown with a colour depth of ${n} bit${n > 1 ? "s" : ""}?`, 2 ** n, "num", `n bits give 2^n combinations: 2^${n} = ${2 ** n}.`, { pad: "num" });
    const c = ri(2 ** (n - 1) + 1, 2 ** n);
    return inp(`What is the minimum colour depth (bits per pixel) needed for ${c} colours?`, n, "num", `2^${n} = ${2 ** n} is the first power of 2 ≥ ${c}${n > 1 ? ` (2^${n - 1} = ${2 ** (n - 1)} is too few)` : ""}.`, { pad: "num" });
  };
  G.imageSize = d => { const w = pick(d === 1 ? [4, 8, 10] : [20, 40, 50, 100, 200, 400, 800]), h = pick(d === 1 ? [4, 5, 8] : [10, 25, 40, 100, 200, 500]), cd = pick(d === 1 ? [1, 2, 4] : [4, 8, 16, 24]);
    const bits = w * h * cd;
    if (d === 1) return inp(`An image is ${w} × ${h} pixels with a colour depth of ${cd} bit${cd > 1 ? "s" : ""}. What is its size in bits?`, bits, "num", `Size = width × height × colour depth = ${w} × ${h} × ${cd} = ${bits} bits.`, { pad: "num" });
    if (d === 2) return inp(`An image is ${w} × ${h} pixels with a colour depth of ${cd} bits. What is its size in bytes?`, bits / 8, "num", `${w} × ${h} × ${cd} = ${bits} bits. ÷ 8 = ${bits / 8} bytes.`, { pad: "num" });
    return inp(`An image is ${w} × ${h} pixels with a colour depth of ${cd} bits. What is its size in KB? (1 KB = 1000 bytes)`, +(bits / 8000).toFixed(3), "num", `${w} × ${h} × ${cd} = ${bits} bits → ÷ 8 = ${bits / 8} bytes → ÷ 1000 = ${+(bits / 8000).toFixed(3)} KB.`, { pad: "num" });
  };
  G.soundSize = d => { const sr = pick(d === 1 ? [100, 200, 500, 1000] : [8000, 11000, 22000, 44100, 48000]), bd = pick([8, 16, 24]), s = ri(1, d === 3 ? 60 : 10);
    const bits = sr * bd * s;
    if (d < 3) return inp(`A sound is recorded for ${s} second${s > 1 ? "s" : ""} at ${sr} Hz with a bit depth of ${bd}. What is the file size in ${d === 1 ? "bits" : "bytes"}?`, d === 1 ? bits : bits / 8, "num", `Size = sample rate × bit depth × seconds = ${sr} × ${bd} × ${s} = ${bits} bits${d === 2 ? ` ÷ 8 = ${bits / 8} bytes` : ""}.`, { pad: "num" });
    return inp(`A ${s}-second recording at ${sr} Hz with ${bd}-bit samples. What is the size in KB? (1 KB = 1000 bytes)`, +(bits / 8000).toFixed(3), "num", `${sr} × ${bd} × ${s} = ${bits} bits → ${bits / 8} bytes → ${+(bits / 8000).toFixed(3)} KB.`, { pad: "num" });
  };
  G.ascii = d => { const up = d !== 2, i = ri(1, 25), base = up ? 65 : 97, ch = String.fromCharCode(base + i);
    if (d === 3) return inp(`The ASCII code for \`A\` is 65. What is the 8-bit binary code for \`${ch}\`?`, bin(base + i), "bin", `${ch} is ${i} letters after A, so ${65 + i}, which is ${bin(65 + i)}.`, { pad: "bin" });
    return inp(`The ASCII code for \`${up ? "A" : "a"}\` is ${base}. What is the code for \`${ch}\`?`, base + i, "num", `Letters are in order, so ${ch} = ${base} + ${i} = ${base + i}.`, { pad: "num" }); };
  G.charBits = d => { const t = pick([["7-bit ASCII", 128, 7], ["extended 8-bit ASCII", 256, 8]]);
    if (d === 1) return inp(`How many different characters can ${t[0]} represent?`, t[1], "num", `2^${t[2]} = ${t[1]}.`, { pad: "num" });
    const n = ri(10, 3000), b = Math.ceil(Math.log2(n));
    return inp(`A character set must represent ${n} different characters. What is the minimum number of bits per character?`, b, "num", `2^${b} = ${2 ** b} ≥ ${n}, but 2^${b - 1} = ${2 ** (b - 1)} is not enough.`, { pad: "num" }); };
  G.textSize = d => { const n = ri(10, 400), bpc = pick([7, 8, 16]);
    return inp(`A message has ${n} characters stored using ${bpc} bits per character. How many bits is that?`, n * bpc, "num", `${n} × ${bpc} = ${n * bpc} bits.`, { pad: "num" }); };

  /* Boolean logic */
  const OPS = { AND: (a, b) => a & b, OR: (a, b) => a | b };
  const exprPool = [
    ["A AND B", (a, b) => a & b], ["A OR B", (a, b) => a | b], ["NOT A", a => 1 - a], ["NOT (A AND B)", (a, b) => 1 - (a & b)],
    ["NOT (A OR B)", (a, b) => 1 - (a | b)], ["A AND NOT B", (a, b) => a & (1 - b)], ["NOT A OR B", (a, b) => (1 - a) | b], ["(A OR B) AND NOT A", (a, b) => (a | b) & (1 - a)]
  ];
  const expr3 = [
    ["(A AND B) OR C", (a, b, c) => (a & b) | c], ["A AND (B OR C)", (a, b, c) => a & (b | c)], ["NOT (A OR B) AND C", (a, b, c) => (1 - (a | b)) & c],
    ["(A OR B) AND NOT C", (a, b, c) => (a | b) & (1 - c)], ["NOT A AND (B OR C)", (a, b, c) => (1 - a) & (b | c)], ["(A AND NOT B) OR (B AND C)", (a, b, c) => (a & (1 - b)) | (b & c)]
  ];
  G.logicEval = d => { const three = d === 3, e = three ? pick(expr3) : pick(d === 1 ? exprPool.slice(0, 3) : exprPool);
    const a = ri(0, 1), b = ri(0, 1), c = ri(0, 1), out = e[1](a, b, c);
    return mc(`If A = ${a}, B = ${b}${three ? `, C = ${c}` : ""}, what is the output of \`${e[0]}\`?`, out, [1 - out], `Substitute the values and work inside brackets first: the result is ${out}.`); };
  G.truthTable = d => { const three = d === 3, e = three ? pick(expr3) : pick(d === 1 ? exprPool.slice(0, 2).concat([exprPool[3], exprPool[4]]) : exprPool.filter(x => x[1].length === 2));
    const rows = three ? 8 : 4, n = three ? 3 : 2; let col = "", tbl = (three ? "A B C | Q\n" : "A B | Q\n");
    for (let i = 0; i < rows; i++) { const v = bin(i, n).split("").map(Number), o = e[1](...v); col += o; tbl += v.join(" ") + " | ?\n"; }
    return inp(`Complete the output column Q for \`Q = ${e[0]}\`. Type the ${rows} output bits from top to bottom.`, col, "bits", `The output column is ${col.split("").join(", ")}.`, { pre: tbl.trim(), pad: "bin" }); };

  /* Algorithms */
  G.linearSearch = d => { const len = d === 1 ? 6 : 9, arr = shuffle(Array.from({ length: 40 }, (_, i) => i + 3)).slice(0, len), idx = ri(0, len - 1), t = arr[idx];
    return inp(`A linear search looks for ${t} in the list below. How many items are checked (compared) before it is found?`, idx + 1, "num", `Linear search checks items one by one from the start. ${t} is item ${idx + 1}, so ${idx + 1} comparisons.`, { pre: `[${arr.join(", ")}]`, pad: "num" }); };
  G.binarySearch = d => { const len = pick(d === 1 ? [7, 9] : [9, 11, 13, 15]), arr = Array.from({ length: 30 }, (_, i) => i * 3 + ri(1, 2)).slice(0, len).sort((a, b) => a - b);
    let lo = 0, hi = len - 1; const seq = [], t = pick(arr);
    while (lo <= hi) { const m = (lo + hi) >> 1; seq.push(arr[m]); if (arr[m] === t) break; if (arr[m] < t) lo = m + 1; else hi = m - 1; }
    const pre = `[${arr.join(", ")}]  (indexes 0 to ${len - 1})`;
    if (d === 1) return inp(`A binary search looks for ${t}. Which value is checked first? (Middle = (low + high) DIV 2)`, seq[0], "num", `Middle index = (0 + ${len - 1}) DIV 2 = ${(len - 1) >> 1}, which holds ${seq[0]}.`, { pre, pad: "num" });
    if (d === 2 && seq.length > 1) return inp(`A binary search looks for ${t}. Which value is checked second? (Middle = (low + high) DIV 2)`, seq[1], "num", `Checks in order: ${seq.join(" → ")}.`, { pre, pad: "num" });
    return inp(`A binary search looks for ${t}. How many values are checked in total? (Middle = (low + high) DIV 2)`, seq.length, "num", `Values checked: ${seq.join(" → ")} — that is ${seq.length}.`, { pre, pad: "num" }); };
  G.bubblePass = d => { const arr = shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, d === 1 ? 5 : 6), a = arr.slice();
    const passes = d === 3 ? 2 : 1;
    for (let p = 0; p < passes; p++) for (let i = 0; i < a.length - 1 - p; i++) if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]];
    return inp(`Show the list after ${passes === 1 ? "the first pass" : "two passes"} of a bubble sort (ascending). Separate numbers with commas.`, a.join(","), "list", `Compare neighbours and swap if the left is bigger. After ${passes === 1 ? "one pass the largest value has bubbled to the end" : "two passes the two largest are in place"}: ${a.join(", ")}.`, { pre: `[${arr.join(", ")}]` }); };
  G.insertionPass = d => { const arr = shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 6), k = d === 1 ? 1 : d === 2 ? 2 : 3, a = arr.slice();
    for (let i = 1; i <= k; i++) { const v = a[i]; let j = i - 1; while (j >= 0 && a[j] > v) { a[j + 1] = a[j]; j--; } a[j + 1] = v; }
    return inp(`An insertion sort (ascending) starts on this list. Show the list after the first ${k} item${k > 1 ? "s have" : " has"} been inserted (i.e. after ${k} pass${k > 1 ? "es" : ""}). Use commas.`, a.join(","), "list", `Each pass takes the next item and slides it left into the sorted part: ${a.join(", ")}.`, { pre: `[${arr.join(", ")}]` }); };

  /* Programming */
  G.arith = d => { const a = ri(10, 60), b = ri(2, 9);
    const t = d === 1 ? pick(["MOD", "DIV"]) : d === 2 ? pick(["MOD", "DIV", "^"]) : "combo";
    if (t === "MOD") return inp(`What is \`${a} MOD ${b}\`?`, a % b, "num", `MOD gives the remainder: ${a} ÷ ${b} = ${Math.floor(a / b)} remainder ${a % b}.`, { pad: "num" });
    if (t === "DIV") return inp(`What is \`${a} DIV ${b}\`?`, Math.floor(a / b), "num", `DIV gives the whole-number part: ${a} ÷ ${b} = ${Math.floor(a / b)} remainder ${a % b}.`, { pad: "num" });
    if (t === "^") { const x = ri(2, 5), y = ri(2, 4); return inp(`What is \`${x} ^ ${y}\`?`, x ** y, "num", `^ is exponent: ${x} to the power ${y} = ${x ** y}.`, { pad: "num" }); }
    const r = (Math.floor(a / 3)) % 4; return inp(`What is \`(${a} DIV 3) MOD 4\`?`, r, "num", `${a} DIV 3 = ${Math.floor(a / 3)}, then ${Math.floor(a / 3)} MOD 4 = ${r}.`, { pad: "num" }); };
  G.traceLoop = d => {
    if (d === 1) { const n = ri(3, 7); let t = 0; for (let i = 1; i <= n; i++) t += i;
      return inp("What is printed?", t, "num", `total becomes 1 + 2 + … + ${n} = ${t}.`, { pre: `total = 0\nfor i = 1 to ${n}\n    total = total + i\nnext i\nprint(total)`, pad: "num" }); }
    if (d === 2) { const n = ri(2, 5), m = ri(2, 3); let x = 1; for (let i = 0; i < n; i++) x *= m;
      return inp("What is printed?", x, "num", `x is multiplied by ${m}, ${n} times: ${m}^${n} = ${x}.`, { pre: `x = 1\nfor i = 1 to ${n}\n    x = x * ${m}\nnext i\nprint(x)`, pad: "num" }); }
    const s = ri(40, 200); let v = s, c = 0; while (v > 1) { v = Math.floor(v / 2); c++; }
    return inp("What is printed?", c, "num", `Keep halving (DIV 2) until value is 1: that takes ${c} steps.`, { pre: `value = ${s}\ncount = 0\nwhile value > 1\n    value = value DIV 2\n    count = count + 1\nendwhile\nprint(count)`, pad: "num" });
  };
  const WORDS = ["COMPUTER", "NETWORK", "BINARY", "KEYBOARD", "ALGORITHM", "PROGRAM", "HARDWARE", "VARIABLE", "PROTOCOL", "MEMORY"];
  G.strings = d => { const w = pick(WORDS);
    if (d === 1) return inp(`\`word = "${w}"\` — what does \`word.length\` return?`, w.length, "num", `"${w}" has ${w.length} characters.`, { pad: "num" });
    if (d === 2) { const s = ri(0, 3), n = ri(2, 4); return inp(`\`word = "${w}"\`. In OCR Exam Reference Language, what does \`word.substring(${s}, ${n})\` return? (start index ${s}, ${n} characters, first index is 0)`, w.substr(s, n), "text", `Start at index ${s} ("${w[s]}") and take ${n} characters: ${w.substr(s, n)}.`); }
    const s = ri(1, 3), e = s + ri(2, 3); return inp(`In Python, \`word = "${w}"\`. What does \`word[${s}:${e}]\` give?`, w.slice(s, e), "text", `Slicing takes index ${s} up to but not including ${e}: ${w.slice(s, e)}.`); };
  G.arrays = d => { const arr = Array.from({ length: 6 }, () => ri(1, 50));
    if (d === 1) { const i = ri(0, 5); return inp(`What is printed? (Arrays are zero-indexed.)`, arr[i], "num", `Index ${i} is the ${i + 1}${["st", "nd", "rd"][i] || "th"} item: ${arr[i]}.`, { pre: `scores = [${arr.join(", ")}]\nprint(scores[${i}])`, pad: "num" }); }
    if (d === 2) { const g = [[ri(1, 9), ri(1, 9), ri(1, 9)], [ri(1, 9), ri(1, 9), ri(1, 9)], [ri(1, 9), ri(1, 9), ri(1, 9)]], r = ri(0, 2), c = ri(0, 2);
      return inp(`What is printed? (\`grid[row][column]\`, zero-indexed)`, g[r][c], "num", `Row ${r} is [${g[r].join(", ")}]; column ${c} of it is ${g[r][c]}.`, { pre: `grid = [[${g[0].join(", ")}],\n        [${g[1].join(", ")}],\n        [${g[2].join(", ")}]]\nprint(grid[${r}][${c}])`, pad: "num" }); }
    const lim = ri(15, 35), c = arr.filter(x => x > lim).length;
    return inp("What is printed?", c, "num", `Count the items greater than ${lim}: ${arr.filter(x => x > lim).join(", ") || "none"} → ${c}.`, { pre: `nums = [${arr.join(", ")}]\ncount = 0\nfor i = 0 to 5\n    if nums[i] > ${lim} then\n        count = count + 1\n    endif\nnext i\nprint(count)`, pad: "num" }); };
  const DT = [["42", "Integer"], ["-7", "Integer"], ["3.14", "Real / float"], ["0.5", "Real / float"], ["True", "Boolean"], ["False", "Boolean"], ["'Q'", "Character"], ['"Hello"', "String"], ['"07700 900123"', "String"], ['"2024"', "String"], ["19.99", "Real / float"], ["1000", "Integer"]];
  G.dataType = () => { const t = pick(DT); return mc(`Which data type is the value \`${t[0]}\`?`, t[1], ["Integer", "Real / float", "Boolean", "Character", "String"], t[0].startsWith('"') ? "Anything inside double quotes is a string, even if it looks like a number." : `\`${t[0]}\` is a ${t[1].toLowerCase()}.`); };
  G.sqlRows = d => { const names = shuffle(["Ava", "Ben", "Cal", "Dia", "Eli", "Fay", "Gus", "Hana"]).slice(0, 6);
    const rows = names.map(n => ({ name: n, age: ri(14, 17), house: pick(["Red", "Blue", "Green"]) }));
    const cond = d === 1 ? ["house", "=", pick(["Red", "Blue", "Green"])] : ["age", pick([">", "<", ">=", "<="]), ri(15, 16)];
    const test = r => { const v = r[cond[0]], c = cond[2]; return cond[1] === "=" ? v === c : cond[1] === ">" ? v > c : cond[1] === "<" ? v < c : cond[1] === ">=" ? v >= c : v <= c; };
    let match = rows.filter(test);
    if (d === 3) { const h = pick(["Red", "Blue", "Green"]); match = match.filter(r => r.house === h); cond.push(h); }
    const where = `${cond[0]} ${cond[1]} ${typeof cond[2] === "string" ? `"${cond[2]}"` : cond[2]}${cond[3] ? ` AND house = "${cond[3]}"` : ""}`;
    const pre = "Students\nname | age | house\n" + rows.map(r => `${r.name.padEnd(4)} | ${r.age}  | ${r.house}`).join("\n") + `\n\nSELECT name FROM Students\nWHERE ${where}`;
    return inp("How many records does this query return?", match.length, "num", `Matching: ${match.map(r => r.name).join(", ") || "none"}.`, { pre, pad: "num" }); };
  G.ipv4 = () => { const ok = Math.random() < .5; let p = [ri(1, 223), ri(0, 255), ri(0, 255), ri(1, 254)], why = "Four numbers, each 0–255, separated by dots: valid.";
    if (!ok) { const k = ri(0, 2); if (k === 0) { p[ri(0, 3)] = ri(256, 399); why = "Each part must be 0–255; one is too big."; } else if (k === 1) { p = p.slice(0, 3); why = "An IPv4 address needs exactly four parts."; } else { p.push(ri(1, 254)); why = "An IPv4 address has four parts, not five."; } }
    return mc(`Is \`${p.join(".")}\` a valid IPv4 address?`, ok ? "Valid" : "Not valid", [ok ? "Not valid" : "Valid"], why); };
  G.testData = () => { const lo = ri(1, 20), hi = lo + ri(20, 80), k = pick(["normal", "boundary", "invalid", "erroneous"]);
    const v = k === "normal" ? ri(lo + 2, hi - 2) : k === "boundary" ? pick([lo, hi]) : k === "invalid" ? pick([lo - ri(1, 9), hi + ri(1, 9)]) : pick(['"ten"', '"abc"', '"?"', '""']);
    const name = { normal: "Normal", boundary: "Boundary", invalid: "Invalid", erroneous: "Erroneous" }[k];
    const why = { normal: "It is sensible data well inside the range.", boundary: "It is exactly at the edge of the allowed range.", invalid: "It is the right data type but outside the allowed range.", erroneous: "It is the wrong data type entirely." }[k];
    return mc(`A program accepts whole numbers from ${lo} to ${hi} inclusive. What type of test data is ${v}?`, name, ["Normal", "Boundary", "Invalid", "Erroneous"], why); };
})(BW.gen);
