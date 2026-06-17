"use client"

import type { ComponentType } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  FolderKanban,
  GripVertical,
  PlayCircle,
  Rocket,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { Link, useRouter } from "@/lib/i18n-navigation"
import type { ProjectStatus } from "@/lib/supabase/types"

import { moveProjectStatus } from "./actions"
import { DateFilter } from "./date-filter"
import { ProjectForm } from "./project-form"

const statusMeta = {
  idea: { label: "Idea", icon: CircleDashed },
  scripting: { label: "Scripting", icon: FolderKanban },
  shooting: { label: "Shooting", icon: PlayCircle },
  editing: { label: "Editing", icon: CalendarDays },
  posted: { label: "Posted", icon: Rocket },
} as const satisfies Record<
  ProjectStatus,
  { label: string; icon: ComponentType<{ className?: string }> }
>

interface Project {
  id: string
  title: string
  status: ProjectStatus
  platforms: string[] | null
  deadline: string | null
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "No deadline"

  return formatDistanceToNow(new Date(deadline), { addSuffix: true })
}

function ProjectCard({
  project,
}: {
  project: Project
}) {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
    id: project.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          router.push(`/dashboard/projects/${project.id}`)
        }
      }}
      className="cursor-pointer rounded-2xl border border-border/30 bg-background px-4 py-4 shadow-neo-xs transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <button
              type="button"
              {...attributes}
              {...listeners}
              onClick={(event) => event.stopPropagation()}
              className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border/30 bg-card cursor-grab active:cursor-grabbing"
              aria-label={`Drag ${project.title}`}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-semibold break-words">{project.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {project.platforms && project.platforms.length > 0
                  ? project.platforms.map((platform) => platform.replace(/_/g, " ")).join(", ")
                  : "No platform yet"}
              </p>
            </div>
          </div>
        </div>
        <Badge className="bg-primary/70">{statusMeta[project.status].label}</Badge>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{formatDeadline(project.deadline)}</p>
    </div>
  )
}

function StatusColumn({
  status,
  items,
}: {
  status: ProjectStatus
  items: Project[]
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })
  const meta = statusMeta[status]
  const Icon = meta.icon

  return (
    <Card
      ref={setNodeRef}
      className={`min-h-[20rem] transition-colors ${
        isOver ? "border-primary bg-primary/10" : ""
      }`}
    >
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-full border-2 border-border bg-primary/70">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <CardTitle className="text-base">{meta.label}</CardTitle>
              <CardDescription>{items.length} project(s)</CardDescription>
            </div>
          </div>
          <Badge className="bg-primary/70">{items.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Drop a card here to move it into this stage.
        </p>
      </CardHeader>
      <CardContent className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
        {items.length ? (
          items.map((project) => <ProjectCard key={project.id} project={project} />)
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border bg-background px-4 py-6 text-center">
            <p className="text-sm font-semibold">No projects here yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Drag a project into this column to keep the pipeline visible.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ProjectsContent({ projects: initialProjects }: { projects: Project[] | null }) {
  const [filterDate, setFilterDate] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>(() => initialProjects ?? [])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (!filterDate) return true
      if (!project.deadline) return false

      const projectDate = new Date(project.deadline).toDateString()
      const selectedDate = new Date(filterDate).toDateString()

      return projectDate === selectedDate
    })
  }, [projects, filterDate])

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll, { passive: true })
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll, filteredProjects])

  const scrollTo = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.6
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }, [])

  const groupedProjects = useMemo(
    () =>
      (Object.keys(statusMeta) as ProjectStatus[]).map((status) => ({
        status,
        items: filteredProjects.filter((project) => project.status === status),
      })),
    [filteredProjects],
  )

  const stats = useMemo(
    () => [
      { label: "Total", value: filteredProjects.length },
      { label: "Idea", value: filteredProjects.filter((project) => project.status === "idea").length },
      { label: "Editing", value: filteredProjects.filter((project) => project.status === "editing").length },
      { label: "Posted", value: filteredProjects.filter((project) => project.status === "posted").length },
    ],
    [filteredProjects],
  )

  const dueSoon = useMemo(
    () =>
      [...filteredProjects]
        .filter((project) => project.deadline)
        .sort((a, b) => new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime())
        .slice(0, 3),
    [filteredProjects],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 8 },
    }),
  )

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return

    const targetStatus = over.id as ProjectStatus
    if (!(targetStatus in statusMeta)) return

    const projectId = String(active.id)
    const current = projects.find((project) => project.id === projectId)
    if (!current || current.status === targetStatus) return

    const snapshot = projects
    const nextProjects = projects.map((project) =>
      project.id === projectId ? { ...project, status: targetStatus } : project,
    )

    setProjects(nextProjects)

    const formData = new FormData()
    formData.set("project_id", projectId)
    formData.set("status", targetStatus)

    const result = await moveProjectStatus(formData)

    if (result.status === "error") {
      setProjects(snapshot)
      toast.error(result.message ?? "Could not move the project.")
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-4">
            <span className="neo-pill w-fit bg-primary/70">
              <FolderKanban className="h-4 w-4" />
              Projects board
            </span>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Shape ideas into a real production flow.</CardTitle>
              <CardDescription className="text-base">
                Create a project, set a deadline, and drag it through each stage without
                losing visibility.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
                >
                  <p className="text-2xl font-heading font-semibold">{stat.value}</p>
                  <p className="mt-1 text-sm font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border-2 border-border bg-primary/15 px-4 py-4 shadow-neo-xs">
              <p className="text-sm font-semibold">Best habit</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Give every project a clear next step: idea, script, shoot, edit, or posted.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <DateFilter
            onFilterChange={(date) => {
              setFilterDate(date)
            }}
          />

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Quick create</CardTitle>
                <CardDescription>Start a project from the current idea you want to ship.</CardDescription>
              </div>
              <Doodle variant="sparkle" className="text-accent" />
            </CardHeader>
            <CardContent>
              <ProjectForm />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-heading font-semibold">Project pipeline</h2>
            <p className="text-sm text-muted-foreground">
              Drag a project card into another column to update its stage.
            </p>
          </div>
          <Badge className="bg-primary/70">{filteredProjects.length} shown</Badge>
        </div>

        {dueSoon.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {dueSoon.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="rounded-2xl border-2 border-border bg-card px-4 py-4 text-left shadow-neo-xs transition-transform hover:-rotate-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold break-words">{project.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Due {formatDeadline(project.deadline)}
                    </p>
                  </div>
                  <Badge className="bg-secondary/80">
                    {statusMeta[project.status].label}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="relative">
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollTo("left")}
                className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full border-2 border-border bg-card shadow-neo-sm transition-all hover:bg-primary/20 hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollTo("right")}
                className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full border-2 border-border bg-card shadow-neo-sm transition-all hover:bg-primary/20 hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-2 pipeline-scroll"
            >
              {groupedProjects.map(({ status, items }) => (
                <div key={status} className="w-[18rem] min-w-[18rem] flex-shrink-0">
                  <StatusColumn status={status} items={items} />
                </div>
              ))}
            </div>
          </div>
        </DndContext>
      </section>
    </div>
  )
}
