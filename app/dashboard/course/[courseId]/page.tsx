"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, FileText, Lock, ShoppingCart, Eye, Loader2, BookOpen, Tag } from "lucide-react";
import { AvailableCourses , PageHeader } from "@/components/dashboard";
import { use, useState } from "react";
import { useCourseDetails } from "@/hooks/useStudentDashboard";
import { usePaystack } from "@/hooks/usePaystack";
import { PaymentSuccessModal } from "@/components/modals/PaymentSuccessModal";

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const { data, isLoading, error } = useCourseDetails(resolvedParams.courseId);
  const { checkout, status: payStatus, error: payError, reset: payReset } = usePaystack();

  const handlePayNow = async () => {
    await checkout(resolvedParams.courseId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] text-center p-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1B39] mb-2">Course not found</h2>
          <p className="text-[#676E85] mb-6">
            The course you are looking for does not exist or you do not have permission to view it.
          </p>
          <Link href="/dashboard" className="text-brand-green hover:underline font-medium">
            Go back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { course, isPurchased } = data;

  const handlePreview = () => {
    router.push(`/dashboard/read/${resolvedParams.courseId}?preview=true`);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center max-w-7xl mx-auto">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-[#676E85] hover:text-[#0A1B39] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-6xl mx-auto space-y-10">

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">

          {/* Left Col: Cover Image */}
          <div className="w-full lg:w-[42%] bg-neutral-50 p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-neutral-100">
            {/* Image container — fixed aspect ratio, no stretching */}
            <div className="relative w-full max-w-[280px] aspect-3/4 rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
              <Image
                src={course?.coverImagePath || "/img/hero_section.png"}
                alt={`${course.title} cover`}
                fill
                className="object-cover w-full h-full"
                // sizes="(max-width: 768px) 80vw, 280px"
                priority
              />
              {/* Lock overlay for unpurchased */}
              {!isPurchased && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-5 text-center">
                  <div className="bg-white/10 rounded-full p-3 mb-3 border border-white/20">
                    <Lock className="w-7 h-7 opacity-90" />
                  </div>
                  <p className="text-sm font-semibold mb-1">Full Document Locked</p>
                  <p className="text-xs opacity-75 mb-5 leading-relaxed">
                    Purchase to unlock full PDF access
                  </p>
                  <button
                    onClick={handlePreview}
                    className="bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview First 3 Pages
                  </button>
                </div>
              )}
            </div>

            {/* Purchased badge below image */}
            {isPurchased && (
              <p className="mt-4 text-sm text-[#17A546] flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4" />
                You own this material
              </p>
            )}
          </div>

          {/* Right Col: Details */}
          <div className="w-full lg:w-[58%] p-6 sm:p-8 lg:p-10 flex flex-col">
            <div className="flex-1">

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-black uppercase tracking-wide">
                  <Tag className="w-3 h-3" />
                  {course.category}
                </span>
                {course.level && (
                  <span className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {course.level}
                  </span>
                )}
                {course.term && (
                  <span className="inline-flex items-center rounded-md border border-purple-100 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600 capitalize tracking-wide">
                    {course.term} Term
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1B39] mb-3 leading-tight">
                {course.title}
              </h1>

              {/* Subject line */}
              {course.subject && (
                <p className="text-sm text-brand-green font-medium mb-4 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {course.subject}
                </p>
              )}

              {/* Description */}
              <p className="text-[15px] text-[#676E85] mb-8 leading-relaxed">
                {course.description || "No description provided."}
              </p>

              {/* What's included */}
              <div className="space-y-3 mb-8">
                <h3 className="text-sm font-semibold text-[#0A1B39] uppercase tracking-wide">
                  What's included
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Full comprehensive document",
                    "Printable high-quality PDF format",
                    "Lifetime access after purchase",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[14px] text-[#676E85]">
                      <CheckCircle className="w-4 h-4 text-[#17A546] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="pt-6 border-t border-neutral-100 mt-auto">
              {!isPurchased ? (
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                  <div>
                    <p className="text-xs text-[#676E85] mb-1 uppercase tracking-wide font-medium">One-time payment</p>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-extrabold text-[#0A1B39]">
                        ₦{(course.price / 100).toLocaleString()}
                      </span>
                      {course.originalPrice && (
                        <span className="text-base text-[#98A2B3] line-through font-medium">
                          ₦{(course.originalPrice / 100).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <p className="text-xs text-[#17A546] font-semibold mt-0.5">
                        Save ₦{((course.originalPrice - course.price) / 100).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                    {payStatus === "failed" && payError && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center justify-between">
                        <span>{payError}</span>
                        <button onClick={payReset} className="text-red-400 hover:text-red-600 ml-2 text-xs font-medium">✕</button>
                      </div>
                    )}
                    <div className="flex gap-2.5">
                      <button
                        onClick={handlePreview}
                        className="bg-neutral-100 hover:bg-neutral-200 text-[#0A1B39] px-4 py-2.5 rounded-md font-semibold text-sm flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={handlePayNow}
                        disabled={payStatus === "loading"}
                        className="bg-[#17A546] hover:bg-[#128638] text-white px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {payStatus === "loading" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                        {payStatus === "loading" ? "Processing..." : "Pay Now"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#676E85] mb-1 uppercase tracking-wide font-medium">Status</p>
                    <p className="font-bold text-[#17A546] flex items-center gap-1.5 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Purchased
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/read/${resolvedParams.courseId}`}
                    className="bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Open Material
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Other Courses */}
        <div>
          <AvailableCourses title="Other Recommended Courses" />
        </div>
      </main>

      {/* Payment Success Modal */}
      {payStatus === "success" && (
        <PaymentSuccessModal onClose={() => { payReset(); router.push("/dashboard"); }} />
      )}
    </div>
  );
}