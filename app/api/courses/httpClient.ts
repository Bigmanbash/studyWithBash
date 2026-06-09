import { apiFetch } from "@/app/api/auth/httpClient";
import type { Course, NewCourse, CourseListQuery, PaginatedCourses } from "./interface";

export const fetchCourses = async (query: CourseListQuery = {}): Promise<PaginatedCourses> => {
  const params = new URLSearchParams();
  if (query.page) params.append("page", query.page.toString());
  if (query.limit) params.append("limit", query.limit.toString());
  if (query.search) params.append("search", query.search);
  if (query.category) params.append("category", query.category);
  if (query.status) params.append("status", query.status);

  return apiFetch<PaginatedCourses>(`/api/courses?${params.toString()}`);
};

export const fetchCourseById = async (id: string): Promise<Course> => {
  return apiFetch<Course>(`/api/courses/${id}`);
};

export const createCourseRequest = async (data: NewCourse): Promise<Course> => {
  return apiFetch<Course>("/api/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateCourseRequest = async (id: string, data: Partial<NewCourse>): Promise<Course> => {
  return apiFetch<Course>(`/api/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteCourseRequest = async (id: string): Promise<void> => {
  return apiFetch<void>(`/api/courses/${id}`, {
    method: "DELETE",
  });
};
