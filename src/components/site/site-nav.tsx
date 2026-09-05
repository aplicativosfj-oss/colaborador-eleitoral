import { Link } from "@tanstack/react-router";
import { Menu, Radio } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StarEmblem } from "./star-emblem";
import { AcreFlag } from "./acre-flag";
import { ThemeToggle } from "./theme-toggle";
import { JovemPanPlayer } from "./jovem-pan-player";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#como-funciona", label: "Como funciona" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95">
            <StarEmblem className="size-4" />
          </span>
          <span className="text-sm sm:text-base">Colaborador Eleitoral</span>
          <AcreFlag className="hidden w-5 sm:block" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all hover:text-foreground hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:block">
            <JovemPanPlayer />
          </div>
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
            <Link to="/login">Entrar</Link>
          </Button>

          <button
            className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-accent lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://jovempan.com.br/ao-vivo/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground sm:hidden"
            >
              <Radio className="size-3.5" />
              Rádio Jovem Pan
            </a>
            <Button asChild variant="outline" size="sm" className="mt-1 w-full">
              <Link to="/login">Entrar</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
