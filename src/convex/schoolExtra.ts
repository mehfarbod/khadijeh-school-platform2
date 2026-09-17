import { defineTable } from "convex/server";
import { v } from "convex/values";

export const schoolTablesExtra = {
  announcements: defineTable({
    title: v.string(),
    body: v.string(),
    date: v.optional(v.string()),
    important: v.optional(v.boolean()),
  }),

  achievements: defineTable({
    title: v.string(),
    level: v.optional(v.string()), // school | student
    person: v.optional(v.string()),
    year: v.optional(v.string()),
    description: v.optional(v.string()),
  }),

  topStudents: defineTable({
    fullName: v.string(),
    grade: v.string(),
    className: v.optional(v.string()),
    achievement: v.string(),
    photoUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  }),

  birthdays: defineTable({
    person: v.string(),
    kind: v.optional(v.string()), // student | staff
    month: v.number(),
    day: v.number(),
    grade: v.optional(v.string()),
  }).index("month", ["month"]),

  galleryAlbums: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
  }),

  galleryImages: defineTable({
    albumId: v.id("galleryAlbums"),
    title: v.optional(v.string()),
    url: v.string(),
  }).index("albumId", ["albumId"]),

  scheduleEntries: defineTable({
    day: v.string(), // شنبه ... پنجشنبه
    time: v.string(),
    subject: v.string(),
    teacher: v.optional(v.string()),
    grade: v.string(),
    className: v.string(),
  }).index("day", ["day"]).index("grade", ["grade"]),

  exams: defineTable({
    title: v.string(),
    subject: v.string(),
    grade: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
  }),

  faqItems: defineTable({
    question: v.string(),
    answer: v.string(),
    order: v.optional(v.number()),
  }),

  contactMessages: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    read: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  }),

  schoolSettings: defineTable({
    key: v.string(),
    value: v.optional(v.string()),
  }).index("key", ["key"]),
};
