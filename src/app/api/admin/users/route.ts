import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assertAdmin } from "@/lib/auth";

const ASSIGNABLE_ROLES = ["SUPER_ADMIN", "SCHOOL_ADMIN", "CONTENT_MANAGER", "STUDENT", "PARENT", "STAFF"] as const;

export async function GET() {
  try {
    await assertAdmin();
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطای ناشناخته" },
      { status: 403 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await assertAdmin();
    const body = await req.json().catch(() => null);
    const userId = typeof body?.userId === "string" ? body.userId : null;
    const role = typeof body?.role === "string" ? body.role : null;
    if (!userId || !role || !ASSIGNABLE_ROLES.includes(role as (typeof ASSIGNABLE_ROLES)[number])) {
      return NextResponse.json({ error: "داده نامعتبر است." }, { status: 400 });
    }
    // Only a SUPER_ADMIN may change roles.
    if (admin.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "تغییر نقش کاربران فقط توسط مدیر ارشد مجاز است." }, { status: 403 });
    }
    await db.user.update({ where: { id: userId }, data: { role: role as never } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "به‌روزرسانی ناموفق بود" },
      { status: 400 },
    );
  }
}
