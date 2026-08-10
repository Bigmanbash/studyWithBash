import { db } from "@/lib/neon";
import { topics, subtopics, subtopicMaterials, topicVideos, TopicVideo } from "@/lib/neon/schema";
import { eq, asc } from "drizzle-orm";
import { getSignedUrl } from "@/lib/supabase/storage";

export type TopicWithSubtopics = {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  subtopics: SubtopicWithMaterials[];
  videos?: TopicVideo[];
};

export type SubtopicWithMaterials = {
  id: string;
  topicId: string;
  title: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  materials: MaterialWithUrl[];
};

export type MaterialWithUrl = {
  id: string;
  subtopicId: string;
  title: string;
  filePath: string;
  fileUrl?: string; // signed URL
  fileType: string | null;
  fileSize: number | null;
  order: number;
  createdAt: Date;
};

/**
 * Get all topics for a course with nested subtopics, materials, and videos.
 * Materials get signed URLs generated for them.
 */
export async function getCourseTopics(courseId: string): Promise<TopicWithSubtopics[]> {
  // Fetch topics
  const topicRows = await db
    .select()
    .from(topics)
    .where(eq(topics.courseId, courseId))
    .orderBy(asc(topics.order), asc(topics.createdAt));

  if (topicRows.length === 0) return [];

  const topicIds = topicRows.map((t) => t.id);

  // Fetch all topic videos
  const videoRows: TopicVideo[] = [];
  for (const tid of topicIds) {
    const vids = await db
      .select()
      .from(topicVideos)
      .where(eq(topicVideos.topicId, tid))
      .orderBy(asc(topicVideos.order), asc(topicVideos.createdAt));
    videoRows.push(...vids);
  }

  // Fetch all subtopics for these topics
  const subtopicRows: (typeof subtopics.$inferSelect)[] = [];
  for (const tid of topicIds) {
    const subs = await db
      .select()
      .from(subtopics)
      .where(eq(subtopics.topicId, tid))
      .orderBy(asc(subtopics.order), asc(subtopics.createdAt));
    subtopicRows.push(...subs);
  }

  // Fetch all materials for these subtopics
  const subtopicIds = subtopicRows.map((s) => s.id);
  const materialRows: (typeof subtopicMaterials.$inferSelect)[] = [];
  for (const sid of subtopicIds) {
    const mats = await db
      .select()
      .from(subtopicMaterials)
      .where(eq(subtopicMaterials.subtopicId, sid))
      .orderBy(asc(subtopicMaterials.order), asc(subtopicMaterials.createdAt));
    materialRows.push(...mats);
  }

  // Assemble the hierarchy
  const subtopicMap = new Map<string, SubtopicWithMaterials>();
  for (const sub of subtopicRows) {
    const materials = materialRows
      .filter((m) => m.subtopicId === sub.id)
      .map((mat) => ({
        ...mat,
        fileUrl: mat.filePath ? `/api/materials/${mat.id}/view` : undefined,
      }));

    subtopicMap.set(sub.id, {
      ...sub,
      materials: materials,
    });
  }

  return topicRows.map((topic) => ({
    ...topic,
    videos: videoRows.filter((v) => v.topicId === topic.id),
    subtopics: subtopicRows
      .filter((s) => s.topicId === topic.id)
      .map((s) => subtopicMap.get(s.id)!),
  }));
}

/**
 * Get a single topic by ID.
 */
export async function getTopic(topicId: string) {
  const result = await db.select().from(topics).where(eq(topics.id, topicId)).limit(1);
  return result[0] || null;
}
