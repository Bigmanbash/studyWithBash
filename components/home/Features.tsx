import { BookOpen, Target, BarChart3, Users } from "lucide-react";

const features = [
  {
    name: "Structured Curriculum",
    description: "Our content strictly follows the SS1-SS2 and JAMB syllabuses. No fluff, just what you need to pass.",
    icon: BookOpen,
  },
  {
    name: "Targeted Practice",
    description: "Access thousands of past questions broken down by topic and difficulty level.",
    icon: Target,
  },
  {
    name: "Performance Analytics",
    description: "Track your progress visually. Know your weak points and where to focus your study time.",
    icon: BarChart3,
  },
  {
    name: "Community Support",
    description: "Join thousands of other students. Ask questions, share insights, and learn together.",
    icon: Users,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-[#0A1B39] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
        <div className="h-[400px] w-[400px] rounded-full bg-[#17A546]/20 blur-[100px]"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
        <div className="h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[#17A546] font-bold tracking-wide uppercase text-sm mb-2">Features</h2>
          <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything you need to excel
          </p>
          <p className="mt-6 text-base md:text-lg leading-8 text-neutral-300">
            We&apos;ve built a platform that combines deep learning theory with intense practice, designed specifically to help Nigerian students beat the JAMB algorithm.
          </p>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <dl className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col bg-white/5 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-[#17A546]/50 transition-colors duration-300 group">
                <dt className="flex items-center gap-x-3 sm:gap-x-4 text-base sm:text-lg font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-xl bg-white/10 group-hover:bg-[#17A546] transition-colors duration-300">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#17A546] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-3 sm:mt-4 flex flex-auto flex-col text-sm sm:text-base leading-relaxed text-neutral-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

