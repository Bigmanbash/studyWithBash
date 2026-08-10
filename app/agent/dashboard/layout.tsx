import { AgentSidebar } from "@/components/agent";
import { getServerSession } from "@/app/api/auth/queries";
import { redirect } from "next/navigation";

export default async function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // Must be an approved agent to access the agent dashboard
  if (session.role === "pending_agent") {
    redirect("/login"); // The login page will show them the pending message
  }
  
  if (session.role === "admin") {
    redirect("/admin/dashboard");
  }
  
  if (session.role !== "agent") {
    redirect("/dashboard"); // Normal students go back to student dashboard
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AgentSidebar />
      <div className="lg:ml-64 pt-16 lg:pt-0">{children}</div>
    </div>
  );
}
