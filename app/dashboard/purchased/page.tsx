"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, LayoutGrid, List, Loader2, BookX } from "lucide-react";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { AvailableCourses } from "@/components/dashboard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PurchasedCoursesPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const { data, isLoading, error } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-[#676E85]">Failed to load purchased courses.</p>
      </div>
    );
  }

  const { purchased } = data;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto space-y-12">

      <section>
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#0A1B39] leading-tight">
            Purchased courses
          </h1>
          <p className="text-[13px] sm:text-sm text-[#676E85] mt-1 leading-relaxed">
            Access all your purchased reading materials.
          </p>
        </div>

        {purchased.length === 0 ? (
          <EmptyState
            icon={<BookX className="w-8 h-8" strokeWidth={1.5} />}
            title="No purchased courses yet"
            description="You haven't bought any materials. Browse our catalog to find study guides, past questions, and more."
            actionLabel="Explore Courses"
            actionHref="/dashboard"
          />
        ) : (
          <>
            {/* List header row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] text-[#676E85] font-medium">{purchased.length} materials</span>

              <div className="flex items-center gap-0.5 bg-neutral-100 border border-neutral-200 rounded-md p-1">
                <button
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${view === "grid"
                    ? "bg-white text-[#17A546] shadow-sm border border-neutral-200"
                    : "text-[#676E85] hover:text-[#0A1B39]"
                    }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${view === "list"
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
                {purchased.map((course) => (
                  <div key={course.id} className="bg-white border border-neutral-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
                    <div className="relative h-32 sm:h-40 w-full bg-neutral-100">
                      <Image
                        src={course.coverImagePath || "/img/hero_section.png"}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 sm:p-4 flex-1 flex flex-col gap-3">
                      <h3 className="text-[13px] sm:text-sm font-semibold text-[#0A1B39] line-clamp-2 flex-1 leading-snug">
                        {course.title}
                      </h3>
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
              <div className="divide-y divide-neutral-100 bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
                {purchased.map((course) => (
                  <div key={course.id} className="flex items-center gap-4 py-3 px-4 sm:px-5 hover:bg-neutral-50/50 transition-colors">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200/50">
                      <Image src={course.coverImagePath || "/img/hero_section.png"} alt={course.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#0A1B39] truncate">{course.title}</p>
                      <p className="text-[12px] text-[#676E85] mt-0.5 truncate">{course.description || "Reading material"}</p>
                    </div>
                    <Link
                      href={`/dashboard/read/${course.id}`}
                      className="shrink-0 flex items-center gap-1.5 text-[12px] font-medium text-[#0A1B39] bg-white border border-neutral-200 px-3 py-2 rounded-md hover:text-[#17A546] hover:bg-[#17A546]/5 hover:border-[#17A546]/30 transition-all shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Open</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Available Courses Section */}
      <section className="pt-8 border-t border-neutral-100">
        <AvailableCourses title="Explore more materials" courses={data.available} />
      </section>
    </div>
  );
}