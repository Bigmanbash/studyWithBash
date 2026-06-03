import Link from "next/link";
import { CourseCard } from "./CourseCard";

const availableCourses = [
  {
    id: "mathematics-sss1",
    title: "Mathematics - SSS1 First Term",
    image: "/collection-accessories.png",
    price: 2500,
    originalPrice: 3500,
  },
  {
    id: "english-sss1",
    title: "English Language - SSS1 First Term",
    image: "/collection-suits.png",
    price: 2500,
  },
  {
    id: "biology-sss1",
    title: "Biology - SSS1 First Term",
    image: "/collection-casual.png",
    price: 2500,
    originalPrice: 3500,
  },
  {
    id: "chemistry-sss1",
    title: "Chemistry - SSS1 First Term",
    image: "/img/hero_section.png",
    price: 2500,
  },
];

export function AvailableCourses({ title = "Available Courses" }: { title?: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#0A1B39]">{title}</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {availableCourses.map((course) => (
          <CourseCard
            key={course.id}
            {...course}
            isPurchased={false}
          />
        ))}
      </div>
    </div>
  );
}
