import { getServerSession } from "@/app/api/auth/queries";
import { redirect } from "next/navigation";
import { listCourses } from "@/app/api/courses/queries";
import { ProxyPurchaseClient } from "./ProxyPurchaseClient";
import { PageHeader } from "@/components/dashboard";

export default async function BuyForStudentsPage() {
  const session = await getServerSession();
  
  if (!session || session.role !== "agent") {
    redirect("/login");
  }

  // Fetch all active courses for proxy purchasing
  const { data: courses } = await listCourses({ limit: 100, status: "active" });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      <PageHeader 
        title="Buy for Students" 
        description="Purchase access codes for your students. Generate codes instantly and distribute them for direct platform access." 
      />

      <ProxyPurchaseClient courses={courses} />
    </div>
  );
}
