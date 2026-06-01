"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  return (
    <form className="space-y-5" action="#" method="POST">
      <div className="space-y-4">
        <Input
          label="Email address"
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          id="password"
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
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 text-brand-green focus:ring-brand-green accent-[#17A546]"
          />
          <label htmlFor="remember-me" className="ml-2 block text-(--heading)">
            Remember me
          </label>
        </div>
        <Link href="#" className="font-semibold text-brand-green hover:text-brand-green/80 transition-colors">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-xl h-12 font-bold shadow-lg shadow-[#17A546]/20">
        Sign in
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-(--card) px-3 text-(--muted)">or continue with</span>
        </div>
      </div>

      {/* Social login */}
      <button
        type="button"
        className="w-full h-12 rounded-xl border border-border bg-(--card) text-sm font-medium text-(--heading) hover:bg-[rgba(255,255,255,0.08)] transition-colors flex items-center justify-center gap-3"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
