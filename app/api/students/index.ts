export * from "./interface";

export async function fetchStudents(params: { page?: number; limit?: number; search?: string } = {}) {
  const url = new URL("/api/students", window.location.origin);
  if (params.page) url.searchParams.set("page", params.page.toString());
  if (params.limit) url.searchParams.set("limit", params.limit.toString());
  if (params.search) url.searchParams.set("search", params.search);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }
  return res.json();
}

export async function fetchStudentById(id: string) {
  const url = new URL("/api/students", window.location.origin);
  url.searchParams.set("id", id);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch student details");
  }
  return res.json();
}
