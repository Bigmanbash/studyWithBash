"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";

export function ConditionalThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname() || "";

  // Skip theme wrapper for admin routes
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return <ThemeProvider>{children}</ThemeProvider>;
}
