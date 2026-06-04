import {
  DashboardHeader,
  MinimalStats,
  ContinueReading,
  RecentlyPurchased,
  AvailableCourses,
  QuickActions,
} from "@/components/dashboard";

export default function DashboardPage() {
  // MOCK STATE: Toggle this to see the two different dashboard states
  const hasPurchases = true; 

  return (
    <>
      <DashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-12 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-[#0A1B39]">
            Welcome Back, Chioma 👋
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
            {/* Continue Reading - Most prominent */}
            <ContinueReading />

            {/* Minimal Stats */}
            {/* <MinimalStats /> */}

            {/* Recently Purchased */}
            <RecentlyPurchased />
            
            {/* Other Courses */}
            <AvailableCourses title="You Might Also Like" />
          </>
        ) : (
          <>
            {/* Quick Actions for discovery */}
            <QuickActions />

            {/* Available Courses */}
            <AvailableCourses title="Popular Courses for SSS1" />
          </>
        )}

      </div>
    </>
  );
}
