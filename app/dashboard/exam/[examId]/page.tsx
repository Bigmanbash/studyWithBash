import Link from "next/link";
import { ArrowLeft, BookX } from "lucide-react";
import { TermCategoryClient } from "@/components/courses/TermCategoryClient";
import { listCourses } from "@/app/api/courses/queries";
import { EmptyState } from "@/components/ui/EmptyState";

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
    price: c.price,
    originalPrice: c.originalPrice || undefined,
  }));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/dashboard"
            className="p-1.5 hover:bg-neutral-100 rounded-lg text-[#676E85] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold text-[#0A1B39]">{title}</h1>
        </div>
        <p className="text-sm text-[#676E85] mt-1 ml-[38px]">
          Get ready for your exams with our curated materials.
        </p>
      </div>

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
