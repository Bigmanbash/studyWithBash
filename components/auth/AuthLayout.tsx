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
      <div className="flex-1 h-full overflow-y-auto bg-(--card)">
        <div className="flex items-center justify-center min-h-full px-5 sm:px-8 py-10">
          <div className="w-full max-w-[420px]">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6 text-center">
              <Link href="/">
                <span className="text-xl font-extrabold tracking-tighter text-[#17A546]">
                  Bash Academy
                </span>
              </Link>
              <p className="text-xs text-(--muted) mt-1">
                Your journey to 300+ starts here
              </p>
            </div>

            {/* Form card */}
            <div className="bg-(--card) p-6 sm:p-8 rounded-2xl shadow-xl shadow-[#0A1B39]/5 border border-border">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-(--heading)">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-(--muted)">{subtitle}</p>
              </div>
              {children}
            </div>

            {/* Mobile footer */}
            <p className="lg:hidden mt-6 text-center text-xs text-(--muted)">
              © {new Date().getFullYear()} Bash Academy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
