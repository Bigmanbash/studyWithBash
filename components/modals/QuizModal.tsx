"use client";

import { Button } from "@/components/ui/button";
import { ModalWrapper } from "./ModalWrapper";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockQuestion = {
  number: 3,
  total: 20,
  subject: "Physics",
  question: "A body of mass 5kg is moving with a velocity of 10m/s. What is its kinetic energy?",
  options: [
    { label: "A", text: "250J" },
    { label: "B", text: "500J" },
    { label: "C", text: "50J" },
    { label: "D", text: "100J" },
  ],
};

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-medium text-[#17A546] bg-[#17A546]/10 px-3 py-1 rounded-full">{mockQuestion.subject}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-(--heading)">{mockQuestion.number}</span>
          <span className="text-sm text-(--muted)">/ {mockQuestion.total}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-(--card) h-1.5 rounded-full overflow-hidden mb-8">
        <div
          className="bg-[#17A546] h-full rounded-full transition-all duration-500"
          style={{ width: `${(mockQuestion.number / mockQuestion.total) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <h3 className="text-lg sm:text-xl font-bold text-(--heading) mb-6 leading-relaxed">
        {mockQuestion.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {mockQuestion.options.map((option) => (
          <button
            key={option.label}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-[#17A546] hover:bg-[#17A546]/5 transition-all text-left group"
          >
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-(--card) group-hover:bg-[#17A546]/10 flex items-center justify-center text-sm font-bold text-(--muted) group-hover:text-[#17A546] transition-colors">
              {option.label}
            </div>
            <span className="text-sm sm:text-base font-medium text-(--heading)">{option.text}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" className="text-(--muted)" onClick={onClose}>
          Skip
        </Button>
        <Button className="bg-[#17A546] hover:bg-[#17A546]/90 text-white px-8 rounded-xl font-bold shadow-lg shadow-[#17A546]/20">
          Next Question
        </Button>
      </div>
    </ModalWrapper>
  );
}
