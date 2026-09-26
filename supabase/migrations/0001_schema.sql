-- Bitwise schema: profiles, classes, members, assignments, attempts, achievements
create table public.app_settings (key text primary key, value text not null);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student','teacher')),
  display_name text not null check (char_length(display_name) between 1 and 40),
  avatar_color text not null default '#6C5CE7' check (avatar_color ~ '^#[0-9A-Fa-f]{6}$'),
  managed boolean not null default false,
  xp integer not null default 0,
  week_xp integer not null default 0,
  week_key text not null default '',
  streak integer not null default 0,
  best_streak integer not null default 0,
  last_day date,
  prefs jsonb not null default '{}'::jsonb check (pg_column_size(prefs) < 16384),
  created_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  join_code text not null unique,
  show_leaderboard boolean not null default true,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create index classes_teacher_idx on public.classes(teacher_id);

create table public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);
create index class_members_student_idx on public.class_members(student_id);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  quiz_id text not null check (quiz_id ~ '^[a-z0-9]+\.[a-z0-9]+(\.[0-3])?$'),
  title text not null check (char_length(title) between 1 and 100),
  instructions text not null default '' check (char_length(instructions) <= 1000),
  target_pct integer not null default 80 check (target_pct between 0 and 100),
  due_at timestamptz,
  created_at timestamptz not null default now()
);
create index assignments_class_idx on public.assignments(class_id);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null,
  assignment_id uuid references public.assignments(id) on delete set null,
  status text not null default 'open' check (status in ('open','done')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  total integer, correct integer, pct numeric(5,4), xp integer, max_combo integer, bookwork integer
);
create index attempts_user_quiz_idx on public.attempts(user_id, quiz_id);
create index attempts_user_started_idx on public.attempts(user_id, started_at desc);
create index attempts_assignment_idx on public.attempts(assignment_id);

create table public.achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge)
);

-- helpers (security definer so policies don't recurse)
create function public.is_teacher_of_class(c uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.classes where id = c and teacher_id = (select auth.uid())) $$;
create function public.is_member_of_class(c uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.class_members where class_id = c and student_id = (select auth.uid())) $$;
create function public.teaches_student(s uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.class_members m join public.classes c on c.id = m.class_id
                 where m.student_id = s and c.teacher_id = (select auth.uid())) $$;
create function public.week_key() returns text language sql stable set search_path = '' as $$
  select to_char(now() at time zone 'Europe/London', 'IYYY-"W"IW') $$;
create function public.london_today() returns date language sql stable set search_path = '' as $$
  select (now() at time zone 'Europe/London')::date $$;

-- RLS
alter table public.app_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.assignments enable row level security;
alter table public.attempts enable row level security;
alter table public.achievements enable row level security;

create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.teaches_student(id));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy classes_select on public.classes for select to authenticated
  using (teacher_id = (select auth.uid()) or public.is_member_of_class(id));
create policy classes_update on public.classes for update to authenticated
  using (teacher_id = (select auth.uid())) with check (teacher_id = (select auth.uid()));
create policy classes_delete on public.classes for delete to authenticated
  using (teacher_id = (select auth.uid()));

create policy members_select on public.class_members for select to authenticated
  using (student_id = (select auth.uid()) or public.is_teacher_of_class(class_id));
create policy members_delete on public.class_members for delete to authenticated
  using (student_id = (select auth.uid()) or public.is_teacher_of_class(class_id));

create policy assignments_select on public.assignments for select to authenticated
  using (public.is_teacher_of_class(class_id) or public.is_member_of_class(class_id));
create policy assignments_insert on public.assignments for insert to authenticated
  with check (public.is_teacher_of_class(class_id));
create policy assignments_update on public.assignments for update to authenticated
  using (public.is_teacher_of_class(class_id)) with check (public.is_teacher_of_class(class_id));
create policy assignments_delete on public.assignments for delete to authenticated
  using (public.is_teacher_of_class(class_id));

create policy attempts_select on public.attempts for select to authenticated
  using (user_id = (select auth.uid()) or public.teaches_student(user_id));
create policy achievements_select on public.achievements for select to authenticated
  using (user_id = (select auth.uid()) or public.teaches_student(user_id));

-- privileges: anon gets nothing; writes that matter go through functions
revoke all on all tables in schema public from anon;
revoke all on public.app_settings from authenticated;
revoke insert, update, delete on public.profiles, public.classes, public.class_members, public.attempts, public.achievements from authenticated;
grant update (display_name, avatar_color, prefs) on public.profiles to authenticated;
grant update (name, show_leaderboard, archived) on public.classes to authenticated;
grant delete on public.classes, public.class_members to authenticated;
grant select, insert, update, delete on public.assignments to authenticated;

-- new users get a profile; teacher role needs the school's teacher code (if one is set)
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
declare r text := 'student'; code text; nm text;
begin
  nm := left(coalesce(nullif(btrim(new.raw_user_meta_data->>'display_name'), ''), split_part(new.email, '@', 1), 'Student'), 40);
  if new.raw_user_meta_data->>'role' = 'teacher' then
    select value into code from public.app_settings where key = 'teacher_code';
    if code is null or new.raw_user_meta_data->>'teacher_code' = code then r := 'teacher'; end if;
  end if;
  insert into public.profiles (id, role, display_name, managed, avatar_color)
  values (new.id, r, nm, coalesce((new.raw_app_meta_data->>'managed')::boolean, false),
          (array['#6C5CE7','#2F9BB3','#F15BB5','#FB5607','#1F9D62','#3A86FF','#E63946','#8338EC'])[1 + floor(random() * 8)::int]);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
revoke execute on function public.handle_new_user() from public, anon, authenticated;
