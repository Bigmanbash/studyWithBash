import { Header } from "@/components/app_components/Header";
import { Footer } from "@/components/app_components/Footer";
import * as HomeComponents from "@/components/home";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <HomeComponents.Pricing />
      </main>
      <Footer />
    </div>
  );
}
