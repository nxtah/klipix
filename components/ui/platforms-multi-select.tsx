"use client"

import { useRef, useState, useEffect } from "react"
import type { PlatformType } from "@/lib/supabase/types"
import { ChevronDown } from "lucide-react"

interface PlatformsMultiSelectProps {
  value: PlatformType[]
  onChange: (platforms: PlatformType[]) => void
}

const PLATFORMS: { value: PlatformType; label: string }[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram_reels", label: "Instagram Reels" },
  { value: "youtube_shorts", label: "YouTube Shorts" },
  { value: "youtube_long", label: "YouTube Long" },
  { value: "other", label: "Other" },
]

export function PlatformsMultiSelect({ value, onChange }: PlatformsMultiSelectProps) {
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

  const handleTogglePlatform = (platform: PlatformType) => {
    const newValue = value.includes(platform)
      ? value.filter((p) => p !== platform)
      : [...value, platform]
    onChange(newValue)
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleNativeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value as PlatformType)
    onChange(selected)
  }

  // Desktop version
  return (
    <>
      {/* Mobile: Native select */}
      <select
        multiple
        value={value}
        onChange={handleNativeSelectChange}
        className="md:hidden flex h-10 w-full rounded-lg border-2 border-solid border-gray-800 bg-white px-3 py-2 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {PLATFORMS.map((platform) => (
          <option key={platform.value} value={platform.value}>
            {platform.label}
          </option>
        ))}
      </select>

      {/* Desktop: Custom dropdown */}
      <div ref={containerRef} className="relative w-full hidden md:block">
        <button
          type="button"
          onClick={handleTriggerClick}
          className="flex h-10 w-full items-center justify-between rounded-lg border-2 border-solid border-gray-800 bg-white px-3 py-2 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-shadow"
        >
          <span className="truncate">
            {value.length === 0
              ? "Select platforms"
              : `${value.length} platform${value.length !== 1 ? "s" : ""}`}
          </span>
          <ChevronDown
            size={16}
            className={`flex-shrink-0 ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border-2 border-solid border-gray-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-2 p-2">
              {PLATFORMS.map((platform) => (
                <label
                  key={platform.value}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-yellow-50 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(platform.value)}
                    onChange={() => handleTogglePlatform(platform.value)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  />
                  <span className="text-sm font-medium">{platform.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
