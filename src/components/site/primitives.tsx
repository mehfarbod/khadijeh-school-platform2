import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel = "مشاهده همه",
  light,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2
          className={cn(
            "text-2xl font-bold tracking-tight sm:text-3xl",
            light ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className={cn("mt-2 max-w-xl text-sm leading-6", light ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className={cn(
            "inline-flex items-center gap-1 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
            light ? "text-primary-foreground/90 hover:text-primary-foreground" : "text-ink-soft hover:text-foreground",
          )}
        >
          {linkLabel}
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b bg-cream">
      <div className="container-page py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{subtitle}</p> : null}
      </div>
    </header>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card-quiet flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {hint ? <p className="mt-2 max-w-sm text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Spinner({ label = "در حال بارگذاری…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <span
        className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
        aria-hidden
      />
      {label}
    </div>
  );
}
