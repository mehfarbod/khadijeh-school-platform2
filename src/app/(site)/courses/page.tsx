import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "@/lib/server-convex";
import { PageHeader, EmptyState } from "@/components/site/primitives";
import { excerpt, toFa } from "@/lib/format";

export const metadata: Metadata = { title: "دوره‌های آموزشی" };
export const dynamic = "force-dynamic";

const STATUS_FA: Record<string, string> = {
  open: "در حال ثبت‌نام",
  closed: "ثبت‌نام بسته",
  full: "تکمیل ظرفیت",
};

export default async function CoursesPage() {
  const courses = await getConvexServerClient().query(api.public2.listCourses, {});

  return (
    <>
      <PageHeader
        title="دوره‌های آموزشی"
        subtitle="کارگاه‌ها و کلاس‌های تقویتی مدرسه؛ برای ثبت‌نام وارد جزئیات دوره شوید."
      />
      <section className="container-page py-12">
        {courses.length === 0 ? (
          <EmptyState title="هنوز دوره‌ای ثبت نشده است" hint="دوره‌های جدید ترم آینده اعلام خواهد شد." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Link key={c._id} href={`/courses/${c.slug}`} className="card-quiet group overflow-hidden">
                {c.imageUrl ? (
                  <div className="relative aspect-[16/9]">
                    <Image src={c.imageUrl} alt={c.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                  </div>
                ) : null}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-rose-tint px-2.5 py-0.5 text-xs font-medium text-rose-deep">{c.category}</span>
                    <span className="text-xs text-muted-foreground">{STATUS_FA[c.status ?? ""] ?? "—"}</span>
                  </div>
                  <h2 className="mt-3 font-bold leading-7 group-hover:text-ink-soft">{c.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{excerpt(c.description)}</p>
                  <dl className="mt-4 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                    {c.instructor ? <div>مدرس: {c.instructor}</div> : null}
                    {c.duration ? <div>مدت: {c.duration}</div> : null}
                    {c.capacity ? <div>ظرفیت: {toFa(c.capacity)} نفر</div> : null}
                    {c.schedule ? <div>زمان: {c.schedule}</div> : null}
                  </dl>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
