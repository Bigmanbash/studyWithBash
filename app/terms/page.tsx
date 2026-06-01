import { Header } from "@/components/app_components/Header";
import { Footer } from "@/components/app_components/Footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-(--heading) mb-6">
              Terms & Conditions
            </h1>
            <p className="text-(--muted)">
              This page contains the terms and conditions for using Bash
              Academy. Replace this placeholder with your legal copy.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
