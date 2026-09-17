import { NextResponse } from "next/server";
import { signOut, SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  await signOut();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
