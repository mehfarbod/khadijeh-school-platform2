import type { Metadata } from "next";
import { listEvents } from "@/lib/queries";
import { PageHeader, EmptyState } from "@/components/site/primitives";

export const metadata: Metadata = { title: "رویدادها" };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await listEvents(50);

  return (
    <>
      <PageHeader title="رویدادها" subtitle="برنامه‌ها، مراسم و رویدادهای ورزشی و فرهنگی مدرسه." />
      <section className="container-page py-12">
        {events.length === 0 ? (
          <EmptyState title="هنوز رویدادی ثبت نشده است" />
        ) : (
          <ol className="relative space-y-6 border-r pr-6">
            {events.map((e) => (
              <li key={e.id} className="card-quiet p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-bold leading-7">{e.title}</h2>
                  {e.category ? <span className="rounded-full bg-rose-tint px-2.5 py-0.5 text-xs font-medium text-rose-deep">{e.category}</span> : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {[e.date, e.time, e.location].filter(Boolean).join(" · ")}
                </p>
                {e.description ? <p className="mt-3 text-sm leading-7 text-ink-soft">{e.description}</p> : null}
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
