import { CourseCard, CourseData } from "@/components/courses/CourseCard";
import { FileText, Video, Sparkles, ShieldCheck, Check } from "lucide-react";

const courses: CourseData[] = [
  {
    slug: "sss1",
    title: "SS 1 Bundle",
    subject: "Physics, Chemistry, Biology & Math",
    level: "Senior Secondary",
    originalPrice: 1500,
    price: 3000,
    color: "bg-[#17A546]",
    iconBg: "bg-[#17A546]/10 text-[#17A546]",
  },
  {
    slug: "sss2",
    title: "SS 2 Bundle",
    subject: "Physics, Chemistry, Biology & Math",
    level: "Senior Secondary",
    originalPrice: 1500,
    price: 3000,
    color: "bg-[#4A85E4]",
    iconBg: "bg-[#4A85E4]/10 text-[#4A85E4]",
  },
  {
    slug: "sss3",
    title: "SS 3 Bundle",
    subject: "Physics, Chemistry, Biology & Math",
    level: "Senior Secondary",
    originalPrice: 1500,
    price: 3000,
    color: "bg-[#DEAB06]",
    iconBg: "bg-[#DEAB06]/10 text-[#DEAB06]",
  },
  {
    slug: "waec-package",
    title: "WAEC Special",
    subject: "Complete Past Questions & Summaries",
    level: "Exam Prep",
    originalPrice: 1500,
    price: 3000,
    color: "bg-[#F5B546]",
    iconBg: "bg-[#F5B546]/10 text-[#F5B546]",
  },
  {
    slug: "neco-package",
    title: "NECO Special",
    subject: "Targeted Topic Drills & Mock Solutions",
    level: "Exam Prep",
    originalPrice: 1500,
    price: 3000,
    color: "bg-[#DD524D]",
    iconBg: "bg-[#DD524D]/10 text-[#DD524D]",
  },
  {
    slug: "jamb-package",
    title: "JAMB Masterclass",
    subject: "High-Yield Topics & CBT Practice",
    level: "Exam Prep",
    originalPrice: 1500,
    price: 3000,
    color: "bg-[#030E36]",
    iconBg: "bg-[#030E36]/10 text-[#030E36]",
  },
];

const tierFeatures = [
  {
    name: "Basic Tier",
    badge: "Essential",
    badgeBg: "bg-neutral-100 text-[#676E85] border-neutral-200",
    icon: FileText,
    iconColor: "text-[#676E85]",
    cardBg: "bg-[#F7F9FC] border-neutral-200/60",
    desc: "Full comprehensive topic study notes and downloadable PDFs for offline reading.",
    popular: false,
  },
  {
    name: "Standard Tier",
    badge: "Most Popular",
    badgeBg: "bg-[#17A546] text-white border-transparent",
    icon: Video,
    iconColor: "text-[#17A546]",
    cardBg: "bg-[#17A546]/[0.05] border-[#17A546]/30 shadow-2xs ring-1 ring-[#17A546]/20",
    desc: "Includes all Basic notes PLUS video lectures explaining complex topics step-by-step.",
    popular: true,
  },
  {
    name: "Premium Tier",
    badge: "Best Value",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Sparkles,
    iconColor: "text-blue-600",
    cardBg: "bg-[#F7F9FC] border-neutral-200/60",
    desc: "Complete access with video lectures, priority Q&A support, and free lifetime updates.",
    popular: false,
  },
];

export function Courses() {
  return (
    <section id="courses" className="py-12 sm:py-20 bg-[#F7F9FC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-10 text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#17A546]/10 border border-[#17A546]/20 rounded-full px-3 py-0.5 mb-2.5">
            <Sparkles className="h-3 w-3 text-[#17A546]" />
            <span className="text-[#17A546] text-[11px] sm:text-xs font-semibold">Curriculum & Learning Options</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#0A1B39]">
            Available Courses & Flexible Tiers
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#676E85] leading-relaxed">
            Everything you need to excel in your exams. Choose the learning tier that fits your budget and study style.
          </p>
        </div>

        {/* Tier Info Callout Banner */}
        <div className="mb-8 sm:mb-10 bg-white rounded-md p-4 sm:p-6 border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-[#17A546]" />
            <h3 className="font-bold text-xs sm:text-sm text-[#0A1B39]">Understand Our 3 Course Access Tiers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {tierFeatures.map((tier) => (
              <div
                key={tier.name}
                className={`p-4 rounded-md border flex flex-col justify-between space-y-3 ${tier.cardBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <tier.icon className={`w-4 h-4 ${tier.iconColor}`} />
                      <span className="font-bold text-xs sm:text-sm text-[#0A1B39]">{tier.name}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${tier.badgeBg}`}>
                      {tier.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#676E85] leading-relaxed">
                    {tier.desc}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-neutral-200/60 flex items-center text-[11px] font-semibold text-[#17A546]">
                  <Check className="w-3.5 h-3.5 mr-1" /> Available for all courses
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
