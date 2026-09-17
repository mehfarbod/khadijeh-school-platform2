"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function RequireAuth({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (adminOnly) {
      const adminRoles = ["super_admin", "admin", "content_manager"];
      if (!user || !user.role || !adminRoles.includes(user.role)) {
        router.replace("/portal");
      }
    }
  }, [isLoading, isAuthenticated, user, adminOnly, router]);

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" aria-label="در حال بررسی دسترسی" />
      </div>
    );
  }
  if (!isAuthenticated) return null;
  if (adminOnly && (!user || !["super_admin", "admin", "content_manager"].includes(user.role ?? ""))) {
    return null;
  }
  return <>{children}</>;
}
