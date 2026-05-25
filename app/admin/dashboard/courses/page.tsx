"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CourseStatus = "active" | "inactive";

interface Course {
  id: string;
  title: string;
  subject: string;
  level: string;
  status: CourseStatus;
  students: number;
  topics: number;
  completionRate: number;
  revenue: string;
  lastUpdated: string;
  color: string;
}

const courses: Course[] = [
  {
    id: "1",
    title: "Physics (SS1)",
    subject: "Physics",
    level: "SS1",
    status: "active",
    students: 420,
    topics: 14,
    completionRate: 72,
    revenue: "₦6.3M",
    lastUpdated: "2 days ago",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Mathematics (SS3)",
    subject: "Mathematics",
    level: "SS3",
    status: "active",
    students: 580,
    topics: 16,
    completionRate: 85,
    revenue: "₦8.7M",
    lastUpdated: "1 day ago",
    color: "bg-[#17A546]",
  },
  {
    id: "3",
    title: "Chemistry (SS1)",
    subject: "Chemistry",
    level: "SS1",
    status: "active",
    students: 340,
    topics: 12,
    completionRate: 58,
    revenue: "₦4.1M",
    lastUpdated: "3 days ago",
    color: "bg-amber-500",
  },
  {
    id: "4",
    title: "Biology (SS2)",
    subject: "Biology",
    level: "SS2",
    status: "active",
    students: 290,
    topics: 18,
    completionRate: 63,
    revenue: "₦3.5M",
    lastUpdated: "5 days ago",
    color: "bg-purple-500",
  },
  {
    id: "5",
    title: "English Language (SS3)",
    subject: "English",
    level: "SS3",
    status: "active",
    students: 510,
    topics: 10,
    completionRate: 78,
    revenue: "₦5.1M",
    lastUpdated: "1 day ago",
    color: "bg-rose-500",
  },
  {
    id: "6",
    title: "Government (SS2)",
    subject: "Government",
    level: "SS2",
    status: "inactive",
    students: 180,
    topics: 8,
    completionRate: 45,
    revenue: "₦1.8M",
    lastUpdated: "2 weeks ago",
    color: "bg-cyan-500",
  },
  {
    id: "7",
    title: "Economics (SS1)",
    subject: "Economics",
    level: "SS1",
    status: "inactive",
    students: 120,
    topics: 6,
    completionRate: 32,
    revenue: "₦960K",
    lastUpdated: "1 month ago",
    color: "bg-orange-500",
  },
  {
    id: "8",
    title: "Literature (SS3)",
    subject: "Literature",
    level: "SS3",
    status: "inactive",
    students: 95,
    topics: 5,
    completionRate: 28,
    revenue: "₦712K",
    lastUpdated: "3 weeks ago",
    color: "bg-teal-500",
  },
];

const stats = [
  { label: "Total Courses", value: "24", icon: BookOpen, color: "text-[#17A546]", bg: "bg-[#17A546]/10" },
  { label: "Active Courses", value: "18", icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Inactive Courses", value: "6", icon: EyeOff, color: "text-[#98A2B3]", bg: "bg-neutral-100" },
  { label: "Total Students", value: "2,535", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
];

export default function AdminCoursesPage() {
  const [activeTab, setActiveTab] = useState<"all" | CourseStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    const matchesTab = activeTab === "all" || course.status === activeTab;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeCourses = courses.filter((c) => c.status === "active");
  const inactiveCourses = courses.filter((c) => c.status === "inactive");

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
          <Button className="bg-[#17A546] hover:bg-[#17A546]/90 text-white rounded-xl h-11 px-5 font-semibold shadow-lg shadow-[#17A546]/20 w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
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
            <div className="flex items-center bg-neutral-50 rounded-xl p-1 border border-neutral-100">
              {[
                { key: "all" as const, label: "All", count: courses.length },
                { key: "active" as const, label: "Active", count: activeCourses.length },
                { key: "inactive" as const, label: "Inactive", count: inactiveCourses.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    activeTab === tab.key
                      ? "bg-white text-[#0A1B39] shadow-sm"
                      : "text-[#98A2B3] hover:text-[#676E85]"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      activeTab === tab.key
                        ? "bg-[#17A546]/10 text-[#17A546]"
                        : "bg-neutral-100 text-[#98A2B3]"
                    )}
                  >
                    {tab.count}
                  </span>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="h-10 w-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center hover:bg-neutral-100 transition-colors flex-shrink-0">
                <Filter className="h-4 w-4 text-[#676E85]" />
              </button>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <Link
              href={`/admin/dashboard/courses/${course.id}`}
              key={course.id}
              className={cn(
                "bg-white rounded-2xl sm:rounded-3xl border shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden block",
                course.status === "inactive"
                  ? "border-neutral-200 opacity-75 hover:opacity-100"
                  : "border-neutral-100"
              )}
            >
              {/* Color Strip */}
              <div className={`h-1.5 ${course.color}`} />

              <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-xl ${course.color} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {course.subject[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0A1B39] group-hover:text-[#17A546] transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-xs text-[#98A2B3] mt-0.5">
                        {course.topics} topics · {course.level}
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
                      Inactive
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-[#98A2B3]">Students</p>
                    <p className="text-sm font-bold text-[#0A1B39] mt-0.5">
                      {course.students}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#98A2B3]">Revenue</p>
                    <p className="text-sm font-bold text-[#0A1B39] mt-0.5">
                      {course.revenue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#98A2B3]">Completion</p>
                    <p className="text-sm font-bold text-[#0A1B39] mt-0.5">
                      {course.completionRate}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${course.color}`}
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#98A2B3] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {course.lastUpdated}
                  </span>
                  <span className="text-xs font-semibold text-[#17A546] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    View <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
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
        )}
      </div>
    </>
  );
}
