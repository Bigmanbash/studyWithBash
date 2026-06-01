import { Header } from "@/components/app_components/Header";
import { Footer } from "@/components/app_components/Footer";
import { CourseHeader, TopicList, CourseSidebar } from "@/components/courses";

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <CourseHeader
          title="Physics (SS1)"
          subject="Measurement, Mechanics & Motion"
          level="SS1"
          topics={14}
          duration="12 weeks"
          students="2.4k"
          color="bg-blue-500"
        />

        <section className="py-10 sm:py-14 bg-(--card)">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 lg:items-start">
              {/* Main content — topics */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-(--heading)">Course Content</h2>
                  <p className="text-sm text-(--muted) mt-2">Master the syllabus step-by-step with interactive modules.</p>
                </div>
                <TopicList courseSlug={params.slug} />
              </div>

              {/* Sidebar */}
              <div className="order-first lg:order-last sticky top-24">
                <CourseSidebar />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
