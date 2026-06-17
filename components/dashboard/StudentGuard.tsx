"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export function StudentGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/login");
      } else {
        const role = (session.user as { role?: string }).role;
        // Non-students (like admins) shouldn't be here, route them out or let them view? 
        // We'll redirect admins to admin dashboard
        if (role === "admin") {
          router.replace("/admin/dashboard");
        }
      }
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  // Prevent rendering children if not authenticated or not student
  if (!session?.user || (session.user as { role?: string }).role === "admin") {
    return null;
  }

  return <>{children}</>;
}
