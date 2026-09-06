-- Link público de autocadastro: um colaborador compartilha
-- /apoio/<seu-id>, a pessoa preenche os dados sozinha e o registro já
-- nasce vinculado a esse colaborador especificamente — nunca a outro.

-- Devolve só o nome do colaborador (nada de CPF/whatsapp) para a página
-- pública poder dizer "você está se cadastrando com fulano", sem expor
-- dados sensíveis do colaborador a quem só tem o link.
create or replace function public.nome_colaborador(p_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select full_name
  from public.profiles
  where id = p_id and role = 'colaborador'
  limit 1;
$$;

revoke all on function public.nome_colaborador(uuid) from public;
grant execute on function public.nome_colaborador(uuid) to anon, authenticated;

-- Permite que qualquer visitante (sem login) insira um cadastro, desde que
-- colaborador_id aponte para um colaborador de verdade — impossível vincular
-- a um id inventado ou a alguém que não seja colaborador.
drop policy if exists "eleitores_insert_publico" on public.eleitores;
create policy "eleitores_insert_publico" on public.eleitores
  for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = colaborador_id and p.role = 'colaborador'
    )
  );
