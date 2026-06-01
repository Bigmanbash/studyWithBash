import type { Metadata } from "next";
import "./globals.css";
import { Preloader } from "@/components/modals";
import { ConditionalThemeProvider } from "@/components/theme/ConditionalThemeProvider";

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
        <ConditionalThemeProvider>
          <Preloader />
          <main className="min-h-screen w-full overflow-x-hidden">
            {children}
          </main>
        </ConditionalThemeProvider>
      </body>
    </html>
  );
}
