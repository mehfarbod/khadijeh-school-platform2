import { defineTable } from "convex/server";
import { v } from "convex/values";

export const schoolTables = {
  students: defineTable({
    fullName: v.string(),
    grade: v.string(),
    className: v.string(),
    fatherName: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    photoUrl: v.optional(v.string()),
    status: v.optional(v.string()),
  }).index("grade", ["grade"]),

  staff: defineTable({
    fullName: v.string(),
    role: v.string(), // معلم / معاون / مدیر / مشاور ...
    subject: v.optional(v.string()),
    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    order: v.optional(v.number()),
  }),

  courses: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    instructor: v.optional(v.string()),
    category: v.string(),
    duration: v.optional(v.string()),
    capacity: v.optional(v.number()),
    schedule: v.optional(v.string()),
    status: v.optional(v.string()), // open | closed | full
    fee: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
  }).index("slug", ["slug"]),

  courseRegistrations: defineTable({
    courseId: v.id("courses"),
    userId: v.optional(v.id("users")),
    fullName: v.string(),
    phone: v.string(),
    grade: v.optional(v.string()),
    note: v.optional(v.string()),
    status: v.optional(v.string()), // pending | approved | rejected | cancelled
    paymentStatus: v.optional(v.string()), // unpaid | paid
    paymentRef: v.optional(v.string()),
  }).index("courseId", ["courseId"]).index("userId", ["userId"]),

  news: defineTable({
    title: v.string(),
    slug: v.string(),
    summary: v.optional(v.string()),
    body: v.string(),
    date: v.optional(v.string()),
    pinned: v.optional(v.boolean()),
  }).index("slug", ["slug"]),

  reports: defineTable({
    title: v.string(),
    slug: v.string(),
    summary: v.optional(v.string()),
    body: v.string(),
    date: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("slug", ["slug"]),

  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.string()),
  }),
};
