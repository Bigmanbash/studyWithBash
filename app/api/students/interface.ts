import type { User, Payment, Course } from "@/lib/neon/schema";

export type Student = User;

export interface StudentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  // Can add status/active later if we add a status field
}

export interface PaginatedStudents {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

export interface StudentWithPurchases extends Student {
  purchases: (Payment & { course: Course })[];
}
