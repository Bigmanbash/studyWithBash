import { db } from "@/lib/neon";
import { courses } from "@/lib/neon/schema";
import { eq, ilike, and, or, count } from "drizzle-orm";
import type { CourseListQuery, PaginatedCourses, Course } from "./interface";
import { getSignedUrl } from "@/lib/supabase/storage";

async function processCourseUrls(course: Course): Promise<Course> {
  const result = { ...course };
  
  if (result.coverImagePath && !result.coverImagePath.startsWith("http") && !result.coverImagePath.startsWith("/")) {
    try {
      result.coverImagePath = await getSignedUrl(result.coverImagePath, 3600);
    } catch (e) {
      console.error("Failed to sign cover image", e);
    }
  }

  if (result.pdfPath && !result.pdfPath.startsWith("http") && !result.pdfPath.startsWith("/")) {
    try {
      result.pdfPath = await getSignedUrl(result.pdfPath, 3600);
    } catch (e) {
      console.error("Failed to sign pdf", e);
    }
  }

  return result;
}

export async function listCourses(query: CourseListQuery = {}): Promise<PaginatedCourses> {
  const { page = 1, limit = 10, search, category, level, term, subject, status } = query;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(
      or(ilike(courses.title, `%${search}%`), ilike(courses.subject, `%${search}%`))
    );
  }

  if (category) {
    conditions.push(eq(courses.category, category));
  }
  
  if (level) {
    conditions.push(eq(courses.level, level));
  }
  
  if (term) {
    conditions.push(eq(courses.term, term));
  }
  
  if (subject) {
    conditions.push(ilike(courses.subject, subject));
  }

  if (status) {
    conditions.push(eq(courses.status, status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalCount] = await Promise.all([
    db.select().from(courses).where(whereClause).limit(limit).offset(offset),
    db.select({ count: count() }).from(courses).where(whereClause),
  ]);

  const processedData = await Promise.all(data.map(processCourseUrls));

  return {
    data: processedData,
    total: totalCount[0]?.count ?? 0,
    page,
    limit,
  };
}

export async function getCourse(id: string): Promise<Course | null> {
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!result[0]) return null;
  return processCourseUrls(result[0]);
}
