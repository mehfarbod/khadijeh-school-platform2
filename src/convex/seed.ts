import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const seedAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("schoolSettings").collect();
    if (existing.length > 0) return "already";
    await ctx.runMutation(internal.seedPeople.seed, {});
    await ctx.runMutation(internal.seedContent.seedNewsEvents, {});
    await ctx.runMutation(internal.seedContent2.seedMore, {});
    return "seeded";
  },
});
