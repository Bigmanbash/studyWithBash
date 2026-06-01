import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-(--card) py-12 md:py-24">
      <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1B39] via-[#0A1B39] to-[#17A546]/30 px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 shadow-2xl rounded-2xl sm:rounded-3xl">

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left Text */}
            <div className="flex-1 text-center lg:text-left min-w-0">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="h-4 w-4 text-[#17A546]" />
                <span className="text-white/80 text-xs sm:text-sm font-medium">Start your journey today</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Ready to pass your exams with flying colors?
              </h2>
              <p className="mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-white/70">
                Join thousands of students who have cracked the JAMB code. Start practicing today with our expertly curated questions and personalized learning paths.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Button size="lg" className="w-full sm:w-auto bg-[#17A546] hover:bg-[#17A546]/90 text-white font-bold px-6 sm:px-8 shadow-xl shadow-[#17A546]/30 hover:-translate-y-0.5 transition-all">
                  Get started for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-white/10 border border-white/20 font-medium px-6 sm:px-8">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Right Stats */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-[280px] sm:max-w-xs mx-auto lg:mx-0">
                {[
                  { value: "10k+", label: "Active Students" },
                  { value: "300+", label: "Avg. JAMB Score" },
                  { value: "95%", label: "Satisfaction Rate" },
                  { value: "3", label: "Core Subjects" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center hover:bg-white/10 transition-colors">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#17A546]">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-white/60 mt-1 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-[#17A546]/15 blur-[80px] sm:blur-[120px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 h-[200px] w-[200px] sm:h-[400px] sm:w-[400px] rounded-full bg-blue-500/10 blur-[80px] sm:blur-[100px] pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
