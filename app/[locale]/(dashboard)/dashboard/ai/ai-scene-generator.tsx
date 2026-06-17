"use client"

import { useActionState, useState } from "react"
import { Sparkles, Plus, ChevronDown, ChevronUp } from "lucide-react"

import { FormMessage } from "@/components/forms/form-message"
import { AiLoadingOverlay } from "@/components/ui/ai-loading-overlay"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { type AiSceneState, generateScenesWithScripts } from "./actions"
import { createSceneWithScript } from "../projects/[projectId]/actions"
import { languages } from "./languages"

interface AiSceneGeneratorProps {
  projectId: string
  projectTitle: string
  projectDescription: string | null
  onScenesAdded: () => void
}

const styles = [
  { value: "", label: "Auto" },
  { value: "casual and conversational", label: "Casual" },
  { value: "energetic and hype", label: "Energetic" },
  { value: "calm and storytelling", label: "Storytelling" },
  { value: "funny and witty", label: "Funny" },
  { value: "educational and clear", label: "Educational" },
]

const initialState: AiSceneState = { status: "idle" }

export function AiSceneGenerator({
  projectId,
  projectTitle,
  projectDescription,
  onScenesAdded,
}: AiSceneGeneratorProps) {
  const [state, formAction] = useActionState(generateScenesWithScripts, initialState)
  const [isPending, setIsPending] = useState(false)
  const [addedCount, setAddedCount] = useState(0)
  const [expandedScene, setExpandedScene] = useState<number | null>(null)

  const handleGenerate = async (formData: FormData) => {
    setIsPending(true)
    setAddedCount(0)
    setExpandedScene(null)
    await formAction(formData)
    setIsPending(false)
  }

  const handleAddScene = async (scene: {
    title: string
    description: string
    duration: number
    script: string
  }) => {
    const fd = new FormData()
    fd.set("project_id", projectId)
    fd.set("title", scene.title)
    fd.set("description", scene.description)
    fd.set("duration_seconds", String(scene.duration))
    fd.set("script_content", scene.script)
    await createSceneWithScript({ status: "idle" }, fd)
    setAddedCount((c) => c + 1)
    onScenesAdded()
  }

  const handleAddAll = async () => {
    if (!state.scenes) return
    for (const scene of state.scenes) {
      await handleAddScene(scene)
    }
  }

  return (
    <div className="relative space-y-4">
      {isPending && <AiLoadingOverlay message="Generating scenes..." />}
      <form action={handleGenerate} className="space-y-4">
        <input type="hidden" name="title" value={projectTitle} />
        <input type="hidden" name="description" value={projectDescription ?? ""} />
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="scene-language">Language</Label>
            <select
              id="scene-language"
              name="language"
              defaultValue="English"
              className="flex h-10 w-full rounded-2xl border-2 border-border bg-background px-3 py-2 text-sm shadow-neo-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scene-style">Style</Label>
            <select
              id="scene-style"
              name="style"
              className="flex h-10 w-full rounded-2xl border-2 border-border bg-background px-3 py-2 text-sm shadow-neo-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {styles.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto" size="lg">
              {isPending ? (
                <span className="ai-btn-loading flex items-center gap-1.5 rounded-[inherit] px-2 py-0.5">
                  <Sparkles className="ai-wiggle h-4 w-4" />
                  <span className="ai-dot inline-block size-1.5 rounded-full bg-current" />
                  <span className="ai-dot inline-block size-1.5 rounded-full bg-current" />
                  <span className="ai-dot inline-block size-1.5 rounded-full bg-current" />
                </span>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Scenes & Scripts
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {state.status === "error" && state.message ? (
        <FormMessage>{state.message}</FormMessage>
      ) : null}

      {state.status === "success" && state.scenes ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {state.scenes.length} scenes with scripts generated
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddAll}
              disabled={addedCount >= state.scenes.length}
              className="min-h-10"
            >
              <Plus className="mr-1 h-3 w-3" />
              {addedCount >= state.scenes.length ? "All added" : "Add all to board"}
            </Button>
          </div>
          {state.scenes.map((scene, i) => {
            const isAdded = i < addedCount
            const isExpanded = expandedScene === i
            return (
              <div
                key={i}
                className="rounded-2xl border-2 border-border bg-background px-4 py-3 shadow-neo-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-6 items-center justify-center rounded-full border-2 border-border bg-primary/70 text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm font-semibold">{scene.title}</p>
                      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        ~{scene.duration}s
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{scene.description}</p>
                    {scene.script ? (
                      <button
                        type="button"
                        onClick={() => setExpandedScene(isExpanded ? null : i)}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3" /> Hide script
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" /> Show script
                          </>
                        )}
                      </button>
                    ) : null}
                  </div>
                  <Button
                    size="sm"
                    variant={isAdded ? "outline" : "default"}
                    onClick={() => handleAddScene(scene)}
                    disabled={isAdded}
                    className="shrink-0 min-h-9"
                  >
                    {isAdded ? "Added" : "Add"}
                  </Button>
                </div>
                {isExpanded && scene.script ? (
                  <div className="mt-3 rounded-xl border border-border bg-primary/5 px-3 py-2">
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                      {scene.script}
                    </p>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
