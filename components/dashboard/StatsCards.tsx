import { TrendingUp, BookOpen, Clock, Target } from "lucide-react";

const stats = [
  {
    label: "Overall Score",
    value: "267",
    change: "+12 this week",
    icon: TrendingUp,
    color: "text-[#17A546]",
    bg: "bg-[#17A546]/10",
  },
  {
    label: "Courses Active",
    value: "3",
    change: "Physics, Chem, Math",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Study Time",
    value: "14h",
    change: "+3h from last week",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Questions Done",
    value: "432",
    change: "86% accuracy",
    icon: Target,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`${stat.bg} rounded-xl p-2.5 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">{stat.value}</p>
          <p className="text-sm text-[#676E85] mt-1">{stat.label}</p>
          <p className="text-xs text-[#98A2B3] mt-2">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}
