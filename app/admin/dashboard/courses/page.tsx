"use client";

import { useEffect, useState } from "react";
import { AdminDashboardHeader, AdminFilterBar } from "@/components/admin/dashboard";
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
  Trash2,
  Check,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchCourses } from "@/app/api/courses";
import type { Course, CourseWithStats } from "@/app/api/courses/interface";
import { Pagination } from "@/components/ui/pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type CourseStatus = "active" | "draft" | "all";

const COMMON_SUBJECTS = [
  "Mathematics",
  "English",
  "Biology",
  "Economics",
  "Chemistry",
  "Physics",
  "Literature in English",
  "Government",
  "Commerce",
  "Civic Education",
  "Agricultural Science",
  "Further Mathematics",
  "Accounting",
  "Geography",
  "JAMB",
  "WAEC",
  "NECO"
];

const AdminCoursesPage = () => {
  const [activeTab, setActiveTab] = useState<CourseStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<"all" | "first" | "second" | "third">("all");
  const [selectedLevel, setSelectedLevel] = useState<"all" | "SSS1" | "SSS2" | "SSS3">("all");
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
    queryKey: ['admin-courses', page, activeTab, debouncedSearch, selectedSubject, selectedTerm, selectedLevel],
    queryFn: () => fetchCourses({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      status: activeTab === "all" ? undefined : activeTab,
      subject: selectedSubject !== "all" ? selectedSubject : undefined,
      term: selectedTerm !== "all" ? selectedTerm : undefined,
      level: selectedLevel !== "all" ? selectedLevel : undefined,
    })
  });

  const courses = queryData?.data || [];
  const totalPages = queryData ? Math.ceil(queryData.total / queryData.limit) : 1;
  const totalCount = queryData?.total || 0;

  const courseSubjects = courses.map((c: any) => c.subject).filter(Boolean);
  const availableSubjects = Array.from(new Set([...COMMON_SUBJECTS, ...courseSubjects])).sort();

  const stats = [
    {
      label: "Total Courses",
      value: totalCount.toString(),
      icon: BookOpen,
      color: "text-[#17A546]",
      bg: "bg-[#17A546]/10",
    },
    {
      label: "Active Courses",
      value: courses.filter((c: any) => c.status === "active").length.toString(),
      icon: CheckCircle2,
      color: "text-[#0E7B33]",
      bg: "bg-[#0E7B33]/10",
    },
    {
      label: "Drafts",
      value: courses.filter((c: any) => c.status === "draft").length.toString(),
      icon: Clock,
      color: "text-[#F5B546]",
      bg: "bg-[#FEF6E7]",
    },
    {
      label: "Total Enrollments",
      value: courses.reduce((acc: number, c: any) => acc + (c.enrolledCount || 0), 0).toString(),
      icon: Users,
      color: "text-[#0A1B39]",
      bg: "bg-neutral-100",
    },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(courses.map((c: any) => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete courses");

      setSelectedIds(new Set());
      setShowDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    } catch (err) {
      console.error(err);
      alert("Failed to delete courses");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-7xl mx-auto">
        {/* Unboxed Modern Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1B39]">
              Courses Catalog
            </h1>
            <p className="text-xs sm:text-sm text-[#676E85] mt-1 font-normal">
              Manage course materials, subject assignments, tier pricing, and enrollment status.
            </p>
          </div>
          <Link href="/admin/dashboard/courses/add">
            <Button className="bg-[#17A546] hover:bg-[#128638] text-white rounded-md h-9 px-4 font-semibold text-xs shadow-xs flex items-center gap-1.5 w-fit shrink-0 active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-md p-4 border border-neutral-200/80 shadow-2xs hover:border-[#17A546]/30 transition-all"
            >
              <div className={`${stat.bg} rounded-md p-2 w-fit mb-2.5 border border-neutral-100`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0A1B39]">
                {stat.value}
              </p>
              <p className="text-xs text-[#676E85] font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Unified Filter & Search Bar */}
        <AdminFilterBar
          tabs={[
            { key: "all", label: "All Courses", count: totalCount },
            { key: "active", label: "Active", count: courses.filter((c: any) => c.status === "active").length },
            { key: "draft", label: "Drafts", count: courses.filter((c: any) => c.status === "draft").length },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setPage(1);
          }}
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
          searchPlaceholder="Search courses..."
        />

        {/* Secondary Filter Controls: Subject, Term, Level */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-md border border-neutral-200/80 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
            {/* Filter Icon & Label */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A1B39]">
              <Filter className="w-3.5 h-3.5 text-[#17A546]" />
              <span className="hidden sm:inline">Filters:</span>
            </div>

            {/* Subject Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#676E85]">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setPage(1);
                }}
                className="bg-[#F7F9FC] text-xs font-semibold text-[#0A1B39] border border-neutral-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#17A546] focus:ring-1 focus:ring-[#17A546]/20 transition-all cursor-pointer"
              >
                <option value="all">All Subjects</option>
                {availableSubjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Term Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#676E85]">Term:</span>
              <select
                value={selectedTerm}
                onChange={(e) => {
                  setSelectedTerm(e.target.value as any);
                  setPage(1);
                }}
                className="bg-[#F7F9FC] text-xs font-semibold text-[#0A1B39] border border-neutral-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#17A546] focus:ring-1 focus:ring-[#17A546]/20 transition-all cursor-pointer"
              >
                <option value="all">All Terms</option>
                <option value="first">First Term</option>
                <option value="second">Second Term</option>
                <option value="third">Third Term</option>
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#676E85]">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value as any);
                  setPage(1);
                }}
                className="bg-[#F7F9FC] text-xs font-semibold text-[#0A1B39] border border-neutral-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#17A546] focus:ring-1 focus:ring-[#17A546]/20 transition-all cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="SSS1">SSS 1</option>
                <option value="SSS2">SSS 2</option>
                <option value="SSS3">SSS 3</option>
              </select>
            </div>
          </div>

          {/* Reset Filters CTA */}
          {(selectedSubject !== "all" || selectedTerm !== "all" || selectedLevel !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSubject("all");
                setSelectedTerm("all");
                setSelectedLevel("all");
                setSearchQuery("");
                setPage(1);
              }}
              className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors ml-auto sm:ml-0"
              title="Reset All Filters"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Course Cards Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#17A546]" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-md border border-neutral-200/80 p-8">
            <div className="h-12 w-12 rounded-md bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-[#98A2B3]">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#0A1B39] mb-1">
              No courses found
            </h3>
            <p className="text-xs text-[#676E85]">
              Try adjusting your search query or filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((course: CourseWithStats) => {
                const colors = [
                  { bg: "bg-[#17A546]", text: "text-[#17A546]" },
                  { bg: "bg-blue-600", text: "text-blue-600" },
                  { bg: "bg-purple-600", text: "text-purple-600" },
                  { bg: "bg-amber-600", text: "text-amber-600" },
                ];
                const hash = course.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const theme = colors[hash % colors.length];

                const termLabel = course.term === "first" ? "1st Term" : course.term === "second" ? "2nd Term" : course.term === "third" ? "3rd Term" : course.term ? `${course.term} Term` : null;
                const levelLabel = course.level ? course.level.replace(/^(SSS|JSS)(\d)$/i, "$1 $2") : null;

                return (
                  <div
                    key={course.id}
                    className={cn(
                      "bg-white rounded-md border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-[#17A546]/30 transition-all overflow-hidden flex flex-col justify-between group relative",
                      selectedIds.has(course.id) && "border-[#17A546] ring-2 ring-[#17A546]/20"
                    )}
                  >
                    {/* Top Accent Strip */}
                    <div className={`h-1.5 ${theme.bg}`} />

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`h-9 w-9 rounded-md ${theme.bg} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs`}>
                            {course.subject[0]}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-[#0A1B39] truncate group-hover:text-[#17A546] transition-colors">
                              {course.title}
                            </h4>
                            <p className="text-[11px] text-[#676E85] truncate capitalize">
                              {course.category} {levelLabel && `· ${levelLabel}`} {termLabel && `· ${termLabel}`}
                            </p>
                          </div>
                        </div>

                        {/* Bulk Select Checkbox */}
                        <button
                          onClick={() => handleSelectOne(course.id, !selectedIds.has(course.id))}
                          className={cn(
                            "w-4 h-4 rounded-sm border flex items-center justify-center transition-colors shrink-0",
                            selectedIds.has(course.id)
                              ? "bg-[#17A546] border-[#17A546]"
                              : "bg-neutral-100 border-neutral-300 hover:border-[#17A546]"
                          )}
                        >
                          {selectedIds.has(course.id) && <Check className="w-3 h-3 text-white" />}
                        </button>
                      </div>

                      {/* Status & Tier Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {course.status === "active" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#17A546]/10 text-[#17A546] border border-[#17A546]/20">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-[#676E85] border border-neutral-200">
                            <XCircle className="h-3 w-3" /> Draft
                          </span>
                        )}
                        {termLabel && (
                          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/80">
                            {termLabel}
                          </span>
                        )}
                        {levelLabel && (
                          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
                            {levelLabel}
                          </span>
                        )}
                        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-[#676E85] border border-neutral-200">
                          {[true, !!course.standardPrice, !!course.premiumPrice].filter(Boolean).length} Tiers
                        </span>
                      </div>

                      {/* Financial & Student Metrics */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-md bg-[#F7F9FC] border border-neutral-200/60 text-center">
                        <div>
                          <p className="text-[10px] text-[#676E85] font-medium">Students</p>
                          <p className="text-xs font-bold text-[#0A1B39] mt-0.5">
                            {course.studentsCount || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#676E85] font-medium">Revenue</p>
                          <p className="text-xs font-bold text-[#0A1B39] mt-0.5 truncate">
                            ₦{((course.revenue || 0) / 100).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#676E85] font-medium">Base Price</p>
                          <p className="text-xs font-bold text-[#0A1B39] mt-0.5 truncate">
                            ₦{(course.price / 100).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <Link
                          href={`/admin/dashboard/courses/${course.id}`}
                          className="text-xs font-bold text-[#0A1B39] hover:text-[#17A546] transition-colors flex items-center gap-1"
                        >
                          View Details <ArrowUpRight className="h-3.5 w-3.5 text-[#17A546]" />
                        </Link>

                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/dashboard/courses/${course.id}/edit`}
                            className="text-xs font-semibold text-[#676E85] hover:text-[#0A1B39] bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded-md transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedIds(new Set([course.id]));
                              setShowDeleteModal(true);
                            }}
                            className="p-1 rounded-md text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0A1B39] text-white px-4 py-2.5 rounded-md shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <span className="text-xs font-semibold whitespace-nowrap">{selectedIds.size} selected</span>
          <div className="w-px h-4 bg-white/20" />
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1 hover:bg-white/10 rounded-md transition-colors ml-2"
          >
            <XCircle className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1B39]/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-md p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0A1B39] text-center mb-2">Delete Course{selectedIds.size > 1 ? "s" : ""}</h3>
            <p className="text-xs text-[#676E85] text-center mb-6 leading-relaxed">
              Are you sure you want to delete {selectedIds.size} selected course{selectedIds.size > 1 ? "s" : ""}? This action cannot be undone and will permanently remove all related content.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-md h-10 font-semibold border-neutral-200 text-[#0A1B39] hover:bg-neutral-50 text-xs"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteSelected}
                className="flex-1 rounded-md h-10 font-bold bg-red-500 hover:bg-red-600 text-white shadow-xs text-xs"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminCoursesPage;
