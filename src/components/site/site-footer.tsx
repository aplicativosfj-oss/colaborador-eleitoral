import { Link } from "@tanstack/react-router";
import { StarEmblem } from "./star-emblem";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <StarEmblem className="size-3.5" />
              </span>
              <span className="text-sm">Colaborador Eleitoral</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Plataforma de mobilização da campanha de Pedro Abreu, candidato a Deputado Estadual
              pelo Acre.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="text-sm font-medium text-foreground">Navegação</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#sobre" className="hover:text-foreground">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-foreground">
                    Como funciona
                  </a>
                </li>
                <li>
                  <Link to="/cadastro" className="hover:text-foreground">
                    Quero ser colaborador
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Acesso</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/login" className="hover:text-foreground">
                    Entrar
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            Conteúdo de apoio à candidatura de Pedro Abreu (Deputado Estadual - AC), campanha
            eleitoral 2026.
          </p>
          <p>&copy; {new Date().getFullYear()} Colaborador Eleitoral.</p>
        </div>
      </div>
    </footer>
  );
}
