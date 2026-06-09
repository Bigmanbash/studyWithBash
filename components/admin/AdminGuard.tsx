"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { AuthUser } from "@/app/api/auth";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await authClient.getSession();

        if (error || !data?.user) {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        if ((data.user as unknown as AuthUser).role !== "admin") {
          router.replace("/admin/login");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/admin/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#17A546] mb-4" />
        <p className="text-sm text-[#676E85] font-medium animate-pulse">
          Verifying credentials...
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
