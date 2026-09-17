import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePortalUserApi } from "@/lib/course-registration";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const result = await requirePortalUserApi(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "ثبت‌نام ناموفق بود.";
    const status = message.includes("وارد حساب") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
