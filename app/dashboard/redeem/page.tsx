"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard";

export default function RedeemCodePage() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.trim().length < 3) {
      setError("Please enter a valid access code.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/access-codes/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to redeem access code.");
      }

      setSuccess(true);
      setCode("");
      // Invalidate dashboard queries so the new course appears in "Purchased"
      queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/purchased");
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-[#0A1B39] tracking-tight">Redeem Access Code</h1>
          <p className="text-sm text-[#676E85] mt-1.5">
            Enter the access code provided by your teacher or agent to instantly unlock a course.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-md p-6 sm:p-8 shadow-2xs relative overflow-hidden max-w-3xl">
          {/* Background Accent */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <KeyRound className="w-64 h-64 text-[#17A546] -rotate-12 transform translate-x-10 -translate-y-10" />
          </div>

          <form onSubmit={handleRedeem} className="relative z-10 w-full">
            <div className="space-y-4">
              <label htmlFor="accessCode" className="block text-sm font-semibold text-[#0A1B39]">
                Access Code
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#98A2B3]" />
                  <Input
                    id="accessCode"
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setError(null);
                    }}
                    placeholder="e.g. BSH-MTH-A1B2C3D4"
                    className="h-12 pl-12 text-base sm:text-lg tracking-widest font-mono uppercase bg-white rounded-md border-neutral-200/80 shadow-sm focus:border-[#17A546] focus:ring-[#17A546]/20 transition-all"
                    disabled={isLoading || success}
                    autoComplete="off"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || success}
                  className="w-full sm:w-auto h-12 px-8 rounded-md bg-[#17A546] hover:bg-[#128a39] text-white font-bold text-sm shadow-sm transition-all shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying
                    </>
                  ) : success ? (
                    "Unlocked!"
                  ) : (
                    "Redeem Code"
                  )}
                </Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100 mt-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-[#E7F6EC] text-[#0E7B33] rounded-md text-sm border border-[#0E7B33]/20 mt-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <p>Code redeemed successfully! Redirecting to your courses...</p>
                </div>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-100 relative z-10">
            <h3 className="text-sm font-bold text-[#0A1B39] mb-2">How it works</h3>
            <ul className="text-xs text-[#676E85] space-y-2 list-disc pl-4">
              <li>Your access code is unique and can only be used once.</li>
              <li>Once redeemed, the course is permanently added to your account.</li>
              <li>If you encounter an "expired" error, please contact the person who provided the code.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
