import { NextRequest, NextResponse } from "next/server";
import { listStudents, getStudent, toggleStudentStatus, getAdminStudentStats } from "./queries";
import { requireAdminSession } from "@/app/api/auth/queries";

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
    const status = (searchParams.get("status") || undefined) as any;

    const [result, stats] = await Promise.all([
      listStudents({ page, limit, search, status }),
      getAdminStudentStats()
    ]);
    
    return NextResponse.json({ ...result, stats });
  } catch (error) {
    console.error("Error in /api/students route:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdminSession();
    const { id, isSuspended } = await request.json();
    
    if (!id || typeof isSuspended !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updated = await toggleStudentStatus(id, isSuspended);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH /api/students Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: error.message === "UNAUTHORIZED" ? 401 : 500 });
  }
}
