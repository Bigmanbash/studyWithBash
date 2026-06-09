"use client";

import { useAdminStore } from "@/store/adminStore";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";

export function StatusModal() {
  const { statusModal, closeStatusModal } = useAdminStore();
  const { isOpen, title, message, type } = statusModal;

  useEffect(() => {
    // If it's a success or error, we can auto-close or let the user close it.
    // We'll let the user close it for errors, and maybe auto-close for success.
    if (isOpen && type === "success") {
      const timer = setTimeout(() => {
        closeStatusModal();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, closeStatusModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-md min-w-[280px] p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
        <div className="flex justify-center mb-4">
          {type === "loading" && <Loader2 className="h-12 w-12 text-[#17A546] animate-spin" />}
          {type === "success" && <CheckCircle2 className="h-12 w-12 text-[#17A546]" />}
          {type === "error" && <XCircle className="h-12 w-12 text-red-500" />}
        </div>

        <h3 className="text-xl font-bold text-[#0A1B39] mb-2">{title}</h3>
        <p className="text-[#676E85] text-sm mb-6">{message}</p>

        {type !== "loading" && (
          <button
            onClick={closeStatusModal}
            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#0A1B39] font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
