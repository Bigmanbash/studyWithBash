const subjects = [
  { name: "Physics", progress: 72, total: 45, completed: 32, color: "bg-blue-500" },
  { name: "Chemistry", progress: 58, total: 38, completed: 22, color: "bg-amber-500" },
  { name: "Mathematics", progress: 85, total: 52, completed: 44, color: "bg-[#17A546]" },
];

export function SubjectProgress() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#0A1B39]">Subject Progress</h3>
        <span className="text-xs font-medium text-[#17A546] bg-[#17A546]/10 px-3 py-1 rounded-full">This Term</span>
      </div>

      <div className="space-y-6">
        {subjects.map((subject) => (
          <div key={subject.name}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${subject.color}`}></div>
                <span className="text-sm font-semibold text-[#0A1B39]">{subject.name}</span>
              </div>
              <span className="text-sm text-[#676E85]">
                {subject.completed}/{subject.total} topics
              </span>
            </div>
            <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`${subject.color} h-full rounded-full transition-all duration-1000`}
                style={{ width: `${subject.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#98A2B3] mt-1.5">{subject.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}
