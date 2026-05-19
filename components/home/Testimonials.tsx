const testimonials = [
  {
    body: "Bash Academy completely changed how I study for JAMB. The physics modules are so easy to understand, and I finally crossed 250 in my mock exams!",
    author: {
      name: "Chioma E.",
      handle: "SS3 Student",
    },
  },
  {
    body: "I struggled with Chemistry for years. The tiered exercises helped me build my confidence from the ground up.",
    author: {
      name: "Abdul R.",
      handle: "JAMB Candidate",
    },
  },
  {
    body: "The analytics dashboard showed me exactly where I was losing marks in Mathematics. Highly recommended for anyone serious about passing.",
    author: {
      name: "Samuel O.",
      handle: "SS2 Student",
    },
  },
];

import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-24 bg-[#F7FCF9] relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[#17A546] font-bold tracking-wide uppercase text-sm mb-2">Testimonials</h2>
          <p className="text-3xl font-bold tracking-tight text-[#0A1B39] sm:text-4xl lg:text-5xl">
            Trusted by students nationwide
          </p>
          <p className="mt-6 text-base md:text-lg leading-8 text-[#676E85]">
            Don't just take our word for it. Here is what our students have to say about their journey to 300+.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.author.name} 
                className={`flex flex-col justify-between bg-white p-8 md:p-10 shadow-xl shadow-[#0A1B39]/5 rounded-3xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300 ${index === 1 ? 'md:mt-8' : ''} ${index === 2 ? 'lg:mt-16' : ''}`}
              >
                <Quote className="h-10 w-10 text-[#17A546]/20 mb-6" />
                <blockquote className="text-[#0A1B39] text-base md:text-lg leading-relaxed font-medium">
                  "{testimonial.body}"
                </blockquote>
                <div className="mt-8 flex items-center gap-x-4 border-t border-gray-100 pt-6">
                  <div className="h-12 w-12 rounded-full bg-[#17A546]/10 flex items-center justify-center text-[#17A546] font-bold text-lg ring-2 ring-white shadow-sm">
                    {testimonial.author.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-[#0A1B39]">{testimonial.author.name}</div>
                    <div className="text-sm font-medium text-[#676E85]">{testimonial.author.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
