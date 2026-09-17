import { v } from "convex/values";

export const ADMIN_TABLES = [
  "students",
  "staff",
  "courses",
  "courseRegistrations",
  "news",
  "reports",
  "events",
  "announcements",
  "achievements",
  "topStudents",
  "birthdays",
  "galleryAlbums",
  "galleryImages",
  "scheduleEntries",
  "exams",
  "faqItems",
  "contactMessages",
  "schoolSettings",
] as const;

export type AdminTable = (typeof ADMIN_TABLES)[number];

export const tableValidator = v.union(
  ...ADMIN_TABLES.map((t) => v.literal(t)),
);

const idFields: Partial<Record<AdminTable, string[]>> = {
  galleryImages: ["albumId"],
  courseRegistrations: ["courseId"],
};

export function sanitize(table: AdminTable, data: Record<string, unknown>) {
  const allowed = idFields[table] ?? [];
  const out: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(data)) {
    if (val === undefined || val === "") continue;
    if (allowed.includes(k) || typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      out[k] = val;
    }
  }
  return out;
}
