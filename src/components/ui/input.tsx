import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[var(--rolca-silver)] bg-white px-3 py-2 text-sm text-[var(--rolca-ink)] placeholder:text-[var(--rolca-silver)] transition-all duration-[180ms] file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-[var(--rolca-red)] focus:ring-2 focus:ring-[var(--rolca-red-soft)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }