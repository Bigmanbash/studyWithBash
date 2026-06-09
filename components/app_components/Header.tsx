"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-neutral-100">
            <div className="container flex h-[72px] items-center justify-between">
                {/* Logo on the left */}
                <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#17A546] text-white group-hover:bg-[#14933E] transition-colors duration-300">
                        <span className="font-serif text-[17px] font-bold leading-none translate-y-[0.5px]">B</span>
                    </div>
                    <span className="text-[21px] font-bold text-[#0A1B39] tracking-tight">
                        Bash<span className="font-medium text-[#676E85]">Academy</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
                    <Link href="/courses" className="text-[#676E85] hover:text-[#0A1B39] transition-colors">
                        Courses
                    </Link>
                    <Link href="/pricing" className="text-[#676E85] hover:text-[#0A1B39] transition-colors">
                        Pricing
                    </Link>
                    <Link href="/about" className="text-[#676E85] hover:text-[#0A1B39] transition-colors">
                        About Us
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="outline" className="hidden sm:inline-flex border-neutral-200 text-[#0A1B39] hover:bg-neutral-50 px-5 h-10 font-semibold transition-colors">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="hidden md:inline-flex bg-[#17A546] hover:bg-[#14933E] text-white px-6 h-10 font-semibold shadow-lg shadow-[#17A546]/20 hover:-translate-y-1 transition-all">
                            Get Started
                        </Button>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden hover:bg-neutral-50 rounded-lg text-[#0A1B39]" 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                    <div className="md:hidden fixed top-[72px] left-0 w-full z-50 bg-white border-b border-neutral-100 shadow-xl animate-in slide-in-from-top-2 duration-200">
                        <div className="container py-6 flex flex-col gap-2">
                            <Link href="/courses" className="text-[17px] font-medium text-[#0A1B39] py-3 border-b border-neutral-100/60" onClick={() => setIsMobileMenuOpen(false)}>
                                Courses
                            </Link>
                            <Link href="/pricing" className="text-[17px] font-medium text-[#0A1B39] py-3 border-b border-neutral-100/60" onClick={() => setIsMobileMenuOpen(false)}>
                                Pricing
                            </Link>
                            <Link href="/about" className="text-[17px] font-medium text-[#0A1B39] py-3 border-b border-neutral-100/60" onClick={() => setIsMobileMenuOpen(false)}>
                                About Us
                            </Link>
                            <div className="flex flex-col gap-3 mt-6">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full justify-center border-neutral-200 text-[#0A1B39] h-12 font-semibold text-[16px] transition-colors">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full justify-center bg-[#17A546] hover:bg-[#14933E] text-white h-12 font-semibold text-[16px] shadow-lg shadow-[#17A546]/20 hover:-translate-y-1 transition-all">
                                        Get Started
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
