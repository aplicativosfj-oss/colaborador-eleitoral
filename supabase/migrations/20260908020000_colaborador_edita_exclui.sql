-- Permite que o próprio colaborador edite e exclua (definitivamente) os
-- cadastros que ele mesmo criou. Antes só o admin podia editar/excluir.

drop policy if exists "eleitores_update_colaborador" on public.eleitores;
create policy "eleitores_update_colaborador" on public.eleitores
  for update to authenticated
  using (colaborador_id = auth.uid() and public.get_my_role() = 'colaborador')
  with check (colaborador_id = auth.uid() and public.get_my_role() = 'colaborador');

drop policy if exists "eleitores_delete_colaborador" on public.eleitores;
create policy "eleitores_delete_colaborador" on public.eleitores
  for delete to authenticated
  using (colaborador_id = auth.uid() and public.get_my_role() = 'colaborador');

-- A foto antiga de um cadastro editado/excluído também precisa poder ser
-- substituída/removida do Storage pelo próprio colaborador.
drop policy if exists "fotos_update_colaborador" on storage.objects;
create policy "fotos_update_colaborador" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'fotos-eleitores'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "fotos_delete_colaborador" on storage.objects;
create policy "fotos_delete_colaborador" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'fotos-eleitores'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
