import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row">
      {/* Left Branding Panel */}
      <div
        className="hidden lg:block lg:w-[48%] h-full relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#081225]/75" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1B39]/80 via-[#0A1B39]/40 to-[#17A546]/20" />

        {/* Glow */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#17A546]/20 blur-[140px]" />

        <div className="relative z-10 h-full flex items-center px-8 xl:px-14">
          <div className="max-w-[540px]">
            {/* Glass Card */}
            <div className="backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-[32px] p-8 xl:p-10 shadow-2xl shadow-black/20">
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-2 mb-10">
                <div className="h-10 w-10 rounded-2xl bg-[#17A546] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#17A546]/30">
                  B
                </div>

                <span className="text-2xl font-bold tracking-tight text-white">
                  Bash Academy
                </span>
              </Link>

              {/* Heading */}
              <div className="space-y-5">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
                  Trusted by 10,000+ Students
                </div>

                <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight text-white">
                  Your journey to{" "}
                  <span className="text-[#22C55E]">300+</span>
                  <br />
                  starts here.
                </h1>

                <p className="text-[15px] leading-7 text-white/70 max-w-[460px]">
                  Structured lessons, smart practice tests, and proven strategies
                  designed to help you score higher with confidence.
                </p>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { value: "10k+", label: "Students" },
                  { value: "95%", label: "Success Rate" },
                  { value: "300+", label: "Average Score" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-5 backdrop-blur-md"
                  >
                    <div className="text-2xl font-bold tracking-tight text-white">
                      {s.value}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wide text-white/50">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel — scrollable */}
      <div className="flex-1 h-full overflow-y-auto bg-[#F7F9FC]">
        <div className="flex items-start sm:items-center justify-center min-h-full px-5 sm:px-8 py-8 sm:py-10">
          <div className="w-full max-w-[420px]">

            {/* Logo — visible on all sizes, centred */}
            <div className="mb-6 sm:mb-8 flex flex-col items-center">
              <Link
                href="/"
                className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
              >
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#17A546] text-white group-hover:bg-[#14933E] transition-colors duration-300 shadow-md shadow-[#17A546]/20">
                  <span className="font-serif text-lg sm:text-xl font-bold leading-none translate-y-[0.5px]">B</span>
                </div>
                <span className="text-[22px] sm:text-[24px] font-bold text-[#0A1B39] tracking-tight">
                  Bash<span className="font-medium text-[#676E85]">Academy</span>
                </span>
              </Link>
            </div>

            {/* Form card */}
            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl shadow-[#0A1B39]/5 border border-neutral-100">
              <div className="mb-5 sm:mb-6">
                <h2 className="text-[22px] sm:text-2xl font-bold tracking-tight text-[#0A1B39] leading-tight">
                  {title}
                </h2>
                <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-sm text-[#676E85] leading-relaxed">
                  {subtitle}
                </p>
              </div>
              {children}
            </div>

            {/* Mobile footer */}
            <p className="lg:hidden mt-6 sm:mt-8 text-center text-[11px] sm:text-xs text-[#98A2B3]">
              © {new Date().getFullYear()} Bash Academy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
