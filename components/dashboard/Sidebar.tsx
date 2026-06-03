"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  ShoppingBag, 
  BookOpen, 
  GraduationCap, 
  User, 
  Settings, 
  Plus,
  LogOut, 
  X, 
  Menu,
  ChevronDown,
  ChevronRight
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
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-[#17A546]/10 text-[#17A546] shadow-sm"
            : "text-[#676E85] hover:bg-neutral-100 hover:text-[#0A1B39]"
        )}
      >
        <Icon className={cn("h-5 w-5", isActive ? "text-[#17A546]" : "text-[#98A2B3]")} />
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="text-[10px] uppercase font-bold tracking-wider bg-neutral-200 text-neutral-500 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  const ClassSection = ({ title, id }: { title: string, id: string }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="mb-1">
        <button
          onClick={() => toggleSection(id)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-[#676E85] hover:bg-neutral-100 hover:text-[#0A1B39]"
          )}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-[#98A2B3]" />
            <span>{title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-[#98A2B3]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#98A2B3]" />
          )}
        </button>
        
        {isExpanded && (
          <div className="pl-11 pr-4 py-1 space-y-1">
            {terms.map((term) => (
              <div key={term.href} className="flex items-center justify-between py-2 group">
                <Link 
                  href={`/dashboard/courses/${id}/${term.href}`}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "text-sm",
                    term.available 
                      ? "text-[#676E85] hover:text-[#17A546] font-medium" 
                      : "text-neutral-400 pointer-events-none"
                  )}
                >
                  {term.label}
                </Link>
                {!term.available && (
                  <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-medium">
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
      <div className="px-6 py-6 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tighter text-[#17A546]">Bash Academy</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-6 overflow-y-auto pb-6 scrollbar-hide">
        
        {/* Core Nav */}
        <div className="space-y-1">
          <NavItem href="/dashboard" icon={Home} label="Home" />
          <NavItem href="/dashboard/purchased" icon={ShoppingBag} label="Purchased Courses" />
        </div>

        {/* Classes */}
        <div>
          <h4 className="px-4 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Courses</h4>
          <ClassSection title="SSS 1" id="sss1" />
          <ClassSection title="SSS 2" id="sss2" />
          <ClassSection title="SSS 3" id="sss3" />
        </div>

        {/* Exam Prep */}
        <div>
          <h4 className="px-4 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Exam Prep</h4>
          <div className="space-y-1">
            <NavItem href="/dashboard/exam/waec" icon={GraduationCap} label="WAEC" />
            <NavItem href="/dashboard/exam/neco" icon={GraduationCap} label="NECO" />
            <NavItem href="/dashboard/exam/jamb" icon={GraduationCap} label="JAMB" />
            <NavItem href="/dashboard/exam/post-utme" icon={GraduationCap} label="Post-UTME" badge="Soon" />
          </div>
        </div>

        {/* Account */}
        <div>
          <h4 className="px-4 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Account</h4>
          <div className="space-y-1">
            <NavItem href="/dashboard/profile" icon={User} label="Profile" />
            <NavItem href="/dashboard/settings" icon={Settings} label="Settings" />
            <NavItem href="/dashboard/addons" icon={Plus} label="Add-ons" badge="Soon" />
          </div>
        </div>
      </nav>

      {/* Bottom Profile */}
      <div className="p-4 border-t border-neutral-100 flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group">
          <div className="h-9 w-9 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-sm">
            C
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0A1B39] truncate">Chioma E.</p>
            <p className="text-xs text-[#676E85] truncate">chioma@example.com</p>
          </div>
          <button className="text-[#98A2B3] group-hover:text-red-500 transition-colors">
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-5 right-5 text-[#676E85] hover:text-[#0A1B39] bg-neutral-100 rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[280px] lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-neutral-100">
        <SidebarContent />
      </aside>
    </>
  );
}
