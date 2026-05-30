"use client"

import { useEffect, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FormMessage } from "@/components/forms/form-message"
import { upsertScript } from "./actions"

interface ScriptFormProps {
  projectId: string
  content: string | null
  onContentChange?: (content: string) => void
}

export function ScriptForm({ projectId, content, onContentChange }: ScriptFormProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState(content ?? "")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    setValue(content ?? "")
  }, [content])

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onContentChange?.(newValue)
  }

  const handleSaveScript = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.set("project_id", projectId)
      formData.set("content", value)
      
      const result = await upsertScript({ status: "idle" }, formData)
      
      if (result.status === "success") {
        setMessage({ type: "success", text: "Script saved! Now add scenes." })
        // Trigger onContentChange to update parent state
        onContentChange?.(value)
      } else {
        setMessage({ type: "error", text: result.message || "Failed to save script" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error saving script" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="content">Script</Label>
      <Textarea
        ref={internalRef}
        id="content"
        name="script_content"
        rows={8}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Write the hook, beats, and CTA..."
      />
      {message && (
        <FormMessage tone={message.type === "success" ? "success" : undefined}>
          {message.text}
        </FormMessage>
      )}
      <Button 
        onClick={handleSaveScript}
        disabled={isSaving || !value.trim()}
        size="lg"
        className="w-full"
      >
        {isSaving ? "Saving..." : "Save Script"}
      </Button>
    </div>
  )
}
