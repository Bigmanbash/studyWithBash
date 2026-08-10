"use client";

import { useState } from "react";
import { AffiliateProfile, AffiliateStats, CommissionRecord } from "@/app/api/affiliates/interface";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Wallet,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Users,
  BookOpen,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Info,
  DollarSign,
  Eye,
  X,
  FileText,
} from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

interface AgentEarningsClientProps {
  affiliate: AffiliateProfile;
  stats: AffiliateStats;
  commissions: CommissionRecord[];
}

export function AgentEarningsClient({
  affiliate,
  stats,
  commissions,
}: AgentEarningsClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "referral" | "proxy" | "paid">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommission, setSelectedCommission] = useState<CommissionRecord | null>(null);

  const MINIMUM_WITHDRAWAL_KOBO = 500000; // ₦5,000 in kobo
  const pendingAmount = stats.pendingPayout || 0;
  const progressPercent = Math.min(100, Math.round((pendingAmount / MINIMUM_WITHDRAWAL_KOBO) * 100));
  const canWithdraw = pendingAmount >= MINIMUM_WITHDRAWAL_KOBO;

  // Filter commissions
  const filteredCommissions = commissions.filter((comm) => {
    // Type tab filter
    if (activeTab === "referral" && comm.type !== "referral") return false;
    if (activeTab === "proxy" && comm.type !== "proxy") return false;
    if (activeTab === "paid" && comm.status !== "paid") return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const studentName = comm.student?.name?.toLowerCase() || "";
      const studentEmail = comm.student?.email?.toLowerCase() || "";
      const courseTitle = comm.course?.title?.toLowerCase() || "";
      return studentName.includes(q) || studentEmail.includes(q) || courseTitle.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Responsive Referral Rate & Code Quick Info Banner */}
      <div className="bg-[#0A1B39] rounded-md p-5 sm:p-7 text-white relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 shadow-xs border border-[#0A1B39]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#17A546]/20 via-[#17A546]/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#17A546]/20 text-[#17A546] border border-[#17A546]/30">
              <Award className="w-3.5 h-3.5 shrink-0" /> Agent Rate: {affiliate.commissionRate}% Commission
            </span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
            Earnings Transparency & Payout Portal
          </h2>
          <p className="text-[#98A2B3] text-xs sm:text-sm leading-relaxed">
            Earn real-time rewards every time a student registers with your code or when you purchase course access codes in bulk.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-md p-3 sm:p-3.5 border border-white/10 flex items-center justify-between gap-3 shrink-0 w-full sm:w-auto min-w-0 sm:min-w-[280px]">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#98A2B3]">Your Referral Code</p>
            <p className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-[#17A546] mt-0.5 truncate">
              {affiliate.referralCode || "PENDING"}
            </p>
          </div>
          {affiliate.referralCode && (
            <CopyButton
              text={affiliate.referralCode}
              className="bg-[#17A546] text-white hover:bg-[#128a39] h-9 px-3 text-xs font-semibold rounded-md shadow-2xs shrink-0"
            />
          )}
        </div>
      </div>

      {/* Modern Responsive Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Available for Payout */}
        <div className="bg-white rounded-md p-4 sm:p-5 border border-neutral-200/80 shadow-2xs hover:border-[#17A546]/30 transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="bg-amber-500/10 rounded-md p-2 sm:p-2.5 border border-neutral-100 group-hover:scale-105 transition-transform duration-200">
              <CreditCard className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Unpaid Balance
            </span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1B39] tracking-tight">
            {formatCurrency(stats.pendingPayout)}
          </p>
          <p className="text-xs text-[#676E85] mt-1 font-medium">Available for Payout</p>
          <p className="text-[10px] sm:text-[11px] text-[#98A2B3] mt-0.5">Ready for next payout cycle</p>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-white rounded-md p-4 sm:p-5 border border-neutral-200/80 shadow-2xs hover:border-[#17A546]/30 transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="bg-[#17A546]/10 rounded-md p-2 sm:p-2.5 border border-neutral-100 group-hover:scale-105 transition-transform duration-200">
              <Wallet className="h-4 sm:h-5 w-4 sm:w-5 text-[#17A546]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#17A546]/10 text-[#17A546] border border-[#17A546]/20">
              Lifetime Total
            </span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#17A546] tracking-tight">
            {formatCurrency(stats.totalEarned)}
          </p>
          <p className="text-xs text-[#676E85] mt-1 font-medium">Total Earned</p>
          <p className="text-[10px] sm:text-[11px] text-[#98A2B3] mt-0.5">Accumulated commissions</p>
        </div>

        {/* Direct Referral Commissions */}
        <div className="bg-white rounded-md p-4 sm:p-5 border border-neutral-200/80 shadow-2xs hover:border-[#17A546]/30 transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="bg-blue-500/10 rounded-md p-2 sm:p-2.5 border border-neutral-100 group-hover:scale-105 transition-transform duration-200">
              <Users className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
              Direct Referral
            </span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1B39] tracking-tight">
            {stats.referralCount} <span className="text-xs font-normal text-[#676E85]">sales</span>
          </p>
          <p className="text-xs text-[#676E85] mt-1 font-medium">Referral Commissions</p>
          <p className="text-[10px] sm:text-[11px] text-[#98A2B3] mt-0.5">{stats.studentsReferred} students registered</p>
        </div>

        {/* Proxy Purchases */}
        <div className="bg-white rounded-md p-4 sm:p-5 border border-neutral-200/80 shadow-2xs hover:border-[#17A546]/30 transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="bg-purple-500/10 rounded-md p-2 sm:p-2.5 border border-neutral-100 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200">
              Proxy Purchase
            </span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1B39] tracking-tight">
            {stats.proxyCount} <span className="text-xs font-normal text-[#676E85]">orders</span>
          </p>
          <p className="text-xs text-[#676E85] mt-1 font-medium">Bulk Access Codes</p>
          <p className="text-[10px] sm:text-[11px] text-[#98A2B3] mt-0.5">{stats.coursesSold} total course access</p>
        </div>
      </div>

      {/* Payout Threshold & Guidelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal Progress Card */}
        <div className="lg:col-span-2 bg-white rounded-md p-5 sm:p-6 border border-neutral-200/80 shadow-2xs space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0A1B39]">Payout Request Status</h3>
              <p className="text-xs text-[#676E85] mt-0.5">
                Minimum withdrawal threshold is {formatCurrency(MINIMUM_WITHDRAWAL_KOBO)}.
              </p>
            </div>
            {canWithdraw ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-[#17A546]/10 text-[#17A546] border border-[#17A546]/20 w-fit">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Eligible for Payout
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 w-fit">
                <Clock className="w-4 h-4 shrink-0" /> Threshold Not Reached
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#0A1B39]">Current Pending: {formatCurrency(pendingAmount)}</span>
              <span className="text-[#17A546]">{progressPercent}% of {formatCurrency(MINIMUM_WITHDRAWAL_KOBO)}</span>
            </div>
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200/60">
              <div
                className="h-full bg-gradient-to-r from-[#17A546] to-[#0E7B33] rounded-full transition-all duration-500 shadow-2xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs text-[#676E85] space-y-1">
              {canWithdraw ? (
                <p className="text-[#17A546] font-semibold">
                  You have reached the payout threshold! You can submit a withdrawal request below.
                </p>
              ) : (
                <p>
                  You need <strong className="text-[#0A1B39]">{formatCurrency(MINIMUM_WITHDRAWAL_KOBO - pendingAmount)}</strong> more in earnings to unlock withdrawal requests.
                </p>
              )}
            </div>

            <button
              disabled={!canWithdraw}
              className={cn(
                "py-2.5 px-5 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs shrink-0 w-full sm:w-auto",
                canWithdraw
                  ? "bg-[#17A546] hover:bg-[#128a39] text-white cursor-pointer active:scale-95"
                  : "bg-neutral-100 text-neutral-400 border border-neutral-200/80 cursor-not-allowed"
              )}
            >
              <span>Request Payout</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Transparency & Settlement Policy */}
        <div className="bg-white rounded-md p-5 sm:p-6 border border-neutral-200/80 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-[#0A1B39] uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-[#17A546] shrink-0" /> Settlement Policy
          </h3>

          <div className="space-y-3 text-xs text-[#676E85]">
            <div className="p-3 bg-neutral-50 rounded-md border border-neutral-100 space-y-1">
              <p className="font-semibold text-[#0A1B39]">1. Automatic Crediting</p>
              <p className="text-[11px] leading-relaxed">
                Commissions are automatically credited to your pending account immediately after student purchase completion.
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-md border border-neutral-100 space-y-1">
              <p className="font-semibold text-[#0A1B39]">2. Weekly Settlement</p>
              <p className="text-[11px] leading-relaxed">
                Approved payout requests are processed every Friday directly to your registered bank account details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Audit & History Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0A1B39]">Commission Audit Log</h3>
            <p className="text-xs text-[#676E85] mt-0.5">
              Complete transparent records of every referral and proxy purchase.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#98A2B3]" />
              <input
                type="text"
                placeholder="Search student or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200/80 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#17A546] text-[#0A1B39]"
              />
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 border-b border-neutral-200/80 pb-3 overflow-x-auto">
          {[
            { key: "all", label: `All (${commissions.length})` },
            { key: "referral", label: `Direct Referrals (${stats.referralCount})` },
            { key: "proxy", label: `Proxy Purchases (${stats.proxyCount})` },
            { key: "paid", label: "Settled Payouts" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0",
                activeTab === tab.key
                  ? "bg-[#17A546] text-white shadow-2xs"
                  : "text-[#676E85] hover:bg-neutral-100 hover:text-[#0A1B39]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden">
          {filteredCommissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-3">
                <AlertCircle className="h-6 w-6 text-[#98A2B3]" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-[#0A1B39]">No commissions found</h3>
              <p className="text-xs text-[#676E85] mt-1">
                No transaction records match your selected filter or search query.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-neutral-50/60 border-b border-neutral-200/80">
                    <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                      Date & Time
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                      Type
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                      Student
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                      Course
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                      Sale Amount
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                      Your Commission
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                      Status
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredCommissions.map((comm) => (
                    <tr key={comm.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-3.5 sm:px-5 py-3 sm:py-3.5 whitespace-nowrap">
                        <p className="text-xs font-semibold text-[#0A1B39]">
                          {new Date(comm.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-[#98A2B3]">
                          {new Date(comm.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </td>
                      <td className="px-3.5 sm:px-5 py-3 sm:py-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border whitespace-nowrap",
                            comm.type === "referral"
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : "bg-purple-50 border-purple-200 text-purple-600"
                          )}
                        >
                          {comm.type === "referral" ? "Direct Referral" : "Proxy Purchase"}
                        </span>
                      </td>
                      <td className="px-3.5 sm:px-5 py-3 sm:py-3.5 max-w-[120px] sm:max-w-[170px]">
                        <p className="text-xs font-semibold text-[#0A1B39] truncate" title={comm.student?.name || ""}>
                          {comm.student?.name || "Student"}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-[#676E85] truncate" title={comm.student?.email || ""}>
                          {comm.student?.email || "N/A"}
                        </p>
                      </td>
                      <td className="px-3.5 sm:px-5 py-3 sm:py-3.5 max-w-[120px] sm:max-w-[170px]">
                        <p className="text-xs font-medium text-[#0A1B39] truncate" title={comm.course?.title || ""}>
                          {comm.course?.title || "Course"}
                        </p>
                        <p className="text-[10px] font-semibold text-[#676E85] uppercase truncate">
                          {comm.course?.subject || "Subject"}
                        </p>
                      </td>
                      <td className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-xs font-semibold text-[#0A1B39] whitespace-nowrap">
                        {formatCurrency(comm.saleAmount)}
                      </td>
                      <td className="px-3.5 sm:px-5 py-3 sm:py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[#17A546]">
                            +{formatCurrency(comm.commissionAmount)}
                          </p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#17A546]/10 text-[#17A546]">
                            {affiliate.commissionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3.5 sm:px-5 py-3 sm:py-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border whitespace-nowrap",
                            comm.status === "paid"
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : comm.status === "credited"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-amber-50 border-amber-200 text-amber-600"
                          )}
                        >
                          {comm.status === "credited" ? "Credited (Pending)" : comm.status}
                        </span>
                      </td>
                      <td className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCommission(comm)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md text-[#0A1B39] bg-neutral-100 hover:bg-neutral-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#676E85]" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Commission Audit Detail View Modal */}
      {selectedCommission && (
        <CommissionDetailModal
          commission={selectedCommission}
          rate={affiliate.commissionRate}
          onClose={() => setSelectedCommission(null)}
        />
      )}
    </div>
  );
}

function CommissionDetailModal({
  commission,
  rate,
  onClose,
}: {
  commission: CommissionRecord;
  rate: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1B39]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-neutral-100 flex items-start justify-between relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#676E85] hover:text-[#0A1B39] bg-neutral-100 rounded-full p-1 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3.5 min-w-0 pr-8">
            <div className="h-10 w-10 rounded-md bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold shrink-0 border border-[#17A546]/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A1B39]">
                Commission Claim Details
              </h3>
              <p className="text-xs text-[#676E85] font-mono mt-0.5 truncate max-w-[240px]">
                ID: {commission.id}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Summary Stat Card */}
          <div className="bg-neutral-50/80 rounded-md p-4 border border-neutral-200/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#676E85]">
                Commission Earned
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#17A546] mt-0.5">
                +{formatCurrency(commission.commissionAmount)}
              </p>
            </div>
            <div className="text-right">
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                  commission.status === "paid"
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : commission.status === "credited"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-amber-50 border-amber-200 text-amber-600"
                )}
              >
                {commission.status === "credited" ? "Credited (Pending)" : commission.status}
              </span>
              <p className="text-[11px] text-[#676E85] font-medium mt-1">
                Rate: {rate}%
              </p>
            </div>
          </div>

          {/* Transaction & Sale Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[#0A1B39] uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#17A546]" /> Sale Information
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-md border border-neutral-200/80">
              <div>
                <p className="text-[#676E85] font-medium text-[11px]">Transaction Type</p>
                <p className="font-semibold text-[#0A1B39] capitalize mt-0.5">
                  {commission.type === "referral" ? "Direct Referral" : "Proxy Purchase"}
                </p>
              </div>

              <div>
                <p className="text-[#676E85] font-medium text-[11px]">Total Sale Amount</p>
                <p className="font-bold text-[#0A1B39] mt-0.5">
                  {formatCurrency(commission.saleAmount)}
                </p>
              </div>

              <div>
                <p className="text-[#676E85] font-medium text-[11px]">Payment Reference</p>
                <p className="font-mono text-[11px] font-semibold text-[#0A1B39] truncate mt-0.5" title={commission.paymentId}>
                  {commission.paymentId || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[#676E85] font-medium text-[11px]">Date & Time</p>
                <p className="font-semibold text-[#0A1B39] mt-0.5">
                  {new Date(commission.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Student & Course Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[#0A1B39] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#17A546]" /> Student & Course Details
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-neutral-50/70 rounded-md border border-neutral-200/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#98A2B3]">Student Name</p>
                  <p className="font-bold text-[#0A1B39] mt-0.5">{commission.student?.name || "Student"}</p>
                  <p className="text-[11px] text-[#676E85]">{commission.student?.email || "N/A"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-[#98A2B3]">Student ID</p>
                  <p className="font-mono text-[11px] text-[#676E85] mt-0.5 max-w-[100px] truncate">{commission.studentId || "N/A"}</p>
                </div>
              </div>

              <div className="p-3 bg-neutral-50/70 rounded-md border border-neutral-200/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#98A2B3]">Purchased Course</p>
                  <p className="font-bold text-[#0A1B39] mt-0.5">{commission.course?.title || "Course"}</p>
                  <p className="text-[11px] text-[#676E85] uppercase">{commission.course?.subject || "Subject"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-[#98A2B3]">Course ID</p>
                  <p className="font-mono text-[11px] text-[#676E85] mt-0.5 max-w-[100px] truncate">{commission.courseId || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settlement Details if Paid */}
          {commission.status === "paid" && commission.paidAt && (
            <div className="p-3 bg-blue-50/80 rounded-md border border-blue-100 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-blue-900">Payout Settled</p>
                <p className="text-[11px] text-blue-700">Transferred to your bank account.</p>
              </div>
              <p className="font-semibold text-blue-900">
                {new Date(commission.paidAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-3">
          <CopyButton
            text={commission.id}
            className="bg-white border border-neutral-200 text-[#0A1B39] hover:bg-neutral-100 h-8 px-3 text-xs font-semibold rounded-md shadow-2xs"
          />
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white rounded-md text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
