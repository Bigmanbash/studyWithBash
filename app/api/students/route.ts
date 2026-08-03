import { NextRequest, NextResponse } from "next/server";
import { listStudents, getStudent } from "./queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const student = await getStudent(id);
      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
      return NextResponse.json(student);
    }

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || undefined;

    const result = await listStudents({ page, limit, search });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/students route:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
