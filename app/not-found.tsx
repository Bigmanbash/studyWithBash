"use client";

import Link from "next/link";
import { Header } from "@/components/app_components/Header";
import { Footer } from "@/components/app_components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  LogIn,
  HelpCircle,
  ChevronRight,
  Sparkles,
  PenTool,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 md:py-20 relative overflow-hidden bg-gradient-to-b from-white via-[#F7F9FC]/60 to-white">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] bg-gradient-to-tr from-[#17A546]/10 via-[#0A1B39]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-[820px] mx-auto px-4 sm:px-6 text-center">

          {/* ── ANIMATED BOOK & 404 ILLUSTRATION ────────────────── */}
          <div className="relative flex flex-col items-center justify-center mb-6">

            {/* Animated Book Scene */}
            <div className="relative w-36 h-28 sm:w-44 sm:h-32 mb-4 animate-[float_3.5s_ease-in-out_infinite]">
              {/* Soft ground shadow */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-3 bg-[#0A1B39]/10 rounded-full blur-sm animate-[shadowPulse_3.5s_ease-in-out_infinite]" />

              {/* Floating Sparkles */}
              <div className="absolute -top-3 -right-2 text-[#17A546] animate-bounce">
                <PenTool className="w-5 h-5" />
              </div>
              <div className="absolute top-1 -left-3 text-[#DEAB06] animate-pulse">
                <PenTool className="w-4 h-4" />
              </div>

              {/* Book Spine and Cover Base */}
              <div className="absolute inset-0 flex items-center justify-center [perspective:1000px]">

                {/* Book Base (Hardcover) */}
                <div className="relative w-32 sm:w-40 h-24 sm:h-28 bg-[#14933E] rounded-md shadow-xl flex border-b-4 border-[#0E7B33]">

                  {/* Left Open Page */}
                  <div className="w-1/2 h-full bg-[#FFFFFF] rounded-l-md border-r border-neutral-200 p-2 sm:p-2.5 flex flex-col justify-between shadow-inner">
                    <div className="space-y-1.5 pt-1">
                      <div className="h-1.5 w-10 sm:w-14 bg-[#17A546]/20 rounded-full" />
                      <div className="h-1.5 w-8 sm:w-11 bg-neutral-200 rounded-full" />
                      <div className="h-1.5 w-11 sm:w-13 bg-neutral-200 rounded-full" />
                      <div className="h-1.5 w-7 sm:w-9 bg-neutral-200 rounded-full" />
                    </div>
                    <div className="text-[9px] font-bold text-[#17A546] font-mono">404</div>
                  </div>

                  {/* Right Open Page */}
                  <div className="w-1/2 h-full bg-[#FAFAFA] rounded-r-md p-2 sm:p-2.5 flex flex-col justify-between shadow-inner">
                    <div className="space-y-1.5 pt-1">
                      <div className="h-1.5 w-9 sm:w-12 bg-neutral-200 rounded-full" />
                      <div className="h-1.5 w-11 sm:w-13 bg-neutral-200 rounded-full" />
                      <div className="h-1.5 w-8 sm:w-10 bg-[#17A546]/20 rounded-full" />
                      <div className="h-1.5 w-6 sm:w-8 bg-neutral-200 rounded-full" />
                    </div>
                    <div className="text-[9px] font-bold text-neutral-300 text-right font-mono">PAGE</div>
                  </div>

                  {/* Flipping Center Page Animation */}
                  <div className="absolute inset-y-0 left-1/2 w-1/2 origin-left bg-white rounded-r-md border-l border-neutral-200 p-2 sm:p-2.5 shadow-md animate-[pageFlip_2.8s_ease-in-out_infinite]">
                    <div className="space-y-1.5 pt-1">
                      <div className="h-1.5 w-8 bg-[#17A546]/30 rounded-full" />
                      <div className="h-1.5 w-10 bg-neutral-200 rounded-full" />
                      <div className="h-1.5 w-6 bg-neutral-200 rounded-full" />
                    </div>
                  </div>

                  {/* Golden Bookmark Ribbon hanging from center */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-7 sm:h-9 bg-[#DEAB06] rounded-b-sm shadow-xs z-10" />
                </div>
              </div>
            </div>

            {/* 404 Typography */}
            <div className="relative select-none">
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-[#0A1B39] tracking-tight leading-none">
                4<span className="text-[#17A546]">0</span>4
              </h1>
            </div>
          </div>

          {/* Headline & Description */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0A1B39] tracking-tight mb-2.5">
            Oops! We couldn&apos;t find that page
          </h2>
          <p className="text-xs sm:text-sm text-[#676E85] max-w-[520px] mx-auto mb-7 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let&apos;s get you back on track!
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mb-12">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#17A546] hover:bg-[#14933E] text-white px-6 h-10 font-semibold text-xs sm:text-sm rounded-md shadow-md shadow-[#17A546]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Home
              </Button>
            </Link>
            <Link href="/courses" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-neutral-200 text-[#0A1B39] hover:bg-neutral-50 px-6 h-10 font-semibold text-xs sm:text-sm rounded-md transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#17A546]" />
                Explore Courses
              </Button>
            </Link>
          </div>

          {/* Helpful Quick Links Grid */}
          <div className="border-t border-neutral-200/80 pt-8 text-left">
            <p className="text-[11px] font-bold text-[#676E85] uppercase tracking-wider text-center mb-5">
              Popular Destinations
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[760px] mx-auto">
              <Link
                href="/courses"
                className="group flex items-center justify-between p-3 rounded-md border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-[#17A546]/40 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-[#17A546]/10 text-[#17A546] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0A1B39] group-hover:text-[#17A546] transition-colors">
                      Course Library
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#676E85]">SS1-SS3 & WAEC/JAMB</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#17A546] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/login"
                className="group flex items-center justify-between p-3 rounded-md border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-[#17A546]/40 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0A1B39] group-hover:text-blue-600 transition-colors">
                      Student Login
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#676E85]">Access your courses</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/contact_us"
                className="group flex items-center justify-between p-3 rounded-md border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-[#17A546]/40 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0A1B39] group-hover:text-amber-600 transition-colors">
                      Help & Support
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#676E85]">Get assistance anytime</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
