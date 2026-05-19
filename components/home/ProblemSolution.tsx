import { BookOpen, TrendingUp, Target } from "lucide-react";

export function ProblemSolution() {
  const problems = [
    {
      title: "The Sub-200 Dilemma",
      description: "Data shows ~78% of candidates score below 200, missing out on their dream universities. Rote memorization isn't enough.",
      icon: <Target className="h-6 w-6 text-semantic-error-main" />,
      bgColor: "bg-semantic-error-support",
    },
    {
      title: "Focused Learning Paths",
      description: "We change the narrative with structured, tiered exercises targeting your weakest areas in Physics, Chemistry, and Math.",
      icon: <BookOpen className="h-6 w-6 text-brand-green" />,
      bgColor: "bg-semantic-success-support",
    },
    {
      title: "Guaranteed Improvements",
      description: "Our adaptive system ensures you truly understand concepts, building the confidence needed to crush your exams.",
      icon: <TrendingUp className="h-6 w-6 text-brand-gold" />,
      bgColor: "bg-semantic-warning-support",
    },
  ];

  return (
    <section className="py-24 bg-neutral-100 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
              alt="Student celebrating success"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1B39]/80 to-transparent"></div>

            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-[#17A546]">78%</div>
                <div className="text-sm font-medium opacity-80 leading-tight">
                  Of students fail to cross<br />the 200 mark nationally.
                </div>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-[#17A546] w-[78%] h-full rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-[#0A1B39] sm:text-4xl lg:text-5xl">
              The Mission: Solving the <span className="text-[#17A546]">Sub-200</span> Dilemma
            </h2>
            <p className="mt-6 text-base md:text-lg leading-8 text-[#676E85]">
              Traditional learning methods are leaving brilliant students behind.
              We've analyzed years of JAMB data to build a platform that focuses precisely
              on what you need to break past the 200 mark barrier.
            </p>

            <div className="mt-10 space-y-8">
              {problems.map((item, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${item.bgColor} transition-transform group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy">{item.title}</h3>
                    <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                      {item.description}
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
