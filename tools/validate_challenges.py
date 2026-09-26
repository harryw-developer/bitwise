#!/usr/bin/env python3
"""Check every Coding Lab challenge: the model solution must pass all tests and rules; the starter code must not."""
import json, os, signal, subprocess, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, os.path.join(ROOT, "src"))
import harness

js = 'global.BW={};eval(require("fs").readFileSync("src/data-code.js","utf8"));console.log(JSON.stringify(BW.CODE.all))'
items = json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))
SOL = os.path.join(ROOT, "solutions", "code-solutions.json")
if not os.path.exists(SOL):
    sys.exit("solutions/code-solutions.json is missing (it is kept out of git). Model solutions can be exported from the code_solutions table.")
sols = json.load(open(SOL))
missing = [c["id"] for c in items if c["id"] not in sols]
if missing: sys.exit("No model solution for: " + ", ".join(missing))
for c in items: c["solution"] = sols[c["id"]]
class Timeout(Exception): pass
def on_alarm(*_): raise Timeout()
signal.signal(signal.SIGALRM, on_alarm)

problems = []
for c in items:
    for label, code, must_pass in (("solution", c["solution"], True), ("starter", c["starter"], False)):
        results = []
        for t in c["tests"]:
            signal.alarm(3)
            try: results.append(harness.run_test(code, t))
            except Timeout: results.append({"pass": False, "reason": "timed out"})
            finally: signal.alarm(0)
        reqs = harness.check_requires(code, c["req"])
        ok = all(r["pass"] for r in results) and all(q["ok"] for q in reqs)
        if must_pass and not ok:
            problems.append(f"{c['id']}: model solution fails: " + "; ".join([r["reason"] for r in results if not r["pass"]] + [q["label"] for q in reqs if not q["ok"]]))
        if not must_pass and ok:
            problems.append(f"{c['id']}: starter code already passes everything")
print(f"Checked {len(items)} challenges.")
print("\n".join(problems) if problems else "All model solutions pass and no starter passes.")
sys.exit(1 if problems else 0)
