import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";

const purchasedCourses = [
  {
    id: "mathematics-sss1",
    title: "Mathematics - SSS1 First Term",
    image: "/collection-accessories.png",
    date: "Oct 24, 2023",
  },
  {
    id: "english-sss1",
    title: "English Language - SSS1 First Term",
    image: "/collection-suits.png",
    date: "Oct 22, 2023",
  },
  {
    id: "biology-sss1",
    title: "Biology - SSS1 First Term",
    image: "/collection-casual.png",
    date: "Oct 20, 2023",
  },
  {
    id: "chemistry-sss1",
    title: "Chemistry - SSS1 First Term",
    image: "/img/hero_section.png",
    date: "Oct 15, 2023",
  },
];

export default function PurchasedCoursesPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1B39]">Purchased Courses</h1>
        <p className="text-[#676E85] mt-2">Access all your purchased reading materials.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {purchasedCourses.map((course) => (
          <div key={course.id} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
            <div className="relative h-48 w-full bg-neutral-100">
              <Image 
                src={course.image} 
                alt={course.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg text-[#0A1B39] line-clamp-2 mb-4 leading-tight">
                {course.title}
              </h3>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs font-medium text-[#676E85] bg-neutral-100 px-2 py-1 rounded-md">
                  {course.date}
                </span>
              </div>
              <div className="mt-4">
                <Link 
                  href={`/dashboard/read/${course.id}`}
                  className="flex items-center justify-center w-full bg-[#17A546] hover:bg-[#128638] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Open Material
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
