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
  Users, 
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 md:py-20 relative overflow-hidden">
        {/* Ambient background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[680px] h-[500px] sm:h-[680px] bg-gradient-to-tr from-[#17A546]/10 via-[#0A1B39]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-12 -left-20 w-72 h-72 bg-[#17A546]/5 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17A546]/10 border border-[#17A546]/20 text-[#17A546] text-xs sm:text-sm font-bold mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>404 Error • Page Not Found</span>
          </div>

          {/* Big Stylized 404 Display */}
          <div className="relative mb-6 select-none">
            <h1 className="text-7xl sm:text-9xl md:text-[140px] font-black text-neutral-900 tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-[#0A1B39] to-[#0A1B39]/40">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-md pointer-events-none text-7xl sm:text-9xl md:text-[140px] font-black text-[#17A546]">
              404
            </div>
          </div>

          {/* Headline & Description */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A1B39] tracking-tight mb-3">
            Oops! We lost that page
          </h2>
          <p className="text-sm sm:text-base text-[#676E85] max-w-lg mx-auto mb-8 leading-relaxed">
            The page you are looking for might have been removed, renamed, or is temporarily unavailable. Let&apos;s get you back on track!
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#17A546] hover:bg-[#14933E] text-white px-7 h-11 font-semibold text-sm rounded-xl shadow-lg shadow-[#17A546]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Home
              </Button>
            </Link>
            <Link href="/courses" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-neutral-200 text-[#0A1B39] hover:bg-neutral-50 px-7 h-11 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4 text-[#17A546]" />
                Explore Courses
              </Button>
            </Link>
          </div>

          {/* Helpful Quick Links Grid */}
          <div className="border-t border-neutral-200/80 pt-10 text-left">
            <p className="text-xs font-bold text-[#676E85] uppercase tracking-wider text-center mb-6">
              Helpful Destinations
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto">
              <Link 
                href="/courses" 
                className="group flex items-center justify-between p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-[#17A546]/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#17A546] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A1B39] group-hover:text-[#17A546] transition-colors">
                      Course Library
                    </h4>
                    <p className="text-[11px] text-[#676E85]">SS1-SS3 & WAEC/JAMB</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#17A546] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link 
                href="/login" 
                className="group flex items-center justify-between p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-[#17A546]/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A1B39] group-hover:text-blue-600 transition-colors">
                      Student Login
                    </h4>
                    <p className="text-[11px] text-[#676E85]">Access your enrolled courses</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link 
                href="/contact_us" 
                className="group flex items-center justify-between p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-[#17A546]/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A1B39] group-hover:text-amber-600 transition-colors">
                      Help & Support
                    </h4>
                    <p className="text-[11px] text-[#676E85]">Get assistance anytime</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
