-- Campo de data de reunião/visita nos cadastros de eleitores, usado no painel
-- do candidato/admin ao detalhar um colaborador.
alter table public.eleitores
  add column if not exists data_reuniao date;

-- Recria (se não existir) a função que permite login por CPF: dado um CPF,
-- devolve o e-mail associado, para o cliente então chamar signInWithPassword.
-- Precisa ser reaplicada aqui pois ficou faltando em ambientes onde a
-- migration 20260906010000_login_by_cpf.sql nunca rodou.
create or replace function public.email_for_cpf(p_cpf text)
returns text
language sql
security definer
stable
set search_path = public
as $function$
  select u.email
  from auth.users u
  join public.profiles p on p.id = u.id
  where p.cpf = p_cpf
  limit 1;
$function$;

revoke all on function public.email_for_cpf(text) from public;
grant execute on function public.email_for_cpf(text) to anon, authenticated;
