import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Key, Banknote, ArrowRight, ShieldCheck, Check, Sparkles } from "lucide-react";

export function AgentAffiliateSection() {
  return (
    <section className="py-12 sm:py-20 bg-white border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-10 text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#17A546]/10 border border-[#17A546]/20 rounded-full px-3 py-0.5 mb-2.5">
            <Sparkles className="h-3 w-3 text-[#17A546]" />
            <span className="text-[#17A546] text-[11px] sm:text-xs font-semibold">Partner & Affiliate Network</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#0A1B39]">
            Earn with Bash Academy as an Agent
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#676E85] leading-relaxed">
            Empower students across Nigeria while building a reliable income stream. Ideal for teachers, school administrators, tutors, and student ambassadors.
          </p>
        </div>

        {/* 3 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          
          {/* Card 1 */}
          <div className="bg-white rounded-md border border-neutral-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#17A546]/40 transition-colors duration-200">
            <div>
              <div className="h-9 w-9 rounded-md bg-[#17A546]/10 flex items-center justify-center text-[#17A546] mb-3.5">
                <Users className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0A1B39]">
                Referral Commissions
              </h3>
              <p className="mt-1 text-xs text-[#676E85] leading-relaxed">
                Share your unique agent referral code with students. Earn instant commissions on every course tier purchase linked to your referral code.
              </p>
            </div>
            <ul className="space-y-2 pt-3.5 border-t border-neutral-100 text-xs text-[#0A1B39] font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#17A546] shrink-0" /> Unique referral link & code
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#17A546] shrink-0" /> Automated commission tracking
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-md border border-neutral-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#3B82F6]/40 transition-colors duration-200">
            <div>
              <div className="h-9 w-9 rounded-md bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] mb-3.5">
                <Key className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0A1B39]">
                Proxy Access Code Sales
              </h3>
              <p className="mt-1 text-xs text-[#676E85] leading-relaxed">
                School administrators and tutors can purchase one-time access codes in bulk for students at agent proxy rates while retaining their margin.
              </p>
            </div>
            <ul className="space-y-2 pt-3.5 border-t border-neutral-100 text-xs text-[#0A1B39] font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#3B82F6] shrink-0" /> Instant activation code generation
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#3B82F6] shrink-0" /> Tailored for schools & tutorial centers
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-md border border-neutral-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#F5B546]/40 transition-colors duration-200">
            <div>
              <div className="h-9 w-9 rounded-md bg-[#F5B546]/10 flex items-center justify-center text-[#F5B546] mb-3.5">
                <Banknote className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0A1B39]">
                Transparent Bank Payouts
              </h3>
              <p className="mt-1 text-xs text-[#676E85] leading-relaxed">
                Monitor your earnings live through detailed audit logs in your agent dashboard and request direct bank account disbursals whenever you choose.
              </p>
            </div>
            <ul className="space-y-2 pt-3.5 border-t border-neutral-100 text-xs text-[#0A1B39] font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#F5B546] shrink-0" /> Real-time commission audit logs
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#F5B546] shrink-0" /> Direct bank account withdrawals
              </li>
            </ul>
          </div>

        </div>

        {/* Action Banner */}
        <div className="bg-[#F7F9FC] rounded-md border border-neutral-200/80 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-2xs">
          <div className="flex items-start md:items-center gap-3 text-left">
            <div className="h-8 w-8 rounded-md bg-[#17A546]/10 flex items-center justify-center text-[#17A546] shrink-0 hidden sm:flex">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#0A1B39]">
                Ready to become an official Bash Academy Agent?
              </h4>
              <p className="mt-0.5 text-xs text-[#676E85]">
                Get your unique referral link and proxy code portal set up in less than 2 minutes.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            <Link href="/agent/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#17A546] hover:bg-[#128638] text-white font-bold text-xs rounded-md h-9 px-4 shadow-2xs">
                Register as Agent <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/agent/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-neutral-200 text-[#0A1B39] hover:bg-neutral-100 font-semibold text-xs rounded-md h-9 px-4 shadow-2xs">
                Agent Login
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
