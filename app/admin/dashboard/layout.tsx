import { AdminSidebar } from "@/components/admin/dashboard";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminSidebar />
      <div className="lg:ml-[260px]">{children}</div>
    </div>
  );
}
