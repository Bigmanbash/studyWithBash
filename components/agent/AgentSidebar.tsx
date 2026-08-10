"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, Users, LogOut, X, Menu, Bell, KeyRound, User,
  TrendingUp, CreditCard
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";

export function AgentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();

  const getInitials = (name?: string) => {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };
  const initial = getInitials(session?.user?.name) || "A";

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const NavItem = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname === href || (href !== "/agent/dashboard" && pathname.startsWith(href));
    return (
      <Link
        href={href}
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200",
          isActive
            ? "bg-[#17A546]/10 text-[#17A546]"
            : "text-[#676E85] hover:bg-neutral-50 hover:text-[#0A1B39]"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#17A546]" : "text-[#98A2B3]")} />
        <span className="flex-1">{label}</span>
      </Link>
    );
  };

  const SidebarContent = () => {
    const handleSignOut = async () => {
      await authClient.signOut();
      router.push("/login");
    };

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo */}
        <div className="px-5 py-5 flex-shrink-0 border-b border-neutral-100">
          <Link href="/agent/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#17A546] flex items-center justify-center shrink-0">
              <span className="text-white text-[11px] font-black">B</span>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[#0A1B39]">
              Bash <span className="text-[#17A546]">Academy</span>
            </span>
            <span className="ml-auto text-[9px] font-bold tracking-widest uppercase bg-[#17A546]/10 text-[#17A546] px-1.5 py-0.5 rounded-md border border-[#17A546]/20">
              Agent
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto pb-6 scrollbar-hide">
          <div className="space-y-0.5">
            <p className="px-3 text-[10px] font-bold text-[#17A546] uppercase tracking-widest mb-1.5">Agent Workspace</p>
            <NavItem href="/agent/dashboard" icon={Home} label="Dashboard" />
            <NavItem href="/agent/dashboard/earnings" icon={TrendingUp} label="Earnings & Payouts" />
            <NavItem href="/agent/dashboard/buy-for-students" icon={CreditCard} label="Buy for Students" />
            <NavItem href="/agent/dashboard/access-codes" icon={KeyRound} label="Access Codes" />
            <NavItem href="/dashboard" icon={User} label="Switch to Student" />
          </div>
        </nav>

        {/* Bottom profile */}
        <div className="p-3 border-t border-neutral-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer group">
            <div className="h-8 w-8 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-[12px] shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#0A1B39] truncate">
                {session?.user?.name || "Agent"}
              </p>
              <p className="text-[11px] text-[#676E85] truncate">
                {session?.user?.email || "agent@example.com"}
              </p>
            </div>
            <button onClick={handleSignOut} className="text-[#98A2B3] group-hover:text-red-400 transition-colors">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-16 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-4 sm:px-6 bg-white/80">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="h-10 w-10 -ml-2 rounded-full bg-brand-green/10 text-brand-green hover:bg-brand-green/15 flex items-center justify-center transition-colors active:scale-95 text-[#0A1B39]"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 w-10 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors relative text-[#676E85] hover:text-[#0A1B39]">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#17A546] border-2 border-white" />
          </button>
          <div className="relative">
            <div
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="h-8 w-8 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-[13px] ring-2 ring-white cursor-pointer select-none"
            >
              {initial}
            </div>

            {isProfileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 z-50 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-neutral-100 mb-1">
                    <p className="text-[13px] font-semibold text-[#0A1B39] truncate">{session?.user?.name || "Agent"}</p>
                    <p className="text-[11px] text-[#676E85] truncate">{session?.user?.email}</p>
                  </div>
                  <Link href="/dashboard/profile" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#676E85] hover:text-[#0A1B39] hover:bg-neutral-50 transition-colors">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    onClick={async () => { await authClient.signOut(); router.push("/login"); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-[#676E85] hover:text-[#0A1B39] bg-neutral-100 rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-neutral-100">
        <SidebarContent />
      </aside>
    </>
  );
}
