import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

interface Topic {
  title: string;
  duration: string;
  status: "completed" | "current" | "locked";
  exercises?: number;
}

interface TermData {
  term: string;
  topics: Topic[];
}

const termsData: TermData[] = [
  {
    term: "1st Term",
    topics: [
      { title: "Introduction to Measurement", duration: "45 min", status: "completed", exercises: 12 },
      { title: "Units and Dimensions", duration: "35 min", status: "completed", exercises: 10 },
      { title: "Scalars and Vectors", duration: "50 min", status: "completed", exercises: 15 },
      { title: "Motion in a Straight Line", duration: "60 min", status: "current", exercises: 18 },
      { title: "Newton's Laws of Motion", duration: "55 min", status: "locked", exercises: 20 },
    ],
  },
  {
    term: "2nd Term",
    topics: [
      { title: "Work, Energy and Power", duration: "50 min", status: "locked", exercises: 16 },
      { title: "Simple Machines", duration: "40 min", status: "locked", exercises: 12 },
      { title: "Pressure", duration: "45 min", status: "locked", exercises: 14 },
      { title: "Elasticity", duration: "35 min", status: "locked", exercises: 10 },
    ],
  },
  {
    term: "3rd Term",
    topics: [
      { title: "Heat and Temperature", duration: "50 min", status: "locked", exercises: 15 },
      { title: "Change of State", duration: "40 min", status: "locked", exercises: 12 },
      { title: "Gas Laws", duration: "55 min", status: "locked", exercises: 18 },
      { title: "Waves and Sound", duration: "60 min", status: "locked", exercises: 20 },
      { title: "Light and Optics", duration: "55 min", status: "locked", exercises: 16 },
    ],
  },
];

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

interface TopicListProps {
  courseSlug?: string;
}

export function TopicList({ courseSlug = "ss1-physics" }: TopicListProps) {
  return (
    <div className="space-y-10">
      {termsData.map((term) => (
        <div key={term.term}>
          {/* Term header */}
          <div className="flex items-center gap-4 mb-5">
            <h3 className="text-lg font-bold text-[#0A1B39] bg-white px-4 py-1.5 rounded-xl border border-neutral-200/60 shadow-sm">{term.term}</h3>
            <div className="flex-1 h-px bg-neutral-200/60" />
            <span className="text-[13px] text-[#676E85] font-medium bg-white px-3 py-1 rounded-lg border border-neutral-200/60">{term.topics.length} topics</span>
          </div>

          {/* Topics */}
          <div className="space-y-3">
            {term.topics.map((topic, i) => {
              const isLocked = topic.status === "locked";
              const content = (
                <div
                  className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-[20px] text-left transition-all duration-300 group ${
                    topic.status === "current"
                      ? "bg-white border-2 border-[#17A546]/30 shadow-[0_4px_20px_-4px_rgba(23,165,70,0.15)] transform hover:-translate-y-0.5"
                      : topic.status === "completed"
                      ? "bg-white border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#17A546]/30 hover:-translate-y-0.5"
                      : "bg-neutral-50/50 border border-neutral-200/40 opacity-75 cursor-not-allowed"
                  }`}
                >
                  {/* Status icon */}
                  <div className="flex-shrink-0">
                    {topic.status === "completed" ? (
                      <div className="h-10 w-10 rounded-full bg-[#17A546]/10 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-[#17A546]" />
                      </div>
                    ) : topic.status === "current" ? (
                      <div className="h-10 w-10 rounded-full bg-[#17A546] flex items-center justify-center shadow-lg shadow-[#17A546]/30">
                        <PlayCircle className="h-5 w-5 text-white ml-0.5" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-neutral-200/50 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-[#98A2B3]" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pl-1">
                    <p className={`text-[15px] font-bold truncate ${
                      isLocked ? "text-[#676E85]" : "text-[#0A1B39]"
                    } group-hover:${!isLocked ? "text-[#17A546]" : ""} transition-colors duration-200`}>
                      {topic.title}
                    </p>
                    <p className="text-[13px] text-[#676E85] mt-1 font-medium">
                      {topic.duration} <span className="mx-1.5 text-neutral-300">•</span> {topic.exercises} exercises
                    </p>
                  </div>

                  {/* Difficulty pills */}
                  {!isLocked && (
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">Easy</span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">Med</span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider">Hard</span>
                    </div>
                  )}
                </div>
              );

              return isLocked ? (
                <div key={topic.title} className="w-full">
                  {content}
                </div>
              ) : (
                <Link key={topic.title} href={`/courses/${courseSlug}/${slugify(topic.title)}`} className="w-full block">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
