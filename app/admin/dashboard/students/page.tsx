export default function AdminStudentsPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-3xl border border-neutral-200/70 bg-white p-6 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0A1B39]">
            Students
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#5B627D]">
            Manage enrolled students and view student activity from the admin
            dashboard.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-dashed border-neutral-200/70 bg-white p-6 text-[#39404E]">
            <p className="text-base font-medium">Student directory</p>
            <p className="mt-2 text-sm text-[#6B7280]">
              No student data is configured yet; this page is a placeholder for
              student management tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
