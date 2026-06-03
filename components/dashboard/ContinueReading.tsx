import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function ContinueReading() {
  return (
    <div className="bg-[#070D17] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#17A546]/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm font-medium text-[#17A546] mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Last Opened</span>
        </div>
        
        <h3 className="text-3xl sm:text-4xl font-bold mb-2">Mathematics</h3>
        <p className="text-neutral-400 text-lg mb-8 max-w-md">SSS1 First Term</p>
        
        <Link 
          href="/dashboard/read/mathematics-sss1" 
          className="inline-flex items-center gap-2 bg-[#17A546] hover:bg-[#128638] text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
        >
          Continue Reading
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
