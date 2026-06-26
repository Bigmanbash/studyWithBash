import { NextResponse } from "next/server";
import { listCourses } from "./queries";
import { createCourse } from "./mutations";
import type { CourseListQuery, NewCourse } from "./interface";
import { requireAdminSession } from "@/app/api/auth/queries";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") as "school" | "exam" | undefined;
    const status = searchParams.get("status") as "active" | "draft" | undefined;

    const query: CourseListQuery = { page, limit, search, category, status };
    const courses = await listCourses(query);
    
    return NextResponse.json(courses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    await requireAdminSession();
    
    const body: NewCourse = await req.json();
    const newCourse = await createCourse(body);
    
    return NextResponse.json(newCourse);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    await requireAdminSession();
    const body = await req.json();
    const { ids } = body;
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    
    const { deleteCourses } = await import("./mutations");
    await deleteCourses(ids);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
