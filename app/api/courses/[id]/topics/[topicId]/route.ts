import { NextResponse } from "next/server";
import { updateTopic, deleteTopic, createSubtopic, reorderSubtopics } from "../mutations";
import { requireAdminSession } from "@/app/api/auth/queries";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string; topicId: string }> }
) => {
  try {
    await requireAdminSession();
    const { topicId } = await params;
    const body = await req.json();

    // Handle subtopic reordering
    if (body.reorderSubtopics && body.orderedIds) {
      await reorderSubtopics(topicId, body.orderedIds);
      return NextResponse.json({ success: true });
    }

    const updated = await updateTopic(topicId, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string; topicId: string }> }
) => {
  try {
    await requireAdminSession();
    const { topicId } = await params;
    await deleteTopic(topicId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// POST creates a subtopic within this topic
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string; topicId: string }> }
) => {
  try {
    await requireAdminSession();
    const { topicId } = await params;
    const body = await req.json();
    const subtopic = await createSubtopic(topicId, body);
    return NextResponse.json(subtopic);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
