import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, getCurrentUser } from "./authHelpers";

export const myRegistrationIds = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    return ctx.db
      .query("courseRegistrations")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const myCourses = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const regs = await ctx.db
      .query("courseRegistrations")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();
    const out = [];
    for (const r of regs) {
      const course = await ctx.db.get(r.courseId);
      if (course) out.push({ reg: r, course });
    }
    return out;
  },
});

export const myExams = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const meDoc = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();
    const all = await ctx.db.query("exams").collect();
    if (!meDoc) return all;
    return all.filter((e) => !e.grade || e.grade === meDoc.grade);
  },
});

export const registerForCourse = mutation({
  args: {
    courseId: v.id("courses"),
    fullName: v.string(),
    phone: v.string(),
    grade: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, a) => {
    const user = await requireAuth(ctx);
    const course = await ctx.db.get(a.courseId);
    if (!course) throw new Error("دوره یافت نشد.");
    if (course.status === "closed") throw new Error("ثبت‌نام این دوره بسته است.");
    if (course.status === "full") throw new Error("ظرفیت این دوره تکمیل شده است.");
    const regs = await ctx.db
      .query("courseRegistrations")
      .withIndex("courseId", (q) => q.eq("courseId", a.courseId))
      .collect();
    if (course.capacity && regs.filter((r) => r.status !== "cancelled").length >= course.capacity) {
      throw new Error("ظرفیت این دوره تکمیل شده است.");
    }
    const dup = regs.find((r) => r.userId === user._id && r.status !== "cancelled");
    if (dup) throw new Error("شما قبلاً در این دوره ثبت‌نام کرده‌اید.");
    await ctx.db.insert("courseRegistrations", {
      ...a,
      userId: user._id,
      status: "pending",
      paymentStatus: "unpaid",
    });
    return true;
  },
});

export const cancelRegistration = mutation({
  args: { registrationId: v.id("courseRegistrations") },
  handler: async (ctx, a) => {
    const user = await requireAuth(ctx);
    const reg = await ctx.db.get(a.registrationId);
    if (!reg || reg.userId !== user._id) throw new Error("دسترسی غیرمجاز.");
    await ctx.db.patch(a.registrationId, { status: "cancelled" });
    return true;
  },
});
