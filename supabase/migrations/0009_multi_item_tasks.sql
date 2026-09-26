-- 0009: a task (homework) can hold several items: topic quizzes, coding challenges, boss battles, quick fire.
-- Each item counts once the student reaches the target score on it; the task is complete when every item is.
create function public.valid_quiz_ids(ids text[]) returns boolean language sql immutable set search_path = '' as $$
  select coalesce(array_length(ids, 1), 0) between 1 and 20
     and not exists (select 1 from unnest(ids) x where x !~ '^[a-z0-9]+\.[a-z0-9]+(\.[0-3])?$')
     and (select count(distinct x) from unnest(ids) x) = array_length(ids, 1) $$;

alter table public.assignments add column quiz_ids text[];
update public.assignments set quiz_ids = array[quiz_id];
alter table public.assignments alter column quiz_ids set not null;
alter table public.assignments add constraint assignments_quiz_ids_valid check (public.valid_quiz_ids(quiz_ids));

drop function public.my_assignments();
drop function public.assignment_report(uuid);
drop function public.class_assignment_summary(uuid);
drop function public.assignment_question_stats(uuid);
alter table public.assignments drop column quiz_id;

-- a started attempt may only claim an assignment it belongs to
create or replace function public.start_attempt(p_quiz_id text, p_assignment uuid default null) returns uuid language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); aid uuid;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  if p_quiz_id !~ '^([a-z0-9]+\.[a-z0-9]+(\.[0-3])?|daily\.\d{4}-\d{2}-\d{2})$' then raise exception 'bad_quiz'; end if;
  if p_assignment is not null and not exists (
      select 1 from public.assignments a where a.id = p_assignment and p_quiz_id = any(a.quiz_ids)
        and (public.is_member_of_class(a.class_id) or public.is_teacher_of_class(a.class_id))) then
    raise exception 'bad_assignment';
  end if;
  if (select count(*) from public.attempts where user_id = uid and started_at > now() - interval '10 minutes') >= 40 then
    raise exception 'rate_limited';
  end if;
  insert into public.attempts (user_id, quiz_id, assignment_id) values (uid, p_quiz_id, p_assignment) returning id into aid;
  return aid;
end $$;

-- the signed-in student's tasks, with progress on every item
create function public.my_assignments() returns table (
  id uuid, class_id uuid, class_name text, title text, instructions text, quiz_ids text[], target_pct int,
  due_at timestamptz, created_at timestamptz, items jsonb, items_done int, best numeric, tries bigint, completed_at timestamptz)
language sql stable security invoker set search_path = '' as $$
  with tasks as (
    select a.*, c.name as cname from public.assignments a
    join public.classes c on c.id = a.class_id and not c.archived
    join public.class_members m on m.class_id = a.class_id and m.student_id = (select auth.uid())
  ), per as (
    select t.id as tid, q.qid, q.ord, max(x.pct) as best, count(x.id) as tries,
           min(x.finished_at) filter (where x.pct * 100 >= t.target_pct) as done_at
    from tasks t cross join lateral unnest(t.quiz_ids) with ordinality as q(qid, ord)
    left join public.attempts x on x.user_id = (select auth.uid()) and x.quiz_id = q.qid and x.status = 'done' and x.finished_at >= t.created_at
    group by t.id, q.qid, q.ord
  )
  select t.id, t.class_id, t.cname, t.title, t.instructions, t.quiz_ids, t.target_pct, t.due_at, t.created_at,
         jsonb_agg(jsonb_build_object('quiz_id', p.qid, 'best', p.best, 'tries', p.tries, 'completed_at', p.done_at) order by p.ord),
         count(p.done_at)::int,
         case when sum(p.tries) > 0 then round(avg(coalesce(p.best, 0)), 4) end,
         sum(p.tries)::bigint,
         case when count(p.done_at) = count(*) then max(p.done_at) end
  from tasks t join per p on p.tid = t.id
  group by t.id, t.class_id, t.cname, t.title, t.instructions, t.quiz_ids, t.target_pct, t.due_at, t.created_at
  order by t.due_at nulls last, t.created_at desc $$;

-- teacher: every student's progress on every item of a task
create function public.assignment_report(p_assignment uuid) returns table (
  student_id uuid, display_name text, avatar_color text, best numeric, tries bigint, completed_at timestamptz,
  last_at timestamptz, items_done int, items jsonb)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
declare a public.assignments;
begin
  select * into a from public.assignments s where s.id = p_assignment;
  if not found or not public.is_teacher_of_class(a.class_id) then raise exception 'forbidden'; end if;
  return query
  with per as (
    select m.student_id as sid, q.qid, q.ord, max(t.pct) as b, count(t.id) as n,
           min(t.finished_at) filter (where t.pct * 100 >= a.target_pct) as done_at, max(t.finished_at) as last_t
    from public.class_members m
    cross join lateral unnest(a.quiz_ids) with ordinality as q(qid, ord)
    left join public.attempts t on t.user_id = m.student_id and t.quiz_id = q.qid and t.status = 'done' and t.finished_at >= a.created_at
    where m.class_id = a.class_id
    group by m.student_id, q.qid, q.ord
  )
  select p.id, p.display_name, p.avatar_color,
         case when sum(per.n) > 0 then round(avg(coalesce(per.b, 0)), 4) end, sum(per.n)::bigint,
         case when count(per.done_at) = count(*) then max(per.done_at) end, max(per.last_t), count(per.done_at)::int,
         jsonb_agg(jsonb_build_object('quiz_id', per.qid, 'best', per.b, 'tries', per.n, 'completed_at', per.done_at, 'last_at', per.last_t) order by per.ord)
  from per join public.profiles p on p.id = per.sid
  group by p.id, p.display_name, p.avatar_color order by p.display_name;
end $$;

-- teacher: completion summary for every task in a class
create function public.class_assignment_summary(p_class uuid) returns table (
  assignment_id uuid, students bigint, started bigint, completed bigint, on_time bigint, avg_best numeric, avg_items_done numeric)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not public.is_teacher_of_class(p_class) then raise exception 'forbidden'; end if;
  return query
  with per_item as (
    select a.id as aid, a.due_at as due, m.student_id as sid, q.qid, max(t.pct) as b, count(t.id) as n,
           min(t.finished_at) filter (where t.pct * 100 >= a.target_pct) as done_at
    from public.assignments a
    join public.class_members m on m.class_id = a.class_id
    cross join lateral unnest(a.quiz_ids) as q(qid)
    left join public.attempts t on t.user_id = m.student_id and t.quiz_id = q.qid and t.status = 'done' and t.finished_at >= a.created_at
    where a.class_id = p_class
    group by a.id, a.due_at, m.student_id, q.qid
  ), per as (
    select aid, due, sid, sum(n) as n, avg(coalesce(b, 0)) as b, count(done_at) as items_done,
           case when count(done_at) = count(*) then max(done_at) end as done_at
    from per_item group by aid, due, sid
  )
  select aid, count(*), count(*) filter (where n > 0), count(done_at),
         count(done_at) filter (where due is null or done_at <= due),
         round(avg(b) filter (where n > 0), 4), round(avg(items_done), 2)
  from per group by aid;
end $$;

-- teacher: how each question went across all items of a task
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
    join public.attempts t on t.id = x.attempt_id and t.status = 'done' and t.quiz_id = any(a.quiz_ids) and t.finished_at >= a.created_at
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

revoke execute on function public.my_assignments() from public, anon;
revoke execute on function public.assignment_report(uuid) from public, anon;
revoke execute on function public.class_assignment_summary(uuid) from public, anon;
revoke execute on function public.assignment_question_stats(uuid) from public, anon;
revoke execute on function public.valid_quiz_ids(text[]) from public, anon;
grant execute on function public.my_assignments() to authenticated;
grant execute on function public.assignment_report(uuid) to authenticated;
grant execute on function public.class_assignment_summary(uuid) to authenticated;
grant execute on function public.assignment_question_stats(uuid) to authenticated;
grant execute on function public.valid_quiz_ids(text[]) to authenticated;
