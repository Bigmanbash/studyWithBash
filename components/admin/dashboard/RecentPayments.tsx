import { ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const recentPayments = [
  {
    student: "Adaeze Okonkwo",
    initials: "AO",
    course: "Physics (SS2)",
    amount: "₦15,000",
    status: "pending" as const,
    time: "2 min ago",
  },
  {
    student: "Tunde Bakare",
    initials: "TB",
    course: "Mathematics (SS3)",
    amount: "₦15,000",
    status: "approved" as const,
    time: "15 min ago",
  },
  {
    student: "Blessing Eze",
    initials: "BE",
    course: "Chemistry (SS1)",
    amount: "₦12,000",
    status: "pending" as const,
    time: "1 hour ago",
  },
  {
    student: "Emeka Nwosu",
    initials: "EN",
    course: "Biology (SS2)",
    amount: "₦15,000",
    status: "rejected" as const,
    time: "2 hours ago",
  },
  {
    student: "Fatima Yusuf",
    initials: "FY",
    course: "English (SS3)",
    amount: "₦10,000",
    status: "approved" as const,
    time: "3 hours ago",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-[#F5B546]",
    bg: "bg-[#FEF6E7]",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "text-[#0E7B33]",
    bg: "bg-[#E7F6EC]",
  },
  rejected: {
    label: "Rejected",
    icon: AlertCircle,
    color: "text-[#940803]",
    bg: "bg-[#FBEAE9]",
  },
};

export function RecentPayments() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#0A1B39]">Recent Payments</h3>
        <button className="text-xs font-medium text-[#17A546] hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3">
        {recentPayments.map((payment, i) => {
          const config = statusConfig[payment.status];
          return (
            <div
              key={i}
              className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
            >
              <div className="h-10 w-10 rounded-full bg-[#030E36]/5 flex items-center justify-center text-[#030E36] font-bold text-xs flex-shrink-0">
                {payment.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0A1B39] truncate">
                  {payment.student}
                </p>
                <p className="text-xs text-[#98A2B3] mt-0.5 truncate">
                  {payment.course} · {payment.amount}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${config.color} ${config.bg}`}
                >
                  <config.icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{config.label}</span>
                </div>
                <span className="text-[10px] text-[#98A2B3] hidden sm:block">
                  {payment.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
