import { Cake } from "lucide-react";
import { toFa } from "@/lib/format";

type Birthday = {
  _id: string;
  person: string;
  kind?: string;
  month: number;
  day: number;
  grade?: string;
};

const MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

export function Birthdays({ items }: { items: Birthday[] }) {
  if (items.length === 0) return null;
  return (
    <section className="border-y bg-rose-tint">
      <div className="container-page flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <Cake className="size-5 text-rose-deep" aria-hidden />
          <h2 className="text-lg font-bold">تولدهای پیشِ رو</h2>
        </div>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          {items.map((b) => (
            <li key={b._id} className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">{b.person}</span>
              <span aria-hidden>·</span>
              <span>
                {toFa(b.day)} {MONTHS[(b.month - 1 + 12) % 12]}
                {b.kind === "staff" ? " (کادر)" : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
