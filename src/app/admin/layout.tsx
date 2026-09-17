import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";
import { ENTITIES } from "@/lib/admin-entities";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "پنل مدیریت" };

const STATIC_LINKS = [
  { href: "/admin", label: "نمای کلی" },
  { href: "/admin/users", label: "کاربران" },
  { href: "/admin/contact-messages", label: "پیام‌های تماس" },
  { href: "/admin/settings", label: "تنظیمات مدرسه" },
];

function SidebarLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring",
        active ? "bg-background font-semibold text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l bg-cream lg:flex">
        <div className="border-b px-5 py-5">
          <p className="text-sm font-bold">پنل مدیریت</p>
          <p className="mt-0.5 text-xs text-muted-foreground">دبیرستان شاهد حضرت خدیجه (ص)</p>
        </div>
        <nav aria-label="ناوبری مدیریت" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {STATIC_LINKS.map((l) => (
            <SidebarLink key={l.href} href={l.href} active={l.href === "/admin"}>
              {l.label}
            </SidebarLink>
          ))}
          <p className="px-3 pb-1 pt-4 text-[11px] font-medium text-muted-foreground">مدیریت محتوا</p>
          {ENTITIES.filter((e) => e.slug !== "contact-messages").map((e) => (
            <SidebarLink key={e.slug} href={`/admin/${e.slug}`} active={false}>
              {e.title}
            </SidebarLink>
          ))}
        </nav>
        <div className="border-t px-5 py-4">
          <p className="truncate text-xs font-medium">{user.name ?? user.email}</p>
          <SignOutButton className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive" label="خروج" />
        </div>
      </aside>
      <div className="flex-1">
        <div className="border-b bg-background lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-bold">پنل مدیریت</p>
            <SignOutButton className="text-xs text-muted-foreground" label="خروج" />
          </div>
          <nav aria-label="ناوبری مدیریت موبایل" className="flex gap-1 overflow-x-auto px-4 pb-3">
            {STATIC_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-md bg-muted px-3 py-1.5 text-xs">
                {l.label}
              </Link>
            ))}
            {ENTITIES.filter((e) => e.slug !== "contact-messages").map((e) => (
              <Link key={e.slug} href={`/admin/${e.slug}`} className="whitespace-nowrap rounded-md bg-muted px-3 py-1.5 text-xs">
                {e.title}
              </Link>
            ))}
          </nav>
        </div>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
