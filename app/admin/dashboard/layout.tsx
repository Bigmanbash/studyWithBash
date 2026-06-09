import { AdminSidebar } from "@/components/admin/dashboard";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F7F9FC]">
        <AdminSidebar />
        <div className="lg:ml-[260px]">{children}</div>
      </div>
    </AdminGuard>
  );
}
