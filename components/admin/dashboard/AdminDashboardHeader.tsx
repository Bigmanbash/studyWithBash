"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { NotificationsModal, ProfileModal } from "@/components/modals";

export function AdminDashboardHeader() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left — Page Title (placeholder, can be dynamic) */}
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl font-bold text-[#0A1B39] ml-12 lg:ml-0">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className={`hidden sm:flex items-center bg-neutral-50 rounded-xl px-4 py-2 gap-2 border transition-colors duration-200 ${searchFocused
              ? "border-[#17A546]/30 bg-white shadow-sm"
              : "border-neutral-100"
              }`}
          >
            <Search className="h-4 w-4 text-[#98A2B3]" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent text-sm outline-none w-48 placeholder:text-[#98A2B3]"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* Notifications */}
          <button
            className="relative h-10 w-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center hover:bg-neutral-100 transition-colors"
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5 text-[#676E85]" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
              5
            </span>
          </button>

          {/* Admin Avatar */}
          <button
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="h-8 w-8 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-xs">
              A
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#98A2B3]" />
          </button>
        </div>
        </div>
      </header>

      {/* Modals */}
      <NotificationsModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
