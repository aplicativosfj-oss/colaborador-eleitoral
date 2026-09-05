import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EleitorForm } from "@/components/admin/eleitor-form";
import { EleitorCard } from "@/components/admin/eleitor-card";
import { EleitorDetailDialog } from "@/components/admin/eleitor-detail-dialog";
import { RoleGuard } from "@/components/admin/role-guard";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { getSignedUrls } from "@/lib/storage";
import type { Eleitor } from "@/lib/types";

export const Route = createFileRoute("/admin/colaborador")({
  component: ColaboradorDashboard,
});

function ColaboradorDashboard() {
  const { user } = useAuth();
  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [fotoUrls, setFotoUrls] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Eleitor | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("eleitores")
      .select("*")
      .eq("colaborador_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const rows = data as Eleitor[];
      setEleitores(rows);
      const paths = rows.map((e) => e.foto_path).filter((p): p is string => !!p);
      setFotoUrls(await getSignedUrls(paths));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <RoleGuard allow={["colaborador"]}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Cadastrar eleitor</CardTitle>
            <CardDescription>
              Preencha os dados abaixo. Depois de salvo, o cadastro fica disponível apenas para
              consulta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EleitorForm onCreated={load} />
          </CardContent>
        </Card>

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Meus eleitores</h2>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-4" />
              {eleitores.length}
            </span>
          </div>

          {!loading && eleitores.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
              Nenhum eleitor cadastrado ainda. Use o formulário acima para começar.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eleitores.map((e) => (
              <EleitorCard
                key={e.id}
                eleitor={e}
                fotoUrl={e.foto_path ? fotoUrls[e.foto_path] : undefined}
                onClick={() => setSelected(e)}
              />
            ))}
          </div>
        </div>

        <EleitorDetailDialog
          eleitor={selected}
          fotoUrl={selected?.foto_path ? fotoUrls[selected.foto_path] : undefined}
          onOpenChange={(open) => !open && setSelected(null)}
        />
      </div>
    </RoleGuard>
  );
}
