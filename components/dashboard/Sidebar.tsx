"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, BarChart3, Settings, LogOut, Trophy, HelpCircle, X, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { label: "Help Center", href: "/dashboard/help", icon: HelpCircle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-neutral-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tighter text-[#17A546]">Bash Academy</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#17A546]/10 text-[#17A546] shadow-sm"
                  : "text-[#676E85] hover:bg-neutral-100 hover:text-[#0A1B39]"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-[#17A546]" : "text-[#98A2B3]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-neutral-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50">
          <div className="h-9 w-9 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-sm">
            C
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0A1B39] truncate">Chioma E.</p>
            <p className="text-xs text-[#676E85] truncate">SS3 · JAMB Prep</p>
          </div>
          <button className="text-[#98A2B3] hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-xl bg-white shadow-lg border border-neutral-200 flex items-center justify-center"
      >
        <Menu className="h-5 w-5 text-[#0A1B39]" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-5 right-5 text-[#676E85] hover:text-[#0A1B39]"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-neutral-100">
        <SidebarContent />
      </aside>
    </>
  );
}
