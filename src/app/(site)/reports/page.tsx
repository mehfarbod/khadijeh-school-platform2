import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "@/lib/server-convex";
import { PageHeader, EmptyState } from "@/components/site/primitives";
import { excerpt } from "@/lib/format";

export const metadata: Metadata = { title: "گزارش‌های مدرسه" };
export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await getConvexServerClient().query(api.public.listReports, { limit: 50 });

  return (
    <>
      <PageHeader title="گزارش‌ها" subtitle="گزارش عملکرد و فعالیت‌های دوره‌ای مدرسه." />
      <section className="container-page py-12">
        {reports.length === 0 ? (
          <EmptyState title="هنوز گزارشی منتشر نشده است" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) => (
              <Link key={r._id} href={`/reports/${r.slug}`} className="card-quiet group p-6">
                <p className="text-xs text-muted-foreground">{r.date}</p>
                <h2 className="mt-2 font-bold leading-7 group-hover:text-ink-soft">{r.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{excerpt(r.summary ?? r.body)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
