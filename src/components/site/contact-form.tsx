"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const EMPTY = { name: "", phone: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "ارسال پیام ناموفق بود.");
      toast.success("پیام شما ثبت شد", { description: "به‌زودی با شما تماس می‌گیریم." });
      setForm(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال پیام ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-quiet p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="cf-name">نام و نام خانوادگی *</Label>
          <Input id="cf-name" required value={form.name} onChange={set("name")} placeholder="مثلاً مریم احمدی" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="cf-phone">شماره تماس</Label>
          <Input id="cf-phone" value={form.phone} onChange={set("phone")} placeholder="۰۹۱۲…" dir="ltr" />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="cf-subject">موضوع *</Label>
          <Input id="cf-subject" required value={form.subject} onChange={set("subject")} placeholder="موضوع پیام" />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="cf-message">متن پیام *</Label>
          <Textarea id="cf-message" required rows={5} value={form.message} onChange={set("message")} placeholder="پیام خود را بنویسید…" />
        </div>
      </div>
      {error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={saving} className="mt-5 w-full sm:w-auto">
        {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        ارسال پیام
      </Button>
    </form>
  );
}
