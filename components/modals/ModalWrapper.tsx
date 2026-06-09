"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function ModalWrapper({ isOpen, onClose, children, size = "md" }: ModalWrapperProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "w-[90vw] min-w-[280px] max-w-sm",
    md: "w-[90vw] min-w-[280px] max-w-md",
    lg: "w-[90vw] min-w-[280px] max-w-lg",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A1B39]/40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative ${sizeClasses[size]} bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#98A2B3] hover:text-[#0A1B39] transition-colors h-8 w-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center z-10"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="overflow-y-auto custom-scrollbar flex-1 -mx-2 px-2 sm:-mx-4 sm:px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
