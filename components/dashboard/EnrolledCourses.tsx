import Link from "next/link";
import { ArrowRight } from "lucide-react";

const enrolledCourses = [
  { slug: "ss1-physics", title: "Physics (SS1)", progress: 72, color: "bg-blue-500", topics: "10/14 topics" },
  { slug: "ss1-chemistry", title: "Chemistry (SS1)", progress: 58, color: "bg-amber-500", topics: "7/12 topics" },
  { slug: "ss1-mathematics", title: "Mathematics (SS1)", progress: 85, color: "bg-[#17A546]", topics: "14/16 topics" },
];

export function EnrolledCourses() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#0A1B39]">My Courses</h3>
        <Link href="/courses" className="text-xs font-medium text-[#17A546] hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {enrolledCourses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
          >
            <div className={`h-10 w-10 rounded-xl ${course.color} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
              {course.title[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0A1B39] truncate group-hover:text-[#17A546] transition-colors">{course.title}</p>
              <p className="text-xs text-[#98A2B3] mt-0.5">{course.topics}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-16 bg-neutral-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                <div className={`h-full rounded-full ${course.color}`} style={{ width: `${course.progress}%` }} />
              </div>
              <span className="text-xs font-bold text-[#0A1B39]">{course.progress}%</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
