import { NextResponse } from "next/server";
import { db } from "@/lib/neon";
import { topicVideos } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/app/api/auth/queries";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; topicId: string }> }
) {
  try {
    await requireAdminSession();
    const { topicId } = await params;
    const body = await request.json();
    const { title, videoUrl } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "Title and videoUrl are required" },
        { status: 400 }
      );
    }

    const [video] = await db
      .insert(topicVideos)
      .values({
        topicId,
        title,
        videoUrl,
      })
      .returning();

    return NextResponse.json(video);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request
) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 }
      );
    }

    await db.delete(topicVideos).where(eq(topicVideos.id, videoId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
