import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAdmin } from "./authHelpers";

export const setSetting = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, a) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("schoolSettings")
      .withIndex("key", (q) => q.eq("key", a.key))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { value: a.value });
    } else {
      await ctx.db.insert("schoolSettings", { key: a.key, value: a.value });
    }
    return true;
  },
});
