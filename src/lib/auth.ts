import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import type { Role } from "@prisma/client";

export const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "SCHOOL_ADMIN", "CONTENT_MANAGER"];
export const SESSION_COOKIE = "school_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Verify credentials and create a DB-backed session; returns the session token. */
export async function signIn(email: string, password: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  const token = randomBytes(32).toString("hex");
  await db.session.create({
    data: {
      tokenHash: hashToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });
  return token;
}

/** Destroy the current session (if any). */
export async function signOut(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
}

/** The current session user, or null. Cached per request. */
export const getCurrentUser = cache(async () => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  return session.user;
});

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user && ADMIN_ROLES.includes(user.role);
}

/** Server-side guard for admin pages: redirects when unauthorized. */
export async function requireAdminUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth?returnTo=/admin");
  if (!ADMIN_ROLES.includes(user.role)) redirect("/portal");
  return user;
}

/** Server-side guard for portal pages: redirects when signed out. */
export async function requirePortalUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth?returnTo=/portal");
  return user;
}

/** Throws when the caller is not an admin — for API routes. */
export async function assertAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    throw new AuthError("دسترسی غیرمجاز: این عملیات فقط برای مدیران مدرسه مجاز است.");
  }
  return user;
}

export class AuthError extends Error {}

export type User = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: Role;
};
