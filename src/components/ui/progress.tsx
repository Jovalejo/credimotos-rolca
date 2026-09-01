import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const progressValue = Math.min(100, Math.max(0, value || 0))
    
    let indicatorColor = "bg-red-600" // < 30%
    if (progressValue >= 60) {
      indicatorColor = "bg-[#16A34A]" // success
    } else if (progressValue >= 30) {
      indicatorColor = "bg-[#F59E0B]" // warning
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-gray-100",
          className
        )}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 transition-all", indicatorColor)}
          style={{ transform: `translateX(-${100 - progressValue}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }