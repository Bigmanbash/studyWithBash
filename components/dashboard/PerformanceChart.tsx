const mockWeekData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 72 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 80 },
  { day: "Fri", score: 75 },
  { day: "Sat", score: 88 },
  { day: "Sun", score: 82 },
];

export function PerformanceChart() {
  const maxScore = Math.max(...mockWeekData.map((d) => d.score));

  return (
    <div className="bg-(--card) rounded-2xl border border-border shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-(--heading)">Weekly Performance</h3>
        <div className="flex gap-2">
          {["Week", "Month"].map((period) => (
            <button
              key={period}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                period === "Week"
                  ? "bg-[#17A546]/10 text-[#17A546]"
                  : "text-(--muted) hover:bg-[rgba(255,255,255,0.1)]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2 sm:gap-4 h-40 sm:h-52">
        {mockWeekData.map((item) => {
          const heightPercent = (item.score / maxScore) * 100;
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-xs font-bold text-(--heading) opacity-0 group-hover:opacity-100 transition-opacity">
                {item.score}%
              </span>
              <div className="w-full max-w-[40px] bg-(--card) rounded-xl overflow-hidden relative" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#17A546] to-[#17A546]/60 rounded-xl transition-all duration-700 group-hover:from-[#17A546] group-hover:to-[#17A546]"
                  style={{ height: `${heightPercent}%` }}
                ></div>
              </div>
              <span className="text-xs text-(--muted) font-medium">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
