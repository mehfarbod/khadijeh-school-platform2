"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Toaster } from "@/components/ui/sonner";
import { convex } from "@/lib/convex-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthProvider client={convex}>
      {children}
      <Toaster position="bottom-left" richColors />
    </ConvexAuthProvider>
  );
}
