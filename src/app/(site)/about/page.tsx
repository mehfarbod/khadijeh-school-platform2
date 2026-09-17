import type { Metadata } from "next";
import { PageHeader } from "@/components/site/primitives";

export const metadata: Metadata = { title: "درباره ما" };

const VALUES = [
  { title: "تعهد به یادگیری", desc: "دانش‌آموزان را به پرسشگری، تلاش مستمر و یادگیری مادام‌العمر تشویق می‌کنیم." },
  { title: "تربیت قرآنی", desc: "پرورش اخلاقی و معنوی در کنار آموزش علمی، ستون کارنامه ماست." },
  { title: "احترام و امنیت", desc: "فضایی امن و محترمانه برای رشد شخصیت هر دانش‌آموز فراهم است." },
  { title: "همکاری با خانواده", desc: "ارتباط مستمر با اولیا، بخشی از برنامه تربیتی مدرسه است." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="درباره دبیرستان"
        subtitle="دبیرستان دخترانه شاهد حضرت خدیجه (ص) با هدف تربیت دانش‌آموزانی معنوی، پرسشگر و توانمند در دو دوره اول و دوم متوسطه فعالیت می‌کند."
      />
      <section className="container-page py-12">
        <div className="max-w-3xl space-y-5 leading-8 text-ink-soft">
          <p>
            مدرسه ما با اتکا به بیش از دو دهه تجربه آموزشی، محیطی آرام و هدفمند برای دختران فراهم
            کرده است؛ جایی که آموزش علمی با تربیت اخلاقی و برنامه‌های فرهنگی و قرآنی در هم تنیده است.
          </p>
          <p>
            کادر آموزشی مجرب، آزمایشگاه‌های مجهز، کارگاه‌های مهارتی و پورتال اطلاع‌رسانی به خانواده‌ها،
            از جمله امکانات مدرسه است. نتایج کنکور، المپیادها و جشنواره‌های علمی، گواه تلاش
            دانش‌آموزان و دبیران ماست.
          </p>
        </div>

        <h2 className="mt-14 text-2xl font-bold tracking-tight">ارزش‌های ما</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <article key={v.title} className="card-quiet p-6">
              <h3 className="font-bold">{v.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{v.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
