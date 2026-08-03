"use client";

import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterTab<T extends string> {
  key: T;
  label: string;
  count?: number;
}

interface AdminFilterBarProps<T extends string> {
  tabs: FilterTab<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
}

export function AdminFilterBar<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  showFilterButton = false,
  onFilterClick,
}: AdminFilterBarProps<T>) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 border-b sm:border-b-0 border-neutral-200/80 pb-2 sm:pb-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap",
              activeTab === tab.key
                ? "bg-[#17A546]/10 text-[#17A546] font-bold"
                : "text-[#676E85] hover:text-[#0A1B39] hover:bg-neutral-100/60"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors",
                  activeTab === tab.key
                    ? "bg-[#17A546]/20 text-[#17A546]"
                    : "bg-neutral-100 text-[#676E85]"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Input & Action Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#98A2B3]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white text-xs pl-8 pr-3 py-1.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#17A546] focus:ring-1 focus:ring-[#17A546]/20 transition-all text-[#0A1B39] placeholder:text-[#98A2B3]"
          />
        </div>
        {showFilterButton && (
          <button
            onClick={onFilterClick}
            className="h-8 w-8 rounded-md bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors shrink-0 shadow-2xs text-[#676E85]"
            title="Filter options"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
