import { NextResponse } from "next/server";
import { requireAdminSession } from "@/app/api/auth/queries";
import { uploadFile } from "@/lib/r2";

export const POST = async (req: Request) => {
  try {
    await requireAdminSession();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const customPath = formData.get("path") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const path = customPath || `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const filePath = await uploadFile(path, file);

    return NextResponse.json({ filePath });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
};
