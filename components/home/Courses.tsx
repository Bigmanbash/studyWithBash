"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

interface CourseItem {
  id: string;
  badge: string;
  category: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

const popularCourses: CourseItem[] = [
  {
    id: "sss",
    badge: "SS1 - SS3",
    category: "SSS (Senior Secondary)",
    title: "SSS (SS1 – SS3)",
    description: "All subjects, structured by term with progress tracking.",
    image: "/img/course_sss.jpg",
    href: "/courses?filter=sss",
  },
  {
    id: "waec",
    badge: "12 Subjects",
    category: "WAEC",
    title: "WAEC Preparation",
    description: "Past questions, key notes and expert guides for your success.",
    image: "/img/course_waec.jpg",
    href: "/courses?filter=waec",
  },
  {
    id: "jamb",
    badge: "10 Subjects",
    category: "JAMB",
    title: "JAMB Preparation",
    description: "Practice questions, high-yield content and exam tips.",
    image: "/img/course_jamb.jpg",
    href: "/courses?filter=jamb",
  },
  {
    id: "neco",
    badge: "10 Subjects",
    category: "NECO",
    title: "NECO Preparation",
    description: "Past questions, study guides and smart practice.",
    image: "/img/course_neco.jpg",
    href: "/courses?filter=neco",
  },
  {
    id: "study-packs",
    badge: "Study Packs",
    category: "Study Packs",
    title: "Combined Study Packs",
    description: "Get the best value with all your subjects in one pack.",
    image: "/img/course_studypack.jpg",
    href: "/courses",
  },
  {
    id: "mock-tests",
    badge: "Exam Boost",
    category: "Exam Boost",
    title: "Mock Tests & Practice",
    description: "Simulate real exams and build confidence before the big day.",
    image: "/img/course_mocktests.jpg",
    href: "/courses",
  },
];

export function Courses() {
  const { ref: headerRef, inView: headerInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView(0.05);

  return (
    <section id="courses" className="py-20 sm:py-24 lg:py-28 bg-[#EEF7F2] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header Row: Title & Subtitle on Left, 'View all courses' on Right */}
        <div
          ref={headerRef}
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12 text-left ${headerInView ? "animate-fade-in-up" : "opacity-0"
            }`}
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-1 text-xs sm:text-sm font-semibold bg-[#E8F7EE] text-[#17A546] border border-[#17A546]/20 mb-3">
              Our Courses
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#0A1B39] leading-[1.25]">
              Available Courses
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#676E85] leading-relaxed">
              Choose your exam, pick a course and start learning today.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#17A546] hover:text-[#128638] transition-colors shrink-0 group self-start md:self-auto"
          >
            <span>View all courses</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Course Cards Grid: 2 rows of 3 */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          {popularCourses.map((course, idx) => (
            <Link
              key={course.id}
              href={course.href}
              className={`group bg-white rounded-md border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col ${gridInView ? "animate-fade-in-up" : "opacity-0"
                }`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              {/* Card Image with Floating Subject Pill */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-t-md">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-md bg-white/95 backdrop-blur-sm text-xs font-semibold text-[#0A1B39] shadow-sm border border-neutral-100">
                  {course.badge}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-[#E8F7EE] text-[#17A546] mb-3.5">
                    {course.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0A1B39] group-hover:text-[#17A546] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="mt-2.5 text-sm sm:text-[15px] text-[#676E85] leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-sm sm:text-base font-bold text-[#17A546] group-hover:text-[#128638]">
                  <span>View course</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
