import Link from "next/link";
import { FileDown, FileText } from "lucide-react";
import type { Course } from "@/lib/neon/schema";

interface ContinueReadingProps {
  course: Course;
}

export function ContinueReading({ course }: ContinueReadingProps) {
  if (!course) return null;

  return (
    <div className="bg-[#070D17] rounded-[20px] px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 relative overflow-hidden border border-[#17A546]/20">
      {/* Subtle radial glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-[#17A546]/25 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

      {/* Left: icon + info */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 z-10 min-w-0">
        <div className="hidden sm:flex shrink-0 w-11 h-11 rounded-xl bg-[#17A546]/15 border border-[#17A546]/30 items-center justify-center">
          <FileText className="w-5 h-5 text-[#17A546]" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-[#17A546]/85 mb-0.5">
            Last opened · PDF
          </p>
          <p className="text-white font-semibold text-sm sm:text-[17px] leading-tight truncate">
            {course.title}
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 w-20 sm:w-auto h-[3px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[0%] bg-[#17A546] rounded-full" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-white/35 whitespace-nowrap">30% · Pg 4</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/dashboard/read/${course.id}`}
        className="shrink-0 z-10 flex items-center gap-1.5 sm:gap-2 bg-[#17A546] hover:bg-[#128638] text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-xs sm:text-[13px] font-medium transition-colors duration-150"
      >
        <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Open PDF</span>
        <span className="sm:hidden">Open</span>
      </Link>
    </div>
  );
}