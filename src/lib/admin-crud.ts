import { db } from "@/lib/db";
import { assertAdmin } from "@/lib/auth";
import type { AdminModel } from "@/lib/admin-entities";

/**
 * Per-model field allowlists. Every admin write is sanitized through these —
 * unknown fields are dropped, types are coerced, so malformed requests can't
 * inject arbitrary columns (e.g. passwordHash or role).
 */
type FieldSpec = "string" | "number" | "boolean";

const MODEL_FIELDS: Record<AdminModel, Record<string, FieldSpec>> = {
  student: {
    fullName: "string", grade: "string", className: "string", fatherName: "string",
    guardianPhone: "string", photoUrl: "string", status: "string",
  },
  staff: {
    fullName: "string", role: "string", subject: "string", bio: "string",
    photoUrl: "string", email: "string", phone: "string", order: "number",
  },
  course: {
    title: "string", slug: "string", description: "string", instructor: "string",
    category: "string", duration: "string", capacity: "number", schedule: "string",
    status: "string", fee: "number", imageUrl: "string",
  },
  courseRegistration: {
    fullName: "string", phone: "string", grade: "string", courseId: "string",
    status: "string", paymentStatus: "string", paymentRef: "string", note: "string",
  },
  news: { title: "string", slug: "string", summary: "string", body: "string", date: "string", pinned: "boolean", imageUrl: "string" },
  report: { title: "string", slug: "string", summary: "string", body: "string", date: "string", imageUrl: "string" },
  event: { title: "string", description: "string", date: "string", time: "string", location: "string", category: "string" },
  announcement: { title: "string", body: "string", date: "string", important: "boolean" },
  achievement: { title: "string", level: "string", person: "string", year: "string", description: "string" },
  topStudent: { fullName: "string", grade: "string", className: "string", achievement: "string", photoUrl: "string", order: "number" },
  birthday: { person: "string", kind: "string", month: "number", day: "number", grade: "string" },
  galleryAlbum: { title: "string", description: "string", coverUrl: "string" },
  galleryImage: { albumId: "string", title: "string", url: "string" },
  scheduleEntry: { day: "string", time: "string", subject: "string", teacher: "string", grade: "string", className: "string" },
  exam: { title: "string", subject: "string", grade: "string", date: "string", time: "string", location: "string", notes: "string" },
  faqItem: { question: "string", answer: "string", order: "number" },
  contactMessage: { subject: "string", message: "string", read: "boolean" },
};

function sanitize(model: AdminModel, data: Record<string, unknown>): Record<string, unknown> {
  const spec = MODEL_FIELDS[model];
  if (!spec) throw new Error("مدل نامعتبر است.");
  const out: Record<string, unknown> = {};
  for (const [key, kind] of Object.entries(spec)) {
    const v = data[key];
    if (v === undefined || v === "" || v === null) continue;
    if (kind === "number") {
      const n = Number(String(v).replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))));
      if (!Number.isFinite(n)) continue;
      out[key] = n;
    } else if (kind === "boolean") {
      out[key] = Boolean(v);
    } else {
      out[key] = String(v).trim();
    }
  }
  return out;
}

type MinimalDelegate = {
  findMany: (args?: { orderBy?: unknown; take?: number }) => Promise<unknown[]>;
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
  count: () => Promise<number>;
};

function delegate(model: AdminModel): MinimalDelegate {
  const del = (db as unknown as Record<string, MinimalDelegate>)[model];
  if (!del) throw new Error("مدل نامعتبر است.");
  return del;
}

/** List rows (newest first, capped) — admin only. */
export async function adminList(model: AdminModel) {
  await assertAdmin();
  return delegate(model).findMany({ orderBy: { createdAt: "desc" }, take: 500 });
}

/** Row count — admin only. */
export async function adminCount(model: AdminModel) {
  await assertAdmin();
  return delegate(model).count();
}

/** Aggregate dashboard stats — admin only. */
export async function adminStats() {
  await assertAdmin();
  const models: AdminModel[] = [
    "student", "staff", "course", "news", "report", "event",
    "announcement", "achievement", "exam", "galleryAlbum",
  ];
  const out: Record<string, number> = {};
  for (const m of models) out[m] = await delegate(m).count();
  return out;
}

/** Create — admin only. */
export async function adminCreate(model: AdminModel, data: Record<string, unknown>) {
  await assertAdmin();
  const clean = sanitize(model, data);
  return delegate(model).create({ data: clean });
}

/** Update — admin only. */
export async function adminUpdate(model: AdminModel, id: string, data: Record<string, unknown>) {
  await assertAdmin();
  const clean = sanitize(model, data);
  return delegate(model).update({ where: { id }, data: clean });
}

/** Delete — admin only. */
export async function adminDelete(model: AdminModel, id: string) {
  await assertAdmin();
  return delegate(model).delete({ where: { id } });
}

/** Mark a contact message read/unread — admin only. */
export async function adminMarkMessageRead(id: string, read: boolean) {
  await assertAdmin();
  await db.contactMessage.update({ where: { id }, data: { read } });
  return true;
}
