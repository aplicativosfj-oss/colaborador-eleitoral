import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { useAuth } from "@/lib/auth-context";
import { StarEmblem } from "@/components/site/star-emblem";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function FullscreenLoader() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-muted/30">
      <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground motion-safe:animate-pulse">
        <StarEmblem className="size-5" />
      </span>
    </div>
  );
}

function AdminLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/login" });
    }
  }, [loading, session, navigate]);

  if (loading || !session) return <FullscreenLoader />;

  return (
    <div className="min-h-[100dvh] bg-muted/30 md:flex">
      <AdminNav />
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
