"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "./button"

export function BackButton() {
  const router = useRouter()

  const handleClick = () => {
    router.back()
  }

  return (
    <Button
      onClick={handleClick}
      onTouchEnd={(e) => {
        e.preventDefault()
        handleClick()
      }}
      variant="ghost"
      size="lg"
      className="gap-2 mb-6 border-2 border-border hover:bg-primary/10 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      type="button"
    >
      <ChevronLeft className="h-5 w-5" />
      <span>Back</span>
    </Button>
  )
}
