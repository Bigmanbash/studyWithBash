import { NextResponse } from "next/server";
import { updateSubtopic, deleteSubtopic } from "../../../mutations";
import { requireAdminSession } from "@/app/api/auth/queries";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string; topicId: string; subtopicId: string }> }
) => {
  try {
    await requireAdminSession();
    const { subtopicId } = await params;
    const body = await req.json();
    const updated = await updateSubtopic(subtopicId, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string; topicId: string; subtopicId: string }> }
) => {
  try {
    await requireAdminSession();
    const { subtopicId } = await params;
    await deleteSubtopic(subtopicId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
