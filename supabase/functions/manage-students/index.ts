// Teacher-managed student logins (no email needed) + account deletion.
// Actions: create_students, reset_password, delete_student, delete_self
import { createClient } from "npm:@supabase/supabase-js@2";

const URL = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DOMAIN = "pupils.bitwise.invalid"; // reserved TLD: these addresses can never receive mail

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const WORDS = ["amber", "azure", "coral", "ember", "frost", "jade", "lemon", "maple", "ocean", "olive", "pixel", "quartz", "river", "ruby", "solar", "storm", "tiger", "ultra", "violet", "willow", "binary", "cobalt", "delta", "echo", "falcon", "gamma", "hertz", "ion", "joule", "kilo", "laser", "modem", "nano", "orbit", "proxy", "qubit", "radar", "sonic", "turbo", "vector"];
const rnd = (n: number) => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; };
const password = () => `${WORDS[rnd(WORDS.length)]}-${WORDS[rnd(WORDS.length)]}-${10 + rnd(90)}`;
const slug = (name: string) => {
  const parts = name.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().toLowerCase().split(/\s+/);
  return ((parts[0] || "") + (parts[1]?.[0] || "")).replace(/[^a-z0-9]/g, "").slice(0, 12) || "student";
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const userClient = createClient(URL, ANON, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: "not_signed_in" }, 401);

  const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400); }

  const { data: me } = await admin.from("profiles").select("role").eq("id", user.id).single();
  const ownsClass = async (cid: unknown) => {
    if (typeof cid !== "string") return false;
    const { data } = await admin.from("classes").select("id").eq("id", cid).eq("teacher_id", user.id).maybeSingle();
    return !!data;
  };
  // a teacher may only manage accounts they created (managed) that sit in one of their classes
  const teachesManaged = async (sid: unknown) => {
    if (typeof sid !== "string") return false;
    const { data: p } = await admin.from("profiles").select("managed").eq("id", sid).maybeSingle();
    if (!p?.managed) return false;
    const { data } = await admin.from("class_members").select("class_id, classes!inner(teacher_id)")
      .eq("student_id", sid).eq("classes.teacher_id", user.id).limit(1);
    return !!data?.length;
  };

  switch (body.action) {
    case "create_students": {
      if (me?.role !== "teacher") return json({ error: "teachers_only" }, 403);
      const names = (Array.isArray(body.names) ? body.names : []).map((n) => String(n).trim().slice(0, 40)).filter(Boolean);
      if (!names.length || names.length > 40) return json({ error: "Add between 1 and 40 names" }, 400);
      if (!(await ownsClass(body.class_id))) return json({ error: "forbidden" }, 403);
      const out: Record<string, string>[] = [];
      for (const name of names) {
        const pw = password();
        let created = null, username = "", failed = "";
        for (let tries = 0; tries < 5 && !created && !failed; tries++) {
          username = `${slug(name)}${100 + rnd(900)}`;
          const { data, error } = await admin.auth.admin.createUser({
            email: `${username}@${DOMAIN}`, password: pw, email_confirm: true,
            user_metadata: { display_name: name, role: "student" }, app_metadata: { managed: true },
          });
          if (!error) created = data.user;
          else if (!/already|registered|exists/i.test(error.message)) failed = error.message;
        }
        if (created) {
          await admin.from("class_members").insert({ class_id: body.class_id, student_id: created.id });
          out.push({ name, username, password: pw });
        } else out.push({ name, error: failed || "Could not create a unique username" });
      }
      return json({ students: out });
    }
    case "reset_password": {
      if (!(await teachesManaged(body.student_id))) return json({ error: "forbidden" }, 403);
      const pw = password();
      const { error } = await admin.auth.admin.updateUserById(body.student_id as string, { password: pw });
      return error ? json({ error: error.message }, 500) : json({ password: pw });
    }
    case "delete_student": {
      if (!(await teachesManaged(body.student_id))) return json({ error: "forbidden" }, 403);
      const { error } = await admin.auth.admin.deleteUser(body.student_id as string);
      return error ? json({ error: error.message }, 500) : json({ ok: true });
    }
    case "delete_self": {
      const { error } = await admin.auth.admin.deleteUser(user.id);
      return error ? json({ error: error.message }, 500) : json({ ok: true });
    }
    default:
      return json({ error: "unknown_action" }, 400);
  }
});
