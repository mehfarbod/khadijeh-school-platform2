import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminOverviewPage() {
  await requireAdminUser();

  const [students, staff, courses, news, reports, events, announcements, achievements, exams, albums] =
    await Promise.all([
      db.student.count(),
      db.staff.count(),
      db.course.count(),
      db.news.count(),
      db.report.count(),
      db.event.count(),
      db.announcement.count(),
      db.achievement.count(),
      db.exam.count(),
      db.galleryAlbum.count(),
    ]);

  const stats: { label: string; value: number; href: string }[] = [
    { label: "دانش‌آموزان", value: students, href: "/admin/students" },
    { label: "کادر آموزشی", value: staff, href: "/admin/staff" },
    { label: "دوره‌ها", value: courses, href: "/admin/courses" },
    { label: "اخبار", value: news, href: "/admin/news" },
    { label: "گزارش‌ها", value: reports, href: "/admin/reports" },
    { label: "رویدادها", value: events, href: "/admin/events" },
    { label: "اطلاعیه‌ها", value: announcements, href: "/admin/announcements" },
    { label: "افتخارات", value: achievements, href: "/admin/achievements" },
    { label: "امتحانات", value: exams, href: "/admin/exams" },
    { label: "آلبوم‌ها", value: albums, href: "/admin/gallery-albums" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">نمای کلی</h1>
      <p className="mt-1 text-sm text-muted-foreground">خلاصه محتوای مدرسه در یک نگاه.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className="card-quiet p-5 hover:border-ink-soft/40">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/course-registrations" className="card-quiet p-6 hover:border-ink-soft/40">
          <h2 className="font-bold">ثبت‌نام‌های دوره‌ها</h2>
          <p className="mt-2 text-sm text-muted-foreground">بررسی و تأیید درخواست‌های ثبت‌نام دانش‌آموزان.</p>
        </Link>
        <Link href="/admin/contact-messages" className="card-quiet p-6 hover:border-ink-soft/40">
          <h2 className="font-bold">پیام‌های تماس</h2>
          <p className="mt-2 text-sm text-muted-foreground">پیام‌های رسیده از فرم تماس سایت.</p>
        </Link>
      </div>
    </div>
  );
}
