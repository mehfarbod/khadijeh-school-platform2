import type { Metadata } from "next";
import { listTopStudents } from "@/lib/queries";
import { PageHeader, EmptyState } from "@/components/site/primitives";
import { toFa } from "@/lib/format";

export const metadata: Metadata = { title: "دانش‌آموزان" };
export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const tops = await listTopStudents(50);

  return (
    <>
      <PageHeader
        title="دانش‌آموزان برتر"
        subtitle="معرفی تلاشگران و افتخارآفرینان امسال دبیرستان."
      />
      <section className="container-page py-12">
        {tops.length === 0 ? (
          <EmptyState title="فهرست به‌زودی منتشر می‌شود" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tops.map((s, i) => (
              <article key={s.id} className="card-quiet p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-8 items-center justify-center rounded-full bg-cream text-sm font-bold text-ink-soft">
                    {toFa(i + 1)}
                  </span>
                  <span className="text-xs text-muted-foreground">پایه {s.grade}{s.className ? ` · کلاس ${s.className}` : ""}</span>
                </div>
                <h2 className="mt-4 font-bold">{s.fullName}</h2>
                <p className="mt-2 text-sm leading-7 text-ink-soft">{s.achievement}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
