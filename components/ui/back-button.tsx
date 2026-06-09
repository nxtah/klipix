"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onPointerDown={() => router.back()}
      className="flex items-center gap-2 h-11 px-3 mb-6 rounded-lg border-2 border-border bg-card text-foreground hover:bg-primary/10 active:bg-primary/20 transition-colors cursor-pointer font-medium text-sm pointer-events-auto relative z-20"
      type="button"
    >
      <ChevronLeft className="h-5 w-5" />
      <span className="hidden sm:inline">Back</span>
    </button>
  )
}
