#!/usr/bin/env python3
"""Serve public/ locally WITH the production security headers from public/_headers (so CSP problems show up before deploy)."""
import http.server, os, sys, fnmatch
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173

def load_rules():
    rules, cur = [], None
    for line in open(os.path.join(ROOT, "_headers")):
        if not line.strip():
            continue
        if not line[0].isspace():
            cur = (line.strip(), {}); rules.append(cur)
        elif cur and ":" in line:
            k, v = line.strip().split(":", 1); cur[1][k.strip()] = v.strip()
    return rules

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def end_headers(self):
        path = self.path.split("?")[0]
        if path == "/": path = "/index.html"
        for pattern, headers in load_rules():
            if fnmatch.fnmatch(path, pattern):
                for k, v in headers.items(): self.send_header(k, v)
        super().end_headers()
    def guess_type(self, path):
        return "application/wasm" if str(path).endswith(".wasm") else super().guess_type(path)

print(f"Bitwise on http://localhost:{PORT} (production headers applied)")
http.server.ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
