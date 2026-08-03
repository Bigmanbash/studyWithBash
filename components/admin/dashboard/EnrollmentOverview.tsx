import type { EnrollmentData } from "@/app/api/adminUser/dashboard/queries";

import { SUBJECT_BRAND_COLORS } from "@/lib/constants";

const fallbackColors = [
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-red-400",
];

export function EnrollmentOverview({ enrollmentData = [] }: { enrollmentData?: EnrollmentData[] }) {
  // If we have no data, fallback to empty state handling
  const displayData = enrollmentData.length > 0 ? enrollmentData : [];
  
  const maxEnrolled = displayData.length > 0 ? Math.max(...displayData.map((d) => d.enrolled)) : 1;
  const totalEnrolled = displayData.reduce((sum, d) => sum + d.enrolled, 0);

  return (
    <div className="bg-white rounded-md border border-neutral-200/80 shadow-xs p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-[#0A1B39]">Course Enrollment</h3>
          <p className="text-xs text-[#676E85] mt-0.5">
            {totalEnrolled.toLocaleString()} total enrollments
          </p>
        </div>
        <span className="text-xs font-semibold text-[#17A546] bg-[#17A546]/10 px-2.5 py-0.5 rounded-md border border-[#17A546]/20">
          This Term
        </span>
      </div>

      <div className="space-y-4">
        {displayData.length === 0 ? (
          <div className="text-center text-xs text-[#98A2B3] py-8">No enrollment data available.</div>
        ) : (
          displayData.map((item, index) => {
            const percent = Math.round((item.enrolled / maxEnrolled) * 100);
            const color = SUBJECT_BRAND_COLORS[item.subject] || fallbackColors[index % fallbackColors.length];
            return (
              <div key={item.subject}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2.5 w-2.5 rounded-xs ${color}`} />
                    <span className="text-xs font-semibold text-[#0A1B39]">
                      {item.subject}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0A1B39]">
                    {item.enrolled}
                  </span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-md overflow-hidden">
                  <div
                    className={`${color} h-full rounded-md transition-all duration-1000`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
