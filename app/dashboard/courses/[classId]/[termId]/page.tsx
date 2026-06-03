import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TermCategoryClient } from "@/components/courses/TermCategoryClient";

export default async function TermCategoryPage({ params }: { params: Promise<{ classId: string; termId: string }> }) {
  const resolvedParams = await params;

  const formattedClass = resolvedParams.classId.toUpperCase();
  const formattedTerm = resolvedParams.termId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const title = `${formattedClass} - ${formattedTerm}`;

  const availableCourses = [
    { id: "maths-term", title: `Mathematics - ${title}`, image: "/img/hero_section.png", price: 2500 },
    { id: "english-term", title: `English Language - ${title}`, image: "/img/hero_section.png", price: 2500 },
    { id: "biology-term", title: `Biology - ${title}`, image: "/img/hero_section.png", price: 2500 },
    { id: "chemistry-term", title: `Chemistry - ${title}`, image: "/img/hero_section.png", price: 2500 },
    { id: "physics-term", title: `Physics - ${title}`, image: "/img/hero_section.png", price: 2500 },
  ];

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

      <TermCategoryClient courses={availableCourses} />
    </div>
  );
}