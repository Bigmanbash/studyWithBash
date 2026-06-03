"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, ShoppingBag, BookOpen, GraduationCap, User, 
  Settings, Plus, LogOut, X, Menu, ChevronDown, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const terms = [
  { label: "First Term", href: "first-term", available: true },
  { label: "Second Term", href: "second-term", available: false },
  { label: "Third Term", href: "third-term", available: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("sss1");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const NavItem = ({ href, icon: Icon, label, badge }: any) => {
    const isActive = pathname === href;
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
        {badge && (
          <span className="text-[10px] font-semibold tracking-wide bg-neutral-100 text-neutral-400 px-1.5 py-0.5 rounded-md">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  const ClassSection = ({ title, id }: { title: string; id: string }) => {
    const isExpanded = expandedSection === id;
    return (
      <div className="mb-0.5">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200 text-[#676E85] hover:bg-neutral-50 hover:text-[#0A1B39]"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-4 w-4 text-[#98A2B3] shrink-0" />
            <span>{title}</span>
          </div>
          {isExpanded
            ? <ChevronDown className="h-3.5 w-3.5 text-[#98A2B3]" />
            : <ChevronRight className="h-3.5 w-3.5 text-[#98A2B3]" />
          }
        </button>

        {isExpanded && (
          <div className="pl-9 pr-3 pt-0.5 pb-1 space-y-0.5">
            {terms.map((term) => (
              <div key={term.href} className="flex items-center justify-between py-1.5">
                <Link
                  href={`/dashboard/courses/${id}/${term.href}`}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "text-[12px]",
                    term.available
                      ? "text-[#676E85] hover:text-[#17A546] font-medium"
                      : "text-neutral-300 pointer-events-none"
                  )}
                >
                  {term.label}
                </Link>
                {!term.available && (
                  <span className="text-[10px] bg-neutral-100 text-neutral-400 px-1.5 py-0.5 rounded-md font-medium">
                    Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-5 flex-shrink-0 border-b border-neutral-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#17A546] flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-black">B</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-[#0A1B39]">
            Bash <span className="text-[#17A546]">Academy</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto pb-6 scrollbar-hide">

        <div className="space-y-0.5">
          <NavItem href="/dashboard" icon={Home} label="Home" />
          <NavItem href="/dashboard/purchased" icon={ShoppingBag} label="Purchased" />
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Courses</p>
          <ClassSection title="SSS 1" id="sss1" />
          <ClassSection title="SSS 2" id="sss2" />
          <ClassSection title="SSS 3" id="sss3" />
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Exam Prep</p>
          <div className="space-y-0.5">
            <NavItem href="/dashboard/exam/waec" icon={GraduationCap} label="WAEC" />
            <NavItem href="/dashboard/exam/neco" icon={GraduationCap} label="NECO" />
            <NavItem href="/dashboard/exam/jamb" icon={GraduationCap} label="JAMB" />
            <NavItem href="/dashboard/exam/post-utme" icon={GraduationCap} label="Post-UTME" badge="Soon" />
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Account</p>
          <div className="space-y-0.5">
            <NavItem href="/dashboard/profile" icon={User} label="Profile" />
            {/* <NavItem href="/dashboard/settings" icon={Settings} label="Settings" />
            <NavItem href="/dashboard/addons" icon={Plus} label="Add-ons" badge="Soon" /> */}
          </div>
        </div>
      </nav>

      {/* Bottom profile */}
      <div className="p-3 border-t border-neutral-100 flex-shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-[12px] shrink-0">
            C
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#0A1B39] truncate">Chioma E.</p>
            <p className="text-[11px] text-[#676E85] truncate">chioma@example.com</p>
          </div>
          <button className="text-[#98A2B3] group-hover:text-red-400 transition-colors">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-9 w-9 rounded-md bg-white shadow-md border border-neutral-200 flex items-center justify-center"
      >
        <Menu className="h-4 w-4 text-[#0A1B39]" />
      </button>

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