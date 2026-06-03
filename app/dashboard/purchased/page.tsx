"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, LayoutGrid, List } from "lucide-react";

const purchasedCourses = [
  { id: "mathematics-sss1", title: "Mathematics - SSS1 First Term", image: "/img/hero_section.png", date: "Oct 24, 2023" },
  { id: "english-sss1", title: "English Language - SSS1 First Term", image: "/img/hero_section.png", date: "Oct 22, 2023" },
  { id: "biology-sss1", title: "Biology - SSS1 First Term", image: "/img/hero_section.png", date: "Oct 20, 2023" },
  { id: "chemistry-sss1", title: "Chemistry - SSS1 First Term", image: "/img/hero_section.png", date: "Oct 15, 2023" },
];

export default function PurchasedCoursesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A1B39]">Purchased courses</h1>
        <p className="text-sm text-[#676E85] mt-1">Access all your purchased reading materials.</p>
      </div>

      {/* List header row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] text-[#676E85]">{purchasedCourses.length} materials</span>

        <div className="flex items-center gap-0.5 bg-neutral-100 border border-neutral-200 rounded-md p-1">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
              view === "grid"
                ? "bg-white text-[#17A546] shadow-sm border border-neutral-200"
                : "text-[#676E85] hover:text-[#0A1B39]"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
              view === "list"
                ? "bg-white text-[#17A546] shadow-sm border border-neutral-200"
                : "text-[#676E85] hover:text-[#0A1B39]"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {purchasedCourses.map((course) => (
            <div key={course.id} className="bg-white border border-neutral-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
              <div className="relative h-32 sm:h-40 w-full bg-neutral-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 sm:p-4 flex-1 flex flex-col gap-3">
                <h3 className="text-[13px] sm:text-sm font-semibold text-[#0A1B39] line-clamp-2 flex-1 leading-snug">
                  {course.title}
                </h3>
                <span className="text-[11px] text-[#676E85] bg-neutral-50 border border-neutral-100 px-2 py-1 rounded-md self-start">
                  {course.date}
                </span>
                <Link
                  href={`/dashboard/read/${course.id}`}
                  className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-md bg-[#17A546] hover:bg-[#128638] text-white text-[12px] sm:text-[13px] font-medium transition-colors mt-auto"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Open material
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="divide-y divide-neutral-100">
          {purchasedCourses.map((course) => (
            <div key={course.id} className="flex items-center gap-3 py-2.5">
              <div className="relative w-11 h-11 rounded-md overflow-hidden shrink-0 bg-neutral-100">
                <Image src={course.image} alt={course.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#0A1B39] truncate">{course.title}</p>
                <p className="text-[12px] text-[#676E85] mt-0.5">{course.date}</p>
              </div>
              <Link
                href={`/dashboard/read/${course.id}`}
                className="shrink-0 flex items-center gap-1.5 text-[12px] font-medium text-[#0A1B39] bg-neutral-50 border border-neutral-200 px-2.5 py-1.5 rounded-md hover:text-[#17A546] hover:bg-[#17A546]/10 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Open
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}