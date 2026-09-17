import type { Metadata } from "next";
import Link from "next/link";
import { listReports } from "@/lib/queries";
import { PageHeader, EmptyState } from "@/components/site/primitives";
import { excerpt } from "@/lib/format";

export const metadata: Metadata = { title: "گزارش‌ها" };
export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await listReports(50);

  return (
    <>
      <PageHeader title="گزارش‌ها" subtitle="گزارش عملکرد و فعالیت‌های آموزشی و پرورشی مدرسه." />
      <section className="container-page py-12">
        {reports.length === 0 ? (
          <EmptyState title="هنوز گزارشی منتشر نشده است" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) => (
              <Link key={r.id} href={`/reports/${r.slug}`} className="card-quiet group p-6">
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
