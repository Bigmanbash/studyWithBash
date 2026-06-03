import { Bell, Moon, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1B39]">Settings</h1>
        <p className="text-[#676E85] mt-2">Manage your app preferences.</p>
      </div>

      <div className="space-y-6">
        
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#17A546]/10 text-[#17A546] rounded-xl">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0A1B39]">Notifications</h2>
              <p className="text-sm text-[#676E85]">Control what emails you receive.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#0A1B39] font-medium">New Course Announcements</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#17A546] rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#0A1B39] font-medium">Purchase Receipts</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#17A546] rounded" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#17A546]/10 text-[#17A546] rounded-xl">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0A1B39]">Appearance</h2>
              <p className="text-sm text-[#676E85]">Customize the UI theme.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 py-3 border-2 border-[#17A546] text-[#17A546] font-semibold rounded-xl">Light</button>
            <button className="flex-1 py-3 border border-neutral-200 text-[#676E85] font-medium rounded-xl hover:border-neutral-300 transition-colors">Dark (Soon)</button>
          </div>
        </div>

      </div>
    </div>
  );
}
