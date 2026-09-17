import Link from "next/link";

const COLS = [
  {
    title: "دسترسی سریع",
    links: [
      { href: "/courses", label: "دوره‌های آموزشی" },
      { href: "/schedule", label: "برنامه هفتگی" },
      { href: "/exams", label: "تقویم امتحانات" },
      { href: "/faq", label: "پرسش‌های پرتکرار" },
    ],
  },
  {
    title: "مدرسه",
    links: [
      { href: "/about", label: "درباره مدرسه" },
      { href: "/teachers", label: "کادر آموزشی" },
      { href: "/achievements", label: "افتخارات" },
      { href: "/gallery", label: "گالری تصاویر" },
    ],
  },
  {
    title: "اطلاع‌رسانی",
    links: [
      { href: "/news", label: "اخبار" },
      { href: "/announcements", label: "اطلاعیه‌ها" },
      { href: "/reports", label: "گزارش‌ها" },
      { href: "/contact", label: "تماس با ما" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-cream">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">خ</span>
            <p className="text-sm font-bold leading-5">دبیرستان دخترانه<br />شاهد حضرت خدیجه (ص)</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            مدرسه‌ای برای رشد علمی، تربیتی و اخلاقی دختران؛ همراه با سامانه اطلاع‌رسانی به خانواده‌ها.
          </p>
        </div>
        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-bold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} دبیرستان دخترانه شاهد حضرت خدیجه (ص) — کلیه حقوق محفوظ است.</p>
          <Link href="/portal" className="hover:text-foreground">ورود دانش‌آموزان و اولیا</Link>
        </div>
      </div>
    </footer>
  );
}
