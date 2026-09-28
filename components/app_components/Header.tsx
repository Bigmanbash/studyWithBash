"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-neutral-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-[72px] items-center justify-between">
                {/* Logo on the left */}
                <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-[#17A546] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                        <span className="font-serif text-[17px] font-bold leading-none translate-y-[0.5px]">B</span>
                    </div>
                    <span className="text-[20px] font-extrabold text-[#0A1B39] tracking-tight">
                        Bash<span className="font-semibold text-[#17A546]">Academy</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-semibold text-[#676E85]">
                    <Link href="/" className="hover:text-[#17A546] transition-colors">
                        Home
                    </Link>
                    <Link href="/courses" className="hover:text-[#17A546] transition-colors">
                        Courses
                    </Link>
                    <Link href="/about" className="hover:text-[#17A546] transition-colors">
                        About
                    </Link>
                </nav>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" className="hidden sm:inline-flex text-[#0A1B39] hover:bg-neutral-100 px-4 h-9 text-xs sm:text-sm font-semibold transition-colors">
                            Log In
                        </Button>
                    </Link>

                    <Link href="/signup">
                        <Button className="hidden sm:inline-flex bg-[#17A546] hover:bg-[#128638] text-white px-5 h-9 text-xs sm:text-sm font-bold rounded-md shadow-md shadow-[#17A546]/20 hover:-translate-y-0.5 transition-all">
                            Get Started!
                        </Button>
                    </Link>

                    {/* Mobile Menu Toggle Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden hover:bg-neutral-100 rounded-md text-[#0A1B39]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 top-[72px] z-40 bg-black/20 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div className="md:hidden fixed top-[72px] left-0 w-full z-50 bg-white border-b border-neutral-100 shadow-xl animate-in slide-in-from-top-2 duration-200">
                        <div className="px-6 py-6 flex flex-col gap-1">
                            <Link href="/" className="text-base font-semibold text-[#0A1B39] py-2.5 border-b border-neutral-100" onClick={() => setIsMobileMenuOpen(false)}>
                                Home
                            </Link>
                            <Link href="/courses" className="text-base font-semibold text-[#0A1B39] py-2.5 border-b border-neutral-100" onClick={() => setIsMobileMenuOpen(false)}>
                                Courses
                            </Link>
                            <Link href="#agents" className="text-base font-semibold text-[#0A1B39] py-2.5 border-b border-neutral-100" onClick={() => setIsMobileMenuOpen(false)}>
                                Agents
                            </Link>
                            <Link href="#pricing" className="text-base font-semibold text-[#0A1B39] py-2.5 border-b border-neutral-100" onClick={() => setIsMobileMenuOpen(false)}>
                                Pricing
                            </Link>
                            <Link href="/about" className="text-base font-semibold text-[#0A1B39] py-2.5 border-b border-neutral-100" onClick={() => setIsMobileMenuOpen(false)}>
                                About Us
                            </Link>

                            <div className="flex flex-col gap-2.5 mt-5">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full justify-center border-neutral-200 text-[#0A1B39] h-11 font-semibold text-sm transition-colors rounded-md">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full justify-center bg-[#17A546] hover:bg-[#128638] text-white h-11 font-bold text-sm shadow-md shadow-[#17A546]/20 transition-all rounded-md">
                                        Get Started!
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
