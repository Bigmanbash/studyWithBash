import { AdminDashboardHeader } from "@/components/admin/dashboard";

export function AdminDashboardSkeleton() {
  return (
    <>
      <div className="h-[72px] lg:h-[88px] w-full bg-white border-b border-[#17A546]/10 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-full max-w-xl bg-[#17A546]/10 rounded-lg animate-pulse" />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-pulse">
        {/* Greeting */}
        <div>
          <div className="h-8 w-64 bg-neutral-200 rounded-md mb-2" />
          <div className="h-5 w-96 bg-neutral-100 rounded-md" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-neutral-100 shadow-sm h-32">
              <div className="h-10 w-10 bg-neutral-100 rounded-xl mb-4" />
              <div className="h-6 w-24 bg-neutral-200 rounded-md mb-2" />
              <div className="h-4 w-16 bg-neutral-100 rounded-md" />
            </div>
          ))}
        </div>

        {/* Revenue + Enrollment Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6 h-[320px]">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <div className="h-6 w-40 bg-neutral-200 rounded-md" />
                <div className="h-4 w-32 bg-neutral-100 rounded-md" />
              </div>
              <div className="h-8 w-24 bg-neutral-100 rounded-md" />
            </div>
            <div className="h-44 bg-neutral-50 rounded-xl flex items-end justify-between px-4 pb-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-6 bg-neutral-200 rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6 h-[320px]">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <div className="h-6 w-48 bg-neutral-200 rounded-md" />
                <div className="h-4 w-36 bg-neutral-100 rounded-md" />
              </div>
              <div className="h-8 w-24 bg-neutral-100 rounded-md" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-neutral-200 rounded" />
                    <div className="h-4 w-8 bg-neutral-200 rounded" />
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full">
                    <div className="h-full bg-neutral-200 rounded-full" style={{ width: `${Math.max(30, Math.random() * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payments + Support Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6 h-[400px]">
             <div className="flex justify-between items-center mb-6">
              <div className="h-6 w-40 bg-neutral-200 rounded-md" />
              <div className="h-4 w-16 bg-neutral-100 rounded-md" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-neutral-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-neutral-200 rounded" />
                    <div className="h-3 w-48 bg-neutral-100 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-neutral-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6 h-[400px]">
             <div className="space-y-2 mb-6">
              <div className="h-6 w-40 bg-neutral-200 rounded-md" />
              <div className="h-4 w-32 bg-neutral-100 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 h-24 flex flex-col justify-between">
                  <div className="h-6 w-6 rounded bg-neutral-200" />
                  <div className="flex justify-between items-end">
                    <div className="h-6 w-12 bg-neutral-200 rounded" />
                    <div className="h-3 w-16 bg-neutral-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
