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
}

export function CourseCard({ id, title, image, price, originalPrice, isPurchased = false }: CourseCardProps) {
  return (
    <div className="bg-white border border-neutral-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      <div className="relative h-32 sm:h-40 w-full bg-neutral-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-3 sm:p-5 flex-1 flex flex-col">
        <h4 className="font-semibold text-sm sm:text-base text-[#0A1B39] line-clamp-2 mb-2 sm:mb-4">{title}</h4>

        <div className="mt-auto flex flex-col gap-3">
          {!isPurchased && price !== undefined && (
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[#0A1B39] text-sm sm:text-base">₦{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-xs text-[#98A2B3] line-through">₦{originalPrice.toLocaleString()}</span>
              )}
            </div>
          )}

          <Link
            href={isPurchased ? `/dashboard/read/${id}` : `/dashboard/course/${id}`}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors w-full ${isPurchased
                ? "bg-neutral-50 hover:bg-[#17A546]/10 text-[#0A1B39] hover:text-[#17A546]"
                : "bg-[#17A546] hover:bg-[#128638] text-white"
              }`}
          >
            {isPurchased ? (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Open
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
