"use client"

import { useRef, useState, useEffect } from "react"
import type { ProjectStatus } from "@/lib/supabase/types"
import { ChevronDown } from "lucide-react"

interface StatusSelectProps {
  value: ProjectStatus
  onChange: (status: ProjectStatus) => void
}

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "scripting", label: "Scripting" },
  { value: "shooting", label: "Shooting" },
  { value: "editing", label: "Editing" },
  { value: "posted", label: "Posted" },
]

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen])

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleNativeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as ProjectStatus)
    setIsOpen(false)
  }

  const handleOptionClick = (status: ProjectStatus) => {
    onChange(status)
    setIsOpen(false)
  }

  const currentLabel = STATUSES.find((s) => s.value === value)?.label || "Select status"

  return (
    <>
      {/* Mobile: Native select */}
      <select
        value={value}
        onChange={handleNativeSelectChange}
        className="md:hidden flex h-10 w-full rounded-lg border-2 border-solid border-border bg-card text-foreground px-3 py-2 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      {/* Desktop: Custom dropdown */}
      <div ref={containerRef} className="relative w-full hidden md:block">
        <button
          type="button"
          onClick={handleTriggerClick}
          className="flex h-10 w-full items-center justify-between rounded-lg border-2 border-solid border-border bg-card text-foreground px-3 py-2 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.2)] transition-shadow"
        >
          <span className="truncate">{currentLabel}</span>
          <ChevronDown
            size={16}
            className={`flex-shrink-0 ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border-2 border-solid border-border rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
            <div className="space-y-1 p-2">
              {STATUSES.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleOptionClick(status.value)
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm font-medium transition-colors ${
                    value === status.value
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
