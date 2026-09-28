"use client";

import Link from "next/link";
import { Layers, FileCheck2, TrendingUp, Smartphone, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const features = [
  {
    icon: Layers,
    title: "Structured Learning",
    description: "From basics to exam-ready with a clear learning path.",
  },
  {
    icon: FileCheck2,
    title: "Real Exam Practice",
    description: "Past questions, timed tests and detailed explanations.",
  },
  {
    icon: TrendingUp,
    title: "Access Video Tutorials",
    description: "Detailed video explanations for every topic.",
  },
  {
    icon: Smartphone,
    title: "Learn Anywhere",
    description: "Access on any device, anytime, anywhere seamlessly.",
  },
];

export function WhyLearning() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Column: Heading + Description + Action */}
          <div className={`lg:col-span-4 max-w-[460px] text-left ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold bg-[#E8F7EE] text-[#17A546] border border-[#17A546]/20 mb-3">
              Why Bash Academy?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#0A1B39] leading-[1.25]">
              More than just practice questions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#676E85] leading-relaxed">
              We give you the right tools, structure and support to truly understand your subjects and perform with confidence.
            </p>
            <div className="mt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#17A546] text-[#17A546] hover:bg-[#E8F7EE]/40 transition-all duration-200 text-xs sm:text-sm font-semibold"
              >
                <span>Learn about us</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#17A546]" />
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Clean Minimal Cards in a Row */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 xl:gap-5">
              {features.map((feat, idx) => (
                <div
                  key={feat.title}
                  className={`bg-white rounded-md p-4 sm:p-4 xl:p-4 border border-neutral-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#17A546]/40 transition-all duration-300 flex flex-col justify-between ${inView ? "animate-fade-in-up" : "opacity-0"
                    }`}
                  style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
                >
                  <div>
                    {/* Mint Icon Box */}
                    <div className="w-10 h-10 rounded-md bg-[#E8F7EE] flex items-center justify-center text-[#17A546] mb-4">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-[14px] sm:text-sm xl:text-base text-[#0A1B39] leading-snug lg:whitespace-nowrap">
                      {feat.title}
                    </h3>
                    <p
                      className="mt-2 text-xs sm:text-[13px] text-[#676E85] leading-relaxed line-clamp-2"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
