import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "@/lib/server-convex";
import { PageHeader } from "@/components/site/primitives";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = { title: "تماس با ما" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getConvexServerClient().query(api.public.getSettings, {});

  return (
    <>
      <PageHeader title="تماس با ما" subtitle="برای ثبت‌نام، پرسش یا پیام، از راه‌های زیر با ما در ارتباط باشید." />
      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="card-quiet h-fit p-6">
          <h2 className="font-bold">اطلاعات تماس</h2>
          <dl className="mt-4 space-y-4 text-sm leading-7">
            <div>
              <dt className="text-muted-foreground">نشانی</dt>
              <dd className="mt-0.5">{settings.address ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">تلفن</dt>
              <dd className="mt-0.5" dir="ltr">{settings.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">رایانامه</dt>
              <dd className="mt-0.5" dir="ltr">{settings.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">ساعات پاسخگویی</dt>
              <dd className="mt-0.5">شنبه تا چهارشنبه، ۷ تا ۱۴</dd>
            </div>
          </dl>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
