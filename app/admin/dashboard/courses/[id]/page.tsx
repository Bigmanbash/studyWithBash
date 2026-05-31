"use client";

import { useState } from "react";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  BookOpen, 
  Clock, 
  Users, 
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  FileText,
  Video,
  FileQuestion,
  Plus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock data
const courseData = {
  id: "1",
  title: "Physics (SS1)",
  subject: "Physics",
  level: "SS1",
  status: "active",
  students: 420,
  revenue: "₦6.3M",
  lastUpdated: "2 days ago",
  color: "bg-blue-500",
  terms: [
    {
      id: "term-1",
      name: "First Term",
      status: "active",
      modules: [
        { id: "m1", title: "Introduction to Physics", type: "video", duration: "45 mins" },
        { id: "m2", title: "Fundamental Quantities & Units", type: "document", duration: "10 pages" },
        { id: "m3", title: "Measurement Quiz", type: "quiz", duration: "15 questions" },
      ]
    },
    {
      id: "term-2",
      name: "Second Term",
      status: "inactive",
      modules: [
        { id: "m4", title: "Motion and Vectors", type: "video", duration: "55 mins" },
        { id: "m5", title: "Newton's Laws of Motion", type: "document", duration: "12 pages" },
      ]
    },
    {
      id: "term-3",
      name: "Third Term",
      status: "inactive",
      modules: []
    }
  ]
};

export default function CourseDetailsPage() {
  const [terms, setTerms] = useState(courseData.terms);

  const toggleTermStatus = (termId: string) => {
    setTerms(terms.map(term => {
      if (term.id === termId) {
        return { ...term, status: term.status === "active" ? "inactive" : "active" };
      }
      return term;
    }));
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "document": return <FileText className="h-4 w-4" />;
      case "quiz": return <FileQuestion className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <>
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8 md:mb-10">
          <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-neutral-300 mb-6 md:mb-8">
            <Link href="/admin/dashboard/courses" className="hover:text-brand-navy transition-colors flex items-center gap-1 whitespace-nowrap">
              <ChevronLeft className="h-4 w-4" />
              Courses
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-brand-navy truncate max-w-[150px] sm:max-w-xs">{courseData.title}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 md:pb-8 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 md:gap-5">
              {/* Premium Icon Container */}
              <div className="flex items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-lg md:rounded-xl bg-neutral-100 border border-neutral-200 shadow-sm shrink-0">
                <BookOpen className="h-6 w-6 md:h-7 md:w-7 text-brand-navy" />
              </div>
              
              <div className="flex flex-col justify-center md:mt-1">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <h1 className="text-h3 md:text-h2 text-brand-navy tracking-tight leading-tight">
                    {courseData.title}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 text-[10px] md:text-caption font-medium px-2 md:px-2.5 py-0.5 md:py-1 rounded-full bg-semantic-success-support text-semantic-success-dark whitespace-nowrap">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-semantic-success-main opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-semantic-success-main"></span>
                    </span>
                    Active
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 md:gap-x-5 text-xs md:text-sm text-neutral-300 font-medium">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-neutral-400" />
                    <span>{courseData.students} Active Students</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-neutral-400" />
                    <span>Last updated {courseData.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
              <Button variant="outline" className="w-full sm:w-auto border-neutral-200 text-brand-navy font-semibold h-10 md:h-11 px-6 rounded-md hover:bg-neutral-100 transition-colors shadow-sm">
                Edit Details
              </Button>
              <Button className="w-full sm:w-auto bg-brand-green hover:bg-semantic-success-dark text-white font-semibold rounded-md h-10 md:h-11 px-6 shadow-md transition-all flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </div>
          </div>
        </div>

        {/* Term Management */}
        <div className="space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-h3 text-brand-navy tracking-tight font-semibold">Curriculum</h3>
          
          <div className="grid gap-4 md:gap-6">
            {terms.map((term) => (
              <div key={term.id} className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                <div className="p-4 md:p-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base md:text-body-lg font-bold text-brand-navy">{term.name}</h4>
                    <span className={cn(
                      "text-[10px] md:text-caption font-medium px-2 md:px-2.5 py-0.5 md:py-1 rounded-full whitespace-nowrap",
                      term.status === "active" ? "bg-semantic-success-support text-semantic-success-dark" : "bg-neutral-200 text-neutral-400"
                    )}>
                      {term.status === "active" ? "Published" : "Draft"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-5 w-full sm:w-auto border-t sm:border-0 border-neutral-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                    <label className="flex items-center cursor-pointer gap-2 md:gap-2.5 group">
                      <span className="text-xs md:text-sm font-medium text-neutral-300 group-hover:text-brand-navy transition-colors">
                        {term.status === "active" ? "Active" : "Inactive"}
                      </span>
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="sr-only"
                          checked={term.status === "active"}
                          onChange={() => toggleTermStatus(term.id)}
                        />
                        <div className={cn(
                          "block w-9 h-5 md:w-11 md:h-6 rounded-full transition-colors duration-300",
                          term.status === "active" ? "bg-brand-green" : "bg-neutral-300"
                        )}></div>
                        <div className={cn(
                          "absolute left-0.5 md:left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm",
                          term.status === "active" ? "transform translate-x-4 md:translate-x-5" : ""
                        )}></div>
                      </div>
                    </label>
                    <button className="text-neutral-300 hover:text-brand-navy transition-colors p-1 rounded-md hover:bg-neutral-100">
                      <MoreHorizontal className="h-5 w-5 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 md:p-6 bg-neutral-100/30">
                  {term.modules.length > 0 ? (
                    <div className="space-y-3">
                      {term.modules.map((module, idx) => (
                        <div key={module.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-md border border-neutral-200 bg-white hover:border-brand-green/40 transition-colors group shadow-sm gap-3">
                          <div className="flex items-start sm:items-center gap-3 md:gap-4">
                            <span className="text-xs md:text-sm font-bold text-neutral-300 w-4 md:w-5 text-left sm:text-right pt-0.5 sm:pt-0 shrink-0">{idx + 1}.</span>
                            <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-md bg-neutral-100 flex items-center justify-center text-brand-navy group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors">
                              {getIconForType(module.type)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm md:text-body font-semibold text-brand-navy leading-tight md:leading-none mb-1 md:mb-1.5 truncate">{module.title}</p>
                              <p className="text-xs md:text-sm text-neutral-300 capitalize flex flex-wrap items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                                {module.type} <span className="text-neutral-200 mx-0.5 hidden sm:inline">|</span> <span className="sm:inline block w-full sm:w-auto">{module.duration}</span>
                              </p>
                            </div>
                          </div>
                          <button className="text-xs md:text-sm font-medium text-brand-green opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:underline self-start sm:self-auto ml-10 sm:ml-0 px-2 py-1 sm:p-0">
                            Edit
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 md:py-10 px-4">
                      <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 md:mb-4 border border-neutral-200">
                        <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-neutral-300" />
                      </div>
                      <p className="text-sm md:text-body font-semibold text-brand-navy">No modules yet</p>
                      <p className="text-xs md:text-sm text-neutral-300 mt-1 md:mt-1.5 mb-4 md:mb-5 max-w-sm mx-auto">Build out this term's curriculum by adding videos, reading materials, or quizzes.</p>
                      <Button variant="outline" size="sm" className="h-9 md:h-10 text-xs md:text-sm font-medium border-neutral-200 text-brand-navy rounded-md hover:bg-neutral-100 shadow-sm">
                        <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
                        Add First Module
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
