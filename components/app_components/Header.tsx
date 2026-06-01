"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-border dark:border-neutral-800">
      <div className="container flex h-[72px] items-center justify-between">
        {/* Logo on the left */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-90"
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#17A546] text-white group-hover:bg-[#14933E] transition-colors duration-300">
            <span className="font-serif text-[17px] font-bold leading-none translate-y-[0.5px]">
              B
            </span>
          </div>
          <span className="text-[21px] font-bold text-(--heading) dark:text-white tracking-tight">
            Bash
            <span className="font-medium text-(--muted) dark:text-neutral-300">
              Academy
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          <Link
            href="/courses"
            className="text-(--muted) dark:text-neutral-300 hover:text-(--heading) dark:hover:text-white transition-colors"
          >
            Courses
          </Link>
          <Link
            href="/pricing"
            className="text-(--muted) dark:text-neutral-300 hover:text-(--heading) dark:hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-(--muted) dark:text-neutral-300 hover:text-(--heading) dark:hover:text-white transition-colors"
          >
            About Us
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-(--heading) dark:text-white hover:bg-[rgba(255,255,255,0.1)] dark:hover:bg-neutral-800 rounded-lg"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted ? (
              isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            className="hidden sm:inline-flex border-border dark:border-neutral-700 text-(--heading) dark:text-white hover:bg-[rgba(255,255,255,0.08)] dark:hover:bg-neutral-900 px-5 h-10 font-semibold transition-colors"
          >
            Log In
          </Button>
          <Button className="hidden md:inline-flex bg-[#17A546] hover:bg-[#14933E] text-white px-6 h-10 font-semibold shadow-lg shadow-[#17A546]/20 hover:-translate-y-1 transition-all">
            Get Started
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-[rgba(255,255,255,0.08)] dark:hover:bg-neutral-800 rounded-lg text-(--heading) dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 top-[72px] z-40 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="md:hidden fixed top-[72px] left-0 w-full z-50 bg-(--card) dark:bg-slate-950 border-b border-border dark:border-neutral-800 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="container py-6 flex flex-col gap-2">
              <Link
                href="/courses"
                className="text-[17px] font-medium text-(--heading) dark:text-white py-3 border-b border-border/60 dark:border-neutral-700/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/pricing"
                className="text-[17px] font-medium text-(--heading) dark:text-white py-3 border-b border-border/60 dark:border-neutral-700/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-[17px] font-medium text-(--heading) dark:text-white py-3 border-b border-border/60 dark:border-neutral-700/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <div className="flex flex-col gap-3 mt-6">
                <Button
                  variant="outline"
                  className="w-full justify-center border-border dark:border-neutral-700 text-(--heading) dark:text-white h-12 font-semibold text-[16px] transition-colors hover:bg-[rgba(255,255,255,0.08)] dark:hover:bg-neutral-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Button>
                <Button
                  className="w-full justify-center bg-[#17A546] hover:bg-[#14933E] text-white h-12 font-semibold text-[16px] shadow-lg shadow-[#17A546]/20 hover:-translate-y-1 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
