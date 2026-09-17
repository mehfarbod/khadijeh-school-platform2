import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./authHelpers";

/** Called after first sign-in: first real user becomes super admin, others student. */
export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    if (user.role) return user.role;
    const anyAdmin = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("role"), undefined))
      .first();
    const role = anyAdmin ? "student" : "super_admin";
    await ctx.db.patch(user._id, { role });
    return role;
  },
});

export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    let student = null;
    if (user.role === "student" || user.role === "parent") {
      student = await ctx.db
        .query("students")
        .withIndex("by_id")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
    }
    return { user, student };
  },
});
