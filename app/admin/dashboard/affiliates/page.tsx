"use client";

import { useState, useEffect } from "react";
import { AdminDashboardHeader, AdminFilterBar } from "@/components/admin/dashboard";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Download,
  Users,
  Calendar,
  Wallet,
  Loader2,
  Clock,
  Eye,
  X,
  Edit2,
  Check,
  Mail,
  Phone,
  Building2,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAffiliates, fetchAffiliateStats, updateAffiliateStatus, updateAffiliateDetails } from "@/app/api/affiliates/client";
import { Pagination } from "@/components/ui/pagination";

type AffiliateStatusTab = "all" | "approved" | "pending" | "rejected";

const statusConfig = {
  approved: {
    label: "Approved",
    color: "text-[#0E7B33]",
    bg: "bg-[#E7F6EC]",
    border: "border-[#0E7B33]/20",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    color: "text-[#F59E0B]",
    bg: "bg-[#FEF3C7]",
    border: "border-[#F59E0B]/20",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    color: "text-[#DC2626]",
    bg: "bg-[#FEE2E2]",
    border: "border-[#DC2626]/20",
    icon: XCircle,
  },
  suspended: {
    label: "Suspended",
    color: "text-[#DC2626]",
    bg: "bg-[#FEE2E2]",
    border: "border-[#DC2626]/20",
    icon: XCircle,
  },
};

export default function AdminAffiliatesPage() {
  const [activeTab, setActiveTab] = useState<AffiliateStatusTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAffiliate, setSelectedAffiliate] = useState<any | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: statsData } = useQuery({
    queryKey: ["admin-affiliates-stats"],
    queryFn: fetchAffiliateStats,
  });

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["admin-affiliates", page, debouncedSearch, activeTab],
    queryFn: () => fetchAffiliates({ page, limit: 10, search: debouncedSearch || undefined, status: activeTab }),
  });

  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" | "suspend" | "reactivate" }) =>
      updateAffiliateStatus(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates-stats"] });
    },
  });

  const affiliates = queryData?.data || [];
  const totalCount = queryData?.total || 0;
  const totalPages = queryData ? Math.ceil(queryData.total / queryData.limit) : 1;
  const stats = statsData?.stats || queryData?.stats;

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-7xl mx-auto">
        {/* Unboxed Modern Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1B39]">
              Teacher / Agent Management
            </h1>
            <p className="text-xs sm:text-sm text-[#676E85] mt-1 font-normal">
              Manage agent applications, view referral stats, and approve new teachers.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-neutral-200 text-[#0A1B39] rounded-md h-9 px-4 font-semibold text-xs w-fit hover:bg-neutral-50 shadow-2xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export List
          </Button>
        </div>

        {/* Global Analytics Cards Matching Main Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {[
            {
              label: "Total Agents",
              value: (stats?.totalAffiliates ?? 0).toLocaleString(),
              icon: ShieldCheck,
              color: "text-[#17A546]",
              bg: "bg-[#17A546]/10",
              period: "All applications",
            },
            {
              label: "Active Agents",
              value: (stats?.approvedAffiliates ?? 0).toLocaleString(),
              icon: CheckCircle2,
              color: "text-[#0E7B33]",
              bg: "bg-[#0E7B33]/10",
              period: "Approved & active",
            },
            {
              label: "Pending Approvals",
              value: (stats?.pendingApplications ?? 0).toLocaleString(),
              icon: Clock,
              color: "text-[#F59E0B]",
              bg: "bg-[#F59E0B]/10",
              period: "Awaiting review",
            },
            {
              label: "Total Paid Out",
              value: `₦${((stats?.totalCommissionsPaid ?? 0) / 100).toLocaleString()}`,
              icon: Wallet,
              color: "text-blue-600",
              bg: "bg-blue-500/10",
              period: "Settled commissions",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-md p-5 border border-neutral-200/80 shadow-xs hover:border-[#17A546]/30 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bg} rounded-md p-2.5 border border-neutral-100 group-hover:scale-105 transition-transform duration-200`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {/* Placeholder trend badge to match AdminStatsCards */}
                <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md text-[#676E85] bg-neutral-100">
                  <span className="opacity-70">—</span>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">
                {stat.value}
              </p>
              <p className="text-xs text-[#676E85] mt-1 font-medium">{stat.label}</p>
              <p className="text-[11px] text-[#98A2B3] mt-0.5">{stat.period}</p>
            </div>
          ))}
        </div>

        {/* Unified Filter & Search Bar */}
        <AdminFilterBar
          tabs={[
            { key: "all", label: "All Agents" },
            { key: "approved", label: "Approved" },
            { key: "pending", label: "Pending" },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab as AffiliateStatusTab);
            setPage(1);
          }}
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
          searchPlaceholder="Search by name, email, referral code..."
        />

        {/* Table Container */}
        <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#676E85]">
              <Loader2 className="w-8 h-8 animate-spin text-[#17A546] mb-2" />
              <p className="text-xs font-semibold">Loading affiliates...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/60">
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Agent Details
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3 hidden sm:table-cell">
                      Referral Code
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3 hidden md:table-cell">
                      Earned / Pending
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Status
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {affiliates.map((agent: any) => {
                    const status = statusConfig[agent.status as keyof typeof statusConfig] || statusConfig.pending;
                    const initials = agent.user?.name
                      ? agent.user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
                      : "AG";
                    return (
                      <tr
                        key={agent.id}
                        className="hover:bg-neutral-50/60 transition-colors group cursor-pointer"
                        onClick={() => setSelectedAffiliate(agent)}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-xs shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#0A1B39] truncate">
                                {agent.user?.name || "Agent"}
                              </p>
                              <p className="text-[11px] text-[#676E85] truncate">
                                {agent.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <span className="text-xs font-mono font-bold text-[#0A1B39] bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                            {agent.referralCode || "N/A"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <div className="flex flex-col text-xs">
                            <span className="font-bold text-[#0A1B39]">
                              ₦{(agent.totalEarned / 100).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-[#676E85]">
                              Pending: ₦{(agent.pendingPayout / 100).toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border",
                              status.color,
                              status.bg,
                              status.border
                            )}
                          >
                            <status.icon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedAffiliate(agent)}
                              className="text-xs font-medium px-2.5 py-1 rounded-md transition-colors text-[#0A1B39] bg-neutral-100 hover:bg-neutral-200 inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>

                            {agent.status === "pending" && (
                              <button
                                onClick={() => actionMutation.mutate({ id: agent.id, action: "approve" })}
                                disabled={actionMutation.isPending}
                                className="text-xs font-medium px-2.5 py-1 rounded-md transition-colors text-white bg-[#17A546] hover:bg-[#128a39] disabled:opacity-50"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && affiliates.length === 0 && (
            <div className="text-center py-16">
              <ShieldCheck className="h-10 w-10 text-[#98A2B3] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#0A1B39]">
                No agents match your criteria
              </p>
              <p className="text-xs text-[#676E85] mt-1">
                Try adjusting your search query or status filter.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-neutral-100 flex items-center justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* Affiliate View & Edit Details Modal */}
      {selectedAffiliate && (
        <AffiliateDetailModal
          affiliate={selectedAffiliate}
          onClose={() => setSelectedAffiliate(null)}
          onStatusChange={(id, action) => actionMutation.mutate({ id, action })}
        />
      )}
    </div>
  );
}

function AffiliateDetailModal({
  affiliate,
  onClose,
  onStatusChange,
}: {
  affiliate: any;
  onClose: () => void;
  onStatusChange: (id: string, action: "approve" | "reject" | "suspend" | "reactivate") => void;
}) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [commissionRate, setCommissionRateState] = useState<number>(affiliate.commissionRate);
  const [schoolName, setSchoolName] = useState<string>(affiliate.schoolName || "");
  const [estimatedStudents, setEstimatedStudents] = useState<number>(affiliate.estimatedStudents || 0);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateAffiliateDetails(affiliate.id, {
        commissionRate,
        schoolName,
        estimatedStudents,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      setIsEditing(false);
    },
  });

  const status = statusConfig[affiliate.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1B39]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative space-y-5">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-neutral-100 flex items-start justify-between relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#676E85] hover:text-[#0A1B39] bg-neutral-100 rounded-full p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3.5 min-w-0 pr-8">
            <div className="h-12 w-12 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-base shrink-0 border border-[#17A546]/20">
              {affiliate.user?.name ? affiliate.user.name.substring(0, 2).toUpperCase() : "AG"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-[#0A1B39] truncate">
                  {affiliate.user?.name || "Agent Record"}
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border",
                    status.color,
                    status.bg,
                    status.border
                  )}
                >
                  <status.icon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>
              <p className="text-xs text-[#676E85] truncate flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-[#98A2B3] shrink-0" /> {affiliate.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="px-6 space-y-6 max-h-[68vh] overflow-y-auto pt-2 pb-4">
          {/* Top Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-neutral-100 pb-6">
            <div>
              <p className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-wider mb-1">Referral Code</p>
              <p className="font-mono text-sm font-bold text-[#0A1B39]">
                {affiliate.referralCode || "PENDING"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-wider mb-1">Application Date</p>
              <p className="text-sm font-bold text-[#0A1B39]">
                {new Date(affiliate.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-wider mb-1">Commission Rate</p>
              <p className="text-sm font-bold text-[#17A546]">
                {affiliate.commissionRate}%
              </p>
            </div>
          </div>

          {/* Section 1: User & Contact Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0A1B39] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#98A2B3]" /> Agent Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-[11px] text-[#676E85] font-medium mb-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#98A2B3]" /> WhatsApp</p>
                <p className="font-semibold text-[#0A1B39]">{affiliate.user?.whatsappNumber || "N/A"}</p>
              </div>

              <div>
                <p className="text-[11px] text-[#676E85] font-medium mb-1 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#98A2B3]" /> Source</p>
                <p className="font-semibold text-[#0A1B39] capitalize">
                  {affiliate.user?.howDidYouFindUs?.replace("-", " ") || "N/A"}
                </p>
              </div>

              {/* Editable School Name */}
              <div>
                <p className="text-[11px] text-[#676E85] font-medium mb-1 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-[#98A2B3]" /> School / Institution</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-neutral-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#17A546] font-medium text-[#0A1B39]"
                    placeholder="School name"
                  />
                ) : (
                  <p className="font-semibold text-[#0A1B39]">{affiliate.schoolName || "Not specified"}</p>
                )}
              </div>

              {/* Editable Estimated Students */}
              <div>
                <p className="text-[11px] text-[#676E85] font-medium mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#98A2B3]" /> Expected Students</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={estimatedStudents}
                    onChange={(e) => setEstimatedStudents(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm border border-neutral-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#17A546] font-medium text-[#0A1B39]"
                  />
                ) : (
                  <p className="font-semibold text-[#0A1B39]">
                    {affiliate.estimatedStudents ? affiliate.estimatedStudents.toLocaleString() : "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-neutral-100" />

          {/* Section 2: Financial Credentials & Performance */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#0A1B39] uppercase tracking-wider flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#98A2B3]" /> Financial Overview
              </h4>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-[#17A546] hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Details
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-semibold text-[#676E85] hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Editable Commission Rate Card */}
              <div>
                <p className="text-[11px] text-[#676E85] font-medium mb-1">Commission Rate</p>
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={commissionRate}
                      onChange={(e) => setCommissionRateState(Number(e.target.value))}
                      className="w-20 px-2.5 py-1 text-sm border border-neutral-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#17A546] font-bold text-[#0A1B39]"
                    />
                    <span className="font-bold text-[#0A1B39]">%</span>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-[#17A546]">{affiliate.commissionRate}%</p>
                )}
              </div>

              <div>
                <p className="text-[11px] text-[#676E85] font-medium mb-1">Total Earned</p>
                <p className="text-lg font-bold text-[#0A1B39]">
                  ₦{(affiliate.totalEarned / 100).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[#676E85] font-medium mb-1">Pending Payout</p>
                <p className="text-lg font-bold text-[#0A1B39]">
                  ₦{(affiliate.pendingPayout / 100).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/50">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end ml-auto">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-md h-9 px-4 text-xs font-semibold border-neutral-200 text-[#0A1B39] bg-white shadow-2xs"
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending}
                className="bg-[#17A546] hover:bg-[#128a39] text-white rounded-md h-9 px-4 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                {updateMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                {affiliate.status === "pending" && (
                  <>
                    <Button
                      onClick={() => {
                        onStatusChange(affiliate.id, "reject");
                        onClose();
                      }}
                      variant="outline"
                      className="rounded-md h-9 px-4 text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Reject Application
                    </Button>
                    <Button
                      onClick={() => {
                        onStatusChange(affiliate.id, "approve");
                        onClose();
                      }}
                      className="bg-[#17A546] hover:bg-[#128a39] text-white rounded-md h-9 px-4 text-xs font-semibold"
                    >
                      Approve Agent
                    </Button>
                  </>
                )}

                {affiliate.status === "approved" && (
                  <Button
                    onClick={() => {
                      onStatusChange(affiliate.id, "suspend");
                      onClose();
                    }}
                    variant="outline"
                    className="rounded-md h-9 px-4 text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Suspend Agent
                  </Button>
                )}

                {affiliate.status === "suspended" && (
                  <Button
                    onClick={() => {
                      onStatusChange(affiliate.id, "reactivate");
                      onClose();
                    }}
                    className="bg-[#17A546] hover:bg-[#128a39] text-white rounded-md h-9 px-4 text-xs font-semibold"
                  >
                    Reactivate Agent
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-md h-9 px-4 text-xs font-semibold border-neutral-200 text-[#0A1B39] ml-auto"
              >
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
