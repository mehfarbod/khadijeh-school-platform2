import { NextResponse } from "next/server";
import { adminStats } from "@/lib/admin-crud";

export async function GET() {
  try {
    const stats = await adminStats();
    return NextResponse.json({ stats });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطای ناشناخته" },
      { status: 403 },
    );
  }
}
