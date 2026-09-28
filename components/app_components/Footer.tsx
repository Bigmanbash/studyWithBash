import Link from "next/link";
import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-neutral-200/80 bg-white py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex items-center justify-center h-7 w-7 rounded-md bg-[#17A546] text-white">
                            <span className="font-serif text-[15px] font-bold leading-none translate-y-[0.5px]">B</span>
                        </div>
                        <span className="text-lg font-extrabold text-[#0A1B39] tracking-tight">
                            Bash<span className="font-semibold text-[#17A546]">Academy</span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-[#676E85]">
                        <Link href="/" className="hover:text-[#17A546] transition-colors">
                            Home
                        </Link>
                        <Link href="/courses" className="hover:text-[#17A546] transition-colors">
                            Courses
                        </Link>
                        <Link href="#agents" className="hover:text-[#17A546] transition-colors">
                            Agents
                        </Link>
                        <Link href="#pricing" className="hover:text-[#17A546] transition-colors">
                            Pricing
                        </Link>
                        <Link href="/about" className="hover:text-[#17A546] transition-colors">
                            About
                        </Link>
                    </nav>

                    {/* Socials & Copyright */}
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3 text-[#676E85]">
                            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#17A546] transition-colors p-1" aria-label="X (Twitter)">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#17A546] transition-colors p-1" aria-label="Instagram">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#17A546] transition-colors p-1" aria-label="YouTube">
                                <Youtube className="w-4 h-4" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#17A546] transition-colors p-1" aria-label="LinkedIn">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                        <span className="text-[11px] sm:text-xs text-[#676E85] pl-2 border-l border-neutral-200">
                            © {new Date().getFullYear()} Bash Academy.
                        </span>
                    </div>

                </div>
            </div>
        </footer>
    );
}
