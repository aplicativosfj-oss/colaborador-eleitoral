import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { createColaboradorServerFn } from "@/lib/create-colaborador.server";
import { novoUsuarioSchema } from "@/lib/validation";
import { formatCPF, formatPhoneBR, onlyDigits } from "@/lib/validators";
import type { Profile, UserRole } from "@/lib/types";
import type { z } from "zod";

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
const criavelRoles: UserRole[] = ["colaborador", "candidato", "admin"];

type NovoUsuarioValues = z.infer<typeof novoUsuarioSchema>;

function NovoUsuarioDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NovoUsuarioValues>({
    resolver: zodResolver(novoUsuarioSchema),
    defaultValues: { role: "colaborador" },
  });

  const cpfField = register("cpf");
  const whatsappField = register("whatsapp");

  async function onSubmit(values: NovoUsuarioValues) {
    setSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session.session?.access_token;
      if (!accessToken) throw new Error("Sessão expirada, faça login novamente.");

      await createColaboradorServerFn({
        data: {
          accessToken,
          full_name: values.full_name,
          cpf: onlyDigits(values.cpf),
          whatsapp: onlyDigits(values.whatsapp),
          email: values.email,
          password: values.password,
          role: values.role,
        },
      });

      toast.success("Usuário criado", {
        description: `${values.full_name} já pode entrar com o CPF e a senha definidos.`,
      });
      reset({ role: "colaborador" });
      setOpen(false);
      onCreated();
    } catch (err) {
      toast.error("Não foi possível criar o usuário", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <UserPlus className="size-4" />
          Novo usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar novo usuário</DialogTitle>
          <DialogDescription>
            O usuário já entra com o papel escolhido, pronto para usar o painel junto com os demais
            colaboradores.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="full_name">Nome completo</Label>
            <Input id="full_name" autoComplete="name" {...register("full_name")} />
            {errors.full_name && (
              <p className="text-xs text-destructive">{errors.full_name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                inputMode="numeric"
                placeholder="000.000.000-00"
                {...cpfField}
                onChange={(e) => {
                  e.target.value = formatCPF(e.target.value);
                  cpfField.onChange(e);
                }}
              />
              {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                inputMode="numeric"
                placeholder="(68) 90000-0000"
                {...whatsappField}
                onChange={(e) => {
                  e.target.value = formatPhoneBR(e.target.value);
                  whatsappField.onChange(e);
                }}
              />
              {errors.whatsapp && (
                <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail de acesso</Label>
            <Input id="email" type="email" autoComplete="off" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha provisória</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Papel</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {criavelRoles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {roleLabel[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <Button type="submit" className="mt-2" disabled={submitting}>
            {submitting ? "Criando..." : "Criar usuário"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Usuários</h1>
            <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">
              Crie o acesso de colaboradores e candidatos diretamente por aqui, ou ajuste o papel de
              quem já se cadastrou.
            </p>
          </div>
          <NovoUsuarioDialog onCreated={load} />
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border/70 bg-card">
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
