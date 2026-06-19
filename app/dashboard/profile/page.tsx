"use client";

import { useState } from "react";
import { User, Mail, Shield, Save } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { useStudentStore } from "@/store/studentStore";
import { PageHeader } from "@/components/dashboard";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { setStatusModal } = useStudentStore();
  
  const [name, setName] = useState(session?.user?.name || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Update initial name when session loads
  useState(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  });

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    
    setIsUpdatingName(true);
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });
      
      if (error) throw error;
      
      setStatusModal({
        type: "success",
        title: "Profile Updated",
        message: "Your name has been updated successfully.",
      });
    } catch (err: any) {
      setStatusModal({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update profile.",
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusModal({
        type: "error",
        title: "Password Mismatch",
        message: "New password and confirm password do not match.",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      setStatusModal({
        type: "error",
        title: "Invalid Password",
        message: "Password must be at least 8 characters long.",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) throw error;

      setStatusModal({
        type: "success",
        title: "Password Updated",
        message: "Your password has been changed successfully.",
      });
      
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setStatusModal({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to change password. Make sure your current password is correct.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-3xl mx-auto">
      <PageHeader
        title="Profile"
        description="Manage your personal information."
      />

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8 space-y-8">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
          <div className="h-24 w-24 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-extrabold text-4xl uppercase ring-4 ring-white shadow-sm border border-[#17A546]/20">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col justify-center mt-1 sm:mt-3">
            <h2 className="text-2xl font-bold text-[#0A1B39] tracking-tight">{session?.user?.name || "Loading..."}</h2>
            <p className="text-[15px] text-[#676E85] mt-0.5">{session?.user?.email || "..."}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#17A546]/10 text-[#17A546] text-xs font-semibold w-fit mx-auto sm:mx-0">
              <Shield className="w-3.5 h-3.5" /> Student Account
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6 pt-4">
          <div>
            <label className="text-[13px] font-bold uppercase tracking-wider text-[#98A2B3] flex items-center gap-2 mb-2.5">
               Full Name
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#98A2B3]" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-neutral-50/50 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3 text-[#0A1B39] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#17A546]/20 focus:border-[#17A546] transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={handleUpdateName}
                disabled={isUpdatingName || name === session?.user?.name || !name.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#17A546] hover:bg-[#128638] disabled:opacity-50 disabled:hover:bg-[#17A546] text-white px-7 py-3 rounded-xl font-semibold transition-all shadow-sm active:scale-95"
              >
                {isUpdatingName ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[13px] font-bold uppercase tracking-wider text-[#98A2B3] flex items-center gap-2 mb-2.5">
               Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#98A2B3]" />
              </div>
              <input 
                type="email" 
                value={session?.user?.email || ""} 
                disabled
                className="w-full bg-neutral-100/50 border border-neutral-200/50 rounded-xl pl-11 pr-4 py-3 text-[#676E85] font-medium cursor-not-allowed shadow-inner"
              />
            </div>
            <p className="text-xs text-[#98A2B3] mt-2">Email address cannot be changed currently.</p>
          </div>

          <div className="pt-6 border-t border-neutral-100">
            {!showPasswordForm ? (
              <button 
                onClick={() => setShowPasswordForm(true)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white border border-neutral-200 hover:border-[#17A546] hover:bg-[#17A546]/5 text-[#0A1B39] hover:text-[#17A546] px-6 py-3 rounded-xl font-semibold transition-all shadow-sm"
              >
                <Shield className="w-4 h-4" />
                Change Password
              </button>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-5 bg-neutral-50/80 p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="font-bold text-[#0A1B39] text-lg flex items-center gap-2 border-b border-neutral-200 pb-3">
                  <Shield className="w-5 h-5 text-[#17A546]" /> Security
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-[#0A1B39] block mb-1.5">Current Password</label>
                    <input 
                      type="password" 
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[#0A1B39] focus:outline-none focus:ring-2 focus:ring-[#17A546]/20 focus:border-[#17A546] transition-all shadow-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#0A1B39] block mb-1.5">New Password</label>
                      <input 
                        type="password" 
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[#0A1B39] focus:outline-none focus:ring-2 focus:ring-[#17A546]/20 focus:border-[#17A546] transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#0A1B39] block mb-1.5">Confirm Password</label>
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[#0A1B39] focus:outline-none focus:ring-2 focus:ring-[#17A546]/20 focus:border-[#17A546] transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-4 border-t border-neutral-200">
                  <button 
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    disabled={isUpdatingPassword}
                    className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-[#676E85] border border-neutral-200 px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full sm:w-auto bg-[#0A1B39] hover:bg-[#0A1B39]/90 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95 flex justify-center items-center"
                  >
                    {isUpdatingPassword ? (
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
