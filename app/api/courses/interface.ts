import type { Course, NewCourse } from "@/lib/neon/schema";

export type { Course, NewCourse };

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
