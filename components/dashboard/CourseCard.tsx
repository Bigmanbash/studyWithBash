import Link from "next/link";
import Image from "next/image";
import { FileText, ShoppingCart, Sparkles } from "lucide-react";
import { formatCourseMeta } from "@/lib/utils";
import { getAvailableTiers, TIERS } from "@/lib/tiers";

interface CourseCardProps {
  id: string;
  title: string;
  image: string;
  price?: number;
  standardPrice?: number | null;
  premiumPrice?: number | null;
  originalPrice?: number | null;
  isPurchased?: boolean;
  view?: "grid" | "list";
  level?: string | null;
  term?: string | null;
  category?: string | null;
  subject?: string | null;
}

export function CourseCard({
  id,
  title,
  image,
  price,
  standardPrice,
  premiumPrice,
  originalPrice,
  isPurchased = false,
  view = "grid",
  level,
  term,
  category,
  subject,
}: CourseCardProps) {
  const metaText = formatCourseMeta({ level, term, category, subject });
  const badgeStyle = "bg-[#17A546]/10 text-[#17A546] border border-[#17A546]/20 font-semibold";

  const availableTiers = price !== undefined ? getAvailableTiers({ price, standardPrice, premiumPrice }) : [];
  const hasMultipleTiers = availableTiers.length > 1;

  const formatNaira = (amount: number) => {
    const naira = amount > 100000 ? amount / 100 : amount;
    return naira.toLocaleString();
  };

  if (view === "list") {
    return (
      <div className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-0">
        <div className="relative w-11 h-11 rounded-md overflow-hidden shrink-0 bg-neutral-100">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-medium text-[#0A1B39] truncate">{title}</p>
            {metaText && (
              <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md ${badgeStyle}`}>
                {metaText}
              </span>
            )}
          </div>
          {!isPurchased && price !== undefined && (
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-baseline gap-1">
                {hasMultipleTiers && <span className="text-[10px] text-[#676E85]">From</span>}
                <span className="text-[12px] font-bold text-[#0A1B39]">₦{formatNaira(price)}</span>
                {originalPrice && (
                  <span className="text-[11px] text-[#98A2B3] line-through">₦{formatNaira(originalPrice)}</span>
                )}
              </div>
              {hasMultipleTiers && (
                <span className="text-[9px] font-bold text-[#3B82F6] bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded-md">
                  {availableTiers.length} Tiers
                </span>
              )}
            </div>
          )}
        </div>
        <Link
          href={isPurchased ? `/dashboard/read/${id}` : `/dashboard/course/${id}`}
          className={`shrink-0 flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-md transition-colors ${
            isPurchased 
              ? "text-[#0A1B39] bg-white border border-neutral-200 hover:bg-neutral-50 shadow-sm"
              : "text-white bg-[#17A546] hover:bg-[#128638] shadow-sm"
          }`}
        >
          {isPurchased ? <FileText className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          {isPurchased ? "Open" : "Buy now"}
        </Link>
      </div>
    );
  }

  // grid view
  return (
    <div className="bg-white border border-[#17A546]/30 rounded-xl overflow-hidden flex flex-col shadow-sm hover:border-[#17A546]/60 hover:shadow-md transition-all">
      <div className="relative h-32 sm:h-40 w-full bg-neutral-100">
        <Image src={image} alt={title} fill className="object-cover" />
        {metaText && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-medium bg-[#0A1B39]/80 backdrop-blur-sm text-white rounded-md shadow-sm">
            {metaText}
          </span>
        )}
        {hasMultipleTiers && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[9px] font-bold bg-[#17A546] text-white rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            {availableTiers.length} Tiers
          </span>
        )}
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-1 flex-wrap">
          {metaText && (
            <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md ${badgeStyle}`}>
              {metaText}
            </span>
          )}
        </div>
        <h4 className="text-[13px] sm:text-sm font-semibold text-[#0A1B39] line-clamp-2 flex-1">{title}</h4>
        
        {!isPurchased && price !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              {hasMultipleTiers && <span className="text-[10px] text-[#676E85]">From</span>}
              <span className="text-[13px] font-bold text-[#0A1B39]">₦{formatNaira(price)}</span>
              {originalPrice && (
                <span className="text-[11px] text-[#98A2B3] line-through">₦{formatNaira(originalPrice)}</span>
              )}
            </div>
            {hasMultipleTiers && (
              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded-full">
                Basic • Standard • Premium
              </span>
            )}
          </div>
        )}
        <Link
          href={isPurchased ? `/dashboard/read/${id}` : `/dashboard/course/${id}`}
          className={`flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-md text-[12px] sm:text-[13px] font-medium transition-colors mt-auto ${
            isPurchased
              ? "bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white"
              : "bg-[#17A546] hover:bg-[#128638] text-white"
          }`}
        >
          {isPurchased ? <FileText className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          {isPurchased ? "Open Material" : "Select Tier & Buy"}
        </Link>
      </div>
    </div>
  );
}