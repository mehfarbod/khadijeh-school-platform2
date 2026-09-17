"use client";

import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const me = useQuery(api.account.me, {});
  const { signIn, signOut } = useAuthActions();

  const isLoading = isAuthLoading || me === undefined;

  return {
    isLoading,
    isAuthenticated,
    user: me?.user ?? null,
    student: me?.student ?? null,
    signIn,
    signOut,
  };
}
