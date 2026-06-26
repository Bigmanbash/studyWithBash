import { NextResponse } from "next/server";
import { createMaterial, deleteMaterial } from "../../../../mutations";
import { requireAdminSession } from "@/app/api/auth/queries";
import { uploadFile } from "@/lib/supabase/storage";

// POST — upload a material file to a subtopic
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string; topicId: string; subtopicId: string }> }
) => {
  try {
    await requireAdminSession();
    const { subtopicId } = await params;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || file?.name || "Untitled";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop();
    const filename = `materials/${subtopicId}/${Date.now()}-${file.name}`;
    const filePath = await uploadFile(filename, file);

    // Save in DB
    const material = await createMaterial(subtopicId, {
      title,
      filePath,
      fileType: file.type || ext || undefined,
      fileSize: file.size,
    });

    return NextResponse.json(material);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
