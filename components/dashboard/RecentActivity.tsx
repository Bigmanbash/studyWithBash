import { BookOpen, CheckCircle2, AlertCircle, Clock } from "lucide-react";

const activities = [
  {
    title: "Completed: Newton's Laws of Motion",
    subject: "Physics",
    time: "2 hours ago",
    icon: CheckCircle2,
    iconColor: "text-[#17A546]",
    iconBg: "bg-[#17A546]/10",
  },
  {
    title: "Quiz: Organic Chemistry - 85%",
    subject: "Chemistry",
    time: "5 hours ago",
    icon: AlertCircle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    title: "Started: Quadratic Equations",
    subject: "Mathematics",
    time: "Yesterday",
    icon: BookOpen,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    title: "Mock Exam: Physics - 72%",
    subject: "Physics",
    time: "2 days ago",
    icon: Clock,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-(--card) rounded-2xl border border-border shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-(--heading)">Recent Activity</h3>
        <button className="text-xs font-medium text-[#17A546] hover:underline">View all</button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="flex items-start gap-3 sm:gap-4 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.08)] transition-colors group"
          >
            <div className={`${activity.iconBg} rounded-xl p-2.5 flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-(--heading) truncate">{activity.title}</p>
              <p className="text-xs text-(--muted) mt-0.5">{activity.subject}</p>
            </div>
            <span className="text-xs text-(--muted) flex-shrink-0">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
