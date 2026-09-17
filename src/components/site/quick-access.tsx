import Link from "next/link";
import {
  BookOpen, CalendarDays, ClipboardCheck, Contact, FileBarChart2,
  GraduationCap, Megaphone, Newspaper, Timer,
} from "lucide-react";

const ITEMS = [
  { href: "/courses", label: "دوره‌ها", icon: BookOpen },
  { href: "/contact", label: "ثبت‌نام و تماس", icon: Contact },
  { href: "/announcements", label: "اطلاعیه‌ها", icon: Megaphone },
  { href: "/events", label: "رویدادها", icon: CalendarDays },
  { href: "/news", label: "اخبار", icon: Newspaper },
  { href: "/reports", label: "گزارش‌ها", icon: FileBarChart2 },
  { href: "/exams", label: "امتحانات", icon: ClipboardCheck },
  { href: "/schedule", label: "برنامه هفتگی", icon: Timer },
  { href: "/teachers", label: "کادر آموزشی", icon: GraduationCap },
];

export function QuickAccess() {
  return (
    <section className="container-page py-12">
      <h2 className="sr-only">دسترسی سریع</h2>
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-5 lg:grid-cols-9">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col items-center gap-2 bg-background px-2 py-6 text-center transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          >
            <item.icon className="size-5 text-ink-soft transition-colors group-hover:text-rose-deep" aria-hidden />
            <span className="text-xs font-medium leading-5">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
