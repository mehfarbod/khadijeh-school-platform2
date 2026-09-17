import { myCourses, myExams } from "@/lib/queries";
import type { User } from "@/lib/auth";

/** Portal registrations; never throws to the page (renders empty on error). */
export async function myCoursesSafe(userId: string) {
  try {
    return await myCourses(userId);
  } catch {
    return [];
  }
}

export async function myExamsSafe(userId: string) {
  try {
    return await myExams(userId);
  } catch {
    return [];
  }
}

export type { User };
