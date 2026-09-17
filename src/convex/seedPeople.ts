import { internalMutation } from "./_generated/server";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const staff = [
      { fullName: "فاطمه موسوی", role: "مدیر مدرسه", subject: "علوم تربیتی", order: 1 },
      { fullName: "زهرا احمدی", role: "معاون آموزشی", subject: "ریاضیات", order: 2 },
      { fullName: "مریم رضایی", role: "معلم", subject: "ادبیات فارسی", order: 3 },
      { fullName: "نرگس کاظمی", role: "معلم", subject: "زیست‌شناسی", order: 4 },
      { fullName: "سمیه حسینی", role: "مشاور تحصیلی", subject: "مشاوره", order: 5 },
    ];
    for (const s of staff) await ctx.db.insert("staff", { ...s, bio: "عضو کادر آموزشی دبیرستان شاهد حضرت خدیجه (ص)." });

    const tops = [
      { fullName: "فاطمه کریمی", grade: "دهم", className: "۱", achievement: "رتبه دوم المپیاد زیست‌شناسی کشوری", order: 1 },
      { fullName: "زینب مرادی", grade: "یازدهم", className: "۲", achievement: "نفر اول کشوری رشته ریاضی", order: 2 },
      { fullName: "معصومه نیک‌نام", grade: "دوازدهم", className: "۱", achievement: "قبولی رتبه برتر کنکور تجربی", order: 3 },
      { fullName: "سکینه عباسی", grade: "دهم", className: "۳", achievement: "مدال طلای مسابقات قرآن و عترت", order: 4 },
      { fullName: "رویا صادقی", grade: "یازدهم", className: "۱", achievement: "رتبه نخست جشنواره خوارزمی منطقه", order: 5 },
    ];
    for (const t of tops) await ctx.db.insert("topStudents", t);

    const bdays = [
      { person: "فاطمه کریمی", kind: "student", month: 9, day: 12, grade: "دهم" },
      { person: "زینب مرادی", kind: "student", month: 10, day: 3, grade: "یازدهم" },
      { person: "مریم رضایی", kind: "staff", month: 11, day: 21 },
      { person: "سکینه عباسی", kind: "student", month: 12, day: 7, grade: "دهم" },
    ];
    for (const b of bdays) await ctx.db.insert("birthdays", b);

    const schedule = [
      { day: "شنبه", time: "۷:۳۰ - ۹:۱۵", subject: "ریاضی", teacher: "زهرا احمدی", grade: "دهم", className: "۱" },
      { day: "شنبه", time: "۹:۳۰ - ۱۱:۱۵", subject: "ادبیات فارسی", teacher: "مریم رضایی", grade: "دهم", className: "۱" },
      { day: "یکشنبه", time: "۷:۳۰ - ۹:۱۵", subject: "زیست‌شناسی", teacher: "نرگس کاظمی", grade: "دهم", className: "۱" },
      { day: "یکشنبه", time: "۹:۳۰ - ۱۱:۱۵", subject: "عربی", teacher: "سمیه حسینی", grade: "دهم", className: "۱" },
      { day: "دوشنبه", time: "۷:۳۰ - ۹:۱۵", subject: "شیمی", teacher: "زهرا احمدی", grade: "دهم", className: "۱" },
      { day: "دوشنبه", time: "۹:۳۰ - ۱۱:۱۵", subject: "قرآن", teacher: "مریم رضایی", grade: "دهم", className: "۱" },
    ];
    for (const s of schedule) await ctx.db.insert("scheduleEntries", s);

    const faq = [
      { question: "چگونه برای ثبت‌نام در مدرسه اقدام کنم؟", answer: "از طریق منوی ثبت‌نام فرم پیش‌ثبت‌نام را تکمیل کنید؛ همکاران ما برای هماهنگی مصاحبه با شما تماس خواهند گرفت.", order: 1 },
      { question: "ساعت شروع و پایان کلاس‌ها چگونه است؟", answer: "کلاس‌ها از ساعت ۷:۳۰ شروع و تا ۱۳:۳۰ ادامه دارد؛ برنامه هفتگی هر کلاس در بخش برنامه هفتگی منتشر می‌شود.", order: 2 },
      { question: "آیا مدرسه خدمات مشاوره تحصیلی ارائه می‌دهد؟", answer: "بله؛ واحد مشاوره مدرسه در تمام روزهای هفته آماده پاسخگویی به دانش‌آموزان و اولیا است.", order: 3 },
      { question: "چگونه از برنامه امتحانات مطلع شوم؟", answer: "تقویم امتحانات در بخش امتحانات و در پورتال دانش‌آموزی منتشر می‌شود.", order: 4 },
    ];
    for (const f of faq) await ctx.db.insert("faqItems", f);

    await ctx.db.insert("schoolSettings", { key: "phone", value: "۰۲۱-۸۸۷۷۶۶۵۵" });
    await ctx.db.insert("schoolSettings", { key: "email", value: "info@khadijeh-school.ir" });
    await ctx.db.insert("schoolSettings", { key: "address", value: "تهران، منطقه ۵، بلوار شهید خدیجه، پلاک ۱۲" });
    await ctx.db.insert("schoolSettings", { key: "intro", value: "دبیرستان دخترانه شاهد حضرت خدیجه (ص) با هدف تربیت دانش‌آموزانی معنوی، پرسشگر و توانمند در دو دوره اول و دوم متوسطه فعالیت می‌کند." });
    return "ok";
  },
});
