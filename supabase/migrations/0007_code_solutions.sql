-- Model solutions for Coding Lab challenges: readable by teachers only (never shipped to students' browsers)
create table public.code_solutions (challenge_id text primary key, solution text not null);
alter table public.code_solutions enable row level security;
create policy solutions_teachers on public.code_solutions for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'teacher'));
revoke all on public.code_solutions from anon;
revoke insert, update, delete on public.code_solutions from authenticated;
