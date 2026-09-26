-- Bitwise RPCs. Every function checks the caller; XP is always computed here, never trusted from the client.
create function public.gen_join_code() returns text language plpgsql volatile set search_path = '' as $$
declare abc text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; c text; b bytea; i int;
begin
  loop
    b := extensions.gen_random_bytes(6); c := '';
    for i in 0..5 loop c := c || substr(abc, 1 + (get_byte(b, i) % 32), 1); end loop;
    exit when not exists (select 1 from public.classes where join_code = c);
  end loop;
  return c;
end $$;
revoke execute on function public.gen_join_code() from public, anon, authenticated;

create function public.create_class(p_name text) returns public.classes language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); r public.classes;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  if not exists (select 1 from public.profiles where id = uid and role = 'teacher') then raise exception 'teachers_only'; end if;
  if (select count(*) from public.classes where teacher_id = uid) >= 50 then raise exception 'too_many_classes'; end if;
  insert into public.classes (teacher_id, name, join_code) values (uid, left(btrim(p_name), 60), public.gen_join_code()) returning * into r;
  return r;
end $$;

create function public.regenerate_code(p_class uuid) returns text language plpgsql security definer set search_path = '' as $$
declare c text;
begin
  if not public.is_teacher_of_class(p_class) then raise exception 'forbidden'; end if;
  c := public.gen_join_code();
  update public.classes set join_code = c where id = p_class;
  return c;
end $$;

create function public.join_class(p_code text) returns jsonb language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); k public.classes;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  select * into k from public.classes where join_code = upper(regexp_replace(p_code, '\s', '', 'g')) and not archived;
  if not found then raise exception 'bad_code'; end if;
  if k.teacher_id = uid then raise exception 'own_class'; end if;
  if (select count(*) from public.class_members where student_id = uid) >= 20 then raise exception 'too_many_classes'; end if;
  insert into public.class_members (class_id, student_id) values (k.id, uid) on conflict do nothing;
  return jsonb_build_object('class_id', k.id, 'name', k.name);
end $$;

create function public.become_teacher(p_code text) returns boolean language plpgsql security definer set search_path = '' as $$
declare code text;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select value into code from public.app_settings where key = 'teacher_code';
  if code is not null and code is distinct from btrim(p_code) then raise exception 'bad_teacher_code'; end if;
  update public.profiles set role = 'teacher' where id = auth.uid() and not managed;
  return found;
end $$;

create function public.start_attempt(p_quiz_id text, p_assignment uuid default null) returns uuid language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); aid uuid;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  if p_quiz_id !~ '^([a-z0-9]+\.[a-z0-9]+(\.[0-3])?|daily\.\d{4}-\d{2}-\d{2})$' then raise exception 'bad_quiz'; end if;
  if p_assignment is not null and not exists (
      select 1 from public.assignments a where a.id = p_assignment
        and (public.is_member_of_class(a.class_id) or public.is_teacher_of_class(a.class_id))) then
    raise exception 'bad_assignment';
  end if;
  if (select count(*) from public.attempts where user_id = uid and started_at > now() - interval '10 minutes') >= 40 then
    raise exception 'rate_limited';
  end if;
  insert into public.attempts (user_id, quiz_id, assignment_id) values (uid, p_quiz_id, p_assignment) returning id into aid;
  return aid;
end $$;

create function public.finish_attempt(p_attempt uuid, p_total int, p_correct int, p_bookwork int default 0, p_max_combo int default 0)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid(); a public.attempts; p public.profiles; el numeric; mult numeric; v_pct numeric;
  pass boolean; gain int; first_daily boolean := false; today date := public.london_today(); wk text := public.week_key();
  cand text[] := array['first_steps']; got text[] := '{}'; b text;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  select * into a from public.attempts where id = p_attempt and user_id = uid for update;
  if not found then raise exception 'not_found'; end if;
  if a.status = 'done' then raise exception 'already_finished'; end if;
  if p_total not between 1 and 40 or p_correct not between 0 and p_total
     or p_bookwork not between 0 and least(10, p_total) or p_max_combo not between 0 and p_correct then
    raise exception 'bad_result';
  end if;
  el := extract(epoch from now() - a.started_at);
  if el < p_total * 1.5 then raise exception 'too_fast'; end if;
  if el > 4 * 3600 then raise exception 'expired'; end if;

  mult := case when a.quiz_id ~ '\.0$' then 1 when a.quiz_id ~ '\.1$' then 1.2 when a.quiz_id ~ '\.2$' then 1.5
               when a.quiz_id ~ '\.3$' then 2 when a.quiz_id like '%.boss' then 1.8 when a.quiz_id like 'daily.%' then 1.5 else 1.2 end;
  v_pct := round(p_correct::numeric / p_total, 4);
  pass := v_pct >= 0.8;
  gain := round(p_correct * 10 * mult) + case when pass then round(20 * mult) else 0 end
          + case when p_max_combo >= 3 then least(p_max_combo, 20) * 2 else 0 end + p_bookwork * 5;
  if a.quiz_id = 'daily.' || to_char(today, 'YYYY-MM-DD') and not exists (
       select 1 from public.attempts where user_id = uid and quiz_id = a.quiz_id and status = 'done') then
    first_daily := true; gain := gain + 30;
  end if;

  update public.attempts set status = 'done', finished_at = now(), total = p_total, correct = p_correct, pct = v_pct,
         xp = gain, max_combo = p_max_combo, bookwork = p_bookwork where id = a.id;
  update public.profiles set
      xp = xp + gain,
      week_xp = case when week_key = wk then week_xp + gain else gain end,
      week_key = wk,
      streak = case when last_day = today then streak when last_day = today - 1 then streak + 1 else 1 end,
      best_streak = greatest(best_streak, case when last_day = today then streak when last_day = today - 1 then streak + 1 else 1 end),
      last_day = today
    where id = uid returning * into p;

  if v_pct = 1 and p_total >= 6 then cand := cand || 'perfect'::text; end if;
  if p.streak >= 3 then cand := cand || 'streak_3'::text; end if;
  if p.streak >= 7 then cand := cand || 'streak_7'::text; end if;
  if p.streak >= 30 then cand := cand || 'streak_30'::text; end if;
  if pass and a.quiz_id ~ '\.2$' then cand := cand || 'gold_rush'::text; end if;
  if pass and a.quiz_id ~ '\.3$' then cand := cand || 'platinum'::text; end if;
  if pass and a.quiz_id like '%.boss' then cand := cand || 'boss_slayer'::text; end if;
  if pass and a.quiz_id in ('mem.bin.2', 'mem.hex.2', 'mem.bin.3', 'mem.hex.3') then cand := cand || 'binary_brain'::text; end if;
  if pass and a.quiz_id in ('logic.tables.2', 'logic.expressions.2', 'logic.tables.3', 'logic.expressions.3') then cand := cand || 'logic_lord'::text; end if;
  if a.quiz_id = 'quick.speed' and p_correct >= 15 then cand := cand || 'speed_demon'::text; end if;
  if p_max_combo >= 10 then cand := cand || 'combo_10'::text; end if;
  if p.xp >= 1000 then cand := cand || 'xp_1000'::text; end if;
  if p.xp >= 5000 then cand := cand || 'xp_5000'::text; end if;
  if first_daily then cand := cand || 'daily_done'::text; end if;
  if (select count(*) from public.attempts where user_id = uid and status = 'done') >= 25 then cand := cand || 'quiz_25'::text; end if;
  if a.assignment_id is not null and exists (select 1 from public.assignments s where s.id = a.assignment_id
       and v_pct * 100 >= s.target_pct and (s.due_at is null or now() <= s.due_at)) then cand := cand || 'on_time'::text; end if;
  if pass and (select count(distinct split_part(quiz_id, '.', 1)) from public.attempts
       where user_id = uid and status = 'done' and attempts.pct >= 0.8 and quiz_id ~ '\.[0-3]$') >= 11 then cand := cand || 'all_rounder'::text; end if;
  foreach b in array cand loop
    insert into public.achievements (user_id, badge) values (uid, b) on conflict do nothing;
    if found then got := got || b; end if;
  end loop;

  return jsonb_build_object('xp_gain', gain, 'xp', p.xp, 'week_xp', p.week_xp, 'streak', p.streak,
                            'pct', v_pct, 'pass', pass, 'first_daily', first_daily, 'badges', to_jsonb(got));
end $$;

create function public.my_progress() returns table (quiz_id text, best numeric, attempts bigint, last_at timestamptz)
language sql stable security invoker set search_path = '' as $$
  select quiz_id, max(pct), count(*), max(finished_at) from public.attempts
  where user_id = (select auth.uid()) and status = 'done' group by quiz_id $$;

create function public.my_assignments() returns table (
  id uuid, class_id uuid, class_name text, title text, instructions text, quiz_id text, target_pct int,
  due_at timestamptz, created_at timestamptz, best numeric, tries bigint, completed_at timestamptz)
language sql stable security invoker set search_path = '' as $$
  select a.id, a.class_id, c.name, a.title, a.instructions, a.quiz_id, a.target_pct, a.due_at, a.created_at,
    (select max(t.pct) from public.attempts t where t.user_id = (select auth.uid()) and t.quiz_id = a.quiz_id and t.status = 'done' and t.finished_at >= a.created_at),
    (select count(*) from public.attempts t where t.user_id = (select auth.uid()) and t.quiz_id = a.quiz_id and t.status = 'done' and t.finished_at >= a.created_at),
    (select min(t.finished_at) from public.attempts t where t.user_id = (select auth.uid()) and t.quiz_id = a.quiz_id and t.status = 'done'
       and t.finished_at >= a.created_at and t.pct * 100 >= a.target_pct)
  from public.assignments a
  join public.classes c on c.id = a.class_id and not c.archived
  join public.class_members m on m.class_id = a.class_id and m.student_id = (select auth.uid())
  order by a.due_at nulls last, a.created_at desc $$;

create function public.class_leaderboard(p_class uuid) returns table (
  user_id uuid, display_name text, avatar_color text, xp int, week_xp int, streak int, medals bigint, is_me boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not (public.is_teacher_of_class(p_class) or (public.is_member_of_class(p_class)
          and exists (select 1 from public.classes where id = p_class and show_leaderboard))) then
    return;
  end if;
  return query
  select p.id, p.display_name, p.avatar_color, p.xp,
         case when p.week_key = public.week_key() then p.week_xp else 0 end,
         case when p.last_day >= public.london_today() - 1 then p.streak else 0 end,
         (select count(distinct t.quiz_id) from public.attempts t where t.user_id = p.id and t.status = 'done' and t.pct >= 0.8 and t.quiz_id ~ '\.[0-3]$'),
         p.id = auth.uid()
  from public.class_members m join public.profiles p on p.id = m.student_id
  where m.class_id = p_class;
end $$;

create function public.class_roster(p_class uuid) returns table (
  student_id uuid, display_name text, avatar_color text, managed boolean, username text, xp int, week_xp int,
  streak int, last_active timestamptz, joined_at timestamptz, quizzes bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_teacher_of_class(p_class) then raise exception 'forbidden'; end if;
  return query
  select p.id, p.display_name, p.avatar_color, p.managed,
         case when p.managed then split_part(u.email, '@', 1) end,
         p.xp, case when p.week_key = public.week_key() then p.week_xp else 0 end,
         case when p.last_day >= public.london_today() - 1 then p.streak else 0 end,
         (select max(t.finished_at) from public.attempts t where t.user_id = p.id and t.status = 'done'),
         m.joined_at,
         (select count(*) from public.attempts t where t.user_id = p.id and t.status = 'done')
  from public.class_members m join public.profiles p on p.id = m.student_id join auth.users u on u.id = p.id
  where m.class_id = p_class order by p.display_name;
end $$;

create function public.assignment_report(p_assignment uuid) returns table (
  student_id uuid, display_name text, avatar_color text, best numeric, tries bigint, completed_at timestamptz, last_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
declare a public.assignments;
begin
  select * into a from public.assignments where id = p_assignment;
  if not found or not public.is_teacher_of_class(a.class_id) then raise exception 'forbidden'; end if;
  return query
  select p.id, p.display_name, p.avatar_color,
    (select max(t.pct) from public.attempts t where t.user_id = p.id and t.quiz_id = a.quiz_id and t.status = 'done' and t.finished_at >= a.created_at),
    (select count(*) from public.attempts t where t.user_id = p.id and t.quiz_id = a.quiz_id and t.status = 'done' and t.finished_at >= a.created_at),
    (select min(t.finished_at) from public.attempts t where t.user_id = p.id and t.quiz_id = a.quiz_id and t.status = 'done'
       and t.finished_at >= a.created_at and t.pct * 100 >= a.target_pct),
    (select max(t.finished_at) from public.attempts t where t.user_id = p.id and t.quiz_id = a.quiz_id and t.status = 'done' and t.finished_at >= a.created_at)
  from public.class_members m join public.profiles p on p.id = m.student_id
  where m.class_id = a.class_id order by p.display_name;
end $$;

-- best score per student per topic (unit.sub), for the teacher's heatmap and weak-topic list
create function public.class_topic_stats(p_class uuid) returns table (student_id uuid, topic text, best numeric, medals bigint, tries bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_teacher_of_class(p_class) then raise exception 'forbidden'; end if;
  return query
  select t.user_id, split_part(t.quiz_id, '.', 1) || '.' || split_part(t.quiz_id, '.', 2), max(t.pct),
         count(distinct t.quiz_id) filter (where t.pct >= 0.8), count(*)
  from public.attempts t join public.class_members m on m.student_id = t.user_id and m.class_id = p_class
  where t.status = 'done' and t.quiz_id ~ '\.[0-3]$'
  group by 1, 2;
end $$;

revoke execute on all functions in schema public from anon;
