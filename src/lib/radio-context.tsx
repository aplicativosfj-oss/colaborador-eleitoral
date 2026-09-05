import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Real, working Jovem Pan FM (São Paulo, 100.9) stream, sourced from the
// Radio Browser open directory (radio-browser.info) — a community-maintained
// database of direct, playable station stream URLs, exactly built for this.
// Jovem Pan itself publishes no official embeddable stream or "now playing"
// API, so this can play the real signal but can't show a live track title.
const STREAM_URL = "https://stream.zeno.fm/c45wbq2us3buv";

// Module-level singleton: created exactly once when this module first runs
// in the browser, never inside a React effect. This makes playback immune
// to component remounts (React StrictMode double-invoking effects, route
// transitions, hot-reload) — nothing but an explicit user click ever calls
// play() or pause() on it.
const sharedAudio = typeof window !== "undefined" ? new Audio(STREAM_URL) : null;
if (sharedAudio) sharedAudio.preload = "none";

type RadioStatus = "stopped" | "loading" | "playing" | "error";

interface RadioState {
  status: RadioStatus;
  toggle: () => void;
}

const RadioContext = createContext<RadioState | null>(null);

/**
 * Mounted once in __root.tsx. Only ever reflects/subscribes to the shared
 * audio element's real state — never recreates or auto-triggers playback.
 */
export function RadioProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<RadioStatus>(() =>
    sharedAudio && !sharedAudio.paused ? "playing" : "stopped",
  );

  useEffect(() => {
    const audio = sharedAudio;
    if (!audio) return;

    const onPlaying = () => setStatus("playing");
    const onPause = () => setStatus((s) => (s === "error" ? s : "stopped"));
    const onWaiting = () => setStatus("loading");
    const onError = () => setStatus("error");

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
    };
  }, []);

  function toggle() {
    if (!sharedAudio) return;

    if (!sharedAudio.paused) {
      sharedAudio.pause();
      setStatus("stopped");
      return;
    }

    setStatus("loading");
    sharedAudio.play().catch(() => setStatus("error"));
  }

  return <RadioContext.Provider value={{ status, toggle }}>{children}</RadioContext.Provider>;
}

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio deve ser usado dentro de <RadioProvider>");
  return ctx;
}
