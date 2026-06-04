import { CourseCard, CourseData } from "@/components/courses/CourseCard";

const courses: CourseData[] = [
  {
    slug: "sss1-first-term",
    title: "SSS1",
    subject: "Comprehensive Physics",
    level: "SSS 1",
    materialsCount: 15,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#17A546]",
    iconBg: "bg-[#17A546]/10 text-[#17A546]",
  },
  {
    slug: "sss1-second-term",
    title: "SSS1",
    subject: "All Subjects Bundle",
    level: "SSS 1",
    materialsCount: 42,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#4A85E4]",
    iconBg: "bg-[#4A85E4]/10 text-[#4A85E4]",
  },
  {
    slug: "sss1-third-term",
    title: "SSS1",
    subject: "All Subjects Bundle",
    level: "SSS 1",
    materialsCount: 45,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#DEAB06]",
    iconBg: "bg-[#DEAB06]/10 text-[#DEAB06]",
  },
  {
    slug: "sss2-first-term",
    title: "SSS2 First Term",
    subject: "All Subjects Bundle",
    level: "SSS 2",
    materialsCount: 40,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#F5B546]",
    iconBg: "bg-[#F5B546]/10 text-[#F5B546]",
  },
  {
    slug: "sss2-second-term",
    title: "SSS2 Second Term",
    subject: "All Subjects Bundle",
    level: "SSS 2",
    materialsCount: 48,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#DD524D]",
    iconBg: "bg-[#DD524D]/10 text-[#DD524D]",
  },
  {
    slug: "sss2-third-term",
    title: "SSS2 Third Term",
    subject: "All Subjects Bundle",
    level: "SSS 2",
    materialsCount: 43,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#0E7B33]",
    iconBg: "bg-[#0E7B33]/10 text-[#0E7B33]",
  },
  {
    slug: "sss3-first-term",
    title: "SSS3 First Term",
    subject: "All Subjects Bundle",
    level: "SSS 3",
    materialsCount: 35,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#030E36]",
    iconBg: "bg-[#030E36]/10 text-[#030E36]",
  },
  {
    slug: "sss3-second-term",
    title: "SSS3 Second Term",
    subject: "All Subjects Bundle",
    level: "SSS 3",
    materialsCount: 45,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#40B869]",
    iconBg: "bg-[#40B869]/10 text-[#40B869]",
  },
  {
    slug: "sss3-third-term",
    title: "SSS3 Third Term",
    subject: "All Subjects Bundle",
    level: "SSS 3",
    materialsCount: 40,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#17A546]",
    iconBg: "bg-[#17A546]/10 text-[#17A546]",
  },
  {
    slug: "waec-package",
    title: "WAEC Package",
    subject: "Complete WAEC Prep",
    level: "Exam Prep",
    materialsCount: 120,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#F5B546]",
    iconBg: "bg-[#F5B546]/10 text-[#F5B546]",
  },
  {
    slug: "jamb-package",
    title: "JAMB Package",
    subject: "Complete JAMB Prep",
    level: "Exam Prep",
    materialsCount: 150,
    originalPrice: 5000,
    price: 1500,
    color: "bg-[#DD524D]",
    iconBg: "bg-[#DD524D]/10 text-[#DD524D]",
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
