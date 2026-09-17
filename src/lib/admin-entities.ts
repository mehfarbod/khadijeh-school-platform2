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
];
