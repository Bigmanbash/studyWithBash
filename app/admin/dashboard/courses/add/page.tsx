"use client";

import { useState } from "react";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Layout, Palette, Settings2 } from "lucide-react";
import Link from "next/link";
import { TopicEditor } from "@/components/admin/Editor";

export default function AddCoursePage() {
  const [courseData, setCourseData] = useState({
    title: "",
    subject: "",
    level: "SS1",
    color: "bg-blue-500",
    status: "draft"
  });

  const [topicName, setTopicName] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "content">("details");

  const colors = [
    { name: "Blue", class: "bg-blue-500" },
    { name: "Green", class: "bg-[#17A546]" },
    { name: "Amber", class: "bg-amber-500" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "Rose", class: "bg-rose-500" },
    { name: "Cyan", class: "bg-cyan-500" },
    { name: "Yellow", class: "bg-yellow-500" },
    { name: "Pink", class: "bg-pink-500" },
    { name: "Orange", class: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />

      {/* Sticky Top Action Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-20">
        <div className="px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between max-w-5xl mx-auto">

          <Link
            href="/admin/dashboard/courses"
            className="inline-flex items-center text-sm font-semibold text-neutral-400 hover:text-brand-navy transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Back to Courses</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">

            <Button
              variant="outline"
              className="text-brand-navy font-semibold border-neutral-200 h-8 sm:h-9 px-3 sm:px-4 rounded-md shadow-sm text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Save as Draft</span>
              <span className="sm:hidden">Draft</span>
            </Button>

            <Button
              className="bg-brand-green hover:bg-semantic-success-dark text-white font-bold h-8 sm:h-9 px-3 sm:px-5 rounded-md shadow-sm transition-all flex items-center"
            >
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Publish Course</span>
            </Button>

          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-h2 tracking-tight mb-2">Create New Course</h1>
          <p className="text-sm text-neutral-400">
            Set up the course details and start building your first topic using the rich editor.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 bg-neutral-100/50 p-1 rounded-xl border border-neutral-200/60 w-full sm:w-fit overflow-x-auto">

            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "details"
                ? "bg-white text-brand-navy shadow-sm border border-neutral-200/50"
                : "text-neutral-400 hover:text-brand-navy"
                }`}
            >
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">Course Settings</span>
              <span className="sm:hidden">Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "content"
                ? "bg-white text-brand-navy shadow-sm border border-neutral-200/50"
                : "text-neutral-400 hover:text-brand-navy"
                }`}
            >
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">First Topic Content</span>
              <span className="sm:hidden">Content</span>
            </button>

          </div>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "details" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 shadow-sm space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-2">Course Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Physics for Beginners"
                      className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-brand-green/40 focus:ring-2 focus:ring-brand-green/20 transition-all text-brand-navy font-medium"
                      value={courseData.title}
                      onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-brand-navy mb-2">Subject Category</label>
                      {/* TODO: This should be a physics course, chemistry course and so on. And should be a dropdown to select from the available subjects. */}
                      <select
                        className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-brand-green/40 focus:ring-2 focus:ring-brand-green/20 transition-all text-brand-navy font-medium appearance-none cursor-pointer"
                        value={courseData.subject}
                        onChange={(e) => setCourseData({ ...courseData, subject: e.target.value })}
                      >
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Further Mathematics">Further Mathematics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-navy mb-2">Target Level</label>
                      <select
                        className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-brand-green/40 focus:ring-2 focus:ring-brand-green/20 transition-all text-brand-navy font-medium appearance-none cursor-pointer"
                        value={courseData.level}
                        onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                      >
                        <option value="SS1">SS1</option>
                        <option value="SS2">SS2</option>
                        <option value="SS3">SS3</option>
                        <option value="JSS1">JSS1</option>
                        <option value="JSS2">JSS2</option>
                        <option value="JSS3">JSS3</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Brand Color Selector */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Palette className="h-4 w-4 text-neutral-400" />
                    <label className="block text-sm font-bold text-brand-navy">
                      Brand Color
                    </label>
                  </div>

                  <p className="text-xs text-neutral-400 mb-4">
                    This color will be used for course cards and module accents.
                  </p>

                  <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setCourseData({ ...courseData, color: c.class })}
                        title={c.name}
                        className={`relative h-9 sm:h-10 rounded-lg ${c.class}
                          border transition-all duration-200
                          opacity-80 hover:opacity-100 brightness-95
                          ${courseData.color === c.class
                            ? "border-neutral-300 ring-1 ring-neutral-200 opacity-100"
                            : "border-transparent"
                          }`}
                      >
                        {courseData.color === c.class && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 bg-white/90 rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Card */}
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                  <label className="block text-sm font-bold text-brand-navy mb-4">Card Preview</label>
                  <div className="rounded-xl border border-neutral-100 shadow-sm overflow-hidden bg-white">
                    <div className={`h-1.5 ${courseData.color}`}></div>
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`h-10 w-10 rounded-lg ${courseData.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {courseData.subject ? courseData.subject[0] : "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-navy truncate max-w-[150px]">
                            {courseData.title || "Course Title"}
                          </p>
                          <p className="text-xs text-neutral-400">{courseData.level}</p>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full mt-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 shadow-sm mb-8">
                <label className="block text-sm font-bold text-brand-navy mb-2">Topic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to Kinematics"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-brand-green/40 focus:ring-2 focus:ring-brand-green/20 transition-all text-brand-navy font-medium text-lg"
                />
              </div>

              {/* WYSIWYG Advanced Editor Component */}
              <TopicEditor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
