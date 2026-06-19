import { NextResponse } from "next/server";
import { getServerSession } from "@/app/api/auth/queries";
import { getCourse } from "@/app/api/courses/queries";
import { PDFDocument } from "pdf-lib";

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

    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Create a new PDF for the preview
    const previewPdfDoc = await PDFDocument.create();
    
    // Calculate how many pages to copy (max 3)
    const pagesToCopy = Math.min(3, pdfDoc.getPageCount());
    const pageIndices = Array.from({ length: pagesToCopy }, (_, i) => i);
    
    // Copy the pages and add them to the new PDF
    const copiedPages = await previewPdfDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => previewPdfDoc.addPage(page));

    // Serialize the preview PDF
    const previewPdfBytes = await previewPdfDoc.save();

    return new NextResponse(previewPdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="preview-${course.slug}.pdf"`,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    });

  } catch (error: any) {
    console.error("[preview-route]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
