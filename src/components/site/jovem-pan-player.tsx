import { useRef, useState } from "react";
import { Pause, Play, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

// Real, working Jovem Pan FM (São Paulo, 100.9) stream, sourced from the
// Radio Browser open directory (radio-browser.info) — a community-maintained
// database of direct, playable station stream URLs, exactly built for this.
// Jovem Pan itself publishes no official embeddable stream or "now playing"
// API, so a plain <audio> tag can play the real signal but can't show a
// live track title (that metadata simply isn't exposed anywhere public).
const STREAM_URL = "https://stream.zeno.fm/c45wbq2us3buv";

export function JovemPanPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  function handleToggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      return;
    }

    setErrored(false);
    setLoading(true);
    audio.play().catch(() => {
      setLoading(false);
      setErrored(true);
    });
  }

  return (
    <div
      title={errored ? "Não foi possível conectar ao stream agora" : "Jovem Pan FM ao vivo"}
      className="flex items-center gap-2 rounded-full border border-input bg-background/60 py-1 pl-1 pr-3 shadow-sm transition-colors hover:border-primary/40"
    >
      <audio
        ref={audioRef}
        src={STREAM_URL}
        preload="none"
        onPlaying={() => {
          setLoading(false);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onError={() => {
          setLoading(false);
          setPlaying(false);
          setErrored(true);
        }}
      />

      <button
        type="button"
        onClick={handleToggle}
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
          <span className="text-[10px] text-muted-foreground">
            {errored ? "Indisponível" : loading ? "Conectando…" : "Ao vivo"}
          </span>
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
