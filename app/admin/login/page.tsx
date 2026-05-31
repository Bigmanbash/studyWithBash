import { AdminAuthLayout, AdminLoginForm } from "@/components/admin/auth";

export default function AdminLogin() {
  return (
    <AdminAuthLayout
      title="Admin Sign In"
      subtitle="Access the Bash Academy administration portal"
    >
      <AdminLoginForm />
    </AdminAuthLayout>
  );
}
