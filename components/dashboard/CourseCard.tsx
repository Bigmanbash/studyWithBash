import Link from "next/link";
import Image from "next/image";
import { FileText, ShoppingCart } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  image: string;
  price?: number;
  originalPrice?: number;
  isPurchased?: boolean;
  view?: "grid" | "list";
}

export function CourseCard({ id, title, image, price, originalPrice, isPurchased = false, view = "grid" }: CourseCardProps) {
  if (view === "list") {
    return (
      <div className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-0">
        <div className="relative w-11 h-11 rounded-md overflow-hidden shrink-0 bg-neutral-100">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[#0A1B39] truncate">{title}</p>
          {!isPurchased && price !== undefined && (
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[12px] font-medium text-[#0A1B39]">₦{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-[11px] text-[#98A2B3] line-through">₦{originalPrice.toLocaleString()}</span>
              )}
            </div>
          )}
        </div>
        <Link
          href={isPurchased ? `/dashboard/read/${id}` : `/dashboard/course/${id}`}
          className={`shrink-0 flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-md transition-colors ${
            isPurchased 
              ? "text-[#0A1B39] bg-neutral-100 border border-neutral-200 hover:bg-neutral-200"
              : "text-[#17A546] bg-[#17A546]/10 border border-[#17A546]/25 hover:bg-[#17A546]/20"
          }`}
        >
          {isPurchased ? <FileText className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          {isPurchased ? "Open" : "Buy now"}
        </Link>
      </div>
    );
  }

  // grid view — original card style
  return (
    <div className="bg-white border border-[#17A546]/30 rounded-xl overflow-hidden flex flex-col shadow-sm hover:border-[#17A546]/60 hover:shadow-md transition-all">
      <div className="relative h-32 sm:h-40 w-full bg-neutral-100">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-3">
        <h4 className="text-[13px] sm:text-sm font-semibold text-[#0A1B39] line-clamp-2 flex-1">{title}</h4>
        {!isPurchased && price !== undefined && (
          <div className="flex items-baseline gap-1.5">
            <span className="text-[13px] font-bold text-[#0A1B39]">₦{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-[11px] text-[#98A2B3] line-through">₦{originalPrice.toLocaleString()}</span>
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
          {isPurchased ? "Open Material" : "Buy Now"}
        </Link>
      </div>
    </div>
  );
}