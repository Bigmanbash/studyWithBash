export function ContactHero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-[#0A1B39]">
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Glow */}
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[#17A546]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-[#17A546] mb-6">
            Contact Us
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Get in touch with us
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/60 max-w-2xl mx-auto">
            Have questions about our courses, pricing, or your account? Our team is ready to help you succeed.
          </p>
        </div>
      </div>
    </section>
  );
}

