import { Header } from "@/components/app_components/Header";
import { Footer } from "@/components/app_components/Footer";
import * as HomeComponents from "@/components/home";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <HomeComponents.Hero />
        <HomeComponents.Courses />
        <HomeComponents.AgentAffiliateSection />
        <HomeComponents.CTASection />
      </main>
      <Footer />
    </div>
  );
}
