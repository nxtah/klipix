"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type MessageTone = "error" | "success"

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: MessageTone
}

function FormMessage({ tone = "error", className, ...props }: FormMessageProps) {
  return (
    <p
      className={cn(
        "text-sm font-semibold",
        tone === "error" ? "text-destructive" : "text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { FormMessage }
