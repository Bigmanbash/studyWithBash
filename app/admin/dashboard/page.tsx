import Link from "next/link";
import { getDashboardStats, getEnrollmentOverview, getRevenueOverview, getRecentPayments } from "@/app/api/adminUser/dashboard/queries";
import {
  AdminDashboardHeader,
  AdminStatsCards,
  RevenueChart,
  RecentPayments,
  SupportOverview,
  EnrollmentOverview,
} from "@/components/admin/dashboard";
import { Plus, CreditCard, Users, BookOpen, Sparkles, ArrowUpRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const statsData = await getDashboardStats();
  const enrollmentData = await getEnrollmentOverview();
  const revenueData = await getRevenueOverview();
  const recentPaymentsData = await getRecentPayments();

  return (
    <>
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Unboxed Modern Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1B39]">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#676E85] mt-1 font-normal">
              Real-time platform overview, enrollment statistics, and course metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/admin/dashboard/courses/add"
              className="bg-[#17A546] hover:bg-[#128638] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </Link>

            <Link
              href="/admin/dashboard/payments"
              className="bg-white hover:bg-neutral-50 text-[#0A1B39] text-xs font-medium px-3.5 py-2 rounded-md border border-neutral-200/80 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#676E85]" />
              <span>Payments</span>
            </Link>

            <Link
              href="/admin/dashboard/students"
              className="bg-white hover:bg-neutral-50 text-[#0A1B39] text-xs font-medium px-3.5 py-2 rounded-md border border-neutral-200/80 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-[#676E85]" />
              <span>Students</span>
            </Link>
          </div>
        </div>

        {/* Core Metric Cards */}
        <AdminStatsCards statsData={statsData} />

        {/* Revenue + Enrollment Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart revenueData={revenueData} />
          <EnrollmentOverview enrollmentData={enrollmentData} />
        </div>

        {/* Payments + Support Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentPayments payments={recentPaymentsData} />
          <SupportOverview />
        </div>
      </div>
    </>
  );
}
