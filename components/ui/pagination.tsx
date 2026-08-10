import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages < 1) return null;

  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }
    
    return pages;
  };

  const buttonBaseClass = "flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-md text-xs sm:text-sm font-semibold transition-all border shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#17A546]/50 shrink-0";
  const buttonInactiveClass = "bg-white border-neutral-200/80 text-[#676E85] hover:text-[#0A1B39] hover:bg-neutral-50 hover:border-neutral-300";
  const buttonActiveClass = "bg-[#17A546] border-[#17A546] text-white hover:bg-[#17A546]/90";
  const buttonDisabledClass = "bg-neutral-50 border-neutral-200/50 text-neutral-400 cursor-not-allowed shadow-none";

  return (
    <nav className={cn("flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto py-1", className)}>
      <button
        type="button"
        className={cn(buttonBaseClass, currentPage === 1 ? buttonDisabledClass : buttonInactiveClass)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {getVisiblePages().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center text-[#98A2B3] shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          return (
            <button
              key={page}
              type="button"
              className={cn(
                buttonBaseClass,
                currentPage === page ? buttonActiveClass : buttonInactiveClass
              )}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={cn(buttonBaseClass, currentPage === totalPages ? buttonDisabledClass : buttonInactiveClass)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
      </button>
    </nav>
  );
};
