import { Headphones, ArrowRight, MessageCircle, Clock, AlertTriangle } from "lucide-react";

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
    <div className="bg-white rounded-md border border-neutral-200/80 shadow-xs p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[#0A1B39]">Support Tickets</h3>
          <span className="h-4 px-1.5 rounded-md bg-red-500 text-white text-[9px] flex items-center justify-center font-extrabold">
            4
          </span>
        </div>
        <button className="text-xs font-semibold text-[#17A546] hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Open", value: "12", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Urgent", value: "4", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Avg. Response", value: "2.4h", icon: Clock, color: "text-[#DEAB06]", bg: "bg-[#DEAB06]/10" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-2.5 rounded-md bg-neutral-50 border border-neutral-200/60">
            <div className={`${stat.bg} rounded-md p-1 w-fit mx-auto mb-1`}>
              <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
            </div>
            <p className="text-sm font-bold text-[#0A1B39]">{stat.value}</p>
            <p className="text-[10px] text-[#676E85] font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-1.5">
        {tickets.map((ticket) => {
          const priority = priorityConfig[ticket.priority];
          return (
            <div
              key={ticket.id}
              className="flex items-center gap-3 p-2.5 rounded-md hover:bg-neutral-50 transition-colors group cursor-pointer border border-transparent hover:border-neutral-200/60"
            >
              <div className="relative flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-[10px]">
                  {ticket.initials}
                </div>
                {ticket.unread && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#17A546] ring-2 ring-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0A1B39] truncate group-hover:text-[#17A546] transition-colors">
                  {ticket.subject}
                </p>
                <p className="text-[11px] text-[#676E85] mt-0.5 truncate">
                  {ticket.student} · {ticket.id}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priority.color} ${priority.bg}`}>
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
