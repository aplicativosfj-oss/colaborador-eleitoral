-- A policy anterior (eleitores_insert_publico) fazia um EXISTS direto em
-- public.profiles, mas profiles tem RLS própria que não libera leitura para
-- o papel anon — então a subquery sempre via zero linhas e todo insert
-- público era rejeitado (42501), mesmo com um colaborador_id válido.
--
-- Corrige usando uma function security definer (só devolve true/false,
-- não expõe nenhum dado de profiles) para checar se o id é de um
-- colaborador de verdade.

create or replace function public.is_colaborador(p_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = p_id and role = 'colaborador'
  );
$$;

revoke all on function public.is_colaborador(uuid) from public;
grant execute on function public.is_colaborador(uuid) to anon, authenticated;

drop policy if exists "eleitores_insert_publico" on public.eleitores;
create policy "eleitores_insert_publico" on public.eleitores
  for insert to anon, authenticated
  with check (public.is_colaborador(colaborador_id));
