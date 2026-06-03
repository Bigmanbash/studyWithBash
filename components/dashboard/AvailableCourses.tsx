"use client";

import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { useState } from "react";

const availableCourses = [
  {
    id: "mathematics-sss1",
    title: "Mathematics - SSS1 First Term",
     image: "/img/hero_section.png",
    price: 2500,
    originalPrice: 3500,
  },
  {
    id: "english-sss1",
    title: "English Language - SSS1 First Term",
    image: "/img/hero_section.png",
    price: 2500,
  },
  {
    id: "biology-sss1",
    title: "Biology - SSS1 First Term",
    image: "/img/hero_section.png",
    price: 2500,
    originalPrice: 3500,
  },
  {
    id: "chemistry-sss1",
    title: "Chemistry - SSS1 First Term",
    image: "/img/hero_section.png",
    price: 2500,
  },
];

export function AvailableCourses({ title = "Available Courses" }: { title?: string }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-[#0A1B39]">{title}</h3>

        <div className="flex items-center gap-0.5 bg-neutral-100 border border-neutral-200 rounded-lg p-1">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
              view === "grid"
                ? "bg-white text-[#17A546] shadow-sm border border-neutral-200"
                : "text-[#676E85] hover:text-[#0A1B39]"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
              view === "list"
                ? "bg-white text-[#17A546] shadow-sm border border-neutral-200"
                : "text-[#676E85] hover:text-[#0A1B39]"
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={view === "grid"
        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        : "flex flex-col"
      }>
        {availableCourses.map((course) => (
          <CourseCard key={course.id} {...course} isPurchased={false} view={view} />
        ))}
      </div>
    </div>
  );
}