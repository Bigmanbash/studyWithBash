"use client";

import { useEffect, useState } from "react";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import {
  BookOpen,
  Search,
  Plus,
  MoreHorizontal,
  Users,
  Clock,
  Eye,
  EyeOff,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Filter,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchCourses } from "@/app/api/courses";
import type { Course } from "@/app/api/courses";
import { Pagination } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";

type CourseStatus = "active" | "draft" | "all";

const AdminCoursesPage = () => {
  const [activeTab, setActiveTab] = useState<CourseStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: queryData, isLoading } = useQuery({
    queryKey: ['admin-courses', page, activeTab, debouncedSearch],
    queryFn: () => fetchCourses({ 
      page, 
      limit: 10,
      search: debouncedSearch || undefined,
      status: activeTab === "all" ? undefined : activeTab
    })
  });

  const courses = queryData?.data || [];
  const totalPages = queryData ? Math.ceil(queryData.total / queryData.limit) : 1;
  const totalCount = queryData?.total || 0;

  // Derived stats (normally these would come from an aggregated stats endpoint)
  const activeCount = courses.filter((c) => c.status === "active").length;
  const draftCount = courses.filter((c) => c.status === "draft").length;

  const stats = [
    { label: "Total Courses", value: totalCount.toString(), icon: BookOpen, color: "text-[#17A546]", bg: "bg-[#17A546]/10" },
    { label: "Active Courses", value: activeCount.toString(), icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Draft Courses", value: draftCount.toString(), icon: EyeOff, color: "text-[#98A2B3]", bg: "bg-neutral-100" },
    { label: "Total Students", value: "0", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <>
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">
              Courses
            </h2>
            <p className="text-sm sm:text-base text-[#676E85] mt-1">
              Manage and monitor all courses on the platform.
            </p>
          </div>
          <Link href="/admin/dashboard/courses/add">
            <Button className="bg-[#17A546] hover:bg-[#17A546]/90 text-white rounded-md h-11 px-5 font-semibold shadow-lg shadow-[#17A546]/20 w-fit">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-neutral-100 shadow-sm"
            >
              <div className={`${stat.bg} rounded-xl p-2 w-fit mb-3`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0A1B39]">
                {stat.value}
              </p>
              <p className="text-xs text-[#98A2B3] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Tabs */}
            <div className="flex items-center bg-neutral-50 rounded-md p-1 border border-neutral-100">
              {[
                { key: "all" as const, label: "All" },
                { key: "active" as const, label: "Active" },
                { key: "draft" as const, label: "Draft" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setPage(1); // Reset to first page on tab change
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    activeTab === tab.key
                      ? "bg-white text-[#0A1B39] shadow-sm"
                      : "text-[#98A2B3] hover:text-[#676E85]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 flex items-center gap-3 w-full sm:w-auto sm:justify-end">
              <div className="flex items-center bg-neutral-50 rounded-xl px-4 py-2.5 gap-2 border border-neutral-100 focus-within:border-[#17A546]/30 transition-colors flex-1 sm:flex-initial sm:w-64">
                <Search className="h-4 w-4 text-[#98A2B3]" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="bg-transparent text-sm outline-none w-full placeholder:text-[#98A2B3]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1); // Reset page on search
                  }}
                />
              </div>
              <button className="h-10 w-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center hover:bg-neutral-100 transition-colors shrink-0">
                <Filter className="h-4 w-4 text-[#676E85]" />
              </button>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#17A546]" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-7 w-7 text-[#98A2B3]" />
            </div>
            <h3 className="text-lg font-bold text-[#0A1B39] mb-1">
              No courses found
            </h3>
            <p className="text-sm text-[#676E85]">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((course) => (
                <Link
                  href={`/admin/dashboard/courses/${course.id}`}
                  key={course.id}
                  className={cn(
                    "bg-white rounded-2xl sm:rounded-3xl border shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden block",
                    course.status === "draft"
                      ? "border-neutral-200 opacity-75 hover:opacity-100"
                      : "border-neutral-100"
                  )}
                >
                  {/* Color Strip */}
                  <div className={`h-1.5 bg-[#17A546]`} />

                  <div className="p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-11 w-11 rounded-xl bg-[#17A546] flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {course.subject[0]}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#0A1B39] group-hover:text-[#17A546] transition-colors truncate max-w-[140px]">
                            {course.title}
                          </h4>
                          <p className="text-xs text-[#98A2B3] mt-0.5">
                            {course.category} · {course.level || "N/A"}
                          </p>
                        </div>
                      </div>
                      <button className="h-8 w-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4 text-[#98A2B3]" />
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {course.status === "active" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-[#E7F6EC] text-[#0E7B33]">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-neutral-100 text-[#676E85]">
                          <XCircle className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-[#98A2B3]">Students</p>
                        <p className="text-sm font-bold text-[#0A1B39] mt-0.5">
                          0
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#98A2B3]">Revenue</p>
                        <p className="text-sm font-bold text-[#0A1B39] mt-0.5">
                          ₦0
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#98A2B3]">Price</p>
                        <p className="text-sm font-bold text-[#0A1B39] mt-0.5">
                          ₦{(course.price / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar (Removed for actual usage unless calculated) */}
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-700 bg-neutral-300`}
                        style={{ width: `0%` }}
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#98A2B3] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {new Date(course.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-semibold text-[#17A546] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        View <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminCoursesPage;
