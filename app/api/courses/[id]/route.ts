import { NextResponse } from "next/server";
import { getCourse } from "../queries";
import { updateCourse, deleteCourse } from "../mutations";
import { requireAdminSession } from "@/app/api/auth/queries";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const course = await getCourse(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await requireAdminSession();
    
    const { id } = await params;
    const body = await req.json();
    const updated = await updateCourse(id, body);
    
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await requireAdminSession();
    
    const { id } = await params;
    await deleteCourse(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
