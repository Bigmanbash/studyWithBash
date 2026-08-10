"use client";

import { useState } from "react";
import { AdminDashboardHeader, AdminFilterBar } from "@/components/admin/dashboard";
import {
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Check,
  X,
  Banknote,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TierKey, TIERS } from "@/lib/tiers";
import { useAdminPayments, useUpdatePaymentStatus, AdminPaymentData } from "@/app/api/adminUser/payments/client";

type PaymentStatus = "pending" | "approved" | "rejected";

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

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
}

export default function AdminPaymentsPage() {
  const { data: paymentsList = [], isLoading } = useAdminPayments();
  const updateStatusMutation = useUpdatePaymentStatus();
  
  const [activeTab, setActiveTab] = useState<"all" | PaymentStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<AdminPaymentData | null>(null);

  const handleUpdatePaymentStatus = (id: string, newStatus: PaymentStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus as "approved" | "rejected" });
  };

  const filteredPayments = paymentsList.filter((payment) => {
    const matchesTab = activeTab === "all" || payment.status === activeTab;
    const searchString = `${payment.student?.name || ""} ${payment.id} ${payment.reference}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = paymentsList.filter((p) => p.status === "pending").length;
  const approvedCount = paymentsList.filter((p) => p.status === "approved").length;
  const rejectedCount = paymentsList.filter((p) => p.status === "rejected").length;
  const totalPending = paymentsList
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalRevenue = paymentsList
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.amount, 0);

  // If selected payment is not found in the list (or null), use the first one if available
  let selected = paymentsList.find((p) => p.id === selectedPaymentId) || null;
  if (!selected && paymentsList.length > 0) {
    selected = paymentsList[0];
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Unboxed Modern Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1B39]">
              Payments & Approvals
            </h1>
            <p className="text-xs sm:text-sm text-[#676E85] mt-1 font-normal">
              Review transaction receipts, approve bank transfers, and grant course access.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-neutral-200 text-[#0A1B39] rounded-md h-9 px-4 font-semibold text-xs w-fit hover:bg-neutral-50 shadow-2xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export Payments
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
              sub: `${formatAmount(totalPending)} total`,
            },
            {
              label: "Approved",
              value: approvedCount.toString(),
              icon: CheckCircle2,
              color: "text-[#0E7B33]",
              bg: "bg-[#0E7B33]/10",
              sub: "Verified access",
            },
            {
              label: "Rejected",
              value: rejectedCount.toString(),
              icon: XCircle,
              color: "text-[#940803]",
              bg: "bg-[#940803]/10",
              sub: "Decline notice",
            },
            {
              label: "Total Revenue",
              value: formatAmount(totalRevenue),
              icon: Banknote,
              color: "text-[#17A546]",
              bg: "bg-[#17A546]/10",
              sub: "All time approved",
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
            { key: "all", label: "All Payments", count: paymentsList.length },
            { key: "approved", label: "Approved", count: approvedCount },
            { key: "rejected", label: "Rejected", count: rejectedCount },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          searchQuery={searchQuery}
          onSearchChange={(val) => setSearchQuery(val)}
          searchPlaceholder="Search by name, ID, ref..."
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Payment Table */}
          <div className="lg:col-span-2 bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/60">
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Student
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3 hidden sm:table-cell">
                      Course
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-4 py-3">
                      Amount
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <Loader2 className="w-8 h-8 text-[#17A546] animate-spin mx-auto" />
                        <p className="text-sm font-semibold text-[#0A1B39] mt-3">Loading payments...</p>
                      </td>
                    </tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16">
                        <CreditCard className="h-10 w-10 text-[#98A2B3] mx-auto mb-3" />
                        <p className="text-sm font-semibold text-[#0A1B39]">
                          No payments found
                        </p>
                        <p className="text-xs text-[#676E85] mt-1">
                          Try adjusting your filter selection.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => {
                      const status = statusConfig[payment.status];
                      const isSelected = selected?.id === payment.id;
                      const tierKey = payment.tier as TierKey;
                      const hasTier = tierKey && TIERS[tierKey];
                      return (
                        <tr
                          key={payment.id}
                          className={cn(
                            "hover:bg-neutral-50/60 transition-colors cursor-pointer",
                            isSelected && "bg-[#17A546]/[0.04]"
                          )}
                          onClick={() => setSelectedPaymentId(payment.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-xs shrink-0">
                                {getInitials(payment.student?.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#0A1B39] truncate">
                                  {payment.student?.name || "Unknown"}
                                </p>
                                <p className="text-[10px] text-[#676E85] truncate">
                                  {payment.id.split("-")[0].substring(0,8)}...
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <p className="text-xs font-medium text-[#0A1B39]">{payment.course?.subject || "N/A"}</p>
                            <p className="text-[10px] text-[#676E85]">{payment.course?.level || "N/A"}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-[#0A1B39]">
                                {formatAmount(payment.amount)}
                              </p>
                              {hasTier && (
                                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md capitalize ${TIERS[tierKey].badgeBg} ${TIERS[tierKey].badgeText}`}>
                                  {TIERS[tierKey].label}
                                </span>
                              )}
                            </div>
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
                              {payment.status === "pending" && (
                                <>
                                  <button
                                    className="h-7 w-7 rounded-md bg-[#E7F6EC] flex items-center justify-center hover:bg-[#17A546]/20 transition-colors disabled:opacity-50"
                                    title="Approve Payment"
                                    disabled={updateStatusMutation.isPending}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdatePaymentStatus(payment.id, "approved");
                                    }}
                                  >
                                    <Check className="h-3.5 w-3.5 text-[#0E7B33]" />
                                  </button>
                                  <button
                                    className="h-7 w-7 rounded-md bg-[#FBEAE9] flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50"
                                    title="Reject Payment"
                                    disabled={updateStatusMutation.isPending}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdatePaymentStatus(payment.id, "rejected");
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
                                  setSelectedPaymentId(payment.id);
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

          {/* Payment Detail Inspector */}
          <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden p-5 flex flex-col justify-between space-y-4">
            {selected ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#98A2B3] block">{selected.id}</span>
                      <h3 className="text-sm font-bold text-[#0A1B39]">Payment Details</h3>
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", statusConfig[selected.status].bg, statusConfig[selected.status].color)}>
                      {statusConfig[selected.status].label}
                    </span>
                  </div>

                  {/* Student Info */}
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-md border border-neutral-200/60 mb-4">
                    <div className="h-9 w-9 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-xs shrink-0">
                      {getInitials(selected.student?.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0A1B39] truncate">{selected.student?.name || "Unknown"}</p>
                      <p className="text-[11px] text-[#676E85] truncate">{selected.student?.email || "N/A"}</p>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Course & Level:</span>
                      <span className="font-semibold text-[#0A1B39]">{selected.course?.subject || "N/A"} ({selected.course?.level || "N/A"})</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Amount Paid:</span>
                      <span className="font-bold text-[#17A546]">{formatAmount(selected.amount)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Payment Method:</span>
                      <span className="font-medium text-[#0A1B39] capitalize">{selected.method || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Transaction Ref:</span>
                      <span className="font-mono text-[#0A1B39]">{selected.reference || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-[#676E85]">Submitted Time:</span>
                      <span className="text-[#0A1B39]">{timeAgo(selected.submittedAt)}</span>
                    </div>
                    {/* New Affiliate Information Block */}
                    {selected.affiliate && (
                      <div className="flex justify-between py-1.5 bg-[#17A546]/5 px-2 rounded-md border border-[#17A546]/20 mt-2">
                        <span className="text-[#676E85] flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5 text-[#17A546]" /> Affiliate Link:</span>
                        <span className="font-bold text-[#0A1B39]">{selected.affiliate.code}</span>
                      </div>
                    )}
                  </div>

                  {/* Receipt Proof Attachment */}
                  {selected.proofUrl && (
                    <div className="mt-4 p-3 rounded-md bg-[#17A546]/5 border border-[#17A546]/20 text-center">
                      <p className="text-xs text-[#0A1B39] font-medium flex items-center justify-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#17A546]" /> Payment Receipt Attached
                      </p>
                      <button
                        onClick={() => setViewingReceipt(selected)}
                        className="text-xs font-bold text-[#17A546] hover:underline mt-1.5 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View Receipt Image
                      </button>
                    </div>
                  )}
                </div>

                {/* Approve / Reject Actions */}
                {selected.status === "pending" ? (
                  <div className="space-y-2 pt-2 border-t border-neutral-100">
                    <Button
                      onClick={() => handleUpdatePaymentStatus(selected.id, "approved")}
                      disabled={updateStatusMutation.isPending}
                      className="w-full h-9 rounded-md bg-[#17A546] hover:bg-[#128638] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                    >
                      {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Approve & Unlock Access
                    </Button>
                    <Button
                      onClick={() => handleUpdatePaymentStatus(selected.id, "rejected")}
                      disabled={updateStatusMutation.isPending}
                      variant="outline"
                      className="w-full h-9 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      Reject Payment Proof
                    </Button>
                  </div>
                ) : (
                  <div className={cn("p-2.5 rounded-md text-center text-xs font-semibold border", statusConfig[selected.status].bg, statusConfig[selected.status].color, statusConfig[selected.status].border)}>
                    Payment marked as {selected.status}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-[#676E85]">
                <CreditCard className="w-8 h-8 text-[#98A2B3] mx-auto mb-2" />
                <p className="text-xs font-medium">Select a payment from the table to inspect details.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Proof Preview Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1B39]/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 relative space-y-4">
            <button
              onClick={() => setViewingReceipt(null)}
              className="absolute top-4 right-4 text-[#676E85] hover:text-[#0A1B39] bg-neutral-100 rounded-full p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div>
              <h3 className="text-base font-bold text-[#0A1B39]">Payment Receipt Proof</h3>
              <p className="text-xs text-[#676E85] mt-0.5">Reference: {viewingReceipt.reference || "N/A"}</p>
            </div>

            {/* If it's a real URL, show an image, otherwise show simulated receipt block */}
            {viewingReceipt.proofUrl?.startsWith("http") ? (
              <div className="w-full aspect-auto max-h-[60vh] overflow-hidden rounded-md border border-neutral-200">
                <img src={viewingReceipt.proofUrl} alt="Receipt" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-md border border-neutral-200 space-y-3 text-xs font-mono text-[#0A1B39]">
                <div className="flex justify-between border-b border-neutral-200 pb-2 font-sans font-bold text-[#17A546]">
                  <span>OFFICIAL RECEIPT</span>
                  <span>{formatAmount(viewingReceipt.amount)}</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <p><span className="text-[#676E85]">Payer:</span> {viewingReceipt.student?.name || "Unknown"}</p>
                  <p><span className="text-[#676E85]">Email:</span> {viewingReceipt.student?.email || "Unknown"}</p>
                  <p><span className="text-[#676E85]">Bank:</span> Access Bank PLC</p>
                  <p><span className="text-[#676E85]">Account:</span> Bash Academy Course Fee</p>
                  <p><span className="text-[#676E85]">Ref:</span> {viewingReceipt.reference || "N/A"}</p>
                  <p><span className="text-[#676E85]">Status:</span> SUCCESSFUL</p>
                </div>
              </div>
            )}

            <Button
              onClick={() => setViewingReceipt(null)}
              className="w-full bg-[#17A546] hover:bg-[#128638] text-white rounded-md h-9 text-xs font-bold shadow-2xs"
            >
              Done Reviewing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
