"use client";

import { ModalWrapper } from "./ModalWrapper";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center mb-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-[#17A546]/10 flex items-center justify-center mb-4 border-4 border-white shadow-md">
          <span className="text-2xl font-bold text-[#17A546]">A</span>
        </div>
        <h3 className="text-xl font-bold text-(--heading)">Admin User</h3>
        <p className="text-sm text-(--muted) mt-1">Super Admin</p>
      </div>

      <div className="bg-[rgba(148,163,184,0.08)] rounded-2xl sm:rounded-3xl p-5 mb-6 border border-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-(--card) flex items-center justify-center shadow-sm text-(--muted)">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-(--muted) uppercase tracking-wider">Full Name</p>
            <p className="text-sm font-medium text-(--heading)">Admin User</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-(--card) flex items-center justify-center shadow-sm text-(--muted)">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-(--muted) uppercase tracking-wider">Email Address</p>
            <p className="text-sm font-medium text-(--heading)">admin@bashacademy.com</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-(--card) flex items-center justify-center shadow-sm text-(--muted)">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-(--muted) uppercase tracking-wider">Role</p>
            <p className="text-sm font-medium text-(--heading)">Super Administrator</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1 border-border text-(--heading) font-semibold hover:bg-[rgba(255,255,255,0.08)]">
          Edit Profile
        </Button>
        <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold gap-2">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </ModalWrapper>
  );
}
