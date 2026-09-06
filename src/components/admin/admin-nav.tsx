import { Link, useNavigate } from "@tanstack/react-router";
import { BarChart3, ClipboardList, LogOut, Menu, UserRoundCog, Users, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignMark } from "@/components/site/campaign-mark";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { JovemPanPlayer } from "@/components/site/jovem-pan-player";
import { AvatarUpload } from "@/components/admin/avatar-upload";
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
  const [open, setOpen] = useState(false);

  const links: { to: string; label: string; icon: typeof Users }[] = [];
  if (profile?.role === "colaborador") {
    links.push({ to: "/admin/colaborador", label: "Meus eleitores", icon: ClipboardList });
  }
  if (profile?.role === "candidato" || profile?.role === "admin") {
    links.push({ to: "/admin/candidato", label: "Painel geral", icon: BarChart3 });
  }
  if (profile?.role === "candidato" || profile?.role === "admin") {
    links.push({ to: "/admin/interessados", label: "Interessados", icon: Users });
  }
  if (profile?.role === "admin") {
    links.push({ to: "/admin/usuarios", label: "Usuários", icon: UserRoundCog });
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
        <Link to="/" className="group text-brand-navy dark:text-foreground">
          <CampaignMark />
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fechar menu" : "Abrir menu"}>
          {open ? <X /> : <Menu />}
        </Button>
      </header>
      <aside className={`${open ? "flex" : "hidden"} fixed inset-x-0 top-14 z-30 flex-col border-b border-border bg-brand-navy p-3 text-primary-foreground shadow-lg md:sticky md:top-0 md:flex md:h-[100dvh] md:w-60 md:shrink-0 md:border-b-0 md:border-r md:border-primary-foreground/10 md:p-4 md:shadow-none`}>
        <Link to="/" className="group hidden border-b border-primary-foreground/10 pb-4 text-primary-foreground md:block">
          <CampaignMark />
        </Link>

        <nav className="flex flex-col gap-1 md:mt-5">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-primary-foreground/70 transition-all hover:bg-primary-foreground/10 hover:text-primary-foreground [&.active]:bg-primary-foreground/12 [&.active]:text-primary-foreground [&.active]:shadow-sm"
            >
              <link.icon className="size-4 text-brand-gold transition-transform group-hover:scale-110" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 flex items-center gap-2 border-t border-primary-foreground/10 pt-4 md:mt-auto">
          {profile && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-primary-foreground">{profile.full_name}</p>
              <Badge variant="secondary" className="mt-1 h-5 text-[9px]">{roleLabel[profile.role]}</Badge>
            </div>
          )}
          {profile && <AvatarUpload size="sm" />}
          <div className="text-primary-foreground"><ThemeToggle /></div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="Sair"
            onClick={async () => {
              await signOut();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
        <div className="mt-3 hidden md:block"><JovemPanPlayer /></div>
      </aside>
    </>
  );
}
