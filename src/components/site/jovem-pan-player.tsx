import { Pause, Play, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRadio } from "@/lib/radio-context";

const statusLabel = {
  stopped: "Ao vivo",
  loading: "Conectando…",
  playing: "Ao vivo",
  error: "Indisponível",
} as const;

export function JovemPanPlayer() {
  const { status, toggle } = useRadio();
  const playing = status === "playing";
  const loading = status === "loading";

  return (
    <div
      title="Jovem Pan FM ao vivo"
      className="flex items-center gap-2 rounded-full border border-input bg-background/60 py-1 pl-1 pr-3 shadow-sm transition-colors hover:border-primary/40"
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar Jovem Pan" : "Ouvir Jovem Pan ao vivo"}
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-90 disabled:opacity-50"
        disabled={loading}
      >
        {playing ? (
          <Pause className="size-3.5" fill="currentColor" />
        ) : (
          <Play className="ml-0.5 size-3.5" fill="currentColor" />
        )}
      </button>

      <div className="flex items-center gap-1.5">
        <Radio className="size-3.5 text-muted-foreground" />
        <div className="flex flex-col leading-none">
          <span className="text-xs font-semibold text-foreground">Jovem Pan</span>
          <span className="text-[10px] text-muted-foreground">{statusLabel[status]}</span>
        </div>
      </div>

      <div className="flex h-3 items-end gap-0.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            data-playing={playing}
            className={cn(
              "eq-bar h-full w-0.5 rounded-full",
              playing ? "bg-primary" : "scale-y-[0.35] bg-muted-foreground/40",
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
