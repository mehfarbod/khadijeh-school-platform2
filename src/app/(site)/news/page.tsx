import type { Metadata } from "next";
import Link from "next/link";
import { listNews } from "@/lib/queries";
import { PageHeader, EmptyState } from "@/components/site/primitives";
import { excerpt } from "@/lib/format";

export const metadata: Metadata = { title: "اخبار و اطلاعیه‌ها" };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await listNews(50);

  return (
    <>
      <PageHeader title="اخبار" subtitle="رویدادها و اعلامیه‌های تازه دبیرستان." />
      <section className="container-page py-12">
        {news.length === 0 ? (
          <EmptyState title="هنوز خبری منتشر نشده است" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`} className="card-quiet group p-6">
                <p className="text-xs text-muted-foreground">{n.date}</p>
                <h2 className="mt-2 font-bold leading-7 group-hover:text-ink-soft">{n.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{excerpt(n.summary ?? n.body)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
