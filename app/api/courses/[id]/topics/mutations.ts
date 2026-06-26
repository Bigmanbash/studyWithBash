import { db } from "@/lib/neon";
import { topics, subtopics, subtopicMaterials } from "@/lib/neon/schema";
import { eq, asc } from "drizzle-orm";
import { deleteFile } from "@/lib/supabase/storage";

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

// ── Topics ────────────────────────────────────────────────────────────────────

export async function createTopic(courseId: string, data: { title: string }) {
  // Get the max order for this course
  const existing = await db
    .select()
    .from(topics)
    .where(eq(topics.courseId, courseId))
    .orderBy(asc(topics.order));

  const maxOrder = existing.length > 0 ? Math.max(...existing.map((t) => t.order)) + 1 : 0;

  const result = await db
    .insert(topics)
    .values({
      courseId,
      title: data.title,
      slug: slugify(data.title),
      order: maxOrder,
    })
    .returning();

  return result[0];
}

export async function updateTopic(topicId: string, data: { title?: string; order?: number }) {
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (data.title !== undefined) {
    updateData.title = data.title;
    updateData.slug = slugify(data.title);
  }
  if (data.order !== undefined) {
    updateData.order = data.order;
  }

  const result = await db
    .update(topics)
    .set(updateData)
    .where(eq(topics.id, topicId))
    .returning();

  if (result.length === 0) throw new Error("Topic not found");
  return result[0];
}

export async function deleteTopic(topicId: string) {
  // Cascade will handle subtopics & materials in DB,
  // but we need to clean up Supabase Storage files first
  const subs = await db.select().from(subtopics).where(eq(subtopics.topicId, topicId));
  for (const sub of subs) {
    const mats = await db.select().from(subtopicMaterials).where(eq(subtopicMaterials.subtopicId, sub.id));
    for (const mat of mats) {
      try { await deleteFile(mat.filePath); } catch (e) { console.error("Failed to delete file:", e); }
    }
  }

  await db.delete(topics).where(eq(topics.id, topicId));
}

export async function reorderTopics(courseId: string, orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(topics)
      .set({ order: i, updatedAt: new Date() })
      .where(eq(topics.id, orderedIds[i]));
  }
}

// ── Subtopics ─────────────────────────────────────────────────────────────────

export async function createSubtopic(topicId: string, data: { title: string }) {
  const existing = await db
    .select()
    .from(subtopics)
    .where(eq(subtopics.topicId, topicId))
    .orderBy(asc(subtopics.order));

  const maxOrder = existing.length > 0 ? Math.max(...existing.map((s) => s.order)) + 1 : 0;

  const result = await db
    .insert(subtopics)
    .values({
      topicId,
      title: data.title,
      slug: slugify(data.title),
      order: maxOrder,
    })
    .returning();

  return result[0];
}

export async function updateSubtopic(subtopicId: string, data: { title?: string; order?: number }) {
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (data.title !== undefined) {
    updateData.title = data.title;
    updateData.slug = slugify(data.title);
  }
  if (data.order !== undefined) {
    updateData.order = data.order;
  }

  const result = await db
    .update(subtopics)
    .set(updateData)
    .where(eq(subtopics.id, subtopicId))
    .returning();

  if (result.length === 0) throw new Error("Subtopic not found");
  return result[0];
}

export async function deleteSubtopic(subtopicId: string) {
  // Clean up storage files first
  const mats = await db.select().from(subtopicMaterials).where(eq(subtopicMaterials.subtopicId, subtopicId));
  for (const mat of mats) {
    try { await deleteFile(mat.filePath); } catch (e) { console.error("Failed to delete file:", e); }
  }
  await db.delete(subtopics).where(eq(subtopics.id, subtopicId));
}

export async function reorderSubtopics(topicId: string, orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(subtopics)
      .set({ order: i, updatedAt: new Date() })
      .where(eq(subtopics.id, orderedIds[i]));
  }
}

// ── Materials ─────────────────────────────────────────────────────────────────

export async function createMaterial(subtopicId: string, data: {
  title: string;
  filePath: string;
  fileType?: string;
  fileSize?: number;
}) {
  const existing = await db
    .select()
    .from(subtopicMaterials)
    .where(eq(subtopicMaterials.subtopicId, subtopicId));

  const maxOrder = existing.length > 0 ? Math.max(...existing.map((m) => m.order)) + 1 : 0;

  const result = await db
    .insert(subtopicMaterials)
    .values({
      subtopicId,
      title: data.title,
      filePath: data.filePath,
      fileType: data.fileType || null,
      fileSize: data.fileSize || null,
      order: maxOrder,
    })
    .returning();

  return result[0];
}

export async function deleteMaterial(materialId: string) {
  const mat = await db.select().from(subtopicMaterials).where(eq(subtopicMaterials.id, materialId)).limit(1);
  if (mat[0]) {
    try { await deleteFile(mat[0].filePath); } catch (e) { console.error("Failed to delete file:", e); }
  }
  await db.delete(subtopicMaterials).where(eq(subtopicMaterials.id, materialId));
}
