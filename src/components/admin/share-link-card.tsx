import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ShareLinkCard({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) - select the input as a fallback.
    }
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <Link2 className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Seu link de cadastro</p>
          <p className="text-xs text-muted-foreground">
            Envie para quem quiser apoiar a campanha. O cadastro já chega vinculado a você.
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Input readOnly value={url} onFocus={(e) => e.target.select()} className="text-xs sm:text-sm" />
        <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={handleCopy}>
          {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
