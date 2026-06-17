"use client"

import { useActionState, useState, useTransition } from "react"
import { Sparkles, Plus, Check, Zap } from "lucide-react"

import { FormMessage } from "@/components/forms/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  type AiActionState,
  generateIdeas,
  addAiIdea,
  addAllAiIdeas,
} from "./actions"
import { languages } from "./languages"

const platforms = [
  { value: "", label: "All platforms" },
  { value: "TikTok", label: "TikTok" },
  { value: "Instagram Reels", label: "Instagram Reels" },
  { value: "YouTube Shorts", label: "YouTube Shorts" },
  { value: "YouTube Long", label: "YouTube Long" },
]

const tones = [
  { value: "", label: "Any tone" },
  { value: "funny", label: "Funny" },
  { value: "educational", label: "Educational" },
  { value: "motivational", label: "Motivational" },
  { value: "dramatic", label: "Dramatic" },
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
]

const initialState: AiActionState = { status: "idle" }

export function AiIdeaGenerator() {
  const [state, formAction] = useActionState(generateIdeas, initialState)
  const [addedIdeas, setAddedIdeas] = useState<Set<number>>(new Set())
  const [allAdded, setAllAdded] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAddSingle = async (content: string, index: number) => {
    const result = await addAiIdea(content)
    if (result.status === "success") {
      setAddedIdeas((prev) => new Set(prev).add(index))
    }
  }

  const handleAddAll = async () => {
    if (!state.ideas) return
    startTransition(async () => {
      const result = await addAllAiIdeas(state.ideas!)
      if (result.status === "success") {
        setAllAdded(true)
        setAddedIdeas(new Set(state.ideas!.map((_, i) => i)))
      }
    })
  }

  return (
    <Card className="overflow-hidden border-accent/40">
      <CardHeader className="space-y-4">
        <span className="neo-pill w-fit bg-accent/20">
          <Sparkles className="h-4 w-4 text-accent" />
          AI Idea Generator
        </span>
        <div className="space-y-2">
          <CardTitle className="text-2xl">Stuck on ideas?</CardTitle>
          <CardDescription className="text-base">
            Enter a topic and let AI generate content ideas for you. Pick your favorites
            or add them all at once.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-topic">What&apos;s your topic?</Label>
            <Input
              id="ai-topic"
              name="topic"
              placeholder="e.g. productivity tips, cooking hacks, travel vlog..."
              required
              minLength={2}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ai-language">Language</Label>
              <select
                id="ai-language"
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
              <Label htmlFor="ai-platform">Platform</Label>
              <select
                id="ai-platform"
                name="platform"
                className="flex h-10 w-full rounded-2xl border-2 border-border bg-background px-3 py-2 text-sm shadow-neo-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {platforms.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-tone">Tone</Label>
              <select
                id="ai-tone"
                name="tone"
                className="flex h-10 w-full rounded-2xl border-2 border-border bg-background px-3 py-2 text-sm shadow-neo-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            size="lg"
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <span className="ai-btn-loading flex items-center gap-1.5 rounded-[inherit] px-2 py-0.5">
                <Sparkles className="ai-wiggle h-4 w-4" />
                <span className="ai-dot inline-block size-1.5 rounded-full bg-current" />
                <span className="ai-dot inline-block size-1.5 rounded-full bg-current" />
                <span className="ai-dot inline-block size-1.5 rounded-full bg-current" />
              </span>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generate Ideas
              </>
            )}
          </Button>
        </form>

        {state.status === "error" && state.message ? (
          <FormMessage>{state.message}</FormMessage>
        ) : null}

        {state.status === "success" && state.ideas ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                {state.ideas.length} ideas generated
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddAll}
                disabled={allAdded || isPending}
                className="min-h-10"
              >
                {allAdded ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    All added
                  </>
                ) : (
                  <>
                    <Plus className="mr-1 h-3 w-3" />
                    Add all to inbox
                  </>
                )}
              </Button>
            </div>
            {state.ideas.map((idea, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border-2 border-border bg-background px-4 py-3 shadow-neo-xs"
              >
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-border bg-primary/70 text-xs font-bold">
                  {i + 1}
                </span>
                <p className="min-w-0 flex-1 text-sm font-semibold break-words">{idea}</p>
                <Button
                  size="sm"
                  variant={addedIdeas.has(i) ? "outline" : "default"}
                  onClick={() => handleAddSingle(idea, i)}
                  disabled={addedIdeas.has(i) || isPending}
                  className="shrink-0 min-h-9"
                >
                  {addedIdeas.has(i) ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
