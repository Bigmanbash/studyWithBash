import { CourseCard } from "@/components/dashboard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TermCategoryPage({ params }: { params: Promise<{ classId: string, termId: string }> }) {
  const resolvedParams = await params;
  
  // Transform params into readable title
  const formattedClass = resolvedParams.classId.toUpperCase();
  const formattedTerm = resolvedParams.termId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const title = `${formattedClass} - ${formattedTerm}`;

  const availableCourses = [
    {
      id: "maths-term",
      title: `Mathematics - ${title}`,
      image: "/collection-accessories.png",
      price: 2500,
    },
    {
      id: "english-term",
      title: `English Language - ${title}`,
      image: "/collection-suits.png",
      price: 2500,
    },
    {
      id: "biology-term",
      title: `Biology - ${title}`,
      image: "/collection-casual.png",
      price: 2500,
    },
    {
      id: "chemistry-term",
      title: `Chemistry - ${title}`,
      image: "/img/hero_section.png",
      price: 2500,
    },
    {
      id: "physics-term",
      title: `Physics - ${title}`,
      image: "/collection-accessories.png",
      price: 2500,
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
        <p className="text-[#676E85] ml-11">Browse available subjects for this term.</p>
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
