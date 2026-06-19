import Link from "next/link";
import { BookX } from "lucide-react";
import { TermCategoryClient } from "@/components/courses/TermCategoryClient";
import { listCourses } from "@/app/api/courses/queries";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/dashboard";

export default async function ExamCategoryPage({ params }: { params: Promise<{ examId: string }> }) {
  const resolvedParams = await params;
  const examId = resolvedParams.examId;
  const title = examId.toUpperCase() + " Preparation";

  // Fetch actual exam courses from DB
  const { data: courses } = await listCourses({
    limit: 50,
    category: "exam",
    subject: examId,
    status: "active"
  });

  const availableCourses = courses.map(c => ({
    id: c.id,
    title: c.title,
    image: c.coverImagePath || "/img/hero_section.png",
    price: c.price / 100,
    originalPrice: c.originalPrice ? c.originalPrice / 100 : undefined,
  }));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      <PageHeader
        title={title}
        description="Get ready for your exams with our curated materials."
        backHref="/dashboard"
      />

      {availableCourses.length > 0 ? (
        <TermCategoryClient courses={availableCourses} />
      ) : (
        <EmptyState
          icon={<BookX className="w-8 h-8" strokeWidth={1.5} />}
          title="No exam materials found"
          description={`There are currently no preparation materials available for ${examId.toUpperCase()}. Please check back later.`}
        />
      )}
    </div>
  );
}
