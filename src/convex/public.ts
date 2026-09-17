import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./authHelpers";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("schoolSettings").collect();
    const out: Record<string, string> = {};
    for (const r of rows) if (r.key) out[r.key] = r.value ?? "";
    return out;
  },
});

export const listNews = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, a) => {
    let q = ctx.db.query("news").order("desc");
    const rows = await q.take(a.limit ?? 50);
    return rows;
  },
});

export const getNewsBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, a) => {
    return ctx.db.query("news").withIndex("slug", (q) => q.eq("slug", a.slug)).unique();
  },
});

export const listReports = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, a) =>
    (await ctx.db.query("reports").order("desc").take(a.limit ?? 50)),
});

export const getReportBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, a) =>
    ctx.db.query("reports").withIndex("slug", (q) => q.eq("slug", a.slug)).unique(),
});

export const listEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, a) =>
    (await ctx.db.query("events").order("desc").take(a.limit ?? 50)),
});

export const listAnnouncements = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, a) =>
    (await ctx.db.query("announcements").order("desc").take(a.limit ?? 50)),
});

export const listAchievements = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, a) =>
    (await ctx.db.query("achievements").order("desc").take(a.limit ?? 50)),
});

export const listTopStudents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, a) =>
    (await ctx.db.query("topStudents").order("desc").take(a.limit ?? 50)),
});

export const listBirthdays = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, a) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const rows = await ctx.db.query("birthdays").collect();
    rows.sort((x, y) =>
      ((x.month - month + 12) % 12) - ((y.month - month + 12) % 12) || x.day - y.day
    );
    return rows.slice(0, a.limit ?? 8);
  },
});
