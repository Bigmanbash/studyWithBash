"use client";

import { Button } from "@/components/ui/button";
import { ModalWrapper } from "./ModalWrapper";
import { XCircle, AlertTriangle } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorModal({
  isOpen,
  onClose,
  title = "Action Failed",
  message = "An unexpected error occurred. Please try again.",
  actionLabel = "Try Again",
  onAction,
}: ErrorModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-4">
        {/* Animated Error */}
        <div className="relative mx-auto h-20 w-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-semantic-error-main/10 animate-pulse"></div>
          <div className="relative h-20 w-20 rounded-full bg-semantic-error-main/10 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-semantic-error-main" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-2">
          <AlertTriangle className="h-4 w-4 text-semantic-error-main" />
          <span className="text-xs font-bold text-semantic-error-main uppercase tracking-wide">Error</span>
          <AlertTriangle className="h-4 w-4 text-semantic-error-main" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#0A1B39] mb-3">{title}</h3>
        <p className="text-sm text-[#676E85] leading-relaxed mb-8 max-w-xs mx-auto">{message}</p>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-semantic-error-main hover:bg-semantic-error-main/90 text-white h-12 rounded-xl font-bold shadow-lg shadow-semantic-error-main/20"
            onClick={onAction || onClose}
          >
            {actionLabel}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-[#676E85] hover:text-[#0A1B39] hover:bg-neutral-100 h-12 rounded-xl font-medium"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
