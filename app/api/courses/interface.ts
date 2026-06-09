import type { Course, NewCourse } from "@/lib/neon/schema";

export type { Course, NewCourse };

export interface CourseListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: "school" | "exam";
  status?: "active" | "draft";
}

export interface PaginatedCourses {
  data: Course[];
  total: number;
  page: number;
  limit: number;
}
