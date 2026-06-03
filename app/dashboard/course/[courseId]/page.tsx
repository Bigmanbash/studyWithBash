import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, FileText, Lock, ShoppingCart, Eye } from "lucide-react";
import { AvailableCourses } from "@/components/dashboard";

export default async function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = await params;
  // Mock data - In a real app, fetch based on resolvedParams.courseId
  const course = {
    title: "Mathematics - SSS1 First Term",
    description: "A comprehensive guide to SSS1 Mathematics. Covers Algebraic processes, logical reasoning, and basic geometry tailored to the West African examination syllabus.",
    image: "/collection-accessories.png",
    price: 2500,
    originalPrice: 3500,
    features: [
      "Full term curriculum coverage",
      "Printable high-quality PDF format",
      "Worked examples and exercises",
      "Past question references"
    ],
    // MOCK STATE
    isPurchased: false
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center max-w-7xl mx-auto">
          <Link 
            href="/dashboard" 
            className="flex items-center text-sm font-medium text-[#676E85] hover:text-[#0A1B39] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto space-y-12">
        <div className="bg-white rounded-md border border-neutral-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Col: Image & Preview */}
          <div className="w-full lg:w-1/2 bg-neutral-50 p-6 sm:p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-neutral-100">
            <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-md shadow-sm overflow-hidden mb-6 border border-neutral-200">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
              {!course.isPurchased && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                  <Lock className="w-12 h-12 mb-4 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">Full Document Locked</h3>
                  <p className="text-sm opacity-90 mb-6">Purchase this material to unlock full access to the PDF document.</p>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white px-6 py-3 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                    <Eye className="w-4 h-4" />
                    Preview First 3 Pages
                  </button>
                </div>
              )}
            </div>
            
            {course.isPurchased && (
              <p className="text-sm text-[#676E85] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#17A546]" />
                You own this material
              </p>
            )}
          </div>

          {/* Right Col: Details & Checkout */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col">
            <div className="flex-1">
              <div className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 mb-6">
                PDF Material
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0A1B39] mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-[#676E85] mb-8 leading-relaxed">
                {course.description}
              </p>

              <div className="space-y-4 mb-10">
                <h3 className="font-semibold text-[#0A1B39]">What's included:</h3>
                <ul className="space-y-3">
                  {course.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-[#676E85]">
                      <CheckCircle className="w-5 h-5 text-[#17A546] mr-3 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-100 mt-auto">
              {!course.isPurchased ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-sm text-[#676E85] mb-1">One-time payment</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-extrabold text-[#0A1B39]">₦{course.price.toLocaleString()}</span>
                      {course.originalPrice && (
                        <span className="text-xl text-[#98A2B3] line-through font-medium">
                          ₦{course.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="bg-neutral-100 hover:bg-neutral-200 text-[#0A1B39] px-6 py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors sm:w-auto w-full">
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button className="bg-[#17A546] hover:bg-[#128638] text-white px-6 py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm sm:w-auto w-full">
                      <ShoppingCart className="w-4 h-4" />
                      Pay Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#676E85] mb-1">Status</p>
                    <p className="font-bold text-[#17A546] flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Purchased
                    </p>
                  </div>
                  
                  <Link 
                    href={`/dashboard/read/${resolvedParams.courseId}`}
                    className="bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white px-6 py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors sm:w-auto w-full"
                  >
                    <FileText className="w-4 h-4" />
                    Open Material
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
        
        {/* Other Courses Section */}
        <div className="pt-8 border-t border-neutral-100">
          <AvailableCourses title="Other Recommended Courses" />
        </div>
      </main>
    </div>
  );
}
