"use client";

import { useState } from "react";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Lock, Shield, User, Globe, CreditCard, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs = [
    { id: "general", label: "General Profile", icon: User },
    { id: "security", label: "Security & Passwords", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Payment Gateway", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-6xl mx-auto">
        {/* Unboxed Modern Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1B39]">
              Platform Settings
            </h1>
            <p className="text-xs sm:text-sm text-[#676E85] mt-1 font-normal">
              Manage administrator profile, security credentials, and system preferences.
            </p>
          </div>
          {isSaved && (
            <span className="text-xs font-semibold text-[#17A546] bg-[#17A546]/10 px-3 py-1.5 rounded-md border border-[#17A546]/20 animate-in fade-in">
              ✓ Changes saved successfully!
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Sidebar */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-[#17A546]/10 text-[#17A546] font-bold"
                      : "text-[#676E85] hover:bg-neutral-100 hover:text-[#0A1B39]"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4 shrink-0", activeTab === tab.id ? "text-[#17A546]" : "text-[#98A2B3]")} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === "general" && (
              <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0A1B39]">Profile Details</h3>
                  <p className="text-xs text-[#676E85] mt-0.5">Update administrator name and contact email.</p>
                </div>
                
                <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
                  <div className="h-14 w-14 rounded-full bg-[#17A546]/10 flex items-center justify-center border border-[#17A546]/20 text-[#17A546] font-bold text-lg shrink-0">
                    A
                  </div>
                  <div>
                    <Button variant="outline" className="border-neutral-200 font-semibold text-xs h-8 px-3 rounded-md mb-1">
                      Change Photo
                    </Button>
                    <p className="text-[11px] text-[#98A2B3]">PNG, JPG up to 2MB.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" defaultValue="Super" className="rounded-md text-xs h-9" />
                    <Input label="Last Name" defaultValue="Admin" className="rounded-md text-xs h-9" />
                  </div>
                  <Input label="Email Address" defaultValue="admin@bashacademy.com" type="email" className="rounded-md text-xs h-9" />
                  
                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-[#17A546] hover:bg-[#128638] text-white font-semibold rounded-md h-9 px-4 text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0A1B39]">Change Password</h3>
                  <p className="text-xs text-[#676E85] mt-0.5">Ensure your administrator account uses a strong password.</p>
                </div>
                <div className="space-y-4">
                  <Input label="Current Password" type="password" iconType="password" placeholder="••••••••" className="rounded-md text-xs h-9" />
                  <Input label="New Password" type="password" iconType="password" placeholder="••••••••" className="rounded-md text-xs h-9" />
                  <Input label="Confirm Password" type="password" iconType="password" placeholder="••••••••" className="rounded-md text-xs h-9" />
                  
                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-[#17A546] hover:bg-[#128638] text-white font-semibold rounded-md h-9 px-4 text-xs shadow-xs"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0A1B39]">System Alerts</h3>
                  <p className="text-xs text-[#676E85] mt-0.5">Choose which notifications you receive via email.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Payment Submissions", desc: "Alert when students upload bank transfer receipts." },
                    { title: "Support Ticket Escalations", desc: "Notification on urgent student support requests." },
                    { title: "Student Enrollments", desc: "Daily summary of course purchases and upgrades." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-none">
                      <div>
                        <p className="text-xs font-semibold text-[#0A1B39]">{item.title}</p>
                        <p className="text-[11px] text-[#676E85] mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#17A546]"></div>
                      </label>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-[#17A546] hover:bg-[#128638] text-white font-semibold rounded-md h-9 px-4 text-xs shadow-xs"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "billing" && (
              <div className="bg-white rounded-md border border-neutral-200/80 shadow-2xs p-6 min-h-[260px] flex items-center justify-center">
                 <div className="text-center">
                    <CreditCard className="h-8 w-8 text-[#98A2B3] mx-auto mb-2" />
                    <h3 className="text-base font-bold text-[#0A1B39] mb-1">Paystack Gateway Configuration</h3>
                    <p className="text-xs text-[#676E85]">Integrated with Paystack live webhook & direct transfer verification.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
