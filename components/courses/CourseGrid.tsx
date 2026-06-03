import { CourseCard, type CourseData } from "./CourseCard";

const allCourses: CourseData[] = [
  // SS1
  { slug: "ss1-physics", title: "Physics (SS1)", subject: "Measurement, Mechanics & Motion", level: "SS1", materialsCount: 14, originalPrice: 15000, price: 9000, color: "bg-blue-500", iconBg: "bg-blue-500/10 text-blue-500" },
  { slug: "ss1-chemistry", title: "Chemistry (SS1)", subject: "Atomic Structure & Chemical Bonding", level: "SS1", materialsCount: 12, originalPrice: 15000, price: 9000, color: "bg-amber-500", iconBg: "bg-amber-500/10 text-amber-500" },
  { slug: "ss1-mathematics", title: "Mathematics (SS1)", subject: "Number & Numeration, Algebra", level: "SS1", materialsCount: 16, originalPrice: 15000, price: 9000, color: "bg-[#17A546]", iconBg: "bg-[#17A546]/10 text-[#17A546]" },
  { slug: "ss1-further-math", title: "Further Mathematics (SS1)", subject: "Sets, Logic & Real Numbers", level: "SS1", materialsCount: 10, originalPrice: 15000, price: 9000, color: "bg-purple-500", iconBg: "bg-purple-500/10 text-purple-500" },
  // SS2
  { slug: "ss2-physics", title: "Physics (SS2)", subject: "Waves, Light & Electricity", level: "SS2", materialsCount: 15, originalPrice: 15000, price: 9000, color: "bg-blue-500", iconBg: "bg-blue-500/10 text-blue-500" },
  { slug: "ss2-chemistry", title: "Chemistry (SS2)", subject: "Organic Chemistry & Reactions", level: "SS2", materialsCount: 13, originalPrice: 15000, price: 9000, color: "bg-amber-500", iconBg: "bg-amber-500/10 text-amber-500" },
  { slug: "ss2-mathematics", title: "Mathematics (SS2)", subject: "Trigonometry & Coordinate Geometry", level: "SS2", materialsCount: 14, originalPrice: 15000, price: 9000, color: "bg-[#17A546]", iconBg: "bg-[#17A546]/10 text-[#17A546]" },
  { slug: "ss2-further-math", title: "Further Mathematics (SS2)", subject: "Calculus & Vectors", level: "SS2", materialsCount: 12, originalPrice: 15000, price: 9000, color: "bg-purple-500", iconBg: "bg-purple-500/10 text-purple-500" },
  // SS3
  { slug: "ss3-physics", title: "Physics (SS3)", subject: "Nuclear & Modern Physics", level: "SS3", materialsCount: 11, originalPrice: 15000, price: 9000, color: "bg-blue-500", iconBg: "bg-blue-500/10 text-blue-500" },
  { slug: "ss3-chemistry", title: "Chemistry (SS3)", subject: "Industrial Chemistry & Equilibrium", level: "SS3", materialsCount: 10, originalPrice: 15000, price: 9000, color: "bg-amber-500", iconBg: "bg-amber-500/10 text-amber-500" },
  { slug: "ss3-mathematics", title: "Mathematics (SS3)", subject: "Statistics & Probability", level: "SS3", materialsCount: 12, originalPrice: 15000, price: 9000, color: "bg-[#17A546]", iconBg: "bg-[#17A546]/10 text-[#17A546]" },
  // JAMB
  { slug: "jamb-physics", title: "JAMB Physics", subject: "Full JAMB Physics Syllabus", level: "JAMB", materialsCount: 45, originalPrice: 20000, price: 12000, color: "bg-blue-500", iconBg: "bg-rose-500/10 text-rose-500" },
  { slug: "jamb-chemistry", title: "JAMB Chemistry", subject: "Full JAMB Chemistry Syllabus", level: "JAMB", materialsCount: 38, originalPrice: 20000, price: 12000, color: "bg-amber-500", iconBg: "bg-rose-500/10 text-rose-500" },
  { slug: "jamb-mathematics", title: "JAMB Mathematics", subject: "Full JAMB Mathematics Syllabus", level: "JAMB", materialsCount: 52, originalPrice: 20000, price: 12000, color: "bg-[#17A546]", iconBg: "bg-rose-500/10 text-rose-500" },
];

interface CourseGridProps {
  filter: string;
}

export function CourseGrid({ filter }: CourseGridProps) {
  const filtered = filter === "all"
    ? allCourses
    : allCourses.filter((c) => c.level.toLowerCase() === filter);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {filtered.map((course) => (
        <CourseCard key={course.slug} course={course} />
      ))}
    </div>
  );
}