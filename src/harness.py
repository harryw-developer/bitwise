# Bitwise code runner + output-based marker.
# Runs in Pyodide (browser worker) and in CPython (local validation). Marks what a program DOES, not how it is written.
import sys, re, ast, math, random, os, tempfile, traceback, json

MAX_OUT = 60000
HINTS = {
    "SyntaxError": "Python couldn't read this line. Check for a missing colon, bracket or quote mark.",
    "IndentationError": "Check your indentation. Code inside if, for, while and def needs to be indented by 4 spaces.",
    "TabError": "Mixing tabs and spaces confuses Python. Use 4 spaces for each indent.",
    "NameError": "You used a name Python doesn't know. Check the spelling and that the variable is created before it is used.",
    "TypeError": "Two values of the wrong type were combined, e.g. adding a number to a string. Use int(), float() or str() to convert.",
    "ValueError": "A value couldn't be converted, e.g. int(\"hello\"). Check what the user typed or what you are converting.",
    "ZeroDivisionError": "You divided by zero. Check the value you are dividing by.",
    "IndexError": "You used a list or string position that doesn't exist. Positions start at 0 and end at len - 1.",
    "KeyError": "That key isn't in the dictionary.",
    "AttributeError": "That value doesn't have that method. Check the spelling, e.g. .upper() or .append().",
    "RecursionError": "A function kept calling itself without stopping.",
    "FileNotFoundError": "That file doesn't exist. Check the file name.",
    "UnboundLocalError": "A variable was used inside a function before it was given a value there.",
}

class NeedInput(Exception):
    pass

class TooMuchOutput(Exception):
    pass

class Out:
    def __init__(self, tr):
        self.parts, self.n, self.tr = [], 0, tr
    def write(self, s):
        s = str(s)
        self.n += len(s)
        if self.n > MAX_OUT:
            raise TooMuchOutput()
        self.parts.append(s)
        self.tr.append(s)
        return len(s)
    def flush(self):
        pass
    def value(self):
        return "".join(self.parts)

def friendly(e):
    name = type(e).__name__
    line = getattr(e, "lineno", None) if isinstance(e, SyntaxError) else None
    if line is None:
        for fr in traceback.extract_tb(e.__traceback__):
            if fr.filename == "main.py":
                line = fr.lineno
    msg = e.msg if isinstance(e, SyntaxError) else str(e)
    return {"type": name, "msg": msg, "line": line, "hint": HINTS.get(name, "")}

def run(code, inputs=(), seed=1, files=None, call=None):
    """Run a program with the given input lines. Returns stdout (print output only), a console transcript,
    and details of any error or missing input."""
    tr, feed, used = [], list(inputs), [0]
    out = Out(tr)
    def _input(prompt=""):
        prompt = str(prompt)
        tr.append(prompt)
        if not feed:
            raise NeedInput(prompt)
        v = str(feed.pop(0))
        used[0] += 1
        tr.append(v + "\n")
        return v
    ns = {"__name__": "__main__", "input": _input}
    old_out, old_cwd = sys.stdout, os.getcwd()
    work = tempfile.mkdtemp(prefix="bw")
    os.chdir(work)
    for name, content in (files or {}).items():
        with open(name, "w") as fh:
            fh.write(content)
    random.seed(seed)
    res = {"error": None, "need_input": False, "prompt": "", "value": None, "call_out": ""}
    sys.stdout = out
    try:
        exec(compile(code, "main.py", "exec"), ns)
        if call:
            before = out.n
            res["value"] = eval(call, ns)
            res["call_out"] = out.value()[before:] if out.n >= before else ""
    except NeedInput as e:
        res["need_input"], res["prompt"] = True, str(e)
    except TooMuchOutput:
        res["error"] = {"type": "TooMuchOutput", "msg": "Your program printed a huge amount of output.", "line": None,
                        "hint": "Check your loops: one of them might never stop."}
    except SystemExit:
        pass
    except BaseException as e:
        res["error"] = friendly(e)
    finally:
        sys.stdout = old_out
        os.chdir(old_cwd)
    res.update(stdout=out.value(), transcript="".join(tr), used=used[0])
    return res

# ---------------- marking ----------------
NUM = re.compile(r"-?\d+(?:\.\d+)?")

def norm_lines(s, cs=False):
    out = []
    for line in s.splitlines():
        line = re.sub(r"\s+", " ", line).strip()
        line = re.sub(r"[.!:;,]+$", "", line).strip()
        if line:
            out.append(line if cs else line.lower())
    return out

def num_eq(a, b, tol):
    return abs(a - b) <= tol

def subseq(want, got, tol):
    i = 0
    for g in got:
        if i < len(want) and num_eq(g, want[i], tol):
            i += 1
    return i == len(want)

def has_word(text, w, cs):
    flags = 0 if cs else re.I
    return re.search(r"(?<![A-Za-z0-9])" + re.escape(w) + r"(?![A-Za-z0-9])", text, flags) is not None

def fmt_num(x):
    return str(int(x)) if float(x).is_integer() else str(x)

def check_output(stdout, spec, n_inputs=0, used=0):
    """Return (passed, reason). Several flexible ways to describe correct output."""
    cs = spec.get("cs", False)
    text = stdout if cs else stdout.lower()
    if "lines" in spec:
        want, got = norm_lines("\n".join(spec["lines"]), cs), norm_lines(stdout, cs)
        if got != want:
            return False, "Expected output:\n" + "\n".join(spec["lines"])
    if "has" in spec:
        pos = 0
        for h in spec["has"]:
            k = text.find(h if cs else h.lower(), pos)
            if k < 0:
                return False, f"Expected the output to include “{h}”" + (" (in that order)" if len(spec["has"]) > 1 else "")
            pos = k + len(h)
    for w in spec.get("words", []):
        if not has_word(stdout, w, cs):
            return False, f"Expected the output to include the word “{w}”"
    for w in spec.get("not", []):
        if has_word(stdout, w, cs):
            return False, f"The output shouldn't include “{w}” for this input"
    if "nums" in spec:
        want = [float(x) for x in spec["nums"]]
        got = [float(x) for x in NUM.findall(stdout)]
        tol = float(spec.get("tol", 1e-6))
        listed = ", ".join(fmt_num(w) for w in want)
        if spec.get("exact"):
            ok = len(got) == len(want) and all(num_eq(g, w, tol) for g, w in zip(got, want))
            why = f"Expected exactly these numbers: {listed}"
        elif spec.get("mode") == "subseq":
            # the numbers must appear in this order, with only a little extra output allowed
            slack = int(spec.get("slack", max(3, n_inputs + 2)))
            ok = subseq(want, got, tol) and len(got) <= len(want) + slack
            why = f"Expected the numbers {listed} (in that order) in the output"
        else:
            # default: the answer is the last number(s) printed, so echoing the inputs first is fine
            ok = len(got) >= len(want) and all(num_eq(g, w, tol) for g, w in zip(got[-len(want):], want))
            why = "Expected the output to finish with " + ("the number " if len(want) == 1 else "the numbers ") + listed
        if not ok:
            return False, why
    if "compact" in spec:
        squashed = re.sub(r"[^A-Za-z0-9]", "", stdout)
        target = spec["compact"]
        if (target if cs else target.lower()) not in (squashed if cs else squashed.lower()):
            return False, f"Expected “{target}” in the output"
    if "regex" in spec and not re.search(spec["regex"], stdout, 0 if cs else re.I):
        return False, spec.get("regex_msg", "The output isn't in the expected format")
    if "used" in spec and used != spec["used"]:
        return False, f"Expected your program to ask for input {spec['used']} time" + ("s" if spec["used"] != 1 else "") + f" (it asked {used})"
    return True, ""

def values_eq(a, b, tol=1e-6, cs=True):
    if isinstance(b, bool) or isinstance(a, bool):
        return type(a) is type(b) and a == b
    if isinstance(b, (int, float)) and isinstance(a, (int, float)):
        return abs(a - b) <= tol * max(1, abs(b))
    if isinstance(b, str) and isinstance(a, str):
        return a == b if cs else a.strip().lower() == b.strip().lower()
    if isinstance(b, (list, tuple)) and isinstance(a, (list, tuple)):
        return len(a) == len(b) and all(values_eq(x, y, tol, cs) for x, y in zip(a, b))
    return a == b

def run_test(code, t):
    files = t.get("files")
    if "call" in t:
        r = run(code, t.get("i", []), files=files, call=t["call"])
        if r["error"] or r["need_input"]:
            return fail_from(r, t)
        expected = eval(t["ret"], {}) if "ret" in t else None
        ok, why = True, ""
        if "ret" in t and not values_eq(r["value"], expected, float(t.get("tol", 1e-6)), t.get("cs", True)):
            ok, why = False, f"{t['call']} returned {r['value']!r}, expected {expected!r}"
        if ok and "o" in t:
            ok, why = check_output(r["call_out"], t["o"])
        return {"pass": ok, "reason": why, "stdout": r["stdout"][-4000:], "got": repr(r["value"])[:300]}
    r = run(code, t.get("i", []), files=files)
    if r["error"] or r["need_input"]:
        return fail_from(r, t)
    ok, why = check_output(r["stdout"], t.get("o", {}), len(t.get("i", [])), r["used"])
    return {"pass": ok, "reason": why, "stdout": r["stdout"][-4000:], "transcript": r["transcript"][-4000:]}

def fail_from(r, t):
    if r["need_input"]:
        n = len(t.get("i", []))
        why = f"Your program asked for more input than this test gives it ({n} value" + ("s" if n != 1 else "") + ")."
        if "call" in t:
            why = "Your code asked for input while being tested. Only use input() outside the function (or not at all)."
        return {"pass": False, "reason": why, "stdout": r["stdout"][-4000:], "transcript": r["transcript"][-4000:]}
    e = r["error"]
    where = f" on line {e['line']}" if e.get("line") else ""
    return {"pass": False, "reason": f"{e['type']}{where}: {e['msg']}", "error": e, "stdout": r["stdout"][-4000:], "transcript": r["transcript"][-4000:]}

REQ_LABELS = {"loop": "Uses a loop", "for": "Uses a for loop", "while": "Uses a while loop", "if": "Uses selection (if)",
              "def": "Defines a function", "return": "Returns a value", "list": "Uses a list", "file": "Opens a file"}

def check_requires(code, reqs):
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return [{"label": REQ_LABELS.get(r, r), "ok": False} for r in reqs]
    nodes = list(ast.walk(tree))
    names = {n.id for n in nodes if isinstance(n, ast.Name)} | {n.attr for n in nodes if isinstance(n, ast.Attribute)}
    out = []
    for r in reqs:
        if r == "loop": ok = any(isinstance(n, (ast.For, ast.While, ast.comprehension)) for n in nodes)
        elif r == "for": ok = any(isinstance(n, ast.For) for n in nodes)
        elif r == "while": ok = any(isinstance(n, ast.While) for n in nodes)
        elif r == "if": ok = any(isinstance(n, (ast.If, ast.IfExp)) for n in nodes)
        elif r == "def": ok = any(isinstance(n, ast.FunctionDef) for n in nodes)
        elif r == "return": ok = any(isinstance(n, ast.Return) and n.value is not None for n in nodes)
        elif r == "list": ok = any(isinstance(n, (ast.List, ast.ListComp)) for n in nodes) or "list" in names or "split" in names
        elif r == "file": ok = "open" in names
        elif r.startswith("def:"):
            ok = any(isinstance(n, ast.FunctionDef) and n.name == r[4:] for n in nodes)
            out.append({"label": f"Defines a function called {r[4:]}", "ok": ok}); continue
        elif r.startswith("keep:"):
            ok = re.sub(r"\s+", "", r[5:]) in re.sub(r"\s+", "", code)
            out.append({"label": f"Keeps the given line: {r[5:].strip()}", "ok": ok}); continue
        elif r.startswith("recursive:"):
            name = r[10:]
            fns = [n for n in nodes if isinstance(n, ast.FunctionDef) and n.name == name]
            ok = any(isinstance(c, ast.Call) and isinstance(c.func, ast.Name) and c.func.id == name for f in fns for c in ast.walk(f))
            out.append({"label": f"{name}() calls itself (recursion)", "ok": ok}); continue
        elif r.startswith("no:"):
            ok = r[3:] not in names
            out.append({"label": f"Doesn't use {r[3:]}()", "ok": ok}); continue
        else: ok = True
        out.append({"label": REQ_LABELS.get(r, r), "ok": ok})
    return out

def api(payload):
    """Single entry point used by the web worker: JSON in, JSON out."""
    p = json.loads(payload)
    if p["op"] == "run":
        r = run(p["code"], p.get("inputs", []), p.get("seed", 1), p.get("files"))
        r.pop("value", None)
        return json.dumps(r)
    if p["op"] == "test":
        return json.dumps(run_test(p["code"], p["test"]))
    if p["op"] == "requires":
        return json.dumps(check_requires(p["code"], p.get("requires", [])))
    return json.dumps({"error": "unknown op"})
