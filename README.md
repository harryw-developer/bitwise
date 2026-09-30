# Bitwise: GCSE Computer Science revision

A gamified revision platform for GCSE (9–1) Computer Science with student and teacher accounts, classes, tasks (assignments), class leaderboards, a Python coding lab and detailed teacher analytics.

- **288 quizzes and challenges**: 57 topics × 4 levels (Bronze, Silver, Gold, Platinum exam mode), a boss battle per unit, 6 quick-fire modes (Daily Challenge, Speed Run, Binary Blitz, Logic Lab, Code Tracer, Weak Spots) and **69 Coding Lab challenges** (including debug and finish-the-code ones).
- **Coding Lab**: a Python IDE in the browser (Pyodide in a Web Worker + CodeMirror). Programs are **marked on what they output, not how they're written**: flexible checks on numbers, words, lines, return values, files and how many times input is asked for; hidden tests stop hard-coding; optional rules such as "use a loop" or "don't use max()" are checked from the code's syntax tree. Interactive console with `input()`, friendly error messages with the line highlighted, infinite-loop protection, hints and autosaved drafts.
- **8 question types**: multiple choice, typed answers, bit toggles, drag-to-order, match pairs, sort into groups, live logic circuits and clickable truth tables. About 420 written questions, 42 hands-on activities and 38 generators that create new questions every time.
- **Game layer**: XP and levels with titles, combos, lives, boss HP, a 60-second Speed Run, day streaks, 20 badges, weekly targets, confetti and sound.
- **Teachers**: classes with join codes, a **school directory** of school-made student logins (each student can be in any number of classes), notices to students, leaderboard controls, and a **Task Library** for setting homework.
- **School-managed accounts**: logins made by the school are labelled **Managed by your School** for the student and for teachers. Students can't change their name, password or classes, leave classes or delete the account; teachers at the school rename them, move them between classes or remove them.
- **Message centre**: teachers send notices (optionally pinned) to one or more classes; students see them under **Messages** with unread counts.
- **Task Library**: a File Explorer-style browser (Windows 10 feel) over every quiz level, coding challenge, boss battle and quick-fire mode: folder tree with Quick access ("Selected for task", "Recently used"), address bar with back/forward/up and breadcrumb dropdowns, search across folders, details or large-icons view with sortable columns, item check boxes, Ctrl/Shift multi-select, right-click menus, a preview pane (Alt+P) and keyboard control (arrows, Space, Enter, Backspace, Alt+←/→/↑, Ctrl+A, Ctrl+E). Ticked items from any folders become **one homework task** with up to 20 items (reorder before setting). Students see every item with its own status; the task is complete when every item reaches the target score.
- **Teacher analytics**: every answer is logged with the student's answer, the correct answer, whether it was right first time, the retry number and the **active time spent on that question** (the stopwatch pauses when the tab is hidden). Per-task question breakdowns (hardest first, average time, average tries, most common wrong answer), a page per student with every attempt and answer, students' submitted code with test results, class heatmaps, and CSV export of every answer.

## How it's built

| Part | Where |
| --- | --- |
| Front end (static single-page app, no framework) | `src/` → built into `public/` by `build.sh` |
| Sign-in | Firebase Authentication (email + password), project `bitwise-1293f` |
| Database | Cloud Firestore; rules in `firebase/firestore.rules`, indexes in `firebase/firestore.indexes.json` |
| Python runner + marker | `src/harness.py` (runs in Pyodide inside `public/py-worker.js`, and in normal Python for validation) |
| Coding challenges | `src/data-code.js`. Model solutions are stripped from the student bundle and stored in the teacher-only `codeSolutions` collection |

The project is on Firebase's free **Spark** plan, so there's no server code: the **Firestore security rules act as the server**. They check that a finished quiz's XP matches the score (with the daily bonus only once per day), that a quiz wasn't finished faster than 1.5 seconds per question, that an attempt can only be finished once, that streaks follow the server clock, that class leaderboard entries match the student's real profile and that teacher copies of results match the student's real attempt. Students only see their own data and their classmates' leaderboard entries; teachers only see their own classes and their own school's directory.

Data layout: `users/{uid}` (profile, with `attempts`, `best`, `daily`, `badges`, `reads` below it), `schools/{id}`, `teacherCodes/{code}`, `classes/{id}` (with `members`, `tasks`, `notices` and `results` below it), `classCodes/{code}` and `codeSolutions/{challenge}`.

School-made logins are Firebase accounts with an internal address (`username@pupils.bitwise.invalid`) created from the teacher's browser, so no email is needed.

### Limits of the free plan

- **Passwords of school-made logins can't be reset.** Changing another person's password needs server code (Cloud Functions, Blaze plan). Print the login cards or download the CSV when you create logins. If a student loses theirs, remove them from the school and make a new login.
- **Removing a student from the school** deletes their profile, class places and scores, and stops them signing in, but the (now empty) sign-in record stays in Firebase Authentication. Delete it under **Authentication → Users** if you want it gone completely.
- **Quotas**: 50,000 reads and 20,000 writes a day. That's enough for a few classes; reports read each class's results in one go to keep reads low. Move to Blaze (pay as you go) for a whole school.

## Deploy

**Live site (GitHub Pages):** https://harryw-developer.github.io/bitwise/

To publish an update: `sh tools/deploy-gh-pages.sh`. It builds the site and force-pushes `public/` to the `gh-pages` branch, which GitHub Pages serves. GitHub Pages can't send custom headers, so the page also carries its Content Security Policy in a `<meta>` tag.

Other hosts work too:

1. Run `sh build.sh`. This writes `public/` (index.html, app.css, app.js and security headers).
2. Host `public/` on any static host:
   - **Netlify**: drag the `public` folder onto app.netlify.com/drop, or connect the repo (`netlify.toml` is included).
   - **Vercel**: `vercel deploy` (`vercel.json` sets the output folder and security headers).
   - **Cloudflare (Workers & Pages, connected to the repo)**: in the project's **Settings → Build**, set **Build command** to `sh build.sh` and leave **Deploy command** as `npx wrangler deploy`. `wrangler.jsonc` serves `public/` as static assets (with the headers in `public/_headers`); its `name` must match the project name in Cloudflare. Only Node.js is needed to build.
   - **Cloudflare Pages (classic)**: build command `sh build.sh`, output directory `public`.
3. Add your live domain in the Firebase console under **Authentication → Settings → Authorized domains**.

## Firebase set-up

1. **Authentication → Sign-in method**: enable **Email/Password**.
2. **Authentication → Settings → Authorized domains**: add `harryw-developer.github.io` (and any other host you use). `localhost` is there by default.
3. **Rules and indexes**: `firebase deploy --only firestore` (uses `firebase.json` and `.firebaserc`).
4. **Model solutions**: `GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token) python3 tools/seed-solutions.py`.
5. **Emails** (password reset and address checks for accounts with email) come from Firebase's own sender. Change the templates under **Authentication → Templates**.

## Schools and teacher codes

The first teacher at a school chooses **I'm a teacher → Set up a new school** and gets a teacher code (e.g. `ABCDE-FGHJK`). Colleagues choose **Join my school** and enter it, which is what stops students making themselves teachers. The code is on the teacher's **Profile**; the teacher who set up the school can replace it.

## Editing content

- Questions: `src/data-1.js` … `src/data-6.js` (rows are `[difficulty 1–3, question, correct answer, [wrong answers], explanation]`).
- Hands-on activities (match / order / sort): `src/data-interactive.js`.
- Generators: `src/gen.js` (typed/multiple choice) and `src/gen-2.js` (bits, circuits, truth tables, sort order).
- Coding challenges: `src/data-code.js` (kinds: normal, `fill` = finish the code, `debug` = fix the bugs). Model solutions are kept in `solutions/code-solutions.json`, which is **git-ignored** so students can't read them in the public repository; teachers read them from the `codeSolutions` collection. Each challenge has `tests` (`T(inputs, outputCheck, hidden)` or `F("func(args)", "expected", hidden)`), optional `req` rules and a model `solution`. Run the validator before shipping (every solution must pass, every starter must fail), then run `tools/seed-solutions.py` (see Firebase set-up) so teachers see the new solution.
- Then run `sh build.sh` and redeploy `public/`.

## Data protection (UK GDPR)

Bitwise stores display names, email addresses (not for school-made logins), quiz results, badges and read receipts for notices in Firebase. Before use with pupils, the school should:
- keep the Firestore database in the UK (this project uses `europe-west2`, London), add Bitwise to its privacy notice and record of processing, and complete a DPIA (children's data);
- accept Google's data processing terms (Firebase console → Project settings → Privacy);
- prefer school-made logins with first name + initial for younger students.

Students and teachers with their own email can delete their account from **Profile → Delete account**, which removes their data. School-managed accounts are removed by a teacher from the **School directory**.

## Development

```sh
sh build.sh && python3 tools/serve.py 5173
```

`tools/serve.py` applies the production security headers from `public/_headers`, so anything the Content Security Policy would block shows up locally too. The page runs under a strict policy; only the Python worker is allowed to compile WebAssembly.

Test accounts created during development are listed in `firebase/test-accounts.local.md` (git-ignored). Remove them before going live from the Firebase console (**Authentication → Users**, and the matching `users`, `schools` and `classes` documents in Firestore).
