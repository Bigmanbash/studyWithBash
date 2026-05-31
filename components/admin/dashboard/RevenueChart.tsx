"use client";

const revenueData = [
  { month: "Jan", revenue: 1200000, students: 320 },
  { month: "Feb", revenue: 1450000, students: 380 },
  { month: "Mar", revenue: 1800000, students: 420 },
  { month: "Apr", revenue: 2100000, students: 510 },
  { month: "May", revenue: 2400000, students: 580 },
  { month: "Jun", revenue: 2800000, students: 640 },
  { month: "Jul", revenue: 3200000, students: 720 },
  { month: "Aug", revenue: 3600000, students: 810 },
  { month: "Sep", revenue: 3900000, students: 890 },
  { month: "Oct", revenue: 4100000, students: 950 },
  { month: "Nov", revenue: 3800000, students: 920 },
  { month: "Dec", revenue: 4200000, students: 1020 },
];

export function RevenueChart() {
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#0A1B39]">Revenue Overview</h3>
          <p className="text-xs text-[#98A2B3] mt-0.5">Monthly revenue trend</p>
        </div>
        <div className="flex gap-2">
          {["6M", "12M"].map((period) => (
            <button
              key={period}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                period === "12M"
                  ? "bg-[#17A546]/10 text-[#17A546]"
                  : "text-[#98A2B3] hover:bg-neutral-100"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-1.5 sm:gap-2.5 h-44 sm:h-56">
        {revenueData.map((item) => {
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
                className="w-full max-w-[36px] bg-neutral-100 rounded-xl overflow-hidden relative"
                style={{ height: "100%" }}
              >
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#030E36] to-[#030E36]/40 rounded-xl transition-all duration-700 group-hover:from-[#17A546] group-hover:to-[#17A546]/60"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#98A2B3] font-medium">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
