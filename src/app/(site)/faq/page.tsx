import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "@/lib/server-convex";
import { PageHeader, EmptyState } from "@/components/site/primitives";
import { FaqList } from "@/components/site/faq-list";

export const metadata: Metadata = { title: "پرسش‌های پرتکرار" };
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faq = await getConvexServerClient().query(api.public2.listFaq, {});

  return (
    <>
      <PageHeader title="پرسش‌های پرتکرار" subtitle="پاسخ پرسش‌های رایج اولیا و دانش‌آموزان." />
      <section className="container-page max-w-3xl py-12">
        {faq.length === 0 ? (
          <EmptyState title="هنوز پرسشی ثبت نشده است" />
        ) : (
          <FaqList items={faq} />
        )}
      </section>
    </>
  );
}
