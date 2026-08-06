"use client";

import type { RevenueData } from "@/app/api/adminUser/dashboard/queries";

export function RevenueChart({ revenueData = [] }: { revenueData?: RevenueData[] }) {
  // If we have no data, fallback to empty state handling
  const displayData = revenueData.length > 0 ? revenueData : [];

  const maxRevenue = displayData.length > 0 ? Math.max(...displayData.map((d) => d.revenue)) : 1;

  return (
    <div className="bg-white rounded-md border border-neutral-200/80 shadow-xs p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-[#0A1B39]">Revenue Overview</h3>
          <p className="text-xs text-[#676E85] mt-0.5">Monthly revenue trend</p>
        </div>
        <div className="flex gap-1.5">
          {["6M", "12M"].map((period) => (
            <button
              key={period}
              className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
                period === "12M"
                  ? "bg-[#17A546]/10 text-[#17A546] border border-[#17A546]/20"
                  : "text-[#676E85] hover:bg-neutral-100"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-1.5 sm:gap-2.5 h-44 sm:h-56">
        {displayData.length === 0 ? (
          <div className="w-full text-center text-xs text-[#98A2B3] py-8 my-auto">No revenue data available.</div>
        ) : (
          displayData.map((item) => {
            const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <span className="text-[10px] font-bold text-[#0A1B39] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ₦{(item.revenue / 1000000).toFixed(1)}M
              </span>
              <div
                className="w-full max-w-[36px] bg-neutral-100 rounded-md overflow-hidden relative"
                style={{ height: "100%" }}
              >
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#0A1B39] to-[#0A1B39]/50 rounded-md transition-all duration-700 group-hover:from-[#17A546] group-hover:to-[#17A546]/60"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#676E85] font-medium">
                {item.month}
              </span>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
