import { useState } from "react";
import { Pause, Play, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const LIVE_URL = "https://jovempan.com.br/ao-vivo/";

/**
 * Jovem Pan doesn't publish an official embeddable stream URL or a "now
 * playing" API for third-party sites, so this player can't pull the real
 * audio or track name in-page. Instead it's an honest, polished affordance:
 * pressing play opens their official live stream in a new tab (real audio,
 * their player, their ads) while this stays a lightweight now-playing badge.
 */
export function JovemPanPlayer() {
  const [playing, setPlaying] = useState(false);

  function handleToggle() {
    if (!playing) {
      try {
        window.open(LIVE_URL, "_blank", "noopener,noreferrer");
      } catch {
        // Popup blocked by the browser; the visual state still toggles.
      }
    }
    setPlaying((p) => !p);
  }

  return (
    <div
      title="Abre o áudio ao vivo da Jovem Pan em uma nova aba"
      className="group flex items-center gap-2 rounded-full border border-input bg-background/60 py-1 pl-1 pr-3 shadow-sm transition-colors hover:border-primary/40"
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-label={playing ? "Marcar como pausado" : "Ouvir Jovem Pan ao vivo"}
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-90"
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
          <span className="text-[10px] text-muted-foreground">Ao vivo</span>
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
