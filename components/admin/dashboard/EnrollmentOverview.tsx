const enrollmentData = [
  { subject: "Physics", enrolled: 420, color: "bg-blue-500" },
  { subject: "Mathematics", enrolled: 580, color: "bg-[#17A546]" },
  { subject: "Chemistry", enrolled: 340, color: "bg-amber-500" },
  { subject: "Biology", enrolled: 290, color: "bg-purple-500" },
  { subject: "English", enrolled: 510, color: "bg-rose-500" },
];

export function EnrollmentOverview() {
  const maxEnrolled = Math.max(...enrollmentData.map((d) => d.enrolled));
  const totalEnrolled = enrollmentData.reduce((sum, d) => sum + d.enrolled, 0);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#0A1B39]">Course Enrollment</h3>
          <p className="text-xs text-[#98A2B3] mt-0.5">
            {totalEnrolled.toLocaleString()} total enrollments
          </p>
        </div>
        <span className="text-xs font-medium text-[#17A546] bg-[#17A546]/10 px-3 py-1 rounded-full">
          This Term
        </span>
      </div>

      <div className="space-y-5">
        {enrollmentData.map((item) => {
          const percent = Math.round((item.enrolled / maxEnrolled) * 100);
          return (
            <div key={item.subject}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-semibold text-[#0A1B39]">
                    {item.subject}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#0A1B39]">
                  {item.enrolled}
                </span>
              </div>
              <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-1000`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
