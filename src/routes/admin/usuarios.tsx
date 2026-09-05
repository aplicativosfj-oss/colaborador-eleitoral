import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleGuard } from "@/components/admin/role-guard";
import { supabase } from "@/lib/supabase";
import type { Profile, UserRole } from "@/lib/types";

export const Route = createFileRoute("/admin/usuarios")({
  component: UsuariosPage,
});

const roleLabel: Record<UserRole, string> = {
  pendente: "Aguardando aprovação",
  colaborador: "Colaborador",
  candidato: "Candidato",
  admin: "Administrador",
};

const roles: UserRole[] = ["pendente", "colaborador", "candidato", "admin"];

function UsuariosPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setProfiles((data ?? []) as Profile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateRole(id: string, role: UserRole) {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) {
      toast.error("Não foi possível atualizar o papel", { description: error.message });
      return;
    }
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, role } : p)));
    toast.success("Papel atualizado");
  }

  return (
    <RoleGuard allow={["admin"]}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-lg font-semibold text-foreground">Usuários</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Defina o papel de cada pessoa cadastrada: colaborador (cabo eleitoral), candidato ou
          administrador.
        </p>

        <div className="mt-6 rounded-2xl border border-border/70 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Papel atual</TableHead>
                <TableHead>Alterar papel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">
                    {p.full_name || "Sem nome"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.cpf || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{p.whatsapp || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={p.role === "pendente" ? "secondary" : "default"}>
                      {roleLabel[p.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={p.role}
                      onValueChange={(value) => updateRole(p.id, value as UserRole)}
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r} value={r}>
                            {roleLabel[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && profiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Nenhum usuário cadastrado ainda.
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
