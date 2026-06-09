"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"

import { ScriptModal } from "./script-modal"
import { SceneForm } from "./scene-form"

interface SceneScriptWrapperProps {
  projectId: string
  scriptContent: string | null
}

export function SceneScriptWrapper({
  projectId,
  scriptContent,
}: SceneScriptWrapperProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-primary/10">
        <CardContent className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Doodle variant="sparkle" className="text-accent" />
              <p className="text-sm font-semibold">Main script</p>
            </div>
            <p className="max-h-32 overflow-y-auto pr-1 text-sm text-muted-foreground">
              {scriptContent?.trim()
                ? scriptContent
                : "No main script yet. Add the core narrative here, then break it into scenes."}
            </p>
          </div>
          <ScriptModal projectId={projectId} scriptContent={scriptContent} />
        </CardContent>
      </Card>

      <SceneForm projectId={projectId} />
    </div>
  )
}
