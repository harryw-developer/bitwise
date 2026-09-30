/* Sign in, sign up (student / teacher joining a school / teacher creating a school), password reset */
BW.ui.authMode = "signin";
BW.viewAuth = () => {
  const m = BW.ui.authMode, role = BW.ui.signupRole || "student", tmode = BW.ui.teacherMode || "join";
  let form = "";
  if (m === "signin") form = `<h2>Welcome back</h2><p class="muted">Use your email or school username.</p>
    <form id="authForm" class="form"><label for="siId">Email or username</label><input id="siId" autocomplete="username" required>
    <label for="siPw">Password</label><input id="siPw" type="password" autocomplete="current-password" required>
    <button class="cta">Sign in</button></form>
    <div class="auth-links"><button class="link" data-auth="forgot">Forgot password?</button><span>New here? <button class="link" data-auth="signup">Create an account</button></span></div>`;
  if (m === "signup") form = `<h2>Create your account</h2>
    <div class="seg" role="radiogroup" aria-label="Account type"><button type="button" class="${role === "student" ? "on" : ""}" data-role="student" role="radio" aria-checked="${role === "student"}">I'm a student</button><button type="button" class="${role === "teacher" ? "on" : ""}" data-role="teacher" role="radio" aria-checked="${role === "teacher"}">I'm a teacher</button></div>
    ${role === "teacher" ? `<div class="seg small" role="radiogroup" aria-label="School"><button type="button" class="${tmode === "join" ? "on" : ""}" data-tmode="join">Join my school</button><button type="button" class="${tmode === "create" ? "on" : ""}" data-tmode="create">Set up a new school</button></div>` : ""}
    <form id="authForm" class="form"><label for="suName">${role === "teacher" ? "Name students will see (e.g. Ms Patel)" : "Your name (first name and initial is fine)"}</label><input id="suName" maxlength="40" autocomplete="name" required>
    <label for="suEmail">Email</label><input id="suEmail" type="email" autocomplete="email" required>
    <label for="suPw">Password</label><input id="suPw" type="password" minlength="8" autocomplete="new-password" placeholder="At least 8 characters" required>
    ${role === "teacher" && tmode === "join" ? `<label for="suCode">Teacher code</label><input id="suCode" autocomplete="off" placeholder="From a colleague already on Bitwise, e.g. ABCDE-FGHJK" required>` : ""}
    ${role === "teacher" && tmode === "create" ? `<label for="suSchool">School name</label><input id="suSchool" maxlength="80" placeholder="e.g. Kingsbridge Academy" required><p class="note">You'll get a teacher code to share with colleagues.</p>` : ""}
    <p class="note">We store your name, email and progress. You can delete your account at any time from your profile.</p>
    <button class="cta">Create account</button></form>
    <div class="auth-links"><span>Already have an account? <button class="link" data-auth="signin">Sign in</button></span></div>
    ${role === "student" ? `<p class="note">Have a school username? Sign in with it instead.</p>` : ""}`;
  if (m === "forgot") form = `<h2>Reset your password</h2><p class="muted">We'll email you a link. For a school username, ask your teacher.</p>
    <form id="authForm" class="form"><label for="fgEmail">Email</label><input id="fgEmail" type="email" autocomplete="email" required><button class="cta">Send reset link</button></form>
    <div class="auth-links"><button class="link" data-auth="signin">Back to sign in</button></div>`;
  if (m === "check") form = `<h2>Check your inbox</h2><p class="muted">If there's an account for <b>${E(BW.ui.authEmail || "that email")}</b>, a reset link is on its way. Follow it, then come back and sign in.</p><div class="auth-links"><button class="link" data-auth="signin">Back to sign in</button></div>`;
  return `<div class="auth">
    <section class="auth-art" style="background-image:${BW.cover("auth-hero", "#2F9BB3", "#F0A35E", "bits", 900, 1100)}">
      <div class="logo big" aria-hidden="true">01</div>
      <div><h1>Master computer science, one bit at a time.</h1></div>
    </section>
    <section class="auth-card"><div class="auth-brand"><b>Bitwise</b></div>${form}<p class="auth-err" id="authErr" role="alert"></p></section>
  </div>`;
};
BW.bindAuth = root => {
  const err = t => { root.querySelector("#authErr").textContent = t || ""; };
  root.querySelectorAll("[data-auth]").forEach(b => b.onclick = () => { BW.ui.authMode = b.dataset.auth; BW.render(); });
  root.querySelectorAll("[data-role]").forEach(b => b.onclick = () => { BW.ui.signupRole = b.dataset.role; BW.render(); });
  root.querySelectorAll("[data-tmode]").forEach(b => b.onclick = () => { BW.ui.teacherMode = b.dataset.tmode; BW.render(); });
  const f = root.querySelector("#authForm"); if (!f) return;
  const v = id => root.querySelector("#" + id)?.value.trim() || "";
  f.onsubmit = async e => {
    e.preventDefault(); err("");
    const btn = f.querySelector("button.cta"), label = btn.textContent; btn.disabled = true; btn.textContent = "Please wait…";
    const m = BW.ui.authMode;
    try {
      if (m === "signin") await BW.api.signIn(v("siId"), root.querySelector("#siPw").value);
      else if (m === "signup") {
        const role = BW.ui.signupRole || "student", create = role === "teacher" && (BW.ui.teacherMode || "join") === "create";
        BW.ui.signingUp = true;
        await BW.api.signUp({ email: v("suEmail"), password: root.querySelector("#suPw").value, name: v("suName"), role,
          teacherCode: role === "teacher" && !create ? v("suCode") : "", schoolName: create ? v("suSchool") : "" });
        BW.ui.signingUp = false; BW.enter(BW.auth.currentUser, true);
      } else if (m === "forgot") {
        await BW.api.resetEmail(v("fgEmail")).catch(x => { if (x.code !== "auth/user-not-found") throw x; });
        BW.ui.authEmail = v("fgEmail"); BW.ui.authMode = "check"; BW.render();
      }
    } catch (x) { BW.ui.signingUp = false; err(BW.errMsg(x)); btn.disabled = false; btn.textContent = label; }
  };
  root.querySelector("#siId, #suName, #fgEmail")?.focus();
};
