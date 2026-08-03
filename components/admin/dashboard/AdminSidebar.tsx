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
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { logout } from "@/app/api/auth";
import type { AuthUser } from "@/app/api/auth";
import { useRouter } from "next/navigation";

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

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const getInitials = (name?: string) => {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };
  const initial = getInitials((session?.user as unknown as AuthUser)?.name) || "A";

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Logo Header */}
      <div className="px-5 py-5 flex-shrink-0 border-b border-neutral-100">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#17A546] flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-black">B</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-[#0A1B39]">
            Bash <span className="text-[#17A546]">Academy</span>
          </span>
          <span className="ml-auto text-[9px] font-bold tracking-widest uppercase bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-md border border-neutral-200/60">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto pb-6 scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#17A546]/10 text-[#17A546]"
                        : "text-[#676E85] hover:bg-neutral-50 hover:text-[#0A1B39]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-[#17A546]" : "text-[#98A2B3]"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom — Admin Profile Card */}
      <div className="p-3 border-t border-neutral-100 flex-shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-neutral-50 transition-colors group">
          <div className="h-8 w-8 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-[12px] shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#0A1B39] truncate">
              {(session?.user as unknown as AuthUser)?.name || "Administrator"}
            </p>
            <p className="text-[11px] text-[#676E85] truncate">
              {(session?.user as unknown as AuthUser)?.email || "admin@bashacademy.com"}
            </p>
          </div>
          <button 
            className="text-[#98A2B3] hover:text-red-500 transition-colors p-1"
            title="Log Out"
            onClick={async () => {
              await logout();
              router.push("/admin/login");
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
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
        className="lg:hidden fixed top-3 left-3 z-50 h-9 w-9 rounded-md bg-white shadow-md border border-neutral-200 flex items-center justify-center text-[#0A1B39]"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-[#676E85] hover:text-[#0A1B39] bg-neutral-100 rounded-full p-1 z-10"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-neutral-100 z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
