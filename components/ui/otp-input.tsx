"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export interface OTPInputProps {
  length?: 4 | 6
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  className?: string
  mixedErrorState?: boolean // For the mixed active+error state
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  className,
  mixedErrorState = false,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value
    if (!/^[0-9]*$/.test(val)) return

    const newValue = value.split('')
    // If typing a single character
    if (val.length <= 1) {
      newValue[index] = val
      onChange(newValue.join(''))
      
      // Move to next input
      if (val !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    } else {
      // Handle paste
      const pasted = val.slice(0, length).split('')
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < length) {
          newValue[index + i] = pasted[i]
        }
      }
      onChange(newValue.join(''))
      const focusIndex = Math.min(index + pasted.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div 
      className={cn(
        "flex gap-2", 
        mixedErrorState && "border border-dashed border-[#3B82F6] p-2 rounded-xl inline-flex",
        className
      )}
    >
      {Array.from({ length }).map((_, index) => {
        const isFirstOrLast = index === 0 || index === length - 1;
        const isMixedError = mixedErrorState && isFirstOrLast;
        
        return (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={length} // allow pasting full length
            value={value[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={disabled}
            className={cn(
              "w-[48px] h-[56px] text-center text-lg font-semibold rounded-lg border bg-(--card) text-foreground transition-colors focus:outline-none",
              // Default border
              "border-input",
              // Focus state
              "focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]",
              // Disabled state
              "disabled:bg-[#F3F4F6] disabled:text-(--muted) disabled:cursor-not-allowed",
              // Error state
              error && "border-[#EF4444] text-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]",
              // Mixed active + error state
              isMixedError && "border-[#3B82F6] focus:border-[#3B82F6]"
            )}
          />
        )
      })}
    </div>
  )
}
