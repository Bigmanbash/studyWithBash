"use client";

import { Button } from "@/components/ui/button";
import { ModalWrapper } from "./ModalWrapper";
import { AlertCircle, HelpCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. Do you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-4">
        {/* Animated Icon */}
        <div className="relative mx-auto h-20 w-20 mb-6">
          <div className={`absolute inset-0 rounded-full ${isDestructive ? 'bg-semantic-error-main/10' : 'bg-brand-gold/10'} animate-pulse`}></div>
          <div className={`relative h-20 w-20 rounded-full ${isDestructive ? 'bg-semantic-error-main/10' : 'bg-brand-gold/10'} flex items-center justify-center`}>
            {isDestructive ? (
              <AlertCircle className="h-10 w-10 text-semantic-error-main" />
            ) : (
              <HelpCircle className="h-10 w-10 text-brand-gold" />
            )}
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#0A1B39] mb-3">{title}</h3>
        <p className="text-sm text-[#676E85] leading-relaxed mb-8 max-w-xs mx-auto">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-1/2 h-12 rounded-xl border-neutral-200 text-[#676E85] font-medium hover:bg-neutral-50 hover:text-[#0A1B39]"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            className={`w-full sm:w-1/2 h-12 rounded-xl font-bold shadow-lg ${
              isDestructive
                ? "bg-semantic-error-main hover:bg-semantic-error-main/90 shadow-semantic-error-main/20 text-white"
                : "bg-brand-gold hover:bg-brand-gold/90 shadow-brand-gold/20 text-white"
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
