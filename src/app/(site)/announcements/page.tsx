import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "@/lib/server-convex";
import { PageHeader, EmptyState } from "@/components/site/primitives";

export const metadata: Metadata = { title: "اطلاعیه‌ها" };
export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const items = await getConvexServerClient().query(api.public.listAnnouncements, { limit: 50 });

  return (
    <>
      <PageHeader title="اطلاعیه‌ها" subtitle="اطلاعیه‌های اداری و آموزشی برای دانش‌آموزان و اولیا." />
      <section className="container-page py-12">
        {items.length === 0 ? (
          <EmptyState title="هنوز اطلاعیه‌ای ثبت نشده است" />
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <article key={a._id} className="card-quiet flex gap-4 p-6">
                <Megaphone className={`mt-1 size-5 shrink-0 ${a.important ? "text-rose-deep" : "text-muted-foreground"}`} aria-hidden />
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h2 className="font-bold leading-7">{a.title}</h2>
                    {a.important ? <span className="rounded-full bg-rose-tint px-2 py-0.5 text-xs font-medium text-rose-deep">مهم</span> : null}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{a.body}</p>
                  {a.date ? <p className="mt-2 text-xs text-muted-foreground">{a.date}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
