// components/courses/CourseCard.tsx
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
  return (
    <Link
      href="/signup"
      className="group relative block bg-white rounded-md border border-neutral-200/80 p-6 shadow-2xs hover:border-[#17A546]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex flex-col h-full justify-between space-y-6">
        <div>
          {/* Level badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${course.iconBg}`}>
              {course.level}
            </span>
          </div>

          {/* Title + subject */}
          <h3 className="text-xl font-bold text-[#0A1B39] group-hover:text-[#17A546] transition-colors duration-200 mb-1.5">
            {course.title}
          </h3>
          <p className="text-xs text-[#676E85] leading-relaxed">
            {course.subject}
          </p>
        </div>

        {/* Price + CTA */}
        <div className="pt-4 border-t border-neutral-100 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-neutral-400 line-through font-medium mb-0.5">
                ₦{course.originalPrice.toLocaleString()}
              </p>
              <p className="text-xl font-bold text-[#17A546]">
                ₦{course.price.toLocaleString()}
              </p>
            </div>
            <span className="text-[10px] text-[#676E85] bg-neutral-50 border border-neutral-200/80 px-2 py-0.5 rounded-md font-medium">
              All 3 terms
            </span>
          </div>

          <div className="w-full bg-[#17A546]/10 text-[#17A546] group-hover:bg-[#17A546] group-hover:text-white transition-colors duration-200 rounded-md py-2.5 flex items-center justify-center gap-2 font-semibold text-xs">
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
