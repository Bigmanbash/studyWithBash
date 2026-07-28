import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCourseMeta(course?: {
  level?: string | null;
  term?: string | null;
  category?: string | null;
  subject?: string | null;
} | null): string | null {
  if (!course) return null;
  const parts: string[] = [];

  if (course.level) {
    const formattedLevel = course.level.replace(/^(SSS|JSS)(\d)$/i, "$1 $2");
    parts.push(formattedLevel);
  }

  if (course.term) {
    const termMap: Record<string, string> = {
      first: "1st Term",
      second: "2nd Term",
      third: "3rd Term",
    };
    parts.push(termMap[course.term.toLowerCase()] || course.term);
  }

  if (parts.length > 0) {
    return parts.join(" • ");
  }

  if (course.category === "exam") {
    return course.subject ? `${course.subject.toUpperCase()} Prep` : "Exam Prep";
  }

  if (course.subject) {
    return course.subject;
  }

  return null;
}
