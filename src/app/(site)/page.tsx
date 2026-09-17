import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "@/lib/server-convex";
import { HomeHero } from "@/components/site/home-hero";
import { QuickAccess } from "@/components/site/quick-access";
import { TopStudents } from "@/components/site/top-students";
import { Birthdays } from "@/components/site/birthdays";
import { PreviewSection, QuietCard } from "@/components/site/preview-section";
import { FaqList } from "@/components/site/faq-list";
import { ContactForm } from "@/components/site/contact-form";
import { excerpt } from "@/lib/format";
import { SectionHeading } from "@/components/site/primitives";

export const dynamic = "force-dynamic";

type TopStudent = { _id: string; fullName: string; grade: string; className?: string; achievement: string; photoUrl?: string };
type Achievement = { _id: string; title: string; level?: string; person?: string; year?: string; description?: string };
type Staff = { _id: string; fullName: string; role: string; subject?: string };
type Album = { _id: string; title: string; description?: string };
type Exam = { _id: string; title: string; subject: string; grade: string; date: string; time?: string };
type Faq = { _id: string; question: string; answer: string };

export default async function HomePage() {
  const c = getConvexServerClient();
  const [tops, bdays, news, reports, events, achievements, staff, albums, exams, faq] =
    await Promise.all([
      c.query(api.public.listTopStudents, { limit: 6 }),
      c.query(api.public.listBirthdays, { limit: 8 }),
      c.query(api.public.listNews, { limit: 3 }),
      c.query(api.public.listReports, { limit: 3 }),
      c.query(api.public.listEvents, { limit: 3 }),
      c.query(api.public.listAchievements, { limit: 4 }),
      c.query(api.public2.listStaff, {}),
      c.query(api.public2.listAlbums, {}),
      c.query(api.public2.listExams, {}),
      c.query(api.public2.listFaq, {}),
    ]);

  return (
    <>
      <HomeHero />
      <QuickAccess />
      <TopStudents students={tops} />
      <Birthdays items={bdays} />
      <PreviewSection
        title="گزارش‌های مدرسه"
        subtitle="شرح عملکردها و فعالیت‌های اخیر مدرسه."
        href="/reports"
        items={reports.map((r) => ({ id: r._id, title: r.title, meta: r.date, desc: excerpt(r.summary), href: `/reports/${r.slug}` }))}
        renderItem={(i) => <QuietCard item={i} />}
      />
      <PreviewSection
        bg
        title="رویدادهای پیشِ رو"
        subtitle="تقویم برنامه‌ها و مراسم‌های مدرسه."
        href="/events"
        items={events.map((e) => ({ id: e._id, title: e.title, meta: [e.date, e.time, e.location].filter(Boolean).join(" · "), desc: excerpt(e.description) }))}
        renderItem={(i) => <QuietCard item={i} />}
      />
      <PreviewSection
        title="آخرین اخبار"
        subtitle="رویدادها و اطلاعیه‌های تازه مدرسه."
        href="/news"
        items={news.map((n) => ({ id: n._id, title: n.title, meta: n.date, desc: excerpt(n.summary), href: `/news/${n.slug}` }))}
        renderItem={(i) => <QuietCard item={i} />}
      />
      <HomeTail achievements={achievements} staff={staff} albums={albums} exams={exams} faq={faq} />
    </>
  );
}

function HomeTail({ achievements, staff, albums, exams, faq }: {
  achievements: Achievement[];
  staff: Staff[];
  albums: Album[];
  exams: Exam[];
  faq: Faq[];
}) {
  return (
    <>
      <PreviewSection
        bg
        title="افتخارات"
        subtitle="موفقیت‌های دانش‌آموزان و مدرسه."
        href="/achievements"
        items={achievements.map((a) => ({ id: a._id, title: a.title, meta: [a.person, a.year].filter(Boolean).join(" · "), desc: excerpt(a.description) }))}
        renderItem={(i) => <QuietCard item={i} />}
      />
      <PreviewSection
        title="کادر آموزشی"
        subtitle="دبیران و مربیان دبیرستان."
        href="/teachers"
        items={staff.slice(0, 3).map((s) => ({ id: s._id, title: s.fullName, meta: s.subject, desc: s.role }))}
        renderItem={(i) => <QuietCard item={i} />}
      />
      <PreviewSection
        bg
        title="گالری تصاویر"
        subtitle="آلبوم‌های تصویری مدرسه."
        href="/gallery"
        items={albums.slice(0, 3).map((a) => ({ id: a._id, title: a.title, desc: a.description }))}
        renderItem={(i) => <QuietCard item={i} />}
      />
      <PreviewSection
        title="امتحانات پیشِ رو"
        subtitle="تقویم امتحانات نوبت دوم."
        href="/exams"
        items={exams.slice(0, 3).map((e) => ({ id: e._id, title: e.title, meta: [e.date, e.time].filter(Boolean).join(" · "), desc: e.grade }))}
        renderItem={(i) => <QuietCard item={i} />}
      />
      <section className="container-page py-12 sm:py-14">
        <SectionHeading title="پرسش‌های پرتکرار" subtitle="پاسخ پرسش‌های رایج اولیا و دانش‌آموزان." />
        <FaqList items={faq.slice(0, 4)} />
      </section>
      <section className="border-t bg-cream">
        <div className="container-page grid gap-8 py-12 sm:py-14 lg:grid-cols-2">
          <div>
            <SectionHeading title="تماس با ما" subtitle="پرسش یا پیام خود را برای ما ارسال کنید؛ در اولین فرصت پاسخ می‌دهیم." />
            <ContactInfo />
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

function ContactInfo() {
  return (
    <div className="card-quiet p-6 text-sm leading-7">
      <p className="font-semibold">دبیرستان دخترانه شاهد حضرت خدیجه (ص)</p>
      <p className="mt-2 text-muted-foreground">تهران، منطقه ۵، بلوار شهید خدیجه، پلاک ۱۲</p>
      <p className="text-muted-foreground" dir="ltr">۰۲۱-۸۸۷۷۶۶۵۵</p>
      <p className="text-muted-foreground" dir="ltr">info@khadijeh-school.ir</p>
    </div>
  );
}
