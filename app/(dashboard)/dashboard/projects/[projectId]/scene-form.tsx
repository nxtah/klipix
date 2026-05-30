"use client"

import { useActionState, useEffect } from "react"

import { FormMessage } from "@/components/forms/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { type DetailActionState, createSceneWithScript } from "./actions"

const initialState: DetailActionState = { status: "idle" }

interface SceneFormProps {
  projectId: string
  disabled?: boolean
}

export function SceneForm({ projectId, disabled = false }: SceneFormProps) {
  const [state, formAction] = useActionState(createSceneWithScript, initialState)

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => {
        window.location.reload()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [state.status])

  return (
    <form className="space-y-4" action={formAction}>
      <input type="hidden" name="project_id" value={projectId} />
      
      <div className="space-y-2">
        <Label htmlFor="title">Scene title</Label>
        <Input id="title" name="title" placeholder="Intro hook" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="script_content">Script for this scene</Label>
        <Textarea 
          id="script_content" 
          name="script_content" 
          rows={6}
          placeholder="Write the hook, beats, and CTA for this specific scene..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration_seconds">Duration (seconds)</Label>
        <Input id="duration_seconds" name="duration_seconds" type="number" min="0" />
      </div>

      {state.status === "error" && state.message ? (
        <FormMessage>{state.message}</FormMessage>
      ) : null}
      {state.status === "success" && state.message ? (
        <FormMessage tone="success">{state.message}</FormMessage>
      ) : null}

      <Button size="lg" type="submit" disabled={disabled}>
        Add scene
      </Button>
    </form>
  )
}
