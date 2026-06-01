import { Bell, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl font-bold text-(--heading) ml-12 lg:ml-0">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden sm:flex items-center bg-[rgba(148,163,184,0.08)] rounded-xl px-4 py-2 gap-2 border border-border focus-within:border-[#17A546]/30 transition-colors">
            <Search className="h-4 w-4 text-(--muted)" />
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-transparent text-sm outline-none w-40 placeholder:text-(--muted)"
            />
          </div>

          {/* Notifications */}
          <button className="relative h-10 w-10 rounded-xl bg-[rgba(148,163,184,0.08)] border border-border flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            <Bell className="h-5 w-5 text-(--muted)" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#17A546] rounded-full text-white text-[10px] flex items-center justify-center font-bold">3</span>
          </button>
        </div>
      </div>
    </header>
  );
}
