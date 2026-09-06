-- Foto de perfil do colaborador (avatar) + suporte a criação de usuários pelo admin.

alter table public.profiles
  add column if not exists avatar_path text;

-- ---------------------------------------------------------------------------
-- storage: avatares dos usuários (bucket privado, uma pasta por usuário)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', false)
on conflict (id) do nothing;

drop policy if exists "avatares_insert_owner" on storage.objects;
create policy "avatares_insert_owner" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatares_update_owner" on storage.objects;
create policy "avatares_update_owner" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatares_select" on storage.objects;
create policy "avatares_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'avatares'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.get_my_role() in ('admin', 'candidato')
    )
  );

drop policy if exists "avatares_delete_owner" on storage.objects;
create policy "avatares_delete_owner" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatares'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.get_my_role() = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- profiles: permitir que o próprio usuário atualize seu nome/whatsapp/avatar
-- (antes só o admin podia dar update; colaborador precisa poder trocar a
-- própria foto de perfil sem depender do admin).
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- handle_new_user: quando o admin cria um usuário pela área "Usuários"
-- (via service role, com metadata role/full_name/whatsapp/cpf já definidos),
-- respeita o papel enviado em vez de sempre cair como "pendente".
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
begin
  insert into public.profiles (id, full_name, whatsapp, cpf, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'whatsapp',
    new.raw_user_meta_data ->> 'cpf',
    case
      when requested_role in ('colaborador', 'candidato', 'admin') then requested_role
      else 'pendente'
    end
  );
  return new;
end;
$$;
