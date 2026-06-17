"use client";

import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { useState } from "react";
import type { Course } from "@/lib/neon/schema";

export function AvailableCourses({ title = "Available Courses", courses = [] }: { title?: string, courses?: Course[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (!courses || courses.length === 0) return null;

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
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            id={course.id}
            title={course.title}
            image={course.coverImagePath || "/img/hero_section.png"}
            price={course.price / 100} 
            originalPrice={course.originalPrice ? course.originalPrice / 100 : undefined}
            isPurchased={false} 
            view={view} 
          />
        ))}
      </div>
    </div>
  );
}