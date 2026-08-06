"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Plus, Trash2, File as FileIcon, ChevronDown, ChevronRight, 
  UploadCloud, Settings2, Check, X, Loader2, AlertCircle, Video, Play, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  fetchCourseTopics, 
  createTopicRequest, updateTopicRequest, deleteTopicRequest, reorderTopicsRequest,
  createSubtopicRequest, updateSubtopicRequest, deleteSubtopicRequest, reorderSubtopicsRequest,
  uploadMaterialRequest, deleteMaterialRequest,
  addTopicVideoRequest, deleteTopicVideoRequest
} from "@/app/api/courses/httpClient";
import { TopicWithSubtopics, SubtopicWithMaterials } from "@/app/api/courses";

export function TopicManager({ courseId }: { courseId: string }) {
  const [topics, setTopics] = useState<TopicWithSubtopics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [expandedSubtopics, setExpandedSubtopics] = useState<Set<string>>(new Set());

  // Editing state
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState("");
  const [editingSubtopicId, setEditingSubtopicId] = useState<string | null>(null);
  const [editingSubtopicTitle, setEditingSubtopicTitle] = useState("");

  // Video state
  const [addingVideoTopicId, setAddingVideoTopicId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Operational state
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Refs for auto-focus
  const topicInputRef = useRef<HTMLInputElement>(null);
  const subtopicInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  useEffect(() => {
    loadTopics();
  }, [courseId]);

  // Auto-focus inputs when editing starts
  useEffect(() => {
    if (editingTopicId) topicInputRef.current?.focus();
  }, [editingTopicId]);

  useEffect(() => {
    if (editingSubtopicId) subtopicInputRef.current?.focus();
  }, [editingSubtopicId]);

  const loadTopics = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCourseTopics(courseId);
      setTopics(data);
      if (data.length > 0) {
        setExpandedTopics(new Set([data[0].id]));
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to load topics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTopic = (id: string) => {
    const next = new Set(expandedTopics);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedTopics(next);
  };

  const toggleSubtopic = (id: string) => {
    const next = new Set(expandedSubtopics);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSubtopics(next);
  };

  // ── Topics ──────────────────────────────────────────────────────────

  const handleAddTopic = async () => {
    try {
      setIsSaving(true);
      const topic = await createTopicRequest(courseId, { title: "New Topic" });
      const newTopics = [...topics, { ...topic, subtopics: [] }];
      setTopics(newTopics);
      setExpandedTopics(new Set([...Array.from(expandedTopics), topic.id]));
      // Enter editing mode for the newly created topic
      setEditingTopicId(topic.id);
      setEditingTopicTitle("New Topic");
      setEditingSubtopicId(null);
      showToast("Topic created");
    } catch (e) {
      console.error(e);
      showToast("Failed to create topic", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingTopic = (id: string, title: string) => {
    setEditingTopicId(id);
    setEditingTopicTitle(title);
    setEditingSubtopicId(null);
  };

  const cancelEditingTopic = () => {
    setEditingTopicId(null);
    setEditingTopicTitle("");
  };

  const saveTopicEdit = async (id: string) => {
    const trimmed = editingTopicTitle.trim();
    if (!trimmed) {
      showToast("Topic title cannot be empty", "error");
      return;
    }

    // Optimistically update UI first
    setTopics(prev => prev.map(t => t.id === id ? { ...t, title: trimmed } : t));
    setEditingTopicId(null);

    try {
      setIsSaving(true);
      await updateTopicRequest(courseId, id, { title: trimmed });
      showToast("Topic updated");
    } catch (e) {
      console.error(e);
      showToast("Failed to update topic — reverting", "error");
      // Reload from server on error to get clean state
      await loadTopics();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Are you sure? This deletes all subtopics and materials.")) return;
    const prev = [...topics];
    setTopics(topics.filter(t => t.id !== id));

    try {
      await deleteTopicRequest(courseId, id);
      showToast("Topic deleted");
    } catch (e) {
      console.error(e);
      setTopics(prev);
      showToast("Failed to delete topic", "error");
    }
  };

  const moveTopic = async (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= topics.length) return;
    const newTopics = [...topics];
    const temp = newTopics[index];
    newTopics[index] = newTopics[index + direction];
    newTopics[index + direction] = temp;
    setTopics(newTopics);

    try {
      await reorderTopicsRequest(courseId, newTopics.map(t => t.id));
    } catch (e) {
      console.error(e);
      showToast("Failed to reorder topics", "error");
      await loadTopics();
    }
  };

  // ── Subtopics ───────────────────────────────────────────────────────

  const handleAddSubtopic = async (topicId: string) => {
    try {
      setIsSaving(true);
      const subtopic = await createSubtopicRequest(courseId, topicId, { title: "New Subtopic" });
      setTopics(prev => prev.map(t => {
        if (t.id === topicId) {
          return { ...t, subtopics: [...t.subtopics, { ...subtopic, materials: [] }] };
        }
        return t;
      }));
      setExpandedSubtopics(new Set([...Array.from(expandedSubtopics), subtopic.id]));
      // Enter editing mode for the new subtopic
      setEditingSubtopicId(subtopic.id);
      setEditingSubtopicTitle("New Subtopic");
      setEditingTopicId(null);
      showToast("Subtopic created");
    } catch (e) {
      console.error(e);
      showToast("Failed to create subtopic", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingSubtopic = (id: string, title: string) => {
    setEditingSubtopicId(id);
    setEditingSubtopicTitle(title);
    setEditingTopicId(null);
  };

  const cancelEditingSubtopic = () => {
    setEditingSubtopicId(null);
    setEditingSubtopicTitle("");
  };

  const saveSubtopicEdit = async (topicId: string, id: string) => {
    const trimmed = editingSubtopicTitle.trim();
    if (!trimmed) {
      showToast("Subtopic title cannot be empty", "error");
      return;
    }

    // Optimistically update UI
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, subtopics: t.subtopics.map((s: any) => s.id === id ? { ...s, title: trimmed } : s) };
      }
      return t;
    }));
    setEditingSubtopicId(null);

    try {
      setIsSaving(true);
      await updateSubtopicRequest(courseId, topicId, id, { title: trimmed });
      showToast("Subtopic updated");
    } catch (e) {
      console.error(e);
      showToast("Failed to update subtopic — reverting", "error");
      await loadTopics();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubtopic = async (topicId: string, id: string) => {
    if (!confirm("Are you sure? This deletes all materials in this subtopic.")) return;
    const prev = [...topics];
    setTopics(topics.map(t => {
      if (t.id === topicId) {
        return { ...t, subtopics: t.subtopics.filter((s: any) => s.id !== id) };
      }
      return t;
    }));

    try {
      await deleteSubtopicRequest(courseId, topicId, id);
      showToast("Subtopic deleted");
    } catch (e) {
      console.error(e);
      setTopics(prev);
      showToast("Failed to delete subtopic", "error");
    }
  };

  const moveSubtopic = async (topicId: string, index: number, direction: -1 | 1) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    if (index + direction < 0 || index + direction >= topic.subtopics.length) return;
    
    const newSubtopics = [...topic.subtopics];
    const temp = newSubtopics[index];
    newSubtopics[index] = newSubtopics[index + direction];
    newSubtopics[index + direction] = temp;
    
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, subtopics: newSubtopics } : t));

    try {
      await reorderSubtopicsRequest(courseId, topicId, newSubtopics.map(s => s.id));
    } catch (e) {
      console.error(e);
      showToast("Failed to reorder subtopics", "error");
      await loadTopics();
    }
  };

  // ── Materials ───────────────────────────────────────────────────────

  const handleUploadMaterial = async (topicId: string, subtopicId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(subtopicId);
      const material = await uploadMaterialRequest(courseId, topicId, subtopicId, file, file.name);
      
      setTopics(prev => prev.map(t => {
        if (t.id === topicId) {
          return { 
            ...t, 
            subtopics: t.subtopics.map((s: any) => {
              if (s.id === subtopicId) {
                return { ...s, materials: [...s.materials, material] };
              }
              return s;
            }) 
          };
        }
        return t;
      }));
      showToast("Material uploaded");
    } catch (err) {
      console.error(err);
      showToast("Failed to upload material", "error");
    } finally {
      setIsUploading(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteMaterial = async (topicId: string, subtopicId: string, materialId: string) => {
    if (!confirm("Remove this material?")) return;
    const prev = [...topics];
    setTopics(topics.map(t => {
      if (t.id === topicId) {
        return { 
          ...t, 
          subtopics: t.subtopics.map((s: any) => {
            if (s.id === subtopicId) {
              return { ...s, materials: s.materials.filter((m: any) => m.id !== materialId) };
            }
            return s;
          }) 
        };
      }
      return t;
    }));

    try {
      await deleteMaterialRequest(courseId, topicId, subtopicId, materialId);
      showToast("Material removed");
    } catch (e) {
      console.error(e);
      setTopics(prev);
      showToast("Failed to remove material", "error");
    }
  };

  // ── Videos ──────────────────────────────────────────────────────────

  const handleAddVideo = async (topicId: string) => {
    if (!videoTitle.trim() || !videoUrl.trim()) {
      showToast("Title and Video URL are required", "error");
      return;
    }
    try {
      setIsSaving(true);
      const video = await addTopicVideoRequest(courseId, topicId, {
        title: videoTitle.trim(),
        videoUrl: videoUrl.trim(),
      });
      setTopics((prev) =>
        prev.map((t) => {
          if (t.id === topicId) {
            return { ...t, videos: [...(t.videos || []), video] };
          }
          return t;
        })
      );
      setAddingVideoTopicId(null);
      setVideoTitle("");
      setVideoUrl("");
      showToast("Video added successfully");
    } catch (e) {
      console.error(e);
      showToast("Failed to add video", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVideo = async (topicId: string, videoId: string) => {
    if (!confirm("Are you sure you want to remove this video?")) return;
    try {
      setIsSaving(true);
      await deleteTopicVideoRequest(courseId, topicId, videoId);
      setTopics((prev) =>
        prev.map((t) => {
          if (t.id === topicId) {
            return { ...t, videos: (t.videos || []).filter((v) => v.id !== videoId) };
          }
          return t;
        })
      );
      showToast("Video removed");
    } catch (e) {
      console.error(e);
      showToast("Failed to delete video", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#17A546]" />
        <p className="text-sm text-[#676E85]">Loading course structure…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Inline Toast */}
      {toastMessage && (
        <div className={`
          fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg
          animate-in slide-in-from-top-2 fade-in duration-200
          ${toastMessage.type === "success"
            ? "bg-[#17A546] text-white"
            : "bg-red-500 text-white"
          }
        `}>
          {toastMessage.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toastMessage.text}
        </div>
      )}

      {/* Saving indicator */}
      {isSaving && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-[#17A546]/20 overflow-hidden rounded-full">
          <div className="h-full w-1/3 bg-[#17A546] rounded-full animate-pulse" style={{ animation: "pulse 1s ease-in-out infinite, slideRight 1.5s ease-in-out infinite" }} />
        </div>
      )}

      {/* Empty state */}
      {topics.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-neutral-300 p-8 sm:p-12 text-center">
          <div className="h-14 w-14 bg-[#17A546]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-6 w-6 text-[#17A546]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#0A1B39] mb-1">No topics yet</h3>
          <p className="text-sm text-[#676E85] mb-5 max-w-xs mx-auto">
            Start building your course structure by adding your first topic.
          </p>
          <Button onClick={handleAddTopic} disabled={isSaving} className="bg-[#17A546] hover:bg-[#14933E] text-white font-semibold px-6">
            <Plus className="h-4 w-4 mr-2" />
            Add First Topic
          </Button>
        </div>
      )}

      {/* Topics List */}
      {topics.map((topic, tIndex) => (
        <div key={topic.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
          {/* Topic Header */}
          <div className="flex items-start justify-between p-3 sm:p-4 bg-neutral-50/50 border-b border-neutral-200 group">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 mt-0.5">
              <button onClick={() => toggleTopic(topic.id)} className="text-neutral-400 hover:text-[#0A1B39] shrink-0 mt-0.5 sm:mt-0 transition-colors">
                {expandedTopics.has(topic.id) ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
              
              {editingTopicId === topic.id ? (
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <input 
                    ref={topicInputRef}
                    autoFocus
                    className="flex-1 border border-[#17A546] rounded-lg px-3 py-1.5 text-[13px] sm:text-sm outline-none focus:ring-2 focus:ring-[#17A546]/20 transition-all"
                    value={editingTopicTitle}
                    onChange={e => setEditingTopicTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveTopicEdit(topic.id);
                      if (e.key === 'Escape') cancelEditingTopic();
                    }}
                    placeholder="Enter topic title…"
                  />
                  <button onClick={() => saveTopicEdit(topic.id)} disabled={isSaving} className="text-[#17A546] hover:bg-[#17A546]/10 p-1.5 rounded-lg shrink-0 transition-colors disabled:opacity-50">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={cancelEditingTopic} className="text-neutral-400 hover:bg-neutral-100 p-1.5 rounded-lg shrink-0 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => toggleTopic(topic.id)} className="text-left flex-1">
                  <span className="font-semibold text-sm sm:text-base text-[#0A1B39] leading-snug break-words pr-2">{topic.title}</span>
                  <span className="text-[11px] text-[#98A2B3] ml-2">
                    {topic.subtopics.length} subtopic{topic.subtopics.length !== 1 ? "s" : ""}
                  </span>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => moveTopic(tIndex, -1)} disabled={tIndex === 0} className="p-1.5 text-neutral-400 hover:text-[#0A1B39] hover:bg-neutral-100 rounded-lg disabled:opacity-30 transition-colors">
                <ChevronDown className="h-4 w-4 rotate-180" />
              </button>
              <button onClick={() => moveTopic(tIndex, 1)} disabled={tIndex === topics.length - 1} className="p-1.5 text-neutral-400 hover:text-[#0A1B39] hover:bg-neutral-100 rounded-lg disabled:opacity-30 transition-colors">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button onClick={() => startEditingTopic(topic.id, topic.title)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg ml-2 transition-colors">
                <Settings2 className="h-4 w-4" />
              </button>
              <button onClick={() => handleDeleteTopic(topic.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Subtopics */}
          {expandedTopics.has(topic.id) && (
            <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 bg-white">
              {topic.subtopics.map((sub: any, sIndex: number) => (
                <div key={sub.id} className="border border-neutral-200 rounded-lg overflow-hidden ml-2 sm:ml-6 transition-shadow hover:shadow-sm">
                  <div className="flex items-start justify-between p-2.5 sm:p-3 bg-neutral-50/30 border-b border-neutral-100 group/sub">
                    <div className="flex items-start gap-2 flex-1 mt-0.5">
                      <button onClick={() => toggleSubtopic(sub.id)} className="text-neutral-400 hover:text-[#0A1B39] shrink-0 mt-0.5 sm:mt-0 transition-colors">
                        {expandedSubtopics.has(sub.id) ? <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                      </button>
                      
                      {editingSubtopicId === sub.id ? (
                        <div className="flex items-center gap-2 flex-1 max-w-sm">
                          <input 
                            ref={subtopicInputRef}
                            autoFocus
                            className="flex-1 border border-[#17A546] rounded-lg px-3 py-1.5 text-[13px] sm:text-sm outline-none focus:ring-2 focus:ring-[#17A546]/20 transition-all"
                            value={editingSubtopicTitle}
                            onChange={e => setEditingSubtopicTitle(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveSubtopicEdit(topic.id, sub.id);
                              if (e.key === 'Escape') cancelEditingSubtopic();
                            }}
                            placeholder="Enter subtopic title…"
                          />
                          <button onClick={() => saveSubtopicEdit(topic.id, sub.id)} disabled={isSaving} className="text-[#17A546] hover:bg-[#17A546]/10 p-1.5 rounded-lg shrink-0 transition-colors disabled:opacity-50">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={cancelEditingSubtopic} className="text-neutral-400 hover:bg-neutral-100 p-1.5 rounded-lg shrink-0 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => toggleSubtopic(sub.id)} className="text-left flex-1">
                          <span className="font-medium text-[13px] sm:text-sm text-[#0A1B39] leading-snug break-words pr-2">{sub.title}</span>
                          <span className="text-[10px] text-[#98A2B3] ml-1">
                            {sub.materials?.length || 0} file{(sub.materials?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/sub:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => moveSubtopic(topic.id, sIndex, -1)} disabled={sIndex === 0} className="p-1 text-neutral-400 hover:text-[#0A1B39] hover:bg-neutral-100 rounded-lg disabled:opacity-30 transition-colors">
                        <ChevronDown className="h-4 w-4 rotate-180" />
                      </button>
                      <button onClick={() => moveSubtopic(topic.id, sIndex, 1)} disabled={sIndex === topic.subtopics.length - 1} className="p-1 text-neutral-400 hover:text-[#0A1B39] hover:bg-neutral-100 rounded-lg disabled:opacity-30 transition-colors">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button onClick={() => startEditingSubtopic(sub.id, sub.title)} className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg ml-2 transition-colors">
                        <Settings2 className="h-3 w-3" />
                      </button>
                      <button onClick={() => handleDeleteSubtopic(topic.id, sub.id)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Materials */}
                  {expandedSubtopics.has(sub.id) && (
                    <div className="p-2 sm:p-3 bg-white space-y-2 ml-2 sm:ml-4">
                      {sub.materials?.map((mat: any) => (
                        <div key={mat.id} className="flex items-start sm:items-center justify-between p-2 rounded-md border border-neutral-100 hover:bg-neutral-50 group/mat transition-colors">
                          <div className="flex items-start sm:items-center gap-2 mt-0.5 sm:mt-0">
                            <FileIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#17A546] shrink-0 mt-0.5 sm:mt-0" />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                              <span className="text-xs sm:text-sm text-[#475467] leading-snug break-all sm:break-words">{mat.title}</span>
                              {mat.fileSize && <span className="text-[10px] sm:text-xs text-neutral-400 shrink-0">({(mat.fileSize / 1024 / 1024).toFixed(2)} MB)</span>}
                            </div>
                          </div>
                          <button onClick={() => handleDeleteMaterial(topic.id, sub.id, mat.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover/mat:opacity-100 transition-opacity p-1">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}

                      {/* Add Material Button */}
                      <div className="mt-2">
                        <label className="flex items-center gap-2 text-sm text-[#17A546] hover:text-[#14933E] cursor-pointer font-medium p-2 border border-dashed border-[#17A546]/30 rounded-lg hover:bg-[#17A546]/5 transition-colors justify-center">
                          {isUploading === sub.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                          {isUploading === sub.id ? "Uploading…" : "Upload Material"}
                          <input type="file" className="hidden" onChange={(e) => handleUploadMaterial(topic.id, sub.id, e)} disabled={isUploading === sub.id} />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddSubtopic(topic.id)} 
                disabled={isSaving}
                className="ml-4 sm:ml-6 border-dashed text-neutral-500 hover:text-[#0A1B39] w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] text-xs sm:text-sm h-8 sm:h-9 transition-colors"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Subtopic
              </Button>

              {/* Topic Videos Section */}
              <div className="mx-2 sm:mx-6 mt-4 p-3.5 bg-neutral-50/70 rounded-xl border border-neutral-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-xs font-bold text-[#0A1B39]">Topic Video Lectures</span>
                    <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200/80">
                      {topic.videos?.length || 0}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddingVideoTopicId(addingVideoTopicId === topic.id ? null : topic.id)}
                    className="text-xs text-[#17A546] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Video
                  </button>
                </div>

                {/* Existing Videos List */}
                {topic.videos && topic.videos.length > 0 && (
                  <div className="space-y-1.5">
                    {topic.videos.map((vid) => (
                      <div key={vid.id} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-neutral-200/60 text-xs shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Play className="w-3 h-3 fill-current" />
                          </div>
                          <span className="font-semibold text-[#0A1B39] truncate">{vid.title}</span>
                          <span className="text-neutral-400 truncate text-[10px] hidden sm:inline">{vid.videoUrl}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(topic.id, vid.id)}
                          className="text-red-400 hover:text-red-600 p-1 shrink-0 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Video Form */}
                {addingVideoTopicId === topic.id && (
                  <div className="p-3 bg-white rounded-lg border border-neutral-200 space-y-2 mt-2 shadow-sm">
                    <input
                      type="text"
                      placeholder="Video Title (e.g. Introduction to Motion)"
                      className="w-full border border-neutral-200 rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#17A546]"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                    />
                    <input
                      type="url"
                      placeholder="YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                      className="w-full border border-neutral-200 rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#17A546]"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => { setAddingVideoTopicId(null); setVideoTitle(""); setVideoUrl(""); }}
                        className="text-xs text-neutral-500 hover:text-neutral-700 px-3 py-1.5 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddVideo(topic.id)}
                        disabled={isSaving}
                        className="bg-[#17A546] hover:bg-[#14933E] text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm"
                      >
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Save Video
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Topic Button (only show when topics exist — empty state has its own) */}
      {topics.length > 0 && (
        <Button 
          onClick={handleAddTopic} 
          disabled={isSaving}
          className="w-full border-dashed bg-white border-2 border-neutral-200 text-[#0A1B39] hover:bg-neutral-50 hover:border-neutral-300 transition-all disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Topic
        </Button>
      )}
    </div>
  );
}
