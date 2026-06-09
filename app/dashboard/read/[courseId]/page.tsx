"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { EmbedPDF } from "@/components/dashboard";
import { use, Suspense } from "react";

// In a real app this would come from your DB / API via courseId
const COURSE_DOC_URL =
  "https://docs.google.com/document/d/1M2O-TLvjWXkpCYIOs3wQg2paTcu0ExuBSaOJZz6TwB8/edit?usp=sharing";

function ReadCourseContent({
  courseId,
}: {
  courseId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const courseTitle = "Mathematics – SSS1 First Term";
  const subject = "Mathematics";
  const term = "First Term";

  const handleRequestPurchase = () => {
    // Navigate back to the course detail / checkout page
    router.push(`/dashboard/course/${courseId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F9FC] overflow-hidden">

      {/* ── Reader Header ───────────────────────────────────────────── */}
      <header className="shrink-0 bg-white/90 backdrop-blur-md border-b border-neutral-100/80 sticky top-0 z-20">
        <div className="px-4 sm:px-6 h-14 flex items-center gap-4 max-w-screen-xl mx-auto w-full">

          {/* Back */}
          <Link
            href={isPreview ? `/dashboard/course/${courseId}` : "/dashboard/purchased"}
            className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-[#676E85] hover:text-[#0A1B39] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          {/* Title — centred */}
          <div className="flex-1 flex justify-center min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="shrink-0 w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-[#4F71E8]" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#0A1B39] truncate leading-none mb-0.5">
                  {courseTitle}
                </p>
                <p className="text-[11px] text-neutral-400 leading-none">
                  {subject} · {term}
                  {isPreview && (
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-semibold border border-amber-200/60">
                      PREVIEW
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Spacer to keep title centred */}
          <div className="shrink-0 w-14 sm:w-16" />
        </div>
      </header>

      {/* ── PDF Viewer ──────────────────────────────────────────────── */}
      <main className="flex-1 min-h-0 px-3 sm:px-5 lg:px-8 py-3 sm:py-4">
        <div
          className="
            h-full w-full max-w-screen-xl mx-auto
            bg-white rounded-2xl
            border border-neutral-200/70
            shadow-[0_2px_20px_-4px_rgba(10,27,57,0.07)]
            overflow-hidden
          "
        >
          <EmbedPDF
            src={COURSE_DOC_URL}
            title={courseTitle}
            isPreview={isPreview}
            previewPageLimit={3}
            onRequestPurchase={handleRequestPurchase}
          />
        </div>
      </main>
    </div>
  );
}

export default function ReadCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);

  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="w-8 h-8 border-3 border-neutral-200 border-t-[#17A546] rounded-full animate-spin" />
      </div>
    }>
      <ReadCourseContent courseId={courseId} />
    </Suspense>
  );
}