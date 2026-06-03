export function MinimalStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Purchased Courses Card */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
        <p className="text-sm font-medium text-[#676E85]">Purchased Courses</p>
        <p className="text-3xl font-bold text-[#0A1B39] mt-2">12</p>
      </div>

      {/* Available Categories Card */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
        <p className="text-sm font-medium text-[#676E85]">Available Categories</p>
        <p className="text-3xl font-bold text-[#0A1B39] mt-2">8</p>
      </div>

      {/* Reading Materials Card */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
        <p className="text-sm font-medium text-[#676E85]">Reading Materials</p>
        <p className="text-3xl font-bold text-[#0A1B39] mt-2">24</p>
      </div>
    </div>
  );
}
