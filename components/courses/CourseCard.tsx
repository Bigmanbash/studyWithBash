import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  const displayOriginalPrice = course.originalPrice > course.price ? course.originalPrice : 4500;

  return (
    <Link
      href="/signup"
      className="group relative flex flex-col justify-between bg-white rounded-md border border-neutral-200/80 p-4 sm:p-5 shadow-2xs hover:border-[#17A546]/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex flex-col justify-between h-full space-y-4">
        <div>
          {/* Level badge */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${course.iconBg}`}>
              {course.level}
            </span>
            <span className="text-[10px] text-[#676E85] font-medium bg-neutral-50 border border-neutral-200/60 px-1.5 py-0.5 rounded">
              All 3 terms
            </span>
          </div>

          {/* Title + subject */}
          <h3 className="text-base font-bold text-[#0A1B39] group-hover:text-[#17A546] transition-colors duration-200 mb-1">
            {course.title}
          </h3>
          <p className="text-xs text-[#676E85] leading-relaxed line-clamp-2">
            {course.subject}
          </p>
        </div>

        {/* Price + CTA in compact row */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-neutral-400 line-through font-medium leading-none mb-0.5">
              ₦{displayOriginalPrice.toLocaleString()}
            </p>
            <p className="text-base sm:text-lg font-bold text-[#17A546] leading-tight">
              ₦{course.price.toLocaleString()}
            </p>
          </div>

          <div className="bg-[#17A546]/10 text-[#17A546] group-hover:bg-[#17A546] group-hover:text-white transition-colors duration-200 rounded-md py-1.5 px-3 flex items-center gap-1.5 font-bold text-xs shrink-0">
            <span>Get Started</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
