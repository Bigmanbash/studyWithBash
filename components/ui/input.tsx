import * as React from "react"
import { Eye, EyeOff, ScanBarcode } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: boolean
  iconType?: "scan" | "password" | "phone" | "money" | "none"
  flagEmoji?: string
  currencyPrefix?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      error,
      iconType = "none",
      flagEmoji,
      currencyPrefix,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const isPassword = type === "password"
    const currentType = isPassword ? (showPassword ? "text" : "password") : type

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-(--muted) uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconType === "phone" && flagEmoji && (
            <span className="absolute left-3 text-base flex items-center justify-center">
              {flagEmoji}
            </span>
          )}
          {iconType === "money" && currencyPrefix && (
            <span className="absolute left-3 text-base text-(--muted) flex items-center justify-center font-medium">
              {currencyPrefix}
            </span>
          )}

          <input
            type={currentType}
            className={cn(
              "flex h-[44px] w-full rounded-lg border border-input bg-(--card) px-3 py-2 text-base text-foreground transition-colors",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-(--muted) placeholder:italic",
              "focus-visible:outline-none focus-visible:border-[#3B82F6] focus-visible:ring-1 focus-visible:ring-[#3B82F6]",
              "disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-(--muted)",
              error && "border-[#EF4444] placeholder:text-[#EF4444] text-[#EF4444] focus-visible:border-[#EF4444] focus-visible:ring-[#EF4444]",
              iconType === "phone" && flagEmoji ? "pl-10" : "",
              iconType === "money" && currencyPrefix ? "pl-8" : "",
              (iconType === "scan" || iconType === "password" || iconType === "phone" || iconType === "money") ? "pr-10" : "",
              className
            )}
            disabled={disabled}
            ref={ref}
            {...props}
          />

          {iconType !== "none" && (
            <div className="absolute right-3 flex items-center justify-center">
              {iconType === "password" ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-(--muted) hover:text-(--muted) focus:outline-none"
                  disabled={disabled}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              ) : (
                <ScanBarcode 
                  size={16} 
                  className={cn(
                    "text-(--muted)", 
                    error && "text-[#EF4444]"
                  )} 
                />
              )}
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={cn(
              "text-xs mt-1",
              error ? "text-[#EF4444]" : "text-(--muted)"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
