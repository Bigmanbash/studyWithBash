"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Headphones,
  Users,
  Settings,
  LogOut,
  X,
  Menu,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SidebarContentProps = {
  pathname: string;
  closeMobile: () => void;
};

const navSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Courses", href: "/admin/dashboard/courses", icon: BookOpen },
      { label: "Students", href: "/admin/dashboard/students", icon: Users },
      { label: "Payments", href: "/admin/dashboard/payments", icon: CreditCard },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Support", href: "/admin/dashboard/support", icon: Headphones },
      { label: "Settings", href: "/admin/dashboard/settings", icon: Settings },
    ],
  },
];

function SidebarContent({ pathname, closeMobile }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/6">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5" onClick={closeMobile}>
          <div className="h-9 w-9 rounded-lg bg-[#17A546] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#17A546]/20">
            B
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">Bash Academy</span>
            <span className="block text-[10px] uppercase tracking-[0.12em] text-white/40 font-medium">Admin</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="px-4 mb-2 text-[10px] uppercase tracking-[0.14em] font-semibold text-white/30">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-[#17A546]/15 text-[#22C55E]"
                        : "text-white/50 hover:bg-white/4 hover:text-white/80"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px]",
                        isActive ? "text-[#22C55E]" : "text-white/30 group-hover:text-white/60"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-[#22C55E]/60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/6">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/3">
          <div className="h-9 w-9 rounded-full bg-[#17A546]/20 flex items-center justify-center text-[#22C55E] font-bold text-sm">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white/90 truncate">Admin User</p>
            <p className="text-xs text-white/40 truncate">Super Admin</p>
          </div>
          <button className="text-white/30 hover:text-red-400 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-lg bg-[#030E36] shadow-lg border border-white/10 flex items-center justify-center"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-[#030E36] shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent pathname={pathname} closeMobile={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 bg-[#030E36]">
        <SidebarContent pathname={pathname} closeMobile={() => setIsMobileOpen(false)} />
      </aside>
    </>
  );
}
