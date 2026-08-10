import { getServerSession } from "@/app/api/auth/queries";
import { getAffiliateByUserId, getAffiliateStats, getAffiliateCommissions } from "@/app/api/affiliates/queries";
import { redirect } from "next/navigation";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  BookOpen,
  CreditCard,
  Wallet,
  AlertCircle,
  Award,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard";
import { cn } from "@/lib/utils";

export default async function AgentDashboardPage() {
  const session = await getServerSession();
  if (!session || session.role !== "agent") {
    redirect("/login");
  }

  const affiliate = await getAffiliateByUserId(session.id);
  if (!affiliate) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-xs sm:text-sm">
          <p>Error: Agent profile not found.</p>
        </div>
      </div>
    );
  }

  const stats = await getAffiliateStats(affiliate.id);
  const commissionsResult = await getAffiliateCommissions(affiliate.id, 1, 10);
  const commissions = commissionsResult.data || [];

  const MINIMUM_WITHDRAWAL_KOBO = 500000; // ₦5,000 in kobo
  const pendingAmount = stats.pendingPayout || 0;
  const progressPercent = Math.min(100, Math.round((pendingAmount / MINIMUM_WITHDRAWAL_KOBO) * 100));
  const canWithdraw = pendingAmount >= MINIMUM_WITHDRAWAL_KOBO;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      <PageHeader
        title="Agent Dashboard"
        description="Track your referrals, commissions, and student proxy purchases in real-time."
      />

      {/* Responsive Dark Banner */}
      <div className="bg-[#0A1B39] rounded-md p-5 sm:p-7 text-white relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 shadow-xs border border-[#0A1B39]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#17A546]/20 via-[#17A546]/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#17A546]/20 text-[#17A546] border border-[#17A546]/30">
              <Award className="w-3.5 h-3.5 shrink-0" /> Agent Rate: {affiliate.commissionRate}% Commission
            </span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
            Your Agent Referral Code
          </h2>
          <p className="text-[#98A2B3] text-xs sm:text-sm leading-relaxed">
            Share your unique code with students. When they register using your code, you instantly earn a {affiliate.commissionRate}% commission on their course purchases.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-md p-3 sm:p-3.5 border border-white/10 flex items-center justify-between gap-3 shrink-0 w-full sm:w-auto min-w-0 sm:min-w-[280px]">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#98A2B3]">Referral Code</p>
            <p className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-[#17A546] mt-0.5 truncate">
              {affiliate.referralCode || "PENDING"}
            </p>
          </div>
          {affiliate.referralCode && (
            <CopyButton
              text={affiliate.referralCode}
              className="bg-[#17A546] text-white hover:bg-[#128a39] h-9 px-3.5 text-xs font-semibold rounded-md shadow-2xs shrink-0"
            />
          )}
        </div>
      </div>

      {/* Stats Grid Matching Standard Sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          {
            label: "Total Earned",
            value: formatCurrency(stats.totalEarned),
            icon: Wallet,
            color: "text-[#17A546]",
            bg: "bg-[#17A546]/10",
            period: "Lifetime earnings",
            pill: "Lifetime",
          },
          {
            label: "Pending Payout",
            value: formatCurrency(stats.pendingPayout),
            icon: CreditCard,
            color: "text-amber-600",
            bg: "bg-amber-500/10",
            period: "Unpaid balance",
            pill: "Pending",
          },
          {
            label: "Students Referred",
            value: stats.studentsReferred.toLocaleString(),
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            period: `${stats.referralCount} referral sales`,
            pill: "Referrals",
          },
          {
            label: "Courses Sold",
            value: stats.coursesSold.toLocaleString(),
            icon: BookOpen,
            color: "text-purple-600",
            bg: "bg-purple-500/10",
            period: `${stats.proxyCount} proxy orders`,
            pill: "Proxy & Direct",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-md p-4 sm:p-5 border border-neutral-200/80 shadow-2xs hover:border-[#17A546]/30 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className={`${stat.bg} rounded-md p-2 sm:p-2.5 border border-neutral-100 group-hover:scale-105 transition-transform duration-200`}>
                <stat.icon className={`h-4 sm:h-5 w-4 sm:w-5 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md text-[#676E85] bg-neutral-100 border border-neutral-200/60">
                <span>{stat.pill}</span>
              </div>
            </div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1B39] tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs text-[#676E85] mt-1 font-medium">{stat.label}</p>
            <p className="text-[10px] sm:text-[11px] text-[#98A2B3] mt-0.5">{stat.period}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left 2 Columns: Recent Commissions Audit Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-row items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A1B39]">Recent Commissions</h3>
              <p className="text-xs text-[#676E85] mt-0.5">
                Latest referral and proxy transactions credited to your profile.
              </p>
            </div>
            <Link
              href="/agent/dashboard/earnings"
              className="text-xs font-bold text-[#17A546] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span className="hidden sm:inline">View Full</span> Earnings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden">
            {commissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-3">
                  <AlertCircle className="h-5 sm:h-6 w-5 sm:w-6 text-[#98A2B3]" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-[#0A1B39]">No commissions yet</h3>
                <p className="text-xs text-[#676E85] mt-1">
                  Share your referral code or buy access codes for students to start earning commissions.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="bg-neutral-50/60 border-b border-neutral-200/80">
                      <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                        Student & Course
                      </th>
                      <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                        Type
                      </th>
                      <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                        Commission
                      </th>
                      <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                        Status
                      </th>
                      <th className="text-left text-[10px] uppercase tracking-wider font-bold text-[#676E85] px-4 sm:px-5 py-3">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {commissions.map((comm) => (
                      <tr key={comm.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                          <p className="text-xs font-semibold text-[#0A1B39]">
                            {comm.course?.title || "Course"}
                          </p>
                          <p className="text-[11px] text-[#676E85]">
                            {comm.student?.name || "Student"} ({comm.student?.email})
                          </p>
                        </td>
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                              comm.type === "referral"
                                ? "bg-blue-50 border-blue-200 text-blue-600"
                                : "bg-purple-50 border-purple-200 text-purple-600"
                            )}
                          >
                            {comm.type === "referral" ? "Direct Referral" : "Proxy Purchase"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5 font-bold text-[#17A546] text-xs">
                          +{formatCurrency(comm.commissionAmount)}
                        </td>
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                              comm.status === "paid"
                                ? "bg-blue-50 border-blue-200 text-blue-600"
                                : comm.status === "credited"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-amber-50 border-amber-200 text-amber-600"
                            )}
                          >
                            {comm.status === "credited" ? "Credited" : comm.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5 text-[#676E85] text-xs whitespace-nowrap">
                          {formatDate(comm.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions & Payout Progress Widget */}
        <div className="space-y-6">
          {/* Payout Status & Progress Mini Card */}
          <div className="bg-white rounded-md p-5 sm:p-6 border border-neutral-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0A1B39] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#17A546]" /> Payout Status
              </h3>
              {canWithdraw ? (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#17A546]/10 text-[#17A546] border border-[#17A546]/20">
                  Eligible
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">
                  In Progress
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-[#0A1B39]">{formatCurrency(pendingAmount)}</span>
                <span className="text-[#17A546]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200/60">
                <div
                  className="h-full bg-gradient-to-r from-[#17A546] to-[#0E7B33] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#676E85] mt-2">
                Minimum payout limit is {formatCurrency(MINIMUM_WITHDRAWAL_KOBO)}.
              </p>
            </div>

            <Link
              href="/agent/dashboard/earnings"
              className="w-full py-2.5 px-4 bg-[#17A546] hover:bg-[#128a39] text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <span>Manage Earnings & Payouts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Buy for Students Action Card */}
          <div className="bg-white rounded-md p-5 sm:p-6 border border-neutral-200/80 shadow-2xs space-y-4">
            <div className="h-10 w-10 rounded-md bg-[#17A546]/10 flex items-center justify-center border border-[#17A546]/20">
              <KeyRound className="h-5 w-5 text-[#17A546]" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A1B39] text-sm">Buy for Students (Proxy)</h4>
              <p className="text-xs text-[#676E85] leading-relaxed mt-1">
                Collect cash from students who don&apos;t have cards, purchase access codes on their behalf, and earn immediate commission.
              </p>
            </div>
            <Link
              href="/agent/dashboard/buy-for-students"
              className="flex items-center justify-center w-full py-2.5 bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white rounded-md font-bold text-xs transition-colors shadow-2xs gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Get Access Codes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
