import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";

const recentPurchases = [
  {
    id: "1",
    title: "English Language - SSS1 First Term",
    image: "/collection-accessories.png",
    date: "Oct 24, 2023",
  },
  {
    id: "2",
    title: "Biology - SSS1 First Term",
    image: "/collection-suits.png",
    date: "Oct 22, 2023",
  },
  {
    id: "3",
    title: "Chemistry - SSS1 First Term",
    image: "/collection-casual.png",
    date: "Oct 20, 2023",
  },
];

export function RecentlyPurchased() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#0A1B39]">Recently Purchased</h3>
        <Link href="/dashboard/purchased" className="text-sm font-medium text-[#17A546] hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentPurchases.map((course) => (
          <div key={course.id} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative h-40 w-full bg-neutral-100">
              <Image 
                src={course.image} 
                alt={course.title} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="font-semibold text-[#0A1B39] line-clamp-2 mb-4">{course.title}</h4>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-[#676E85]">{course.date}</span>
                <Link 
                  href={`/dashboard/read/${course.id}`}
                  className="inline-flex items-center justify-center bg-neutral-50 hover:bg-[#17A546]/10 text-[#0A1B39] hover:text-[#17A546] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Open
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
