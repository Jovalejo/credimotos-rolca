import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--rolca-paper-soft)] text-[var(--rolca-ink)] border border-[var(--rolca-silver)]",
        success: "bg-[#E8F5EE] text-[var(--rolca-success)]",
        warning: "bg-[#FEF3E2] text-[var(--rolca-warning)]",
        danger: "bg-[var(--rolca-red-soft)] text-[var(--rolca-danger)]",
        outline: "border border-[var(--rolca-silver)] text-[var(--rolca-graphite)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }