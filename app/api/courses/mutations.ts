import { db } from "@/lib/neon";
import { courses } from "@/lib/neon/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import type { NewCourse, Course } from "./interface";

export async function createCourse(data: NewCourse): Promise<Course> {
  const conditions = [
    eq(courses.category, data.category || "school"),
    eq(courses.subject, data.subject),
  ];

  if (data.level) conditions.push(eq(courses.level, data.level));
  else conditions.push(isNull(courses.level));

  if (data.term) conditions.push(eq(courses.term, data.term));
  else conditions.push(isNull(courses.term));

  const existing = await db
    .select()
    .from(courses)
    .where(and(...conditions))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("A course with this category, subject, level, and term already exists.");
  }

  // Ensure slug is unique
  let baseSlug = data.slug;
  let currentSlug = baseSlug;
  let counter = 1;
  while (true) {
    const existingSlug = await db.select().from(courses).where(eq(courses.slug, currentSlug)).limit(1);
    if (existingSlug.length === 0) break;
    currentSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  data.slug = currentSlug;

  const result = await db.insert(courses).values(data).returning();
  return result[0];
}

export async function updateCourse(id: string, data: Partial<NewCourse>): Promise<Course> {
  // Ensure slug is unique if it's being updated
  if (data.slug) {
    let baseSlug = data.slug;
    let currentSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existingSlug = await db.select().from(courses).where(eq(courses.slug, currentSlug)).limit(1);
      if (existingSlug.length === 0 || existingSlug[0].id === id) break;
      currentSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    data.slug = currentSlug;
  }

  const result = await db
    .update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courses.id, id))
    .returning();

  if (result.length === 0) throw new Error("Course not found");
  return result[0];
}

export async function deleteCourse(id: string): Promise<void> {
  await db.delete(courses).where(eq(courses.id, id));
}

export async function deleteCourses(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await db.delete(courses).where(inArray(courses.id, ids));
}
