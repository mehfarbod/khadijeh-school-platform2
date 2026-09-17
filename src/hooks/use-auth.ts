"use client";

import { useEffect, useState } from "react";

export type AuthUser = { id: string; email: string; name: string | null; role: string };

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setUser(d.user ?? null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function signOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  return { isLoading, isAuthenticated: !!user, user, signOut };
}
