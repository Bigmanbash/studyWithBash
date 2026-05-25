import { Users, BookOpen, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  {
    label: "Total Students",
    value: "2,847",
    change: "+12.5%",
    trend: "up" as const,
    period: "vs last month",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Active Courses",
    value: "24",
    change: "+3",
    trend: "up" as const,
    period: "this month",
    icon: BookOpen,
    color: "text-[#17A546]",
    bg: "bg-[#17A546]/10",
  },
  {
    label: "Revenue",
    value: "₦4.2M",
    change: "+23.1%",
    trend: "up" as const,
    period: "vs last month",
    icon: CreditCard,
    color: "text-[#DEAB06]",
    bg: "bg-[#DEAB06]/10",
  },
  {
    label: "Completion Rate",
    value: "68.4%",
    change: "-2.3%",
    trend: "down" as const,
    period: "vs last month",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export function AdminStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`${stat.bg} rounded-xl p-2.5 group-hover:scale-110 transition-transform duration-200`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.trend === "up"
                  ? "text-[#0E7B33] bg-[#E7F6EC]"
                  : "text-[#940803] bg-[#FBEAE9]"
              }`}
            >
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {stat.change}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">
            {stat.value}
          </p>
          <p className="text-sm text-[#676E85] mt-1">{stat.label}</p>
          <p className="text-xs text-[#98A2B3] mt-1">{stat.period}</p>
        </div>
      ))}
    </div>
  );
}
