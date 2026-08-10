"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, Loader2, ChevronDown, ChevronRight, Lock, FileText, CheckCircle, Menu, X, Video, Play, Sparkles, ArrowRight } from "lucide-react";
import { EmbedPDF, VideoPlayer } from "@/components/dashboard";
import { use, Suspense, useState, useEffect, useRef } from "react";
import { useCourseDetails } from "@/hooks/useStudentDashboard";
import { fetchCourseTopics, TopicWithSubtopics, SubtopicWithMaterials, MaterialWithUrl } from "@/app/api/courses";
import { hasVideoAccess, TIERS } from "@/lib/tiers";

function ReadCourseContent({ courseId }: { courseId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const { data: courseData, isLoading: isLoadingCourse, error: courseError } = useCourseDetails(courseId);

  const [topics, setTopics] = useState<TopicWithSubtopics[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);

  const [activeTopic, setActiveTopic] = useState<TopicWithSubtopics | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [activeSubtopic, setActiveSubtopic] = useState<SubtopicWithMaterials | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<MaterialWithUrl | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Header hide-on-scroll-up / show-on-scroll-down
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current + 4) {
        setIsHeaderVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCourseTopics(courseId)
        .then(data => {
          setTopics(data);
          if (data.length > 0) {
            setActiveTopic(data[0]);
            setExpandedTopics(new Set([data[0].id]));
            if (data[0].videos && data[0].videos.length > 0) {
              setActiveVideo(data[0].videos[0]);
              setActiveSubtopic(null);
            } else if (data[0].subtopics && data[0].subtopics.length > 0) {
              selectSubtopic(data[0].subtopics[0]);
              setActiveVideo(null);
            }
          }
          setIsLoadingTopics(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoadingTopics(false);
        });
    }
  }, [courseId]);

  if (isLoadingCourse || isLoadingTopics) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F7F9FC]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (courseError || !courseData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F7F9FC]">
        <h2 className="text-2xl font-bold text-[#0A1B39] mb-2">Error Loading Document</h2>
        <p className="text-[#676E85] mb-6">Could not load the requested material.</p>
        <Link href={`/dashboard/course/${courseId}`} className="text-brand-green hover:underline">
          Go back
        </Link>
      </div>
    );
  }

  const { course, isPurchased, purchasedTier } = courseData;

  if (!isPreview && !isPurchased) {
    router.replace(`/dashboard/course/${courseId}`);
    return null;
  }

  const handleRequestPurchase = () => {
    router.push(`/dashboard/course/${courseId}`);
  };

  const selectTopic = (topic: TopicWithSubtopics) => {
    setActiveTopic(topic);
    const next = new Set(expandedTopics);
    next.add(topic.id);
    setExpandedTopics(next);

    if (topic.videos && topic.videos.length > 0) {
      setActiveVideo(topic.videos[0]);
      setActiveSubtopic(null);
    } else if (topic.subtopics && topic.subtopics.length > 0) {
      selectSubtopic(topic.subtopics[0]);
      setActiveVideo(null);
    }
  };

  const toggleTopic = (id: string) => {
    const next = new Set(expandedTopics);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedTopics(next);
  };

  const isSubtopicUnlocked = (topicIndex: number, subtopicIndex: number) => {
    if (isPurchased) return true;
    return topicIndex === 0 && subtopicIndex < 2;
  };

  const selectSubtopic = (subtopic: SubtopicWithMaterials) => {
    setActiveSubtopic(subtopic);
    if (subtopic.materials.length > 0) {
      setActiveMaterial(subtopic.materials[0]);
    } else {
      setActiveMaterial(null);
    }
  };

  const currentTopic = activeTopic || topics.find((t) => (activeSubtopic && t.subtopics.some((s) => s.id === activeSubtopic?.id)) || (activeVideo && t.videos?.some((v) => v.id === activeVideo?.id))) || topics[0];
  const canWatchVideos = hasVideoAccess(purchasedTier);

  return (
    <div className="h-[100dvh] flex flex-col bg-[#F7F9FC] overflow-hidden -mt-16 lg:mt-0 relative z-[60]">

      {/* ── Reader Header ───────────────────────────────────────────── */}
      <header
        className={`
          shrink-0 bg-white border-b border-neutral-100/80 relative z-20
          transition-transform duration-300 ease-in-out
          ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="px-4 sm:px-6 h-12 flex items-center gap-4 w-full">
          {/* Back & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-1.5 -ml-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              href={isPreview ? `/dashboard/course/${courseId}` : "/dashboard/purchased"}
              className="flex items-center gap-1.5 text-sm font-medium text-[#676E85] hover:text-[#0A1B39] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>

          {/* Title — centred */}
          <div className="flex-1 flex justify-center min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="shrink-0 w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-[#4F71E8]" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#0A1B39] truncate leading-none mb-0.5">
                  {course.title}
                </p>
                <p className="text-[11px] text-neutral-400 leading-none capitalize truncate">
                  {course.subject} {course.category === "school" && `· ${course.term} Term`}
                  {purchasedTier && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-[#17A546]/10 text-[#17A546] text-[8px] font-bold border border-[#17A546]/20 uppercase">
                      {purchasedTier}
                    </span>
                  )}
                  {isPreview && !isPurchased && (
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[6px] font-semibold border border-amber-200/60">
                      PREVIEW
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {!isPurchased && (
            <button
              onClick={handleRequestPurchase}
              className="shrink-0 bg-[#17A546] hover:bg-[#128638] text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-4 py-1.5 rounded-lg shadow-sm"
            >
              Unlock Course
            </button>
          )}
        </div>
      </header>

      {/* ── Main Layout (Sidebar + Content) ────────────────────────── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">

        {/* Sidebar overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-neutral-900/40 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          absolute md:relative z-40 h-full w-72 bg-white border-r border-neutral-200 overflow-y-auto shrink-0 flex flex-col transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#0A1B39]">Course Content</h4>
              <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                {isPurchased ? (
                  <><CheckCircle className="h-3 w-3 text-brand-green" /> {purchasedTier ? `${purchasedTier.toUpperCase()} Access` : "Full Access"}</>
                ) : (
                  <><Lock className="h-3 w-3 text-amber-500" /> Preview Mode</>
                )}
              </div>
            </div>
            <button
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-2 space-y-1 overflow-y-auto">
            {topics.length === 0 ? (
              <p className="text-xs text-neutral-500 p-4 text-center">No content available.</p>
            ) : (
              topics.map((topic, tIndex) => {
                const isCurrentTopic = currentTopic?.id === topic.id;

                return (
                  <div key={topic.id} className="mb-1">
                    <button
                      onClick={() => selectTopic(topic)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${isCurrentTopic ? "bg-neutral-100/80" : "hover:bg-neutral-50"
                        }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
                        <span className="font-semibold text-[13px] text-[#0A1B39] text-left truncate">
                          {topic.title}
                        </span>
                        {topic.videos && topic.videos.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold  bg-[#17A546]/10 text-[#17A546] border border-blue-200/60 px-1.5 py-0.5 rounded-full shrink-0">
                            <Video className="w-2.5 h-2.5" />
                            {topic.videos.length}
                          </span>
                        )}
                      </div>
                      <span className="text-neutral-400 shrink-0">
                        {expandedTopics.has(topic.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </span>
                    </button>

                    {expandedTopics.has(topic.id) && (
                      <div className="mt-0.5 space-y-0.5 relative before:absolute before:left-2 before:top-0 before:bottom-2 before:w-px before:bg-neutral-200 pl-4">
                        {/* Topic Video Items */}
                        {topic.videos && topic.videos.map((vid) => {
                          const isVideoActive = activeVideo?.id === vid.id;

                          return (
                            <button
                              key={vid.id}
                              onClick={() => {
                                setActiveVideo(vid);
                                setActiveSubtopic(null);
                                setIsSidebarOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-md text-[12px] text-left transition-all ${isVideoActive
                                ? "bg-[#17A546]/10 text-[#17A546] font-semibold border border-blue-200/60"
                                : "hover:bg-neutral-50 text-[#0A1B39]"
                                }`}
                            >
                              <Video className="h-3.5 w-3.5 shrink-0 text-[#17A546]/80" />
                              <span className="line-clamp-1 flex-1 font-medium">{vid.title || "Video Lecture"}</span>
                              {!canWatchVideos && <Lock className="h-3 w-3 text-amber-500 shrink-0" />}
                            </button>
                          );
                        })}

                        {/* Subtopics (PDF Materials) */}
                        {topic.subtopics.map((sub, sIndex) => {
                          const unlocked = isSubtopicUnlocked(tIndex, sIndex);
                          const isActive = activeSubtopic?.id === sub.id && !activeVideo;

                          return (
                            <button
                              key={sub.id}
                              disabled={!unlocked}
                              onClick={() => {
                                selectSubtopic(sub);
                                setActiveVideo(null);
                                setIsSidebarOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-md text-[12px] text-left transition-all ${isActive
                                ? "bg-[#17A546]/10 text-[#17A546] font-medium"
                                : "hover:bg-neutral-50 text-[#676E85]"
                                } ${!unlocked ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              {!unlocked ? (
                                <Lock className="h-3 w-3 shrink-0 opacity-50" />
                              ) : (
                                <FileText className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-[#17A546]" : "text-neutral-400"}`} />
                              )}
                              <span className="line-clamp-2 flex-1">{sub.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Content Area — scroll container for header hide/show */}
        <main
          ref={scrollContainerRef}
          className="flex-1 bg-neutral-100/50 flex flex-col min-w-0 p-4 pb-2 lg:p-6 lg:pb-3 overflow-y-auto relative"
        >
          {activeVideo ? (
            /* 🎬 VIDEO PLAYER VIEW */
            <div className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#17A546]/20 border border-[#17A546]/20 flex items-center justify-center text-[#17A546]">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#0A1B39]">
                      {activeVideo.title || "Topic Video Lecture"}
                    </h3>
                    <p className="text-[11px] text-[#676E85]">
                      {currentTopic?.title} Video Lecture
                    </p>
                  </div>
                </div>
              </div>

              {canWatchVideos ? (
                <div className="flex-1 min-h-0 space-y-4">
                  <VideoPlayer videoUrl={activeVideo.videoUrl} title={activeVideo.title} />

                  {/* ── Below-Video Learning & Progression Suite ────────────────── */}
                  <div className="space-y-3.5 pb-6">
                    {/* 1. Next Lesson / Up Next Progression Card */}
                    <div className="bg-white p-3.5 rounded-md border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-[#17A546]/30">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#17A546]/20 border border-[#17A546]/20 flex items-center justify-center text-[#17A546] shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#0A1B39]">Up Next in {currentTopic?.title || "Course"}</p>
                          <h4 className="text-[11px] text-[#676E85]">
                            {currentTopic?.subtopics && currentTopic.subtopics.length > 0
                              ? currentTopic.subtopics[0].title
                              : `${currentTopic?.title || "Topic"} Reading Material`}
                          </h4>
                        </div>
                      </div>

                      {currentTopic?.subtopics && currentTopic.subtopics.length > 0 && (
                        <button
                          onClick={() => {
                            selectSubtopic(currentTopic.subtopics[0]);
                            setActiveVideo(null);
                          }}
                          className="bg-[#17A546] hover:bg-[#128638] text-white text-xs font-bold px-4 py-2.5 rounded-md transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]"
                        >
                          <span>Continue Reading</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* 2. Key Concepts & Overview Card */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-[#0A1B39] flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#17A546]" />
                          Lesson Overview & Objectives
                        </h4>
                        <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200/60 px-2 py-0.5 rounded-full">
                          {currentTopic?.title}
                        </span>
                      </div>

                      <p className="text-xs text-[#676E85] leading-relaxed">
                        This video lecture provides visual explanations for <span className="font-semibold text-[#0A1B39]">{currentTopic?.title}</span>. Review key steps in the video, then continue to the detailed printable PDF notes for practice questions.
                      </p>

                      <div className="pt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-[#F7F9FC] border border-neutral-200/60 flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-[#17A546] mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-[#0A1B39]">Visual Explanations</p>
                            <p className="text-[11px] text-[#676E85] mt-0.5">Step-by-step problem solving & diagram breakdowns</p>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-[#F7F9FC] border border-neutral-200/60 flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-[#17A546] mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-[#0A1B39]">Syllabus Aligned Notes</p>
                            <p className="text-[11px] text-[#676E85] mt-0.5">Directly matches printable PDF course materials</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-2xl border border-[#17A546]/30 p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-sm space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#17A546]/10 border border-[#17A546]/20 flex items-center justify-center text-[#17A546]">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="max-w-md space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0A1B39]">
                      🎬 Video Lecture Locked
                    </h3>
                    <p className="text-xs sm:text-sm text-[#676E85] leading-relaxed">
                      Topic video lectures are available on <span className="font-bold text-[#17A546]">Standard</span> and <span className="font-bold text-[#17A546]">Premium</span> tiers. Upgrade your access to watch video lectures!
                    </p>
                  </div>
                  <button
                    onClick={handleRequestPurchase}
                    className="bg-[#17A546] hover:bg-[#128638] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Upgrade Tier
                  </button>
                </div>
              )}
            </div>
          ) : activeSubtopic ? (
            /* 📄 PDF SUBTOPIC MATERIAL VIEW */
            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl border border-neutral-200/70 shadow-sm overflow-hidden">
              {/* Material Tabs if multiple PDFs exist */}
              {activeSubtopic.materials.length > 1 && (
                <div className="flex items-center gap-2 p-2 border-b border-neutral-100 bg-neutral-50/50 overflow-x-auto shrink-0">
                  {activeSubtopic.materials.map((mat, i) => (
                    <button
                      key={mat.id}
                      onClick={() => setActiveMaterial(mat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${activeMaterial?.id === mat.id
                        ? "bg-white text-[#17A546] shadow-sm font-medium border border-neutral-200/50"
                        : "text-[#676E85] hover:bg-neutral-100"
                        }`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Material {i + 1}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 min-h-0 relative">
                {activeMaterial?.fileUrl ? (
                  <EmbedPDF
                    src={activeMaterial.fileUrl}
                    title={activeMaterial.title}
                    isPreview={isPreview && !isPurchased}
                    previewPageLimit={3}
                    onRequestPurchase={handleRequestPurchase}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#676E85] p-8 text-center">
                    <FileText className="h-12 w-12 text-neutral-300 mb-4" />
                    <h3 className="font-semibold text-[#0A1B39] text-lg">No Materials Available</h3>
                    <p className="mt-1 text-sm max-w-sm">No PDF materials have been uploaded for this subtopic yet.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-neutral-200/70 shadow-sm">
              <div className="text-center text-neutral-500">
                <BookOpen className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                <p>Select a video or reading material from the sidebar to start learning.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ReadCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);

  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#F7F9FC]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    }>
      <ReadCourseContent courseId={courseId} />
    </Suspense>
  );
}