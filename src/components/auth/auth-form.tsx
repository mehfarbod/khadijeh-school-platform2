"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/portal";
  const safeReturn = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already signed in, /api/auth/me says so — go to the destination.
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) router.replace(safeReturn);
      })
      .catch(() => undefined);
  }, [router, safeReturn]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "ورود ناموفق بود.");
      router.replace(safeReturn);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود ناموفق بود.");
      setBusy(false);
    }
  }

  return (
    <div className="card-quiet p-6">
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="email">نشانی رایانامه</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden />
            <Input id="email" type="email" required dir="ltr" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">گذرواژه</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden />
            <Input id="password" type="password" required dir="ltr" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
        </div>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          ورود به پورتال
        </Button>
        <p className="text-center text-xs leading-6 text-muted-foreground">
          برای دریافت حساب کاربری با دفتر مدرسه تماس بگیرید.
        </p>
      </form>
    </div>
  );
}
