"use client";

import { useState } from "react";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import {
  CreditCard,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  Eye,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Users,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PaymentStatus = "pending" | "approved" | "rejected";

interface Payment {
  id: string;
  student: string;
  initials: string;
  email: string;
  course: string;
  courseLevel: string;
  amount: string;
  rawAmount: number;
  method: string;
  reference: string;
  status: PaymentStatus;
  submittedAt: string;
  proofUploaded: boolean;
}

const payments: Payment[] = [
  {
    id: "PAY-4821",
    student: "Adaeze Okonkwo",
    initials: "AO",
    email: "adaeze@email.com",
    course: "Physics",
    courseLevel: "SS2",
    amount: "₦15,000",
    rawAmount: 15000,
    method: "Bank Transfer",
    reference: "TRF-789456123",
    status: "pending",
    submittedAt: "2 min ago",
    proofUploaded: true,
  },
  {
    id: "PAY-4820",
    student: "Tunde Bakare",
    initials: "TB",
    email: "tunde.b@email.com",
    course: "Mathematics",
    courseLevel: "SS3",
    amount: "₦15,000",
    rawAmount: 15000,
    method: "Bank Transfer",
    reference: "TRF-456789012",
    status: "pending",
    submittedAt: "15 min ago",
    proofUploaded: true,
  },
  {
    id: "PAY-4819",
    student: "Blessing Eze",
    initials: "BE",
    email: "blessing.e@email.com",
    course: "Chemistry",
    courseLevel: "SS1",
    amount: "₦12,000",
    rawAmount: 12000,
    method: "USSD",
    reference: "USR-321654987",
    status: "pending",
    submittedAt: "45 min ago",
    proofUploaded: false,
  },
  {
    id: "PAY-4818",
    student: "Emeka Nwosu",
    initials: "EN",
    email: "emeka.n@email.com",
    course: "Biology",
    courseLevel: "SS2",
    amount: "₦15,000",
    rawAmount: 15000,
    method: "Bank Transfer",
    reference: "TRF-654987321",
    status: "pending",
    submittedAt: "1 hour ago",
    proofUploaded: true,
  },
  {
    id: "PAY-4817",
    student: "Fatima Yusuf",
    initials: "FY",
    email: "fatima.y@email.com",
    course: "English",
    courseLevel: "SS3",
    amount: "₦10,000",
    rawAmount: 10000,
    method: "Card",
    reference: "CRD-147258369",
    status: "approved",
    submittedAt: "3 hours ago",
    proofUploaded: true,
  },
  {
    id: "PAY-4816",
    student: "Uche Okoro",
    initials: "UO",
    email: "uche.o@email.com",
    course: "Government",
    courseLevel: "SS2",
    amount: "₦12,000",
    rawAmount: 12000,
    method: "Bank Transfer",
    reference: "TRF-258369147",
    status: "approved",
    submittedAt: "5 hours ago",
    proofUploaded: true,
  },
  {
    id: "PAY-4815",
    student: "Ngozi Chukwu",
    initials: "NC",
    email: "ngozi.c@email.com",
    course: "Economics",
    courseLevel: "SS1",
    amount: "₦10,000",
    rawAmount: 10000,
    method: "Bank Transfer",
    reference: "TRF-963852741",
    status: "rejected",
    submittedAt: "1 day ago",
    proofUploaded: false,
  },
  {
    id: "PAY-4814",
    student: "Aisha Mohammed",
    initials: "AM",
    email: "aisha.m@email.com",
    course: "Literature",
    courseLevel: "SS3",
    amount: "₦12,000",
    rawAmount: 12000,
    method: "USSD",
    reference: "USR-741852963",
    status: "approved",
    submittedAt: "1 day ago",
    proofUploaded: true,
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-[#F5B546]",
    bg: "bg-[#FEF6E7]",
    border: "border-[#F5B546]/20",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "text-[#0E7B33]",
    bg: "bg-[#E7F6EC]",
    border: "border-[#0E7B33]/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-[#940803]",
    bg: "bg-[#FBEAE9]",
    border: "border-[#940803]/20",
  },
};

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<"all" | PaymentStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const filteredPayments = payments.filter((payment) => {
    const matchesTab = activeTab === "all" || payment.status === activeTab;
    const matchesSearch =
      payment.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const approvedCount = payments.filter((p) => p.status === "approved").length;
  const rejectedCount = payments.filter((p) => p.status === "rejected").length;
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.rawAmount, 0);

  const selected = payments.find((p) => p.id === selectedPayment);

  return (
    <>
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">
              Payment Approvals
            </h2>
            <p className="text-sm sm:text-base text-[#676E85] mt-1">
              Review and process student payment submissions.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-neutral-200 text-[#0A1B39] rounded-xl h-10 px-4 font-medium w-fit hover:bg-neutral-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Pending Review",
              value: pendingCount.toString(),
              icon: Clock,
              color: "text-[#F5B546]",
              bg: "bg-[#F5B546]/10",
              sub: `₦${(totalPending / 1000).toFixed(0)}K total`,
            },
            {
              label: "Approved Today",
              value: approvedCount.toString(),
              icon: CheckCircle2,
              color: "text-[#0E7B33]",
              bg: "bg-[#0E7B33]/10",
              sub: "+₦37K revenue",
            },
            {
              label: "Rejected",
              value: rejectedCount.toString(),
              icon: XCircle,
              color: "text-[#940803]",
              bg: "bg-[#940803]/10",
              sub: "1 this week",
            },
            {
              label: "Total Revenue",
              value: "₦4.2M",
              icon: Banknote,
              color: "text-[#17A546]",
              bg: "bg-[#17A546]/10",
              sub: "+23% this month",
            },
          ].map((stat) => (
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
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Payment List */}
          <div className="xl:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="p-4 sm:p-5 border-b border-neutral-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center bg-neutral-50 rounded-xl p-1 border border-neutral-100 overflow-x-auto">
                  {[
                    { key: "pending" as const, label: "Pending", count: pendingCount },
                    { key: "all" as const, label: "All", count: payments.length },
                    { key: "approved" as const, label: "Approved", count: approvedCount },
                    { key: "rejected" as const, label: "Rejected", count: rejectedCount },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap",
                        activeTab === tab.key
                          ? "bg-white text-[#0A1B39] shadow-sm"
                          : "text-[#98A2B3] hover:text-[#676E85]"
                      )}
                    >
                      {tab.label}
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                          activeTab === tab.key
                            ? "bg-[#17A546]/10 text-[#17A546]"
                            : "bg-neutral-100 text-[#98A2B3]"
                        )}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex items-center gap-2 w-full sm:w-auto sm:justify-end">
                  <div className="flex items-center bg-neutral-50 rounded-xl px-3 py-2 gap-2 border border-neutral-100 focus-within:border-[#17A546]/30 transition-colors flex-1 sm:flex-initial sm:w-56">
                    <Search className="h-3.5 w-3.5 text-[#98A2B3]" />
                    <input
                      type="text"
                      placeholder="Search by name, ID, ref..."
                      className="bg-transparent text-xs outline-none w-full placeholder:text-[#98A2B3]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="h-9 w-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center hover:bg-neutral-100 transition-colors flex-shrink-0">
                    <Filter className="h-3.5 w-3.5 text-[#676E85]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#98A2B3] px-5 py-3">
                      Student
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#98A2B3] px-5 py-3 hidden sm:table-cell">
                      Course
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#98A2B3] px-5 py-3">
                      Amount
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#98A2B3] px-5 py-3 hidden md:table-cell">
                      Method
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#98A2B3] px-5 py-3">
                      Status
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-wider font-semibold text-[#98A2B3] px-5 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredPayments.map((payment) => {
                    const status = statusConfig[payment.status];
                    return (
                      <tr
                        key={payment.id}
                        className={cn(
                          "hover:bg-neutral-50/50 transition-colors cursor-pointer",
                          selectedPayment === payment.id && "bg-[#17A546]/[0.02]"
                        )}
                        onClick={() => setSelectedPayment(payment.id)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-[#030E36]/5 flex items-center justify-center text-[#030E36] font-bold text-[10px] flex-shrink-0">
                              {payment.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#0A1B39] truncate">
                                {payment.student}
                              </p>
                              <p className="text-[10px] text-[#98A2B3] truncate">
                                {payment.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <p className="text-sm text-[#0A1B39]">{payment.course}</p>
                          <p className="text-[10px] text-[#98A2B3]">{payment.courseLevel}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-[#0A1B39]">
                            {payment.amount}
                          </p>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <p className="text-xs text-[#676E85]">{payment.method}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${status.color} ${status.bg}`}
                          >
                            <status.icon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            {payment.status === "pending" && (
                              <>
                                <button
                                  className="h-7 w-7 rounded-lg bg-[#E7F6EC] flex items-center justify-center hover:bg-[#17A546]/20 transition-colors"
                                  title="Approve"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Check className="h-3.5 w-3.5 text-[#0E7B33]" />
                                </button>
                                <button
                                  className="h-7 w-7 rounded-lg bg-[#FBEAE9] flex items-center justify-center hover:bg-red-100 transition-colors"
                                  title="Reject"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <X className="h-3.5 w-3.5 text-[#940803]" />
                                </button>
                              </>
                            )}
                            <button
                              className="h-7 w-7 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                              title="View"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPayment(payment.id);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5 text-[#676E85]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-16">
                <CreditCard className="h-10 w-10 text-[#98A2B3] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#0A1B39]">
                  No payments found
                </p>
                <p className="text-xs text-[#676E85] mt-1">
                  Try adjusting your filters.
                </p>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            {selected ? (
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-neutral-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-[#98A2B3]">
                      {selected.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${statusConfig[selected.status].color} ${statusConfig[selected.status].bg}`}
                    >
                      {statusConfig[selected.status].label}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0A1B39]">
                    Payment Details
                  </h3>
                </div>

                {/* Student Info */}
                <div className="p-5 border-b border-neutral-100">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-[#98A2B3] mb-3">
                    Student
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-[#030E36]/5 flex items-center justify-center text-[#030E36] font-bold text-xs">
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

                {/* Payment Info */}
                <div className="p-5 flex-1">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-[#98A2B3] mb-3">
                    Transaction
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Course", value: `${selected.course} (${selected.courseLevel})` },
                      { label: "Amount", value: selected.amount },
                      { label: "Method", value: selected.method },
                      { label: "Reference", value: selected.reference },
                      { label: "Submitted", value: selected.submittedAt },
                      {
                        label: "Proof",
                        value: selected.proofUploaded ? "Uploaded" : "Missing",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-3 rounded-xl bg-neutral-50 border border-neutral-100"
                      >
                        <p className="text-[10px] text-[#98A2B3] font-medium">
                          {item.label}
                        </p>
                        <p
                          className={cn(
                            "text-xs font-bold mt-0.5",
                            item.label === "Proof" && !selected.proofUploaded
                              ? "text-[#940803]"
                              : "text-[#0A1B39]"
                          )}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Proof Preview Placeholder */}
                  {selected.proofUploaded && (
                    <div className="mt-4 p-4 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-center">
                      <Receipt className="h-6 w-6 text-[#98A2B3] mx-auto mb-2" />
                      <p className="text-xs text-[#676E85]">Payment proof uploaded</p>
                      <button className="text-xs font-semibold text-[#17A546] mt-1 hover:underline flex items-center gap-1 mx-auto">
                        <Eye className="h-3 w-3" />
                        View Receipt
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selected.status === "pending" && (
                  <div className="p-5 border-t border-neutral-100 space-y-2">
                    <button className="w-full h-10 rounded-xl bg-[#17A546] text-white text-sm font-semibold hover:bg-[#17A546]/90 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Approve Payment
                    </button>
                    <button className="w-full h-10 rounded-xl bg-[#FBEAE9] text-[#940803] text-sm font-medium hover:bg-[#FBEAE9]/80 transition-colors flex items-center justify-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Reject Payment
                    </button>
                  </div>
                )}

                {selected.status !== "pending" && (
                  <div className="p-5 border-t border-neutral-100">
                    <div
                      className={`p-3 rounded-xl text-center ${statusConfig[selected.status].bg}`}
                    >
                      <p className={`text-xs font-semibold ${statusConfig[selected.status].color}`}>
                        This payment has been {selected.status}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-6 w-6 text-[#98A2B3]" />
                  </div>
                  <p className="text-sm font-semibold text-[#0A1B39]">
                    Select a payment
                  </p>
                  <p className="text-xs text-[#676E85] mt-1">
                    Choose a payment from the table to view details.
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
