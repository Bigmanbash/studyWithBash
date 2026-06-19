import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
}

export function PageHeader({ title, description, backHref }: PageHeaderProps) {
  return (
    <div className="mb-4 lg:mb-8 relative overflow-hidden rounded-2xl sm:p-7">
      {/* Decorative subtle gradient in the background */}
      {/* <div className="absolute top-0 right-0 w-64 h-64 bg-[#17A546]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0A1B39]/2 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" /> */}
      <div className="">
        {backHref && (
          <Link
            href={backHref}
            className="group h-10 w-10 shrink-0 text-[#3cb665]/80 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-[21px] h-[21px] transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
          </Link>
        )}
      </div>

      <div className="relative mt-4 mb-5 flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <h1 className="text-[18px] md:text-[28px] font-bold text-[#0A1B39] tracking-tight truncate">
            {title}
          </h1>
        </div>
        {description && (
          <p className={`text-[14px] md:text-[15px] text-[#676E85] leading-relaxed max-w-2xl ${backHref ? '' : ''}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}