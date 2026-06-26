import { db } from "@/lib/neon";
import { courses, topics, subtopics, subtopicMaterials } from "@/lib/neon/schema";
import { eq, isNotNull } from "drizzle-orm";

/**
 * Migration script to move existing courses with a `pdfPath` 
 * into the new topic/subtopic/material hierarchy.
 */
export async function migrateLegacyCourses() {
  const coursesWithPdf = await db
    .select()
    .from(courses)
    .where(isNotNull(courses.pdfPath));

  let migratedCount = 0;

  for (const course of coursesWithPdf) {
    if (!course.pdfPath) continue;

    // Check if topics already exist to avoid double migration
    const existingTopics = await db
      .select()
      .from(topics)
      .where(eq(topics.courseId, course.id));
      
    if (existingTopics.length > 0) {
      continue;
    }

    // 1. Create a default topic
    const [topic] = await db.insert(topics).values({
      courseId: course.id,
      title: "Course Material",
      slug: "course-material",
      order: 0,
    }).returning();

    // 2. Create a default subtopic
    const [subtopic] = await db.insert(subtopics).values({
      topicId: topic.id,
      title: "Main Document",
      slug: "main-document",
      order: 0,
    }).returning();

    // 3. Create the material pointing to the legacy pdfPath
    await db.insert(subtopicMaterials).values({
      subtopicId: subtopic.id,
      title: "Full PDF",
      filePath: course.pdfPath,
      fileType: "application/pdf",
      order: 0,
    });

    migratedCount++;
  }

  console.log(`Successfully migrated ${migratedCount} legacy courses.`);
  return migratedCount;
}

// Execute if run directly
if (require.main === module || process.argv[1].endsWith("migrate-courses.ts")) {
  migrateLegacyCourses()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
