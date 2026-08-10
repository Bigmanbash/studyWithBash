import { getServerSession } from "@/app/api/auth/queries";
import { getAffiliateByUserId, getAffiliateStats, getAffiliateCommissions } from "@/app/api/affiliates/queries";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard";
import { AgentEarningsClient } from "./AgentEarningsClient";
import { CommissionRecord } from "@/app/api/affiliates/interface";

export default async function EarningsPage() {
  const session = await getServerSession();
  if (!session || session.role !== "agent") {
    redirect("/login");
  }

  const affiliate = await getAffiliateByUserId(session.id);
  if (!affiliate) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <p>Error: Agent profile not found.</p>
        </div>
      </div>
    );
  }

  const stats = await getAffiliateStats(affiliate.id);
  // Fetch recent commissions for earnings page
  const commissionsResult = await getAffiliateCommissions(affiliate.id, 1, 100);

  // Cast commissions data to CommissionRecord[] to ensure TypeScript alignment
  const commissions = (commissionsResult.data || []) as CommissionRecord[];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      <PageHeader
        title="Earnings & Payouts"
        description="Track your earnings, view real-time commission audit logs, and manage payouts."
      />

      <AgentEarningsClient
        affiliate={affiliate}
        stats={stats}
        commissions={commissions}
      />
    </div>
  );
}
