export function CoursesHero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#0A1B39]">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[#17A546]/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-center mx-auto">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-[#17A546] mb-5">
            Course Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Structured learning for every level
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/60">
            From SS1 fundamentals to JAMB mastery — follow a proven curriculum designed to get you past 300.
          </p>
        </div>
      </div>
    </section>
  );
}
