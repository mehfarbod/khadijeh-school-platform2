/**
 * Seed script — ports the Persian content from the former Convex seeds
 * (seedPeople.ts / seedContent.ts / seedContent2.ts) to PostgreSQL.
 *
 * Run: bunx prisma db seed
 * Admin bootstrap: set SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD before seeding.
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt as _scrypt } from "node:crypto";
import { promisify } from "node:util";

const db = new PrismaClient();
const scrypt = promisify(_scrypt) as (p: string, s: string, k: number) => Promise<Buffer>;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

async function main() {
  // Idempotent: skip if content already seeded.
  const existing = await db.schoolSetting.findFirst();
  if (existing) {
    console.log("Seed skipped: school settings already present.");
    return;
  }

  // --- Staff -----------------------------------------------------------------
  const staff = [
    { fullName: "فاطمه موسوی", role: "مدیر مدرسه", subject: "علوم تربیتی", order: 1 },
    { fullName: "زهرا احمدی", role: "معاون آموزشی", subject: "ریاضیات", order: 2 },
    { fullName: "مریم رضایی", role: "معلم", subject: "ادبیات فارسی", order: 3 },
    { fullName: "نرگس کاظمی", role: "معلم", subject: "زیست‌شناسی", order: 4 },
    { fullName: "سمیه حسینی", role: "مشاور تحصیلی", subject: "مشاوره", order: 5 },
  ];
  for (const s of staff) {
    await db.staff.create({ data: { ...s, bio: "عضو کادر آموزشی دبیرستان شاهد حضرت خدیجه (ص)." } });
  }

  // --- Top students ------------------------------------------------------------
  const tops = [
    { fullName: "فاطمه کریمی", grade: "دهم", className: "۱", achievement: "رتبه دوم المپیاد زیست‌شناسی کشوری", order: 1 },
    { fullName: "زینب مرادی", grade: "یازدهم", className: "۲", achievement: "نفر اول کشوری رشته ریاضی", order: 2 },
    { fullName: "معصومه نیک‌نام", grade: "دوازدهم", className: "۱", achievement: "قبولی رتبه برتر کنکور تجربی", order: 3 },
    { fullName: "سکینه عباسی", grade: "دهم", className: "۳", achievement: "مدال طلای مسابقات قرآن و عترت", order: 4 },
    { fullName: "رویا صادقی", grade: "یازدهم", className: "۱", achievement: "رتبه نخست جشنواره خوارزمی منطقه", order: 5 },
  ];
  for (const t of tops) await db.topStudent.create({ data: t });

  // --- Birthdays ---------------------------------------------------------------
  const bdays = [
    { person: "فاطمه کریمی", kind: "student", month: 9, day: 12, grade: "دهم" },
    { person: "زینب مرادی", kind: "student", month: 10, day: 3, grade: "یازدهم" },
    { person: "مریم رضایی", kind: "staff", month: 11, day: 21 },
    { person: "سکینه عباسی", kind: "student", month: 12, day: 7, grade: "دهم" },
  ];
  for (const b of bdays) await db.birthday.create({ data: b });

  // --- Weekly schedule ----------------------------------------------------------
  const schedule = [
    { day: "شنبه", time: "۷:۳۰ - ۹:۱۵", subject: "ریاضی", teacher: "زهرا احمدی", grade: "دهم", className: "۱" },
    { day: "شنبه", time: "۹:۳۰ - ۱۱:۱۵", subject: "ادبیات فارسی", teacher: "مریم رضایی", grade: "دهم", className: "۱" },
    { day: "یکشنبه", time: "۷:۳۰ - ۹:۱۵", subject: "زیست‌شناسی", teacher: "نرگس کاظمی", grade: "دهم", className: "۱" },
    { day: "یکشنبه", time: "۹:۳۰ - ۱۱:۱۵", subject: "عربی", teacher: "سمیه حسینی", grade: "دهم", className: "۱" },
    { day: "دوشنبه", time: "۷:۳۰ - ۹:۱۵", subject: "شیمی", teacher: "زهرا احمدی", grade: "دهم", className: "۱" },
    { day: "دوشنبه", time: "۹:۳۰ - ۱۱:۱۵", subject: "قرآن", teacher: "مریم رضایی", grade: "دهم", className: "۱" },
  ];
  for (const s of schedule) await db.scheduleEntry.create({ data: s });

  // --- FAQ ----------------------------------------------------------------------
  const faq = [
    { question: "چگونه برای ثبت‌نام در مدرسه اقدام کنم؟", answer: "از طریق منوی ثبت‌نام فرم پیش‌ثبت‌نام را تکمیل کنید؛ همکاران ما برای هماهنگی مصاحبه با شما تماس خواهند گرفت.", order: 1 },
    { question: "ساعت شروع و پایان کلاس‌ها چگونه است؟", answer: "کلاس‌ها از ساعت ۷:۳۰ شروع و تا ۱۳:۳۰ ادامه دارد؛ برنامه هفتگی هر کلاس در بخش برنامه هفتگی منتشر می‌شود.", order: 2 },
    { question: "آیا مدرسه خدمات مشاوره تحصیلی ارائه می‌دهد؟", answer: "بله؛ واحد مشاوره مدرسه در تمام روزهای هفته آماده پاسخگویی به دانش‌آموزان و اولیا است.", order: 3 },
    { question: "چگونه از برنامه امتحانات مطلع شوم؟", answer: "تقویم امتحانات در بخش امتحانات و در پورتال دانش‌آموزی منتشر می‌شود.", order: 4 },
  ];
  for (const f of faq) await db.faqItem.create({ data: f });

  // --- School settings ------------------------------------------------------------
  const settings = [
    { key: "phone", value: "۰۲۱-۸۸۷۷۶۶۵۵" },
    { key: "email", value: "info@khadijeh-school.ir" },
    { key: "address", value: "تهران، منطقه ۵، بلوار شهید خدیجه، پلاک ۱۲" },
    { key: "intro", value: "دبیرستان دخترانه شاهد حضرت خدیجه (ص) با هدف تربیت دانش‌آموزانی معنوی، پرسشگر و توانمند در دو دوره اول و دوم متوسطه فعالیت می‌کند." },
  ];
  for (const s of settings) await db.schoolSetting.create({ data: s });

  // --- News ------------------------------------------------------------------------
  const news = [
    { title: "آغاز ثبت‌نام سال تحصیلی جدید", slug: "sabtnam-1404", summary: "ثبت‌نام دوره اول و دوم متوسطه آغاز شد.", body: "ثبت‌نام دانش‌آموزان جدید برای سال تحصیلی آینده از ابتدای اردیبهشت آغاز شده است. اولیا می‌توانند فرم پیش‌ثبت‌نام را تکمیل کنند و برای مصاحبه وقت رزرو کنند. مدارک لازم شامل کپی شناسنامه، کارت ملی و کارنامه سال گذشته است.", date: "۱۴۰۴/۰۲/۱۰", pinned: true },
    { title: "برگزاری اردوی زیست‌شناسی پارک ملی لار", slug: "ordoo-zist", summary: "اردوی علمی دانش‌آموزان پایه یازدهم با موضوع بوم‌شناسی.", body: "دانش‌آموزان پایه یازدهم در اردویی یک‌روزه به پارک ملی لار اعزام شدند و نمونه‌برداری گیاهی و مشاهده زیستگاه‌های جانوری را زیر نظر دبیر زیست‌شناسی انجام دادند. گزارش تصویری این اردو در گالری مدرسه منتشر شده است.", date: "۱۴۰۴/۰۲/۲۲" },
    { title: "افتتاح آزمایشگاه مجهز شیمی", slug: "azmayeshgah-shimi", summary: "آزمایشگاه نوسازی‌شده شیمی با تجهیزات ایمن افتتاح شد.", body: "با همکاری انجمن اولیا و مدرسه، آزمایشگاه شیمی بازسازی و تجهیز شد. کلاس‌های عملی از هفته آینده در این فضا برگزار می‌شود.", date: "۱۴۰۴/۰۳/۰۵" },
  ];
  for (const n of news) await db.news.create({ data: n });

  // --- Reports -----------------------------------------------------------------------
  const reports = [
    { title: "گزارش عملکرد نوبت اول", slug: "gozaresh-nobat-1", summary: "خلاصه نتایج ارزشیابی نوبت اول و تحلیل عملکرد کلاس‌ها.", body: "بر اساس نتایج ارزشیابی نوبت اول، میانگین معدل کلاس‌های دهم نسبت به سال گذشته رشد داشته است. تحلیل مفصل در جلسه اولیا و مربیان ارائه خواهد شد.", date: "۱۴۰۴/۰۱/۲۸" },
    { title: "گزارش هفته پژوهش", slug: "haft-pajuhesh", summary: "رویدادهای هفته پژوهش مدرسه در یک نگاه.", body: "هفته پژوهش با برگزاری نمایشگاه پروژه‌های علمی، کارگاه روش تحقیق و مسابقه ابداعات در مدرسه برگزار شد. بیش از ۴۰ پروژه توسط دانش‌آموزان ارائه گردید.", date: "۱۴۰۴/۰۲/۱۵" },
    { title: "گزارش بازدید از مرکز نگهداری کودکان", slug: "bazdid-markaz", summary: "فعالیت اجتماعی دانش‌آموزان در قالب پروژه همیاری.", body: "در قالب پروژه همیاری محله، دانش‌آموزان پایه دهم از مرکز نگهداری کودکان بازدید کردند و کتاب‌های کمک‌آموزشی تهیه‌شده توسط خود را اهدا نمودند.", date: "۱۴۰۴/۰۳/۰۲" },
  ];
  for (const r of reports) await db.report.create({ data: r });

  // --- Events ---------------------------------------------------------------------------
  const events = [
    { title: "جلسه اولیا و مربیان نوبت دوم", description: "ارائه تحلیل عملکرد تحصیلی و هماهنگی برنامه‌های نوبت دوم.", date: "۱۴۰۴/۰۳/۲۵", time: "۱۵:۰۰", location: "سالن اجتماعات مدرسه", category: "اولیا" },
    { title: "مسابقات والیبال درون‌مدرسه‌ای", description: "رقابت تیم‌های پایه‌های دهم تا دوازدهم.", date: "۱۴۰۴/۰۳/۲۸", time: "۱۰:۰۰", location: "سالن ورزشی", category: "ورزشی" },
    { title: "مراسم بزرگداشت عید سعید غدیر", description: "برنامه فرهنگی و سرود با اجرای گروه‌های دانش‌آموزی.", date: "۱۴۰۴/۰۴/۱۲", time: "۹:۰۰", location: "حیاط مدرسه", category: "فرهنگی" },
  ];
  for (const e of events) await db.event.create({ data: e });

  // --- Announcements ------------------------------------------------------------------------
  const ann = [
    { title: "انتشار برنامه امتحانات نوبت دوم", body: "تقویم امتحانات خرداد از امروز در پورتال دانش‌آموزی قابل مشاهده است.", date: "۱۴۰۴/۰۳/۱۵", important: true },
    { title: "یادآوری جلسه اولیا", body: "جلسه اولیا و مربیان روز چهارشنبه ساعت ۱۵ برگزار می‌شود.", date: "۱۴۰۴/۰۳/۱۸" },
    { title: "مهلت تحویل کتاب‌های کتابخانه", body: "دانش‌آموزان تا پایان خرداد فرصت دارند کتاب‌های امانتی را بازگردانند.", date: "۱۴۰۴/۰۳/۱۰" },
  ];
  for (const a of ann) await db.announcement.create({ data: a });

  // --- Achievements ---------------------------------------------------------------------------
  const ach = [
    { title: "کسب رتبه دوم المپیاد زیست‌شناسی کشوری", level: "student", person: "فاطمه کریمی", year: "۱۴۰۳", description: "دومین رتبه کشور در مرحله دوم المپیاد ملی زیست‌شناسی." },
    { title: "نفر اول کشوری رشته ریاضی", level: "student", person: "زینب مرادی", year: "۱۴۰۳", description: "مقام نخست آزمون سراسری رشته ریاضی در سطح کشور." },
    { title: "مدال طلای مسابقات قرآن", level: "student", person: "سکینه عباسی", year: "۱۴۰۴", description: "مدال طلای رشته حفظ در مسابقات قرآن و عترت." },
    { title: "مدرسه نمونه استانی", level: "school", year: "۱۴۰۳", description: "انتخاب دبیرستان به عنوان مدرسه نمونه استان در حوزه فعالیت‌های قرآنی." },
    { title: "قهرمانی والیبال استانی", level: "school", year: "۱۴۰۴", description: "قهرمانی تیم والیبال مدرسه در مسابقات استانی مدارس." },
  ];
  for (const a of ach) await db.achievement.create({ data: a });

  // --- Courses ----------------------------------------------------------------------------------
  const courses = [
    { title: "ریاضی تقویتی پایه دهم", slug: "riazi-dahom", description: "مرور مبانی و حل تمرین‌های پیشرفته ریاضی دهم برای آمادگی امتحانات نوبت دوم.", instructor: "زهرا احمدی", category: "تقویتی", duration: "۱۶ جلسه", capacity: 20, schedule: "شنبه و دوشنبه ۱۴:۰۰", status: "open", fee: 1200000 },
    { title: "زبان انگلیسی مکالمه", slug: "english-mokaleme", description: "تقویت مهارت مکالمه و شنیداری با روش ارتباطی و کلاس‌های تعاملی.", instructor: "نرگس کاظمی", category: "زبان", duration: "۱۲ جلسه", capacity: 15, schedule: "یکشنبه و سه‌شنبه ۱۴:۳۰", status: "open", fee: 900000 },
    { title: "رباتیک و برنامه‌نویسی", slug: "robotic", description: "آشنایی با مبانی الکترونیک، برنامه‌نویسی و ساخت ربات خط‌یاب به صورت تیمی.", instructor: "سمیه حسینی", category: "مهارتی", duration: "۱۰ جلسه", capacity: 12, schedule: "چهارشنبه ۱۴:۰۰", status: "open", fee: 1500000 },
    { title: "قرآن و علوم قرآنی", slug: "gheran", description: "کلاس تجوید، مفاهیم و حفظ قرآن در سطح مبتدی و متوسط.", instructor: "مریم رضایی", category: "قرآنی", duration: "۱۴ جلسه", capacity: 25, schedule: "پنجشنبه ۹:۰۰", status: "closed", fee: 0 },
  ];
  for (const c of courses) await db.course.create({ data: c });

  // --- Exams --------------------------------------------------------------------------------------
  const exams = [
    { title: "امتحان ریاضی نوبت دوم", subject: "ریاضی", grade: "دهم", date: "۱۴۰۴/۰۴/۰۲", time: "۸:۰۰", location: "سالن امتحانات", notes: "آوردن ماشین‌حساب علمی مجاز است." },
    { title: "امتحان زیست‌شناسی نوبت دوم", subject: "زیست‌شناسی", grade: "دهم", date: "۱۴۰۴/۰۴/۰۵", time: "۸:۰۰", location: "سالن امتحانات" },
    { title: "امتحان ادبیات فارسی", subject: "ادبیات فارسی", grade: "یازدهم", date: "۱۴۰۴/۰۴/۰۶", time: "۱۰:۳۰", location: "کلاس ۱۱/۲" },
  ];
  for (const e of exams) await db.exam.create({ data: e });

  // --- Gallery ---------------------------------------------------------------------------------------
  const album1 = await db.galleryAlbum.create({
    data: { title: "اردوی زیست‌شناسی لار", description: "تصاویر اردوی علمی پارک ملی لار", coverUrl: "https://picsum.photos/seed/lar1/640/420" },
  });
  for (let i = 1; i <= 4; i++) {
    await db.galleryImage.create({ data: { albumId: album1.id, url: `https://picsum.photos/seed/lar${i}/640/420` } });
  }
  const album2 = await db.galleryAlbum.create({
    data: { title: "هفته پژوهش", description: "نمایشگاه پروژه‌های علمی دانش‌آموزان", coverUrl: "https://picsum.photos/seed/paj1/640/420" },
  });
  for (let i = 1; i <= 4; i++) {
    await db.galleryImage.create({ data: { albumId: album2.id, url: `https://picsum.photos/seed/paj${i}/640/420` } });
  }
  const album3 = await db.galleryAlbum.create({
    data: { title: "مراسم صبحگاه", description: "برنامه‌های صبحگاهی و سرود مدرسه", coverUrl: "https://picsum.photos/seed/sob1/640/420" },
  });
  for (let i = 1; i <= 3; i++) {
    await db.galleryImage.create({ data: { albumId: album3.id, url: `https://picsum.photos/seed/sob${i}/640/420` } });
  }

  // --- Sample students (portal-linked) ------------------------------------------------------------------
  const students = [
    { fullName: "فاطمه کریمی", grade: "دهم", className: "۱", fatherName: "محمد", guardianPhone: "۰۹۱۲۱۱۱۲۲۳۳" },
    { fullName: "زینب مرادی", grade: "یازدهم", className: "۲", fatherName: "علی", guardianPhone: "۰۹۱۲۲۲۳۳۴۴۵" },
    { fullName: "سکینه عباسی", grade: "دهم", className: "۳", fatherName: "حسین", guardianPhone: "۰۹۱۲۳۳۴۴۵۵۶" },
  ];
  for (const s of students) await db.student.create({ data: s });

  // --- Bootstrap super admin (credentials from env, never committed) -------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      await db.user.create({
        data: {
          email: adminEmail,
          name: "مدیر ارشد",
          passwordHash: await hashPassword(adminPassword),
          role: "SUPER_ADMIN",
        },
      });
      console.log(`Super admin created: ${adminEmail}`);
    }
  } else {
    console.log("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — no admin user created.");
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
