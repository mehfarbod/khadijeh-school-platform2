import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { listAchievements } from "@/lib/queries";
import { PageHeader, EmptyState } from "@/components/site/primitives";

export const metadata: Metadata = { title: "افتخارات" };
export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const items = await listAchievements(50);

  return (
    <>
      <PageHeader title="افتخارات" subtitle="موفقیت‌های علمی، فرهنگی و ورزشی دانش‌آموزان و مدرسه." />
      <section className="container-page py-12">
        {items.length === 0 ? (
          <EmptyState title="هنوز افتخاری ثبت نشده است" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <article key={a.id} className="card-quiet p-6">
                <Trophy className="size-5 text-gold-deep" aria-hidden />
                <h2 className="mt-4 font-bold leading-7">{a.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{a.description}</p>
                <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                  {[a.person, a.year, a.level === "school" ? "مدرسه" : "دانش‌آموز"].filter(Boolean).join(" · ")}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
