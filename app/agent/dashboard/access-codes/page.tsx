import { getServerSession } from "@/app/api/auth/queries";
import { getAffiliateByUserId } from "@/app/api/affiliates/queries";
import { listAccessCodes } from "@/app/api/access-codes/queries";
import { redirect } from "next/navigation";

import { KeyRound } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import Link from "next/link";
import { AgentAccessCodesClient } from "./AgentAccessCodesClient";

export default async function AgentAccessCodesPage() {
  const session = await getServerSession();

  if (!session || session.role !== "agent") {
    redirect("/login");
  }

  const affiliate = await getAffiliateByUserId(session.id);
  if (!affiliate) {
    redirect("/login");
  }

  // Fetch the latest 500 access codes for this affiliate (increased limit for client-side search/filter)
  const { data: accessCodes } = await listAccessCodes({
    affiliateId: affiliate.id,
    limit: 500
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <PageHeader
          title="Your Access Codes"
          description="View, manage, and share the access codes you've purchased for your students."
        />
        <Link
          href="/agent/dashboard/buy-for-students"
          className="px-4 py-2.5 bg-[#11871A] hover:bg-[#11871A]/90 text-white rounded-md font-bold text-xs sm:text-[11px] transition-all shadow-2xs inline-flex items-center gap-2 w-fit shrink-0 active:scale-95"
        >
          <KeyRound className="h-4 w-4" />
          <span>Buy More Codes</span>
        </Link>
      </div>

      <AgentAccessCodesClient initialCodes={accessCodes} />
    </div>
  );
}
