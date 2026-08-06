"use client";

import { useAdminStore } from "@/store/adminStore";
import { useStudentStore } from "@/store/studentStore";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";

export function StatusModal() {
  const adminStore = useAdminStore();
  const studentStore = useStudentStore();
  
  const adminModal = adminStore.statusModal;
  const studentModal = studentStore.statusModal;

  const isOpen = adminModal.isOpen || studentModal.isOpen;
  const activeModal = adminModal.isOpen ? adminModal : studentModal;
  const closeActiveModal = adminModal.isOpen ? adminStore.closeStatusModal : studentStore.closeStatusModal;

  const { title, message, type } = activeModal;

  useEffect(() => {
    if (isOpen && type === "success") {
      const timer = setTimeout(() => {
        closeActiveModal();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, closeActiveModal]);

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
            onClick={closeActiveModal}
            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#0A1B39] font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
