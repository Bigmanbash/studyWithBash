import { NextResponse } from "next/server";
import { getServerSession } from "@/app/api/auth/queries";
import { getCourse } from "@/app/api/courses/queries";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const course = await getCourse(id);
    
    if (!course || !course.pdfPath) {
      return NextResponse.json({ error: "Course or PDF not found" }, { status: 404 });
    }

    // Fetch the original PDF
    const response = await fetch(course.pdfPath);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch original PDF" }, { status: 500 });
    }
    
    const arrayBuffer = await response.arrayBuffer();

    // Stream intact PDF directly (preserves encryption dictionary and stream integrity)
    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="preview-${course.slug}.pdf"`,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error: any) {
    console.error("[preview-route]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
