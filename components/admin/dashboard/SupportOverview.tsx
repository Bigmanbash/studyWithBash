import { ArrowRight, MessageCircle, Clock, AlertTriangle } from "lucide-react";

const tickets = [
  {
    id: "TKT-001",
    student: "Chioma Eze",
    initials: "CE",
    subject: "Cannot access Physics course",
    priority: "high" as const,
    time: "5 min ago",
    unread: true,
  },
  {
    id: "TKT-002",
    student: "Ibrahim Musa",
    initials: "IM",
    subject: "Payment not reflecting",
    priority: "high" as const,
    time: "20 min ago",
    unread: true,
  },
  {
    id: "TKT-003",
    student: "Grace Adeyemi",
    initials: "GA",
    subject: "Quiz score incorrect",
    priority: "medium" as const,
    time: "1 hour ago",
    unread: false,
  },
  {
    id: "TKT-004",
    student: "Yusuf Bello",
    initials: "YB",
    subject: "Request for course refund",
    priority: "low" as const,
    time: "3 hours ago",
    unread: false,
  },
];

const priorityConfig = {
  high: { color: "text-[#940803]", bg: "bg-[#FBEAE9]", label: "High" },
  medium: { color: "text-[#F5B546]", bg: "bg-[#FEF6E7]", label: "Medium" },
  low: { color: "text-[#676E85]", bg: "bg-neutral-100", label: "Low" },
};

export function SupportOverview() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-[#0A1B39]">Support Tickets</h3>
          <span className="h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
            4
          </span>
        </div>
        <button className="text-xs font-medium text-[#17A546] hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Open", value: "12", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Urgent", value: "4", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Avg. Response", value: "2.4h", icon: Clock, color: "text-[#DEAB06]", bg: "bg-[#DEAB06]/10" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-3 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className={`${stat.bg} rounded-lg p-1.5 w-fit mx-auto mb-1.5`}>
              <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
            </div>
            <p className="text-base font-bold text-[#0A1B39]">{stat.value}</p>
            <p className="text-[10px] text-[#98A2B3] font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-2">
        {tickets.map((ticket) => {
          const priority = priorityConfig[ticket.priority];
          return (
            <div
              key={ticket.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group cursor-pointer"
            >
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-full bg-[#030E36]/5 flex items-center justify-center text-[#030E36] font-bold text-[10px]">
                  {ticket.initials}
                </div>
                {ticket.unread && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#17A546] border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0A1B39] truncate group-hover:text-[#17A546] transition-colors">
                  {ticket.subject}
                </p>
                <p className="text-xs text-[#98A2B3] mt-0.5 truncate">
                  {ticket.student} · {ticket.id}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priority.color} ${priority.bg}`}>
                  {priority.label}
                </span>
                <span className="text-[10px] text-[#98A2B3] hidden sm:block">{ticket.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
