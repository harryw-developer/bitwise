/* Supabase access layer */
BW.sb = window.supabase.createClient(BW.CONFIG.url, BW.CONFIG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

const ERRORS = {
  bad_code: "That class code doesn't match an open class. Check it with your teacher.",
  own_class: "That's your own class, so you're already in it as the teacher.",
  too_many_classes: "You've reached the limit for classes.",
  teachers_only: "Only teacher accounts can do that.",
  bad_teacher_code: "That teacher code isn't right. Ask your school's Bitwise admin for it.",
  rate_limited: "You're going very fast. Take a breather and try again in a few minutes.",
  too_fast: "That quiz was finished too quickly to count, so it wasn't saved.",
  expired: "That quiz was open for too long to count. Start it again.",
  already_finished: "That quiz has already been saved.",
  forbidden: "You don't have access to that.",
  not_signed_in: "Your session has ended. Sign in again.",
  bad_assignment: "That task is no longer available.",
  "Invalid login credentials": "That email or username and password don't match.",
  "Email not confirmed": "Confirm your email first. Check your inbox for the link.",
  "User already registered": "There's already an account with that email. Try signing in."
};
BW.errMsg = e => { const m = (e && (e.message || e.error_description || e.error)) || String(e); for (const k in ERRORS) if (m.includes(k)) return ERRORS[k]; return /fetch|network/i.test(m) ? "Can't reach Bitwise. Check your internet connection." : m; };

BW.api = {
  async rpc(name, args = {}) { const { data, error } = await BW.sb.rpc(name, args); if (error) throw error; return data; },
  async fn(action, body = {}) {
    const { data, error } = await BW.sb.functions.invoke("manage-students", { body: { action, ...body } });
    if (error) { let msg = error.message; try { const j = await error.context.json(); msg = j.error || msg; } catch (e) { } throw new Error(msg); }
    return data;
  },
  async sel(q) { const { data, error } = await q; if (error) throw error; return data; },
  loginEmail: id => id.includes("@") ? id.trim() : `${id.trim().toLowerCase()}@${BW.CONFIG.pupilDomain}`
};
