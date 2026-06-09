"use client"

import { useActionState } from "react"

import { FormMessage } from "@/components/forms/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { type IdeaActionState, createIdea } from "./actions"

const initialState: IdeaActionState = { status: "idle" }

export function IdeaForm() {
  const [state, formAction] = useActionState(createIdea, initialState)

  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-2">
        <Label htmlFor="content">Idea</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Type your hook, story angle, or trend..."
          rows={4}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reference_url">Reference URL (optional)</Label>
        <Input
          id="reference_url"
          name="reference_url"
          placeholder="https://example.com"
          type="url"
        />
      </div>
      {state.status === "error" && state.message ? (
        <FormMessage>{state.message}</FormMessage>
      ) : null}
      {state.status === "success" && state.message ? (
        <FormMessage tone="success">{state.message}</FormMessage>
      ) : null}
      <Button size="lg" type="submit">
        Add to inbox
      </Button>
    </form>
  )
}
