import { NextRequest, NextResponse } from "next/server";
import { signIn, SESSION_COOKIE } from "@/lib/auth";
import { signInSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = signInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "اطلاعات ورود نامعتبر است." },
      { status: 400 },
    );
  }

  const token = await signIn(parsed.data.email, parsed.data.password);
  if (!token) {
    return NextResponse.json({ error: "رایانامه یا گذرواژه نادرست است." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
