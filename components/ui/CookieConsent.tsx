"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "bash_academy_cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing slightly for smooth page entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "all");
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "essential");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xl shadow-neutral-900/10 text-left">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#17A546]/10 text-[#17A546] flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-[#0A1B39] mb-1">
              We value your privacy
            </h4>
            <p className="text-[11px] sm:text-xs text-[#676E85] leading-relaxed mb-3.5">
              We use essential cookies to maintain your login session and enhance your study experience. You can choose to accept all cookies or allow only essential ones.
            </p>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleAcceptAll}
                className="flex-1 bg-[#17A546] hover:bg-[#14933E] text-white text-xs font-semibold h-8 rounded-lg shadow-2xs"
              >
                Accept All
              </Button>
              <Button
                variant="outline"
                onClick={handleAcceptEssential}
                className="text-xs font-semibold text-[#0A1B39] border-neutral-200 hover:bg-neutral-50 h-8 rounded-lg"
              >
                Essential Only
              </Button>
            </div>
          </div>

          <button
            onClick={handleAcceptEssential}
            className="text-neutral-400 hover:text-neutral-600 p-1 rounded-md transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
