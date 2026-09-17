"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function SignOutButton({ className, label = "خروج از حساب" }: { className?: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.replace("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={onClick} disabled={busy} className={className}>
      <LogOut className="size-3.5" aria-hidden /> {label}
    </button>
  );
}
