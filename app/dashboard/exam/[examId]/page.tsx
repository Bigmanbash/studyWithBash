import { CourseCard } from "@/components/dashboard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ExamCategoryPage({ params }: { params: Promise<{ examId: string }> }) {
  const resolvedParams = await params;
  const title = resolvedParams.examId.toUpperCase() + " Preparation";

  const availableCourses = [
    {
      id: `${(await params).examId}-maths`,
      title: `Mathematics Past Questions & Answers`,
      image: "/collection-accessories.png",
      price: 3500,
      originalPrice: 5000,
    },
    {
      id: `${(await params).examId}-english`,
      title: `English Language Intensive Guide`,
      image: "/collection-suits.png",
      price: 3500,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard" className="p-2 hover:bg-neutral-100 rounded-full text-[#676E85] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-[#0A1B39]">{title}</h1>
        </div>
        <p className="text-[#676E85] ml-11">Get ready for your exams with our curated materials.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {availableCourses.map((course) => (
          <CourseCard
            key={course.id}
            {...course}
            isPurchased={false}
          />
        ))}
      </div>
    </div>
  );
}
