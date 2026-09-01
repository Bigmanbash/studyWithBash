import type { Metadata } from "next";
import "./globals.css";
import { Preloader, StatusModal } from "@/components/modals";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { QueryProvider } from "@/lib/providers/QueryProvider";
export const metadata: Metadata = {
  title: "Bash Academy",
  description: "Bash Academy - Your journey to success",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <Preloader />
          <StatusModal />
          <CookieConsent />
          <main className="min-h-screen w-full overflow-x-hidden">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
