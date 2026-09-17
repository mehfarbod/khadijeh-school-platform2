import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assertAdmin } from "@/lib/auth";
import { settingSchema } from "@/lib/validation";

export async function GET() {
  try {
    await assertAdmin();
    const rows = await db.schoolSetting.findMany();
    const settings: Record<string, string> = {};
    for (const r of rows) settings[r.key] = r.value;
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطای ناشناخته" },
      { status: 403 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await assertAdmin();
    const body = await req.json().catch(() => null);
    const parsed = settingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "داده نامعتبر است." },
        { status: 400 },
      );
    }
    await db.schoolSetting.upsert({
      where: { key: parsed.data.key },
      update: { value: parsed.data.value },
      create: { key: parsed.data.key, value: parsed.data.value },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "ذخیره ناموفق بود" },
      { status: 400 },
    );
  }
}
