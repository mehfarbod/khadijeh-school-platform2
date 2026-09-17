import { NextRequest, NextResponse } from "next/server";
import { adminList, adminCreate } from "@/lib/admin-crud";
import type { AdminModel } from "@/lib/admin-entities";
import { ENTITY_BY_SLUG } from "@/lib/admin-entities";

type Ctx = { params: Promise<{ model: string }> };

function resolveModel(raw: string): AdminModel | null {
  // Accept either the admin slug ("news", "top-students") or the Prisma model key.
  const viaSlug = ENTITY_BY_SLUG.get(raw);
  if (viaSlug) return viaSlug.model;
  for (const e of ENTITY_BY_SLUG.values()) if (e.model === raw) return raw as AdminModel;
  return null;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { model: raw } = await params;
  const model = resolveModel(raw);
  if (!model) return NextResponse.json({ error: "مدل نامعتبر است." }, { status: 404 });
  try {
    const rows = await adminList(model);
    return NextResponse.json({ rows });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطای ناشناخته" },
      { status: 403 },
    );
  }
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { model: raw } = await params;
  const model = resolveModel(raw);
  if (!model) return NextResponse.json({ error: "مدل نامعتبر است." }, { status: 404 });
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "داده نامعتبر است." }, { status: 400 });
    }
    const row = await adminCreate(model, body as Record<string, unknown>);
    return NextResponse.json({ row }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "ایجاد ناموفق بود" },
      { status: 400 },
    );
  }
}
