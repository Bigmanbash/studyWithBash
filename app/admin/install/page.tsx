import { AdminAuthLayout, AdminInstallForm } from "@/components/admin/auth";
import { getAdminCount } from "@/app/api/adminUser/queries";
import { redirect } from "next/navigation";

export default async function AdminInstallPage() {
  // Security Check: If an admin already exists, lock down this route
  const adminCount = await getAdminCount();
  
  if (adminCount > 0) {
    redirect("/admin/login");
  }

  return (
    <AdminAuthLayout
      title="System Initialization"
      subtitle="Create the first super administrator account to secure the platform."
    >
      <AdminInstallForm />
    </AdminAuthLayout>
  );
}
