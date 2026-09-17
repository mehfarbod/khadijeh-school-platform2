"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "خانه" },
  { href: "/about", label: "درباره ما" },
  { href: "/courses", label: "دوره‌ها" },
  { href: "/news", label: "اخبار" },
  { href: "/reports", label: "گزارش‌ها" },
  { href: "/events", label: "رویدادها" },
  { href: "/schedule", label: "برنامه هفتگی" },
  { href: "/exams", label: "امتحانات" },
  { href: "/gallery", label: "گالری" },
  { href: "/contact", label: "تماس" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-ring" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">خ</span>
          <span className="hidden text-sm font-bold leading-5 sm:block">
            دبیرستان شاهد حضرت خدیجه (ص)
          </span>
        </Link>

        <nav aria-label="ناوبری اصلی" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                pathname === item.href ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/portal"
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring sm:inline-flex"
          >
            پورتال دانش‌آموزی
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md border lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="باز و بسته کردن منو"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="ناوبری موبایل" className="border-t bg-background lg:hidden">
          <div className="container-page grid gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm hover:bg-muted",
                  pathname === item.href ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/portal" onClick={() => setOpen(false)} className="mt-1 rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">
              پورتال دانش‌آموزی
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
