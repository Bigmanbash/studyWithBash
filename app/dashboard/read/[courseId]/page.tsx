import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ReadCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = await params;
  const courseTitle = "Mathematics - SSS1 First Term";

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">

      {/* Reader Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-10">
        <div className="px-4 sm:px-6 h-14 flex items-center gap-4 max-w-5xl mx-auto w-full">

          <Link
            href="/dashboard/purchased"
            className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-[#676E85] hover:text-[#0A1B39] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex-1 flex justify-center">
            <span className="text-sm font-semibold text-[#0A1B39]">
              {courseTitle}
            </span>
          </div>

          {/* Balanced spacer */}
          <div className="shrink-0 w-14 sm:w-16" />
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div
          className="
            bg-white rounded-2xl border border-neutral-200/80
            shadow-[0_2px_16px_-4px_rgba(10,27,57,0.08)]
            flex items-center justify-center
            min-h-[70vh] sm:min-h-[76vh]
            overflow-hidden
          "
        >
          {/* PDF placeholder */}
          <div className="flex flex-col items-center text-center px-6 py-12">
            <div className="w-16 h-16 rounded-2xl bg-[#F0F4FF] flex items-center justify-center mb-5 shadow-inner">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
              >
                <rect x="6" y="2" width="20" height="28" rx="3" fill="#E3EAFF" />
                <rect x="6" y="2" width="20" height="28" rx="3" stroke="#7B9CFF" strokeWidth="1.5" />
                <path d="M11 11h10M11 16h10M11 21h6" stroke="#4F71E8" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 2v6h6" fill="none" stroke="#7B9CFF" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-[#0A1B39] mb-1.5">
              PDF Viewer
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              The course document will render here via the React PDF viewer component.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}