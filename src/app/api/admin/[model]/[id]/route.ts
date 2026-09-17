import { NextRequest, NextResponse } from "next/server";
import { adminUpdate, adminDelete } from "@/lib/admin-crud";
import type { AdminModel } from "@/lib/admin-entities";
import { ENTITY_BY_SLUG } from "@/lib/admin-entities";

type Ctx = { params: Promise<{ model: string; id: string }> };

function resolveModel(raw: string): AdminModel | null {
  const viaSlug = ENTITY_BY_SLUG.get(raw);
  if (viaSlug) return viaSlug.model;
  for (const e of ENTITY_BY_SLUG.values()) if (e.model === raw) return raw as AdminModel;
  return null;
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { model: raw, id } = await params;
  const model = resolveModel(raw);
  if (!model) return NextResponse.json({ error: "مدل نامعتبر است." }, { status: 404 });
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "داده نامعتبر است." }, { status: 400 });
    }
    await adminUpdate(model, id, body as Record<string, unknown>);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "به‌روزرسانی ناموفق بود" },
      { status: 400 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { model: raw, id } = await params;
  const model = resolveModel(raw);
  if (!model) return NextResponse.json({ error: "مدل نامعتبر است." }, { status: 404 });
  try {
    await adminDelete(model, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "حذف ناموفق بود" },
      { status: 400 },
    );
  }
}
