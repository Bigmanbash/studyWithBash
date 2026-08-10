"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAffiliates } from "@/app/api/affiliates/client";
import { fetchAccessCodes } from "@/app/api/access-codes/client";
import {
  Wallet,
  Users,
  KeyRound,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgentDashboardPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "access-codes">("overview");

  const { data, isLoading, error } = useQuery({
    queryKey: ["agent-profile"],
    queryFn: () => fetchAffiliates(),
  });

  const { data: codesData, isLoading: isLoadingCodes } = useQuery({
    queryKey: ["agent-access-codes"],
    queryFn: () => fetchAccessCodes(),
    enabled: activeTab === "access-codes",
  });

  const handleCopyCode = () => {
    if (data?.profile?.referralCode) {
      navigator.clipboard.writeText(data.profile.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#676E85]">
        <Loader2 className="w-8 h-8 animate-spin text-[#17A546] mb-4" />
        <p className="text-sm font-semibold">Loading Agent Panel...</p>
      </div>
    );
  }

  if (error || data?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-sm font-semibold">{data?.error || "Failed to load agent profile"}</p>
      </div>
    );
  }

  const { profile, stats, commissions } = data;

  if (profile?.status === "pending") {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 pt-10">
        <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-md p-6 text-[#92400E] text-center">
          <ClockIcon className="w-10 h-10 mx-auto mb-3 text-[#F59E0B]" />
          <h2 className="text-xl font-bold mb-2">Application Pending</h2>
          <p className="text-sm">
            Your application to become a Bash Academy Teacher/Agent is currently under review by our team.
            We will notify you once it's approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pt-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-md border border-neutral-200/80 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ShieldCheckIcon className="w-48 h-48 text-[#17A546] -rotate-12 transform translate-x-10 -translate-y-10" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-[#0A1B39] tracking-tight">Agent Dashboard</h1>
          <p className="text-sm text-[#676E85] mt-1.5">
            Welcome back! Here are your referral statistics and generated access codes.
          </p>
        </div>
        <div className="relative z-10 bg-neutral-50 border border-neutral-200 rounded-md p-3 flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Your Referral Code</p>
            <p className="text-lg font-mono font-bold text-[#0A1B39]">{profile?.referralCode}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleCopyCode}
            className="h-9 px-3 rounded-md text-xs font-semibold bg-white"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-[#17A546]" /> : <Copy className="w-4 h-4 text-[#676E85]" />}
            <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-px">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-[#17A546] text-[#17A546]"
              : "border-transparent text-[#676E85] hover:text-[#0A1B39]"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("access-codes")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "access-codes"
              ? "border-[#17A546] text-[#17A546]"
              : "border-transparent text-[#676E85] hover:text-[#0A1B39]"
          }`}
        >
          Access Codes
        </button>
      </div>

      {/* Content */}
      {activeTab === "overview" ? (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-md p-5 border border-neutral-200/80 shadow-2xs flex items-center gap-4">
              <div className="bg-[#17A546]/10 rounded-md p-3 w-fit shrink-0 border border-neutral-100">
                <Users className="h-6 w-6 text-[#17A546]" />
              </div>
              <div>
                <p className="text-xs text-[#676E85] font-medium">Total Students Referred</p>
                <p className="text-2xl font-bold text-[#0A1B39] mt-0.5">{stats?.totalStudents || 0}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-md p-5 border border-neutral-200/80 shadow-2xs flex items-center gap-4">
              <div className="bg-blue-50 rounded-md p-3 w-fit shrink-0 border border-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-[#676E85] font-medium">Total Lifetime Earnings</p>
                <p className="text-2xl font-bold text-[#0A1B39] mt-0.5">₦{(stats?.totalEarnings || 0).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-md p-5 border border-neutral-200/80 shadow-2xs flex items-center gap-4">
              <div className="bg-[#0E7B33]/10 rounded-md p-3 w-fit shrink-0 border border-[#0E7B33]/20">
                <Wallet className="h-6 w-6 text-[#0E7B33]" />
              </div>
              <div>
                <p className="text-xs text-[#676E85] font-medium">Available Payout Balance</p>
                <p className="text-2xl font-bold text-[#0A1B39] mt-0.5">₦{(profile?.payoutBalance || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Recent Commissions Table */}
          <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h3 className="text-sm font-bold text-[#0A1B39]">Recent Commissions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/60">
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Course & Student
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Type
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {commissions?.data?.length > 0 ? (
                    commissions.data.map((comm: any) => (
                      <tr key={comm.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-5 py-3">
                          <p className="text-xs font-semibold text-[#0A1B39]">{comm.course?.title}</p>
                          <p className="text-[11px] text-[#676E85]">Student: {comm.student?.name}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            comm.type === "proxy" 
                              ? "text-blue-700 bg-blue-50 border-blue-200" 
                              : "text-[#17A546] bg-[#17A546]/10 border-[#17A546]/20"
                          }`}>
                            {comm.type === "proxy" ? "Proxy Purchase" : "Referral Code"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <p className="text-xs font-bold text-[#17A546]">+₦{comm.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-[#676E85]">Sale: ₦{comm.saleAmount.toLocaleString()}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-xs text-[#676E85]">
                        You haven't earned any commissions yet. Share your code to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div>
              <h3 className="text-sm font-bold text-[#0A1B39]">Your Generated Access Codes</h3>
              <p className="text-xs text-[#676E85] mt-0.5">Codes you purchased for your students</p>
            </div>
          </div>
          
          {isLoadingCodes ? (
             <div className="flex justify-center py-10">
               <Loader2 className="w-6 h-6 animate-spin text-[#17A546]" />
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/60">
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Code
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Course
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#676E85] px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {codesData?.data?.length > 0 ? (
                    codesData.data.map((code: any) => (
                      <tr key={code.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-xs font-mono font-bold text-[#0A1B39] bg-neutral-100 px-2 py-1 rounded-md border border-neutral-200 w-fit">
                            {code.code}
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs font-semibold text-[#0A1B39]">{code.course?.title}</p>
                          <p className="text-[10px] text-[#676E85]">{new Date(code.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          {code.status === "unused" ? (
                            <span className="text-[10px] font-semibold text-[#0E7B33] bg-[#E7F6EC] border border-[#0E7B33]/20 px-2 py-0.5 rounded-md">
                              Unused
                            </span>
                          ) : code.status === "redeemed" ? (
                            <div className="flex flex-col">
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md w-fit">
                                Redeemed
                              </span>
                              <span className="text-[10px] text-[#676E85] mt-1">by {code.redeemedByUser?.name}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                              Expired
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-5 py-12 text-center">
                        <KeyRound className="w-8 h-8 text-[#98A2B3] mx-auto mb-3" />
                        <p className="text-sm font-semibold text-[#0A1B39]">No access codes generated yet</p>
                        <p className="text-xs text-[#676E85] mt-1">
                          When you purchase courses in bulk for your students, the generated codes will appear here.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ShieldCheckIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
