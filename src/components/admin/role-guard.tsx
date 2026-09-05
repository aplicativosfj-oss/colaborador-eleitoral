import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";

export function RoleGuard({ allow, children }: { allow: UserRole[]; children: ReactNode }) {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!profile || !allow.includes(profile.role)) {
      navigate({ to: "/admin", replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, profile]);

  if (loading || !profile || !allow.includes(profile.role)) return null;
  return <>{children}</>;
}
