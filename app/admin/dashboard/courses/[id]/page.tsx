"use client";

import { useEffect, useState, use } from "react";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon,
  Edit,
  Eye,
  Download,
  X,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EmbedPDF } from "@/components/dashboard/EmbedPDF";
import { TopicManager } from "@/components/admin/TopicManager";
import { fetchCourseById, updateCourseRequest } from "@/app/api/courses";
import type { Course } from "@/app/api/courses";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CourseDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: ['admin-course', id],
    queryFn: () => fetchCourseById(id)
  });

  const { mutate: toggleStatus, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!course) throw new Error("No course");
      const newStatus = course.status === "active" ? "draft" : "active";
      return await updateCourseRequest(id, { status: newStatus });
    },
    onSuccess: (updated) => {
      // Optimistically update the cache
      queryClient.setQueryData(['admin-course', id], (old: any) => ({
        ...old,
        status: updated.status
      }));
      // Invalidate the list as well
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#17A546]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-[#0A1B39]">Course not found</h2>
        <Link href="/admin/dashboard/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8 md:mb-10">
          <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-[#676E85] mb-6 md:mb-8">
            <Link href="/admin/dashboard/courses" className="hover:text-[#0A1B39] transition-colors flex items-center gap-1 whitespace-nowrap">
              <ChevronLeft className="h-4 w-4" />
              Courses
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-[#0A1B39] truncate max-w-[150px] sm:max-w-xs">{course.title}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 md:pb-8 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 md:gap-5">
              {/* Course Icon Container */}
              <div className={`flex items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-lg md:rounded-xl bg-[#17A546] shadow-sm shrink-0`}>
                <span className="text-white font-bold text-xl md:text-2xl">{course.subject[0]}</span>
              </div>
              
              <div className="flex flex-col justify-center md:mt-1">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0A1B39] tracking-tight leading-tight">
                    {course.title}
                  </h1>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 text-[10px] md:text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap",
                    course.status === "active" ? "bg-[#17A546]/10 text-[#17A546]" : "bg-neutral-100 text-[#676E85]"
                  )}>
                    {course.status === "active" ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#17A546] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-[#17A546]"></span>
                        </span>
                        Active
                      </>
                    ) : (
                      "Draft"
                    )}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 md:gap-x-5 text-xs md:text-sm text-[#676E85] font-medium">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-neutral-400" />
                    <span>0 Students</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4 text-neutral-400" />
                    <span>{course.subject} • {course.level || "Exam"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-neutral-400" />
                    <span>Updated Recently</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
              <Link href={`/admin/dashboard/courses/${course.id}/edit`} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-neutral-200 text-[#0A1B39] font-semibold h-10 md:h-11 px-6 rounded-md hover:bg-neutral-50 transition-colors shadow-sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Course Information & Material */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#0A1B39]">Course Description</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#676E85]">Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={course.status === "active"}
                      onChange={() => toggleStatus()}
                      disabled={isUpdating}
                    />
                    <div className={cn("w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17A546]", isUpdating && "opacity-50 cursor-not-allowed")}></div>
                  </label>
                </div>
              </div>
              <p className="text-sm md:text-base text-[#676E85] leading-relaxed">
                {course.description || "No description provided."}
              </p>
            </div>

            {/* Curriculum & Materials Manager */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0A1B39] flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#17A546]" />
                  Course Curriculum & Materials
                </h3>
              </div>
              <div className="p-4 sm:p-6 bg-neutral-50/50">
                <TopicManager courseId={course.id} />
              </div>
            </div>
          </div>

          {/* Right Column: Assets & Pricing */}
          <div className="space-y-6">
            
            {/* Cover Image */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0A1B39] flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-neutral-400" />
                  Cover Image
                </h3>
              </div>
              <div className="p-4">
                <div className="aspect-video w-full rounded-lg bg-neutral-100 flex flex-col items-center justify-center border border-neutral-200 border-dashed mb-3 relative overflow-hidden">
                  {course.coverImagePath ? (
                    <img 
                      src={course.coverImagePath} 
                      alt="Cover image" 
                      className="object-cover w-full h-full absolute inset-0"
                    />
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-neutral-300 mb-2" />
                      <span className="text-xs text-neutral-400 font-medium px-4 text-center">
                        No cover image
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 sm:p-6">
              <h3 className="text-base font-bold text-[#0A1B39] mb-4">Pricing Information</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="col-span-2 xl:col-span-1 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-xs text-[#676E85] mb-1 font-medium">Current Price</p>
                  <p className="text-lg font-bold text-[#0A1B39]">₦{(course.price / 100).toLocaleString()}</p>
                </div>
                <div className="col-span-2 xl:col-span-1 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-xs text-[#676E85] mb-1 font-medium">Original Price</p>
                  <p className="text-lg font-bold text-[#98A2B3] line-through">₦{course.originalPrice ? (course.originalPrice / 100).toLocaleString() : "N/A"}</p>
                </div>
                <div className="col-span-2 p-4 rounded-xl bg-[#17A546]/5 border border-[#17A546]/20">
                  <p className="text-xs text-[#17A546] mb-1 font-semibold">Total Revenue</p>
                  <p className="text-xl font-bold text-[#17A546]">₦0</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-4 bg-white shrink-0">
            <h2 className="font-semibold text-[#0A1B39] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#17A546]" />
              {course.pdfPath}
            </h2>
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-[#676E85] hover:text-[#0A1B39]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 relative">
            <EmbedPDF 
              src={course.pdfPath || ""} 
              title={course.pdfPath ? "course-material.pdf" : "PDF"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
