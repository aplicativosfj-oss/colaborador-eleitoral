import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleGuard } from "@/components/admin/role-guard";
import { supabase } from "@/lib/supabase";
import type { Interessado } from "@/lib/types";

export const Route = createFileRoute("/admin/interessados")({
  component: InteressadosPage,
});

function InteressadosPage() {
  const [interessados, setInteressados] = useState<Interessado[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("interessados")
      .select("*")
      .order("created_at", { ascending: false });
    setInteressados((data ?? []) as Interessado[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <RoleGuard allow={["candidato", "admin"]}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Interessados</h1>
            <p className="text-sm text-muted-foreground">
              Pessoas que preencheram o formulário "Quero ser colaborador" no site, sem conta criada
              ainda.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="size-4" />
            {interessados.length}
          </span>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Recebido em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interessados.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium text-foreground">{i.nome_completo}</TableCell>
                  <TableCell className="text-muted-foreground">{i.cpf}</TableCell>
                  <TableCell className="text-muted-foreground">{i.cidade || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{i.whatsapp || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{i.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(i.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && interessados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Nenhum cadastro recebido ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </RoleGuard>
  );
}
