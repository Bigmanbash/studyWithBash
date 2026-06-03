import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export default async function ReadCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = await params;
  // In a real app, fetch course data based on resolvedParams.courseId
  const courseTitle = "Mathematics - SSS1 First Term";

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {/* Reader Header */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between max-w-5xl mx-auto w-full">
          <Link 
            href="/dashboard/purchased" 
            className="flex items-center text-sm font-medium text-[#676E85] hover:text-[#0A1B39] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
          
          <h1 className="text-base font-semibold text-[#0A1B39] truncate max-w-[50%]">
            {courseTitle}
          </h1>

          <div className="w-24"></div> {/* Spacer to center the title */}
        </div>
      </header>

      {/* PDF Viewer Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <div className="bg-white flex-1 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-center min-h-[600px] overflow-hidden relative">
          
          {/* Placeholder for actual PDF Viewer component */}
          <div className="text-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h2 className="text-xl font-bold text-[#0A1B39]">PDF Viewer Container</h2>
            <p className="text-neutral-500 mt-2 max-w-sm mx-auto">
              This area will house the React PDF viewer component to render the actual course document.
            </p>
          </div>
          
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#676E85] hover:bg-white hover:text-[#0A1B39] hover:shadow-sm transition-all">
            <ChevronLeft className="w-4 h-4" />
            Previous Lesson
          </button>
          
          <span className="text-sm font-medium text-neutral-400">
            Lesson 1 of 12
          </span>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#17A546] hover:bg-[#128638] transition-all shadow-sm">
            Next Lesson
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
