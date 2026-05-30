import * as React from "react"

import { cn } from "@/lib/utils"

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn("neo-select", className)} {...props} />
  )
)
Select.displayName = "Select"

export { Select }
