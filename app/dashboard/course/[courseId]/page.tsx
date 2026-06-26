"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle, FileText, Lock, ShoppingCart,
  Eye, Loader2, BookOpen, Tag, ChevronDown,
  X,
} from "lucide-react";
import { AvailableCourses, PageHeader } from "@/components/dashboard";
import { use, useState, useEffect } from "react";
import { useCourseDetails, useStudentDashboard } from "@/hooks/useStudentDashboard";
import { usePaystack } from "@/hooks/usePaystack";
import { PaymentSuccessModal } from "@/components/modals/PaymentSuccessModal";
import { fetchCourseTopics, TopicWithSubtopics } from "@/app/api/courses";

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;
  const router = useRouter();

  const { data: courseData, isLoading, error } = useCourseDetails(courseId);
  const { data: dashboardData } = useStudentDashboard(1, 10);
  const { checkout, status: payStatus, error: payError, reset: payReset } = usePaystack();

  const course = courseData?.course;
  const isPurchased = courseData?.isPurchased;
  const otherCourses = dashboardData?.available?.filter((c) => c.id !== courseId).slice(0, 4) || [];

  const [topics, setTopics] = useState<TopicWithSubtopics[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourseTopics(courseId)
      .then((data) => {
        setTopics(data);
        if (data.length > 0) setExpandedTopics(new Set([data[0].id]));
        setTopicsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch topics", err);
        setTopicsLoading(false);
      });
  }, [courseId]);

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePayNow = async () => {
    await checkout(courseId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#17A546]" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] text-center p-6">
        <div>
          <h2 className="text-xl font-bold text-[#0A1B39] mb-2">Course not found</h2>
          <p className="text-[#676E85] text-sm mb-6">
            The course you are looking for does not exist or you do not have permission to view it.
          </p>
          <Link href="/dashboard" className="text-[#17A546] hover:underline font-medium text-sm">
            Go back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handlePreview = () => {
    router.push(`/dashboard/read/${courseId}?preview=true`);
  };

  const totalSubtopics = topics.reduce((acc, t) => acc + (t.subtopics?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 h-13 flex items-center max-w-7xl mx-auto">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-[#676E85] hover:text-[#0A1B39] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
          <div className="w-full lg:w-[42%] bg-neutral-50/50 p-6 sm:p-10 flex flex-col items-center justify-start border-b lg:border-b-0 lg:border-r border-neutral-100">
            <div className="relative w-full aspect-[4/5] sm:aspect-3/4 rounded-xl overflow-hidden border border-neutral-200/80 shadow-md">
              <Image
                src={course?.coverImagePath || "/img/hero_section.png"}
                alt={`${course.title} cover`}
                fill
                className="object-cover w-full h-full"
                priority
              />
              {!isPurchased && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center">
                  <div className="bg-white/10 rounded-full p-2.5 mb-2.5 border border-white/20">
                    <Lock className="w-5 h-5 sm:w-7 sm:h-7 opacity-90" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold mb-1">Full Document Locked</p>
                  <p className="text-[11px] opacity-75 mb-4 leading-relaxed">
                    Purchase to unlock full PDF access
                  </p>
                  <button
                    onClick={handlePreview}
                    className="bg-white/15 hover:bg-white/25 border border-white/30 text-white px-3 py-1.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview First 3 Pages
                  </button>
                </div>
              )}
            </div>

            {isPurchased && (
              <p className="mt-4 text-sm text-[#17A546] flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4" />
                You own this material
              </p>
            )}
          </div>

          <div className="w-full lg:w-[58%] p-5 sm:p-8 lg:p-10 flex flex-col">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold text-[#0A1B39] uppercase tracking-wide">
                  <Tag className="w-2.5 h-2.5" />
                  {course.category}
                </span>
                {course.level && (
                  <span className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                    {course.level}
                  </span>
                )}
                {course.term && (
                  <span className="inline-flex items-center rounded-md border border-purple-100 bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-600 capitalize tracking-wide">
                    {course.term} Term
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#0A1B39] mb-2 leading-tight">
                {course.title}
              </h1>

              {course.subject && (
                <p className="text-xs sm:text-sm text-[#17A546] font-medium mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.subject}
                </p>
              )}

              <p className="text-[13px] sm:text-[15px] text-[#676E85] mb-6 leading-relaxed">
                {course.description || "No description provided."}
              </p>

              {/* Course Highlights */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="flex flex-col items-center text-center gap-1.5 bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
                  <span className="text-[#17A546] bg-[#17A546]/10 w-9 h-9 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Format</span>
                  <span className="text-[12px] font-semibold text-[#0A1B39]">Rich Text</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
                  <span className="text-[#4F71E8] bg-[#4F71E8]/10 w-9 h-9 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Access</span>
                  <span className="text-[12px] font-semibold text-[#0A1B39]">Lifetime</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
                  <span className="text-[#FF8A00] bg-[#FF8A00]/10 w-9 h-9 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Updates</span>
                  <span className="text-[12px] font-semibold text-[#0A1B39]">Free</span>
                </div>
              </div>

              {/* What's Included */}
              <div className="space-y-3 mb-6 bg-neutral-50/50 p-4 rounded-xl border border-neutral-100/60">
                <h3 className="text-[11px] font-bold text-[#0A1B39] uppercase tracking-wider flex items-center gap-1.5">
                  What's included
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Full comprehensive document",
                    "Printable high-quality PDF format",
                    "Lifetime access to updates",
                    "Premium support"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#676E85] font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-[#17A546] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-5 border-t border-neutral-100 mt-auto">
              {!isPurchased ? (
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] text-[#676E85] mb-1 uppercase tracking-wide font-medium">One-time payment</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#0A1B39]">
                        ₦{(course.price / 100).toLocaleString()}
                      </span>
                      {course.originalPrice && (
                        <span className="text-sm text-[#98A2B3] line-through font-medium">
                          ₦{(course.originalPrice / 100).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <p className="text-[11px] text-[#17A546] font-semibold mt-0.5">
                        Save ₦{((course.originalPrice - course.price) / 100).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-[340px]">
                    {payStatus === "failed" && payError && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center justify-between">
                        <span>{payError}</span>
                        <button onClick={payReset} className="p-1 hover:bg-red-100 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={handlePreview}
                        className="shrink-0 bg-neutral-100 hover:bg-neutral-200 text-[#0A1B39] px-4 py-2.5 rounded-lg font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={handlePayNow}
                        disabled={payStatus === "loading"}
                        className="flex-1 bg-[#17A546] hover:bg-[#128638] text-white px-6 py-2.5 rounded-lg font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {payStatus === "loading" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                        {payStatus === "loading" ? "Processing..." : "Pay Now"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#676E85] mb-1 uppercase tracking-wide font-medium">Status</p>
                    <p className="font-bold text-[#17A546] flex items-center gap-1.5 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Purchased
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/read/${resolvedParams.courseId}`}
                    className="bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Open Material
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* ── Curriculum ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#0A1B39] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#17A546]" />
              Curriculum
            </h2>
            {!topicsLoading && topics.length > 0 && (
              <span className="text-[10px] font-medium text-neutral-400">
                {topics.length} topics · {totalSubtopics} chapters
              </span>
            )}
          </div>

          {topicsLoading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-300" />
            </div>
          ) : topics.length === 0 ? (
            <p className="text-xs text-neutral-400 p-6 text-center">
              No content has been added yet.
            </p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {topics.map((topic, tIndex) => {
                const isOpen = expandedTopics.has(topic.id);
                const subtopicCount = topic.subtopics?.length ?? 0;

                return (
                  <div key={topic.id}>
                    {/* Topic row — collapsible trigger */}
                    <button
                      onClick={() => toggleTopic(topic.id)}
                      className="w-full flex items-center gap-3 px-4 sm:px-6 py-3.5 hover:bg-neutral-50/80 transition-colors text-left group"
                    >
                      {/* Index pill */}
                      <span className="shrink-0 w-5 h-5 rounded-full bg-[#17A546]/10 text-[#17A546] text-[9px] font-bold flex items-center justify-center">
                        {tIndex + 1}
                      </span>

                      <span className="flex-1 text-[13px] sm:text-sm font-semibold text-[#0A1B39] leading-snug">
                        {topic.title}
                      </span>

                      <span className="text-[10px] text-neutral-400 font-medium shrink-0 mr-1 hidden sm:inline">
                        {subtopicCount} {subtopicCount === 1 ? "chapter" : "chapters"}
                      </span>

                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Subtopics — animated collapse */}
                    {isOpen && subtopicCount > 0 && (
                      <div className="border-t border-neutral-100 bg-neutral-50/40">
                        {topic.subtopics.map((subtopic, sIndex) => {
                          const isUnlocked = isPurchased || (tIndex === 0 && sIndex < 2);

                          return (
                            <div
                              key={subtopic.id}
                              className="border-b last:border-0 border-neutral-100/80 px-4 sm:px-6 py-3"
                            >
                              {/* Subtopic header */}
                              <div className="flex items-center gap-2.5 mb-2">
                                <span className="shrink-0 text-[9px] font-bold text-neutral-400 w-8 text-right tabular-nums">
                                  {tIndex + 1}.{sIndex + 1}
                                </span>
                                <h4 className="flex-1 text-[12px] sm:text-[13px] font-semibold text-[#0A1B39] leading-snug">
                                  {subtopic.title}
                                </h4>
                                {!isUnlocked ? (
                                  <span className="shrink-0 flex items-center gap-1 text-[9px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                                    <Lock className="w-2.5 h-2.5" />
                                    Locked
                                  </span>
                                ) : !isPurchased ? (
                                  <span className="shrink-0 text-[9px] font-semibold text-[#17A546] bg-[#17A546]/8 px-2 py-0.5 rounded-full border border-[#17A546]/15">
                                    Free
                                  </span>
                                ) : null}
                              </div>

                              {/* Materials */}
                              {subtopic.materials && subtopic.materials.length > 0 && (
                                <div className="pl-10 sm:pl-[2.625rem] space-y-1.5">
                                  {subtopic.materials.map((mat: any) => (
                                    <div
                                      key={mat.id}
                                      className="flex items-center gap-2 p-2 sm:p-2.5 bg-white rounded-lg border border-neutral-200/70 hover:border-neutral-300 transition-colors"
                                    >
                                      <div className="p-1 bg-neutral-50 rounded-md shrink-0">
                                        <FileText className="h-3 w-3 text-[#17A546]" />
                                      </div>
                                      <span className="text-[11px] sm:text-[12px] text-[#0A1B39] font-medium flex-1 truncate">
                                        {mat.title}
                                      </span>
                                      <div className="flex items-center gap-2 shrink-0">
                                        {mat.fileSize && (
                                          <span className="text-[9px] text-neutral-400 font-medium hidden sm:inline tabular-nums">
                                            {(mat.fileSize / 1024 / 1024).toFixed(1)} MB
                                          </span>
                                        )}
                                        {!isUnlocked && (
                                          <Lock className="w-3 h-3 text-neutral-300" />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Empty topic state */}
                    {isOpen && subtopicCount === 0 && (
                      <div className="px-4 sm:px-6 py-3 bg-neutral-50/40 border-t border-neutral-100">
                        <p className="text-[11px] text-neutral-400 pl-8">No chapters added yet.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Other Courses ────────────────────────────────────────── */}
        {otherCourses.length > 0 && (
          <div className="pt-4">
            <AvailableCourses title="You might also like" courses={otherCourses} />
          </div>
        )}
      </main>

      {payStatus === "success" && (
        <PaymentSuccessModal onClose={() => { payReset(); router.push("/dashboard"); }} />
      )}
    </div>
  );
}