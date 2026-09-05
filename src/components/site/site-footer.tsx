import { Link } from "@tanstack/react-router";
import { StarEmblem } from "./star-emblem";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <StarEmblem className="size-3" />
            </span>
            <span className="text-sm">Colaborador Eleitoral</span>
          </div>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <a href="#sobre" className="hover:text-foreground">
              Sobre
            </a>
            <a href="#como-funciona" className="hover:text-foreground">
              Como funciona
            </a>
            <Link to="/cadastro" className="hover:text-foreground">
              Quero ser colaborador
            </Link>
            <Link to="/login" className="hover:text-foreground">
              Entrar
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Colaborador Eleitoral · Apoio à candidatura de Pedro
            Abreu (Deputado Estadual - AC).
          </p>
        </div>

        <p className="mt-3 border-t border-border/60 pt-3 text-center text-[11px] text-muted-foreground/80 md:text-right">
          Desenvolvido por Franc Denis · Feijó, Acre · 2026
        </p>
      </div>
    </footer>
  );
}
