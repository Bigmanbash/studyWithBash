"use client";

import { useState } from "react";
import { User, Mail, Shield, Save } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { useStudentStore } from "@/store/studentStore";
import { PageHeader } from "@/components/dashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

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
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <div className="flex-1 w-full">
                <Input
                  id="full-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  icon={<User size={18} />}
                />
              </div>
              <Button
                onClick={handleUpdateName}
                disabled={isUpdatingName || name === session?.user?.name || !name.trim()}
                className="w-full sm:w-auto h-11 sm:h-12 bg-brand-green hover:bg-brand-green/90 text-white px-7 rounded-md font-bold shadow-lg shadow-[#17A546]/20 transition-all disabled:opacity-70"
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
            <label className="text-[13px] font-bold uppercase tracking-wider text-[#98A2B3] flex items-center gap-2 mb-2.5">
              Email Address
            </label>
            <div className="w-full">
              <Input
                id="email-address"
                type="email"
                value={session?.user?.email || ""}
                disabled
                icon={<Mail size={18} />}
                className="opacity-70 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-[#98A2B3] mt-2">Email address cannot be changed currently.</p>
          </div>

          <div className="pt-6 border-t border-neutral-100">
            {!showPasswordForm ? (
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto h-11 sm:h-12 border-neutral-200 hover:border-brand-green hover:bg-brand-green/5 text-[#0A1B39] hover:text-brand-green rounded-md font-bold transition-all"
              >
                <Shield className="w-4 h-4" />
                Change Password
              </Button>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-5 bg-neutral-50/80 p-5 sm:p-6 rounded- border border-neutral-200/80 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="font-bold text-[#0A1B39] text-lg flex items-center gap-2 border-b border-neutral-200 pb-3">
                  <Shield className="w-5 h-5 text-[#17A546]" /> Security
                </h3>

                <div className="space-y-4 pt-2">
                  <Input
                    id="current-password"
                    label="Current Password"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    iconType="password"
                    icon={<Lock size={18} />}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="new-password"
                      label="New Password"
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      iconType="password"
                      icon={<Lock size={18} />}
                    />
                    <Input
                      id="confirm-password"
                      label="Confirm Password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      iconType="password"
                      icon={<Lock size={18} />}
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 mt-2 border-t border-neutral-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordForm(false)}
                    disabled={isUpdatingPassword}
                    className="w-full sm:w-auto h-11 border-neutral-200 text-[#676E85] rounded-md font-bold transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full sm:w-auto h-11 bg-brand-green hover:bg-brand-green/90 text-white px-8 rounded-md font-bold shadow-lg shadow-[#0A1B39]/10 transition-all disabled:opacity-70"
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
    </div>
  );
}
