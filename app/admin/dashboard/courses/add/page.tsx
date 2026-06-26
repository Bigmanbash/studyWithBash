"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Save,
  Layout,
  Palette,
  Settings2,
  UploadCloud,
  File as FileIcon,
  X,
  FileText,
  ImageIcon,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { createCourseRequest, updateCourseRequest } from "@/app/api/courses";
import { uploadFile } from "@/lib/supabase/storage";
import { useAdminStore } from "@/store/adminStore";
import { SUBJECT_BRAND_COLORS, SUBJECTS } from "@/lib/constants";
import { TopicManager } from "@/components/admin/TopicManager";

const AddCoursePage = () => {
  const router = useRouter();
  const [courseData, setCourseData] = useState({
    title: "",
    subject: "",
    level: "SS1",
    color: "bg-blue-500",
    status: "draft" as "active" | "draft",
    price: "",
    originalPrice: "",
    description: "",
    term: "first" as "first" | "second" | "third" | "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image",
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "image") setCoverImage(e.target.files[0]);
    }
  };

  const { setStatusModal, closeStatusModal } = useAdminStore();

  const saveCourseDetails = async (status: "active" | "draft", silent = false): Promise<string | null> => {
    if (!courseData.title || !courseData.subject) {
      if (!silent) {
        setStatusModal({
          title: "Validation Error",
          message: "Please provide at least a title and subject for the course.",
          type: "error",
        });
      }
      return null;
    }

    try {
      setIsSaving(true);
      if (!silent) {
        setStatusModal({
          title: "Saving Course...",
          message: "Uploading assets and saving details. Please wait.",
          type: "loading",
        });
      }

      const price = (parseInt(courseData.price) || 0) * 100;
      const originalPrice = courseData.originalPrice ? parseInt(courseData.originalPrice) * 100 : null;

      const slug = courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

      let mappedCategory: "school" | "exam" = "school";
      let mappedLevel: "SSS1" | "SSS2" | "SSS3" | null = null;
      let mappedSubject = courseData.subject;

      if (["WAEC", "NECO", "JAMB"].includes(courseData.level)) {
        mappedCategory = "exam";
        mappedLevel = null;
        mappedSubject = `${courseData.level} ${courseData.subject}`.trim();
      } else {
        mappedCategory = "school";
        if (courseData.level === "SS1" || courseData.level === "SSS1") mappedLevel = "SSS1";
        if (courseData.level === "SS2" || courseData.level === "SSS2") mappedLevel = "SSS2";
        if (courseData.level === "SS3" || courseData.level === "SSS3") mappedLevel = "SSS3";
      }

      let mappedTerm: "first" | "second" | "third" | null = null;
      if (mappedCategory === "school" && courseData.term) {
        mappedTerm = courseData.term as "first" | "second" | "third";
      }

      let uploadedCoverPath = "/img/hero_section.png";

      if (coverImage) {
        const coverExt = coverImage.name.split(".").pop();
        const coverFilename = `cover-${Date.now()}.${coverExt}`;
        uploadedCoverPath = await uploadFile(coverFilename, coverImage);
      }

      const payload = {
        title: courseData.title,
        slug,
        category: mappedCategory,
        level: mappedLevel,
        term: mappedTerm,
        subject: mappedSubject,
        description: courseData.description,
        coverImagePath: uploadedCoverPath,
        status,
        price,
        originalPrice,
      };

      let finalId = createdCourseId;

      if (createdCourseId) {
        await updateCourseRequest(createdCourseId, payload);
      } else {
        const createdCourse = await createCourseRequest(payload);
        setCreatedCourseId(createdCourse.id);
        finalId = createdCourse.id;
      }

      if (!silent) {
        setStatusModal({
          title: "Success",
          message: "Course saved successfully!",
          type: "success",
        });

        setTimeout(() => {
          router.push("/admin/dashboard/courses");
        }, 1000);
      }

      return finalId;
    } catch (error) {
      console.error("Failed to save course:", error);
      setStatusModal({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to save course. Please check the console for details.",
        type: "error",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (status: "active" | "draft") => {
    await saveCourseDetails(status, false);
  };

  const handleTabChange = async (tab: "details" | "content") => {
    if (tab === "content" && !createdCourseId) {
      // Auto-save as draft to generate an ID before switching
      if (!courseData.title || !courseData.subject) {
        setStatusModal({
          title: "Action Required",
          message: "Please enter a Course Title and Subject before adding Course Material.",
          type: "error",
        });
        return;
      }

      setStatusModal({
        title: "Preparing Course...",
        message: "Generating course environment...",
        type: "loading",
      });

      const newId = await saveCourseDetails("draft", true);

      if (newId) {
        closeStatusModal();
        setActiveTab("content");
      }
    } else {
      setActiveTab(tab);
    }
  };

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
              onClick={() => handleSave("draft")}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Save as Draft</span>
                  <span className="sm:hidden">Draft</span>
                </>
              )}
            </Button>

            <Button
              className="bg-brand-green hover:bg-semantic-success-dark text-white font-bold h-8 sm:h-9 px-3 sm:px-5 rounded-md shadow-sm transition-all flex items-center"
              onClick={() => handleSave("active")}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Publish Course</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-h2 tracking-tight mb-2 text-[#0A1B39]">
            Create New Course
          </h1>
          <p className="text-sm text-[#676E85]">
            Set up the course details and upload the PDF material and cover
            image.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 bg-neutral-100/50 p-1 rounded-xl border border-neutral-200/60 w-full sm:w-fit overflow-x-auto">
            <button
              onClick={() => handleTabChange("details")}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "details"
                  ? "bg-white text-[#17A546] shadow-sm border border-neutral-200/50"
                  : "text-[#676E85] hover:text-[#0A1B39]"
              }`}
            >
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">Course Settings</span>
              <span className="sm:hidden">Settings</span>
            </button>

            <button
              onClick={() => handleTabChange("content")}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "content"
                  ? "bg-white text-[#17A546] shadow-sm border border-neutral-200/50"
                  : "text-[#676E85] hover:text-[#0A1B39]"
              }`}
            >
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">Course Material</span>
              <span className="sm:hidden">Material</span>
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
                  <label className="block text-sm font-bold text-[#0A1B39] mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Physics for Beginners"
                    className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-[#17A546]/40 focus:ring-2 focus:ring-[#17A546]/20 transition-all text-[#0A1B39] font-medium"
                    value={courseData.title}
                    onChange={(e) =>
                      setCourseData({ ...courseData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1B39] mb-2">
                    Course Description
                  </label>
                  <textarea
                    placeholder="Enter a brief description of what this course covers..."
                    className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-[#17A546]/40 focus:ring-2 focus:ring-[#17A546]/20 transition-all text-[#0A1B39] font-medium min-h-[100px] resize-y"
                    value={courseData.description}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A1B39] mb-2">
                      Subject Category
                    </label>
                    <select
                      className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-[#17A546]/40 focus:ring-2 focus:ring-[#17A546]/20 transition-all text-[#0A1B39] font-medium appearance-none cursor-pointer"
                      value={courseData.subject}
                      onChange={(e) => {
                        const newSubject = e.target.value;
                        const mappedColor = SUBJECT_BRAND_COLORS[newSubject];
                        setCourseData({
                          ...courseData,
                          subject: newSubject,
                          ...(mappedColor ? { color: mappedColor } : {}),
                        });
                      }}
                    >
                      <option value="">Select subject...</option>
                      {SUBJECTS.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1B39] mb-2">
                      Target Level
                    </label>
                    <select
                      className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-[#17A546]/40 focus:ring-2 focus:ring-[#17A546]/20 transition-all text-[#0A1B39] font-medium appearance-none cursor-pointer"
                      value={courseData.level}
                      onChange={(e) =>
                        setCourseData({ ...courseData, level: e.target.value })
                      }
                    >
                      <option value="SS1">SS1</option>
                      <option value="SS2">SS2</option>
                      <option value="SS3">SS3</option>
                      <option value="WAEC">WAEC</option>
                      <option value="NECO">NECO</option>
                      <option value="JAMB">JAMB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1B39] mb-2">
                      Term
                    </label>
                    <select
                      className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-[#17A546]/40 focus:ring-2 focus:ring-[#17A546]/20 transition-all text-[#0A1B39] font-medium appearance-none cursor-pointer disabled:opacity-50"
                      value={courseData.term}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          term: e.target.value as any,
                        })
                      }
                      disabled={["WAEC", "NECO", "JAMB"].includes(
                        courseData.level,
                      )}
                    >
                      <option value="">None / N/A</option>
                      <option value="first">First Term</option>
                      <option value="second">Second Term</option>
                      <option value="third">Third Term</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A1B39] mb-2">
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-[#17A546]/40 focus:ring-2 focus:ring-[#17A546]/20 transition-all text-[#0A1B39] font-medium"
                      value={courseData.price}
                      onChange={(e) =>
                        setCourseData({ ...courseData, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1B39] mb-2">
                      Original Price (₦)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 7500"
                      className="w-full bg-neutral-50/50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-[#17A546]/40 focus:ring-2 focus:ring-[#17A546]/20 transition-all text-[#0A1B39] font-medium"
                      value={courseData.originalPrice}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          originalPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Brand Color Selector */}
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Palette className="h-4 w-4 text-neutral-400" />
                  <label className="block text-sm font-bold text-[#0A1B39]">
                    Brand Color (Enforced)
                  </label>
                </div>
                <p className="text-xs text-[#676E85] mb-4">
                  The brand color is strictly mapped to the selected subject and
                  cannot be changed manually.
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      disabled={true}
                      title={c.name}
                      className={`relative h-9 sm:h-10 rounded-lg ${c.class}
                          border transition-all duration-200 cursor-not-allowed
                          ${
                            courseData.color === c.class
                              ? "border-neutral-300 ring-2 ring-neutral-400 ring-offset-1 opacity-100 shadow-sm scale-105"
                              : "border-transparent opacity-30 grayscale"
                          }`}
                    >
                      {courseData.color === c.class && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-2 w-2 bg-white rounded-full shadow-sm"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                <label className="block text-sm font-bold text-[#0A1B39] mb-4">
                  Card Preview
                </label>
                <div className="rounded-xl border border-[#17A546]/30 overflow-hidden bg-white shadow-sm">
                  <div className="relative h-24 w-full bg-neutral-100 overflow-hidden">
                    <img
                      src={
                        coverImage
                          ? URL.createObjectURL(coverImage)
                          : "/img/hero_section.png"
                      }
                      alt="Course cover preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-[13px] font-semibold text-[#0A1B39] line-clamp-2">
                      {courseData.title || "Course Title"}
                    </h4>
                    <p className="text-xs text-[#676E85] mt-1">
                      {courseData.subject || "Subject"} • {courseData.level}
                    </p>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-[13px] font-bold text-[#0A1B39]">
                        ₦{courseData.price || "0"}
                      </span>
                      {courseData.originalPrice && (
                        <span className="text-[11px] text-[#98A2B3] line-through">
                          ₦{courseData.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {createdCourseId ? (
                <TopicManager courseId={createdCourseId} />
              ) : (
                <div className="bg-white p-12 rounded-xl border border-neutral-200 shadow-sm text-center">
                  <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1B39] mb-2">Preparing Content Manager</h3>
                  <p className="text-[#676E85] max-w-md mx-auto mb-6">
                    Generating course environment, please wait...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;
