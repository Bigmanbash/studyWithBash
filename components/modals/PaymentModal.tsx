"use client";

import { Button } from "@/components/ui/button";
import { ModalWrapper } from "./ModalWrapper";
import { CreditCard, Shield } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: { name: string; price: string };
}

export function PaymentModal({ isOpen, onClose, plan = { name: "Pro", price: "₦2,500" } }: PaymentModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center mb-6">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-[#17A546]/10 flex items-center justify-center mb-4">
          <CreditCard className="h-7 w-7 text-[#17A546]" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-(--heading)">Upgrade to {plan.name}</h3>
        <p className="text-sm text-(--muted) mt-2">Unlock full access to all courses and features</p>
      </div>

      {/* Plan summary */}
      <div className="bg-[rgba(148,163,184,0.08)] rounded-2xl p-5 mb-6 border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-(--heading)">{plan.name} Plan</span>
          <span className="text-lg font-bold text-(--heading)">{plan.price}<span className="text-sm font-normal text-(--muted)">/mo</span></span>
        </div>
        <ul className="space-y-2">
          {["Full SS1-SS3 & JAMB curriculum", "Unlimited practice questions", "Mock exams & analytics"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-(--muted)">
              <div className="h-1.5 w-1.5 rounded-full bg-[#17A546]"></div>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Payment fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-1.5 block">Card Number</label>
          <input
            type="text"
            placeholder="0000 0000 0000 0000"
            className="flex h-12 w-full rounded-xl border border-input bg-(--card) px-4 py-2 text-base text-foreground placeholder:text-(--muted) focus-visible:outline-none focus-visible:border-[#3B82F6] focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-1.5 block">Expiry</label>
            <input
              type="text"
              placeholder="MM/YY"
              className="flex h-12 w-full rounded-xl border border-input bg-(--card) px-4 py-2 text-base text-foreground placeholder:text-(--muted) focus-visible:outline-none focus-visible:border-[#3B82F6] focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-1.5 block">CVV</label>
            <input
              type="text"
              placeholder="123"
              className="flex h-12 w-full rounded-xl border border-input bg-(--card) px-4 py-2 text-base text-foreground placeholder:text-(--muted) focus-visible:outline-none focus-visible:border-[#3B82F6] focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
            />
          </div>
        </div>
      </div>

      <Button className="w-full bg-[#17A546] hover:bg-[#17A546]/90 text-white h-12 rounded-xl font-bold shadow-lg shadow-[#17A546]/20">
        Pay {plan.price}
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        <Shield className="h-3.5 w-3.5 text-(--muted)" />
        <span className="text-xs text-(--muted)">Secured by Paystack · 256-bit SSL</span>
      </div>
    </ModalWrapper>
  );
}
