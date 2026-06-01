import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-[#62B881] to-[#095F29] text-white shadow-sm hover:brightness-95",
                secondary: "bg-[#DBF1E3] text-[#0F9F44] hover:bg-[#DBF1E3]/80",
                outline: "border border-[#17A546] bg-(--card) text-[#17A546] hover:bg-[rgba(255,255,255,0.1)]",
                ghost: "text-[#17A546] hover:bg-[rgba(255,255,255,0.1)]",
            },
            size: {
                default: "h-12 px-[24px] py-2", // Primary Button Height
                sm: "h-10 px-4",
                lg: "h-14 px-8 text-base",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
