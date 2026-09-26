# Bitwise: GCSE Computer Science revision

A gamified revision platform for GCSE (9–1) Computer Science with student and teacher accounts, classes, tasks (assignments), class leaderboards, a Python coding lab and detailed teacher analytics.

- **288 quizzes and challenges**: 57 topics × 4 levels (Bronze, Silver, Gold, Platinum exam mode), a boss battle per unit, 6 quick-fire modes (Daily Challenge, Speed Run, Binary Blitz, Logic Lab, Code Tracer, Weak Spots) and **43 Coding Lab challenges**.
- **Coding Lab**: a Python IDE in the browser (Pyodide in a Web Worker + CodeMirror). Programs are **marked on what they output, not how they're written**: flexible checks on numbers, words, lines, return values, files and how many times input is asked for; hidden tests stop hard-coding; optional rules such as "use a loop" or "don't use max()" are checked from the code's syntax tree. Interactive console with `input()`, friendly error messages with the line highlighted, infinite-loop protection, hints and autosaved drafts.
- **8 question types**: multiple choice, typed answers, bit toggles, drag-to-order, match pairs, sort into groups, live logic circuits and clickable truth tables. About 420 written questions, 42 hands-on activities and 38 generators that create new questions every time.
- **Game layer**: XP and levels with titles, combos, lives, boss HP, a 60-second Speed Run, day streaks, 20 badges, weekly targets, confetti and sound.
- **Teachers**: classes with join codes, logins for students without email, leaderboard controls, and a **Task Library** for setting homework.
- **Task Library**: a File Explorer-style browser (Windows 10 feel) over every quiz level, coding challenge, boss battle and quick-fire mode: folder tree with Quick access ("Selected for task", "Recently used"), address bar with back/forward/up and breadcrumb dropdowns, search across folders, details or large-icons view with sortable columns, item check boxes, Ctrl/Shift multi-select, right-click menus, a preview pane (Alt+P) and keyboard control (arrows, Space, Enter, Backspace, Alt+←/→/↑, Ctrl+A, Ctrl+E). Ticked items from any folders become **one homework task** with up to 20 items (reorder before setting). Students see every item with its own status; the task is complete when every item reaches the target score.
- **Teacher analytics**: every answer is logged with the student's answer, the correct answer, whether it was right first time, the retry number and the **active time spent on that question** (the stopwatch pauses when the tab is hidden). Per-task question breakdowns (hardest first, average time, average tries, most common wrong answer), a page per student with every attempt and answer, students' submitted code with test results, class heatmaps, and CSV export of every answer.

## How it's built

| Part | Where |
| --- | --- |
| Front end (static single-page app, no framework) | `src/` → built into `public/` by `build.sh` |
| Database, auth, row-level security, server functions | Supabase project **Bitwise** (`xejmxbombnpboxlnldha`, London) · SQL in `supabase/migrations/` |
| Student logins without email + account deletion | Edge function `supabase/functions/manage-students` |
| Python runner + marker | `src/harness.py` (runs in Pyodide inside `public/py-worker.js`, and in normal Python for validation) |
| Coding challenges | `src/data-code.js`. Model solutions are stripped from the student bundle and stored in a teacher-only table |

Scores are never trusted from the browser. `start_attempt` and `finish_attempt` run on the server. The score must also agree with the logged answers, and coding challenges only earn XP when a student beats their best score. They work out XP, streaks and badges themselves, cap the numbers a client can send, and reject quizzes finished faster than 1.5 seconds per question. Row-level security means students only see their own data and their classmates' leaderboard entries, and teachers only see students in their own classes.

## Deploy

**Live site (GitHub Pages):** https://harryw-developer.github.io/bitwise/

To publish an update: `sh tools/deploy-gh-pages.sh`. It builds the site and force-pushes `public/` to the `gh-pages` branch, which GitHub Pages serves. GitHub Pages can't send custom headers, so the page also carries its Content Security Policy in a `<meta>` tag.

Other hosts work too:

1. Run `sh build.sh`. This writes `public/` (index.html, app.css, app.js and security headers).
2. Host `public/` on any static host:
   - **Netlify**: drag the `public` folder onto app.netlify.com/drop, or connect the repo (`netlify.toml` is included).
   - **Vercel**: `vercel deploy` (`vercel.json` sets the output folder and security headers).
   - **Cloudflare Pages**: build command `sh build.sh`, output directory `public`.
3. Finish the Supabase settings below using your live URL.

## Supabase settings to finish in the dashboard

These can't be set from code, so do them once in the Supabase dashboard for the **Bitwise** project:

1. **Authentication → URL Configuration**: set **Site URL** to your live address (e.g. `https://bitwise.yourschool.org`) and add it under **Redirect URLs**. Password-reset and confirmation links use this.
2. **Authentication → Emails → SMTP Settings**: Supabase's built-in email only delivers to your own team's addresses and is heavily rate-limited. Add a real SMTP provider (e.g. Resend, Postmark, SendGrid) so teachers and students with email can confirm accounts and reset passwords. *Alternatively*, turn off **Confirm email** under **Sign In / Providers → Email** if accounts are only used inside school.
3. **Plan**: free projects pause after about a week without activity. Upgrade to Pro before real classes rely on it (this also gives you daily backups and leaked-password protection).

Students without an email don't need any of the email setup. Teachers create their logins from **Class → Students → Create student logins**.

## Teacher code

Signing up as a teacher needs the school's teacher code, so students can't make themselves teachers. Read or change it with SQL in the Supabase dashboard:

```sql
select value from public.app_settings where key = 'teacher_code';
update public.app_settings set value = 'NEW-CODE' where key = 'teacher_code';
```

Delete the row to let anyone sign up as a teacher.

## Editing content

- Questions: `src/data-1.js` … `src/data-6.js` (rows are `[difficulty 1–3, question, correct answer, [wrong answers], explanation]`).
- Hands-on activities (match / order / sort): `src/data-interactive.js`.
- Generators: `src/gen.js` (typed/multiple choice) and `src/gen-2.js` (bits, circuits, truth tables, sort order).
- Coding challenges: `src/data-code.js` (kinds: normal, `fill` = finish the code, `debug` = fix the bugs). Model solutions are kept in `solutions/code-solutions.json`, which is **git-ignored** so students can't read them in the public repository; teachers read them from the `code_solutions` table. Each challenge has `tests` (`T(inputs, outputCheck, hidden)` or `F("func(args)", "expected", hidden)`), optional `req` rules and a model `solution`. Run the validator before shipping (every solution must pass, every starter must fail), then apply `supabase/seed_code_solutions.sql` (written by `build.sh`) so teachers see the new solution.
- Then run `sh build.sh` and redeploy `public/`.

## Data protection (UK GDPR)

Bitwise stores display names, email addresses (not for teacher-made logins), quiz results and badges, in Supabase's London region. Before use with pupils, the school should:
- add Bitwise to its privacy notice and record of processing, and complete a DPIA (children's data);
- sign Supabase's DPA (Dashboard → Organization → Legal);
- prefer teacher-made logins with first name + initial for younger students.

Anyone can delete their own account from **Profile → Delete account**, which removes all of their data. Teachers can delete the logins they created.

## Development

```sh
sh build.sh && python3 tools/serve.py 5173
```

`tools/serve.py` applies the production security headers from `public/_headers`, so anything the Content Security Policy would block shows up locally too. The page runs under a strict policy; only the Python worker is allowed to compile WebAssembly.

Test accounts created during development are listed in `supabase/test-accounts.local.md` (git-ignored). Remove them before going live:

```sql
-- the test teacher's own pupil logins, then the test teacher (their classes and tasks go with them)
delete from auth.users where email like '%@pupils.bitwise.invalid' and id in (
  select m.student_id from public.class_members m join public.classes c on c.id = m.class_id
  join auth.users t on t.id = c.teacher_id where t.email like '%@bitwise-test.invalid');
delete from auth.users where email like '%@bitwise-test.invalid';
```
