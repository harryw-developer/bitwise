-- 0006: per-question answer log, finish_attempt v2 (no bookwork, logs answers, coding challenges), teacher analytics
alter table public.attempts add column active_ms integer;

create table public.attempt_answers (
  id bigint generated always as identity primary key,
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  seq integer not null,
  q_code text not null default '',
  q_type text not null,
  q_key text not null default '',
  q_text text not null default '',
  topic text not null default '',
  answer text not null default '',
  correct_answer text not null default '',
  is_correct boolean not null,
  try_no integer not null default 1,
  ms integer not null default 0,
  detail jsonb,
  created_at timestamptz not null default now()
);
create index attempt_answers_attempt_idx on public.attempt_answers(attempt_id);
create index attempt_answers_user_idx on public.attempt_answers(user_id, created_at desc);
alter table public.attempt_answers enable row level security;
create policy answers_select on public.attempt_answers for select to authenticated
  using (user_id = (select auth.uid()) or public.teaches_student(user_id));
revoke all on public.attempt_answers from anon;
revoke insert, update, delete on public.attempt_answers from authenticated;

drop function public.finish_attempt(uuid, int, int, int, int);
create function public.finish_attempt(p_attempt uuid, p_total int, p_correct int, p_max_combo int default 0,
                                      p_answers jsonb default '[]'::jsonb, p_active_ms int default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid(); a public.attempts; p public.profiles; el numeric; mult numeric; v_pct numeric; prev_best numeric;
  pass boolean; gain int; first_daily boolean := false; is_code boolean; ft_ok int; act int := p_active_ms;
  today date := public.london_today(); wk text := public.week_key();
  cand text[] := array['first_steps']; got text[] := '{}'; b text;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  select * into a from public.attempts where id = p_attempt and user_id = uid for update;
  if not found then raise exception 'not_found'; end if;
  if a.status = 'done' then raise exception 'already_finished'; end if;
  if p_total not between 1 and 40 or p_correct not between 0 and p_total or p_max_combo not between 0 and p_correct then raise exception 'bad_result'; end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) > 150 then raise exception 'bad_result'; end if;
  is_code := a.quiz_id like 'code.%';
  -- the score must agree with the logged answers (first-try correct answers)
  if jsonb_array_length(p_answers) > 0 and not is_code then
    select count(*) into ft_ok from jsonb_array_elements(p_answers) e
      where coalesce((e->>'ok')::boolean, false) and coalesce((e->>'try')::int, 1) = 1;
    if ft_ok <> p_correct then raise exception 'bad_result'; end if;
  end if;
  el := extract(epoch from now() - a.started_at);
  if el < p_total * 1.5 then raise exception 'too_fast'; end if;
  if el > 4 * 3600 then raise exception 'expired'; end if;
  if act is not null then act := least(greatest(act, 0), (el * 1000)::int); end if;

  mult := case when a.quiz_id ~ '\.0$' then 1 when a.quiz_id ~ '\.1$' then 1.2 when a.quiz_id ~ '\.2$' then 1.5
               when a.quiz_id ~ '\.3$' then 2 when a.quiz_id like '%.boss' then 1.8 when a.quiz_id like 'daily.%' then 1.5
               when is_code then 1.5 else 1.2 end;
  v_pct := round(p_correct::numeric / p_total, 4);
  pass := v_pct >= 0.8;
  select max(t.pct) into prev_best from public.attempts t where t.user_id = uid and t.quiz_id = a.quiz_id and t.status = 'done';
  if is_code then
    -- coding challenges pay out only for improving your best score
    gain := case when v_pct > coalesce(prev_best, 0)
                 then round((v_pct - coalesce(prev_best, 0)) * p_total * 10 * mult)
                      + case when pass and coalesce(prev_best, 0) < 0.8 then round(20 * mult) else 0 end
                 else 0 end;
  else
    gain := round(p_correct * 10 * mult) + case when pass then round(20 * mult) else 0 end
            + case when p_max_combo >= 3 then least(p_max_combo, 20) * 2 else 0 end;
  end if;
  if a.quiz_id = 'daily.' || to_char(today, 'YYYY-MM-DD') and not exists (
       select 1 from public.attempts t where t.user_id = uid and t.quiz_id = a.quiz_id and t.status = 'done') then
    first_daily := true; gain := gain + 30;
  end if;

  update public.attempts set status = 'done', finished_at = now(), total = p_total, correct = p_correct, pct = v_pct,
         xp = gain, max_combo = p_max_combo, active_ms = act where id = a.id;

  insert into public.attempt_answers (attempt_id, user_id, seq, q_code, q_type, q_key, q_text, topic, answer, correct_answer, is_correct, try_no, ms, detail)
  select a.id, uid, coalesce((e->>'seq')::int, ord::int), left(coalesce(e->>'code', ''), 8), left(coalesce(e->>'type', 'mc'), 12),
         left(coalesce(e->>'key', ''), 160), left(coalesce(e->>'text', ''), 600), left(coalesce(e->>'topic', ''), 80),
         left(coalesce(e->>'answer', ''), 20000), left(coalesce(e->>'correct', ''), 2000), coalesce((e->>'ok')::boolean, false),
         least(greatest(coalesce((e->>'try')::int, 1), 1), 50), least(greatest(coalesce((e->>'ms')::int, 0), 0), 3600000),
         case when jsonb_typeof(e->'detail') = 'object' and pg_column_size(e->'detail') < 20000 then e->'detail' end
  from jsonb_array_elements(p_answers) with ordinality as t(e, ord);

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
  if is_code and v_pct = 1 then cand := cand || 'first_program'::text; end if;
  if is_code and v_pct = 1 and (select count(distinct t.quiz_id) from public.attempts t
       where t.user_id = uid and t.status = 'done' and t.quiz_id like 'code.%' and t.pct = 1) >= 10 then cand := cand || 'code_10'::text; end if;
  if (select count(*) from public.attempts t where t.user_id = uid and t.status = 'done') >= 25 then cand := cand || 'quiz_25'::text; end if;
  if a.assignment_id is not null and exists (select 1 from public.assignments s where s.id = a.assignment_id
       and v_pct * 100 >= s.target_pct and (s.due_at is null or now() <= s.due_at)) then cand := cand || 'on_time'::text; end if;
  if pass and (select count(distinct split_part(t.quiz_id, '.', 1)) from public.attempts t
       where t.user_id = uid and t.status = 'done' and t.pct >= 0.8 and t.quiz_id ~ '\.[0-3]$') >= 11 then cand := cand || 'all_rounder'::text; end if;
  foreach b in array cand loop
    insert into public.achievements (user_id, badge) values (uid, b) on conflict do nothing;
    if found then got := got || b; end if;
  end loop;

  return jsonb_build_object('xp_gain', gain, 'xp', p.xp, 'week_xp', p.week_xp, 'streak', p.streak,
                            'pct', v_pct, 'pass', pass, 'first_daily', first_daily, 'badges', to_jsonb(got));
end $$;

-- how each question in a task went across the class
create function public.assignment_question_stats(p_assignment uuid) returns table (
  q_key text, sample text, q_type text, topic text, answered bigint, students bigint,
  first_try_pct numeric, avg_ms numeric, avg_tries numeric, common_wrong text)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
declare a public.assignments;
begin
  select * into a from public.assignments s where s.id = p_assignment;
  if not found or not public.is_teacher_of_class(a.class_id) then raise exception 'forbidden'; end if;
  return query
  with ans as (
    select x.* from public.attempt_answers x
    join public.attempts t on t.id = x.attempt_id and t.status = 'done' and t.quiz_id = a.quiz_id and t.finished_at >= a.created_at
    join public.class_members m on m.class_id = a.class_id and m.student_id = t.user_id
  ), per as (
    select x.q_key as k, x.attempt_id as att, x.q_code as qc, x.user_id as u, max(x.try_no) as tries,
           bool_or(x.is_correct and x.try_no = 1) as ftc, sum(x.ms) as ms_sum,
           min(x.q_text) as smp, min(x.q_type) as qt, min(x.topic) as tp
    from ans x group by x.q_key, x.attempt_id, x.q_code, x.user_id
  )
  select per.k, min(per.smp), min(per.qt), min(per.tp), count(*), count(distinct per.u),
         round(avg(per.ftc::int), 4), round(avg(per.ms_sum)), round(avg(per.tries), 2),
         (select w.answer from ans w where w.q_key = per.k and not w.is_correct group by w.answer order by count(*) desc, w.answer limit 1)
  from per group by per.k order by avg(per.ftc::int), count(*) desc;
end $$;

-- per-student effort and accuracy for a class
create function public.class_student_stats(p_class uuid) returns table (
  student_id uuid, answered bigint, first_try bigint, first_try_ok bigint, retries bigint,
  total_ms bigint, week_ms bigint, avg_ms numeric, last_answer timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
declare wk_start timestamptz := (date_trunc('week', now() at time zone 'Europe/London')) at time zone 'Europe/London';
begin
  if not public.is_teacher_of_class(p_class) then raise exception 'forbidden'; end if;
  return query
  select m.student_id, count(x.id), count(x.id) filter (where x.try_no = 1), count(x.id) filter (where x.try_no = 1 and x.is_correct),
         count(x.id) filter (where x.try_no > 1), coalesce(sum(x.ms), 0)::bigint,
         coalesce(sum(x.ms) filter (where x.created_at >= wk_start), 0)::bigint, round(avg(x.ms)), max(x.created_at)
  from public.class_members m left join public.attempt_answers x on x.user_id = m.student_id
  where m.class_id = p_class group by m.student_id;
end $$;

revoke execute on function public.finish_attempt(uuid, int, int, int, jsonb, int) from public, anon;
revoke execute on function public.assignment_question_stats(uuid) from public, anon;
revoke execute on function public.class_student_stats(uuid) from public, anon;
grant execute on function public.finish_attempt(uuid, int, int, int, jsonb, int) to authenticated;
grant execute on function public.assignment_question_stats(uuid) to authenticated;
grant execute on function public.class_student_stats(uuid) to authenticated;
