"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FormMessage } from "@/components/forms/form-message"
import { upsertScript } from "./actions"

interface ScriptModalProps {
  projectId: string
  scriptContent: string | null
}

export function ScriptModal({ projectId, scriptContent }: ScriptModalProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState(scriptContent ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.set("project_id", projectId)
      formData.set("content", content)

      const result = await upsertScript({ status: "idle" }, formData)

      if (result.status === "error") {
        setError(result.message ?? "Failed to save script")
      } else if (result.status === "success") {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
        }, 1000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Script
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Script</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="script-content">Script Content</Label>
              <Textarea
                id="script-content"
                placeholder="Write your script here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="resize-none"
              />
            </div>
            {error && <FormMessage>{error}</FormMessage>}
            {success && (
              <FormMessage tone="success">Script saved successfully!</FormMessage>
            )}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Script"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
