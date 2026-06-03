import { Sidebar } from "@/components/dashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar />
      <div className="lg:ml-[280px]">
        {children}
      </div>
    </div>
  );
}
