import { ReactNode } from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({ icon, title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-neutral-100 rounded-xl shadow-sm text-center">
      <div className="w-16 h-16 bg-[#17A546]/10 text-[#17A546] rounded-full flex items-center justify-center mb-5">
        {icon || <FolderOpen className="w-8 h-8" strokeWidth={1.5} />}
      </div>
      <h3 className="text-[17px] font-bold text-[#0A1B39] mb-2">{title}</h3>
      <p className="text-[14px] text-[#676E85] mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="bg-[#17A546] hover:bg-[#128638] text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-sm"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
