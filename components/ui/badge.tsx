import * as React from "react"

import { cn } from "@/lib/utils"

const Badge = React.forwardRef<HTMLSpanElement, React.ComponentProps<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border-2 border-border bg-secondary/80 px-3 py-1 text-xs font-semibold text-foreground shadow-neo-xs",
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge }
