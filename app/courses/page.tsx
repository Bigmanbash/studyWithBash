"use client";

import { useState } from "react";
import { Header } from "@/components/app_components/Header";
import { Footer } from "@/components/app_components/Footer";
import { CoursesHero, CourseFilters, CourseGrid } from "@/components/courses";

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <CoursesHero />

        <section className="py-12 sm:py-16 bg-(--card)">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-(--heading)">
                  {activeFilter === "all" ? "Explore All Courses" : `${activeFilter.toUpperCase()} Courses`}
                </h2>
                <p className="text-sm text-(--muted) mt-2">
                  Discover our comprehensive curriculum designed for excellence.
                </p>
              </div>
              <div className="flex-shrink-0">
                <CourseFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              </div>
            </div>

            <CourseGrid filter={activeFilter} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
