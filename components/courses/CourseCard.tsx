// components/courses/CourseCard.tsx
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export interface CourseData {
  slug: string;
  title: string;
  subject: string;
  level: string;
  topics: number;
  duration: string;
  progress?: number;
  color: string;
  iconBg: string;
}

export function CourseCard({ course }: { course: CourseData }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group relative block bg-white rounded-[24px] border border-neutral-200/60 p-1 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
    >
      {/* Soft background glow on hover */}
      <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full ${course.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />

      <div className="relative h-full bg-white rounded-[20px] p-6 flex flex-col z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${course.iconBg}`}>
            {course.level}
          </div>
          {course.progress !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#17A546]">{course.progress}%</span>
              <span className="text-[10px] text-[#98A2B3] uppercase tracking-wider font-medium">Done</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-[19px] leading-tight font-bold text-[#0A1B39] group-hover:text-[#17A546] transition-colors duration-300 mb-2.5">
            {course.title}
          </h3>
          <p className="text-sm text-[#676E85] line-clamp-2 leading-relaxed">
            {course.subject}
          </p>
        </div>

        <div className="mt-8">
          {/* Meta */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4 text-[13px] font-medium text-[#676E85]">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-[#98A2B3]" />
                <span>{course.topics} topics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#98A2B3]" />
                <span>{course.duration}</span>
              </div>
            </div>
            {/* Hover arrow indicator */}
            <div className="h-8 w-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-[#17A546] group-hover:text-white text-[#98A2B3] transition-all duration-300 transform group-hover:scale-110">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Progress bar */}
          {course.progress !== undefined ? (
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden relative">
              <div
                className={`absolute top-0 left-0 h-full rounded-full ${course.color} transition-all duration-1000 ease-out`}
                style={{ width: `${course.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full" />
              </div>
            </div>
          ) : (
            <div className="w-full h-1" /> // Spacer for alignment if no progress
          )}
        </div>
      </div>
    </Link>
  );
}
