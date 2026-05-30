import * as React from "react"

import { cn } from "@/lib/utils"

type DoodleVariant = "sparkle" | "star" | "arrow" | "squiggle"

interface DoodleProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: DoodleVariant
}

const doodles: Record<DoodleVariant, React.ReactNode> = {
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.2l5.9-.9L12 3z"
      />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 15c4-6 10-6 15-2M15 5l4 6-7 1"
      />
    </svg>
  ),
  squiggle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8c3-4 6 4 9 0s6 4 9 0"
      />
    </svg>
  ),
}

function Doodle({ variant = "sparkle", className, ...props }: DoodleProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex size-5 items-center justify-center", className)}
      {...props}
    >
      {doodles[variant]}
    </span>
  )
}

export { Doodle }
