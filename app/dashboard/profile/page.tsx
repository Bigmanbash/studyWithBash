import { User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1B39]">Profile</h1>
        <p className="text-[#676E85] mt-2">Manage your personal information.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8 space-y-8">
        
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-3xl">
            C
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0A1B39]">Chioma E.</h2>
            <p className="text-[#676E85]">chioma@example.com</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-[#676E85] flex items-center gap-2 mb-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input 
              type="text" 
              defaultValue="Chioma E." 
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-[#0A1B39] focus:outline-none focus:ring-2 focus:ring-[#17A546]/20 focus:border-[#17A546] transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#676E85] flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input 
              type="email" 
              defaultValue="chioma@example.com" 
              disabled
              className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-[#676E85] cursor-not-allowed"
            />
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              <Shield className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
