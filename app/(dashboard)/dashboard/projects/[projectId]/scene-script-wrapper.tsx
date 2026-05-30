"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { SceneForm } from "./scene-form"

interface SceneScriptWrapperProps {
  projectId: string
  scriptContent: string | null
}

export function SceneScriptWrapper({ projectId }: SceneScriptWrapperProps) {
  return (
    <SceneForm projectId={projectId} />
  )
}
