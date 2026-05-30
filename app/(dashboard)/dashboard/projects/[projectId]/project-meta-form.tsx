"use client"

import { useActionState, useState } from "react"

import { FormMessage } from "@/components/forms/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlatformsMultiSelect } from "@/components/ui/platforms-multi-select"
import { StatusSelect } from "@/components/ui/status-select"
import type { PlatformType, ProjectStatus } from "@/lib/supabase/types"

import { type DetailActionState, updateProjectMeta } from "./actions"

const initialState: DetailActionState = { status: "idle" }

interface ProjectMetaFormProps {
  projectId: string
  title: string
  description: string | null
  status: ProjectStatus
  platforms: PlatformType[] | null
  deadline: string | null
}

export function ProjectMetaForm({
  projectId,
  title,
  description,
  status,
  platforms,
  deadline,
}: ProjectMetaFormProps) {
  const [state, formAction] = useActionState(updateProjectMeta, initialState)
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(platforms ?? [])
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(status)

  return (
    <form className="space-y-4" action={formAction}>
      <input type="hidden" name="project_id" value={projectId} />
      <input
        type="hidden"
        name="platforms"
        value={JSON.stringify(selectedPlatforms)}
      />
      <input type="hidden" name="status" value={selectedStatus} />
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={description ?? ""} />
      </div>
      <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <StatusSelect value={selectedStatus} onChange={setSelectedStatus} />
        </div>
        <div className="space-y-2">
          <Label>Platforms</Label>
          <PlatformsMultiSelect
            value={selectedPlatforms}
            onChange={setSelectedPlatforms}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" name="deadline" type="date" defaultValue={deadline ?? ""} />
        </div>
      </div>
      {state.status === "error" && state.message ? (
        <FormMessage>{state.message}</FormMessage>
      ) : null}
      {state.status === "success" && state.message ? (
        <FormMessage tone="success">{state.message}</FormMessage>
      ) : null}
      <Button size="lg" type="submit">
        Save project
      </Button>
    </form>
  )
}
