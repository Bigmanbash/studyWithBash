import { Header } from "@/components/app_components/Header";
import { Footer } from "@/components/app_components/Footer";
import * as Contact from "@/components/contact_us";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <Contact.ContactHero />

        <section className="py-16 sm:py-24 bg-(--card)">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
              <div className="lg:col-span-2 order-2 lg:order-1">
                <h2 className="text-xl font-bold text-(--heading) mb-6">
                  Contact Information
                </h2>
                <Contact.ContactInfo />
              </div>
              <div className="lg:col-span-3 order-1 lg:order-2">
                <Contact.ContactForm />
              </div>
            </div>
          </div>
        </section>

        <Contact.ContactFAQ />
      </main>
      <Footer />
    </div>
  );
}
