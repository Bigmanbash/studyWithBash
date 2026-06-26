import { NextResponse } from "next/server";
import { getServerSession } from "@/app/api/auth/queries";
import { db } from "@/lib/neon/client";
import { subtopicMaterials, subtopics, topics, courses, payments } from "@/lib/neon/schema";
import { eq, and } from "drizzle-orm";
import { getSignedUrl } from "@/lib/supabase/storage";
import { PDFDocument } from "pdf-lib";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    
    // Get material info and its hierarchy
    const materialData = await db
      .select({
        filePath: subtopicMaterials.filePath,
        slug: courses.slug,
        courseId: courses.id,
        topicId: topics.id,
        subtopicId: subtopics.id
      })
      .from(subtopicMaterials)
      .innerJoin(subtopics, eq(subtopicMaterials.subtopicId, subtopics.id))
      .innerJoin(topics, eq(subtopics.topicId, topics.id))
      .innerJoin(courses, eq(topics.courseId, courses.id))
      .where(eq(subtopicMaterials.id, id))
      .limit(1);

    if (!materialData.length) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const mat = materialData[0];
    
    let isPurchased = false;
    let isAdmin = false;

    const session = await getServerSession();
    if (session) {
      if (session.role === "admin") {
        isAdmin = true;
      } else {
        const p = await db
          .select()
          .from(payments)
          .where(and(
            eq(payments.userId, session.id), 
            eq(payments.courseId, mat.courseId),
            eq(payments.status, "approved")
          ))
          .limit(1);
        if (p.length > 0) isPurchased = true;
      }
    }

    if (isAdmin || isPurchased) {
      // Return Signed URL redirect
      const signedUrl = await getSignedUrl(mat.filePath, 3600);
      return NextResponse.redirect(signedUrl);
    }

    // It's a Preview!
    // We need to check if this subtopic is eligible for preview.
    // Rule: first topic, first 2 subtopics.
    const allTopics = await db.query.topics.findMany({
      where: eq(topics.courseId, mat.courseId),
      orderBy: (topics, { asc }) => [asc(topics.order)],
      with: {
        subtopics: {
          orderBy: (subtopics, { asc }) => [asc(subtopics.order)],
        }
      }
    });

    let isEligible = false;
    if (allTopics.length > 0) {
      const firstTopic = allTopics[0];
      if (firstTopic.id === mat.topicId) {
        const subIndex = firstTopic.subtopics.findIndex(s => s.id === mat.subtopicId);
        if (subIndex >= 0 && subIndex < 2) {
          isEligible = true;
        }
      }
    }

    if (!isEligible) {
      return NextResponse.json({ error: "Forbidden - Purchase Required" }, { status: 403 });
    }

    // Fetch the original PDF via a quick signed URL
    const signedUrl = await getSignedUrl(mat.filePath, 60);
    const response = await fetch(signedUrl);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch original PDF" }, { status: 500 });
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const previewPdfDoc = await PDFDocument.create();
    const pagesToCopy = Math.min(3, pdfDoc.getPageCount());
    const pageIndices = Array.from({ length: pagesToCopy }, (_, i) => i);
    const copiedPages = await previewPdfDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => previewPdfDoc.addPage(page));
    const previewPdfBytes = await previewPdfDoc.save();

    return new NextResponse(previewPdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="preview-${mat.slug}.pdf"`,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    });

  } catch (error: any) {
    console.error("[material-view-route]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
