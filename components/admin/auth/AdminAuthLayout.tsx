import Link from "next/link";

interface AdminAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
}

export function AdminAuthLayout({ children, title, subtitle }: AdminAuthLayoutProps) {
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row">
      {/* Left Branding Panel — Admin-specific */}
      <div className="hidden lg:block lg:w-[48%] h-full relative bg-[#030E36]">
        {/* Geometric Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient Glow */}
        <div className="absolute top-[-100px] right-[-100px] h-[600px] w-[600px] rounded-full bg-[#17A546]/12 blur-[180px]" />
        <div className="absolute bottom-[-100px] left-[-100px] h-[400px] w-[400px] rounded-full bg-[#DEAB06]/8 blur-[140px]" />

        <div className="relative z-10 h-full flex items-center px-8 xl:px-14">
          <div className="max-w-[540px]">
            {/* Glass Card */}
            <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-[32px] p-8 xl:p-10">
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-2 mb-10">
                <div className="h-10 w-10 rounded-lg bg-[#17A546] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#17A546]/30">
                  B
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  Bash Academy
                </span>
              </Link>

              {/* Heading */}
              <div className="space-y-5">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#17A546] mr-2 animate-pulse" />
                  Admin Portal
                </div>

                <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight text-white">
                  Platform
                  <br />
                  <span className="text-[#22C55E]">Command Center</span>
                </h1>

                <p className="text-[15px] leading-7 text-white/60 max-w-[460px]">
                  Manage courses, monitor student progress, process payments,
                  and maintain platform excellence — all in one place.
                </p>
              </div>

              {/* Admin Features */}
              <div className="mt-10 space-y-3">
                {[
                  { icon: "📊", label: "Real-time Analytics & Insights" },
                  { icon: "📚", label: "Course & Content Management" },
                  { icon: "💳", label: "Payment Processing & Approvals" },
                  { icon: "🎧", label: "Student Support Center" },
                ].map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                  >
                    <span className="text-base">{feature.icon}</span>
                    <span className="text-sm text-white/60">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel — scrollable */}
      <div className="flex-1 h-full overflow-y-auto bg-[#F7F9FC]">
        <div className="flex items-center justify-center min-h-full px-5 sm:px-8 py-10">
          <div className="w-full max-w-[420px]">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6 text-center">
              <Link href="/">
                <span className="text-xl font-extrabold tracking-tighter text-[#17A546]">
                  Bash Academy
                </span>
              </Link>
              <p className="text-xs text-[#98A2B3] mt-1">
                Admin Portal
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-[#0A1B39]/5 border border-neutral-100">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A1B39]">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-[#676E85]">{subtitle}</p>
              </div>
              {children}
            </div>

            {/* Mobile footer */}
            <p className="lg:hidden mt-6 text-center text-xs text-[#98A2B3]">
              © {new Date().getFullYear()} Bash Academy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
