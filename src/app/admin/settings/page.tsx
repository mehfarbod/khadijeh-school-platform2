"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/site/primitives";
import { toast } from "sonner";

const FIELDS = [
  { key: "phone", label: "تلفن مدرسه" },
  { key: "email", label: "رایانامه" },
  { key: "address", label: "نشانی" },
  { key: "intro", label: "معرفی کوتاه" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string> | undefined>(undefined);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "خطا");
        if (!cancelled) {
          setSettings(json.settings);
          setValues(json.settings ?? {});
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "خطا در دریافت تنظیمات");
        if (!cancelled) setSettings({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (settings === undefined) return <Spinner />;

  async function onSave() {
    setSaving(true);
    try {
      for (const f of FIELDS) {
        if (values[f.key] !== undefined && values[f.key] !== settings?.[f.key]) {
          const res = await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: f.key, value: values[f.key] }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error ?? "ذخیره ناموفق بود");
        }
      }
      toast.success("تنظیمات ذخیره شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق بود");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">تنظیمات مدرسه</h1>
      <p className="mt-1 text-sm text-muted-foreground">اطلاعات تماس و معرفی در صفحه تماس سایت نمایش داده می‌شود.</p>
      <div className="card-quiet mt-6 grid gap-4 p-6">
        {FIELDS.map((f) => (
          <div key={f.key} className="grid gap-1.5">
            <Label htmlFor={`s-${f.key}`}>{f.label}</Label>
            <Input
              id={`s-${f.key}`}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
            />
          </div>
        ))}
        <Button onClick={onSave} disabled={saving} className="w-fit">
          {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          ذخیره تنظیمات
        </Button>
      </div>
    </div>
  );
}
