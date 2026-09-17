import Link from "next/link";
import { EmptyState } from "./primitives";

export type PreviewItem = {
  id: string;
  title: string;
  meta?: string | null;
  desc?: string | null;
  href?: string;
};

export function PreviewSection({
  title,
  subtitle,
  href,
  items,
  renderItem,
  bg,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  items: PreviewItem[];
  renderItem: (item: PreviewItem) => React.ReactNode;
  bg?: boolean;
}) {
  return (
    <section className={bg ? "border-b bg-cream" : undefined}>
      <div className="container-page py-12 sm:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
            {subtitle ? <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{subtitle}</p> : null}
          </div>
          {href ? (
            <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-foreground">
              مشاهده همه
              <span aria-hidden>←</span>
            </Link>
          ) : null}
        </div>
        {items.length === 0 ? (
          <EmptyState title="هنوز موردی ثبت نشده است" hint="به‌زودی اطلاعات جدید در این بخش منتشر می‌شود." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((i) => renderItem(i))}</div>
        )}
      </div>
    </section>
  );
}

export function QuietCard({ item }: { item: PreviewItem }) {
  const inner = (
    <article className="card-quiet h-full p-5 hover:border-ink-soft/40">
      {item.meta ? <p className="text-xs text-muted-foreground">{item.meta}</p> : null}
      <h3 className="mt-1.5 font-semibold leading-7">{item.title}</h3>
      {item.desc ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p> : null}
    </article>
  );
  return item.href ? <Link href={item.href}>{inner}</Link> : inner;
}
