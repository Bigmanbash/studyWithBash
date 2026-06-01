import { Button } from "@/components/ui/button";
import { Flame, Zap } from "lucide-react";

export function UpcomingTasks() {
  const tasks = [
    { title: "Newton's Laws of Motion", subject: "Physics", type: "Continue Learning", urgent: true },
    { title: "Organic Chemistry Quiz", subject: "Chemistry", type: "Quiz Due Today", urgent: true },
    { title: "Quadratic Equations Practice", subject: "Mathematics", type: "15 questions left", urgent: false },
  ];

  return (
    <div className="bg-(--card) rounded-2xl border border-border shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-(--heading)">Up Next</h3>
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500">
          <Flame className="h-3.5 w-3.5" />
          3 day streak
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-[#17A546]/20 hover:shadow-sm transition-all"
          >
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${task.urgent ? "bg-amber-500/10" : "bg-(--card)"}`}>
              <Zap className={`h-4 w-4 ${task.urgent ? "text-amber-500" : "text-(--muted)"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-(--heading) truncate">{task.title}</p>
              <p className="text-xs text-(--muted)">{task.subject} · {task.type}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-[#17A546] text-xs px-3 flex-shrink-0">
              Go
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
