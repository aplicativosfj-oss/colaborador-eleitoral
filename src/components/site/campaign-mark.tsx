import { StarEmblem } from "./star-emblem";
import { cn } from "@/lib/utils";

export function CampaignMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-gold text-brand-navy shadow-sm transition-transform duration-200 motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-105">
        <StarEmblem className="size-4" />
      </span>
      <span className="min-w-0 leading-tight">
        <strong className="block truncate text-sm font-bold text-current">Gestão Eleitoral</strong>
        <span className="block text-[10px] font-semibold uppercase text-current/60">Pedro Abreu 2026</span>
      </span>
    </div>
  );
}