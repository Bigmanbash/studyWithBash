import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[#485066] uppercase tracking-wide">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border border-dashed border-[#D1D5DB] bg-white px-3 py-2 text-base text-[#070D17] transition-colors",
            "placeholder:text-[#98A2B3] placeholder:italic",
            "focus-visible:outline-none focus-visible:border-solid focus-visible:border-[#3B82F6] focus-visible:ring-1 focus-visible:ring-[#3B82F6]",
            "disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#98A2B3]",
            error && "border-solid border-[#EF4444] focus-visible:border-[#EF4444] focus-visible:ring-[#EF4444]",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              "text-xs mt-1",
              error ? "text-[#EF4444]" : "text-[#676E85]"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
