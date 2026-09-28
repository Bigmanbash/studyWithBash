"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star, BookOpen } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-[#EEF7F2] pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">

          {/* LEFT — Text & CTA (Centered on mobile, Left-aligned on lg) */}
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            {/* Top Badge */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold bg-[#E8F7EE] text-[#17A546] border border-[#17A546]/20">
                The #1 Platform for SS1-SS3 &amp; JAMB
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-[#0A1B39] leading-[1.2] sm:leading-[1.18]">
              Demystifying Complex Subjects for Nigerian Students
            </h1>

            {/* Subtitle */}
            <p className="mt-5 sm:mt-6 text-base sm:text-lg leading-relaxed text-[#676E85] max-w-[520px] mx-auto lg:mx-0">
              We exist to push 80% of sub-200 JAMB candidates past the 200 mark.
              Access simplified learning materials, tiered exercises, and targeted practice for Physics, Chemistry, and Math.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#17A546] hover:bg-[#128638] text-white font-bold text-sm sm:text-base h-12 px-7 rounded-md shadow-lg shadow-[#17A546]/20 hover:-translate-y-0.5 transition-all">
                  <span>Start Learning Now</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#courses" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-[#0A1B39] hover:bg-[#17A546]/5 border border-neutral-200 font-semibold text-sm sm:text-base h-12 px-7 rounded-md">
                  View Courses Catalog
                </Button>
              </Link>
            </div>

            {/* Trust Checklist */}
            <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs sm:text-sm text-[#676E85]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#17A546] shrink-0" />
                <span>Downloadable PDFs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#17A546] shrink-0" />
                <span>Targeted Topic Drills</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#17A546] shrink-0" />
                <span>3 Learning Tiers</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Image & Floating Glass Cards (Reverted from previous commit) */}
          <div className="relative mt-8 lg:mt-0 w-full px-6 sm:px-10 md:px-0 mx-auto lg:max-w-none">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-[#0A1B39]/10 aspect-square md:aspect-[4/3] ring-1 ring-[#0A1B39]/5">
              <Image
                alt="Students studying together"
                className="w-full h-full object-cover object-center"
                width={1000}
                height={1000}
                src="/img/hero_section.png"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating Glass Card 1 — Bottom Left */}
            <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-8 md:-bottom-8 md:-left-12 bg-white/90 backdrop-blur-md border border-white p-2.5 sm:p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 md:gap-4 scale-[0.85] sm:scale-90 md:scale-100 origin-bottom-left z-10">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#17A546]/10">
                <span className="text-base sm:text-lg md:text-xl font-bold text-[#17A546]">A+</span>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#0A1B39]">High Success Rate</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-500">80% cross 200 marks</p>
              </div>
            </div>

            {/* Floating Glass Card 2 — Top Right */}
            <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-8 md:-top-8 md:-right-12 bg-white/90 backdrop-blur-md border border-white p-2.5 sm:p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 md:gap-4 scale-[0.85] sm:scale-90 md:scale-100 origin-top-right z-10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    className="inline-block h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full ring-2 ring-white object-cover"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="Student"
                  />
                ))}
              </div>
              <div>
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#0A1B39]">10k+ Students</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-500">Learning actively</p>
              </div>
            </div>

            {/* Floating Glass Card 3 — Top Left */}
            <div className="absolute top-[15%] -left-2 sm:top-[12%] sm:-left-8 md:top-[10%] md:-left-12 bg-white/90 backdrop-blur-md border border-white p-2.5 sm:p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 scale-[0.85] sm:scale-90 md:scale-100 origin-top-left z-10">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400 shrink-0" />
              <div>
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#0A1B39]">4.9/5 Rating</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-500">Verified students</p>
              </div>
            </div>

            {/* Floating Glass Card 4 — Bottom Right */}
            <div className="absolute bottom-[15%] -right-2 sm:bottom-[12%] sm:-right-8 md:bottom-[10%] md:-right-12 bg-white/90 backdrop-blur-md border border-white p-2.5 sm:p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 scale-[0.85] sm:scale-90 md:scale-100 origin-bottom-right z-10">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#3B82F6]/10 shrink-0">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#0A1B39]">3 Access Tiers</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-500">Basic • Standard • Pro</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
