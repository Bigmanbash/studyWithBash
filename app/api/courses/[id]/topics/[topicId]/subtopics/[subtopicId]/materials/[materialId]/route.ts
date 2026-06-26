import { NextResponse } from "next/server";
import { deleteMaterial } from "../../../../../mutations";
import { requireAdminSession } from "@/app/api/auth/queries";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string; topicId: string; subtopicId: string; materialId: string }> }
) => {
  try {
    await requireAdminSession();
    const { materialId } = await params;
    await deleteMaterial(materialId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
