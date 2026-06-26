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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, AlertTriangle, Check } from "lucide-react";

type CourseStatus = "active" | "draft" | "all";

const AdminCoursesPage = () => {
  const [activeTab, setActiveTab] = useState<CourseStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  
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

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === courses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(courses.map((c: Course) => c.id)));
    }
  };

  const executeDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      if (res.ok) {
        setSelectedIds(new Set());
        setShowDeleteModal(false);
        queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      } else {
        alert("Failed to delete courses");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting courses");
    } finally {
      setIsDeleting(false);
    }
  };

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
            <div className="flex items-center justify-between mb-4 px-1">
              <button 
                onClick={handleSelectAll}
                className="text-xs font-semibold text-[#676E85] hover:text-[#0A1B39] transition-colors"
              >
                {selectedIds.size === courses.length && courses.length > 0 ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((course: Course) => (
                <div key={course.id} className="relative group">
                  {/* Selection Checkbox */}
                  <button
                    onClick={(e) => toggleSelection(e, course.id)}
                    className={cn(
                      "absolute top-5 right-5 z-20 w-5 h-5 rounded border flex items-center justify-center transition-colors",
                      selectedIds.has(course.id) 
                        ? "bg-[#17A546] border-[#17A546]" 
                        : "bg-white border-neutral-300 opacity-0 group-hover:opacity-100 hover:border-[#17A546]"
                    )}
                  >
                    {selectedIds.has(course.id) && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  <Link
                    href={`/admin/dashboard/courses/${course.id}`}
                    className={cn(
                      "bg-white rounded-2xl sm:rounded-3xl border shadow-sm hover:shadow-md transition-all duration-200 block overflow-hidden",
                      course.status === "draft"
                        ? "border-neutral-200 opacity-75 hover:opacity-100"
                        : "border-neutral-100",
                      selectedIds.has(course.id) && "ring-2 ring-[#17A546] border-transparent"
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
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedIds(new Set([course.id]));
                          setShowDeleteModal(true);
                        }}
                        className="h-8 w-8 rounded-lg hover:bg-red-50 text-[#98A2B3] hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10 mr-7"
                      >
                        <Trash2 className="h-4 w-4" />
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
                </div>
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

      {/* Floating Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0A1B39] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-5 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <span className="text-sm font-semibold whitespace-nowrap">{selectedIds.size} selected</span>
          <div className="w-px h-5 bg-white/20" />
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button 
            onClick={() => setSelectedIds(new Set())}
            className="p-1 hover:bg-white/10 rounded-md transition-colors ml-2"
          >
            <XCircle className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1B39]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-[#0A1B39] text-center mb-2">Delete Course{selectedIds.size > 1 ? "s" : ""}</h3>
            <p className="text-[13px] text-[#676E85] text-center mb-8 leading-relaxed">
              Are you sure you want to delete {selectedIds.size} selected course{selectedIds.size > 1 ? "s" : ""}? This action cannot be undone and will permanently remove all related content.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl h-11 font-semibold border-neutral-200 text-[#0A1B39] hover:bg-neutral-50"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                onClick={executeDelete}
                className="flex-1 rounded-xl h-11 font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCoursesPage;
