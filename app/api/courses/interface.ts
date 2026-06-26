import type { Course, NewCourse, Topic, NewTopic, Subtopic, NewSubtopic, SubtopicMaterial, NewSubtopicMaterial } from "@/lib/neon/schema";

export type { Course, NewCourse, Topic, NewTopic, Subtopic, NewSubtopic, SubtopicMaterial, NewSubtopicMaterial };

export interface CourseListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: "school" | "exam";
  level?: "SSS1" | "SSS2" | "SSS3";
  term?: "first" | "second" | "third";
  subject?: string;
  status?: "active" | "draft";
}

export interface PaginatedCourses {
  data: Course[];
  total: number;
  page: number;
  limit: number;
}

export type TopicWithSubtopics = Topic & {
  subtopics: SubtopicWithMaterials[];
};

export type SubtopicWithMaterials = Subtopic & {
  materials: MaterialWithUrl[];
};

export type MaterialWithUrl = SubtopicMaterial & {
  fileUrl?: string; // signed URL
};
