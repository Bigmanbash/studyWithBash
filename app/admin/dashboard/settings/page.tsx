"use client";

import { useState } from "react";
import { AdminDashboardHeader } from "@/components/admin/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Lock, User, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
  ];

  return (
    <>
      <AdminDashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-5xl">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B39]">Settings</h2>
          <p className="text-sm sm:text-base text-[#676E85] mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-[#17A546]/10 text-[#17A546]"
                      : "text-[#676E85] hover:bg-neutral-100 hover:text-[#0A1B39]"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-[#17A546]" : "text-[#98A2B3]")} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-6">
            {activeTab === "general" && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-lg font-bold text-[#0A1B39] mb-6">Profile Information</h3>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-20 w-20 rounded-full bg-[#17A546]/10 flex items-center justify-center border-4 border-white shadow-md">
                    <span className="text-2xl font-bold text-[#17A546]">A</span>
                  </div>
                  <div>
                    <Button variant="outline" className="border-neutral-200 font-semibold mb-2">Change Avatar</Button>
                    <p className="text-xs text-[#98A2B3]">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="First Name" defaultValue="Admin" />
                    <Input label="Last Name" defaultValue="User" />
                  </div>
                  <Input label="Email Address" defaultValue="admin@bashacademy.com" type="email" />
                  <Input label="Role" defaultValue="Super Administrator" disabled />
                  
                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <Button className="bg-[#17A546] hover:bg-[#17A546]/90 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-[#17A546]/20">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-lg font-bold text-[#0A1B39] mb-6">Change Password</h3>
                <div className="space-y-5">
                  <Input label="Current Password" type="password" iconType="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" iconType="password" placeholder="••••••••" />
                  <Input label="Confirm New Password" type="password" iconType="password" placeholder="••••••••" />
                  
                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <Button className="bg-[#17A546] hover:bg-[#17A546]/90 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-[#17A546]/20">
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-lg font-bold text-[#0A1B39] mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  {[
                    { title: "New Payments", desc: "Get notified when a new payment is submitted." },
                    { title: "Support Tickets", desc: "Get notified when a new support ticket is opened." },
                    { title: "System Alerts", desc: "Receive alerts about system performance or downtime." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#0A1B39]">{item.title}</p>
                        <p className="text-xs text-[#676E85] mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17A546]"></div>
                      </label>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <Button className="bg-[#17A546] hover:bg-[#17A546]/90 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-[#17A546]/20">
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "billing" && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8 flex items-center justify-center min-h-[300px]">
                 <div className="text-center">
                    <CreditCard className="h-10 w-10 text-[#98A2B3] mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-[#0A1B39] mb-1">Billing & Plans</h3>
                    <p className="text-sm text-[#676E85]">This feature is currently under development.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
