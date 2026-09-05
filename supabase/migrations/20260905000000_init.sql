-- Colaborador Eleitoral 2026 - schema inicial
-- Perfis (3 niveis: colaborador, candidato, admin) + eleitores cadastrados + fotos.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  whatsapp text,
  role text not null default 'pendente'
    check (role in ('pendente', 'colaborador', 'candidato', 'admin')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil de cada usuario autenticado. role controla o nivel de acesso no app.';
comment on column public.profiles.role is 'pendente = aguardando aprovacao do admin; colaborador = cabo eleitoral; candidato = visao gerencial; admin = controla papeis.';

-- Funcao security definer: evita recursao de RLS ao checar o papel do usuario atual.
create or replace function public.get_my_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Cria o profile automaticamente quando um usuario se cadastra no Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, whatsapp, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'whatsapp',
    'pendente'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.get_my_role() in ('admin', 'candidato'));

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update to authenticated
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

-- ---------------------------------------------------------------------------
-- eleitores
-- ---------------------------------------------------------------------------
create table if not exists public.eleitores (
  id uuid primary key default gen_random_uuid(),
  colaborador_id uuid not null references public.profiles (id),
  nome_completo text not null,
  titulo_eleitor text,
  foto_path text,
  whatsapp text,
  endereco text,
  municipio text,
  local_votacao text,
  secao_voto text,
  valor_recebido numeric(10, 2),
  observacoes text,
  created_at timestamptz not null default now()
);

comment on table public.eleitores is 'Eleitores cadastrados por cada colaborador (cabo eleitoral). Insert-only para colaboradores: nao ha update/delete liberado para esse papel.';

create index if not exists eleitores_colaborador_id_idx on public.eleitores (colaborador_id);
create index if not exists eleitores_municipio_idx on public.eleitores (municipio);

alter table public.eleitores enable row level security;

drop policy if exists "eleitores_insert_colaborador" on public.eleitores;
create policy "eleitores_insert_colaborador" on public.eleitores
  for insert to authenticated
  with check (
    colaborador_id = auth.uid()
    and public.get_my_role() = 'colaborador'
  );

drop policy if exists "eleitores_select" on public.eleitores;
create policy "eleitores_select" on public.eleitores
  for select to authenticated
  using (
    colaborador_id = auth.uid()
    or public.get_my_role() in ('admin', 'candidato')
  );

drop policy if exists "eleitores_update_admin" on public.eleitores;
create policy "eleitores_update_admin" on public.eleitores
  for update to authenticated
  using (public.get_my_role() = 'admin');

drop policy if exists "eleitores_delete_admin" on public.eleitores;
create policy "eleitores_delete_admin" on public.eleitores
  for delete to authenticated
  using (public.get_my_role() = 'admin');

-- ---------------------------------------------------------------------------
-- storage: fotos dos eleitores (bucket privado)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos-eleitores', 'fotos-eleitores', false)
on conflict (id) do nothing;

drop policy if exists "fotos_insert_colaborador" on storage.objects;
create policy "fotos_insert_colaborador" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'fotos-eleitores'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "fotos_select" on storage.objects;
create policy "fotos_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'fotos-eleitores'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.get_my_role() in ('admin', 'candidato')
    )
  );

drop policy if exists "fotos_delete_admin" on storage.objects;
create policy "fotos_delete_admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fotos-eleitores' and public.get_my_role() = 'admin');
