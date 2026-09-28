"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Key, Banknote, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const agentBenefits = [
  {
    icon: Users,
    title: "Referral Commissions",
    desc: "Share your unique referral link with students. Earn instant commissions on every course tier purchased through your code.",
    highlight: "Real-time tracking & alerts",
  },
  {
    icon: Key,
    title: "Proxy Access Code Sales",
    desc: "Schools and tutors can purchase student activation scratch codes in bulk at wholesale rates and resell with an immediate profit margin.",
    highlight: "For schools & tutorial centres",
  },
  {
    icon: Banknote,
    title: "Direct Bank Payouts",
    desc: "Monitor your earnings live through transparent transaction logs. Request fast, direct withdrawals into any Nigerian bank account.",
    highlight: "Instant Nigerian bank withdrawals",
  },
];

export function AgentAffiliateSection() {
  const { ref, inView } = useInView();

  return (
    <section id="agents" ref={ref} className="py-20 sm:py-24 lg:py-28 bg-[#EEF7F2] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`max-w-[700px] mb-10 sm:mb-12 text-left ${inView ? "animate-fade-in-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-1 text-xs sm:text-sm font-semibold bg-[#E8F7EE] text-[#17A546] border border-[#17A546]/20 mb-3">
            Partner &amp; Affiliate Network
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#0A1B39] leading-[1.25]">
            Earn with Bash Academy as an Agent
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#676E85] leading-relaxed">
            Empower students across Nigeria while building a reliable income stream. Designed for teachers, tutorial centers, school heads, and student ambassadors.
          </p>
        </div>

        {/* 3 Modern Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {agentBenefits.map((benefit, idx) => (
            <div
              key={benefit.title}
              className={`bg-white rounded-md p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#17A546]/40 transition-all duration-300 flex flex-col justify-between ${inView ? "animate-fade-in-up" : "opacity-0"
                }`}
              style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
            >
              <div>
                {/* Header Icon + Highlight Tag */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-11 h-11 rounded-md bg-[#E8F7EE] flex items-center justify-center text-[#17A546]">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#17A546] bg-[#E8F7EE]/60 px-2.5 py-1 rounded-md">
                    <Check className="w-3.5 h-3.5" />
                    {benefit.highlight}
                  </span>
                </div>

                <h3 className="font-bold text-lg sm:text-xl text-[#0A1B39]">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-[#676E85] leading-relaxed">
                  {benefit.desc}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-semibold text-[#17A546]">
                <span>Guaranteed fast settlements</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sleek Partner Banner introducing Small Image and CTAs */}
        <div className={`mt-8 sm:mt-10 bg-white rounded-md border border-neutral-200/80 p-5 sm:p-7 shadow-xs ${inView ? "animate-fade-in-up" : "opacity-0"
          }`} style={{ animationDelay: "0.35s" }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Small Image + Partner Text */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Small Framed Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden shrink-0 border-2 border-[#17A546]/20 bg-neutral-100 shadow-xs">
                <Image
                  src="/img/agent_tunde.jpg"
                  alt="Bash Academy Verified Agent"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              {/* Text Info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#17A546] bg-[#E8F7EE] px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Partner Network
                  </span>
                  <span className="text-xs text-[#676E85] hidden sm:inline">• ₦0 Registration Fee</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#0A1B39] mt-1">
                  Join over 500+ educators &amp; tutors earning weekly
                </h4>
                <p className="text-xs sm:text-sm text-[#676E85] mt-0.5">
                  Instant registration, real-time dashboard analytics, and direct bank payouts.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link href="/agent/signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#17A546] hover:bg-[#128638] text-white font-bold text-sm h-11 px-6 rounded-md shadow-sm hover:shadow transition-all">
                  <span>Register as Agent</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/agent/login" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-neutral-300 bg-white text-[#0A1B39] hover:bg-neutral-50 font-semibold text-sm h-11 px-6 rounded-md">
                  Agent Portal Login
                </Button>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

