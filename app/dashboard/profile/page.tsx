"use client";

import { useState } from "react";
import { User, Mail, Shield, Save, Lock, Phone, UserPlus, Hash } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { useStudentStore } from "@/store/studentStore";
import { PageHeader } from "@/components/dashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

      <div className="space-y-6">

        {/* Profile Header Card */}
        <div className="bg-white border border-neutral-200/80 rounded-md p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            <div className="h-24 w-24 shrink-0 rounded-full bg-linear-to-br from-[#17A546]/20 to-[#17A546]/5 flex items-center justify-center text-[#17A546] font-extrabold text-4xl uppercase ring-4 ring-white shadow-sm border border-[#17A546]/20">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col justify-center mt-1 sm:mt-3">
              <h2 className="text-2xl font-bold text-[#0A1B39] tracking-tight">{session?.user?.name || "Loading..."}</h2>
              <p className="text-[15px] text-[#676E85] mt-0.5 font-medium">{session?.user?.email || "..."}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#17A546]/10 text-[#17A546] text-xs font-bold uppercase tracking-wider w-fit mx-auto sm:mx-0 border border-[#17A546]/20">
                <Shield className="w-3.5 h-3.5" /> 
                {(session?.user as any)?.role || "Student"} Account
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info Form */}
          <div className="bg-white border border-neutral-200/80 rounded-md p-6 sm:p-8 shadow-2xs">
            <h3 className="font-bold text-[#0A1B39] text-lg mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#17A546]" />
              Personal Information
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-[#0A1B39] block mb-2">
                  Full Name
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="flex-1 w-full relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
                    <Input
                      id="full-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-11 h-12 bg-white rounded-md border-neutral-200/80 shadow-sm focus:border-[#17A546] focus:ring-[#17A546]/20"
                    />
                  </div>
                  <Button
                    onClick={handleUpdateName}
                    disabled={isUpdatingName || name === session?.user?.name || !name.trim()}
                    className="w-full sm:w-auto h-12 bg-[#17A546] hover:bg-[#128a39] text-white px-7 rounded-md font-bold shadow-sm transition-all shrink-0"
                  >
                    {isUpdatingName ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-md animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#0A1B39] block mb-2">
                  Email Address
                </label>
                <div className="w-full relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
                  <Input
                    id="email-address"
                    type="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="pl-11 h-12 bg-neutral-50/70 border-neutral-200/80 text-neutral-500 cursor-not-allowed shadow-none"
                  />
                </div>
                <p className="text-xs text-[#98A2B3] mt-2 italic">Email address cannot be changed currently.</p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white border border-neutral-200/80 rounded-md p-6 sm:p-8 shadow-2xs">
            <h3 className="font-bold text-[#0A1B39] text-lg mb-6 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#17A546]" />
              Account Details
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] flex items-center gap-2 mb-1.5">
                  <UserPlus className="w-3.5 h-3.5" /> Referred By
                </label>
                <div className="flex items-center gap-3 bg-neutral-50/80 px-4 py-3 rounded-md border border-neutral-200/80 text-sm font-medium text-[#0A1B39]">
                  {(session?.user as any)?.referredBy || "No referrer"}
                </div>
              </div>
              
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] flex items-center gap-2 mb-1.5">
                  <Hash className="w-3.5 h-3.5" /> Referral Code Used
                </label>
                <div className="flex items-center gap-3 bg-neutral-50/80 px-4 py-3 rounded-md border border-neutral-200/80 text-sm font-medium text-[#0A1B39]">
                  {(session?.user as any)?.referralCodeUsed || "None"}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] flex items-center gap-2 mb-1.5">
                  <Phone className="w-3.5 h-3.5" /> WhatsApp Number
                </label>
                <div className="flex items-center gap-3 bg-neutral-50/80 px-4 py-3 rounded-md border border-neutral-200/80 text-sm font-medium text-[#0A1B39]">
                  {(session?.user as any)?.whatsappNumber || "Not provided"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white border border-neutral-200/80 rounded-md p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-[#0A1B39] text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#17A546]" />
                Security Settings
              </h3>
              <p className="text-sm text-[#676E85] mt-1">Manage your password and security preferences.</p>
            </div>
            
            {!showPasswordForm && (
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
                className="h-11 border-neutral-200/80 hover:border-[#17A546] hover:bg-[#17A546]/5 text-[#0A1B39] hover:text-[#17A546] rounded-md font-bold transition-all shadow-sm bg-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handleUpdatePassword} className="space-y-5 bg-neutral-50/50 p-5 sm:p-6 rounded-md border border-neutral-200/80 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#0A1B39] block mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
                    <Input
                      id="current-password"
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-11 h-12 bg-white rounded-md border-neutral-200/80 shadow-sm focus:border-[#17A546] focus:ring-[#17A546]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-[#0A1B39] block mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
                      <Input
                        id="new-password"
                        type="password"
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-11 h-12 bg-white rounded-md border-neutral-200/80 shadow-sm focus:border-[#17A546] focus:ring-[#17A546]/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0A1B39] block mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
                      <Input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-11 h-12 bg-white rounded-md border-neutral-200/80 shadow-sm focus:border-[#17A546] focus:ring-[#17A546]/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 mt-2 border-t border-neutral-200/80">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordForm(false)}
                  disabled={isUpdatingPassword}
                  className="w-full sm:w-auto h-11 border-neutral-200/80 text-[#676E85] hover:text-[#0A1B39] hover:bg-neutral-50 rounded-md font-bold transition-all shadow-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full sm:w-auto h-11 bg-[#17A546] hover:bg-[#128a39] text-white px-8 rounded-md font-bold shadow-sm transition-all"
                >
                  {isUpdatingPassword ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-md animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
