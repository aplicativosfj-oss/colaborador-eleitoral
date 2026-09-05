import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MapPin, Users, UserCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/admin/stat-card";
import { EleitorCard } from "@/components/admin/eleitor-card";
import { EleitorDetailDialog } from "@/components/admin/eleitor-detail-dialog";
import { RoleGuard } from "@/components/admin/role-guard";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { getSignedUrls } from "@/lib/storage";
import type { Eleitor, Profile } from "@/lib/types";

export const Route = createFileRoute("/admin/candidato")({
  component: CandidatoDashboard,
});

function CandidatoDashboard() {
  const { profile } = useAuth();
  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [colaboradores, setColaboradores] = useState<Profile[]>([]);
  const [fotoUrls, setFotoUrls] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Eleitor | null>(null);
  const [filtro, setFiltro] = useState<string>("todos");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: eleitoresData }, { data: profilesData }] = await Promise.all([
      supabase.from("eleitores").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").eq("role", "colaborador"),
    ]);

    const rows = (eleitoresData ?? []) as Eleitor[];
    setEleitores(rows);
    setColaboradores((profilesData ?? []) as Profile[]);

    const paths = rows.map((e) => e.foto_path).filter((p): p is string => !!p);
    setFotoUrls(await getSignedUrls(paths));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const nomesPorId = useMemo(() => {
    const map: Record<string, string> = {};
    colaboradores.forEach((c) => (map[c.id] = c.full_name || "Colaborador"));
    return map;
  }, [colaboradores]);

  const filtrados = useMemo(
    () => (filtro === "todos" ? eleitores : eleitores.filter((e) => e.colaborador_id === filtro)),
    [eleitores, filtro],
  );

  const municipiosCobertos = useMemo(
    () => new Set(eleitores.map((e) => e.municipio).filter(Boolean)).size,
    [eleitores],
  );

  return (
    <RoleGuard allow={["candidato", "admin"]}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {profile && (
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              Olá, {profile.full_name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo(a) de volta ao painel da campanha.
            </p>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Users} label="Eleitores cadastrados" value={eleitores.length} />
          <StatCard icon={UserCheck} label="Colaboradores ativos" value={colaboradores.length} />
          <StatCard icon={MapPin} label="Municípios cobertos" value={municipiosCobertos} />
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">Eleitores cadastrados</h2>
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="sm:w-64">
              <SelectValue placeholder="Filtrar por colaborador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os colaboradores</SelectItem>
              {colaboradores.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.full_name || "Colaborador"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!loading && filtrados.length === 0 && (
          <p className="mt-4 rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            Nenhum eleitor cadastrado com esse filtro ainda.
          </p>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((e) => (
            <EleitorCard
              key={e.id}
              eleitor={e}
              fotoUrl={e.foto_path ? fotoUrls[e.foto_path] : undefined}
              colaboradorName={nomesPorId[e.colaborador_id]}
              onClick={() => setSelected(e)}
            />
          ))}
        </div>

        <EleitorDetailDialog
          eleitor={selected}
          fotoUrl={selected?.foto_path ? fotoUrls[selected.foto_path] : undefined}
          colaboradorName={selected ? nomesPorId[selected.colaborador_id] : undefined}
          onOpenChange={(open) => !open && setSelected(null)}
        />
      </div>
    </RoleGuard>
  );
}
