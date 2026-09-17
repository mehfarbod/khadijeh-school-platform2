import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "برای این عملیات باید وارد حساب خود شوید." }, { status: 401 });
  }

  const reg = await db.courseRegistration.findUnique({ where: { id } });
  if (!reg || (reg.userId !== user.id && !["SUPER_ADMIN", "SCHOOL_ADMIN", "CONTENT_MANAGER"].includes(user.role))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 403 });
  }

  await db.courseRegistration.update({ where: { id }, data: { status: "cancelled" } });
  return NextResponse.json({ ok: true });
}
