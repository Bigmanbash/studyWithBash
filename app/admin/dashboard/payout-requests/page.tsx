"use client";

import { useState } from "react";
import { AdminDashboardHeader, AdminFilterBar } from "@/components/admin/dashboard";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Banknote,
  Send,
  X,
  CreditCard,
  Building2,
  Check,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function formatAmount(amountKobo: number): string {
  return `₦${(amountKobo / 100).toLocaleString()}`;
}

type PayoutStatus = "pending" | "approved" | "rejected";

interface PayoutRequest {
  id: string;
  affiliateName: string;
  affiliateCode: string;
  amount: number;
  status: PayoutStatus;
  requestedAt: string;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

const mockPayouts: PayoutRequest[] = [
  {
    id: "PAYOUT-001",
    affiliateName: "Chisom Okafor",
    affiliateCode: "BASH-C8F2",
    amount: 1500000, // ₦15,000
    status: "pending",
    requestedAt: "2026-08-07T10:30:00Z",
    bankInfo: {
      bankName: "Guaranty Trust Bank",
      accountNumber: "0123456789",
      accountName: "Chisom Okafor",
    }
  },
  {
    id: "PAYOUT-002",
    affiliateName: "Ademola Alabi",
    affiliateCode: "BASH-A9X1",
    amount: 3250000, // ₦32,500
    status: "pending",
    requestedAt: "2026-08-08T09:15:00Z",
    bankInfo: {
      bankName: "Access Bank PLC",
      accountNumber: "0987654321",
      accountName: "Ademola Alabi",
    }
  },
  {
    id: "PAYOUT-003",
    affiliateName: "Aisha Mohammed",
    affiliateCode: "BASH-M4B7",
    amount: 5000000, // ₦50,000
    status: "approved",
    requestedAt: "2026-08-05T14:20:00Z",
    bankInfo: {
      bankName: "Zenith Bank PLC",
      accountNumber: "0234567891",
      accountName: "Aisha Mohammed",
    }
  },
  {
    id: "PAYOUT-004",
    affiliateName: "Emeka Uzo",
    affiliateCode: "BASH-E1C3",
    amount: 1200000, // ₦12,000
    status: "rejected",
    requestedAt: "2026-08-06T11:45:00Z",
    bankInfo: {
      bankName: "First Bank",
      accountNumber: "3049586712",
      accountName: "Emeka Uzo",
    }
  }
];

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    color: "text-[#F5B546]",
    bg: "bg-[#FEF6E7]",
    border: "border-[#F5B546]/20",
  },
  approved: {
    label: "Funds Disbursed",
    icon: CheckCircle2,
    color: "text-[#0E7B33]",
    bg: "bg-[#E7F6EC]",
    border: "border-[#0E7B33]/20",
  },
  rejected: {
    label: "Declined",
    icon: XCircle,
    color: "text-[#940803]",
    bg: "bg-[#FBEAE9]",
    border: "border-[#940803]/20",
  },
};

function getInitials(name: string): string {
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

export default function AdminPayoutRequestsPage() {
  const [payoutsList, setPayoutsList] = useState<PayoutRequest[]>(mockPayouts);
  const [activeTab, setActiveTab] = useState<"all" | PayoutStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(mockPayouts[0].id);

  const filteredPayouts = payoutsList.filter((payout) => {
    const matchesTab = activeTab === "all" || payout.status === activeTab;
    const searchString = `${payout.affiliateName} ${payout.id} ${payout.bankInfo.bankName}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = payoutsList.filter((p) => p.status === "pending").length;
  const approvedCount = payoutsList.filter((p) => p.status === "approved").length;
  const totalPendingVal = payoutsList
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  let selected = payoutsList.find((p) => p.id === selectedPayoutId) || null;
  if (!selected && payoutsList.length > 0) {
    selected = payoutsList[0];
  }

  const handleUpdateStatus = (id: string, newStatus: PayoutStatus) => {
    setPayoutsList((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-7xl mx-auto">

        {/* Unboxed Modern Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1B39]">
              Payout Requests
            </h1>
            <p className="text-xs sm:text-sm text-[#676E85] mt-1 font-normal">
              Review and disburse earnings requested by Bash Academy Affiliates.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-neutral-200 text-[#0A1B39] rounded-md h-9 px-4 font-semibold text-xs w-fit hover:bg-neutral-50 shadow-2xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export Payouts
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Pending Requests",
              value: pendingCount.toString(),
              icon: Clock,
              color: "text-[#F5B546]",
              bg: "bg-[#F5B546]/10",
              sub: `${formatAmount(totalPendingVal)} to pay`,
            },
            {
              label: "Approved Disbursals",
              value: approvedCount.toString(),
              icon: CheckCircle2,
              color: "text-[#0E7B33]",
              bg: "bg-[#0E7B33]/10",
              sub: "Successfully processed",
            },
            {
              label: "Total Value Pending",
              value: formatAmount(totalPendingVal),
              icon: Banknote,
              color: "text-[#17A546]",
              bg: "bg-[#17A546]/10",
              sub: "Awaiting action",
            },
            {
              label: "Active Affiliates",
              value: "128",
              icon: Users,
              color: "text-[#3B82F6]",
              bg: "bg-[#3B82F6]/10",
              sub: "Eligible for payouts",
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
            { key: "pending", label: "Pending Review", count: pendingCount },
            { key: "all", label: "All Requests", count: payoutsList.length },
            { key: "approved", label: "Disbursed", count: approvedCount },
          ]}
          activeTab={activeTab}
          onTabChange={(tab: any) => setActiveTab(tab)}
          searchQuery={searchQuery}
          onSearchChange={(val) => setSearchQuery(val)}
          searchPlaceholder="Search by name, bank, ID..."
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Payouts Table */}
          <div className="lg:col-span-2 bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/60">
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Affiliate
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3 hidden sm:table-cell">
                      Amount
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Date
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Status
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredPayouts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16">
                        <Send className="h-10 w-10 text-[#98A2B3] mx-auto mb-3" />
                        <p className="text-sm font-semibold text-[#0A1B39]">
                          No payout requests found
                        </p>
                        <p className="text-xs text-[#676E85] mt-1">
                          Try adjusting your filter selection.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPayouts.map((payout) => {
                      const status = statusConfig[payout.status];
                      const isSelected = selected?.id === payout.id;
                      return (
                        <tr
                          key={payout.id}
                          className={cn(
                            "hover:bg-neutral-50/60 transition-colors cursor-pointer",
                            isSelected && "bg-[#17A546]/[0.04]"
                          )}
                          onClick={() => setSelectedPayoutId(payout.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-bold text-xs shrink-0">
                                {getInitials(payout.affiliateName)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#0A1B39] truncate">
                                  {payout.affiliateName}
                                </p>
                                <p className="text-[10px] text-[#676E85] truncate font-mono">
                                  {payout.affiliateCode}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <p className="text-xs font-bold text-[#17A546]">
                              {formatAmount(payout.amount)}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[11px] text-[#0A1B39]">{formatDate(payout.requestedAt).split(",")[0]}</p>
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
                            <div className="flex items-center justify-end gap-1">
                              {payout.status === "pending" && (
                                <>
                                  <button
                                    className="h-7 w-7 rounded-md bg-[#E7F6EC] flex items-center justify-center hover:bg-[#17A546]/20 transition-colors"
                                    title="Mark as Disbursed"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(payout.id, "approved");
                                    }}
                                  >
                                    <Check className="h-3.5 w-3.5 text-[#0E7B33]" />
                                  </button>
                                  <button
                                    className="h-7 w-7 rounded-md bg-[#FBEAE9] flex items-center justify-center hover:bg-red-100 transition-colors"
                                    title="Reject Request"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(payout.id, "rejected");
                                    }}
                                  >
                                    <X className="h-3.5 w-3.5 text-[#940803]" />
                                  </button>
                                </>
                              )}
                              <button
                                className="h-7 w-7 rounded-md bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 text-[#676E85] transition-colors"
                                title="View Details"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPayoutId(payout.id);
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

          {/* Request Detail Inspector */}
          <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden p-5 flex flex-col justify-between space-y-4">
            {selected ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#98A2B3] block">{selected.id}</span>
                      <h3 className="text-sm font-bold text-[#0A1B39]">Payout Details</h3>
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", (statusConfig[selected.status] || statusConfig.pending).bg, (statusConfig[selected.status] || statusConfig.pending).color)}>
                      {(statusConfig[selected.status] || statusConfig.pending).label}
                    </span>
                  </div>

                  {/* Affiliate Info */}
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-md border border-neutral-200/60 mb-4">
                    <div className="h-9 w-9 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-bold text-xs shrink-0">
                      {getInitials(selected.affiliateName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0A1B39] truncate">{selected.affiliateName}</p>
                      <p className="text-[11px] text-[#676E85] truncate font-mono">Ref: {selected.affiliateCode}</p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Requested Amount:</span>
                      <span className="font-bold text-[#17A546] text-sm">{formatAmount(selected.amount)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Requested On:</span>
                      <span className="font-medium text-[#0A1B39]">{formatDate(selected.requestedAt)}</span>
                    </div>
                  </div>

                  {/* Bank Account Information */}
                  <div className="mt-4 border border-neutral-200 rounded-md overflow-hidden">
                    <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-200">
                      <h4 className="text-[11px] font-bold text-[#0A1B39] uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#98A2B3]" /> Bank Details for Disbursal
                      </h4>
                    </div>
                    <div className="p-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#676E85]">Bank Name:</span>
                        <span className="font-semibold text-[#0A1B39]">{selected.bankInfo.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#676E85]">Account No:</span>
                        <span className="font-mono font-bold text-[#0A1B39]">{selected.bankInfo.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#676E85]">Account Name:</span>
                        <span className="font-medium text-[#0A1B39]">{selected.bankInfo.accountName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                {selected.status === "pending" ? (
                  <div className="space-y-2 pt-2 border-t border-neutral-100">
                    <Button
                      onClick={() => handleUpdateStatus(selected.id, "approved")}
                      className="w-full h-9 rounded-md bg-[#17A546] hover:bg-[#128638] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Send className="h-4 w-4" /> Mark as Disbursed
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(selected.id, "rejected")}
                      variant="outline"
                      className="w-full h-9 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4" /> Reject Request
                    </Button>
                  </div>
                ) : (
                  <div className={cn("p-2.5 rounded-md text-center text-xs font-semibold border", (statusConfig[selected.status] || statusConfig.pending).bg, (statusConfig[selected.status] || statusConfig.pending).color, (statusConfig[selected.status] || statusConfig.pending).border)}>
                    Request marked as {selected.status}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-[#676E85]">
                <CreditCard className="w-8 h-8 text-[#98A2B3] mx-auto mb-2" />
                <p className="text-xs font-medium">Select a request from the table to inspect details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
