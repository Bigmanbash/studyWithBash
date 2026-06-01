import { Sidebar } from "@/components/dashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-(--card)">
      <Sidebar />
      <div className="lg:ml-[260px]">
        {children}
      </div>
    </div>
  );
}
