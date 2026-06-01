import Link from "next/link";
import {
  ArrowLeft,
  PlayCircle,
  BookOpen,
  Brain,
  Trophy,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Header } from "@/components/app_components/Header";
import { Footer } from "@/components/app_components/Footer";
import { Button } from "@/components/ui/button";

export default function TopicDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-(--card)">
      <Header />

      {/* Top Navigation Bar */}
      <div className="bg-(--card) border-b border-border/60 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/courses/ss1-physics"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-(--muted) hover:text-(--heading) transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Physics (SS1)</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[13px] font-semibold text-(--muted)">
              <span className="text-[#17A546]">25%</span> completed
            </div>
            <div className="h-2 w-24 sm:w-32 bg-(--card) rounded-md overflow-hidden">
              <div
                className="h-full bg-[#17A546] rounded-md"
                style={{ width: "25%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#17A546]/10 text-[#17A546] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-[#17A546]/20">
              Module 1
            </div>
            <h1 className="text-[28px] sm:text-4xl md:text-5xl font-extrabold text-(--heading) leading-[1.2] sm:leading-tight mb-3 sm:mb-4">
              Motion in a Straight Line
            </h1>
            <p className="text-[15px] sm:text-[17px] text-(--muted) leading-relaxed max-w-3xl">
              Understand the fundamental concepts of kinematics, including
              displacement, velocity, acceleration, and the equations of
              uniformly accelerated motion.
            </p>
          </div>

          {/* Teachings / Explanations */}
          <section className="bg-(--card) rounded-2xl sm:rounded-3xl border border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-5 sm:p-10 mb-6 sm:mb-10">
            <div className="flex items-center gap-3 mb-5 sm:mb-8 pb-4 border-b border-border">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <BookOpen className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <h2 className="text-[19px] sm:text-[22px] font-bold text-(--heading)">
                Theory & Explanations
              </h2>
            </div>

            <div className="prose prose-neutral max-w-none text-[#475467]">
              <p className="text-[14.5px] sm:text-[16px] leading-relaxed mb-5 sm:mb-6">
                <strong>Kinematics</strong> is the branch of mechanics that
                describes the motion of points, bodies, and systems of bodies
                without considering the forces that cause them to move.
              </p>
              <h3 className="text-[17px] sm:text-[19px] font-bold text-(--heading) mt-6 sm:mt-8 mb-3 sm:mb-4">
                1. Distance and Displacement
              </h3>
              <ul className="space-y-3 mb-6 list-disc pl-5">
                <li className="text-[15px] sm:text-[16px]">
                  <strong>Distance (Scalar):</strong> The total length of the
                  path traveled by an object, regardless of direction.
                </li>
                <li className="text-[15px] sm:text-[16px]">
                  <strong>Displacement (Vector):</strong> The shortest
                  straight-line distance from the initial to the final position,
                  along with its direction.
                </li>
              </ul>

              <div className="bg-(--card) p-4 sm:p-6 rounded-[12px] sm:rounded-2xl border border-border/60 my-6 sm:my-8">
                <h4 className="text-[14px] sm:text-[15px] font-bold text-(--heading) mb-3">
                  Equations of Uniformly Accelerated Motion
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-(--card) p-3.5 sm:p-4 rounded-lg shadow-sm border border-border text-center font-mono text-[14px] font-medium text-[#17A546]">
                    v = u + at
                  </div>
                  <div className="bg-(--card) p-3.5 sm:p-4 rounded-lg shadow-sm border border-border text-center font-mono text-[14px] font-medium text-[#17A546]">
                    s = ut + ½at²
                  </div>
                  <div className="bg-(--card) p-3.5 sm:p-4 rounded-lg shadow-sm border border-border text-center font-mono text-[14px] font-medium text-[#17A546]">
                    v² = u² + 2as
                  </div>
                  <div className="bg-(--card) p-3.5 sm:p-4 rounded-lg shadow-sm border border-border text-center text-[12px] sm:text-[13px] text-(--muted) flex items-center justify-center">
                    Where: u = initial velocity, v = final velocity, a =
                    acceleration, t = time, s = displacement
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Examples with Solutions */}
          <section className="bg-(--card) rounded-[12px] sm:rounded-2xl border border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-5 sm:p-10 mb-6 sm:mb-10">
            <div className="flex items-center gap-3 mb-5 sm:mb-8 pb-4 border-b border-border">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Brain className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-amber-500" />
              </div>
              <h2 className="text-[19px] sm:text-[22px] font-bold text-(--heading)">
                Worked Examples
              </h2>
            </div>

            <div className="space-y-5 sm:space-y-8">
              {/* Easy Example */}
              <div className="border border-border/60 rounded-[12px] sm:rounded-2xl overflow-hidden">
                <div className="bg-[rgba(148,163,184,0.08)] px-4 py-3.5 sm:px-5 sm:py-4 border-b border-border/60 flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                    Easy
                  </span>
                  <h4 className="text-[14px] sm:text-[15px] font-bold text-(--heading)">
                    Finding Acceleration
                  </h4>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-[14px] sm:text-[15.5px] text-[#475467] mb-5 sm:mb-6">
                    A car accelerates uniformly from rest to a velocity of 20
                    m/s in 10 seconds. Calculate its acceleration.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 sm:p-5 border border-emerald-200/70 dark:border-emerald-700/80">
                    <h5 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider mb-2.5 sm:mb-3 text-emerald-700 dark:text-emerald-200">
                      Solution
                    </h5>
                    <div className="text-[13px] sm:text-[14.5px] space-y-1.5 sm:space-y-2 text-sky-700 dark:text-sky-300">
                      <p>Given: u = 0 m/s, v = 20 m/s, t = 10 s</p>
                      <p>Using: v = u + at</p>
                      <p>20 = 0 + a(10)</p>
                      <p>10a = 20</p>
                      <p className="font-bold mt-2 sm:mt-3 text-emerald-800 dark:text-emerald-200">
                        a = 2 m/s²
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medium Example */}
              <div className="border border-border/60 rounded-[12px] sm:rounded-2xl overflow-hidden">
                <div className="bg-[rgba(148,163,184,0.08)] px-4 py-3.5 sm:px-5 sm:py-4 border-b border-border/60 flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                    Medium
                  </span>
                  <h4 className="text-[14px] sm:text-[15px] font-bold text-(--heading)">
                    Finding Distance
                  </h4>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-[14px] sm:text-[15.5px] text-[#475467] mb-5 sm:mb-6">
                    Using the same car from the previous example, calculate the
                    distance covered in those 10 seconds.
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 sm:p-5 border border-amber-200/70 dark:border-amber-700/80">
                    <h5 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider mb-2.5 sm:mb-3 text-amber-700 dark:text-amber-200">
                      Solution
                    </h5>
                    <div className="text-[13px] sm:text-[14.5px] space-y-1.5 sm:space-y-2 text-sky-700 dark:text-sky-300">
                      <p>Using: s = ut + ½at²</p>
                      <p>s = (0)(10) + ½(2)(10)²</p>
                      <p>s = 0 + (1)(100)</p>
                      <p className="font-bold mt-2 sm:mt-3 text-amber-800 dark:text-amber-200">
                        s = 100 meters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Practice Questions */}
          <section className="bg-(--card) rounded-[12px] sm:rounded-2xl border border-[#17A546]/20 shadow-[0_8px_30px_-4px_rgba(23,165,70,0.08)] p-5 sm:p-10 mb-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#17A546]/10 flex items-center justify-center shrink-0">
                  <Trophy className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-[#17A546]" />
                </div>
                <h2 className="text-[19px] sm:text-[22px] font-bold text-(--heading)">
                  Practice Questions
                </h2>
              </div>
              <span className="bg-[#17A546] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                10 Qs
              </span>
            </div>

            <div className="text-center py-6 sm:py-10">
              <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-[rgba(148,163,184,0.08)] items-center justify-center mb-5 sm:mb-6 border border-border/60 shadow-inner">
                <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8 text-[#17A546]" />
              </div>
              <h3 className="text-[17px] sm:text-lg font-bold text-(--heading) mb-2">
                Ready to test your knowledge?
              </h3>
              <p className="text-[14px] sm:text-[15px] text-(--muted) mb-6 sm:mb-8 max-w-2xl mx-auto">
                Take a quick 10-question quiz to ensure you have fully grasped
                the concepts of motion in a straight line.
              </p>
              <Button className="w-full sm:w-auto h-auto bg-[#17A546] hover:bg-[#14933E] text-white font-bold px-8 sm:px-10 py-3.5 sm:py-4 text-[14px] sm:text-[15px] rounded-lg sm:rounded-lg shadow-lg shadow-[#17A546]/20 transition-all hover:-translate-y-0.5">
                Start Practice Quiz
              </Button>
            </div>
          </section>

          {/* Bottom Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/60">
            <Link href="#" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-auto px-5 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-lg border-border text-(--muted) hover:text-(--heading) font-semibold text-[14px] sm:text-[15px]"
              >
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Previous: Vectors
              </Button>
            </Link>
            <Link href="#" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-auto px-5 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-lg border-border text-(--muted) hover:text-(--heading) font-semibold text-[14px] sm:text-[15px]"
              >
                <ChevronRight className="mr-1.5 h-4 w-4" />
                {"Next: Newton's Laws"}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
