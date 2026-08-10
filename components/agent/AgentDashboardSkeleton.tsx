export function AgentDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header Placeholder */}
      <div className="h-16 w-full bg-white border-b border-neutral-100 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="h-5 w-44 bg-neutral-200/80 rounded-md animate-pulse ml-12 lg:ml-0" />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-7xl mx-auto animate-pulse">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <div className="h-7 w-56 bg-neutral-200/80 rounded-md" />
          <div className="h-4 w-80 bg-neutral-100 rounded-md" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-md p-4 border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="h-8 w-8 bg-[#17A546]/10 rounded-md" />
              <div className="h-6 w-24 bg-neutral-200/80 rounded-md" />
              <div className="h-3 w-16 bg-neutral-100 rounded-md" />
            </div>
          ))}
        </div>

        {/* Referral Link Box */}
        <div className="h-28 w-full bg-white border border-neutral-200/80 rounded-md shadow-2xs p-5" />

        {/* Table Skeleton */}
        <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs p-5 space-y-4">
          <div className="h-5 w-40 bg-neutral-200/80 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-full bg-neutral-50 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
