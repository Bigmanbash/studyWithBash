import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function AboutCTA() {
  return (
    <section className="bg-(--card) py-12 md:py-24">
      <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#17A546] to-[#0E7B33] px-6 py-16 sm:px-10 sm:py-20 md:px-16 shadow-2xl rounded-2xl sm:rounded-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto">
            Ready to transform your academic journey?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/80  mx-auto">
            Join thousands of students who have already changed their story with Bash Academy.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-(--card) text-[#17A546] hover:bg-[rgba(255,255,255,0.1)] font-bold px-8 shadow-xl shadow-black/10">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Glow */}
          <div className="absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-[80px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
