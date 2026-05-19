import { Target, BookOpenCheck, Activity, Award } from "lucide-react";

const steps = [
  {
    name: "Sign up and set your goal",
    description: "Create an account in seconds. Tell us if you are preparing for WAEC, JAMB, or both.",
    icon: Target,
    color: "bg-semantic-info-support text-semantic-info-main border-semantic-info-main/20",
  },
  {
    name: "Learn the core concepts",
    description: "Follow our structured curriculum. Watch videos, read summaries, and truly understand the theory.",
    icon: BookOpenCheck,
    color: "bg-semantic-success-support text-brand-green border-brand-green/20",
  },
  {
    name: "Practice with tiered exercises",
    description: "Start with easy questions and systematically progress to advanced past exam standard questions.",
    icon: Activity,
    color: "bg-semantic-warning-support text-brand-gold border-brand-gold/20",
  },
  {
    name: "Track and crush your exams",
    description: "Use our analytics dashboard to monitor your progress and confidently hit that 300+ score.",
    icon: Award,
    color: "bg-semantic-error-support text-semantic-error-main border-semantic-error-main/20",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className="text-[#17A546] font-bold tracking-wide uppercase text-sm">Step by Step</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#0A1B39] sm:text-4xl lg:text-5xl">
            How Bash Academy Works
          </p>
          <p className="mt-6 text-base md:text-lg leading-8 text-[#676E85]">
            A simple, proven process designed specifically to take you from struggling with concepts to mastering your exams effortlessly.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.name} className="relative group text-center lg:text-left">
                  {/* Connecting Line for Desktop */}
                  {index !== steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-16 right-0 h-[2px] w-full bg-gray-100 -z-10">
                      <div className="h-full bg-[#17A546] transition-all duration-1000 w-0 group-hover:w-full"></div>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center lg:items-start">
                    <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border ${step.color} shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md bg-white z-10`}>
                      <Icon className="h-8 w-8" />
                      <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0A1B39] text-white text-xs font-bold ring-2 ring-white shadow-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-bold leading-7 text-[#0A1B39]">
                      {step.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#676E85]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
