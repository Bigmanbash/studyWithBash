import { Sidebar } from "@/components/dashboard";
import { getServerSession } from "@/app/api/auth/queries";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "admin") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar />
      <div className="lg:ml-64">
        {children}
      </div>
    </div>
  );
}
