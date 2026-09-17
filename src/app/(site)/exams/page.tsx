import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "@/lib/server-convex";
import { PageHeader, EmptyState } from "@/components/site/primitives";

export const metadata: Metadata = { title: "امتحانات" };
export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const exams = await getConvexServerClient().query(api.public2.listExams, {});

  return (
    <>
      <PageHeader title="تقویم امتحانات" subtitle="زمان‌بندی امتحانات نوبت دوم سال تحصیلی جاری." />
      <section className="container-page py-12">
        {exams.length === 0 ? (
          <EmptyState title="هنوز امتحانی ثبت نشده است" />
        ) : (
          <div className="card-quiet overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b bg-cream text-right">
                  <th className="px-5 py-3 font-semibold">درس</th>
                  <th className="px-5 py-3 font-semibold">پایه</th>
                  <th className="px-5 py-3 font-semibold">تاریخ</th>
                  <th className="px-5 py-3 font-semibold">ساعت</th>
                  <th className="px-5 py-3 font-semibold">محل</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e, i) => (
                  <tr key={e._id} className={i % 2 ? "bg-muted/40" : ""}>
                    <td className="px-5 py-3.5 font-medium">{e.subject}</td>
                    <td className="px-5 py-3.5">{e.grade}</td>
                    <td className="px-5 py-3.5">{e.date}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{e.time ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{e.location ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-6 text-sm leading-7 text-muted-foreground">
          یادآوری: به‌همراه داشتن کارت ورود به جلسه الزامی است؛ تلفن همراه در جلسه امتحان ممنوع است.
        </p>
      </section>
    </>
  );
}
