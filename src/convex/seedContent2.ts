import { internalMutation } from "./_generated/server";

export const seedMore = internalMutation({
  args: {},
  handler: async (ctx) => {
    const ann = [
      { title: "انتشار برنامه امتحانات نوبت دوم", body: "تقویم امتحانات خرداد از امروز در پورتال دانش‌آموزی قابل مشاهده است.", date: "۱۴۰۴/۰۳/۱۵", important: true },
      { title: "یادآوری جلسه اولیا", body: "جلسه اولیا و مربیان روز چهارشنبه ساعت ۱۵ برگزار می‌شود.", date: "۱۴۰۴/۰۳/۱۸" },
      { title: "مهلت تحویل کتاب‌های کتابخانه", body: "دانش‌آموزان تا پایان خرداد فرصت دارند کتاب‌های امانتی را بازگردانند.", date: "۱۴۰۴/۰۳/۱۰" },
    ];
    for (const a of ann) await ctx.db.insert("announcements", a);

    const ach = [
      { title: "کسب رتبه دوم المپیاد زیست‌شناسی کشوری", level: "student", person: "فاطمه کریمی", year: "۱۴۰۳", description: "دومین رتبه کشور در مرحله دوم المپیاد ملی زیست‌شناسی." },
      { title: "نفر اول کشوری رشته ریاضی", level: "student", person: "زینب مرادی", year: "۱۴۰۳", description: "مقام نخست آزمون سراسری رشته ریاضی در سطح کشور." },
      { title: "مدال طلای مسابقات قرآن", level: "student", person: "سکینه عباسی", year: "۱۴۰۴", description: "مدال طلای رشته حفظ در مسابقات قرآن و عترت." },
      { title: "مدرسه نمونه استانی", level: "school", year: "۱۴۰۳", description: "انتخاب دبیرستان به عنوان مدرسه نمونه استان در حوزه فعالیت‌های قرآنی." },
      { title: "قهرمانی والیبال استانی", level: "school", year: "۱۴۰۴", description: "قهرمانی تیم والیبال مدرسه در مسابقات استانی مدارس." },
    ];
    for (const a of ach) await ctx.db.insert("achievements", a);

    const courses = [
      { title: "ریاضی تقویتی پایه دهم", slug: "riazi-dahom", description: "مرور مبانی و حل تمرین‌های پیشرفته ریاضی دهم برای آمادگی امتحانات نوبت دوم.", instructor: "زهرا احمدی", category: "تقویتی", duration: "۱۶ جلسه", capacity: 20, schedule: "شنبه و دوشنبه ۱۴:۰۰", status: "open", fee: 1200000 },
      { title: "زبان انگلیسی مکالمه", slug: "english-mokaleme", description: "تقویت مهارت مکالمه و شنیداری با روش ارتباطی و کلاس‌های تعاملی.", instructor: "نرگس کاظمی", category: "زبان", duration: "۱۲ جلسه", capacity: 15, schedule: "یکشنبه و سه‌شنبه ۱۴:۳۰", status: "open", fee: 900000 },
      { title: "رباتیک و برنامه‌نویسی", slug: "robotic", description: "آشنایی با مبانی الکترونیک، برنامه‌نویسی و ساخت ربات خط‌یاب به صورت تیمی.", instructor: "سمیه حسینی", category: "مهارتی", duration: "۱۰ جلسه", capacity: 12, schedule: "چهارشنبه ۱۴:۰۰", status: "open", fee: 1500000 },
      { title: "قرآن و علوم قرآنی", slug: "gheran", description: "کلاس تجوید، مفاهیم و حفظ قرآن در سطح مبتدی و متوسط.", instructor: "مریم رضایی", category: "قرآنی", duration: "۱۴ جلسه", capacity: 25, schedule: "پنجشنبه ۹:۰۰", status: "closed", fee: 0 },
    ];
    for (const c of courses) await ctx.db.insert("courses", c);

    const exams = [
      { title: "امتحان ریاضی نوبت دوم", subject: "ریاضی", grade: "دهم", date: "۱۴۰۴/۰۴/۰۲", time: "۸:۰۰", location: "سالن امتحانات", notes: "آوردن ماشین‌حساب علمی مجاز است." },
      { title: "امتحان زیست‌شناسی نوبت دوم", subject: "زیست‌شناسی", grade: "دهم", date: "۱۴۰۴/۰۴/۰۵", time: "۸:۰۰", location: "سالن امتحانات" },
      { title: "امتحان ادبیات فارسی", subject: "ادبیات فارسی", grade: "یازدهم", date: "۱۴۰۴/۰۴/۰۶", time: "۱۰:۳۰", location: "کلاس ۱۱/۲" },
    ];
    for (const e of exams) await ctx.db.insert("exams", e);

    const album1 = await ctx.db.insert("galleryAlbums", { title: "اردوی زیست‌شناسی لار", description: "تصاویر اردوی علمی پارک ملی لار", coverUrl: "https://picsum.photos/seed/lar1/640/420" });
    for (let i = 1; i <= 4; i++) await ctx.db.insert("galleryImages", { albumId: album1 as never, url: `https://picsum.photos/seed/lar${i}/640/420` });
    const album2 = await ctx.db.insert("galleryAlbums", { title: "هفته پژوهش", description: "نمایشگاه پروژه‌های علمی دانش‌آموزان", coverUrl: "https://picsum.photos/seed/paj1/640/420" });
    for (let i = 1; i <= 4; i++) await ctx.db.insert("galleryImages", { albumId: album2 as never, url: `https://picsum.photos/seed/paj${i}/640/420` });
    const album3 = await ctx.db.insert("galleryAlbums", { title: "مراسم صبحگاه", description: "برنامه‌های صبحگاهی و سرود مدرسه", coverUrl: "https://picsum.photos/seed/sob1/640/420" });
    for (let i = 1; i <= 3; i++) await ctx.db.insert("galleryImages", { albumId: album3 as never, url: `https://picsum.photos/seed/sob${i}/640/420` });
    return "ok";
  },
});
