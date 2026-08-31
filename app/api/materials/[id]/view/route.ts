import { NextResponse } from "next/server";
import { getServerSession } from "@/app/api/auth/queries";
import { db } from "@/lib/neon/client";
import { subtopicMaterials, subtopics, topics, courses, payments } from "@/lib/neon/schema";
import { eq, and } from "drizzle-orm";
import { getSignedUrl } from "@/lib/r2";
import { PDFDocument } from "pdf-lib";

export const dynamic = "force-dynamic";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    
    // 1. Get material info and hierarchy
    const materialData = await db
      .select({
        filePath: subtopicMaterials.filePath,
        slug: courses.slug,
        courseId: courses.id,
        topicId: topics.id,
        subtopicId: subtopics.id,
      })
      .from(subtopicMaterials)
      .innerJoin(subtopics, eq(subtopicMaterials.subtopicId, subtopics.id))
      .innerJoin(topics, eq(subtopics.topicId, topics.id))
      .innerJoin(courses, eq(topics.courseId, courses.id))
      .where(eq(subtopicMaterials.id, id))
      .limit(1);

    if (!materialData.length || !materialData[0].filePath) {
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
          .select({ id: payments.id })
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

    // 2. Fetch original PDF securely from R2 on the server
    const signedUrl = await getSignedUrl(mat.filePath, 300);
    const response = await fetch(signedUrl);
    if (!response.ok) {
      console.error(`[material-view] Failed to fetch from storage (${response.status}): ${signedUrl}`);
      return NextResponse.json({ error: "Failed to fetch original file from storage" }, { status: 500 });
    }

    const arrayBuffer = await response.arrayBuffer();

    // 3. Full access: Admin or Paid Student
    if (isAdmin || isPurchased) {
      return new NextResponse(Buffer.from(arrayBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="material-${mat.slug || 'document'}.pdf"`,
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 4. Preview access: Check preview eligibility (first topic, first 2 subtopics)
    const allTopics = await db.query.topics.findMany({
      where: eq(topics.courseId, mat.courseId),
      orderBy: (topics, { asc }) => [asc(topics.order)],
      with: {
        subtopics: {
          orderBy: (subtopics, { asc }) => [asc(subtopics.order)],
        },
      },
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

    // 5. Generate 3-page preview safely
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const previewPdfDoc = await PDFDocument.create();
    const pagesToCopy = Math.min(3, pdfDoc.getPageCount());
    const pageIndices = Array.from({ length: pagesToCopy }, (_, i) => i);
    const copiedPages = await previewPdfDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => previewPdfDoc.addPage(page));
    const previewPdfBytes = await previewPdfDoc.save();

    return new NextResponse(Buffer.from(previewPdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="preview-${mat.slug || 'document'}.pdf"`,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error: any) {
    console.error("[material-view-route]", error);
    return NextResponse.json({ error: error.message || "Failed to load document" }, { status: 500 });
  }
};
