-- Per-task completion summary for a class (teacher only)
create function public.class_assignment_summary(p_class uuid) returns table (
  assignment_id uuid, students bigint, started bigint, completed bigint, on_time bigint, avg_best numeric)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_teacher_of_class(p_class) then raise exception 'forbidden'; end if;
  return query
  with per as (
    select a.id as aid, a.due_at, m.student_id,
           max(t.pct) as best,
           min(t.finished_at) filter (where t.pct * 100 >= a.target_pct) as done_at
    from public.assignments a
    join public.class_members m on m.class_id = a.class_id
    left join public.attempts t on t.user_id = m.student_id and t.quiz_id = a.quiz_id
         and t.status = 'done' and t.finished_at >= a.created_at
    where a.class_id = p_class
    group by a.id, a.due_at, m.student_id
  )
  select per.aid, count(*), count(per.best), count(per.done_at),
         count(per.done_at) filter (where per.due_at is null or per.done_at <= per.due_at),
         round(avg(per.best), 4)
  from per group by per.aid;
end $$;
revoke execute on function public.class_assignment_summary(uuid) from public, anon;
grant execute on function public.class_assignment_summary(uuid) to authenticated;
