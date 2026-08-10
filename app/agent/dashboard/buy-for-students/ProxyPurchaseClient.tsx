"use client";

import { useState } from "react";
import { Course } from "@/app/api/courses/interface";
import { usePaystack } from "@/hooks/usePaystack";
import { formatCurrency } from "@/lib/utils";
import { TierKey, getTierPrice } from "@/lib/tiers";
import { CheckCircle2, ShoppingCart, Loader2, ChevronDown, BookOpen, KeyRound, Check, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ProxyPurchaseClient({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const { checkout, status, error, reset } = usePaystack();

  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedTier, setSelectedTier] = useState<TierKey>("basic");
  const [quantity, setQuantity] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const targetPrice = selectedCourse ? getTierPrice(selectedCourse, selectedTier) : 0;
  const totalPrice = targetPrice * quantity;

  const handleCheckout = () => {
    if (!selectedCourseId || quantity < 1) return;
    checkout(selectedCourseId, selectedTier, quantity);
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-md p-8 sm:p-10 border border-neutral-200/80 shadow-2xs max-w-2xl mx-auto text-center space-y-6">
        <div className="h-20 w-20 bg-[#17A546]/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#17A546]/20">
          <CheckCircle2 className="h-10 w-10 text-[#17A546]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#0A1B39]">Purchase Successful!</h2>
          <p className="text-xs sm:text-sm text-[#676E85] mt-2 mx-auto">
            You have successfully purchased <strong>{quantity}</strong> access code{quantity > 1 ? "s" : ""} for{" "}
            <strong className="text-[#0A1B39]">{selectedCourse?.title}</strong> ({selectedTier.toUpperCase()} tier).
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/agent/dashboard/access-codes"
            className="px-6 py-3 bg-[#17A546] hover:bg-[#128a39] text-white rounded-md font-bold text-xs transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>View Access Codes</span>
          </Link>
          <button
            onClick={() => {
              reset();
              setSelectedCourseId("");
              setQuantity(1);
            }}
            className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-[#0A1B39] rounded-md font-bold text-xs transition-colors"
          >
            Buy More Codes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Left 2 Columns: Step 1, Step 2, Step 3 */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Select Course */}
        <div className="bg-white rounded-md p-6 border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0A1B39] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#17A546]/10 text-[#17A546] text-xs flex items-center justify-center font-extrabold border border-[#17A546]/20">
                1
              </span>
              Select Target Course
            </h3>
            {selectedCourse && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#17A546] bg-[#17A546]/10 px-2 py-0.5 rounded border border-[#17A546]/20 flex items-center gap-1">
                <Check className="w-3 h-3" /> Course Selected
              </span>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A546]/50 text-sm flex items-center justify-between transition-colors hover:bg-neutral-100/50"
            >
              {selectedCourse ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#17A546]/10 flex items-center justify-center shrink-0 border border-[#17A546]/20">
                    <BookOpen className="w-4 h-4 text-[#17A546]" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#0A1B39] text-sm">{selectedCourse.title}</p>
                    <p className="text-[10px] text-[#676E85] uppercase tracking-wider font-bold mt-0.5">
                      {selectedCourse.level} • {selectedCourse.term} Term • {selectedCourse.subject}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-[#676E85] font-medium flex items-center gap-2 text-xs sm:text-sm">
                  <BookOpen className="w-4 h-4 text-[#98A2B3]" /> -- Choose a Course to Buy Access Codes --
                </span>
              )}
              <ChevronDown className={cn("w-5 h-5 text-[#98A2B3] transition-transform shrink-0", isDropdownOpen && "rotate-180")} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md border border-neutral-200/80 shadow-xl z-20 max-h-[320px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                  {courses.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#676E85]">No active courses available</div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {courses.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            setSelectedTier("basic");
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors",
                            selectedCourseId === course.id
                              ? "bg-[#17A546]/10 border border-[#17A546]/20"
                              : "hover:bg-neutral-50 border border-transparent"
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                              selectedCourseId === course.id ? "bg-[#17A546] shadow-2xs text-white" : "bg-neutral-100 text-[#98A2B3]"
                            )}
                          >
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className={cn("font-bold text-xs sm:text-sm", selectedCourseId === course.id ? "text-[#17A546]" : "text-[#0A1B39]")}>
                              {course.title}
                            </p>
                            <p className="text-[10px] text-[#676E85] uppercase tracking-wider font-bold mt-0.5">
                              {course.level} • {course.term} Term • {course.subject}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {selectedCourse && (
          <>
            {/* Step 2: Select Tier */}
            <div className="bg-white rounded-md p-6 border border-neutral-200/80 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-[#0A1B39] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#17A546]/10 text-[#17A546] text-xs flex items-center justify-center font-extrabold border border-[#17A546]/20">
                  2
                </span>
                Select Access Tier
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Basic Tier */}
                <button
                  onClick={() => setSelectedTier("basic")}
                  className={cn(
                    "p-4 rounded-md border-2 text-left transition-all relative overflow-hidden",
                    selectedTier === "basic"
                      ? "border-[#17A546] bg-[#17A546]/5 shadow-2xs"
                      : "border-neutral-200/80 hover:border-neutral-300 bg-white"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-[#0A1B39] text-sm">Basic</h4>
                    {selectedTier === "basic" && (
                      <span className="w-2 h-2 rounded-full bg-[#17A546]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#676E85] mb-3">Reading material & text lessons</p>
                  <p className="font-extrabold text-[#17A546] text-sm">{formatCurrency(selectedCourse.price)}</p>
                </button>

                {/* Standard Tier */}
                <button
                  onClick={() => setSelectedTier("standard")}
                  disabled={!selectedCourse.standardPrice}
                  className={cn(
                    "p-4 rounded-md border-2 text-left transition-all relative overflow-hidden",
                    !selectedCourse.standardPrice
                      ? "opacity-50 cursor-not-allowed bg-neutral-50 border-neutral-200"
                      : selectedTier === "standard"
                        ? "border-blue-500 bg-blue-50/40 shadow-2xs"
                        : "border-neutral-200/80 hover:border-neutral-300 bg-white"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-[#0A1B39] text-sm">Standard</h4>
                    {selectedTier === "standard" && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#676E85] mb-3">Includes Past Questions & CBT</p>
                  <p className="font-extrabold text-blue-600 text-sm">
                    {selectedCourse.standardPrice ? formatCurrency(selectedCourse.standardPrice) : "N/A"}
                  </p>
                </button>

                {/* Premium Tier */}
                <button
                  onClick={() => setSelectedTier("premium")}
                  disabled={!selectedCourse.premiumPrice}
                  className={cn(
                    "p-4 rounded-md border-2 text-left transition-all relative overflow-hidden",
                    !selectedCourse.premiumPrice
                      ? "opacity-50 cursor-not-allowed bg-neutral-50 border-neutral-200"
                      : selectedTier === "premium"
                        ? "border-purple-500 bg-purple-50/40 shadow-2xs"
                        : "border-neutral-200/80 hover:border-neutral-300 bg-white"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-[#0A1B39] text-sm">Premium</h4>
                    {selectedTier === "premium" && (
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#676E85] mb-3">Includes Full Video Lessons</p>
                  <p className="font-extrabold text-purple-600 text-sm">
                    {selectedCourse.premiumPrice ? formatCurrency(selectedCourse.premiumPrice) : "N/A"}
                  </p>
                </button>
              </div>
            </div>

            {/* Step 3: Number of Students */}
            <div className="bg-white rounded-md p-6 border border-neutral-200/80 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-[#0A1B39] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#17A546]/10 text-[#17A546] text-xs flex items-center justify-center font-extrabold border border-[#17A546]/20">
                  3
                </span>
                Quantity (Number of Students)
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <p className="text-xs text-[#676E85] max-w-fit">
                  Specify how many access codes to generate. Each code grants 1 student instant access to this course.
                </p>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[#0A1B39] font-bold border border-neutral-200/80 flex items-center justify-center transition-colors shadow-2xs active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-10 w-20 text-center font-bold text-sm bg-neutral-50 border border-neutral-200/80 rounded-md focus:outline-none focus:ring-1 focus:ring-[#17A546] text-[#0A1B39]"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[#0A1B39] font-bold border border-neutral-200/80 flex items-center justify-center transition-colors shadow-2xs active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Column: Order Summary */}
      <div className="space-y-6">
        <div className="bg-white rounded-md p-6 border border-neutral-200/80 shadow-2xs sticky top-24 space-y-4">
          <h3 className="text-base font-bold text-[#0A1B39] border-b border-neutral-100 pb-3">
            Order Summary
          </h3>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-md border border-red-100">
              {error}
            </div>
          )}

          {!selectedCourse ? (
            <div className="py-12 text-center text-xs text-[#676E85]">
              Select a course on the left to review your order details.
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[#676E85] font-medium">Selected Course</span>
                <span className="font-bold text-[#0A1B39] text-right">{selectedCourse.title}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#676E85] font-medium">Access Tier</span>
                <span className="font-bold text-[#0A1B39] uppercase px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200 text-[10px]">
                  {selectedTier}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#676E85] font-medium">Price per Code</span>
                <span className="font-semibold text-[#0A1B39]">{formatCurrency(targetPrice)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#676E85] font-medium">Code Quantity</span>
                <span className="font-bold text-[#0A1B39]">x{quantity}</span>
              </div>

              <div className="border-t border-neutral-100 pt-4 mt-4 space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[#0A1B39] font-bold text-sm">Total Payable</span>
                  <span className="text-2xl font-black text-[#17A546]">{formatCurrency(totalPrice)}</span>
                </div>
                <p className="text-[10px] text-[#98A2B3]">
                  Immediate commission will be credited to your agent balance upon payment.
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={status === "loading"}
                className="w-full mt-4 py-3 bg-[#17A546] hover:bg-[#128a39] text-white rounded-md font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xs active:scale-[0.98]"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" /> Pay & Generate Access Codes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
