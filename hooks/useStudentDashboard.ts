import { useQuery } from "@tanstack/react-query";
import type { Course } from "@/lib/neon/schema";

interface DashboardData {
  purchased: Course[];
  available: Course[];
  page: number;
  limit: number;
}

interface CourseDetailsData {
  course: Course;
  isPurchased: boolean;
}

const fetchDashboardData = async (page: number = 1, limit: number = 10): Promise<DashboardData> => {
  const res = await fetch(`/api/dashboard/student?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return res.json();
};

const fetchCourseDetails = async (courseId: string): Promise<CourseDetailsData> => {
  const res = await fetch(`/api/dashboard/course/${courseId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch course details");
  }
  return res.json();
};

export const useStudentDashboard = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["studentDashboard", page, limit],
    queryFn: () => fetchDashboardData(page, limit),
  });
};

export const useCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => fetchCourseDetails(courseId),
    enabled: !!courseId,
  });
};
