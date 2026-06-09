"use client";

const levels = [
  { id: "all", label: "All Courses" },
  { id: "ss1", label: "SS1" },
  { id: "ss2", label: "SS2" },
  { id: "ss3", label: "SS3" },
  { id: "waec", label: "WAEC" },
  { id: "neco", label: "NECO" },
  { id: "jamb", label: "JAMB Prep" },
];

interface CourseFiltersProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

export function CourseFilters({ activeFilter, onFilterChange }: CourseFiltersProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide bg-white p-1.5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-neutral-100/80 w-full sm:w-auto">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onFilterChange(level.id)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 relative ${
            activeFilter === level.id
              ? "text-white shadow-lg shadow-[#17A546]/25 transform scale-[1.02]"
              : "text-[#676E85] hover:bg-neutral-50 hover:text-[#0A1B39]"
          }`}
        >
          {activeFilter === level.id && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#17A546] to-[#14933E] rounded-xl -z-10" />
          )}
          <span className="relative z-10">{level.label}</span>
        </button>
      ))}
    </div>
  );
}
