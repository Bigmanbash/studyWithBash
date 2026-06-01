"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading or hook into router events
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-(--card) transition-opacity duration-500">
      <div className="flex flex-col items-center gap-5">
        {/* Subtle Logo Animation */}
        <div className="relative flex items-center justify-center h-14 w-14 rounded-lg bg-[#17A546] text-white overflow-hidden shadow-xl shadow-[#17A546]/20">
          <span className="font-serif text-[28px] font-bold leading-none translate-y-[0.5px] z-10">
            B
          </span>
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
        <div className="h-1.5 w-32 bg-(--card) rounded-full overflow-hidden">
          <div className="h-full bg-[#17A546] rounded-full animate-[loading_1.5s_ease-in-out_infinite] w-1/3"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
