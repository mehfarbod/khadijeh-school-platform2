import { z } from "zod";

/** Trim + collapse whitespace for string fields. */
const clean = (max = 500) => z.string().transform((s) => s.trim().replace(/\s+/g, " ")).pipe(z.string().min(1).max(max));

export const contactSchema = z.object({
  name: clean(120),
  phone: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s === "" || /^[0-9+\-\s۰-۹]{6,20}$/.test(s), { message: "شماره تماس نامعتبر است." })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .refine((s) => s === "" || z.string().email().safeParse(s).success, { message: "رایانامه نامعتبر است." })
    .optional()
    .or(z.literal("")),
  subject: clean(200),
  message: z.string().transform((s) => s.trim()).pipe(z.string().min(5).max(5000)),
});

export const registerSchema = z.object({
  courseId: z.string().min(1),
  fullName: clean(120),
  phone: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => /^[0-9+\-\s۰-۹]{6,20}$/.test(s), { message: "شماره تماس نامعتبر است." }),
  grade: z.string().max(50).optional().or(z.literal("")),
  note: z.string().max(2000).optional().or(z.literal("")),
});

export const signInSchema = z.object({
  email: z.string().email("رایانامه نامعتبر است."),
  password: z.string().min(1, "گذرواژه الزامی است."),
});

export const settingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(2000),
});

/** Convert Persian digits to ASCII (clients may type either). */
export function faDigitsToEn(s: string): string {
  return s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}
