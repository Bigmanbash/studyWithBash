"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
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

export function CTASection() {
  const { ref, inView } = useInView();
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const stats = [
    { value: "10k+", label: "Active Students" },
    { value: "300+", label: "Avg. JAMB Score" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "3", label: "Core Subjects" },
  ];

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`relative overflow-hidden rounded-md shadow-2xl shadow-[#0A1B39]/20 ${inView ? 'animate-fade-in-scale' : 'opacity-0'}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/img/cta_bg.jpg"
              alt=""
              fill
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0 bg-[#0A1B39]/80" />
          </div>

          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 md:px-16 md:py-22">
            {/* Content */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Left Text */}
              <div className={`flex-1 text-left min-w-0 ${inView ? 'animate-slide-in-left stagger-2' : 'opacity-0'}`}>
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-md px-3.5 py-1 mb-4">
                  <span className="text-white/80 text-xs sm:text-sm font-medium">Start your journey today</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-tight text-white leading-[1.25]">
                  Ready to pass your exams with flying colors?
                </h2>
                <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-white/70 max-w-[520px] mx-0">
                  Join thousands of students who have cracked the JAMB code. Start practicing today with our expertly curated questions and personalized learning paths.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-[#17A546] hover:bg-[#17A546]/90 text-white font-bold text-base px-8 h-12 sm:h-13 shadow-lg shadow-[#17A546]/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#17A546]/40 transition-all duration-300 rounded-md">
                      Get started for free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#courses" className="w-full sm:w-auto">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-white/10 border border-white/20 hover:border-white/35 font-semibold text-base px-8 h-12 sm:h-13 rounded-md transition-all duration-300">
                      Explore Courses
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Stats */}
              <div className={`w-full lg:w-auto lg:flex-shrink-0 ${inView ? 'animate-slide-in-right stagger-3' : 'opacity-0'}`}>
                <div className="grid grid-cols-2 gap-3.5 max-w-[300px] sm:max-w-[340px] mx-auto lg:mx-0">
                  {stats.map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-md p-5 text-center transition-all duration-300 cursor-default ${hoveredStat === i ? 'bg-white/[0.12] border-white/20 -translate-y-0.5 shadow-lg' : 'hover:bg-white/[0.1]'
                        } ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                      style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                      onMouseEnter={() => setHoveredStat(i)}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#17A546]">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-white/60 mt-1.5 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
