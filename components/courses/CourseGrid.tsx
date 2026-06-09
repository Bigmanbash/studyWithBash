import { CourseCard, type CourseData } from "./CourseCard";

const allCourses: CourseData[] = [
  // Senior Secondary
  {
    slug: "sss1",
    title: "SS 1",
    subject: "All Subjects Bundle",
    level: "SS1",
    originalPrice: 5000,
    price: 2500,
    color: "bg-[#17A546]",
    iconBg: "bg-[#17A546]/10 text-[#17A546]",
  },
  {
    slug: "sss2",
    title: "SS 2",
    subject: "All Subjects Bundle",
    level: "SS2",
    originalPrice: 5000,
    price: 2500,
    color: "bg-[#4A85E4]",
    iconBg: "bg-[#4A85E4]/10 text-[#4A85E4]",
  },
  {
    slug: "sss3",
    title: "SS 3",
    subject: "All Subjects Bundle",
    level: "SS3",
    originalPrice: 5000,
    price: 2500,
    color: "bg-[#DEAB06]",
    iconBg: "bg-[#DEAB06]/10 text-[#DEAB06]",
  },
  // Exam Prep
  {
    slug: "waec-package",
    title: "WAEC",
    subject: "Complete WAEC Prep",
    level: "WAEC",
    originalPrice: 5000,
    price: 2500,
    color: "bg-[#F5B546]",
    iconBg: "bg-[#F5B546]/10 text-[#F5B546]",
  },
  {
    slug: "neco-package",
    title: "NECO",
    subject: "Complete NECO Prep",
    level: "NECO",
    originalPrice: 5000,
    price: 2500,
    color: "bg-[#DD524D]",
    iconBg: "bg-[#DD524D]/10 text-[#DD524D]",
  },
  {
    slug: "jamb-package",
    title: "JAMB",
    subject: "Complete JAMB Prep",
    level: "JAMB",
    originalPrice: 5000,
    price: 2500,
    color: "bg-[#030E36]",
    iconBg: "bg-[#030E36]/10 text-[#030E36]",
  },
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