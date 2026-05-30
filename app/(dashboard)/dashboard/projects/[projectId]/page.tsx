import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

import { ProjectMetaForm } from "./project-meta-form"
import { SceneScriptWrapper } from "./scene-script-wrapper"
import { SortableSceneList } from "./scene-list-draggable"

const statusLabel: Record<string, string> = {
  idea: "Idea",
  scripting: "Scripting",
  shooting: "Shooting",
  editing: "Editing",
  posted: "Posted",
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const supabase = await getSupabaseServerClient()
  type ProjectWithRelations = Database["public"]["Tables"]["projects"]["Row"] & {
    scripts: { id: string; content: string | null }[] | null
    scenes: {
      id: string
      order_index: number
      title: string | null
      description: string | null
      duration_seconds: number | null
      script_content: string | null
      is_completed: boolean
    }[] | null
  }

  const { data } = await supabase
    .from("projects")
    .select(
      "id, title, description, status, platforms, deadline, posted_at, scripts(id, content), scenes(id, order_index, title, description, duration_seconds, script_content, is_completed)"
    )
    .eq("id", projectId)
    .single()

  const project = data as ProjectWithRelations | null

  if (!project) {
    notFound()
  }

  const script = project.scripts?.[0] ?? null
  const rawScenes = project.scenes ?? []
  const scenes = rawScenes.slice().sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="space-y-10">
      <BackButton />
      <Card className="!bg-yellow-100/60">
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{project.title}</CardTitle>
            <p className="text-sm text-muted-foreground">Project overview and status</p>
          </div>
          <Badge className="bg-primary/70">{statusLabel[project.status]}</Badge>
        </CardHeader>
        <CardContent className="!bg-yellow-200/60">
          <ProjectMetaForm
            projectId={project.id}
            title={project.title}
            description={project.description}
            status={project.status}
            platforms={project.platforms}
            deadline={project.deadline}
          />
        </CardContent>
      </Card>

      <Card className="!bg-orange-100/60">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Add scene</CardTitle>
          <Doodle variant="star" className="text-secondary" />
        </CardHeader>
        <CardContent className="!bg-orange-200/60">
          <SceneScriptWrapper projectId={project.id} scriptContent={script?.content ?? null} />
        </CardContent>
      </Card>

      <Card className="!bg-rose-100/60">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Scene list</CardTitle>
          <Doodle variant="arrow" className="text-primary" />
        </CardHeader>
        <CardContent className="!bg-rose-200/60">
          {scenes.length ? (
            <SortableSceneList
              scenes={scenes}
              projectId={project.id}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No scenes yet. Add the first beat above.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
