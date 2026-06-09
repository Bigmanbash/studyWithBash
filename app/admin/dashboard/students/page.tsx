"use client";

import { useState } from "react";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import {
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  Eye,
  Users,
  BookOpen,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type StudentStatus = "active" | "inactive";

interface Student {
  id: string;
  name: string;
  initials: string;
  email: string;
  enrolledCourses: number;
  joinDate: string;
  status: StudentStatus;
  lastActive: string;
}

const students: Student[] = [
  {
    id: "STD-1042",
    name: "Adaeze Okonkwo",
    initials: "AO",
    email: "adaeze@email.com",
    enrolledCourses: 3,
    joinDate: "Oct 12, 2023",
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "STD-1041",
    name: "Tunde Bakare",
    initials: "TB",
    email: "tunde.b@email.com",
    enrolledCourses: 1,
    joinDate: "Nov 05, 2023",
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: "STD-1040",
    name: "Blessing Eze",
    initials: "BE",
    email: "blessing.e@email.com",
    enrolledCourses: 4,
    joinDate: "Sep 28, 2023",
    status: "inactive",
    lastActive: "2 weeks ago",
  },
  {
    id: "STD-1039",
    name: "Emeka Nwosu",
    initials: "EN",
    email: "emeka.n@email.com",
    enrolledCourses: 2,
    joinDate: "Dec 01, 2023",
    status: "active",
    lastActive: "5 hours ago",
  },
  {
    id: "STD-1038",
    name: "Fatima Yusuf",
    initials: "FY",
    email: "fatima.y@email.com",
    enrolledCourses: 2,
    joinDate: "Jan 15, 2024",
    status: "active",
    lastActive: "Just now",
  },
];

const statusConfig = {
  active: {
    label: "Active",
    color: "text-[#0E7B33]",
    bg: "bg-[#E7F6EC]",
  },
  inactive: {
    label: "Inactive",
    color: "text-[#676E85]",
    bg: "bg-neutral-100",
  },
};

export default function AdminStudentsPage() {
  const [activeTab, setActiveTab] = useState<"all" | StudentStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((student) => {
    const matchesTab = activeTab === "all" || student.status === activeTab;
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeCount = students.filter((s) => s.status === "active").length;
  const inactiveCount = students.filter((s) => s.status === "inactive").length;

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-[1400px] mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">
              Students
            </h2>
            <p className="text-sm sm:text-base text-[#676E85] mt-1">
              Manage and monitor registered students.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-neutral-200 text-[#0A1B39] rounded-md h-10 px-4 font-medium w-fit hover:bg-neutral-50 shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Students",
              value: students.length.toString(),
              icon: Users,
              color: "text-[#17A546]",
              bg: "bg-[#17A546]/10",
            },
            {
              label: "Active Students",
              value: activeCount.toString(),
              icon: CheckCircle2,
              color: "text-[#0E7B33]",
              bg: "bg-[#0E7B33]/10",
            },
            {
              label: "Inactive Students",
              value: inactiveCount.toString(),
              icon: XCircle,
              color: "text-[#676E85]",
              bg: "bg-neutral-100",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm flex items-center gap-4"
            >
              <div className={`${stat.bg} rounded-md p-3 w-fit shrink-0`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-[#676E85] font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-[#0A1B39] mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="p-4 sm:p-5 border-b border-neutral-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center bg-neutral-50 rounded-md p-1 border border-neutral-200 overflow-x-auto w-full sm:w-auto">
                {[
                  { key: "all" as const, label: "All Students", count: students.length },
                  { key: "active" as const, label: "Active", count: activeCount },
                  { key: "inactive" as const, label: "Inactive", count: inactiveCount },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap",
                      activeTab === tab.key
                        ? "bg-white text-[#0A1B39] shadow-sm"
                        : "text-[#676E85] hover:text-[#0A1B39]"
                    )}
                  >
                    {tab.label}
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                        activeTab === tab.key
                          ? "bg-[#17A546]/10 text-[#17A546]"
                          : "bg-neutral-200 text-[#676E85]"
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center bg-neutral-50 rounded-md px-3 py-2 gap-2 border border-neutral-200 focus-within:border-[#17A546]/30 transition-colors flex-1 sm:w-64 shadow-sm">
                  <Search className="h-3.5 w-3.5 text-[#98A2B3]" />
                  <input
                    type="text"
                    placeholder="Search by name, email, ID..."
                    className="bg-transparent text-xs outline-none w-full placeholder:text-[#98A2B3]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="h-9 w-9 rounded-md bg-neutral-50 border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors shrink-0 shadow-sm">
                  <Filter className="h-3.5 w-3.5 text-[#676E85]" />
                </button>
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                  <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                    Student
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3 hidden sm:table-cell">
                    Enrolled Courses
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3 hidden md:table-cell">
                    Join Date
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredStudents.map((student) => {
                  const status = statusConfig[student.status];
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-neutral-50/50 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-xs shrink-0">
                            {student.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#0A1B39] truncate">
                              {student.name}
                            </p>
                            <p className="text-xs text-[#676E85] truncate">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-[#98A2B3]" />
                          <span className="text-sm font-medium text-[#0A1B39]">
                            {student.enrolledCourses} courses
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-[#98A2B3]" />
                          <span className="text-sm text-[#676E85]">
                            {student.joinDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${status.color} ${status.bg}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="h-8 w-8 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-[#676E85] hover:bg-neutral-50 hover:text-[#0A1B39] transition-colors shadow-sm"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="h-8 w-8 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-[#676E85] hover:bg-neutral-50 hover:text-[#0A1B39] transition-colors shadow-sm"
                            title="More Actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-10 w-10 text-[#98A2B3] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#0A1B39]">
                No students found
              </p>
              <p className="text-xs text-[#676E85] mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
