"use client";

import { CheckCircle2, X } from "lucide-react";
import { ModalWrapper } from "./ModalWrapper";

interface PaymentSuccessModalProps {
  onClose: () => void;
}

export function PaymentSuccessModal({ onClose }: PaymentSuccessModalProps) {
  return (
    <ModalWrapper isOpen={true} onClose={onClose}>
      <div className="flex flex-col items-center justify-center py-6 px-4 sm:px-6">
        <div className="h-16 w-16 bg-[#17A546]/10 text-[#17A546] flex items-center justify-center rounded-full mb-6 relative">
          <div className="absolute inset-0 bg-[#17A546]/20 rounded-full animate-ping opacity-75"></div>
          <CheckCircle2 className="h-8 w-8 relative z-10" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold text-[#0A1B39] mb-2 text-center">
          Payment Successful!
        </h3>
        
        <p className="text-[#676E85] text-sm sm:text-base text-center mb-8">
          Your payment has been processed successfully and the course has been added to your dashboard.
        </p>
        
        <button
          onClick={onClose}
          className="w-full bg-[#17A546] hover:bg-[#128638] text-white font-medium py-3 px-4 rounded-xl transition-colors focus:ring-4 focus:ring-[#17A546]/20"
        >
          Go to Dashboard
        </button>
      </div>
    </ModalWrapper>
  );
}
