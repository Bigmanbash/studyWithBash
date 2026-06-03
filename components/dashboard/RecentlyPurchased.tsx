import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";

const recentPurchases = [
  {
    id: "1",
    title: "English Language - SSS1 First Term",
    image: "/img/hero_section.png",
    date: "Oct 24, 2023",
  },
  {
    id: "2",
    title: "Biology - SSS1 First Term",
    image: "/img/hero_section.png",
    date: "Oct 22, 2023",
  },
  {
    id: "3",
    title: "Chemistry - SSS1 First Term",
    image: "/img/hero_section.png",
    date: "Oct 20, 2023",
  },
];

export function RecentlyPurchased() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-[#0A1B39]">Recently purchased</h3>
        <Link href="/dashboard/purchased" className="text-[13px] text-[#17A546]">View all</Link>
      </div>

      <div className="divide-y divide-neutral-100">
        {recentPurchases.map((course) => (
          <div key={course.id} className="flex items-center gap-3 py-2.5">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
              <Image src={course.image} alt={course.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#0A1B39] truncate">{course.title}</p>
              <p className="text-[12px] text-[#676E85]">{course.date}</p>
            </div>
            <Link
              href={`/dashboard/read/${course.id}`}
              className="shrink-0 flex items-center gap-1.5 text-[12px] font-medium text-[#0A1B39] bg-neutral-50 border border-neutral-200 px-2.5 py-1.5 rounded-lg"
            >
              <FileText className="w-3.5 h-3.5" />
              Open
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
