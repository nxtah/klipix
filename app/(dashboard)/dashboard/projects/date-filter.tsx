"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface DateFilterProps {
  onFilterChange: (date: string | null) => void
}

export function DateFilter({ onFilterChange }: DateFilterProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")

  const handleFilter = () => {
    onFilterChange(selectedDate || null)
  }

  const handleClear = () => {
    setSelectedDate("")
    onFilterChange(null)
  }

  return (
    <div className="space-y-3 rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs">
      <div className="space-y-2">
        <p className="text-sm font-semibold">Filter by deadline</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-xs">
          Select date
        </Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="neo-input text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={handleFilter} className="min-h-11">
          Apply filter
        </Button>
        {selectedDate && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleClear}
            className="gap-1 min-h-11"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
