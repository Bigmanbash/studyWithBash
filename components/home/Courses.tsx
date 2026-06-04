import { CourseCard, CourseData } from "@/components/courses/CourseCard";

const courses: CourseData[] = [
  {
    slug: "sss1",
    title: "SS 1",
    subject: "All Subjects Bundle",
    level: "Senior Secondary",
    originalPrice: 2000,
    price: 1500,
    color: "bg-[#17A546]",
    iconBg: "bg-[#17A546]/10 text-[#17A546]",
  },
  {
    slug: "sss2",
    title: "SS 2",
    subject: "All Subjects Bundle",
    level: "Senior Secondary",
    originalPrice: 2000,
    price: 1500,
    color: "bg-[#4A85E4]",
    iconBg: "bg-[#4A85E4]/10 text-[#4A85E4]",
  },
  {
    slug: "sss3",
    title: "SS 3",
    subject: "All Subjects Bundle",
    level: "Senior Secondary",
    originalPrice: 2000,
    price: 1500,
    color: "bg-[#DEAB06]",
    iconBg: "bg-[#DEAB06]/10 text-[#DEAB06]",
  },
  {
    slug: "waec-package",
    title: "WAEC",
    subject: "Complete WAEC Prep",
    level: "Exam Prep",
    originalPrice: 2000,
    price: 1500,
    color: "bg-[#F5B546]",
    iconBg: "bg-[#F5B546]/10 text-[#F5B546]",
  },
  {
    slug: "neco-package",
    title: "NECO",
    subject: "Complete NECO Prep",
    level: "Exam Prep",
    originalPrice: 2000,
    price: 1500,
    color: "bg-[#DD524D]",
    iconBg: "bg-[#DD524D]/10 text-[#DD524D]",
  },
  {
    slug: "jamb-package",
    title: "JAMB",
    subject: "Complete JAMB Prep",
    level: "Exam Prep",
    originalPrice: 2000,
    price: 1500,
    color: "bg-[#030E36]",
    iconBg: "bg-[#030E36]/10 text-[#030E36]",
  },
];

export function Courses() {
  return (
    <section id="courses" className="py-20 bg-neutral-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1B39] sm:text-4xl">
            Available Courses
          </h2>
          <p className="mt-4 text-lg text-[#676E85]">
            Everything you need to excel in your exams. Start learning today.
          </p>
        </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
      </div>
    </section>
  );
}
