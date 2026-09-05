import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarEmblem } from "@/components/site/star-emblem";
import { AcreFlag } from "@/components/site/acre-flag";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";

const roleLabel: Record<UserRole, string> = {
  pendente: "Aguardando aprovação",
  colaborador: "Colaborador",
  candidato: "Candidato",
  admin: "Administrador",
};

export function AdminNav() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const links: { to: string; label: string }[] = [];
  if (profile?.role === "colaborador") {
    links.push({ to: "/admin/colaborador", label: "Meus eleitores" });
  }
  if (profile?.role === "candidato" || profile?.role === "admin") {
    links.push({ to: "/admin/candidato", label: "Painel geral" });
  }
  if (profile?.role === "candidato" || profile?.role === "admin") {
    links.push({ to: "/admin/interessados", label: "Interessados" });
  }
  if (profile?.role === "admin") {
    links.push({ to: "/admin/usuarios", label: "Usuários" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95">
            <StarEmblem className="size-4" />
          </span>
          <span className="hidden text-sm sm:inline">Colaborador Eleitoral</span>
          <AcreFlag className="hidden w-5 md:block" />
        </Link>

        <nav className="flex flex-1 items-center gap-6 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:font-medium [&.active]:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {profile && (
            <span className="hidden text-sm text-muted-foreground md:inline">
              Olá,{" "}
              <span className="font-medium text-foreground">{profile.full_name.split(" ")[0]}</span>
            </span>
          )}
          {profile && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {roleLabel[profile.role]}
            </Badge>
          )}
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await signOut();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
