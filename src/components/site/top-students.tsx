"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useCallback } from "react";
import { EmptyState } from "./primitives";
import { excerpt } from "@/lib/format";

type TopStudent = {
  _id: string;
  fullName: string;
  grade: string;
  className?: string;
  achievement: string;
  photoUrl?: string;
};

export function TopStudents({ students }: { students: TopStudent[] }) {
  const [ref, api] = useEmblaCarousel({ align: "start", loop: false, direction: "rtl" });

  const prev = useCallback(() => api?.scrollPrev(), [api]);
  const next = useCallback(() => api?.scrollNext(), [api]);

  return (
    <section className="container-page py-12 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">دانش‌آموزان برتر</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">ستاره‌های امسال مدرسه؛ افتخارآفرینان علمی و فرهنگی.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={prev} aria-label="اسلاید قبلی" className="flex size-9 items-center justify-center rounded-full border transition-colors hover:bg-muted disabled:opacity-40">
            <ChevronRight className="size-4" />
          </button>
          <button type="button" onClick={next} aria-label="اسلاید بعدی" className="flex size-9 items-center justify-center rounded-full border transition-colors hover:bg-muted disabled:opacity-40">
            <ChevronLeft className="size-4" />
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <EmptyState title="فهرست دانش‌آموزان برتر به‌زودی منتشر می‌شود" />
      ) : (
        <div ref={ref} className="overflow-hidden" role="region" aria-roledescription="carousel" aria-label="دانش‌آموزان برتر">
          <div className="-ml-4 flex">
            {students.map((s) => (
              <div key={s._id} className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3">
                <article className="card-quiet flex h-full flex-col p-6">
                  <Award className="size-5 text-gold-deep" aria-hidden />
                  <h3 className="mt-4 font-bold">{s.fullName}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    پایه {s.grade}{s.className ? `، کلاس ${s.className}` : ""}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{excerpt(s.achievement, 90)}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
