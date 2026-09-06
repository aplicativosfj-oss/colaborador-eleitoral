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
      className="group flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3.5 text-left shadow-sm transition-[color,background-color,border-color,transform,box-shadow] duration-200 hover:border-primary/40 hover:bg-accent/40 hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-10 border">
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
