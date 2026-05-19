"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  return (
    <form className="space-y-5" action="#" method="POST">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            id="first-name"
            name="first-name"
            type="text"
            autoComplete="given-name"
            required
            placeholder="John"
          />
          <Input
            label="Last Name"
            id="last-name"
            name="last-name"
            type="text"
            autoComplete="family-name"
            required
            placeholder="Doe"
          />
        </div>
        <Input
          label="Email address"
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="john@example.com"
        />
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Min. 8 characters"
          iconType="password"
        />
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-[#485066] uppercase tracking-wide">
            Target Exam
          </label>
          <select className="flex h-12 w-full items-center rounded-xl border border-[#D1D5DB] bg-white px-3 py-2 text-base text-[#070D17] transition-colors focus-visible:outline-none focus-visible:border-[#3B82F6] focus-visible:ring-1 focus-visible:ring-[#3B82F6] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2398A2B3%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10">
            <option value="">Select your exam</option>
            <option value="jamb">JAMB</option>
            <option value="waec">WAEC</option>
            <option value="both">Both (JAMB & WAEC)</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-xl h-12 font-bold shadow-lg shadow-[#17A546]/20">
        Create account
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#98A2B3]">or continue with</span>
        </div>
      </div>

      {/* Social login */}
      <button
        type="button"
        className="w-full h-12 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-[#0A1B39] hover:bg-neutral-50 transition-colors flex items-center justify-center gap-3"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <p className="text-xs text-center text-[#98A2B3]">
        By signing up, you agree to our{" "}
        <a href="#" className="text-brand-green hover:underline">Terms</a> and{" "}
        <a href="#" className="text-brand-green hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
