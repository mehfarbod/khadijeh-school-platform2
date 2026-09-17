import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCourseBySlug } from "@/lib/queries";
import { CourseRegisterForm } from "@/components/site/course-register-form";
import { toFa } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course?.title ?? "دوره" };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <div className="container-page py-10">
      <nav aria-label="مسیر" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">خانه</Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <Link href="/courses" className="hover:text-foreground">دوره‌ها</Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="text-foreground">{course.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="rounded-full bg-rose-tint px-2.5 py-0.5 text-xs font-medium text-rose-deep">{course.category}</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="mt-5 leading-8 text-ink-soft">{course.description}</p>
          <dl className="mt-8 grid gap-x-8 gap-y-3 border-t pt-6 text-sm sm:grid-cols-2">
            {course.instructor ? <div><dt className="text-muted-foreground">مدرس</dt><dd className="mt-0.5 font-medium">{course.instructor}</dd></div> : null}
            {course.duration ? <div><dt className="text-muted-foreground">مدت دوره</dt><dd className="mt-0.5 font-medium">{course.duration}</dd></div> : null}
            {course.capacity ? <div><dt className="text-muted-foreground">ظرفیت</dt><dd className="mt-0.5 font-medium">{toFa(course.capacity)} نفر</dd></div> : null}
            {course.schedule ? <div><dt className="text-muted-foreground">برنامج کلاس‌ها</dt><dd className="mt-0.5 font-medium">{course.schedule}</dd></div> : null}
            {course.fee ? <div><dt className="text-muted-foreground">شهریه</dt><dd className="mt-0.5 font-medium">{toFa(course.fee.toLocaleString("en-US"))} تومان</dd></div> : null}
          </dl>
        </div>
        <aside>
          <CourseRegisterForm courseId={course.id} status={course.status} />
        </aside>
      </div>
    </div>
  );
}
