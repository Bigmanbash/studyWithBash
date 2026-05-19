import {
  DashboardHeader,
  StatsCards,
  SubjectProgress,
  PerformanceChart,
  RecentActivity,
  EnrolledCourses,
  UpcomingTasks,
} from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">
            Welcome back, Chioma! 👋
          </h2>
          <p className="text-sm sm:text-base text-[#676E85] mt-1">
            Here&apos;s how your preparation is going this week.
          </p>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Courses + Tasks Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnrolledCourses />
          <UpcomingTasks />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart />
          <SubjectProgress />
        </div>

        {/* Activity */}
        <RecentActivity />
      </div>
    </>
  );
}
