import { AdminSidebar } from "@/components/admin/dashboard";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { getServerSession } from "@/app/api/auth/queries";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  // A non-admin user must never reach admin pages — send them to student dashboard
  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F7F9FC]">
        <AdminSidebar />
        <div className="lg:ml-[260px]">{children}</div>
      </div>
    </AdminGuard>
  );
}
