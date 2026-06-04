// components/courses/CourseCard.tsx
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export interface CourseData {
  slug: string;
  title: string;
  subject: string;
  level: string;
  materialsCount?: number;
  originalPrice: number;
  price: number;
  color: string;
  iconBg: string;
}

export function CourseCard({ course }: { course: CourseData }) {
  return (
    <Link
      href="/signup"
      className="group relative block bg-white rounded-[24px] border border-neutral-200/60 p-1 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
    >
      <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full ${course.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />

      <div className="relative h-full bg-white rounded-[20px] p-6 flex flex-col z-10">
        {/* Level badge */}
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${course.iconBg}`}>
            {course.level}
          </div>
        </div>

        {/* Title + subject */}
        <div className="flex-1">
          <h3 className="text-[22px] leading-tight font-bold text-[#0A1B39] group-hover:text-[#17A546] transition-colors duration-300 mb-2">
            {course.title}
          </h3>
          <p className="text-sm text-[#676E85] leading-relaxed">
            {course.subject}
          </p>
        </div>

        {/* Price + CTA */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-neutral-400 line-through font-medium mb-0.5">
                ₦{course.originalPrice.toLocaleString()}
              </p>
              <p className="text-2xl font-bold text-[#17A546]">
                ₦{course.price.toLocaleString()}
              </p>
            </div>
            <span className="text-[11px] text-[#676E85] bg-neutral-50 border border-neutral-100 px-2 py-1 rounded-md font-medium">
              All 3 terms
            </span>
          </div>

          <div className="w-full bg-[#17A546]/10 text-[#17A546] group-hover:bg-[#17A546] group-hover:text-white transition-colors duration-300 rounded-xl py-3 flex items-center justify-center gap-2 font-semibold text-sm">
            Get Started <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
