import { DashboardHeader } from "@/components/dashboard";

export function DashboardSkeleton() {
  return (
    <>
      <div className="h-[72px] lg:h-[88px] w-full bg-white border-b border-[#17A546]/10 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-full max-w-xl bg-[#17A546]/10 rounded-lg animate-pulse" />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-12 max-w-7xl mx-auto animate-pulse">
        {/* Welcome Section */}
        <div className="flex flex-col gap-3">
          <div className="h-7 w-64 bg-[#17A546]/15 rounded-md" />
          <div className="h-4 w-96 bg-[#17A546]/8 rounded-md" />
        </div>

        {/* Continue Reading / Quick Actions */}
        <div className="h-[120px] w-full bg-[#17A546]/10 rounded-2xl" />

        {/* Recently Purchased */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-[#17A546]/15 rounded-md" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[280px] h-[100px] bg-white border border-[#17A546]/10 rounded-xl flex gap-3 p-3 shadow-sm">
                <div className="h-full w-[80px] bg-[#17A546]/10 rounded-lg" />
                <div className="flex flex-col gap-2 flex-1 pt-1">
                  <div className="h-4 w-3/4 bg-[#17A546]/10 rounded" />
                  <div className="h-3 w-1/2 bg-[#17A546]/8 rounded" />
                  <div className="mt-auto h-6 w-20 bg-[#17A546]/8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Courses */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-[#17A546]/15 rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-[#17A546]/10 rounded-xl overflow-hidden flex flex-col shadow-sm h-64">
                <div className="h-32 bg-[#17A546]/10 w-full" />
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="h-4 bg-[#17A546]/10 rounded w-3/4" />
                  <div className="h-4 bg-[#17A546]/8 rounded w-1/2" />
                  <div className="mt-auto h-8 bg-[#17A546]/10 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}