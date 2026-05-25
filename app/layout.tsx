import type { Metadata } from "next";
import "./globals.css";
import { Preloader } from "@/components/modals";

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
        <Preloader />
        <main className="min-h-screen w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
