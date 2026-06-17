"use client";

import { useState } from "react";
import { User, Mail, Shield, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { useStudentStore } from "@/store/studentStore";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1B39]">Profile</h1>
        <p className="text-[#676E85] mt-2">Manage your personal information.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8 space-y-8">
        
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-3xl uppercase">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0A1B39]">{session?.user?.name || "Loading..."}</h2>
            <p className="text-[#676E85]">{session?.user?.email || "..."}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-[#676E85] flex items-center gap-2 mb-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-[#0A1B39] focus:outline-none focus:ring-2 focus:ring-[#17A546]/20 focus:border-[#17A546] transition-all"
              />
              <button 
                onClick={handleUpdateName}
                disabled={isUpdatingName || name === session?.user?.name || !name.trim()}
                className="flex items-center justify-center gap-2 bg-[#17A546] hover:bg-[#128638] disabled:opacity-50 disabled:hover:bg-[#17A546] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
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
            <label className="text-sm font-medium text-[#676E85] flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input 
              type="email" 
              value={session?.user?.email || ""} 
              disabled
              className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-[#676E85] cursor-not-allowed"
            />
          </div>

          <div className="pt-4 border-t border-neutral-100">
            {!showPasswordForm ? (
              <button 
                onClick={() => setShowPasswordForm(true)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <Shield className="w-4 h-4" />
                Change Password
              </button>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4 bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                <h3 className="font-semibold text-[#0A1B39] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#17A546]" /> Change Password
                </h3>
                
                <div>
                  <label className="text-sm text-[#676E85] block mb-1">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-[#0A1B39] focus:outline-none focus:ring-2 focus:ring-[#17A546]/20 focus:border-[#17A546] transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#676E85] block mb-1">New Password</label>
                    <input 
                      type="password" 
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-[#0A1B39] focus:outline-none focus:ring-2 focus:ring-[#17A546]/20 focus:border-[#17A546] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#676E85] block mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-[#0A1B39] focus:outline-none focus:ring-2 focus:ring-[#17A546]/20 focus:border-[#17A546] transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <button 
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="flex-1 sm:flex-none bg-[#17A546] hover:bg-[#128638] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex justify-center items-center h-[44px]"
                  >
                    {isUpdatingPassword ? (
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Update Password"
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    disabled={isUpdatingPassword}
                    className="flex-1 sm:flex-none bg-white hover:bg-neutral-50 text-[#676E85] border border-neutral-200 px-6 py-2.5 rounded-lg font-semibold transition-colors h-[44px]"
                  >
                    Cancel
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
