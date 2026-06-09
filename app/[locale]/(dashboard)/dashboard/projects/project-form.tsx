"use client"

import { useActionState, useState } from "react"

import { FormMessage } from "@/components/forms/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlatformsMultiSelect } from "@/components/ui/platforms-multi-select"
import type { PlatformType } from "@/lib/supabase/types"

import { type ProjectActionState, createProject } from "./actions"

const initialState: ProjectActionState = { status: "idle" }

export function ProjectForm() {
  const [state, formAction] = useActionState(createProject, initialState)
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([])

  return (
    <form className="space-y-4" action={formAction}>
      <input
        type="hidden"
        name="platforms"
        value={JSON.stringify(selectedPlatforms)}
      />
      <div className="space-y-2">
        <Label htmlFor="title">Project title</Label>
        <Input id="title" name="title" placeholder="Morning routine series" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Platforms</Label>
          <PlatformsMultiSelect
            value={selectedPlatforms}
            onChange={setSelectedPlatforms}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" name="deadline" type="date" />
        </div>
      </div>
      {state.status === "error" && state.message ? (
        <FormMessage>{state.message}</FormMessage>
      ) : null}
      {state.status === "success" && state.message ? (
        <FormMessage tone="success">{state.message}</FormMessage>
      ) : null}
      <Button size="lg" type="submit">
        Create project
      </Button>
    </form>
  )
}
