import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
  BadgeCheck,
  CalendarDays,
  Clapperboard,
  LayoutGrid,
  PenSquare,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { Link } from "@/lib/i18n-navigation"
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

function formatDate(date: string | null) {
  if (!date) return "No deadline"

  return formatDistanceToNow(new Date(date), { addSuffix: true })
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
  const completedScenes = scenes.filter((scene) => scene.is_completed).length
  const totalScenes = scenes.length
  const completionRate = totalScenes ? Math.round((completedScenes / totalScenes) * 100) : 0

  const platformsText =
    project.platforms && project.platforms.length > 0
      ? project.platforms.map((platform) => platform.replace(/_/g, " ")).join(", ")
      : "No platforms selected"

  const infoCards = [
    { label: "Status", value: statusLabel[project.status], icon: BadgeCheck },
    { label: "Deadline", value: formatDate(project.deadline), icon: CalendarDays },
    { label: "Scenes", value: String(totalScenes), icon: LayoutGrid },
    { label: "Progress", value: `${completionRate}%`, icon: Clapperboard },
  ] as const

  return (
    <div className="space-y-8">
      <BackButton />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <span className="neo-pill w-fit bg-primary/70">
                  <Sparkles className="h-4 w-4" />
                  Project workspace
                </span>
                <div className="space-y-2">
                  <CardTitle className="text-3xl sm:text-4xl">{project.title}</CardTitle>
                  <CardDescription className="max-w-2xl text-base">
                    Edit the project, shape the story, and manage each scene in one place.
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-primary/70">{statusLabel[project.status]}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {infoCards.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold break-words">{item.value}</p>
                    </div>
                    <span className="inline-flex size-9 items-center justify-center rounded-full border-2 border-border bg-card">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Creator notes</CardTitle>
              <CardDescription>Quick overview for faster decisions.</CardDescription>
            </div>
            <Doodle variant="star" className="text-accent" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border-2 border-border bg-primary/15 px-4 py-4 shadow-neo-xs">
              <p className="text-sm font-semibold">Platforms</p>
              <p className="mt-1 text-sm text-muted-foreground">{platformsText}</p>
            </div>
            <div className="rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs">
              <p className="text-sm font-semibold">Description</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description ?? "No project description yet."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="#project-edit">Edit project</Link>
              </Button>
              <Button asChild>
                <Link href="#scene-board">Jump to scenes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="project-edit" className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-2">
            <span className="neo-pill w-fit bg-secondary/80">
              <PenSquare className="h-4 w-4" />
              Project editor
            </span>
            <CardTitle className="text-2xl">Update the brief</CardTitle>
            <CardDescription>
              Change title, description, status, platforms, or deadline anytime.
            </CardDescription>
          </CardHeader>
          <CardContent>
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

        <Card className="overflow-hidden">
          <CardHeader className="space-y-2">
            <span className="neo-pill w-fit bg-primary/70">
              <Clapperboard className="h-4 w-4" />
              Script workspace
            </span>
            <CardTitle className="text-2xl">Write the core script</CardTitle>
            <CardDescription>
              Keep the main storyline here, then open scenes below for smaller beats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SceneScriptWrapper projectId={project.id} scriptContent={script?.content ?? null} />
          </CardContent>
        </Card>
      </section>

      <section id="scene-board" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-heading font-semibold">Scene board</h2>
            <p className="text-sm text-muted-foreground">
              Add scenes, reorder them, and keep the production flow on track.
            </p>
          </div>
          <Badge className="bg-primary/70">
            {completedScenes}/{totalScenes || 0} done
          </Badge>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Scene list</CardTitle>
              <CardDescription>
                Tap a scene to expand it, or drag the handle to reorder.
              </CardDescription>
            </div>
            <Doodle variant="arrow" className="text-primary" />
          </CardHeader>
          <CardContent>
            {scenes.length ? (
              <SortableSceneList scenes={scenes} projectId={project.id} />
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-border bg-background px-4 py-8 text-center">
                <p className="font-semibold">No scenes yet.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add the first beat above and start building the sequence.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
