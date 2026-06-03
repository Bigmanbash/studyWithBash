"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { CourseCard } from "@/components/dashboard";

interface Course {
  id: string;
  title: string;
  image: string;
  price: number;
}

export function TermCategoryClient({ courses }: { courses: Course[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <>
      {/* Toggle row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] text-[#676E85]">{courses.length} subjects</span>

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
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} isPurchased={false} view="grid" />
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="divide-y divide-neutral-100">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} isPurchased={false} view="list" />
          ))}
        </div>
      )}
    </>
  );
}