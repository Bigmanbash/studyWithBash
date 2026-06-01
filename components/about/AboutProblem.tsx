export function AboutProblem() {
  return (
    <section className="py-20 sm:py-28 bg-(--card)">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — stats visual */}
          <div className="relative">
            <div
              className="w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1B39]/80 to-transparent rounded-2xl sm:rounded-3xl" />
              {/* Stat overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-3xl sm:text-4xl font-bold text-[#17A546]">78%</div>
                  <div className="text-xs sm:text-sm font-medium opacity-80 leading-tight">
                    Of students fail to cross<br />the 200 mark nationally.
                  </div>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#17A546] w-[78%] h-full rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div>
            <span className="text-[#17A546] font-bold tracking-wide uppercase text-sm">The Problem</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-(--heading)">
              The Sub-200 Dilemma
            </h2>
            <p className="mt-6 text-base leading-relaxed text-(--muted)">
              Year after year, statistics show that nearly 80% of JAMB candidates score below 200,
              severely limiting their chances of university admission. The root cause isn&apos;t a lack
              of intelligence — it&apos;s a lack of structured, accessible, and targeted learning resources.
            </p>
            <p className="mt-4 text-base leading-relaxed text-(--muted)">
              Many students are overwhelmed by dense textbooks and unguided syllabuses.
              We created Bash Academy to break down these barriers and simplify the path to success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}