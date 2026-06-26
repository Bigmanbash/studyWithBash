import { NextResponse } from "next/server";
import { getCourseTopics } from "./queries";
import { createTopic, reorderTopics } from "./mutations";
import { requireAdminSession } from "@/app/api/auth/queries";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const topicsData = await getCourseTopics(id);
    return NextResponse.json(topicsData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await req.json();
    const topic = await createTopic(id, body);
    return NextResponse.json(topic);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await req.json();

    if (body.orderedIds) {
      await reorderTopics(id, body.orderedIds);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
