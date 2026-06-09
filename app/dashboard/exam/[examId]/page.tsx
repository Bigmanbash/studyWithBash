"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText, LayoutGrid, List, ShoppingCart } from "lucide-react";
import { CourseCard } from "@/components/dashboard";

export default function ExamCategoryPage({ params }: { params: Promise<{ examId: string }> }) {
  const resolvedParams = use(params);
  const title = resolvedParams.examId.toUpperCase() + " Preparation";
  const [view, setView] = useState<"grid" | "list">("grid");

  const availableCourses = [
    {
      id: `${resolvedParams.examId}-maths`,
      title: `Mathematics Past Questions & Answers`,
      image: "/img/hero_section.png",
      price: 3500,
      originalPrice: 5000,
    },
    {
      id: `${resolvedParams.examId}-english`,
      title: `English Language Intensive Guide`,
      image: "/img/hero_section.png",
      price: 3500,
      originalPrice: 5000,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/dashboard"
            className="p-1.5 hover:bg-neutral-100 rounded-lg text-[#676E85] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold text-[#0A1B39]">{title}</h1>
        </div>
        <p className="text-sm text-[#676E85] mt-1 ml-[38px]">
          Get ready for your exams with our curated materials.
        </p>
      </div>

      {/* List header row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] text-[#676E85]">{availableCourses.length} materials</span>

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
          {availableCourses.map((course) => (
            <CourseCard key={course.id} {...course} isPurchased={false} view="grid" />
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="divide-y divide-neutral-100">
          {availableCourses.map((course) => (
            <CourseCard key={course.id} {...course} isPurchased={false} view="list" />
          ))}
        </div>
      )}

    </div>
  );
}
