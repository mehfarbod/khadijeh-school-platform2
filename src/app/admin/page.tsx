"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/site/primitives";

const CARDS: { key: string; label: string; href: string }[] = [
  { key: "students", label: "دانش‌آموزان", href: "/admin/students" },
  { key: "staff", label: "کادر آموزشی", href: "/admin/staff" },
  { key: "courses", label: "دوره‌ها", href: "/admin/courses" },
  { key: "news", label: "اخبار", href: "/admin/news" },
  { key: "reports", label: "گزارش‌ها", href: "/admin/reports" },
  { key: "events", label: "رویدادها", href: "/admin/events" },
  { key: "announcements", label: "اطلاعیه‌ها", href: "/admin/announcements" },
  { key: "achievements", label: "افتخارات", href: "/admin/achievements" },
  { key: "exams", label: "امتحانات", href: "/admin/exams" },
  { key: "galleryAlbums", label: "آلبوم‌ها", href: "/admin/gallery-albums" },
];

export default function AdminOverviewPage() {
  const stats = useQuery(api.admin.adminStats, {});

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">نمای کلی</h1>
      <p className="mt-1 text-sm text-muted-foreground">خلاصه محتوای مدرسه در یک نگاه.</p>
      {stats === undefined ? (
        <Spinner />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CARDS.map((c) => (
            <Link key={c.key} href={c.href} className="card-quiet p-5 hover:border-ink-soft/40">
              <p className="text-3xl font-bold">{stats[c.key] ?? 0}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
            </Link>
          ))}
        </div>
      )}
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
