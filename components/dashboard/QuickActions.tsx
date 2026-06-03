import Link from "next/link";
import { Search, Compass, GraduationCap, Library } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Browse Classes",
      description: "Find materials for your class level.",
      icon: Library,
      href: "/dashboard",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Exam Prep",
      description: "Get ready for WAEC, JAMB & more.",
      icon: GraduationCap,
      href: "/dashboard/exam/waec",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Discover Topics",
      description: "Search specific subjects easily.",
      icon: Compass,
      href: "/dashboard",
      color: "text-[#17A546]",
      bg: "bg-[#17A546]/10",
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#0A1B39]">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="flex items-start gap-4 p-5 rounded-md border border-neutral-100 bg-white hover:border-[#17A546]/30 hover:shadow-sm transition-all group"
          >
            <div className={`p-3 rounded-md ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0A1B39]">{action.title}</h4>
              <p className="text-sm text-[#676E85] mt-1">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
