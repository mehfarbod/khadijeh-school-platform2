import type { Metadata } from "next";
import { listSchedule, SCHEDULE_DAYS } from "@/lib/queries";
import { PageHeader, EmptyState } from "@/components/site/primitives";

export const metadata: Metadata = { title: "برنامه هفتگی" };
export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const rows = await listSchedule();
  const byDay = SCHEDULE_DAYS.map((d) => ({ day: d, items: rows.filter((r) => r.day === d) })).filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader title="برنامه هفتگی" subtitle="برنامه کلاس‌های پایه دهم، کلاس ۱." />
      <section className="container-page py-12">
        {byDay.length === 0 ? (
          <EmptyState title="برنامه هفتگی هنوز منتشر نشده است" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {byDay.map((g) => (
              <section key={g.day} className="card-quiet overflow-hidden">
                <h2 className="border-b bg-cream px-5 py-3 font-bold">{g.day}</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {g.items.map((it, i) => (
                      <tr key={it.id} className={i % 2 ? "bg-muted/40" : ""}>
                        <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{it.time}</td>
                        <td className="px-2 py-3 font-medium">{it.subject}</td>
                        <td className="px-2 py-3 text-muted-foreground">{it.teacher}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
