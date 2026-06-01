"use client";

import { Button } from "@/components/ui/button";
import { ModalWrapper } from "./ModalWrapper";
import { CheckCircle2, Sparkles } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = "Payment Successful!",
  message = "Your Pro plan is now active. Start exploring all courses and unlock your full potential.",
  actionLabel = "Go to Dashboard",
  onAction,
}: SuccessModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-4">
        {/* Animated Check */}
        <div className="relative mx-auto h-20 w-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-[#17A546]/10 animate-ping"></div>
          <div className="relative h-20 w-20 rounded-full bg-[#17A546]/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-[#17A546]" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Sparkles className="h-4 w-4 text-brand-gold" />
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wide">Congratulations</span>
          <Sparkles className="h-4 w-4 text-brand-gold" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-(--heading) mb-3">{title}</h3>
        <p className="text-sm text-(--muted) leading-relaxed mb-8 max-w-xs mx-auto">{message}</p>

        <Button
          className="w-full bg-[#17A546] hover:bg-[#17A546]/90 text-white h-12 rounded-xl font-bold shadow-lg shadow-[#17A546]/20"
          onClick={onAction || onClose}
        >
          {actionLabel}
        </Button>
      </div>
    </ModalWrapper>
  );
}
