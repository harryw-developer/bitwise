-- The auth service writes app_metadata (where "managed" lives) after inserting the user row,
-- so keep profiles.managed in sync on update too. app_metadata can only be set with the service key.
create function public.sync_managed_flag() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set managed = coalesce((new.raw_app_meta_data->>'managed')::boolean, false)
  where id = new.id and managed is distinct from coalesce((new.raw_app_meta_data->>'managed')::boolean, false);
  return new;
end $$;
revoke execute on function public.sync_managed_flag() from public, anon, authenticated;
create trigger on_auth_user_meta_updated after update of raw_app_meta_data on auth.users
  for each row execute function public.sync_managed_flag();

update public.profiles p set managed = true from auth.users u
where u.id = p.id and (u.raw_app_meta_data->>'managed')::boolean is true and not p.managed;
