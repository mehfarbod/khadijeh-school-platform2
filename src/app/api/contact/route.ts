import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { contactSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "اطلاعات فرم نامعتبر است." },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const user = await getCurrentUser();

  try {
    await db.contactMessage.create({
      data: {
        name: d.name,
        phone: d.phone || null,
        email: d.email || null,
        subject: d.subject,
        message: d.message,
        userId: user?.id ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "ثبت پیام ناموفق بود؛ دوباره تلاش کنید." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
