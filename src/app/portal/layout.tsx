import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { RequireAuth } from "@/components/auth/require-auth";

export const metadata: Metadata = { title: "پورتال دانش‌آموزی" };

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-cream/50">
        <RequireAuth>{children}</RequireAuth>
      </main>
      <SiteFooter />
    </div>
  );
}
