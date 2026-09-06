import { ChevronRight, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types";

export function ColaboradorCard({
  colaborador,
  avatarUrl,
  total,
  onClick,
}: {
  colaborador: Profile;
  avatarUrl?: string | undefined;
  total: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 text-left transition-[color,background-color,border-color,transform,box-shadow] duration-200 hover:border-primary/40 hover:bg-accent/40 hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
    >
      <Avatar className="size-11 border">
        <AvatarImage src={avatarUrl} className="object-cover" />
        <AvatarFallback>
          <User className="size-5 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">
          {colaborador.full_name || "Colaborador"}
        </p>
        <p className="text-xs text-muted-foreground">{colaborador.whatsapp || "Sem WhatsApp"}</p>
      </div>
      <Badge variant="secondary" className="shrink-0">
        {total} {total === 1 ? "apoio" : "apoios"}
      </Badge>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
