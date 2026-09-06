import { useState } from "react";
import { CalendarClock, MapPin, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EleitorCard } from "./eleitor-card";
import { EleitorDetailDialog } from "./eleitor-detail-dialog";
import type { Eleitor, Profile } from "@/lib/types";

export function ColaboradorDetailDialog({
  colaborador,
  avatarUrl,
  eleitores,
  fotoUrls,
  onOpenChange,
}: {
  colaborador: Profile | null;
  avatarUrl?: string | undefined;
  eleitores: Eleitor[];
  fotoUrls: Record<string, string>;
  onOpenChange: (open: boolean) => void;
}) {
  const [selected, setSelected] = useState<Eleitor | null>(null);

  const municipios = new Set(eleitores.map((e) => e.municipio).filter(Boolean)).size;
  const proximaReuniao = eleitores
    .map((e) => e.data_reuniao)
    .filter((d): d is string => !!d)
    .sort()[0];

  return (
    <Dialog open={!!colaborador} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {colaborador && (
          <>
            <DialogHeader className="items-center text-center sm:items-start sm:text-left">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 border">
                  <AvatarImage src={avatarUrl} className="object-cover" />
                  <AvatarFallback>
                    <User className="size-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>{colaborador.full_name || "Colaborador"}</DialogTitle>
                  <DialogDescription>
                    {colaborador.whatsapp || "Sem WhatsApp"} · {colaborador.cpf || "CPF não informado"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Separator />

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-border/70 p-3">
                <p className="text-xl font-bold text-foreground">{eleitores.length}</p>
                <p className="text-xs text-muted-foreground">Cadastrados</p>
              </div>
              <div className="rounded-lg border border-border/70 p-3">
                <p className="text-xl font-bold text-foreground">{municipios}</p>
                <p className="text-xs text-muted-foreground">Municípios</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border/70 p-3">
                <CalendarClock className="size-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {proximaReuniao
                    ? new Date(`${proximaReuniao}T00:00:00`).toLocaleDateString("pt-BR")
                    : "Sem reunião marcada"}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <MapPin className="size-4" />
                Cadastros deste colaborador
              </p>
              {eleitores.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                  Nenhum cadastro ainda.
                </p>
              ) : (
                <div className="grid max-h-[45vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                  {eleitores.map((e) => (
                    <EleitorCard
                      key={e.id}
                      eleitor={e}
                      fotoUrl={e.foto_path ? fotoUrls[e.foto_path] : undefined}
                      onClick={() => setSelected(e)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <EleitorDetailDialog
          eleitor={selected}
          fotoUrl={selected?.foto_path ? fotoUrls[selected.foto_path] : undefined}
          colaboradorName={colaborador?.full_name}
          onOpenChange={(open) => !open && setSelected(null)}
        />
      </DialogContent>
    </Dialog>
  );
}
