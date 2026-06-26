"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Trash2, GripVertical, File as FileIcon, ChevronDown, ChevronRight, 
  UploadCloud, Settings2, Check, X, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  fetchCourseTopics, 
  createTopicRequest, updateTopicRequest, deleteTopicRequest, reorderTopicsRequest,
  createSubtopicRequest, updateSubtopicRequest, deleteSubtopicRequest, reorderSubtopicsRequest,
  uploadMaterialRequest, deleteMaterialRequest
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

  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, [courseId]);

  const loadTopics = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCourseTopics(courseId);
      setTopics(data);
      // Expand first topic by default if any
      if (data.length > 0) {
        setExpandedTopics(new Set([data[0].id]));
      }
    } catch (e) {
      console.error(e);
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

  // -- Topics --
  const handleAddTopic = async () => {
    const topic = await createTopicRequest(courseId, { title: "New Topic" });
    setTopics([...topics, { ...topic, subtopics: [] }]);
    setExpandedTopics(new Set([...Array.from(expandedTopics), topic.id]));
    startEditingTopic(topic.id, "New Topic");
  };

  const startEditingTopic = (id: string, title: string) => {
    setEditingTopicId(id);
    setEditingTopicTitle(title);
    setEditingSubtopicId(null); // dismiss any subtopic editing
  };

  const saveTopicEdit = async (id: string) => {
    if (!editingTopicTitle.trim()) return;
    setEditingTopicId(null);
    await updateTopicRequest(courseId, id, { title: editingTopicTitle });
    setTopics(topics.map(t => t.id === id ? { ...t, title: editingTopicTitle } : t));
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Are you sure? This deletes all subtopics and materials.")) return;
    await deleteTopicRequest(courseId, id);
    setTopics(topics.filter(t => t.id !== id));
  };

  const moveTopic = async (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= topics.length) return;
    const newTopics = [...topics];
    const temp = newTopics[index];
    newTopics[index] = newTopics[index + direction];
    newTopics[index + direction] = temp;
    
    setTopics(newTopics);
    await reorderTopicsRequest(courseId, newTopics.map(t => t.id));
  };

  // -- Subtopics --
  const handleAddSubtopic = async (topicId: string) => {
    const subtopic = await createSubtopicRequest(courseId, topicId, { title: "New Subtopic" });
    setTopics(topics.map(t => {
      if (t.id === topicId) {
        return { ...t, subtopics: [...t.subtopics, { ...subtopic, materials: [] }] };
      }
      return t;
    }));
    setExpandedSubtopics(new Set([...Array.from(expandedSubtopics), subtopic.id]));
    startEditingSubtopic(subtopic.id, "New Subtopic");
  };

  const startEditingSubtopic = (id: string, title: string) => {
    setEditingSubtopicId(id);
    setEditingSubtopicTitle(title);
    setEditingTopicId(null); // dismiss any topic editing
  };

  const saveSubtopicEdit = async (topicId: string, id: string) => {
    if (!editingSubtopicTitle.trim()) return;
    setEditingSubtopicId(null);
    await updateSubtopicRequest(courseId, topicId, id, { title: editingSubtopicTitle });
    setTopics(topics.map(t => {
      if (t.id === topicId) {
        return { ...t, subtopics: t.subtopics.map((s: any) => s.id === id ? { ...s, title: editingSubtopicTitle } : s) };
      }
      return t;
    }));
  };

  const handleDeleteSubtopic = async (topicId: string, id: string) => {
    if (!confirm("Are you sure? This deletes all materials in this subtopic.")) return;
    await deleteSubtopicRequest(courseId, topicId, id);
    setTopics(topics.map(t => {
      if (t.id === topicId) {
        return { ...t, subtopics: t.subtopics.filter((s: any) => s.id !== id) };
      }
      return t;
    }));
  };

  const moveSubtopic = async (topicId: string, index: number, direction: -1 | 1) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    if (index + direction < 0 || index + direction >= topic.subtopics.length) return;
    
    const newSubtopics = [...topic.subtopics];
    const temp = newSubtopics[index];
    newSubtopics[index] = newSubtopics[index + direction];
    newSubtopics[index + direction] = temp;
    
    setTopics(topics.map(t => t.id === topicId ? { ...t, subtopics: newSubtopics } : t));
    await reorderSubtopicsRequest(courseId, topicId, newSubtopics.map(s => s.id));
  };

  // -- Materials --
  const handleUploadMaterial = async (topicId: string, subtopicId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(subtopicId);
      const material = await uploadMaterialRequest(courseId, topicId, subtopicId, file, file.name);
      
      setTopics(topics.map(t => {
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
    } catch (err) {
      console.error(err);
      alert("Failed to upload material");
    } finally {
      setIsUploading(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteMaterial = async (topicId: string, subtopicId: string, materialId: string) => {
    if (!confirm("Remove this material?")) return;
    await deleteMaterialRequest(courseId, topicId, subtopicId, materialId);
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
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="h-6 w-6 animate-spin text-[#17A546]" /></div>;

  return (
    <div className="space-y-4">
      {topics.map((topic, tIndex) => (
        <div key={topic.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          {/* Topic Header */}
          <div className="flex items-start justify-between p-3 sm:p-4 bg-neutral-50/50 border-b border-neutral-200 group">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 mt-0.5">
              <button onClick={() => toggleTopic(topic.id)} className="text-neutral-400 hover:text-[#0A1B39] shrink-0 mt-0.5 sm:mt-0">
                {expandedTopics.has(topic.id) ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
              
              {editingTopicId === topic.id ? (
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <input 
                    autoFocus
                    className="flex-1 border rounded px-2 py-1 text-[13px] sm:text-sm outline-none focus:border-[#17A546]"
                    value={editingTopicTitle}
                    onChange={e => setEditingTopicTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveTopicEdit(topic.id)}
                  />
                  <button onClick={() => saveTopicEdit(topic.id)} className="text-[#17A546] hover:bg-[#17A546]/10 p-1 rounded shrink-0"><Check className="h-4 w-4" /></button>
                </div>
              ) : (
                <span className="font-semibold text-sm sm:text-base text-[#0A1B39] leading-snug break-words pr-2">{topic.title}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => moveTopic(tIndex, -1)} disabled={tIndex === 0} className="p-1.5 text-neutral-400 hover:text-[#0A1B39] hover:bg-neutral-100 rounded disabled:opacity-30">
                <ChevronDown className="h-4 w-4 rotate-180" />
              </button>
              <button onClick={() => moveTopic(tIndex, 1)} disabled={tIndex === topics.length - 1} className="p-1.5 text-neutral-400 hover:text-[#0A1B39] hover:bg-neutral-100 rounded disabled:opacity-30">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button onClick={() => startEditingTopic(topic.id, topic.title)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded ml-2">
                <Settings2 className="h-4 w-4" />
              </button>
              <button onClick={() => handleDeleteTopic(topic.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Subtopics */}
          {expandedTopics.has(topic.id) && (
            <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 bg-white">
              {topic.subtopics.map((sub: any, sIndex: number) => (
                <div key={sub.id} className="border border-neutral-200 rounded-lg overflow-hidden ml-2 sm:ml-6">
                  <div className="flex items-start justify-between p-2.5 sm:p-3 bg-neutral-50/30 border-b border-neutral-100 group/sub">
                    <div className="flex items-start gap-2 flex-1 mt-0.5">
                      <button onClick={() => toggleSubtopic(sub.id)} className="text-neutral-400 hover:text-[#0A1B39] shrink-0 mt-0.5 sm:mt-0">
                        {expandedSubtopics.has(sub.id) ? <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                      </button>
                      
                      {editingSubtopicId === sub.id ? (
                        <div className="flex items-center gap-2 flex-1 max-w-sm">
                          <input 
                            autoFocus
                            className="flex-1 border rounded px-2 py-1 text-[13px] sm:text-sm outline-none focus:border-[#17A546]"
                            value={editingSubtopicTitle}
                            onChange={e => setEditingSubtopicTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveSubtopicEdit(topic.id, sub.id)}
                          />
                          <button onClick={() => saveSubtopicEdit(topic.id, sub.id)} className="text-[#17A546] hover:bg-[#17A546]/10 p-1 rounded shrink-0"><Check className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <span className="font-medium text-[13px] sm:text-sm text-[#0A1B39] leading-snug break-words pr-2">{sub.title}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/sub:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => moveSubtopic(topic.id, sIndex, -1)} disabled={sIndex === 0} className="p-1 text-neutral-400 hover:text-[#0A1B39] hover:bg-neutral-100 rounded disabled:opacity-30">
                        <ChevronDown className="h-4 w-4 rotate-180" />
                      </button>
                      <button onClick={() => moveSubtopic(topic.id, sIndex, 1)} disabled={sIndex === topic.subtopics.length - 1} className="p-1 text-neutral-400 hover:text-[#0A1B39] hover:bg-neutral-100 rounded disabled:opacity-30">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button onClick={() => startEditingSubtopic(sub.id, sub.title)} className="p-1 text-blue-500 hover:bg-blue-50 rounded ml-2">
                        <Settings2 className="h-3 w-3" />
                      </button>
                      <button onClick={() => handleDeleteSubtopic(topic.id, sub.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Materials */}
                  {expandedSubtopics.has(sub.id) && (
                    <div className="p-2 sm:p-3 bg-white space-y-2 ml-2 sm:ml-4">
                      {sub.materials.map((mat: any) => (
                        <div key={mat.id} className="flex items-start sm:items-center justify-between p-2 rounded-md border border-neutral-100 hover:bg-neutral-50 group/mat">
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
                        <label className="flex items-center gap-2 text-sm text-[#17A546] hover:text-[#14933E] cursor-pointer font-medium p-2 border border-dashed border-[#17A546]/30 rounded-md hover:bg-[#17A546]/5 transition-colors justify-center">
                          {isUploading === sub.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                          {isUploading === sub.id ? "Uploading..." : "Upload Material"}
                          <input type="file" className="hidden" onChange={(e) => handleUploadMaterial(topic.id, sub.id, e)} disabled={isUploading === sub.id} />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button variant="outline" size="sm" onClick={() => handleAddSubtopic(topic.id)} className="ml-4 sm:ml-6 border-dashed text-neutral-500 hover:text-[#0A1B39] w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] text-xs sm:text-sm h-8 sm:h-9">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Subtopic
              </Button>
            </div>
          )}
        </div>
      ))}

      <Button onClick={handleAddTopic} className="w-full border-dashed bg-white border-2 border-neutral-200 text-[#0A1B39] hover:bg-neutral-50 hover:border-neutral-300">
        <Plus className="h-4 w-4 mr-2" /> Add New Topic
      </Button>
    </div>
  );
}
