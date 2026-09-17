"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function CourseRegisterForm({
  courseId,
  status,
}: {
  courseId: string;
  status?: string;
}) {
  const register = useMutation(api.portal.registerForCourse);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "closed") {
    return <p className="card-quiet p-5 text-sm text-muted-foreground">ثبت‌نام این دوره بسته است.</p>;
  }
  if (status === "full") {
    return <p className="card-quiet p-5 text-sm text-muted-foreground">ظرفیت این دوره تکمیل شده است.</p>;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    setError(null);
    try {
      await register({
        courseId: courseId as never,
        fullName: String(fd.get("fullName") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        grade: String(fd.get("grade") ?? "") || undefined,
        note: String(fd.get("note") ?? "") || undefined,
      });
      toast.success("درخواست ثبت‌نام ثبت شد", { description: "بررسی و تأیید نهایی توسط مدرسه انجام می‌شود." });
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت‌نام ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-quiet p-6">
      <h3 className="font-bold">فرم ثبت‌نام دوره</h3>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">
        برای تکمیل ثبت‌نام وارد حساب پورتال شوید؛ پرداخت شهریه در مرحله بعد (درگاه بانکی) فعال می‌شود.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="reg-name">نام و نام خانوادگی *</Label>
          <Input id="reg-name" name="fullName" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="reg-phone">شماره تماس *</Label>
          <Input id="reg-phone" name="phone" required dir="ltr" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="reg-grade">پایه تحصیلی</Label>
          <Input id="reg-grade" name="grade" placeholder="مثلاً دهم" />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="reg-note">توضیحات</Label>
          <Textarea id="reg-note" name="note" rows={3} />
        </div>
      </div>
      {error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={saving} className="mt-5 w-full sm:w-auto">
        {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        ثبت درخواست
      </Button>
    </form>
  );
}
