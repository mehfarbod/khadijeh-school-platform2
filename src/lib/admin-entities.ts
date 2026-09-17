export type FieldType = "text" | "textarea" | "number" | "select" | "switch";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
};

export type EntityConfig = {
  slug: string;
  table: string;
  title: string;
  singular: string;
  fields: FieldConfig[];
  columns: { name: string; label: string }[];
};

const statusField = (name = "status"): FieldConfig => ({
  name,
  label: "وضعیت",
  type: "select",
  options: [
    { value: "open", label: "در حال ثبت‌نام" },
    { value: "closed", label: "بسته" },
    { value: "full", label: "تکمیل ظرفیت" },
  ],
});

export const ENTITIES: EntityConfig[] = [
  {
    slug: "students", table: "students", title: "دانش‌آموزان", singular: "دانش‌آموز",
    fields: [
      { name: "fullName", label: "نام و نام خانوادگی", type: "text", required: true },
      { name: "grade", label: "پایه", type: "text", required: true },
      { name: "className", label: "کلاس", type: "text", required: true },
      { name: "fatherName", label: "نام پدر", type: "text" },
      { name: "guardianPhone", label: "تلفن سرپرست", type: "text" },
    ],
    columns: [
      { name: "fullName", label: "نام" },
      { name: "grade", label: "پایه" },
      { name: "className", label: "کلاس" },
      { name: "guardianPhone", label: "تلفن سرپرست" },
    ],
  },
  {
    slug: "staff", table: "staff", title: "معلمان و کادر", singular: "عضو کادر",
    fields: [
      { name: "fullName", label: "نام", type: "text", required: true },
      { name: "role", label: "سمت", type: "text", required: true, placeholder: "معلم / معاون / مدیر" },
      { name: "subject", label: "درس تخصصی", type: "text" },
      { name: "bio", label: "معرفی کوتاه", type: "textarea" },
      { name: "order", label: "ترتیب نمایش", type: "number" },
    ],
    columns: [
      { name: "fullName", label: "نام" },
      { name: "role", label: "سمت" },
      { name: "subject", label: "درس" },
    ],
  },
  {
    slug: "courses", table: "courses", title: "دوره‌ها", singular: "دوره",
    fields: [
      { name: "title", label: "عنوان", type: "text", required: true },
      { name: "slug", label: "نامک (انگلیسی)", type: "text", required: true },
      { name: "description", label: "توضیحات", type: "textarea", required: true },
      { name: "instructor", label: "مدرس", type: "text" },
      { name: "category", label: "دسته", type: "text", required: true },
      { name: "duration", label: "مدت", type: "text" },
      { name: "capacity", label: "ظرفیت", type: "number" },
      { name: "schedule", label: "زمان کلاس", type: "text" },
      statusField(),
    ],
    columns: [
      { name: "title", label: "عنوان" },
      { name: "instructor", label: "مدرس" },
      { name: "category", label: "دسته" },
      { name: "status", label: "وضعیت" },
    ],
  },
  {
    slug: "course-registrations", table: "courseRegistrations", title: "ثبت‌نام دوره‌ها", singular: "ثبت‌نام",
    fields: [
      { name: "fullName", label: "نام", type: "text", required: true },
      { name: "phone", label: "تلفن", type: "text", required: true },
      { name: "grade", label: "پایه", type: "text" },
      { name: "status", label: "وضعیت", type: "select", options: [
        { value: "pending", label: "در انتظار" },
        { value: "approved", label: "تأیید" },
        { value: "rejected", label: "رد" },
        { value: "cancelled", label: "لغو" },
      ] },
      { name: "paymentStatus", label: "پرداخت", type: "select", options: [
        { value: "unpaid", label: "پرداخت نشده" },
        { value: "paid", label: "پرداخت شده" },
      ] },
    ],
    columns: [
      { name: "fullName", label: "نام" },
      { name: "phone", label: "تلفن" },
      { name: "status", label: "وضعیت" },
      { name: "paymentStatus", label: "پرداخت" },
    ],
  },
  {
    slug: "news", table: "news", title: "اخبار", singular: "خبر",
    fields: [
      { name: "title", label: "عنوان", type: "text", required: true },
      { name: "slug", label: "نامک (انگلیسی)", type: "text", required: true },
      { name: "summary", label: "خلاصه", type: "textarea" },
      { name: "body", label: "متن کامل", type: "textarea", required: true },
      { name: "date", label: "تاریخ", type: "text", placeholder: "۱۴۰۴/۰۳/۱۵" },
    ],
    columns: [
      { name: "title", label: "عنوان" },
      { name: "date", label: "تاریخ" },
    ],
  },
  {
    slug: "reports", table: "reports", title: "گزارش‌ها", singular: "گزارش",
    fields: [
      { name: "title", label: "عنوان", type: "text", required: true },
      { name: "slug", label: "نامک (انگلیسی)", type: "text", required: true },
      { name: "summary", label: "خلاصه", type: "textarea" },
      { name: "body", label: "متن کامل", type: "textarea", required: true },
      { name: "date", label: "تاریخ", type: "text" },
    ],
    columns: [
      { name: "title", label: "عنوان" },
      { name: "date", label: "تاریخ" },
    ],
  },
  {
    slug: "events", table: "events", title: "رویدادها", singular: "رویداد",
    fields: [
      { name: "title", label: "عنوان", type: "text", required: true },
      { name: "description", label: "توضیحات", type: "textarea" },
      { name: "date", label: "تاریخ", type: "text" },
      { name: "time", label: "ساعت", type: "text" },
      { name: "location", label: "محل برگزاری", type: "text" },
      { name: "category", label: "دسته", type: "text" },
    ],
    columns: [
      { name: "title", label: "عنوان" },
      { name: "date", label: "تاریخ" },
      { name: "category", label: "دسته" },
    ],
  },
  {
    slug: "announcements", table: "announcements", title: "اطلاعیه‌ها", singular: "اطلاعیه",
    fields: [
      { name: "title", label: "عنوان", type: "text", required: true },
      { name: "body", label: "متن", type: "textarea", required: true },
      { name: "date", label: "تاریخ", type: "text" },
      { name: "important", label: "مهم", type: "switch" },
    ],
    columns: [
      { name: "title", label: "عنوان" },
      { name: "date", label: "تاریخ" },
    ],
  },
  {
    slug: "achievements", table: "achievements", title: "افتخارات", singular: "افتخار",
    fields: [
      { name: "title", label: "عنوان", type: "text", required: true },
      { name: "level", label: "سطح", type: "select", options: [
        { value: "student", label: "دانش‌آموز" },
        { value: "school", label: "مدرسه" },
      ] },
      { name: "person", label: "فرد", type: "text" },
      { name: "year", label: "سال", type: "text" },
      { name: "description", label: "توضیحات", type: "textarea" },
    ],
    columns: [
      { name: "title", label: "عنوان" },
      { name: "person", label: "فرد" },
      { name: "year", label: "سال" },
    ],
  },
  {
    slug: "top-students", table: "topStudents", title: "دانش‌آموزان برتر", singular: "دانش‌آموز برتر",
    fields: [
      { name: "fullName", label: "نام", type: "text", required: true },
      { name: "grade", label: "پایه", type: "text", required: true },
      { name: "className", label: "کلاس", type: "text" },
      { name: "achievement", label: "افتخار", type: "text", required: true },
      { name: "order", label: "ترتیب", type: "number" },
    ],
    columns: [
      { name: "fullName", label: "نام" },
      { name: "grade", label: "پایه" },
      { name: "achievement", label: "افتخار" },
    ],
  },
  {
    slug: "birthdays", table: "birthdays", title: "تولدها", singular: "تولد",
    fields: [
      { name: "person", label: "نام", type: "text", required: true },
      { name: "kind", label: "نوع", type: "select", options: [
        { value: "student", label: "دانش‌آموز" },
        { value: "staff", label: "کادر" },
      ] },
      { name: "month", label: "ماه (عدد)", type: "number", required: true },
      { name: "day", label: "روز (عدد)", type: "number", required: true },
      { name: "grade", label: "پایه", type: "text" },
    ],
    columns: [
      { name: "person", label: "نام" },
      { name: "month", label: "ماه" },
      { name: "day", label: "روز" },
    ],
  },
  {
    slug: "exams", table: "exams", title: "امتحانات", singular: "امتحان",
    fields: [
      { name: "title", label: "عنوان", type: "text", required: true },
      { name: "subject", label: "درس", type: "text", required: true },
      { name: "grade", label: "پایه", type: "text", required: true },
      { name: "date", label: "تاریخ", type: "text", required: true },
      { name: "time", label: "ساعت", type: "text" },
      { name: "location", label: "محل", type: "text" },
      { name: "notes", label: "یادداشت", type: "textarea" },
    ],
    columns: [
      { name: "subject", label: "درس" },
      { name: "grade", label: "پایه" },
      { name: "date", label: "تاریخ" },
    ],
  },
  {
    slug: "schedule", table: "scheduleEntries", title: "برنامه هفتگی", singular: "ساعت کلاسی",
    fields: [
      { name: "day", label: "روز", type: "select", required: true, options: [
        { value: "شنبه", label: "شنبه" },
        { value: "یکشنبه", label: "یکشنبه" },
        { value: "دوشنبه", label: "دوشنبه" },
        { value: "سه‌شنبه", label: "سه‌شنبه" },
        { value: "چهارشنبه", label: "چهارشنبه" },
        { value: "پنجشنبه", label: "پنجشنبه" },
      ] },
      { name: "time", label: "ساعت", type: "text", required: true },
      { name: "subject", label: "درس", type: "text", required: true },
      { name: "teacher", label: "دبیر", type: "text" },
      { name: "grade", label: "پایه", type: "text", required: true },
      { name: "className", label: "کلاس", type: "text", required: true },
    ],
    columns: [
      { name: "day", label: "روز" },
      { name: "time", label: "ساعت" },
      { name: "subject", label: "درس" },
      { name: "grade", label: "پایه" },
    ],
  },
  {
    slug: "gallery-albums", table: "galleryAlbums", title: "آلبوم‌های گالری", singular: "آلبوم",
    fields: [
      { name: "title", label: "عنوان", type: "text", required: true },
      { name: "description", label: "توضیحات", type: "textarea" },
      { name: "coverUrl", label: "آدرس کاور", type: "text" },
    ],
    columns: [{ name: "title", label: "عنوان" }],
  },
  {
    slug: "gallery-images", table: "galleryImages", title: "تصاویر گالری", singular: "تصویر",
    fields: [
      { name: "albumId", label: "شناسه آلبوم", type: "text", required: true, placeholder: "شناسه آلبوم را از بخش آلبوم‌ها بردارید" },
      { name: "title", label: "عنوان تصویر", type: "text" },
      { name: "url", label: "آدرس تصویر", type: "text", required: true },
    ],
    columns: [
      { name: "title", label: "عنوان" },
      { name: "url", label: "آدرس" },
    ],
  },
  {
    slug: "faq", table: "faqItems", title: "پرسش‌های پرتکرار", singular: "پرسش",
    fields: [
      { name: "question", label: "پرسش", type: "text", required: true },
      { name: "answer", label: "پاسخ", type: "textarea", required: true },
      { name: "order", label: "ترتیب", type: "number" },
    ],
    columns: [{ name: "question", label: "پرسش" }],
  },
  {
    slug: "contact-messages", table: "contactMessages", title: "پیام‌های تماس", singular: "پیام",
    fields: [
      { name: "subject", label: "موضوع", type: "text", required: true },
      { name: "message", label: "متن پیام", type: "textarea", required: true },
      { name: "read", label: "خوانده‌شده", type: "switch" },
    ],
    columns: [
      { name: "subject", label: "موضوع" },
      { name: "read", label: "وضعیت" },
    ],
  },
];
