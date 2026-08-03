"use client";

import { useState, useEffect } from "react";
import { AdminDashboardHeader, AdminFilterBar } from "@/components/admin/dashboard";
import {
  CheckCircle2,
  XCircle,
  Download,
  Users,
  BookOpen,
  Calendar,
  X,
  Mail,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents, fetchStudentById } from "@/app/api/students";
import type { Student } from "@/app/api/students/interface";
import { Pagination } from "@/components/ui/pagination";

type StudentStatusTab = "all" | "active" | "inactive";

const statusConfig = {
  active: {
    label: "Active",
    color: "text-[#0E7B33]",
    bg: "bg-[#E7F6EC]",
    border: "border-[#0E7B33]/20",
  },
  inactive: {
    label: "Inactive",
    color: "text-[#676E85]",
    bg: "bg-neutral-100",
    border: "border-neutral-200",
  },
};

export default function AdminStudentsPage() {
  const [activeTab, setActiveTab] = useState<StudentStatusTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Status map override for toggles locally
  const [localStatuses, setLocalStatuses] = useState<Record<string, "active" | "inactive">>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch real students list using query function from @/app/api/students
  const { data: queryData, isLoading } = useQuery({
    queryKey: ["admin-students", page, debouncedSearch],
    queryFn: () => fetchStudents({ page, limit: 10, search: debouncedSearch || undefined }),
  });

  // Fetch single student details when modal is opened
  const { data: studentDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["admin-student-detail", selectedStudentId],
    queryFn: () => (selectedStudentId ? fetchStudentById(selectedStudentId) : null),
    enabled: !!selectedStudentId,
  });

  const mockFallbackStudents: Student[] = [
    { id: "STD-1042", name: "Adaeze Okonkwo", email: "adaeze@email.com", whatsappNumber: "+2348012345678", createdAt: "2023-10-12T00:00:00Z" } as any,
    { id: "STD-1041", name: "Tunde Bakare", email: "tunde.b@email.com", whatsappNumber: "+2348023456789", createdAt: "2023-11-05T00:00:00Z" } as any,
    { id: "STD-1040", name: "Blessing Eze", email: "blessing.e@email.com", whatsappNumber: "+2348034567890", createdAt: "2023-09-28T00:00:00Z" } as any,
    { id: "STD-1039", name: "Emeka Nwosu", email: "emeka.n@email.com", whatsappNumber: "+2348045678901", createdAt: "2023-12-01T00:00:00Z" } as any,
    { id: "STD-1038", name: "Fatima Yusuf", email: "fatima.y@email.com", whatsappNumber: "+2348056789012", createdAt: "2024-01-15T00:00:00Z" } as any,
  ];

  const fetchedStudents: Student[] = queryData?.data || [];
  const rawStudentsList = fetchedStudents.length > 0 ? fetchedStudents : (isLoading ? [] : mockFallbackStudents);
  const totalCount = queryData?.total || rawStudentsList.length;
  const totalPages = queryData ? Math.ceil(queryData.total / queryData.limit) : 1;

  // Apply status map override
  const studentsList = rawStudentsList.map((s) => ({
    ...s,
    status: (localStatuses[s.id] || "active") as "active" | "inactive",
  }));

  const toggleStudentStatus = (id: string) => {
    setLocalStatuses((prev) => {
      const current = prev[id] || "active";
      return { ...prev, [id]: current === "active" ? "inactive" : "active" };
    });
  };

  const activeCount = studentsList.filter((s) => s.status === "active").length;
  const inactiveCount = studentsList.filter((s) => s.status === "inactive").length;

  const filteredStudents = studentsList.filter((student) => {
    if (activeTab === "all") return true;
    return student.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-7xl mx-auto">

        {/* Unboxed Modern Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1B39]">
              Students Management
            </h1>
            <p className="text-xs sm:text-sm text-[#676E85] mt-1 font-normal">
              View registered students, monitor course enrollments, and manage account statuses.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-neutral-200 text-[#0A1B39] rounded-md h-9 px-4 font-semibold text-xs w-fit hover:bg-neutral-50 shadow-2xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export List
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Registered",
              value: totalCount.toString(),
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
              label: "Inactive / Suspended",
              value: inactiveCount.toString(),
              icon: XCircle,
              color: "text-[#676E85]",
              bg: "bg-neutral-100",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-md p-4 border border-neutral-200/80 shadow-2xs flex items-center gap-4"
            >
              <div className={`${stat.bg} rounded-md p-2.5 w-fit shrink-0 border border-neutral-100`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-[#676E85] font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-[#0A1B39] mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Filter & Search Bar */}
        <AdminFilterBar
          tabs={[
            { key: "all", label: "All Students", count: totalCount },
            { key: "active", label: "Active", count: activeCount },
            { key: "inactive", label: "Inactive", count: inactiveCount },
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
          searchPlaceholder="Search by name, email..."
        />

        {/* Student Table Container */}
        <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#676E85]">
              <Loader2 className="w-8 h-8 animate-spin text-[#17A546] mb-2" />
              <p className="text-xs font-semibold">Loading students from database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/60">
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Student
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3 hidden sm:table-cell">
                      Contact / Phone
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3 hidden md:table-cell">
                      Join Date
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Status
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredStudents.map((student) => {
                    const status = statusConfig[student.status];
                    const initials = student.name
                      ? student.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                      : "ST";
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-neutral-50/60 transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-xs shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#0A1B39] truncate">
                                {student.name || "Student"}
                              </p>
                              <p className="text-[11px] text-[#676E85] truncate">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <span className="text-xs font-mono text-[#0A1B39]">
                            {student.whatsappNumber || "N/A"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#98A2B3]" />
                            <span className="text-xs text-[#676E85]">
                              {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "Recent"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${status.color} ${status.bg} border ${status.border}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedStudentId(student.id)}
                              className="text-xs font-semibold text-[#0A1B39] hover:text-[#17A546] bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-md transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => toggleStudentStatus(student.id)}
                              className={cn(
                                "text-xs font-medium px-2.5 py-1 rounded-md transition-colors",
                                student.status === "active"
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-[#17A546] hover:bg-[#17A546]/10"
                              )}
                              title={student.status === "active" ? "Suspend Student" : "Activate Student"}
                            >
                              {student.status === "active" ? "Suspend" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-10 w-10 text-[#98A2B3] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#0A1B39]">
                No students match your criteria
              </p>
              <p className="text-xs text-[#676E85] mt-1">
                Try adjusting your search query or status filter.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-neutral-100 flex items-center justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* Student Details View Modal (Powered by getStudent API) */}
      {selectedStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1B39]/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-md p-6 w-full max-w-fit shadow-2xl animate-in zoom-in-95 duration-200 relative space-y-5">
            <button
              onClick={() => setSelectedStudentId(null)}
              className="absolute top-4 right-4 text-[#676E85] hover:text-[#0A1B39] bg-neutral-100 rounded-full p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {isLoadingDetail ? (
              <div className="py-12 text-center text-[#676E85]">
                <Loader2 className="w-8 h-8 animate-spin text-[#17A546] mx-auto mb-2" />
                <p className="text-xs font-medium">Fetching student record...</p>
              </div>
            ) : studentDetail ? (
              <>
                {/* Profile Header */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-100">
                  <div className="h-12 w-12 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-base shrink-0">
                    {studentDetail.name ? studentDetail.name.substring(0, 2).toUpperCase() : "ST"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#0A1B39] truncate">{studentDetail.name || "Student"}</h3>
                    </div>
                    <p className="text-xs text-[#676E85] truncate flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-[#98A2B3]" /> {studentDetail.email}
                    </p>
                  </div>
                </div>

                {/* Account Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200/60">
                    <p className="text-[10px] text-[#676E85] font-medium">Student ID</p>
                    <p className="font-mono font-bold text-[#0A1B39] mt-0.5 truncate">{studentDetail.id}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200/60">
                    <p className="text-[10px] text-[#676E85] font-medium">WhatsApp Contact</p>
                    <p className="font-bold text-[#0A1B39] mt-0.5">{studentDetail.whatsappNumber || "N/A"}</p>
                  </div>
                </div>

                {/* Course Purchases */}
                <div>
                  <p className="text-xs font-bold text-[#0A1B39] mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#17A546]" /> Course Purchases ({studentDetail.purchases?.length || 0})
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {studentDetail.purchases && studentDetail.purchases.length > 0 ? (
                      studentDetail.purchases.map((purchase: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-neutral-50 rounded-md border border-neutral-200/60 text-xs flex justify-between items-center">
                          <span className="font-semibold text-[#0A1B39]">{purchase.course?.title || "Course"}</span>
                          <span className="text-[10px] font-bold text-[#17A546] bg-[#17A546]/10 px-2 py-0.5 rounded-md">
                            ₦{purchase.amount}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#676E85] italic p-2 bg-neutral-50 rounded-md">No course purchases recorded yet.</p>
                    )}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedStudentId(null)}
                    className="rounded-md h-9 px-4 text-xs font-semibold border-neutral-200 text-[#0A1B39]"
                  >
                    Close
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
