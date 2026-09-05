-- Permite login por CPF: dado um CPF, devolve apenas o e-mail associado
-- (nada mais), para o cliente então chamar signInWithPassword com esse e-mail.
create or replace function public.email_for_cpf(p_cpf text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select u.email
  from auth.users u
  join public.profiles p on p.id = u.id
  where p.cpf = p_cpf
  limit 1;
$$;

revoke all on function public.email_for_cpf(text) from public;
grant execute on function public.email_for_cpf(text) to anon, authenticated;
