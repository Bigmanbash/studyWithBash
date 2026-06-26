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

// --- Topics ---

export const fetchCourseTopics = async (courseId: string): Promise<import('./interface').TopicWithSubtopics[]> => {
  return apiFetch<import('./interface').TopicWithSubtopics[]>(`/api/courses/${courseId}/topics`);
};

export const createTopicRequest = async (courseId: string, data: { title: string }): Promise<import('./interface').Topic> => {
  return apiFetch<import('./interface').Topic>(`/api/courses/${courseId}/topics`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTopicRequest = async (courseId: string, topicId: string, data: { title?: string; order?: number }): Promise<import('./interface').Topic> => {
  return apiFetch<import('./interface').Topic>(`/api/courses/${courseId}/topics/${topicId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteTopicRequest = async (courseId: string, topicId: string): Promise<void> => {
  return apiFetch<void>(`/api/courses/${courseId}/topics/${topicId}`, {
    method: "DELETE",
  });
};

export const reorderTopicsRequest = async (courseId: string, orderedIds: string[]): Promise<void> => {
  return apiFetch<void>(`/api/courses/${courseId}/topics`, {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });
};

// --- Subtopics ---

export const createSubtopicRequest = async (courseId: string, topicId: string, data: { title: string }): Promise<import('./interface').Subtopic> => {
  return apiFetch<import('./interface').Subtopic>(`/api/courses/${courseId}/topics/${topicId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateSubtopicRequest = async (courseId: string, topicId: string, subtopicId: string, data: { title?: string; order?: number }): Promise<import('./interface').Subtopic> => {
  return apiFetch<import('./interface').Subtopic>(`/api/courses/${courseId}/topics/${topicId}/subtopics/${subtopicId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteSubtopicRequest = async (courseId: string, topicId: string, subtopicId: string): Promise<void> => {
  return apiFetch<void>(`/api/courses/${courseId}/topics/${topicId}/subtopics/${subtopicId}`, {
    method: "DELETE",
  });
};

export const reorderSubtopicsRequest = async (courseId: string, topicId: string, orderedIds: string[]): Promise<void> => {
  return apiFetch<void>(`/api/courses/${courseId}/topics/${topicId}`, {
    method: "PATCH",
    body: JSON.stringify({ reorderSubtopics: true, orderedIds }),
  });
};

// --- Materials ---

export const uploadMaterialRequest = async (courseId: string, topicId: string, subtopicId: string, file: File, title: string): Promise<import('./interface').SubtopicMaterial> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  const res = await fetch(`/api/courses/${courseId}/topics/${topicId}/subtopics/${subtopicId}/materials`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(errorBody || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<import('./interface').SubtopicMaterial>;
};

export const deleteMaterialRequest = async (courseId: string, topicId: string, subtopicId: string, materialId: string): Promise<void> => {
  return apiFetch<void>(`/api/courses/${courseId}/topics/${topicId}/subtopics/${subtopicId}/materials/${materialId}`, {
    method: "DELETE",
  });
};
