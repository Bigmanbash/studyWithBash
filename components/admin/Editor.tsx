"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Brain,
  Trophy,
  PlayCircle,
  Plus,
  Image as ImageIcon,
  Type,
  List,
  ListOrdered,
  Trash2,
  GripVertical,
  ChevronDown,
  Sigma,
  ArrowUp,
  ArrowDown,
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  AlignLeft,
  Palette,
  Highlighter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- Types ---
export type BlockType = "theory" | "images" | "example" | "quiz" | "formula";

export type BaseBlock = { id: string; type: BlockType };

export type TheoryBlock = BaseBlock & {
  type: "theory";
  content: string;
};

export type ImagesBlock = BaseBlock & {
  type: "images";
  images: { url: string; caption: string }[];
};

export type ExampleBlock = BaseBlock & {
  type: "example";
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  problem: string;
  solution: string;
};

export type QuizBlock = BaseBlock & {
  type: "quiz";
  questionCount: number;
};

export type FormulaBlock = BaseBlock & {
  type: "formula";
  title: string;
  formulas: string[];
  description: string;
  layoutStyle: "grid" | "list" | "highlight";
};

export type EditorBlock = TheoryBlock | ImagesBlock | ExampleBlock | QuizBlock | FormulaBlock;

// --- Helper Functions ---
const generateId = () => Math.random().toString(36).substring(2, 9);

type BlockActionProps = {
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

function BlockActions({ onRemove, onMoveUp, onMoveDown }: BlockActionProps) {
  return (
    <div className="absolute right-4 top-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center bg-white border border-neutral-200 shadow-sm rounded-lg overflow-hidden z-20">
      <div className="flex flex-col border-r border-neutral-100">
        <button onClick={onMoveUp} className="px-2 py-1 text-neutral-400 hover:text-brand-navy hover:bg-neutral-50"><ArrowUp className="h-3 w-3" /></button>
        <button onClick={onMoveDown} className="px-2 py-1 text-neutral-400 hover:text-brand-navy hover:bg-neutral-50 border-t border-neutral-100"><ArrowDown className="h-3 w-3" /></button>
      </div>
      <button className="px-3 py-2 text-neutral-400 cursor-grab active:cursor-grabbing border-r border-neutral-100"><GripVertical className="h-4 w-4" /></button>
      <button onClick={onRemove} className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}

// --- Rich Text Editor Component ---
function RichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // Only set innerHTML on first mount
  React.useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncState = React.useCallback(() => {
    if (editorRef.current) {
      onChangeRef.current(editorRef.current.innerHTML);
    }
  }, []);

  // Toolbar button handler: preventDefault keeps selection alive
  const exec = React.useCallback((command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    syncState();
  }, [syncState]);

  // Wrap toolbar buttons so they don't steal focus/selection
  const tb = (command: string, icon: React.ReactNode, title: string, arg?: string) => (
    <button
      type="button"
      title={title}
      className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 transition-colors"
      onMouseDown={(e) => {
        e.preventDefault(); // ← KEY: keeps selection inside contentEditable
        exec(command, arg);
      }}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-neutral-200/60 rounded-xl overflow-hidden bg-neutral-50/50 focus-within:border-brand-green/40 focus-within:ring-1 focus-within:ring-brand-green/40 transition-colors">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-neutral-200/60 bg-white select-none">
        {tb('bold', <Bold className="h-4 w-4" />, 'Bold')}
        {tb('italic', <Italic className="h-4 w-4" />, 'Italic')}
        {tb('underline', <Underline className="h-4 w-4" />, 'Underline')}

        <div className="w-px h-4 bg-neutral-200 mx-1" />

        {tb('formatBlock', <Heading2 className="h-4 w-4" />, 'Heading 2', 'H2')}
        {tb('formatBlock', <Heading3 className="h-4 w-4" />, 'Heading 3', 'H3')}
        {tb('formatBlock', <AlignLeft className="h-4 w-4" />, 'Paragraph', 'P')}

        <div className="w-px h-4 bg-neutral-200 mx-1" />

        {tb('insertUnorderedList', <List className="h-4 w-4" />, 'Bullet List')}
        {tb('insertOrderedList', <ListOrdered className="h-4 w-4" />, 'Numbered List')}

        <div className="w-px h-4 bg-neutral-200 mx-1" />

        {/* Color picker – keeps selection via onMouseDown on the wrapper */}
        <label
          className="relative p-1.5 hover:bg-neutral-100 rounded text-neutral-600 cursor-pointer transition-colors"
          title="Text Color"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Palette className="h-4 w-4" />
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={(e) => exec('foreColor', e.target.value)}
          />
        </label>

        <label
          className="relative p-1.5 hover:bg-neutral-100 rounded text-neutral-600 cursor-pointer transition-colors"
          title="Highlight"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Highlighter className="h-4 w-4" />
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={(e) => exec('hiliteColor', e.target.value)}
          />
        </label>
      </div>

      {/* ─── Editable Area ─── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncState}
        onBlur={syncState}
        data-placeholder={placeholder}
        className="rich-editor-area w-full min-h-[120px] px-5 py-3 text-[14.5px] sm:text-[16px] leading-relaxed text-[#0A1B39] outline-none prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-brand-navy prose-p:text-[#475467] prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 prose-li:marker:text-brand-green/60"
      />
      <style>{`
        .rich-editor-area:empty::before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

// --- Sub-components for Editable Blocks ---

function EditableTheory({ block, updateBlock, actions }: { block: TheoryBlock; updateBlock: (b: TheoryBlock) => void; actions: BlockActionProps }) {
  return (
    <div className="relative group bg-white rounded-[16px] sm:rounded-[24px] border border-neutral-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-5 sm:p-10 mb-6 sm:mb-10 transition-all hover:border-brand-green/40">
      <BlockActions {...actions} />

      <div className="flex items-center gap-3 mb-5 sm:mb-8 pb-4 border-b border-neutral-100">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <BookOpen className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-blue-500" />
        </div>
        <h2 className="text-[19px] sm:text-[22px] font-bold text-[#0A1B39]">Theory & Explanations</h2>
      </div>

      <RichTextEditor 
        value={block.content}
        onChange={(val) => updateBlock({ ...block, content: val })}
        placeholder="Write your theory and explanations here... Select text to bold, highlight, or change colors!"
      />
    </div>
  );
}

function EditableImages({ block, updateBlock, actions }: { block: ImagesBlock; updateBlock: (b: ImagesBlock) => void; actions: BlockActionProps }) {
  const addImage = () => {
    if (block.images.length < 2) {
      updateBlock({ ...block, images: [...block.images, { url: "", caption: "" }] });
    }
  };

  const updateImage = (index: number, field: "url" | "caption", value: string) => {
    const newImages = [...block.images];
    newImages[index][field] = value;
    updateBlock({ ...block, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = block.images.filter((_, i) => i !== index);
    if (newImages.length === 0) actions.onRemove();
    else updateBlock({ ...block, images: newImages });
  };

  return (
    <div className="relative group bg-white rounded-[16px] sm:rounded-[24px] border border-neutral-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-5 sm:p-10 mb-6 sm:mb-10 transition-all hover:border-brand-green/40 overflow-hidden">
      <BlockActions {...actions} />

      <div className="flex items-center gap-3 mb-5 sm:mb-8 pb-4 border-b border-neutral-100">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
          <ImageIcon className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-purple-500" />
        </div>
        <h2 className="text-[19px] sm:text-[22px] font-bold text-[#0A1B39]">Visual Assets</h2>
        {block.images.length < 2 && (
          <Button variant="outline" size="sm" onClick={addImage} className="ml-auto h-8 text-xs font-semibold rounded-md">
            <Plus className="h-3 w-3 mr-1" /> Add Second Image
          </Button>
        )}
      </div>

      <div className={cn("grid gap-4", block.images.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
        {block.images.map((img, idx) => (
          <div key={idx} className="relative group/img">
            <div className="aspect-video w-full bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center overflow-hidden mb-3 hover:bg-neutral-50 transition-colors">
              {img.url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => updateImage(idx, "url", "")} 
                    title="Remove Image"
                    className="absolute inset-0 m-auto h-10 w-10 bg-white/95 rounded-full shadow-lg flex items-center justify-center text-red-500 opacity-100 md:opacity-0 md:group-hover/img:opacity-100 hover:scale-105 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="text-center p-4 w-full flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                  <label className="cursor-pointer bg-white border border-neutral-200 hover:border-brand-green/40 hover:bg-brand-green/5 text-brand-navy px-4 py-2 rounded-lg text-sm font-semibold transition-colors mb-3">
                    Choose Image File
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => updateImage(idx, "url", reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </label>
                  <div className="flex items-center w-full max-w-[200px] gap-2 text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                    <div className="h-px bg-neutral-200 flex-1"></div>
                    <span>Or URL</span>
                    <div className="h-px bg-neutral-200 flex-1"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Paste image URL here..."
                    className="text-sm bg-white border border-neutral-200 rounded-md px-3 py-1.5 outline-none focus:border-brand-green/40 w-48 text-center mt-3"
                    value={img.url}
                    onChange={(e) => updateImage(idx, "url", e.target.value)}
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Add a caption..."
              className="w-full text-center text-sm text-neutral-400 outline-none bg-transparent placeholder:text-neutral-300 focus:text-brand-navy transition-colors"
              value={img.caption}
              onChange={(e) => updateImage(idx, "caption", e.target.value)}
            />
            {block.images.length === 2 && (
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm text-red-500 opacity-100 md:opacity-0 md:group-hover/img:opacity-100 transition-opacity hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableFormula({ block, updateBlock, actions }: { block: FormulaBlock; updateBlock: (b: FormulaBlock) => void; actions: BlockActionProps }) {
  const addFormula = () => updateBlock({ ...block, formulas: [...block.formulas, ""] });

  const updateFormula = (index: number, val: string) => {
    const newFormulas = [...block.formulas];
    newFormulas[index] = val;
    updateBlock({ ...block, formulas: newFormulas });
  };

  const removeFormula = (index: number) => {
    updateBlock({ ...block, formulas: block.formulas.filter((_, i) => i !== index) });
  };

  return (
    <div className="relative group bg-[#F7F9FC] rounded-[16px] sm:rounded-[24px] border border-neutral-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-5 sm:p-10 mb-6 sm:mb-10 transition-all hover:border-brand-green/40">
      <BlockActions {...actions} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-neutral-200/50">
        <div className="flex items-center gap-3 w-full">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Sigma className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-indigo-500" />
          </div>
          <input 
            type="text"
            className="bg-transparent text-[16px] sm:text-[18px] font-bold text-[#0A1B39] outline-none placeholder:text-neutral-400 w-full"
            placeholder="Formula Section Title (e.g. Equations of Uniformly Accelerated Motion)"
            value={block.title}
            onChange={(e) => updateBlock({ ...block, title: e.target.value })}
          />
        </div>
        
        <div className="flex items-center gap-2 relative z-10 shrink-0 bg-white border border-neutral-200 rounded-lg p-1">
          <button 
            onClick={() => updateBlock({ ...block, layoutStyle: "grid" })}
            className={cn("px-3 py-1 rounded-md text-xs font-bold transition-colors", block.layoutStyle === "grid" ? "bg-indigo-100 text-indigo-700" : "text-neutral-400 hover:bg-neutral-50")}
          >Grid</button>
          <button 
            onClick={() => updateBlock({ ...block, layoutStyle: "list" })}
            className={cn("px-3 py-1 rounded-md text-xs font-bold transition-colors", block.layoutStyle === "list" ? "bg-indigo-100 text-indigo-700" : "text-neutral-400 hover:bg-neutral-50")}
          >List</button>
          <button 
            onClick={() => updateBlock({ ...block, layoutStyle: "highlight" })}
            className={cn("px-3 py-1 rounded-md text-xs font-bold transition-colors", block.layoutStyle === "highlight" ? "bg-indigo-100 text-indigo-700" : "text-neutral-400 hover:bg-neutral-50")}
          >Highlight</button>
        </div>
      </div>

      <div className={cn(
        "gap-3 sm:gap-4 mb-4",
        block.layoutStyle === "grid" ? "grid grid-cols-1 sm:grid-cols-2" : "flex flex-col"
      )}>
        {block.formulas.map((formula, idx) => (
          <div key={idx} className={cn(
            "relative group/form bg-white rounded-lg shadow-sm flex items-center justify-center font-mono",
            block.layoutStyle === "highlight" ? "p-6 sm:p-8 border-2 border-indigo-200 bg-indigo-50/30 text-lg" : "p-3.5 sm:p-4 border border-neutral-100 text-[14px]"
          )}>
            <input 
              type="text"
              className={cn(
                "w-full text-center font-medium outline-none",
                block.layoutStyle === "highlight" ? "text-indigo-700 placeholder:text-indigo-700/40 text-[18px]" : "text-[#17A546] placeholder:text-[#17A546]/40"
              )}
              placeholder="e.g. v = u + at"
              value={formula}
              onChange={(e) => updateFormula(idx, e.target.value)}
            />
            {block.formulas.length > 1 && (
              <button
                onClick={() => removeFormula(idx)}
                className="absolute right-2 text-red-300 hover:text-red-500 opacity-0 group-hover/form:opacity-100 transition-opacity p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-6">
        <Button variant="outline" size="sm" onClick={addFormula} className="h-8 text-xs font-semibold rounded-md border-indigo-200 text-indigo-600 hover:bg-indigo-50">
          <Plus className="h-3 w-3 mr-1" /> Add Equation
        </Button>
      </div>

      <div className="bg-white p-3.5 sm:p-4 rounded-lg shadow-sm border border-neutral-100 flex items-center justify-center">
        <input
          type="text"
          className="w-full text-center text-[12px] sm:text-[13px] text-[#676E85] outline-none placeholder:text-neutral-300"
          placeholder="Description (e.g. Where: u = initial velocity, v = final velocity...)"
          value={block.description}
          onChange={(e) => updateBlock({ ...block, description: e.target.value })}
        />
      </div>
    </div>
  );
}

function EditableExample({ block, updateBlock, actions }: { block: ExampleBlock; updateBlock: (b: ExampleBlock) => void; actions: BlockActionProps }) {
  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case "Easy": return "bg-emerald-100 text-emerald-700";
      case "Medium": return "bg-amber-100 text-amber-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-emerald-100 text-emerald-700";
    }
  };

  const getSolutionBoxStyles = (diff: string) => {
    switch (diff) {
      case "Easy": return "bg-[#17A546]/5 border-[#17A546]/20 text-[#17A546]";
      case "Medium": return "bg-amber-50 border-amber-200/50 text-amber-600";
      case "Hard": return "bg-red-50 border-red-200/50 text-red-600";
      default: return "bg-[#17A546]/5 border-[#17A546]/20 text-[#17A546]";
    }
  };

  return (
    <div className="relative group bg-white rounded-[16px] sm:rounded-[24px] border border-neutral-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-5 sm:p-10 mb-6 sm:mb-10 transition-all hover:border-brand-green/40">
      <BlockActions {...actions} />

      <div className="flex items-center gap-3 mb-5 sm:mb-8 pb-4 border-b border-neutral-100">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <Brain className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-amber-500" />
        </div>
        <h2 className="text-[19px] sm:text-[22px] font-bold text-[#0A1B39]">Worked Example</h2>
      </div>

      <div className="border border-neutral-200/60 rounded-[12px] sm:rounded-[16px] overflow-hidden focus-within:border-brand-green/40 transition-colors">
        <div className="bg-neutral-50 px-4 py-3.5 sm:px-5 sm:py-4 border-b border-neutral-200/60 flex items-center gap-3 relative">
          <select
            className={cn("appearance-none px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer pr-6", getDifficultyStyles(block.difficulty))}
            value={block.difficulty}
            onChange={(e) => updateBlock({ ...block, difficulty: e.target.value as "Easy" | "Medium" | "Hard" })}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <div className="pointer-events-none absolute left-[4.5rem] flex items-center px-2 text-current opacity-50">
            <ChevronDown className="h-3 w-3" />
          </div>

          <input
            type="text"
            className="flex-1 bg-transparent text-[14px] sm:text-[15px] font-bold text-[#0A1B39] outline-none placeholder:text-neutral-300"
            placeholder="Example Title (e.g. Finding Acceleration)"
            value={block.title}
            onChange={(e) => updateBlock({ ...block, title: e.target.value })}
          />
        </div>

        <div className="p-4 sm:p-6">
          <textarea
            className="w-full text-[14px] sm:text-[15.5px] text-[#475467] mb-5 sm:mb-6 outline-none resize-none bg-transparent placeholder:text-neutral-300 min-h-[60px]"
            placeholder="Write the problem statement here..."
            value={block.problem}
            onChange={(e) => updateBlock({ ...block, problem: e.target.value })}
          />

          <div className={cn("rounded-lg p-4 sm:p-5 border", getSolutionBoxStyles(block.difficulty).split(' ').slice(0, 2).join(' '))}>
            <h5 className={cn("text-[12px] sm:text-[13px] font-bold uppercase tracking-wider mb-2.5 sm:mb-3", getSolutionBoxStyles(block.difficulty).split(' ').pop())}>Solution</h5>
            <textarea
              className="w-full text-[13px] sm:text-[14.5px] text-[#0A1B39] space-y-1.5 sm:space-y-2 outline-none resize-none bg-transparent placeholder:text-neutral-400 min-h-[100px] leading-relaxed"
              placeholder="Step-by-step solution..."
              value={block.solution}
              onChange={(e) => updateBlock({ ...block, solution: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableQuiz({ block, updateBlock, actions }: { block: QuizBlock; updateBlock: (b: QuizBlock) => void; actions: BlockActionProps }) {
  return (
    <div className="relative group bg-white rounded-[16px] sm:rounded-[24px] border border-brand-green/20 shadow-[0_8px_30px_-4px_rgba(23,165,70,0.08)] p-5 sm:p-10 mb-8 transition-all hover:border-brand-green/40">
      <BlockActions {...actions} />

      <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
            <Trophy className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-brand-green" />
          </div>
          <h2 className="text-[19px] sm:text-[22px] font-bold text-[#0A1B39]">Practice Questions (Quiz Link)</h2>
        </div>
        <div className="flex items-center bg-brand-green text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          <input
            type="number"
            min="1"
            className="w-6 bg-transparent outline-none text-center p-0 font-bold"
            value={block.questionCount}
            onChange={(e) => updateBlock({ ...block, questionCount: parseInt(e.target.value) || 1 })}
          /> Qs
        </div>
      </div>

      <div className="text-center py-6 sm:py-10">
        <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-neutral-50 items-center justify-center mb-5 sm:mb-6 border border-neutral-200/60 shadow-inner">
          <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8 text-brand-green" />
        </div>
        <h3 className="text-[17px] sm:text-lg font-bold text-[#0A1B39] mb-2">Ready to test your knowledge?</h3>
        <p className="text-[14px] sm:text-[15px] text-[#676E85] mb-6 sm:mb-8 max-w-2xl mx-auto">
          This block will link to the quiz interface for this topic. You can configure the exact questions in the Quiz Engine later.
        </p>
      </div>
    </div>
  );
}

// --- Main Editor Component ---
export function TopicEditor() {
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    {
      id: generateId(),
      type: "theory",
      content: ""
    }
  ]);

  const addBlock = (type: BlockType) => {
    let newBlock: EditorBlock;
    if (type === "theory") newBlock = { id: generateId(), type, content: "" };
    else if (type === "images") newBlock = { id: generateId(), type, images: [{ url: "", caption: "" }] };
    else if (type === "example") newBlock = { id: generateId(), type, difficulty: "Easy", title: "", problem: "", solution: "" };
    else if (type === "formula") newBlock = { id: generateId(), type, title: "Formulas & Equations", formulas: [""], description: "", layoutStyle: "grid" };
    else newBlock = { id: generateId(), type: "quiz", questionCount: 10 };

    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updatedBlock: EditorBlock) => {
    setBlocks(blocks.map(b => b.id === id ? updatedBlock : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-24">
      <div className="mb-8">
        <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-2">Content Editor</h3>
        <p className="text-sm text-neutral-400">Build your topic curriculum by adding rich blocks below.</p>
      </div>

      {blocks.map((block, idx) => {
        const actions = {
          onRemove: () => removeBlock(block.id),
          onMoveUp: idx > 0 ? () => moveBlock(idx, "up") : undefined,
          onMoveDown: idx < blocks.length - 1 ? () => moveBlock(idx, "down") : undefined
        };

        switch (block.type) {
          case "theory":
            return <EditableTheory key={block.id} block={block} updateBlock={(b) => updateBlock(block.id, b)} actions={actions} />;
          case "images":
            return <EditableImages key={block.id} block={block} updateBlock={(b) => updateBlock(block.id, b)} actions={actions} />;
          case "example":
            return <EditableExample key={block.id} block={block} updateBlock={(b) => updateBlock(block.id, b)} actions={actions} />;
          case "formula":
            return <EditableFormula key={block.id} block={block} updateBlock={(b) => updateBlock(block.id, b)} actions={actions} />;
          case "quiz":
            return <EditableQuiz key={block.id} block={block} updateBlock={(b) => updateBlock(block.id, b)} actions={actions} />;
          default:
            return null;
        }
      })}

      {/* Floating Add Block Menu */}
      <div className="sticky bottom-8 mt-12 bg-white/90 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-xl p-2 flex items-center justify-center gap-2 max-w-fit mx-auto animate-in slide-in-from-bottom-5">
        <span className="text-xs font-semibold text-neutral-400 px-3 border-r border-neutral-200 hidden sm:inline-block">Add Block</span>

        <Button variant="ghost" size="sm" onClick={() => addBlock("theory")} className="text-brand-navy hover:bg-neutral-100 rounded-xl h-10 px-3">
          <Type className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Text</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addBlock("images")} className="text-brand-navy hover:bg-neutral-100 rounded-xl h-10 px-3">
          <ImageIcon className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Image</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addBlock("formula")} className="text-brand-navy hover:bg-neutral-100 rounded-xl h-10 px-3">
          <Sigma className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Formula</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addBlock("example")} className="text-brand-navy hover:bg-neutral-100 rounded-xl h-10 px-3">
          <Brain className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Example</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addBlock("quiz")} className="text-brand-navy hover:bg-neutral-100 rounded-xl h-10 px-3">
          <Trophy className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Quiz</span>
        </Button>
      </div>

      {/* Save Button (Mock) */}
      <div className="flex justify-end mt-8 border-t border-neutral-200 pt-6">
        <Button className="bg-brand-green hover:bg-semantic-success-dark text-white font-bold rounded-md shadow-sm transition-all flex items-center h-12 px-8">
          Save Topic Content
        </Button>
      </div>
    </div>
  );
}

