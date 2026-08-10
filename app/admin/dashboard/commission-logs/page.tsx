"use client";

import { useState } from "react";
import { AdminDashboardHeader, AdminFilterBar } from "@/components/admin/dashboard";
import {
  Clock,
  CheckCircle2,
  Download,
  Eye,
  Banknote,
  Users,
  Briefcase,
  X,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAdminCommissions, AdminCommissionData } from "@/app/api/adminUser/commissions/client";

function formatAmount(amountKobo: number): string {
  return `₦${(amountKobo / 100).toLocaleString()}`;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "UK";
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-[#F5B546]",
    bg: "bg-[#FEF6E7]",
    border: "border-[#F5B546]/20",
  },
  credited: {
    label: "Credited",
    icon: CheckCircle2,
    color: "text-[#3B82F6]",
    bg: "bg-[#3B82F6]/10",
    border: "border-[#3B82F6]/20",
  },
  paid: {
    label: "Paid Out",
    icon: CheckCircle2,
    color: "text-[#0E7B33]",
    bg: "bg-[#E7F6EC]",
    border: "border-[#0E7B33]/20",
  }
};

export default function AdminCommissionLogsPage() {
  const { data: commissionsList = [], isLoading } = useAdminCommissions();
  
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "paid">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommissionId, setSelectedCommissionId] = useState<string | null>(null);

  const filteredCommissions = commissionsList.filter((comm) => {
    const matchesTab = activeTab === "all" || comm.status === activeTab;
    const searchString = `${comm.affiliate?.user?.name || ""} ${comm.student?.name || ""} ${comm.id}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = commissionsList.filter((c) => c.status === "pending").length;
  const paidCount = commissionsList.filter((c) => c.status === "paid").length;
  const totalPendingVal = commissionsList
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);
  const totalPaidVal = commissionsList
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);

  let selected = commissionsList.find((c) => c.id === selectedCommissionId) || null;
  if (!selected && commissionsList.length > 0) {
    selected = commissionsList[0];
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Unboxed Modern Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1B39]">
              Commission Audit Log
            </h1>
            <p className="text-xs sm:text-sm text-[#676E85] mt-1 font-normal">
              Monitor affiliate earnings, track referrals, and verify generated commissions.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-neutral-200 text-[#0A1B39] rounded-md h-9 px-4 font-semibold text-xs w-fit hover:bg-neutral-50 shadow-2xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export Logs
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Commissions",
              value: commissionsList.length.toString(),
              icon: Briefcase,
              color: "text-[#3B82F6]",
              bg: "bg-[#3B82F6]/10",
              sub: "All time records",
            },
            {
              label: "Unpaid Pending",
              value: pendingCount.toString(),
              icon: Clock,
              color: "text-[#F5B546]",
              bg: "bg-[#F5B546]/10",
              sub: `${formatAmount(totalPendingVal)} total`,
            },
            {
              label: "Successfully Paid",
              value: paidCount.toString(),
              icon: CheckCircle2,
              color: "text-[#0E7B33]",
              bg: "bg-[#0E7B33]/10",
              sub: `${formatAmount(totalPaidVal)} total`,
            },
            {
              label: "Total Commission Value",
              value: formatAmount(totalPaidVal + totalPendingVal),
              icon: Banknote,
              color: "text-[#17A546]",
              bg: "bg-[#17A546]/10",
              sub: "Cumulative value",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-md p-4 border border-neutral-200/80 shadow-2xs"
            >
              <div className={`${stat.bg} rounded-md p-2 w-fit mb-2.5 border border-neutral-100`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0A1B39]">
                {stat.value}
              </p>
              <p className="text-xs text-[#676E85] font-medium mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-[#17A546] font-semibold mt-1">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Unified Filter & Search Bar */}
        <AdminFilterBar
          tabs={[
            { key: "all", label: "All Commissions", count: commissionsList.length },
            { key: "pending", label: "Pending (Unpaid)", count: pendingCount },
            { key: "paid", label: "Paid Out", count: paidCount },
          ]}
          activeTab={activeTab}
          onTabChange={(tab: any) => setActiveTab(tab)}
          searchQuery={searchQuery}
          onSearchChange={(val) => setSearchQuery(val)}
          searchPlaceholder="Search by affiliate, student..."
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Commissions Table */}
          <div className="lg:col-span-2 bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/60">
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Affiliate
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3 hidden sm:table-cell">
                      Student
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Amount
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Status
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <Loader2 className="w-8 h-8 text-[#17A546] animate-spin mx-auto" />
                        <p className="text-sm font-semibold text-[#0A1B39] mt-3">Loading commissions...</p>
                      </td>
                    </tr>
                  ) : filteredCommissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16">
                        <Banknote className="h-10 w-10 text-[#98A2B3] mx-auto mb-3" />
                        <p className="text-sm font-semibold text-[#0A1B39]">
                          No commissions found
                        </p>
                        <p className="text-xs text-[#676E85] mt-1">
                          Try adjusting your filter selection.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredCommissions.map((comm) => {
                      const status = statusConfig[comm.status] || statusConfig.pending;
                      const isSelected = selected?.id === comm.id;
                      return (
                        <tr
                          key={comm.id}
                          className={cn(
                            "hover:bg-neutral-50/60 transition-colors cursor-pointer",
                            isSelected && "bg-[#17A546]/[0.04]"
                          )}
                          onClick={() => setSelectedCommissionId(comm.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-bold text-xs shrink-0">
                                {getInitials(comm.affiliate?.user?.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#0A1B39] truncate">
                                  {comm.affiliate?.user?.name || "Unknown Affiliate"}
                                </p>
                                <p className="text-[10px] text-[#676E85] truncate font-mono">
                                  {comm.affiliate?.code}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <p className="text-xs font-medium text-[#0A1B39] truncate max-w-[120px]">{comm.student?.name || "N/A"}</p>
                            <p className="text-[10px] text-[#676E85] truncate max-w-[120px]">{comm.course?.subject || "N/A"}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs font-bold text-[#17A546]">
                              {formatAmount(comm.amount)}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${status.color} ${status.bg} border ${status.border}`}
                            >
                              <status.icon className="h-3 w-3" />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end">
                              <button
                                className="h-7 w-7 rounded-md bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 text-[#676E85] transition-colors"
                                title="View Details"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCommissionId(comm.id);
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commission Detail Inspector */}
          <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden p-5 flex flex-col justify-between space-y-4">
            {selected ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#98A2B3] block">{selected.id.split("-")[0].toUpperCase()}</span>
                      <h3 className="text-sm font-bold text-[#0A1B39]">Commission Details</h3>
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", (statusConfig[selected.status] || statusConfig.pending).bg, (statusConfig[selected.status] || statusConfig.pending).color)}>
                      {(statusConfig[selected.status] || statusConfig.pending).label}
                    </span>
                  </div>

                  {/* Affiliate Info */}
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-md border border-neutral-200/60 mb-4">
                    <div className="h-9 w-9 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-bold text-xs shrink-0">
                      {getInitials(selected.affiliate?.user?.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0A1B39] truncate">{selected.affiliate?.user?.name || "Unknown Affiliate"}</p>
                      <p className="text-[11px] text-[#676E85] truncate font-mono">Ref: {selected.affiliate?.code}</p>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Student Enrolled:</span>
                      <span className="font-semibold text-[#0A1B39]">{selected.student?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Course Enrolled:</span>
                      <span className="font-medium text-[#0A1B39]">{selected.course?.subject || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Commission Earned:</span>
                      <span className="font-bold text-[#17A546]">{formatAmount(selected.amount)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Original Payment:</span>
                      <span className="font-medium text-[#0A1B39]">{selected.payment ? formatAmount(selected.payment.amount) : "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Commission Type:</span>
                      <span className="font-medium text-[#0A1B39] capitalize">{selected.type}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#676E85]">Generated Time:</span>
                      <span className="text-[#0A1B39]">{formatDate(selected.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 text-center">
                  <p className="text-[10px] text-[#98A2B3]">
                    {selected.status === "pending" 
                      ? "This commission is currently pending payout to the affiliate." 
                      : "This commission has been cleared and paid to the affiliate."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-[#676E85]">
                <Banknote className="w-8 h-8 text-[#98A2B3] mx-auto mb-2" />
                <p className="text-xs font-medium">Select a log from the table to inspect details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
