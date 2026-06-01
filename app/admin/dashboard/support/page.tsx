"use client";

import { useState } from "react";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import {
  Headphones,
  Search,
  MessageCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Filter,
  XCircle,
  MailOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type TicketPriority = "high" | "medium" | "low";

interface Ticket {
  id: string;
  student: string;
  initials: string;
  email: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdAt: string;
  lastReply: string;
  replies: number;
}

const tickets: Ticket[] = [
  {
    id: "TKT-2847",
    student: "Chioma Eze",
    initials: "CE",
    email: "chioma@email.com",
    subject: "Cannot access Physics course after payment",
    message: "I made payment for the Physics SS2 course yesterday but I still cannot access the course materials...",
    status: "open",
    priority: "high",
    category: "Payment",
    createdAt: "5 min ago",
    lastReply: "Not replied",
    replies: 0,
  },
  {
    id: "TKT-2846",
    student: "Ibrahim Musa",
    initials: "IM",
    email: "ibrahim.m@email.com",
    subject: "Payment confirmation not received",
    message: "I transferred ₦15,000 for the Mathematics SS3 course but haven't received any confirmation...",
    status: "open",
    priority: "high",
    category: "Payment",
    createdAt: "20 min ago",
    lastReply: "Not replied",
    replies: 0,
  },
  {
    id: "TKT-2845",
    student: "Grace Adeyemi",
    initials: "GA",
    email: "grace.a@email.com",
    subject: "Quiz score showing incorrect result",
    message: "I answered all questions correctly in the Chemistry quiz but my score shows 60%...",
    status: "in_progress",
    priority: "medium",
    category: "Technical",
    createdAt: "1 hour ago",
    lastReply: "30 min ago",
    replies: 2,
  },
  {
    id: "TKT-2844",
    student: "Yusuf Bello",
    initials: "YB",
    email: "yusuf.b@email.com",
    subject: "Request for course refund",
    message: "I would like to request a refund for the Government SS2 course as I no longer need it...",
    status: "in_progress",
    priority: "low",
    category: "Billing",
    createdAt: "3 hours ago",
    lastReply: "1 hour ago",
    replies: 3,
  },
  {
    id: "TKT-2843",
    student: "Amina Obi",
    initials: "AO",
    email: "amina.o@email.com",
    subject: "Video lessons not loading on mobile",
    message: "The video lessons in Biology SS1 keep buffering and won't load on my phone...",
    status: "open",
    priority: "medium",
    category: "Technical",
    createdAt: "4 hours ago",
    lastReply: "Not replied",
    replies: 0,
  },
  {
    id: "TKT-2840",
    student: "Emeka Nwosu",
    initials: "EN",
    email: "emeka.n@email.com",
    subject: "Certificate not generated after completion",
    message: "I completed the English SS3 course last week but my certificate hasn't been generated...",
    status: "resolved",
    priority: "low",
    category: "General",
    createdAt: "1 day ago",
    lastReply: "6 hours ago",
    replies: 4,
  },
  {
    id: "TKT-2838",
    student: "Fatima Yusuf",
    initials: "FY",
    email: "fatima.y@email.com",
    subject: "Account login issues",
    message: "I can't log into my account, it keeps saying invalid credentials even though I'm using the correct password...",
    status: "closed",
    priority: "medium",
    category: "Account",
    createdAt: "2 days ago",
    lastReply: "1 day ago",
    replies: 5,
  },
];

const statusConfig = {
  open: { label: "Open", color: "text-blue-600", bg: "bg-blue-50", icon: MailOpen },
  in_progress: { label: "In Progress", color: "text-[#DEAB06]", bg: "bg-[#FEF6E7]", icon: Clock },
  resolved: { label: "Resolved", color: "text-[#0E7B33]", bg: "bg-[#E7F6EC]", icon: CheckCircle2 },
  closed: { label: "Closed", color: "text-[#676E85]", bg: "bg-neutral-100", icon: XCircle },
};

const priorityConfig = {
  high: { label: "High", color: "text-[#940803]", bg: "bg-[#FBEAE9]" },
  medium: { label: "Medium", color: "text-[#F5B546]", bg: "bg-[#FEF6E7]" },
  low: { label: "Low", color: "text-[#676E85]", bg: "bg-neutral-100" },
};

const overviewStats = [
  { label: "Open Tickets", value: "12", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10", change: "+3 today" },
  { label: "Urgent", value: "4", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", change: "Needs attention" },
  { label: "Avg. Response", value: "2.4h", icon: Clock, color: "text-[#DEAB06]", bg: "bg-[#DEAB06]/10", change: "-18 min" },
  { label: "Resolved Today", value: "8", icon: CheckCircle2, color: "text-[#17A546]", bg: "bg-[#17A546]/10", change: "92% rate" },
];

export default function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState<"all" | TicketStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesTab = activeTab === "all" || ticket.status === activeTab;
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selected = tickets.find((t) => t.id === selectedTicket);

  return (
    <>
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">
            Support Center
          </h2>
          <p className="text-sm sm:text-base text-[#676E85] mt-1">
            Manage student inquiries and resolve issues efficiently.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {overviewStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-neutral-100 shadow-sm"
            >
              <div className={`${stat.bg} rounded-xl p-2 w-fit mb-3`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0A1B39]">
                {stat.value}
              </p>
              <p className="text-xs text-[#98A2B3] mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-[#17A546] font-medium mt-1">
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content — Ticket List + Detail */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="xl:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="p-4 sm:p-5 border-b border-neutral-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Status Tabs */}
                <div className="flex items-center bg-neutral-50 rounded-xl p-1 border border-neutral-100 overflow-x-auto">
                  {[
                    { key: "all" as const, label: "All" },
                    { key: "open" as const, label: "Open" },
                    { key: "in_progress" as const, label: "In Progress" },
                    { key: "resolved" as const, label: "Resolved" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap",
                        activeTab === tab.key
                          ? "bg-white text-[#0A1B39] shadow-sm"
                          : "text-[#98A2B3] hover:text-[#676E85]"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="flex-1 flex items-center gap-2 w-full sm:w-auto sm:justify-end">
                  <div className="flex items-center bg-neutral-50 rounded-xl px-3 py-2 gap-2 border border-neutral-100 focus-within:border-[#17A546]/30 transition-colors flex-1 sm:flex-initial sm:w-56">
                    <Search className="h-3.5 w-3.5 text-[#98A2B3]" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      className="bg-transparent text-xs outline-none w-full placeholder:text-[#98A2B3]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="h-9 w-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center hover:bg-neutral-100 transition-colors shrink-0">
                    <Filter className="h-3.5 w-3.5 text-[#676E85]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ticket List */}
            <div className="divide-y divide-neutral-100">
              {filteredTickets.map((ticket) => {
                const status = statusConfig[ticket.status];
                const priority = priorityConfig[ticket.priority];
                const isSelected = selectedTicket === ticket.id;

                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket.id)}
                    className={cn(
                      "w-full text-left px-4 sm:px-5 py-4 hover:bg-neutral-50/80 transition-colors group",
                      isSelected && "bg-[#17A546]/3 border-l-2 border-l-[#17A546]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0 mt-0.5">
                        <div className="h-9 w-9 rounded-full bg-[#030E36]/5 flex items-center justify-center text-[#030E36] font-bold text-[10px]">
                          {ticket.initials}
                        </div>
                        {ticket.status === "open" && ticket.replies === 0 && (
                          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#17A546] border-2 border-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-[#0A1B39] truncate">
                            {ticket.subject}
                          </p>
                        </div>
                        <p className="text-xs text-[#98A2B3] truncate">
                          {ticket.student} · {ticket.id}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.color} ${status.bg}`}
                          >
                            <status.icon className="h-2.5 w-2.5" />
                            {status.label}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priority.color} ${priority.bg}`}
                          >
                            {priority.label}
                          </span>
                          <span className="text-[10px] text-[#98A2B3]">
                            {ticket.createdAt}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-[#98A2B3] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredTickets.length === 0 && (
              <div className="text-center py-16">
                <Headphones className="h-10 w-10 text-[#98A2B3] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#0A1B39]">No tickets found</p>
                <p className="text-xs text-[#676E85] mt-1">
                  Try adjusting your filters.
                </p>
              </div>
            )}
          </div>

          {/* Ticket Detail Panel */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            {selected ? (
              <div className="h-full flex flex-col">
                {/* Detail Header */}
                <div className="p-5 border-b border-neutral-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#98A2B3]">
                      {selected.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${statusConfig[selected.status].color} ${statusConfig[selected.status].bg}`}
                    >
                      {statusConfig[selected.status].label}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0A1B39] leading-snug">
                    {selected.subject}
                  </h3>
                </div>

                {/* Student Info */}
                <div className="p-5 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#030E36]/5 flex items-center justify-center text-[#030E36] font-bold text-xs">
                      {selected.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0A1B39]">
                        {selected.student}
                      </p>
                      <p className="text-xs text-[#98A2B3]">{selected.email}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="p-5 flex-1">
                  <p className="text-xs font-semibold text-[#98A2B3] uppercase tracking-wider mb-2">
                    Message
                  </p>
                  <p className="text-sm text-[#676E85] leading-relaxed">
                    {selected.message}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                      <p className="text-[10px] text-[#98A2B3] font-medium">Category</p>
                      <p className="text-xs font-bold text-[#0A1B39] mt-0.5">
                        {selected.category}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                      <p className="text-[10px] text-[#98A2B3] font-medium">Priority</p>
                      <p className={`text-xs font-bold mt-0.5 ${priorityConfig[selected.priority].color}`}>
                        {priorityConfig[selected.priority].label}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                      <p className="text-[10px] text-[#98A2B3] font-medium">Replies</p>
                      <p className="text-xs font-bold text-[#0A1B39] mt-0.5">
                        {selected.replies}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                      <p className="text-[10px] text-[#98A2B3] font-medium">Last Reply</p>
                      <p className="text-xs font-bold text-[#0A1B39] mt-0.5">
                        {selected.lastReply}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 border-t border-neutral-100 space-y-2">
                  <button className="w-full h-10 rounded-xl bg-[#17A546] text-white text-sm font-semibold hover:bg-[#17A546]/90 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Reply to Student
                  </button>
                  <button className="w-full h-10 rounded-xl bg-neutral-50 text-[#0A1B39] text-sm font-medium border border-neutral-100 hover:bg-neutral-100 transition-colors">
                    Mark as Resolved
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                    <Headphones className="h-6 w-6 text-[#98A2B3]" />
                  </div>
                  <p className="text-sm font-semibold text-[#0A1B39]">
                    Select a ticket
                  </p>
                  <p className="text-xs text-[#676E85] mt-1">
                    Choose a ticket from the list to view details.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
