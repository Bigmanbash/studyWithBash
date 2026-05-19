import { Target, Users, Lightbulb, BookOpen } from "lucide-react";

const values = [
  {
    name: "Accessibility",
    description: "Quality education shouldn't be a privilege. We are building a platform every student can access.",
    icon: Users,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Focus",
    description: "No fluff, no distractions. Just the core curriculum tailored to pass your exams.",
    icon: Target,
    color: "bg-[#17A546]/10 text-[#17A546]",
  },
  {
    name: "Clarity",
    description: "We break down complex topics into bite-sized, easy-to-understand concepts.",
    icon: Lightbulb,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    name: "Continuous Improvement",
    description: "We constantly update our questions and curriculum to align with the latest JAMB standards.",
    icon: BookOpen,
    color: "bg-purple-500/10 text-purple-500",
  },
];

export function AboutValues() {
  return (
    <section className="py-20 sm:py-28 bg-[#F7F9FC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#17A546] font-bold tracking-wide uppercase text-sm">Our Values</span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0A1B39]">
            What drives everything we do
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-[#676E85]">
            Four principles that guide us in building the best learning platform for Nigerian students.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.name}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`h-12 w-12 rounded-2xl ${value.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1B39] mb-2">{value.name}</h3>
              <p className="text-sm leading-relaxed text-[#676E85]">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
