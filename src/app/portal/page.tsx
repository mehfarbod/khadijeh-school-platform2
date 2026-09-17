import Link from "next/link";
import { BookOpen, CalendarX, UserRound } from "lucide-react";
import { db } from "@/lib/db";
import { requirePortalUser } from "@/lib/auth";
import { myCoursesSafe, myExamsSafe } from "@/lib/portal-data";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { EmptyState } from "@/components/site/primitives";

const REG_STATUS: Record<string, string> = {
  pending: "در انتظار تأیید",
  approved: "تأیید شده",
  rejected: "رد شده",
  cancelled: "لغو شده",
};

export default async function PortalPage() {
  const user = await requirePortalUser();
  const student = await db.student.findUnique({ where: { userId: user.id } });
  const [courses, exams] = await Promise.all([myCoursesSafe(user.id), myExamsSafe(user.id)]);

  return (
    <div className="container-page max-w-5xl py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">پورتال دانش‌آموزی و اولیا</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {student?.fullName ?? user.name ?? "خوش آمدید"}
          </h1>
          {student ? (
            <p className="mt-1 text-sm text-muted-foreground">
              پایه {student.grade} · کلاس {student.className}
            </p>
          ) : null}
        </div>
        <SignOutButton className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted" label="خروج از حساب" />
      </header>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <BookOpen className="size-5 text-rose-deep" aria-hidden /> دوره‌های من
        </h2>
        {courses.length === 0 ? (
          <div className="mt-4"><EmptyState title="در دوره‌ای ثبت‌نام نکرده‌اید" hint="از صفحه دوره‌ها می‌توانید ثبت‌نام کنید." /></div>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {courses.map(({ reg, course }) => (
              <li key={reg.id} className="card-quiet p-5">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/courses/${course.slug}`} className="font-semibold hover:text-ink-soft">{course.title}</Link>
                  <span className="rounded-full bg-rose-tint px-2.5 py-0.5 text-xs font-medium text-rose-deep">
                    {REG_STATUS[reg.status] ?? reg.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {course.schedule ? `زمان: ${course.schedule}` : ""}{course.instructor ? ` · مدرس: ${course.instructor}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <CalendarX className="size-5 text-rose-deep" aria-hidden /> امتحانات پیشِ رو
        </h2>
        {exams.length === 0 ? (
          <div className="mt-4"><EmptyState title="امتحانی برای پایه شما ثبت نشده است" /></div>
        ) : (
          <ul className="mt-4 space-y-3">
            {exams.map((e) => (
              <li key={e.id} className="card-quiet flex flex-wrap items-center justify-between gap-2 p-4">
                <div>
                  <p className="font-medium">{e.subject} — {e.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {[e.date, e.time, e.location].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">پایه {e.grade}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        <Link href="/schedule" className="card-quiet p-5 hover:border-ink-soft/40">
          <UserRound className="size-5 text-ink-soft" aria-hidden />
          <p className="mt-3 font-medium">برنامه هفتگی</p>
        </Link>
        <Link href="/announcements" className="card-quiet p-5 hover:border-ink-soft/40">
          <UserRound className="size-5 text-ink-soft" aria-hidden />
          <p className="mt-3 font-medium">اطلاعیه‌ها</p>
        </Link>
        <Link href="/news" className="card-quiet p-5 hover:border-ink-soft/40">
          <UserRound className="size-5 text-ink-soft" aria-hidden />
          <p className="mt-3 font-medium">اخبار مدرسه</p>
        </Link>
      </section>
    </div>
  );
}
