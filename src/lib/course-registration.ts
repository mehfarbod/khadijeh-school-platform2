import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

/**
 * Core registration workflow, shared by the API route (and later by payment
 * callback handlers). Throws Persian-language errors the UI can show directly.
 */
export async function requirePortalUserApi(body: unknown): Promise<{ ok: true; registrationId: string }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("برای این عملیات باید وارد حساب خود شوید.");

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "اطلاعات ثبت‌نام نامعتبر است.");
  }
  const d = parsed.data;

  const course = await db.course.findUnique({ where: { id: d.courseId } });
  if (!course) throw new Error("دوره یافت نشد.");
  if (course.status === "closed") throw new Error("ثبت‌نام این دوره بسته است.");
  if (course.status === "full") throw new Error("ظرفیت این دوره تکمیل شده است.");

  // Capacity check: active (non-cancelled) registrations count toward capacity.
  const activeCount = await db.courseRegistration.count({
    where: { courseId: course.id, status: { not: "cancelled" } },
  });
  if (course.capacity != null && activeCount >= course.capacity) {
    throw new Error("ظرفیت این دوره تکمیل شده است.");
  }

  // Duplicate protection: DB unique index on (courseId, userId) is the hard
  // guarantee; this check gives a friendly Persian message first.
  const existing = await db.courseRegistration.findFirst({
    where: { courseId: course.id, userId: user.id, status: { not: "cancelled" } },
  });
  if (existing) throw new Error("شما قبلاً در این دوره ثبت‌نام کرده‌اید.");

  const reg = await db.courseRegistration.create({
    data: {
      courseId: course.id,
      userId: user.id,
      fullName: d.fullName,
      phone: d.phone,
      grade: d.grade || null,
      note: d.note || null,
      status: "pending",
      paymentStatus: "unpaid",
    },
  });
  return { ok: true, registrationId: reg.id };
}
