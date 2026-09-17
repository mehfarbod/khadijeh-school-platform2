import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const listStaff = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("staff").collect();
    rows.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return rows;
  },
});

export const listCourses = query({
  args: {},
  handler: async (ctx) => ctx.db.query("courses").collect(),
});

export const getCourseBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, a) =>
    ctx.db.query("courses").withIndex("slug", (q) => q.eq("slug", a.slug)).unique(),
});

export const listAlbums = query({
  args: {},
  handler: async (ctx) => ctx.db.query("galleryAlbums").collect(),
});

export const listAlbumImages = query({
  args: { albumId: v.id("galleryAlbums") },
  handler: async (ctx, a) =>
    ctx.db.query("galleryImages").withIndex("albumId", (q) => q.eq("albumId", a.albumId)).collect(),
});

export const listSchedule = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("scheduleEntries").collect();
    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"];
    rows.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day) || a.time.localeCompare(b.time));
    return rows;
  },
});

export const listExams = query({
  args: {},
  handler: async (ctx) => ctx.db.query("exams").collect(),
});

export const listFaq = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("faqItems").collect();
    rows.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return rows;
  },
});

export const submitContact = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, a) => {
    if (!a.name.trim() || !a.subject.trim() || !a.message.trim()) {
      throw new Error("نام، موضوع و متن پیام الزامی است.");
    }
    await ctx.db.insert("contactMessages", { ...a, read: false, createdAt: Date.now() });
    return true;
  },
});
