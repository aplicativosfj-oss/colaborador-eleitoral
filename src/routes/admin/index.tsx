import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !profile) return;
    if (profile.role === "colaborador") {
      navigate({ to: "/admin/colaborador", replace: true });
    } else if (profile.role === "candidato" || profile.role === "admin") {
      navigate({ to: "/admin/candidato", replace: true });
    }
  }, [loading, profile, navigate]);

  if (loading) return null;

  if (!profile || profile.role === "pendente") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <Clock className="size-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Cadastro em análise</h1>
        <p className="text-sm text-muted-foreground">
          Seu acesso ainda não foi liberado pelo time da campanha. Assim que seu papel for definido,
          esta página muda automaticamente.
        </p>
      </div>
    );
  }

  return null;
}
