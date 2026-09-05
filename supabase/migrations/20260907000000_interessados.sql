-- Cadastro público de interessados (sem criar conta/senha).
-- Qualquer visitante pode inserir; apenas admin/candidato podem consultar.

create table if not exists public.interessados (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  cpf text not null,
  cidade text,
  whatsapp text,
  email text not null,
  created_at timestamptz not null default now()
);

comment on table public.interessados is 'Leads do formulário público "Quero ser colaborador": apenas dados de contato, sem conta/senha. Um CPF só pode aparecer uma vez.';

drop index if exists interessados_cpf_unique_idx;
create unique index interessados_cpf_unique_idx on public.interessados (cpf);

alter table public.interessados enable row level security;

drop policy if exists "interessados_insert_publico" on public.interessados;
create policy "interessados_insert_publico" on public.interessados
  for insert to anon, authenticated
  with check (true);

drop policy if exists "interessados_select_admin" on public.interessados;
create policy "interessados_select_admin" on public.interessados
  for select to authenticated
  using (public.get_my_role() in ('admin', 'candidato'));

drop policy if exists "interessados_delete_admin" on public.interessados;
create policy "interessados_delete_admin" on public.interessados
  for delete to authenticated
  using (public.get_my_role() = 'admin');
