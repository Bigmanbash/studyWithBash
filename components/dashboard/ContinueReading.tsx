import Link from "next/link";
import { FileDown, FileText } from "lucide-react";

export function ContinueReading() {
  return (
    <div className="bg-[#070D17] rounded-[20px] px-6 py-5 flex items-center justify-between gap-4 relative overflow-hidden border border-[#17A546]/20">
      {/* Subtle radial glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-[#17A546]/25 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

      {/* Left: icon + info */}
      <div className="flex items-center gap-3.5 z-10 min-w-0">
        <div className="shrink-0 w-11 h-11 rounded-xl bg-[#17A546]/15 border border-[#17A546]/30 flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#17A546]" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-widest uppercase text-[#17A546]/85 mb-0.5">
            Last opened · PDF
          </p>
          <p className="text-white font-semibold text-[17px] leading-tight truncate">
            Mathematics — SSS1
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[38%] bg-[#17A546] rounded-full" />
            </div>
            <span className="text-[11px] text-white/35 whitespace-nowrap">38% · Pg 42</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/dashboard/read/mathematics-sss1"
        className="shrink-0 z-10 flex items-center gap-2 bg-[#17A546] hover:bg-[#128638] text-white px-4 py-2.5 rounded-md text-[13px] font-medium transition-colors duration-150"
      >
        <FileDown className="w-4 h-4" />
        Open PDF
      </Link>
    </div>
  );
}