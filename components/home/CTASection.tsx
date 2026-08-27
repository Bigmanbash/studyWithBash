import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1B39] via-[#0A1B39] to-[#17A546]/30 px-5 py-12 sm:px-10 sm:py-16 md:px-14 md:py-20 shadow-xl rounded-xl sm:rounded-2xl">

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
            {/* Left Text */}
            <div className="flex-1 text-center lg:text-left min-w-0">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 mb-4 sm:mb-5">
                <Sparkles className="h-3.5 w-3.5 text-[#17A546]" />
                <span className="text-white/80 text-xs font-medium">Start your journey today</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug">
                Ready to pass your exams with flying colors?
              </h2>
              <p className="mt-3.5 sm:mt-5 text-xs sm:text-sm md:text-base leading-relaxed text-white/70">
                Join thousands of students who have cracked the JAMB code. Start practicing today with our expertly curated questions and personalized learning paths.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-[#17A546] hover:bg-[#17A546]/90 text-white font-bold text-xs sm:text-sm px-6 h-10 shadow-lg shadow-[#17A546]/30 hover:-translate-y-0.5 transition-all rounded-md">
                    Get started for free
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="#courses" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-white/10 border border-white/20 font-semibold text-xs sm:text-sm px-6 h-10 rounded-md">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Stats */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-[260px] sm:max-w-xs mx-auto lg:mx-0">
                {[
                  { value: "10k+", label: "Active Students" },
                  { value: "300+", label: "Avg. JAMB Score" },
                  { value: "95%", label: "Satisfaction Rate" },
                  { value: "3", label: "Core Subjects" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-3 sm:p-4 text-center hover:bg-white/10 transition-colors">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#17A546]">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-white/60 mt-0.5 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-[#17A546]/15 blur-[80px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 h-[180px] w-[180px] sm:h-[300px] sm:w-[300px] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
