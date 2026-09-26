-- Avatar colours that give white initials at least 4.5:1 contrast (WCAG AA)
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
declare r text := 'student'; code text; nm text;
begin
  nm := left(coalesce(nullif(btrim(new.raw_user_meta_data->>'display_name'), ''), split_part(new.email, '@', 1), 'Student'), 40);
  if new.raw_user_meta_data->>'role' = 'teacher' then
    select value into code from public.app_settings where key = 'teacher_code';
    if code is null or new.raw_user_meta_data->>'teacher_code' = code then r := 'teacher'; end if;
  end if;
  insert into public.profiles (id, role, display_name, managed, avatar_color)
  values (new.id, r, nm, coalesce((new.raw_app_meta_data->>'managed')::boolean, false),
          (array['#5B4BD5','#1F7A8C','#B0306E','#C2410C','#167A4B','#2563EB','#B3261E','#6D28D9'])[1 + floor(random() * 8)::int]);
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

update public.profiles p set avatar_color = m.new
from (values ('#6C5CE7','#5B4BD5'), ('#2F9BB3','#1F7A8C'), ('#F15BB5','#B0306E'), ('#FB5607','#C2410C'), ('#1F9D62','#167A4B'),
             ('#3A86FF','#2563EB'), ('#E63946','#B3261E'), ('#8338EC','#6D28D9'), ('#D9A21B','#8A5A00')) as m(old, new)
where upper(p.avatar_color) = m.old;
