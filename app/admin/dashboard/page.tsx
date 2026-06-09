import { getDashboardStats, getEnrollmentOverview, getRevenueOverview } from "@/app/api/adminUser/dashboard/queries";
import {
  AdminDashboardHeader,
  AdminStatsCards,
  RevenueChart,
  RecentPayments,
  SupportOverview,
  EnrollmentOverview,
} from "@/components/admin/dashboard";

export default async function AdminDashboardPage() {
  const statsData = await getDashboardStats();
  const enrollmentData = await getEnrollmentOverview();
  const revenueData = await getRevenueOverview();

  return (
    <>
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">
            Welcome back, Admin 👋
          </h2>
          <p className="text-sm sm:text-base text-[#676E85] mt-1">
            Here&apos;s what&apos;s happening on the platform today.
          </p>
        </div>

        {/* Stats */}
        <AdminStatsCards statsData={statsData} />

        {/* Revenue + Enrollment Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart revenueData={revenueData} />
          <EnrollmentOverview enrollmentData={enrollmentData} />
        </div>

        {/* Payments + Support Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentPayments />
          <SupportOverview />
        </div>
      </div>
    </>
  );
}
