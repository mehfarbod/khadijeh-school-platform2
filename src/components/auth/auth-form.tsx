"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot,
} from "@/components/ui/input-otp";

export function AuthForm() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const ensure = useMutation(api.account.ensureProfile);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/portal";

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const safeReturn = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/portal";

  if (!authLoading && isAuthenticated) {
    router.replace(safeReturn);
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn("email-otp", { email });
      setStep("code");
    } catch {
      setError("ارسال کد ناموفق بود؛ دوباره تلاش کنید.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn("email-otp", { email, code });
      await ensure({});
      router.replace(safeReturn);
    } catch {
      setError("کد واردشده نادرست است.");
      setBusy(false);
    }
  }

  return (
    <div className="card-quiet p-6">
      {step === "email" ? (
        <form onSubmit={sendCode} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">نشانی رایانامه</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden />
              <Input id="email" type="email" required dir="ltr" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
          </div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            ارسال کد ورود
          </Button>
          <p className="text-center text-xs leading-6 text-muted-foreground">
            کد ورود ۶ رقمی به رایانامه شما ارسال می‌شود.
          </p>
        </form>
      ) : (
        <form onSubmit={verify} className="grid gap-4">
          <p className="text-sm text-muted-foreground">کد ارسال‌شده به <span dir="ltr" className="font-medium text-foreground">{email}</span> را وارد کنید.</p>
          <div className="flex justify-center" dir="ltr">
            <InputOTP maxLength={6} value={code} onChange={setCode} disabled={busy}>
              <InputOTPGroup>
                <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={busy || code.length !== 6}>
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowLeft className="size-4" aria-hidden />}
            ورود
          </Button>
          <Button type="button" variant="ghost" onClick={() => { setStep("email"); setCode(""); }}>
            تغییر رایانامه
          </Button>
        </form>
      )}
    </div>
  );
}
