import { db } from "@/lib/neon";
import { courses } from "@/lib/neon/schema";
import { eq, and, isNull } from "drizzle-orm";
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

  const result = await db.insert(courses).values(data).returning();
  return result[0];
}

export async function updateCourse(id: string, data: Partial<NewCourse>): Promise<Course> {
  const result = await db
    .update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courses.id, id))
    .returning();

  if (result.length === 0) throw new Error("Course not found");
  return result[0];
}

export async function deleteCourse(id: string): Promise<void> {
  // We'll do a hard delete for now as per Drizzle defaults for cascade if any,
  // or a soft delete if the user adds a deleted_at column later.
  // There is no soft delete flag in schema, so hard delete.
  await db.delete(courses).where(eq(courses.id, id));
}
