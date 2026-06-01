import { Trophy, Target, BookOpen } from "lucide-react";

export function CourseSidebar() {
  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-(--card) rounded-3xl border border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-8">
        <h4 className="text-base font-bold text-(--heading) mb-6">Your Progress</h4>
        <div className="relative h-32 w-32 mx-auto mb-6">
          <svg className="h-32 w-32 -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F3F4F6" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="42" fill="none" stroke="url(#progress-gradient)" strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - 0.22)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#17A546" />
                <stop offset="100%" stopColor="#14933E" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-(--heading)">22%</span>
          </div>
        </div>
        <p className="text-sm text-center font-medium text-(--muted)">3 of 14 topics completed</p>
      </div>

      {/* Quick Stats */}
      <div className="bg-(--card) rounded-3xl border border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-8">
        <h4 className="text-base font-bold text-(--heading) mb-6">Quick Stats</h4>
        <div className="space-y-5">
          {[
            { icon: Trophy, label: "Best Score", value: "85%", color: "text-amber-500", bg: "bg-amber-50" },
            { icon: Target, label: "Exercises Done", value: "37", color: "text-[#17A546]", bg: "bg-[#17A546]/10" },
            { icon: BookOpen, label: "Study Time", value: "4.5h", color: "text-blue-500", bg: "bg-blue-50" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center shadow-sm`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-(--muted)">{stat.label}</p>
                <p className="text-[17px] font-bold text-(--heading)">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
