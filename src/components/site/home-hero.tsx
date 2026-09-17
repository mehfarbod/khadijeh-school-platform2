import Link from "next/link";
import { BookOpen, CalendarCheck, GraduationCap, Users } from "lucide-react";

const STATS = [
  { icon: Users, value: "۴۸۰+", label: "دانش‌آموز" },
  { icon: GraduationCap, value: "۳۲", label: "دبیر و مربی" },
  { icon: BookOpen, value: "۱۸", label: "رشته و کارگاه" },
  { icon: CalendarCheck, value: "۲۵", label: "سال سابقه" },
];

export function HomeHero() {
  return (
    <section className="border-b bg-cream">
      <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-rose-deep">دبیرستان دخترانه شاهد حضرت خدیجه (ص)</p>
          <h1 className="mt-4 text-balance-fa text-4xl font-bold leading-[1.25] tracking-tight sm:text-5xl">
            مدرسه‌ای برای رشد علمی، تربیتی و اخلاقی دختران
          </h1>
          <p className="mt-5 max-w-xl text-pretty leading-8 text-muted-foreground">
            در دبیرستان شاهد حضرت خدیجه (ص)، آموزش با تربیت قرآنی همراه است؛ فضایی آرام و هدفمند
            برای پرسشگری، تلاش علمی و ساختن آینده‌ای روشن.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring"
            >
              مشاهده دوره‌ها و ثبت‌نام
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              ورود به پورتال دانش‌آموزی
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5 bg-background px-4 py-7 text-center">
              <s.icon className="size-5 text-rose-deep" aria-hidden />
              <dd className="text-2xl font-bold">{s.value}</dd>
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
