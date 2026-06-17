"use client";

import { useEffect, useState } from "react";
import { BookOpen, Pencil } from "lucide-react";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => setIsLoading(false), 600); // 600ms for fade out
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#F7F9FC] transition-opacity duration-700 ease-in-out ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className="relative flex flex-col items-center justify-center">

        {/* Animated Icons Container */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          {/* Pulsing background circle */}
          <div className="absolute inset-0 bg-brand-green/10 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 bg-brand-green/20 rounded-full animate-pulse" />

          <div className="relative z-10 flex items-center justify-center">
            {/* Book Icon */}
            <BookOpen className="w-10 h-10 text-brand-green absolute" strokeWidth={1.5} />

            {/* Pencil Icon - animating around the book */}
            <div className="absolute w-full h-full animate-[spin_3s_linear_infinite]">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 animate-bounce">
                <Pencil className="w-5 h-5 text-brand-green" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Loading text / bar */}
        {/* Label row — all on one baseline */}
        <div className="flex items-baseline gap-0">
          <span className="text-[22px] font-bold text-[#0A1B39] tracking-tight">Bash</span>
          <span className="text-[22px] font-medium text-[#676E85] tracking-tight ml-1.5">Academy</span>
          <span className="inline-flex items-baseline gap-px ml-0.5">
            <span className="text-[22px] font-bold text-brand-green animate-[bounce_1s_ease-in-out_infinite_0ms]">.</span>
            <span className="text-[22px] font-bold text-brand-green animate-[bounce_1s_ease-in-out_infinite_120ms]">.</span>
            <span className="text-[22px] font-bold text-brand-green animate-[bounce_1s_ease-in-out_infinite_240ms]">.</span>
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
