import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rolca-red)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--rolca-red)] text-white hover:bg-[var(--rolca-red-strong)] shadow-rolca-sm",
        destructive: "bg-[var(--rolca-danger)] text-white hover:bg-[var(--rolca-danger)]/90",
        outline: "border border-[var(--rolca-silver)] bg-white text-[var(--rolca-ink)] hover:bg-[var(--rolca-paper-soft)]",
        secondary: "bg-[var(--rolca-paper-soft)] text-[var(--rolca-ink)] hover:bg-[var(--rolca-silver)]/30",
        ghost: "text-[var(--rolca-graphite)] hover:bg-[var(--rolca-paper-soft)] hover:text-[var(--rolca-ink)]",
        link: "text-[var(--rolca-red)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 rounded-lg",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-12 px-8 text-base rounded-lg",
        icon: "h-10 w-10 rounded-lg",
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