import { MapPin, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Eleitor } from "@/lib/types";

function formatBRL(value: number | null) {
  if (value === null) return null;
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function EleitorCard({
  eleitor,
  fotoUrl,
  colaboradorName,
  onClick,
}: {
  eleitor: Eleitor;
  fotoUrl?: string | undefined;
  colaboradorName?: string | undefined;
  onClick: () => void;
}) {
  const valor = formatBRL(eleitor.valor_recebido);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-12 border">
          <AvatarImage src={fotoUrl} className="object-cover" />
          <AvatarFallback>
            <User className="size-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{eleitor.nome_completo}</p>
          {eleitor.municipio && (
            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {eleitor.municipio}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        {colaboradorName && <span>Cadastrado por {colaboradorName}</span>}
        {valor && <span className="font-medium text-foreground">{valor}</span>}
      </div>
    </button>
  );
}
