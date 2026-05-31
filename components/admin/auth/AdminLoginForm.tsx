"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";

export function AdminLoginForm() {
  return (
    <form className="space-y-5" action="#" method="POST">
      <div className="space-y-4">
        <Input
          label="Admin Email"
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@bashacademy.com"
        />
        <Input
          label="Password"
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          iconType="password"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input
            id="remember-admin"
            name="remember-admin"
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 text-brand-green focus:ring-brand-green accent-[#17A546]"
          />
          <label htmlFor="remember-admin" className="ml-2 block text-[#0A1B39]">
            Keep me signed in
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full shadow-lg shadow-[#17A546]/20 hover:-translate-y-1 transition-transform cursor-pointer"
      >
        <Shield className="h-4 w-4 mr-2" />
        Sign in to Admin
      </Button>

      {/* Security notice */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-[#F7F9FC] border border-neutral-100">
        <div className="h-8 w-8 rounded-lg bg-[#17A546]/10 flex items-center justify-center shrink-0">
          <Shield className="h-4 w-4 text-[#17A546]" />
        </div>
        <p className="text-xs text-[#676E85] leading-relaxed">
          This portal is restricted to authorized administrators only. All access is monitored and logged.
        </p>
      </div>
    </form>
  );
}
