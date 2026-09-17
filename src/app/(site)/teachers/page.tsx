import type { Metadata } from "next";
import { listStaff } from "@/lib/queries";
import { PageHeader, EmptyState } from "@/components/site/primitives";

export const metadata: Metadata = { title: "کادر آموزشی" };
export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const staff = await listStaff();

  return (
    <>
      <PageHeader title="کادر آموزشی" subtitle="دبیران، مربیان و مدیران دبیرستان شاهد حضرت خدیجه (ص)." />
      <section className="container-page py-12">
        {staff.length === 0 ? (
          <EmptyState title="هنوز اطلاعاتی ثبت نشده است" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((s) => (
              <article key={s.id} className="card-quiet p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-cream text-sm font-bold text-ink-soft">
                    {s.fullName.trim().charAt(0)}
                  </span>
                  <div>
                    <h2 className="font-bold leading-6">{s.fullName}</h2>
                    <p className="text-xs text-muted-foreground">{s.role}{s.subject ? ` · ${s.subject}` : ""}</p>
                  </div>
                </div>
                {s.bio ? <p className="mt-4 text-sm leading-7 text-muted-foreground">{s.bio}</p> : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
