import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "@/lib/server-convex";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getConvexServerClient().query(api.public.getNewsBySlug, { slug });
  return { title: item?.title ?? "خبر", description: item?.summary };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getConvexServerClient().query(api.public.getNewsBySlug, { slug });
  if (!item) notFound();

  return (
    <article className="container-page max-w-3xl py-10">
      <nav aria-label="مسیر" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">خانه</Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <Link href="/news" className="hover:text-foreground">اخبار</Link>
      </nav>
      <p className="text-sm text-muted-foreground">{item.date}</p>
      <h1 className="mt-3 text-3xl font-bold leading-relaxed tracking-tight">{item.title}</h1>
      {item.summary ? <p className="mt-4 text-lg leading-8 text-ink-soft">{item.summary}</p> : null}
      <div className="mt-8 whitespace-pre-line leading-8 text-foreground/90">{item.body}</div>
    </article>
  );
}
