#!/bin/sh
# Builds the deployable site into public/:
#   index.html · app.css · app.js · py-worker.js (Python runner) · _headers (security headers)
# Model solutions stay out of the bundle: tools/seed-solutions.sh uploads them to the teacher-only Firestore collection.
set -e
cd "$(dirname "$0")"
OUT=public
mkdir -p "$OUT" build
VER=$(date +%Y%m%d%H%M%S)
FB="https://www.gstatic.com/firebasejs/10.14.1"
CM="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16"
FB_AUTH_DOMAIN=$(sed -n 's/.*authDomain: "\([^"]*\)".*/\1/p' src/config.js)

# 1) Coding Lab data without model solutions (students never receive them)
node -e '
global.BW = {}; eval(require("fs").readFileSync("src/data-code.js", "utf8"));
const { all, ...code } = BW.CODE;
require("fs").writeFileSync("build/data-code.gen.js", "(() => {\nBW.CODE = " + JSON.stringify(code) + ";\nBW.CODE.all = BW.CODE.sections.flatMap(s => s.items.map(c => ({ ...c, kind: c.kind || s.kind || null, section: s })));\nBW.findChallenge = id => BW.CODE.all.find(c => c.id === id);\n})();\n");
'

# 2) CSS + JS bundles
cat src/styles.css src/styles-game.css src/styles-code.css src/styles-library.css src/styles-school.css > "$OUT/app.css"
JS="src/config.js src/core.js src/fx.js src/gen.js src/data-1.js src/data-2.js src/data-3.js src/data-4.js src/data-5.js src/data-6.js src/gen-2.js src/data-interactive.js build/data-code.gen.js src/widgets.js src/fb.js src/fb-teacher.js src/app-state.js src/quiz-build.js src/quiz-play.js src/app-views.js src/app-student.js src/teacher-home.js src/teacher-class.js src/teacher-analytics.js src/teacher-library.js src/teacher-progress.js src/school.js src/app-board.js src/ide.js src/app-auth.js src/app-main.js"
{ echo '"use strict";'; for f in $JS; do echo "/* ---- $f ---- */"; cat "$f"; echo; done; } | sed "s/__VER__/$VER/g" > "$OUT/app.js"
if grep -q -e 'solution:' -e '"solution":' "$OUT/app.js"; then echo "ERROR: a model solution leaked into app.js"; exit 1; fi

cp src/boot.js "$OUT/boot.js"

# 3) Python worker with the marking harness embedded
{ printf 'const HARNESS = '; node -e 'console.log(JSON.stringify(require("fs").readFileSync("src/harness.py", "utf8")).replace(/[\u0080-\uffff]/g, c => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")) + ";")'; cat src/py-worker.js; } > "$OUT/py-worker.js"

CSP="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com; frame-src https://$FB_AUTH_DOMAIN; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"
META_CSP=$(printf "%s" "$CSP" | sed "s/; frame-ancestors 'none'//")
# 4) Page
cat > "$OUT/index.html" <<EOF
<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Bitwise</title>
<meta name="description" content="Master computer science, one bit at a time.">
<meta http-equiv="Content-Security-Policy" content="$META_CSP">
<meta name="theme-color" content="#1D2023">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23F0A35E'/%3E%3Cstop offset='1' stop-color='%232F9BB3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='32' cy='32' r='32' fill='url(%23g)'/%3E%3Ctext x='32' y='41' font-family='monospace' font-weight='700' font-size='24' text-anchor='middle' fill='%231D2023'%3E01%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap">
<link rel="stylesheet" href="$CM/codemirror.min.css" integrity="sha384-zaeBlB/vwYsDRSlFajnDd7OydJ0cWk+c2OWybl3eSUf6hW2EbhlCsQPqKr3gkznT" crossorigin="anonymous">
<link rel="stylesheet" href="app.css?v=$VER">
<script src="boot.js?v=$VER"></script>
</head>
<body>
$(cat src/markup.html)
<script src="$FB/firebase-app-compat.js" integrity="sha384-ZaR6mWzmJtrRibZ1Vm7SoHFr8OXjyAuGAXalGDKqbxFT18oi/z+oZLIRFkpeNor1" crossorigin="anonymous"></script>
<script src="$FB/firebase-auth-compat.js" integrity="sha384-I1LYojsZ5RM1cOda44Z2h42Qa6YfsQ1XkXxREnhp4ueYBR/4d1pG1K+NZM537Vsj" crossorigin="anonymous"></script>
<script src="$FB/firebase-firestore-compat.js" integrity="sha384-Ke0FJhH7LyRqDxZ0wt+/OXV38yfQVu7g9VPEEGjYmB4RVOY/ta04uecRhsMwT7V3" crossorigin="anonymous"></script>
<script src="$CM/codemirror.min.js" integrity="sha384-ZYmwuq4n2gOcNxMSiJ6jyTj+BbIrilr7p6dlq6q5nmSWKmsH9UU4K1qqjycMkfmR" crossorigin="anonymous"></script>
<script src="$CM/mode/python/python.min.js" integrity="sha384-Xy+2exU6lBoT4OpUOtnQb+cUpn+nlJQEHvRobWVtwz6wIsw4oNoO7xyd/l8rYgMy" crossorigin="anonymous"></script>
<script src="$CM/addon/edit/matchbrackets.min.js" integrity="sha384-LjCI3E8qhhxXZvu7+FCvqx9eZYSowFvuJ7z54KsgI/BDPGKEuysqCg/vYiKHvC4Y" crossorigin="anonymous"></script>
<script src="$CM/addon/edit/closebrackets.min.js" integrity="sha384-69mJoUoPPF/C7qPs6lLjvXvrt6w225+rmxWqGO3a1glVjITdnnwPQOtG9FRTd2Ni" crossorigin="anonymous"></script>
<script src="app.js?v=$VER"></script>
</body>
</html>
EOF

# 5) Security headers. The page itself gets a strict policy; the Python worker additionally needs WebAssembly.
WCSP="default-src 'none'; script-src https://cdn.jsdelivr.net 'wasm-unsafe-eval' 'unsafe-eval'; connect-src https://cdn.jsdelivr.net"
cat > "$OUT/_headers" <<EOF
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
/
  Content-Security-Policy: $CSP
  Cache-Control: no-cache
/index.html
  Content-Security-Policy: $CSP
  Cache-Control: no-cache
/py-worker.js
  Content-Security-Policy: $WCSP
  Cache-Control: no-cache
/app.*
  Cache-Control: public, max-age=31536000, immutable
EOF
cat > vercel.json <<EOF
{
  "outputDirectory": "public",
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
      { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" } ] },
    { "source": "/", "headers": [ { "key": "Content-Security-Policy", "value": "$CSP" } ] },
    { "source": "/index.html", "headers": [ { "key": "Content-Security-Policy", "value": "$CSP" } ] },
    { "source": "/py-worker.js", "headers": [ { "key": "Content-Security-Policy", "value": "$WCSP" } ] }
  ]
}
EOF
touch "$OUT/.nojekyll"
echo "Built $OUT/ (app.js $(wc -c < $OUT/app.js | tr -d ' ') bytes, py-worker.js $(wc -c < $OUT/py-worker.js | tr -d ' ') bytes, app.css $(wc -c < $OUT/app.css | tr -d ' ') bytes)"
