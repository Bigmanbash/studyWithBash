import { Header } from "@/components/app_components/Header";
import { Footer } from "@/components/app_components/Footer";
import * as About from "@/components/about";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <About.AboutHero />
        <About.AboutProblem />
        <About.AboutValues />
        <About.AboutTeam />
        <About.AboutCTA />
      </main>
      <Footer />
    </div>
  );
}
