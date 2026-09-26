-- Functions are callable by signed-in users only; internal helpers by nobody.
revoke execute on all functions in schema public from public, anon;
grant execute on all functions in schema public to authenticated;
revoke execute on function public.handle_new_user() from authenticated;
revoke execute on function public.gen_join_code() from authenticated;
alter default privileges in schema public revoke execute on functions from public, anon;

-- Teacher sign-up code (change it any time: update public.app_settings set value = '...' where key = 'teacher_code')
insert into public.app_settings (key, value)
values ('teacher_code', 'BW-' || upper(encode(extensions.gen_random_bytes(4), 'hex')))
on conflict (key) do nothing;
