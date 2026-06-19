import { ReactNode } from "react";
import Link from "next/link";
import { FolderOpen, ArrowLeft } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  backHref?: string;
  backLabel?: string;
}

export function EmptyState({ icon, title, description, actionHref, actionLabel, backHref, backLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 bg-white border border-neutral-100 rounded-xl shadow-sm text-center">
      <div className="w-14 h-14 bg-[#17A546]/10 text-[#17A546] rounded-full flex items-center justify-center mb-4">
        {icon || <FolderOpen className="w-7 h-7" strokeWidth={1.5} />}
      </div>

      <h3 className="text-[15px] md:text-[17px] font-semibold text-[#0A1B39] mb-1.5">
        {title}
      </h3>

      <p className="text-[13px] md:text-[14px] text-[#676E85] max-w-[260px] md:max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md border border-neutral-200 text-[#0A1B39] font-medium text-sm hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {backLabel || "Go Back"}
          </Link>
        )}
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 bg-[#17A546] hover:bg-[#128638] text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-sm"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}