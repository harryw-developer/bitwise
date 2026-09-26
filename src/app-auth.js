/* Sign in, sign up, password reset */
BW.ui.authMode = "signin";
BW.viewAuth = () => {
  const m = BW.ui.authMode, role = BW.ui.signupRole || "student";
  let form = "";
  if (m === "signin") form = `<h2>Welcome back</h2><p class="muted">Sign in with your email, or the username your teacher gave you.</p>
    <form id="authForm" class="form"><label for="siId">Email or username</label><input id="siId" autocomplete="username" required>
    <label for="siPw">Password</label><input id="siPw" type="password" autocomplete="current-password" required>
    <button class="cta">Sign in</button></form>
    <div class="auth-links"><button class="link" data-auth="forgot">Forgot password?</button><span>New here? <button class="link" data-auth="signup">Create an account</button></span></div>`;
  if (m === "signup") form = `<h2>Create your account</h2>
    <div class="seg" role="radiogroup" aria-label="Account type"><button type="button" class="${role === "student" ? "on" : ""}" data-role="student" role="radio" aria-checked="${role === "student"}">I'm a student</button><button type="button" class="${role === "teacher" ? "on" : ""}" data-role="teacher" role="radio" aria-checked="${role === "teacher"}">I'm a teacher</button></div>
    <form id="authForm" class="form"><label for="suName">${role === "teacher" ? "Name students will see (e.g. Ms Patel)" : "Your name (first name and initial is fine)"}</label><input id="suName" maxlength="40" autocomplete="name" required>
    <label for="suEmail">Email</label><input id="suEmail" type="email" autocomplete="email" required>
    <label for="suPw">Password</label><input id="suPw" type="password" minlength="8" autocomplete="new-password" placeholder="At least 8 characters" required>
    ${role === "teacher" ? `<label for="suCode">Teacher code</label><input id="suCode" autocomplete="off" placeholder="From your school's Bitwise admin" required>` : ""}
    <p class="note">We store your name, email and quiz results so you${role === "teacher" ? " can track your classes" : "r teacher can see your progress"}. You can delete your account at any time from your profile.</p>
    <button class="cta">Create account</button></form>
    <div class="auth-links"><span>Already have an account? <button class="link" data-auth="signin">Sign in</button></span></div>
    ${role === "student" ? `<p class="note">No email? Ask your teacher to create a login for you.</p>` : ""}`;
  if (m === "forgot") form = `<h2>Reset your password</h2><p class="muted">We'll email you a link. If your teacher made your login, ask them to reset it instead.</p>
    <form id="authForm" class="form"><label for="fgEmail">Email</label><input id="fgEmail" type="email" autocomplete="email" required><button class="cta">Send reset link</button></form>
    <div class="auth-links"><button class="link" data-auth="signin">Back to sign in</button></div>`;
  if (m === "reset") form = `<h2>Choose a new password</h2><form id="authForm" class="form"><label for="rsPw">New password</label><input id="rsPw" type="password" minlength="8" autocomplete="new-password" required><button class="cta">Save password</button></form>`;
  if (m === "check") form = `<h2>Check your inbox</h2><p class="muted">We've sent a link to <b>${E(BW.ui.authEmail || "your email")}</b>. Open it to finish, then come back and sign in.</p><div class="auth-links"><button class="link" data-auth="signin">Back to sign in</button></div>`;
  return `<div class="auth">
    <section class="auth-art" style="background-image:${BW.cover("auth-hero", "#2F9BB3", "#F0A35E", "bits", 900, 1100)}">
      <div class="logo big" aria-hidden="true">01</div>
      <div><h1>Revise GCSE Computer Science like it's a game.</h1>
      <div class="auth-pills"><span class="glass">${BW.quizCount()} quizzes</span><span class="glass">Boss battles</span><span class="glass">Class leaderboards</span><span class="glass">Teacher dashboards</span></div></div>
    </section>
    <section class="auth-card"><div class="auth-brand"><b>Bitwise</b><span class="muted">GCSE Computer Science</span></div>${form}<p class="auth-err" id="authErr" role="alert"></p></section>
  </div>`;
};
BW.bindAuth = root => {
  const err = t => { root.querySelector("#authErr").textContent = t || ""; };
  root.querySelectorAll("[data-auth]").forEach(b => b.onclick = () => { BW.ui.authMode = b.dataset.auth; BW.render(); });
  root.querySelectorAll("[data-role]").forEach(b => b.onclick = () => { BW.ui.signupRole = b.dataset.role; BW.render(); });
  const f = root.querySelector("#authForm"); if (!f) return;
  const v = id => root.querySelector("#" + id)?.value.trim() || "";
  f.onsubmit = async e => {
    e.preventDefault(); err("");
    const btn = f.querySelector("button.cta"), label = btn.textContent; btn.disabled = true; btn.textContent = "Please wait…";
    const done = () => { btn.disabled = false; btn.textContent = label; };
    const m = BW.ui.authMode;
    try {
      if (m === "signin") {
        const { error } = await BW.sb.auth.signInWithPassword({ email: BW.api.loginEmail(v("siId")), password: root.querySelector("#siPw").value });
        if (error) throw error;
      } else if (m === "signup") {
        const role = BW.ui.signupRole || "student";
        const { data, error } = await BW.sb.auth.signUp({ email: v("suEmail"), password: root.querySelector("#suPw").value,
          options: { emailRedirectTo: location.origin + location.pathname, data: { display_name: v("suName"), role, teacher_code: role === "teacher" ? v("suCode") : undefined } } });
        if (error) throw error;
        try { sessionStorage.setItem("bitwise.wantTeacher", role === "teacher" ? "1" : ""); } catch (x) { }
        if (!data.session) { BW.ui.authEmail = v("suEmail"); BW.ui.authMode = "check"; BW.render(); }
      } else if (m === "forgot") {
        const { error } = await BW.sb.auth.resetPasswordForEmail(v("fgEmail"), { redirectTo: location.origin + location.pathname });
        if (error) throw error;
        BW.ui.authEmail = v("fgEmail"); BW.ui.authMode = "check"; BW.render();
      } else if (m === "reset") {
        const { error } = await BW.sb.auth.updateUser({ password: root.querySelector("#rsPw").value });
        if (error) throw error;
        BW.ui.authMode = "signin"; BW.toast("Password saved"); const { data } = await BW.sb.auth.getSession(); if (data.session) BW.enter(data.session.user);
      }
    } catch (x) { err(BW.errMsg(x)); }
    done();
  };
  root.querySelector("#siId, #suName, #fgEmail, #rsPw")?.focus();
};
