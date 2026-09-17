import { db } from "@/lib/db";

const SCHEDULE_DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"];

export { SCHEDULE_DAYS };

/** Upcoming birthdays sorted nearest-first (Gregorian month/day like the old Convex query). */
export function listBirthdays(limit = 8) {
  const now = new Date();
  const month = now.getMonth() + 1;
  return db.birthday
    .findMany()
    .then((rows) =>
      rows
        .sort(
          (x, y) =>
            ((x.month - month + 12) % 12) - ((y.month - month + 12) % 12) || x.day - y.day,
        )
        .slice(0, limit),
    );
}

export function listNews(limit = 50) {
  return db.news.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export function getNewsBySlug(slug: string) {
  return db.news.findUnique({ where: { slug } });
}

export function listReports(limit = 50) {
  return db.report.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}

export function getReportBySlug(slug: string) {
  return db.report.findUnique({ where: { slug } });
}

export function listEvents(limit = 50) {
  return db.event.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}

export function listAnnouncements(limit = 50) {
  return db.announcement.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}

export function listAchievements(limit = 50) {
  return db.achievement.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}

export function listTopStudents(limit = 50) {
  return db.topStudent.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }], take: limit });
}

export function listStaff() {
  return db.staff.findMany({ orderBy: { order: "asc" } });
}

export function listCourses() {
  return db.course.findMany({ orderBy: { createdAt: "asc" } });
}

export function getCourseBySlug(slug: string) {
  return db.course.findUnique({ where: { slug } });
}

export function listAlbumsWithImages() {
  return db.galleryAlbum.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true },
  });
}

export function listSchedule() {
  return db.scheduleEntry
    .findMany()
    .then((rows) =>
      rows.sort(
        (a, b) =>
          SCHEDULE_DAYS.indexOf(a.day) - SCHEDULE_DAYS.indexOf(b.day) ||
          a.time.localeCompare(b.time, "fa"),
      ),
    );
}

export function listExams() {
  return db.exam.findMany({ orderBy: [{ grade: "asc" }, { date: "asc" }] });
}

export function listFaq() {
  return db.faqItem.findMany({ orderBy: { order: "asc" } });
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.schoolSetting.findMany();
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

/** Portal: current user's registrations with their courses. */
export async function myCourses(userId: string) {
  const regs = await db.courseRegistration.findMany({
    where: { userId, status: { not: "cancelled" } },
    orderBy: { createdAt: "desc" },
    include: { course: true },
  });
  return regs.map((r) => ({ reg: r, course: r.course }));
}

/** Portal: exams for the signed-in student's grade (all exams for non-students). */
export async function myExams(userId: string) {
  const student = await db.student.findFirst({ where: { userId } });
  const all = await db.exam.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }] });
  if (!student) return all;
  return all.filter((e) => !e.grade || e.grade === student.grade);
}
