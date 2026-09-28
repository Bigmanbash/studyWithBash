"use client";

import Link from "next/link";
import { Check, ArrowRight, FileText, Video, Crown } from "lucide-react";
import { useRef, useEffect, useState } from "react";

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

const tiers = [
  {
    id: "basic",
    name: "Basic Tier",
    badge: "Essential",
    subtitle: "Complete reading notes and downloadable PDFs for thorough self-paced study.",
    icon: FileText,
    originalPrice: "₦9,000",
    discount: "Save 66%",
    price: "₦3,000",
    priceLabel: "Starting price per course bundle",
    popular: false,
    features: [
      "Full comprehensive topic study notes",
      "Downloadable PDFs for offline reading",
      "Topic revision exercises & solutions",
      "Aligned with SS1–SS3 & JAMB syllabuses",
      "Lifetime access to purchased materials",
    ],
    cta: "Get Started",
    href: "/courses",
  },
  {
    id: "standard",
    name: "Standard Tier",
    badge: "Most Popular",
    subtitle: "Complete notes plus video lectures explaining tough topics step-by-step.",
    icon: Video,
    price: "Coming Soon",
    priceLabel: "With video lectures",
    popular: true,
    features: [
      "Everything included in Basic Tier",
      "Step-by-step video lessons by top tutors",
      "Interactive CBT practice & timed drills",
      "Past question walk-throughs & explanations",
      "Visual student progress tracking",
    ],
    cta: "Explore Courses",
    href: "/courses",
  },
  {
    id: "premium",
    name: "Premium Tier",
    badge: "All-Inclusive",
    subtitle: "Comprehensive exam masterclass with full mocks and tutor mentorship.",
    icon: Crown,
    price: "Coming Soon",
    priceLabel: "Full mentorship & mocks",
    popular: false,
    features: [
      "Everything included in Standard Tier",
      "Priority 1-on-1 tutor Q&A support",
      "Full-length JAMB, WAEC & NECO mock exams",
      "Personalized revision schedules & exam tips",
      "Direct student community access",
    ],
    cta: "Contact Us",
    href: "/contact_us",
  },
];

export function Pricing() {
  const { ref, inView } = useInView();

  return (
    <section id="pricing" ref={ref} className="py-20 sm:py-24 lg:py-28 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header: Title & Subtitle */}
        <div className={`max-w-3xl mb-10 sm:mb-12 text-left ${inView ? "animate-fade-in-up" : "opacity-0"
          }`}>
          <span className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-1 text-xs sm:text-sm font-semibold bg-[#E8F7EE] text-[#17A546] border border-[#17A546]/20 mb-3">
            Course Access Tiers
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#0A1B39] leading-[1.25]">
            Understand Our 3 Learning Tiers
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#676E85] leading-relaxed">
            We provide 3 structured tiers designed to fit every student&apos;s budget and learning needs. Start with our core reading materials from just ₦3,000.
          </p>
        </div>

        {/* 3 Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-md p-6 sm:p-7 lg:p-8 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${tier.popular
                  ? "border-[#17A546] ring-2 ring-[#17A546]/20 shadow-lg shadow-[#17A546]/5"
                  : "border-neutral-200/80 shadow-sm"
                } ${inView ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
            >
              {/* Most Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-6 bg-[#17A546] text-white text-[11px] font-bold px-3.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                  {tier.badge}
                </div>
              )}

              <div>
                {/* Header Info */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-md bg-[#E8F7EE] flex items-center justify-center text-[#17A546]">
                    <tier.icon className="w-5 h-5" />
                  </div>
                  {!tier.popular && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-[#676E85] border border-neutral-200">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#0A1B39]">
                  {tier.name}
                </h3>
                <p className="mt-1.5 text-sm text-[#676E85] leading-relaxed">
                  {tier.subtitle}
                </p>

                {/* Price Display with Strikethrough Strategy */}
                <div className="mt-6 pb-6 border-b border-neutral-100">
                  {tier.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base text-neutral-400 line-through font-semibold">
                        {tier.originalPrice}
                      </span>
                      {tier.discount && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#E8F7EE] text-[#17A546]">
                          {tier.discount}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#0A1B39] tracking-tight">
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#17A546] font-semibold mt-1">
                    {tier.priceLabel}
                  </p>
                </div>

                {/* Features Checklist */}
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0A1B39] mb-3.5">
                    What&apos;s included:
                  </p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#0A1B39]">
                        <Check className="w-4 h-4 text-[#17A546] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <Link href={tier.href} className="block w-full">
                  <button
                    className={`w-full h-12 rounded-md text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all duration-200 ${tier.popular
                        ? "bg-[#17A546] hover:bg-[#128638] text-white shadow-md shadow-[#17A546]/25 hover:shadow-lg"
                        : "border border-neutral-200 text-[#0A1B39] hover:border-[#17A546] hover:text-[#17A546] hover:bg-[#E8F7EE]/30"
                      }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
