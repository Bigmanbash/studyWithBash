import Link from "next/link";
import { ArrowLeft, BookX } from "lucide-react";
import { TermCategoryClient } from "@/components/courses/TermCategoryClient";
import { listCourses } from "@/app/api/courses/queries";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function TermCategoryPage({ params }: { params: Promise<{ classId: string; termId: string }> }) {
  const resolvedParams = await params;

  const formattedClass = resolvedParams.classId.toUpperCase();
  const formattedTerm = resolvedParams.termId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const title = `${formattedClass} - ${formattedTerm}`;

  const levelEnum = formattedClass as "SSS1" | "SSS2" | "SSS3";
  const termEnum = resolvedParams.termId.split("-")[0] as "first" | "second" | "third";

  // Fetch actual courses from DB
  const { data: courses } = await listCourses({
    limit: 50,
    category: "school",
    level: levelEnum,
    term: termEnum,
    status: "active"
  });

  const availableCourses = courses.map(c => ({
    id: c.id,
    title: c.title,
    image: c.coverImagePath || "/img/hero_section.png",
    price: c.price,
  }));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/dashboard"
            className="p-1.5 hover:bg-neutral-100 rounded-md text-[#676E85] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold text-[#0A1B39]">{title}</h1>
        </div>
        <p className="text-sm text-[#676E85] ml-9">Browse available subjects for this term.</p>
      </div>

      {availableCourses.length > 0 ? (
        <TermCategoryClient courses={availableCourses} />
      ) : (
        <EmptyState
          icon={<BookX className="w-8 h-8" strokeWidth={1.5} />}
          title="No courses found"
          description={`There are currently no courses available for ${title}. Please check back later.`}
        />
      )}
    </div>
  );
}