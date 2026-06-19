"use client";

import {
  DashboardHeader,
  ContinueReading,
  RecentlyPurchased,
  AvailableCourses,
  QuickActions,
} from "@/components/dashboard";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, isLoading, error } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <p className="text-semantic-error-main">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { purchased, available } = data;
  const hasPurchases = purchased.length > 0;
  const firstName = session?.user?.name?.split(" ")[0] || "Student";

  return (
    <>
      <DashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-12 max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-[22px] font-semibold text-[#0A1B39]">
            Welcome back, {firstName} 👋
          </h2>
          <p className="text-sm text-[#676E85]">
            {hasPurchases
              ? "Continue learning from your purchased materials."
              : "Discover and purchase materials to kickstart your learning."}
          </p>
        </div>

        {/* Conditional Dashboard Sections */}
        {hasPurchases ? (
          <>
            <ContinueReading course={purchased[0]} />
            <RecentlyPurchased courses={purchased} />
            <AvailableCourses title="You Might Also Like" courses={available} />
          </>
        ) : (
          <>
            <QuickActions />
            <RecentlyPurchased courses={purchased} />
            <AvailableCourses title="Popular Courses for SSS1" courses={available} />
          </>
        )}

      </div>
    </>
  );
}
