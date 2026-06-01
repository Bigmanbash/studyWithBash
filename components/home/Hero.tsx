import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-(--card) pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
      {/* Soft Background Gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#EBE1FC] to-[#DBF1E3] opacity-50 sm:left-[calc(50%-30rem)] sm:w-288.75"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <div className="mb-8 flex justify-center lg:justify-start">
              <span className="relative rounded-full px-3 py-1 text-sm leading-6 text-[#17A546] ring-1 ring-[#17A546]/20 hover:ring-[#17A546]/40 transition-colors shadow-sm bg-white/50 backdrop-blur-sm">
                The #1 Platform for SS1-SS2 & JAMB
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-(--heading)">
              Demystifying Complex Subjects for Nigerian Students
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-(--muted) animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
              We exist to push 80% of sub-200 JAMB candidates past the 200 mark.
              Access simplified learning materials, tiered exercises, and targeted practice for Physics, Chemistry, and Math.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-[#17A546]/20 hover:-translate-y-1 transition-transform">
                Start Learning Free
              </Button>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto hover:bg-[#17A546]/5">
                View Courses Catalog
              </Button>
            </div>
          </div>

          {/* Image Section with Glassmorphism floating cards */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 fill-mode-both mt-12 lg:mt-0 w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-brand-navy/10 aspect-square md:aspect-[4/3] ring-1 ring-brand-navy/5">
              <Image
                alt="Students studying together"
                className="w-full h-full object-cover object-center"
                width={1000}
                height={1000}
                src="/img/hero_section.png"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* Floating Glass Card 1 */}
            <div className="absolute -bottom-2 left-0 sm:-bottom-4 sm:-left-4 md:-bottom-6 md:-left-6 bg-white/80 backdrop-blur-md border border-white p-2.5 sm:p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both scale-[0.85] sm:scale-90 md:scale-100 origin-bottom-left z-10">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#17A546]/10">
                <span className="text-base sm:text-lg md:text-xl font-bold text-[#17A546]">A+</span>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-brand-navy">High Success Rate</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-500">80% cross 200 marks</p>
              </div>
            </div>

            {/* Floating Glass Card 2 */}
            <div className="absolute -top-2 right-0 sm:-top-4 sm:-right-4 md:-top-6 md:-right-6 bg-white/80 backdrop-blur-md border border-white p-2.5 sm:p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 md:gap-4 animate-in fade-in slide-in-from-top-4 duration-1000 delay-700 fill-mode-both scale-[0.85] sm:scale-90 md:scale-100 origin-top-right z-10">
              <div className="flex -space-x-2">
                {['A', 'B', 'C'].map((initial) => (
                  <div key={initial} className="inline-flex h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-[#17A546]/10 text-[#17A546] font-semibold ring-2 ring-white">
                    {initial}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-brand-navy">10k+ Students</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-500">Learning actively</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
