-- Adiciona CPF (colaborador e eleitor) e zona eleitoral (eleitor).

alter table public.profiles
  add column if not exists cpf text;

alter table public.eleitores
  add column if not exists cpf text,
  add column if not exists zona text;

-- Evita colaboradores duplicados pelo mesmo CPF (nulls não conflitam entre si).
drop index if exists profiles_cpf_unique_idx;
create unique index profiles_cpf_unique_idx on public.profiles (cpf) where cpf is not null;

-- Passa a gravar o CPF informado no cadastro do colaborador.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, whatsapp, cpf, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'whatsapp',
    new.raw_user_meta_data ->> 'cpf',
    'pendente'
  );
  return new;
end;
$$;
