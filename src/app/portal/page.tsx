"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, CalendarX, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner, EmptyState } from "@/components/site/primitives";

const REG_STATUS: Record<string, string> = {
  pending: "در انتظار تأیید",
  approved: "تأیید شده",
  rejected: "رد شده",
  cancelled: "لغو شده",
};

export default function PortalPage() {
  const { user, student, signOut, isLoading } = useAuth();
  const myCourses = useQuery(api.portal.myCourses, {});
  const myExams = useQuery(api.portal.myExams, {});

  if (isLoading) return <Spinner />;

  return (
    <div className="container-page max-w-5xl py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">پورتال دانش‌آموزی و اولیا</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {student?.fullName ?? user?.name ?? "خوش آمدید"}
          </h1>
          {student ? (
            <p className="mt-1 text-sm text-muted-foreground">
              پایه {student.grade} · کلاس {student.className}
            </p>
          ) : null}
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          <LogOut className="size-4" aria-hidden /> خروج از حساب
        </Button>
      </header>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <BookOpen className="size-5 text-rose-deep" aria-hidden /> دوره‌های من
        </h2>
        {myCourses === undefined ? <Spinner /> : myCourses.length === 0 ? (
          <div className="mt-4"><EmptyState title="در دوره‌ای ثبت‌نام نکرده‌اید" hint="از صفحه دوره‌ها می‌توانید ثبت‌نام کنید." /></div>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {myCourses.map(({ reg, course }) => (
              <li key={reg._id} className="card-quiet p-5">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/courses/${course.slug}`} className="font-semibold hover:text-ink-soft">{course.title}</Link>
                  <span className="rounded-full bg-rose-tint px-2.5 py-0.5 text-xs font-medium text-rose-deep">
                    {REG_STATUS[reg.status ?? "pending"]}
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
        {myExams === undefined ? <Spinner /> : myExams.length === 0 ? (
          <div className="mt-4"><EmptyState title="امتحانی برای پایه شما ثبت نشده است" /></div>
        ) : (
          <ul className="mt-4 space-y-3">
            {myExams.map((e) => (
              <li key={e._id} className="card-quiet flex flex-wrap items-center justify-between gap-2 p-4">
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
