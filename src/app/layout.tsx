import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khadijeh-school.ir"),
  title: {
    default: "دبیرستان دخترانه شاهد حضرت خدیجه (ص)",
    template: "%s | دبیرستان شاهد حضرت خدیجه (ص)",
  },
  description:
    "وب‌سایت رسمی دبیرستان دخترانه شاهد حضرت خدیجه (ص): معرفی مدرسه، دوره‌ها و ثبت‌نام، اخبار و اطلاعیه‌ها، رویدادها، تقویم آموزشی، امتحانات و گالری تصاویر.",
  keywords: [
    "دبیرستان دخترانه",
    "شاهد حضرت خدیجه",
    "مدرسه دخترانه",
    "ثبت‌نام مدرسه",
    "سامانه دانش‌آموزی",
  ],
  openGraph: {
    title: "دبیرستان دخترانه شاهد حضرت خدیجه (ص)",
    description:
      "مدرسه‌ای برای رشد علمی، تربیتی و اخلاقی دختران؛ همراه با سامانه اطلاع‌رسانی به خانواده‌ها.",
    siteName: "دبیرستان دخترانه شاهد حضرت خدیجه (ص)",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
