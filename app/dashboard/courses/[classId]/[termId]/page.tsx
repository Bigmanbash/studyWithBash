import Link from "next/link";
import { BookX } from "lucide-react";
import { TermCategoryClient } from "@/components/courses/TermCategoryClient";
import { listCourses } from "@/app/api/courses/queries";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/dashboard";

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
    price: c.price / 100,
  }));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      <PageHeader
        title={title}
        description="Browse available subjects for this term."
        backHref="/dashboard"
      />

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