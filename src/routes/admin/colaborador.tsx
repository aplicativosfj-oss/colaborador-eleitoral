import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Users, UserPlus, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatCard } from "@/components/admin/stat-card";
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
  const { user, profile } = useAuth();
  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [fotoUrls, setFotoUrls] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Eleitor | null>(null);
  const [editing, setEditing] = useState<Eleitor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [tab, setTab] = useState("cadastros");
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

  const municipiosCobertos = useMemo(
    () => new Set(eleitores.map((e) => e.municipio).filter(Boolean)).size,
    [eleitores],
  );

  async function handleDelete(eleitor: Eleitor) {
    setDeleting(true);
    const { error } = await supabase.from("eleitores").delete().eq("id", eleitor.id);
    setDeleting(false);

    if (error) {
      toast.error("Não foi possível excluir", { description: error.message });
      return;
    }

    setEleitores((prev) => prev.filter((e) => e.id !== eleitor.id));
    setSelected(null);
    toast.success("Cadastro excluído definitivamente");
  }

  return (
    <RoleGuard allow={["colaborador"]}>
      <div className="flex min-h-[100dvh] flex-col">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, var(--brand-navy) 0%, var(--brand-blue) 60%, var(--brand-green) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "repeating-linear-gradient(135deg, white 0 2px, transparent 2px 22px)",
            }}
          />
          <img
            src="/pastor.jpg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-64 object-cover object-top opacity-90 [mask-image:linear-gradient(to_left,black_40%,transparent)] md:block"
          />

          <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Painel do colaborador
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {profile ? `Olá, ${profile.full_name.split(" ")[0]}` : "Bem-vindo(a)"}
            </h1>
            <p className="mt-1.5 max-w-[52ch] text-sm text-white/75">
              Gerencie os apoios que você cadastrou para a campanha do Pastor Pedro Abreu.
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard icon={Users} label="Apoiadores cadastrados" value={eleitores.length} />
            <StatCard icon={MapPin} label="Municípios alcançados" value={municipiosCobertos} />
          </div>

          <Tabs value={tab} onValueChange={setTab} className="mt-8">
            <TabsList>
              <TabsTrigger value="cadastros" className="gap-1.5">
                <Users className="size-4" />
                Meus cadastros
                <span className="ml-0.5 rounded-full bg-primary/15 px-1.5 text-xs text-primary">
                  {eleitores.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="novo" className="gap-1.5">
                <UserPlus className="size-4" />
                Novo cadastro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cadastros" className="mt-6">
              {!loading && eleitores.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                  Nenhum cadastro ainda.{" "}
                  <button
                    type="button"
                    className="font-medium text-foreground underline underline-offset-4"
                    onClick={() => setTab("novo")}
                  >
                    Cadastre o primeiro apoio
                  </button>
                  .
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
            </TabsContent>

            <TabsContent value="novo" className="mt-6">
              <div className="mx-auto max-w-2xl rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-foreground">Cadastrar novo apoio</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Preencha os dados abaixo. Você pode editar ou excluir depois, na aba "Meus
                  cadastros".
                </p>
                <div className="mt-5">
                  <EleitorForm
                    onCreated={() => {
                      load();
                      setTab("cadastros");
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <EleitorDetailDialog
          eleitor={selected}
          fotoUrl={selected?.foto_path ? fotoUrls[selected.foto_path] : undefined}
          onOpenChange={(open) => !open && setSelected(null)}
          onEdit={(e) => {
            setEditing(e);
            setSelected(null);
          }}
          onDelete={handleDelete}
          deleting={deleting}
        />

        <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar cadastro</DialogTitle>
            </DialogHeader>
            {editing && (
              <EleitorForm
                eleitor={editing}
                fotoUrl={editing.foto_path ? fotoUrls[editing.foto_path] : undefined}
                onCancel={() => setEditing(null)}
                onCreated={() => {
                  setEditing(null);
                  load();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
