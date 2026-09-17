import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx } from "./_generated/server";
import { ADMIN_ROLES } from "./schema";

export async function getCurrentUser(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  return ctx.db.get(userId);
}

export async function requireAdmin(ctx: QueryCtx) {
  const user = await getCurrentUser(ctx);
  if (!user || !user.role || !ADMIN_ROLES.includes(user.role as never)) {
    throw new Error("دسترسی غیرمجاز: این عملیات فقط برای مدیران مدرسه مجاز است.");
  }
  return user;
}

export async function requireAuth(ctx: QueryCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("برای این عملیات باید وارد حساب خود شوید.");
  return user;
}
