import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseHeaderProps {
  title: string;
  subject: string;
  level: string;
  topics: number;
  duration: string;
  students: string;
  color: string;
}

export function CourseHeader({ title, subject, level, topics, duration, students, color }: CourseHeaderProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 bg-[#0A1B39]">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#17A546]/20 blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="inline-flex items-center rounded-xl border border-[#17A546]/30 bg-[#17A546]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#17A546] shadow-[0_0_15px_rgba(23,165,70,0.2)] backdrop-blur-md">
                {level}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="text-sm font-medium text-white/70">{subject}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {title}
            </h1>

            {/* Meta row */}
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-[15px] font-medium text-white/70">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-[#17A546]" />
                <span>{topics} topics</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <Clock className="h-4 w-4 text-[#17A546]" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <Users className="h-4 w-4 text-[#17A546]" />
                <span>{students} students</span>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#17A546] to-[#14933E] hover:from-[#14933E] hover:to-[#117a33] text-white font-bold px-10 py-6 text-[15px] rounded-2xl shadow-[0_8px_30px_-4px_rgba(23,165,70,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(23,165,70,0.5)] transform hover:-translate-y-1 transition-all duration-300 border border-[#17A546]/50">
            Start Learning Now
          </Button>
        </div>
      </div>
    </section>
  );
}
