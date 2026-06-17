"use client"

import { useRouter } from "@/lib/i18n-navigation"
import { AiSceneGenerator } from "../../ai/ai-scene-generator"

interface ProjectSceneAiProps {
  projectId: string
  projectTitle: string
  projectDescription: string | null
}

export function ProjectSceneAi({
  projectId,
  projectTitle,
  projectDescription,
}: ProjectSceneAiProps) {
  const router = useRouter()

  return (
    <AiSceneGenerator
      projectId={projectId}
      projectTitle={projectTitle}
      projectDescription={projectDescription}
      onScenesAdded={() => router.refresh()}
    />
  )
}
