import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./authHelpers";
import { sanitize, tableValidator, type AdminTable } from "./adminTables";

export const adminList = query({
  args: { table: tableValidator },
  handler: async (ctx, a) => {
    await requireAdmin(ctx);
    return ctx.db.query(a.table as AdminTable).order("desc").take(500);
  },
});

export const adminCount = query({
  args: { table: tableValidator },
  handler: async (ctx, a) => {
    await requireAdmin(ctx);
    return (await ctx.db.query(a.table as AdminTable).collect()).length;
  },
});

export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const tables = [
      "students", "staff", "courses", "news", "reports", "events",
      "announcements", "achievements", "exams", "galleryAlbums",
    ] as const;
    const out: Record<string, number> = {};
    for (const t of tables) {
      out[t] = (await ctx.db.query(t).collect()).length;
    }
    return out;
  },
});

export const adminCreate = mutation({
  args: { table: tableValidator, data: v.any() },
  handler: async (ctx, a) => {
    await requireAdmin(ctx);
    const clean = sanitize(a.table as AdminTable, a.data);
    return ctx.db.insert(a.table as AdminTable, clean as never);
  },
});

export const adminUpdate = mutation({
  args: { table: tableValidator, id: v.id("news"), data: v.any() },
  handler: async (ctx, a) => {
    await requireAdmin(ctx);
    const clean = sanitize(a.table as AdminTable, a.data);
    await ctx.db.patch(a.id as never, clean as never);
    return true;
  },
});

export const adminDelete = mutation({
  args: { table: tableValidator, id: v.id("news") },
  handler: async (ctx, a) => {
    await requireAdmin(ctx);
    await ctx.db.delete(a.id as never);
    return true;
  },
});

export const adminSetRole = mutation({
  args: { userId: v.id("users"), role: v.string() },
  handler: async (ctx, a) => {
    await requireAdmin(ctx);
    await ctx.db.patch(a.userId, { role: a.role as never });
    return true;
  },
});

export const adminListUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db.query("users").order("desc").take(200);
  },
});

export const adminMarkMessageRead = mutation({
  args: { id: v.id("contactMessages"), read: v.boolean() },
  handler: async (ctx, a) => {
    await requireAdmin(ctx);
    await ctx.db.patch(a.id, { read: a.read });
    return true;
  },
});
