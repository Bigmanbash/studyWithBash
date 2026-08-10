export * from "./interface";

export async function fetchStudents(params: { page?: number; limit?: number; search?: string; status?: "all" | "active" | "inactive" } = {}) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = new URL("/api/students", origin || "http://localhost:3000");
  if (params.page) url.searchParams.set("page", params.page.toString());
  if (params.limit) url.searchParams.set("limit", params.limit.toString());
  if (params.search) url.searchParams.set("search", params.search);
  if (params.status && params.status !== "all") url.searchParams.set("status", params.status);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }
  return res.json();
}

export async function fetchStudentById(id: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = new URL("/api/students", origin || "http://localhost:3000");
  url.searchParams.set("id", id);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch student details");
  }
  return res.json();
}

export async function toggleStudent(id: string, isSuspended: boolean) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = new URL("/api/students", origin || "http://localhost:3000");
  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, isSuspended }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to toggle student status");
  }
  return res.json();
}
