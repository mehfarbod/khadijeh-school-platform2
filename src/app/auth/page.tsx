import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "ورود" };

export default function AuthPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">خ</span>
          <h1 className="mt-4 text-xl font-bold">پورتال دانش‌آموزی و اولیا</h1>
          <p className="mt-2 text-sm text-muted-foreground">دبیرستان دخترانه شاهد حضرت خدیجه (ص)</p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
